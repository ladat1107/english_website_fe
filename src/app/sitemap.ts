import envConfig from "@/utils/env-config";
import { MetadataRoute } from "next";

// Hàm này tự động được Next.js gọi khi build
// và nó sẽ tạo ra file sitemap.xml chuẩn SEO
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = envConfig.NEXT_PUBLIC_FRONTEND_URL; // Đổi thành URL của bạn
    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(), // Google biết ngày cập nhật
            changeFrequency: "daily", // Gợi ý Google crawl mỗi ngày
            priority: 1.0, // Trang chủ ưu tiên cao nhất
        },
        {
            url: `${baseUrl}/chinh-sach-bao-mat`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/dieu-khoan-su-dung`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gioi-thieu`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        }
    ];
}