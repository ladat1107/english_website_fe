import { NextRequest, NextResponse } from "next/server";
import {
    DeleteOptions,
    DeleteResponse,
} from "@/lib/cloudinary";
import { getCloudinary } from "@/lib/cloudinary/config.server";

// =====================================================
// API ROUTE: /api/upload/delete
// Xóa file trên Cloudinary
// =====================================================

export async function POST(request: NextRequest): Promise<NextResponse<DeleteResponse>> {
    try {
        const body: DeleteOptions = await request.json();

        const { publicId, resourceType = "image", invalidate = true } = body;

        // Validate
        if (!publicId) {
            return NextResponse.json(
                { success: false, error: "Thiếu publicId" },
                { status: 400 }
            );
        }

        const cloudinary = getCloudinary();
        // Xóa file
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate,
        });

        return NextResponse.json({
            success: result.result === "ok",
            result: result.result,
        });
    } catch (error) {
        console.error("Delete API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Xóa file thất bại",
            },
            { status: 500 }
        );
    }
}