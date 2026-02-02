import { NextRequest, NextResponse } from "next/server";
import {
    CloudinaryFolder,
    UploadResponse
} from "@/lib/cloudinary";
import { createImageTransformation, uploadWithReplace } from "@/lib/cloudinary/upload.server";

// =====================================================
// API ROUTE: /api/upload/image
// Upload ảnh lên Cloudinary với optimization
// =====================================================

interface ImageUploadRequest {
    file: string; // Base64
    fileName: string;
    folder?: CloudinaryFolder | string;
    publicId?: string;
    oldUrl?: string;
    width?: number;
    height?: number;
    optimize?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        const body: ImageUploadRequest = await request.json();

        const {
            file,
            fileName,
            folder = CloudinaryFolder.GENERAL_IMAGES,
            publicId,
            oldUrl,
            width,
            height,
            optimize = true,
        } = body;

        // Validate
        if (!file) {
            return NextResponse.json(
                { success: false, error: "Không có ảnh được gửi lên" },
                { status: 400 }
            );
        }

        // Tạo transformation
        const transformation = optimize
            ? createImageTransformation({
                width,
                height,
                crop: width || height ? "fill" : undefined,
                quality: "auto",
                format: "auto",
            })
            : undefined;

        // Upload image
        const result = await uploadWithReplace(
            file,
            {
                folder,
                publicId,
                resourceType: "image",
                overwrite: true,
                invalidate: true,
                transformation,
                tags: ["image"],
            },
            oldUrl
        );

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Upload ảnh thất bại",
            },
            { status: 500 }
        );
    }
}