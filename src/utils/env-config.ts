import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_BACKEND_URL: z.string(),
    NEXT_PUBLIC_FRONTEND_URL: z.string(),
    NEXT_PUBLIC_SOCKET_URL: z.string(),

    // Cloudinary config
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().nonempty(),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().nonempty(),
    NEXT_PUBLIC_CLOUDINARY_API_SECRET: z.string().nonempty(),

    NEXT_PUBLIC_FACEBOOK_URL: z.string().nonempty(),
    NEXT_PUBLIC_INSTAGRAM_URL: z.string().nonempty(),
    NEXT_PUBLIC_ZALO_GROUP_URL: z.string().nonempty(),
    NEXT_PUBLIC_ZALO_URL: z.string().nonempty(),
    NEXT_PUBLIC_TIKTOK_URL: z.string().nonempty(),
    NEXT_PUBLIC_YOUTUBE_URL: z.string().nonempty(),

});

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,

    // Cloudinary config
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_API_SECRET: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,

    // Social media URLs
    NEXT_PUBLIC_FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    NEXT_PUBLIC_INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    NEXT_PUBLIC_ZALO_GROUP_URL: process.env.NEXT_PUBLIC_ZALO_GROUP_URL,
    NEXT_PUBLIC_ZALO_URL: process.env.NEXT_PUBLIC_ZALO_URL,
    NEXT_PUBLIC_TIKTOK_URL: process.env.NEXT_PUBLIC_TIKTOK_URL,
    NEXT_PUBLIC_YOUTUBE_URL: process.env.NEXT_PUBLIC_YOUTUBE_URL,
});

if (!configProject.success) {
    console.error(configProject.error.message);
    throw new Error("Các khai báo biến môi trường không hợp lệ");
}

const envConfig = configProject.data;

export default envConfig;
