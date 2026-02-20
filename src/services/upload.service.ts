import {
    CloudinaryFolder,
    UploadResult,
    CloudinaryResourceType,
    validateFileSize,
    validateFileType,
} from "@/lib/cloudinary";
import {
    uploadImageClient,
    uploadVideoClient,
    uploadAudioClient,
    uploadMultipleClient,
    deleteFromCloudinaryClient,
} from "@/lib/cloudinary/upload.client";

// =====================================================
// UPLOAD SERVICE - Quản lý upload từ client
// Upload trực tiếp lên Cloudinary (chỉ xin chữ ký từ server)
// =====================================================

/**
 * Service class để quản lý upload
 */
class UploadService {
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
            generateThumbnail?: boolean;
            thumbnailTransformation?: string;
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

        // Upload trực tiếp từ client
        return uploadVideoClient(file, {
            folder: options.folder || CloudinaryFolder.SPEAKING_VIDEOS,
            publicId: options.publicId,
            oldUrl: options.oldUrl,
            optimize: options.optimize ?? true,
            onProgress: options.onProgress,
            generateThumbnail: options.generateThumbnail,
            thumbnailTransformation: options.thumbnailTransformation,
        });
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
            onProgress?: (progress: number) => void;
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

        // Upload trực tiếp từ client
        return uploadImageClient(file, {
            folder: options.folder || CloudinaryFolder.GENERAL_IMAGES,
            publicId: options.publicId,
            oldUrl: options.oldUrl,
            width: options.width,
            height: options.height,
            optimize: options.optimize ?? true,
            onProgress: options.onProgress,
        });
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
            onProgress?: (progress: number) => void;
        } = {}
    ): Promise<UploadResult> {
        // Convert Blob to File nếu cần
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

        // Upload trực tiếp từ client
        return uploadAudioClient(audioFile, {
            folder: options.folder || CloudinaryFolder.USER_RECORDINGS,
            publicId: options.publicId,
            oldUrl: options.oldUrl,
            fileName: options.fileName,
            onProgress: options.onProgress,
        });
    }

    /**
     * Upload nhiều file cùng lúc
     */
    async uploadMultiple(
        files: File[],
        options: {
            folder: CloudinaryFolder | string;
            resourceType?: CloudinaryResourceType;
            onProgress?: (fileIndex: number, progress: number) => void;
        }
    ): Promise<UploadResult[]> {
        return uploadMultipleClient(files, {
            folder: options.folder,
            resourceType: options.resourceType,
            onProgress: options.onProgress,
        });
    }

    /**
     * Xóa file
     */
    async deleteFile(
        publicId: string,
        resourceType: CloudinaryResourceType = "image"
    ): Promise<boolean> {
        return deleteFromCloudinaryClient(publicId, resourceType);
    }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;