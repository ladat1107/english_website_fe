import {
    CloudinaryFolder,
    UploadResult,
    UploadResponse,
    DeleteResponse,
    CloudinaryResourceType,
    fileToBase64,
    validateFileSize,
    validateFileType,
} from "@/lib/cloudinary";

// =====================================================
// UPLOAD SERVICE - Gọi API upload từ client
// =====================================================

/**
 * Service class để quản lý upload
 */
class UploadService {
    private baseUrl = "/api/upload";

    /**
     * Upload file chung
     */
    async uploadFile(
        file: File,
        options: {
            folder: CloudinaryFolder | string;
            publicId?: string;
            oldUrl?: string;
            resourceType?: CloudinaryResourceType;
        }
    ): Promise<UploadResult> {
        const base64 = await fileToBase64(file);

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file: base64,
                fileName: file.name,
                options: {
                    folder: options.folder,
                    publicId: options.publicId,
                    resourceType: options.resourceType,
                    overwrite: true,
                    invalidate: true,
                },
                oldUrl: options.oldUrl,
            }),
        });

        const result: UploadResponse = await response.json();

        if (!result.success || !result.data) {
            throw new Error(result.error || "Upload thất bại");
        }

        return result.data;
    }

    /**
     * Upload video
     */
    async uploadVideo(
        file: File,
        options: {
            folder?: CloudinaryFolder | string;
            publicId?: string;
            oldUrl?: string;
            optimize?: boolean;
            onProgress?: (progress: number) => void;
        } = {}
    ): Promise<UploadResult> {
        // Validate file size (max 500MB cho video)
        const sizeValidation = validateFileSize(file.size, 500);
        if (!sizeValidation.valid) {
            throw new Error(sizeValidation.message);
        }

        // Validate file type
        const typeValidation = validateFileType(file.type, ["video/*"]);
        if (!typeValidation.valid) {
            throw new Error(typeValidation.message);
        }

        const base64 = await fileToBase64(file);

        const response = await fetch(`${this.baseUrl}/video`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file: base64,
                fileName: file.name,
                folder: options.folder || CloudinaryFolder.SPEAKING_VIDEOS,
                publicId: options.publicId,
                oldUrl: options.oldUrl,
                optimize: options.optimize ?? true,
            }),
        });

        const result: UploadResponse = await response.json();

        if (!result.success || !result.data) {
            throw new Error(result.error || "Upload video thất bại");
        }

        return result.data;
    }

    /**
     * Upload ảnh
     */
    async uploadImage(
        file: File,
        options: {
            folder?: CloudinaryFolder | string;
            publicId?: string;
            oldUrl?: string;
            width?: number;
            height?: number;
            optimize?: boolean;
        } = {}
    ): Promise<UploadResult> {
        // Validate file size (max 20MB cho ảnh)
        const sizeValidation = validateFileSize(file.size, 20);
        if (!sizeValidation.valid) {
            throw new Error(sizeValidation.message);
        }

        // Validate file type
        const typeValidation = validateFileType(file.type, ["image/*"]);
        if (!typeValidation.valid) {
            throw new Error(typeValidation.message);
        }

        const base64 = await fileToBase64(file);

        const response = await fetch(`${this.baseUrl}/image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file: base64,
                fileName: file.name,
                folder: options.folder || CloudinaryFolder.GENERAL_IMAGES,
                publicId: options.publicId,
                oldUrl: options.oldUrl,
                width: options.width,
                height: options.height,
                optimize: options.optimize ?? true,
            }),
        });

        const result: UploadResponse = await response.json();

        if (!result.success || !result.data) {
            throw new Error(result.error || "Upload ảnh thất bại");
        }

        return result.data;
    }

    /**
     * Upload audio (ghi âm)
     */
    async uploadAudio(
        file: File | Blob,
        options: {
            folder?: CloudinaryFolder | string;
            publicId?: string;
            oldUrl?: string;
            fileName?: string;
        } = {}
    ): Promise<UploadResult> {
        // Convert Blob to File if needed
        const audioFile =
            file instanceof File
                ? file
                : new File([file], options.fileName || `recording_${Date.now()}.webm`, {
                      type: file.type,
                  });

        // Validate file size (max 50MB cho audio)
        const sizeValidation = validateFileSize(audioFile.size, 50);
        if (!sizeValidation.valid) {
            throw new Error(sizeValidation.message);
        }

        const base64 = await fileToBase64(audioFile);

        const response = await fetch(`${this.baseUrl}/audio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file: base64,
                fileName: audioFile.name,
                folder: options.folder || CloudinaryFolder.USER_RECORDINGS,
                publicId: options.publicId,
                oldUrl: options.oldUrl,
            }),
        });

        const result: UploadResponse = await response.json();

        if (!result.success || !result.data) {
            throw new Error(result.error || "Upload audio thất bại");
        }

        return result.data;
    }

    /**
     * Upload nhiều file cùng lúc
     */
    async uploadMultiple(
        files: File[],
        options: {
            folder: CloudinaryFolder | string;
            resourceType?: CloudinaryResourceType;
        }
    ): Promise<UploadResult[]> {
        const uploadPromises = files.map((file) =>
            this.uploadFile(file, {
                folder: options.folder,
                resourceType: options.resourceType,
            })
        );

        return Promise.all(uploadPromises);
    }

    /**
     * Xóa file
     */
    async deleteFile(
        publicId: string,
        resourceType: CloudinaryResourceType = "image"
    ): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                publicId,
                resourceType,
                invalidate: true,
            }),
        });

        const result: DeleteResponse = await response.json();
        return result.success;
    }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;