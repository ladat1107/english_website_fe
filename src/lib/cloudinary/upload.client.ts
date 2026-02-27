import {
    CloudinaryFolder,
    CloudinaryResourceType,
    ClientUploadOptions,
    SignatureData,
    SignatureResponse,
    UploadResult,
    CloudinaryUploadResponse,
} from "./types";
import { addVersionToUrl } from "./utils";

// =====================================================
// CLOUDINARY UPLOAD CLIENT
// Upload trực tiếp từ client lên Cloudinary
// =====================================================

// Eager transformation mặc định cho video thumbnail
const DEFAULT_VIDEO_THUMBNAIL_EAGER = "c_thumb,w_400,h_300,g_auto/jpg";


/**
 * Lấy chữ ký từ server để upload
 */
async function getUploadSignature(options: {
    folder: CloudinaryFolder | string;
    publicId?: string;
    resourceType?: CloudinaryResourceType;
    tags?: string[];
    eager?: string;
}): Promise<SignatureData> {
    const response = await fetch("/api/upload/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            folder: options.folder,
            publicId: options.publicId,
            resourceType: options.resourceType || "auto",
            tags: options.tags || [],
            eager: options.eager,
        }),
    });

    const result: SignatureResponse = await response.json();

    if (!result.success || !result.data) {
        throw new Error(result.error || "Không thể lấy chữ ký upload");
    }

    return result.data;
}

/**
 * Upload file trực tiếp lên Cloudinary từ client
 */
