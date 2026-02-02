import { CloudinaryResourceType } from "./types";

// =====================================================
// CLOUDINARY UTILS - Các hàm tiện ích
// =====================================================

/**
 * Tạo public_id unique dựa trên timestamp và random string
 */
export function generatePublicId(prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Xác định resource type dựa trên mime type của file
 */
export function getResourceTypeFromMime(mimeType: string): CloudinaryResourceType {
    if (mimeType.startsWith("image/")) {
        return "image";
    }
    if (mimeType.startsWith("video/")) {
        return "video";
    }
    if (mimeType.startsWith("audio/")) {
        return "video"; // Cloudinary xử lý audio như video
    }
    return "raw"; // Các file khác (pdf, doc, ...)
}

/**
 * Xác định resource type dựa trên extension
 */
export function getResourceTypeFromExtension(fileName: string): CloudinaryResourceType {
    const ext = fileName.split(".").pop()?.toLowerCase();

    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"];
    const videoExts = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"];
    const audioExts = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];

    if (ext && imageExts.includes(ext)) return "image";
    if (ext && videoExts.includes(ext)) return "video";
    if (ext && audioExts.includes(ext)) return "video";

    return "raw";
}

/**
 * Tạo URL với version để bypass CDN cache
 */
export function addVersionToUrl(url: string): string {
    const timestamp = Date.now();
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${timestamp}`;
}

/**
 * Trích xuất public_id từ Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
    try {
        // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
        const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

/**
 * Validate file size (bytes)
 */
export function validateFileSize(
    size: number,
    maxSizeMB: number
): { valid: boolean; message?: string } {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (size > maxBytes) {
        return {
            valid: false,
            message: `File vượt quá giới hạn ${maxSizeMB}MB`,
        };
    }
    return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
    mimeType: string,
    allowedTypes: string[]
): { valid: boolean; message?: string } {
    // Kiểm tra exact match hoặc wildcard (image/*, video/*, ...)
    const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
            const category = type.replace("/*", "");
            return mimeType.startsWith(category);
        }
        return mimeType === type;
    });

    if (!isAllowed) {
        return {
            valid: false,
            message: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(", ")}`,
        };
    }

    return { valid: true };
}

/**
 * Convert File sang base64
 */
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}