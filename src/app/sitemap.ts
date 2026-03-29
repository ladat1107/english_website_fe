import envConfig from "@/utils/env-config";
import { MetadataRoute } from "next";

// Hàm này tự động được Next.js gọi khi build
// và nó sẽ tạo ra file sitemap.xml chuẩn SEO
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = envConfig.NEXT_PUBLIC_FRONTEND_URL; // Đổi thành URL của bạn

    // ===== Fetch dynamic slugs =====
    // const [blogSlugs, speakSlugs] = await Promise.all([
    //     fetch(`${envConfig.NEXT_PUBLIC_API_URL}/blog/slugs`).then(res => res.json()),
    //     fetch(`${envConfig.NEXT_PUBLIC_API_URL}/luyen-noi/slugs`).then(res => res.json()),
    // ]);

    const staticUrls: MetadataRoute.Sitemap = [
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

    // ===== Dynamic blog detail pages =====
    // const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((item: any) => ({
    //     url: `${baseUrl}/blog/${item.slug}`,
    //     lastModified: item.updatedAt,
    //     changeFrequency: "weekly",
    //     priority: 0.8,
    // }));

    // ===== Dynamic luyen-noi detail pages =====
    // const speakUrls: MetadataRoute.Sitemap = speakSlugs.map((item: any) => ({
    //     url: `${baseUrl}/luyen-noi/${item.slug}`,
    //     lastModified: item.updatedAt,
    //     changeFrequency: "weekly",
    //     priority: 0.8,
    // }));

    // ===== Return merged sitemap =====
    //return [...staticUrls, ...blogUrls, ...speakUrls];
    return [...staticUrls];
}