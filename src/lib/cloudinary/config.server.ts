import envConfig from "@/utils/env-config";
import { v2 as cloudinary } from "cloudinary";

// =====================================================
// CLOUDINARY CONFIG - Cấu hình Cloudinary SDK
// =====================================================

/**
 * Khởi tạo cấu hình Cloudinary
 * CHỈ SỬ DỤNG Ở SERVER (API Routes, Server Components)
 */
export function initCloudinary() {
    cloudinary.config({
        cloud_name: envConfig.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: envConfig.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: envConfig.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
        secure: true, // Luôn sử dụng HTTPS
    });

    return cloudinary;
}

/**
 * Lấy instance Cloudinary đã được cấu hình
 */
export function getCloudinary() {
    return initCloudinary();
}

export default cloudinary;