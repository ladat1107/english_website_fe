import { NextRequest, NextResponse } from "next/server";
import {
    UploadRequest,
    UploadResponse,
} from "@/lib/cloudinary";
import { uploadToCloudinary, uploadWithReplace } from "@/lib/cloudinary/upload.server";

// =====================================================
// API ROUTE: /api/upload
// Upload file lên Cloudinary (xử lý ở server)
// =====================================================

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        const body: UploadRequest & { oldUrl?: string } = await request.json();

        const { file, fileName, options, oldUrl } = body;

        // Validate input
        if (!file) {
            return NextResponse.json(
                { success: false, error: "Không có file được gửi lên" },
                { status: 400 }
            );
        }

        if (!options?.folder) {
            return NextResponse.json(
                { success: false, error: "Thiếu thông tin folder" },
                { status: 400 }
            );
        }

        // Upload với option ghi đè nếu có oldUrl
        const result = oldUrl
            ? await uploadWithReplace(file, options, oldUrl)
            : await uploadToCloudinary(file, options);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Upload API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Upload thất bại",
            },
            { status: 500 }
        );
    }
}

// Cấu hình để cho phép upload file lớn
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "100mb",
        },
    },
};