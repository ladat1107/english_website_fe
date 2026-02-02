// =====================================================
// CLOUDINARY TYPES - Định nghĩa các kiểu dữ liệu
// =====================================================

/**
 * Loại resource được upload lên Cloudinary
 */
export type CloudinaryResourceType = "image" | "video" | "raw" | "auto";

/**
 * Các folder được định nghĩa sẵn để tổ chức file
 */
export enum CloudinaryFolder {
    // Speaking module
    SPEAKING_VIDEOS = "english_website/speaking/videos",
    SPEAKING_THUMBNAILS = "english_website/speaking/thumbnails",
    SPEAKING_AUDIO = "english_website/speaking/audio",

    // Listening module
    LISTENING_AUDIO = "english_website/listening/audio",
    LISTENING_IMAGES = "english_website/listening/images",

    // Reading module
    READING_IMAGES = "english_website/reading/images",

    // Writing module
    WRITING_IMAGES = "english_website/writing/images",

    // User content
    USER_AVATARS = "english_website/users/avatars",
    USER_RECORDINGS = "english_website/users/recordings",

    // General
    GENERAL_IMAGES = "english_website/general/images",
    GENERAL_FILES = "english_website/general/files",
}


/**
 * Options cho việc upload
 */
export interface UploadOptions {
    // Folder lưu trữ trên Cloudinary
    folder: CloudinaryFolder | string;

    // Public ID tùy chỉnh (dùng để ghi đè file cũ)
    publicId?: string;

    // Loại resource
    resourceType?: CloudinaryResourceType;

    // Có ghi đè file cũ không
    overwrite?: boolean;

    // Có invalidate CDN cache không (quan trọng khi ghi đè)
    invalidate?: boolean;

    // Transformation khi upload (resize, format, ...)
    transformation?: Record<string, unknown>[];

    // Tags để dễ quản lý
    tags?: string[];

    // Context metadata
    context?: Record<string, string>;
}

/**
 * Kết quả trả về sau khi upload thành công
 */
export interface UploadResult {
    // URL công khai của file
    url: string;

    // URL bảo mật (https)
    secureUrl: string;

    // Public ID trên Cloudinary
    publicId: string;

    // Loại resource
    resourceType: string;

    // Format file
    format: string;

    // Kích thước file (bytes)
    bytes: number;

    // Chiều rộng (cho image/video)
    width?: number;

    // Chiều cao (cho image/video)
    height?: number;

    // Thời lượng (cho video/audio)
    duration?: number;

    // Thời gian tạo
    createdAt: string;

    // URL với version để bypass cache
    versionedUrl: string;
}

/**
 * Request body gửi lên API upload
 */
export interface UploadRequest {
    // File data dạng base64
    file: string;

    // Tên file gốc
    fileName: string;

    // Options upload
    options: UploadOptions;
}

/**
 * Response từ API upload
 */
export interface UploadResponse {
    success: boolean;
    data?: UploadResult;
    error?: string;
}

/**
 * Options cho việc xóa file
 */
export interface DeleteOptions {
    publicId: string;
    resourceType?: CloudinaryResourceType;
    invalidate?: boolean;
}

/**
 * Response từ API delete
 */
export interface DeleteResponse {
    success: boolean;
    result?: string;
    error?: string;
}