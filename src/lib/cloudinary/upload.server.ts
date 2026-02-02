import { getCloudinary } from "./config.server";
import {
    UploadOptions,
    UploadResult,
    DeleteOptions,
} from "./types";
import { addVersionToUrl, extractPublicIdFromUrl } from "./utils";

// =====================================================
// CLOUDINARY UPLOAD - Core upload functions
// CHỈ SỬ DỤNG Ở SERVER
// =====================================================

/**
 * Upload file lên Cloudinary
 * @param fileData - Base64 data hoặc URL của file
 * @param options - Các tùy chọn upload
 */
export async function uploadToCloudinary(
    fileData: string,
    options: UploadOptions
): Promise<UploadResult> {
    const cloudinary = getCloudinary();

    const {
        folder,
        publicId,
        resourceType = "auto",
        overwrite = true,
        invalidate = true,
        transformation,
        tags,
        context,
    } = options;
    const newFolder = "khailingo/" + folder;

    // Cấu hình upload
    const uploadOptions: Record<string, unknown> = {
        folder: newFolder,
        resource_type: resourceType,
        overwrite,
        invalidate, // Quan trọng: invalidate CDN cache khi ghi đè
        unique_filename: !publicId, // Nếu có publicId thì không tạo unique filename
        ...(publicId && { public_id: publicId }),
        ...(transformation && { transformation }),
        ...(tags && { tags }),
        ...(context && { context }),
    };

    try {
        const result = await cloudinary.uploader.upload(fileData, uploadOptions);

        return {
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            duration: result.duration,
            createdAt: result.created_at,
            // Thêm version vào URL để bypass cache
            versionedUrl: addVersionToUrl(result.secure_url),
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}

/**
 * Upload và ghi đè file cũ
 * Xóa file cũ trước khi upload file mới (nếu cần)
 */
export async function uploadWithReplace(
    fileData: string,
    options: UploadOptions,
    oldUrl?: string
): Promise<UploadResult> {
    const cloudinary = getCloudinary();

    // Nếu có URL cũ và muốn xóa hoàn toàn (không chỉ ghi đè)
    if (oldUrl && !options.publicId) {
        const oldPublicId = extractPublicIdFromUrl(oldUrl);
        if (oldPublicId) {
            try {
                // Xóa file cũ
                await cloudinary.uploader.destroy(oldPublicId, {
                    resource_type: options.resourceType || "image",
                    invalidate: true,
                });
            } catch (error) {
                // Không throw error nếu xóa thất bại, tiếp tục upload
                console.warn("Failed to delete old file:", error);
            }
        }
    }

    // Upload file mới
    return uploadToCloudinary(fileData, {
        ...options,
        overwrite: true,
        invalidate: true,
    });
}

/**
 * Xóa file trên Cloudinary
 */
export async function deleteFromCloudinary(
    options: DeleteOptions
): Promise<{ success: boolean; result?: string }> {
    const cloudinary = getCloudinary();

    const { publicId, resourceType = "image", invalidate = true } = options;

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate,
        });

        return {
            success: result.result === "ok",
            result: result.result,
        };
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
}

/**
 * Upload nhiều file cùng lúc
 */
export async function uploadMultipleToCloudinary(
    files: Array<{ fileData: string; options: UploadOptions }>
): Promise<UploadResult[]> {
    const uploadPromises = files.map(({ fileData, options }) =>
        uploadToCloudinary(fileData, options)
    );

    return Promise.all(uploadPromises);
}

/**
 * Tạo transformation cho image
 */
export function createImageTransformation(options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb";
    quality?: number | "auto";
    format?: "auto" | "webp" | "jpg" | "png";
}) {
    return [
        {
            ...(options.width && { width: options.width }),
            ...(options.height && { height: options.height }),
            ...(options.crop && { crop: options.crop }),
            ...(options.quality && { quality: options.quality }),
            ...(options.format && { fetch_format: options.format }),
        },
    ];
}

/**
 * Tạo transformation cho video
 */
export function createVideoTransformation(options: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "mp4" | "webm";
}) {
    return [
        {
            ...(options.width && { width: options.width }),
            ...(options.height && { height: options.height }),
            ...(options.quality && { quality: options.quality }),
            ...(options.format && { fetch_format: options.format }),
        },
    ];
}