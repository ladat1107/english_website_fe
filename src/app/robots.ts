import envConfig from "@/utils/env-config";
import { MetadataRoute } from "next";

// File này giúp Google biết được trang nào được phép crawl
export default function robots(): MetadataRoute.Robots {
    const baseUrl = envConfig.NEXT_PUBLIC_FRONTEND_URL;
    return {
        rules: {
            userAgent: "*", // Cho phép tất cả bot truy cập
            allow: "/",     // Mọi trang đều được crawl
            disallow: ["/quan-ly/*"], // Nhưng không cho phép crawl các trang nhạy cảm
        },
        sitemap: `${baseUrl}/sitemap.xml`, // Nói Google sitemap nằm ở đâu
    };
}