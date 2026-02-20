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
    SPEAKING_VIDEOS = "speaking/videos",
    SPEAKING_THUMBNAILS = "speaking/thumbnails",
    SPEAKING_AUDIO = "speaking/audio",

    // Listening module
    LISTENING_AUDIO = "listening/audio",
    LISTENING_IMAGES = "listening/images",

    // Reading module
    READING_IMAGES = "reading/images",
    // Writing module
    WRITING_IMAGES = "writing/images",

    // User content
    USER_AVATARS = "users/avatars",
    USER_RECORDINGS = "users/recordings",

    // General
    GENERAL_IMAGES = "general/images",
    GENERAL_FILES = "general/files",

    // default
    OTHER_VIDEOS = "other/videos",
    OTHER_IMAGES = "other/images",
    OTHER_FILES = "other/files",
    OTHER_VOICE = "other/voice",
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

    thumbnailUrl?: string;
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

export interface SignatureData {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
    publicId?: string;
    resourceType: CloudinaryResourceType;
    tags: string[];
    eager?: string;
}

/**
 * Response từ API signature
 */
export interface SignatureResponse {
    success: boolean;
    data?: SignatureData;
    error?: string;
}

/**
 * Request body để xin chữ ký
 */
export interface SignatureRequest {
    folder: CloudinaryFolder | string;
    publicId?: string;
    resourceType?: CloudinaryResourceType;
    tags?: string[];
    transformation?: string;
    eager?: string;
}

/**
 * Options cho upload phía client
 */
export interface ClientUploadOptions {
    // Folder lưu trữ
    folder: CloudinaryFolder | string;

    // Public ID tùy chỉnh
    publicId?: string;

    // Loại resource
    resourceType?: CloudinaryResourceType;

    // Tags
    tags?: string[];

    // URL cũ cần xóa (nếu thay thế)
    oldUrl?: string;

    // Callback theo dõi tiến trình upload
    onProgress?: (progress: number) => void;

    // Transformation (cho image)
    transformation?: {
        w?: number;
        h?: number;
        c?: string;
        q?: string | number;
        f?: string;
    };
    // Eager transformation để tạo thumbnail
    eager?: string;
}

/**
 * Response từ Cloudinary khi upload trực tiếp
 */
export interface CloudinaryUploadResponse {
    public_id: string;
    version: number;
    signature: string;
    width?: number;
    height?: number;
    format: string;
    resource_type: string;
    created_at: string;
    bytes: number;
    type: string;
    url: string;
    secure_url: string;
    duration?: number;
    // eager là trả về kết quả có thumbnail nếu có cấu hình
    eager?: Array<{
        transformation: string;
        width: number;
        height: number;
        bytes: number;
        format: string;
        url: string;
        secure_url: string;
    }>;
    error?: {
        message: string;
    };
}