export async function uploadToCloudinaryClient(
    file: File | Blob,
    options: ClientUploadOptions
): Promise<UploadResult> {
    const {
        folder,
        publicId,
        resourceType = "auto",
        tags = [],
        onProgress,
        transformation,
        eager,
    } = options;

    // Bước 1: Lấy chữ ký từ server
    const signatureData = await getUploadSignature({
        folder,
        publicId,
        resourceType,
        tags,
        eager,
    });

    // Bước 2: Chuẩn bị form data để upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signatureData.signature);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("api_key", signatureData.apiKey);
    formData.append("folder", signatureData.folder);

    if (signatureData.publicId) {
        formData.append("public_id", signatureData.publicId);
    }

    if (tags.length > 0) {
        formData.append("tags", tags.join(","));
    }
    // Thêm eager transformation nếu có (cho video thumbnail)
    if (signatureData.eager) {
        formData.append("eager", signatureData.eager);
    }

    // Thêm transformation nếu có (cho image)
    if (transformation) {
        const transformStr = Object.entries(transformation)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}_${value}`)
            .join(",");
        if (transformStr) {
            formData.append("transformation", transformStr);
        }
    }

    // Bước 3: Upload trực tiếp lên Cloudinary với XMLHttpRequest để theo dõi progress
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Xác định resource type cho URL
        const uploadResourceType = resourceType === "auto" ? "auto" : resourceType;
        const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${uploadResourceType}/upload`;

        xhr.open("POST", uploadUrl);

        // Theo dõi tiến trình upload
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        };

        // Xử lý kết quả
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);

                    if (response.error) {
                        reject(new Error(response.error.message));
                        return;
                    }
                    const thumbnailUrl = response.eager?.[0]?.secure_url;

                    const result: UploadResult = {
                        url: response.url,
                        secureUrl: response.secure_url,
                        publicId: response.public_id,
                        resourceType: response.resource_type,
                        format: response.format,
                        bytes: response.bytes,
                        width: response.width,
                        height: response.height,
                        duration: response.duration,
                        createdAt: response.created_at,
                        versionedUrl: addVersionToUrl(response.secure_url),
                        thumbnailUrl,
                    };

                    resolve(result);
                } catch (error) {
                    reject(new Error("Không thể parse response từ Cloudinary"));
                    console.error("Error parsing Cloudinary response:", error);
                }
            } else {
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    reject(new Error(errorResponse.error?.message || "Upload thất bại"));
                } catch {
                    reject(new Error(`Upload thất bại với status: ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            reject(new Error("Lỗi kết nối khi upload"));
        };

        xhr.send(formData);
    });
}

/**
 * Upload và thay thế file cũ
 * Lưu ý: Với client-side upload, việc xóa file cũ cần được xử lý riêng
 */
export async function uploadWithReplaceClient(
    file: File | Blob,
    options: ClientUploadOptions
): Promise<UploadResult> {
    // Upload file mới
    // Lưu ý: Nếu muốn xóa file cũ, cần gọi API delete riêng từ backend
    // hoặc sử dụng cùng publicId để Cloudinary tự động ghi đè
    return uploadToCloudinaryClient(file, options);
}

/**
 * Upload image với các tùy chọn tối ưu
 */
export async function uploadImageClient(
    file: File,
    options: {
        folder?: CloudinaryFolder | string;
        publicId?: string;
        oldUrl?: string;
        width?: number;
        height?: number;
        optimize?: boolean;
        onProgress?: (progress: number) => void;
    } = {}
): Promise<UploadResult> {
    const {
        folder = CloudinaryFolder.GENERAL_IMAGES,
        publicId,
        onProgress,
    } = options;

    return uploadToCloudinaryClient(file, {
        folder,
        publicId,
        resourceType: "image",
        tags: ["image"],
        onProgress,
    });
}

/**
 * Upload video với các tùy chọn tối ưu
 */
export async function uploadVideoClient(
    file: File,
    options: {
        folder?: CloudinaryFolder | string;
        publicId?: string;
        oldUrl?: string;
        optimize?: boolean;
        onProgress?: (progress: number) => void;
        generateThumbnail?: boolean;
        thumbnailTransformation?: string;
    } = {}
): Promise<UploadResult> {
    const {
        folder = CloudinaryFolder.OTHER_VIDEOS,
        publicId,
        onProgress,
        generateThumbnail = true,
        thumbnailTransformation = DEFAULT_VIDEO_THUMBNAIL_EAGER,
    } = options;


    return uploadToCloudinaryClient(file, {
        folder,
        publicId,
        resourceType: "video",
        tags: ["video", "speaking"],
        onProgress,
        eager: generateThumbnail ? thumbnailTransformation : undefined,
    });
}

/**
 * Upload audio (Cloudinary xử lý audio như video)
 */
export async function uploadAudioClient(
    file: File | Blob,
    options: {
        folder?: CloudinaryFolder | string;
        publicId?: string;
        oldUrl?: string;
        fileName?: string;
        onProgress?: (progress: number) => void;
    } = {}
): Promise<UploadResult> {
    const {
        folder = CloudinaryFolder.USER_RECORDINGS,
        publicId,
        onProgress,
    } = options;

    return uploadToCloudinaryClient(file, {
        folder,
        publicId,
        resourceType: "video", // Cloudinary xử lý audio như video
        tags: ["audio", "recording"],
        onProgress,
    });
}

/**
 * Upload nhiều file cùng lúc
 */
export async function uploadMultipleClient(
    files: File[],
    options: {
        folder: CloudinaryFolder | string;
        resourceType?: CloudinaryResourceType;
        onProgress?: (fileIndex: number, progress: number) => void;
    }
): Promise<UploadResult[]> {
    const { folder, resourceType = "auto", onProgress } = options;

    const uploadPromises = files.map((file, index) =>
        uploadToCloudinaryClient(file, {
            folder,
            resourceType,
            onProgress: (progress) => onProgress?.(index, progress),
        })
    );

    return Promise.all(uploadPromises);
}

/**
 * Xóa file trên Cloudinary thông qua server
 * Lưu ý: Xóa file cần API secret nên phải qua server
 */
export async function deleteFromCloudinaryClient(
    publicId: string,
    resourceType: CloudinaryResourceType = "image"
): Promise<boolean> {
    const response = await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            publicId,
            resourceType,
            invalidate: true,
        }),
    });

    const result = await response.json();
    return result.success;
}