import { CloudinaryFolder, UploadResponse } from "@/lib/cloudinary";
import { createVideoTransformation, uploadWithReplace } from "@/lib/cloudinary/upload.server";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// API ROUTE: /api/upload/video
// Upload video lên Cloudinary với optimization
// =====================================================

interface VideoUploadRequest {
    file: string; // Base64
    fileName: string;
    folder?: CloudinaryFolder | string;
    publicId?: string;
    oldUrl?: string;
    optimize?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        const body: VideoUploadRequest = await request.json();

        const {
            file,
            fileName,
            folder = CloudinaryFolder.SPEAKING_VIDEOS,
            publicId,
            oldUrl,
            optimize = true,
        } = body;

        // Validate
        if (!file) {
            return NextResponse.json(
                { success: false, error: "Không có video được gửi lên" },
                { status: 400 }
            );
        }

        // Tạo transformation nếu cần optimize
        const transformation = optimize
            ? createVideoTransformation({
                quality: "auto",
                format: "auto",
            })
            : undefined;

        // Upload video
        const result = await uploadWithReplace(
            file,
            {
                folder,
                publicId,
                resourceType: "video",
                overwrite: true,
                invalidate: true,
                transformation,
                tags: ["video", "speaking"],
            },
            oldUrl
        );

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Video upload error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Upload video thất bại",
            },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "500mb", // Video có thể lớn hơn
        },
    },
};