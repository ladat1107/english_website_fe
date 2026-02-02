import { NextRequest, NextResponse } from "next/server";
import {
    DeleteOptions,
    DeleteResponse,
} from "@/lib/cloudinary";
import { deleteFromCloudinary } from "@/lib/cloudinary/upload.server";

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

        // Xóa file
        const result = await deleteFromCloudinary({
            publicId,
            resourceType,
            invalidate,
        });

        return NextResponse.json(result);
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