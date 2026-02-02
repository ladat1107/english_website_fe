import { NextRequest, NextResponse } from "next/server";
import {
    CloudinaryFolder,
    UploadResponse,
} from "@/lib/cloudinary";
import { uploadWithReplace } from "@/lib/cloudinary/upload.server";

// =====================================================
// API ROUTE: /api/upload/audio
// Upload audio (ghi âm) lên Cloudinary
// =====================================================

interface AudioUploadRequest {
    file: string; // Base64
    fileName: string;
    folder?: CloudinaryFolder | string;
    publicId?: string;
    oldUrl?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        const body: AudioUploadRequest = await request.json();

        const {
            file,
            fileName,
            folder = CloudinaryFolder.USER_RECORDINGS,
            publicId,
            oldUrl,
        } = body;

        // Validate
        if (!file) {
            return NextResponse.json(
                { success: false, error: "Không có audio được gửi lên" },
                { status: 400 }
            );
        }

        // Upload audio (Cloudinary xử lý audio như video)
        const result = await uploadWithReplace(
            file,
            {
                folder,
                publicId,
                resourceType: "video", // Audio được xử lý như video
                overwrite: true,
                invalidate: true,
                tags: ["audio", "recording"],
            },
            oldUrl
        );

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Audio upload error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Upload audio thất bại",
            },
            { status: 500 }
        );
    }
}