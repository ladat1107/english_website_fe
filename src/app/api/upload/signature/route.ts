import { NextRequest, NextResponse } from "next/server";
import { getCloudinary } from "@/lib/cloudinary/config.server";
import { CloudinaryFolder, CloudinaryResourceType, SignatureResponse } from "@/lib/cloudinary";
import envConfig from "@/utils/env-config";

// =====================================================
// API ROUTE: /api/upload/signature
// Tạo chữ ký để client upload trực tiếp lên Cloudinary
// =====================================================

interface SignatureRequest {
    folder: CloudinaryFolder | string;
    publicId?: string;
    resourceType?: CloudinaryResourceType;
    tags?: string[];
    transformation?: string;
    eager?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SignatureResponse>> {
    try {
        const body: SignatureRequest = await request.json();

        const {
            folder,
            publicId,
            resourceType = "auto",
            tags = [],
            transformation,
            eager,
        } = body;

        // Validate folder
        if (!folder) {
            return NextResponse.json(
                { success: false, error: "Thiếu thông tin folder" },
                { status: 400 }
            );
        }

        const cloudinary = getCloudinary();

        // Timestamp cho signature (có hiệu lực trong 1 giờ)
        const timestamp = Math.round(Date.now() / 1000);

        // Tạo folder path đầy đủ
        const fullFolder = "khailingo/" + folder;

        // Params để ký
        const paramsToSign: Record<string, string | number> = {
            timestamp,
            folder: fullFolder,
        };

        // Thêm các params tùy chọn
        if (publicId) {
            paramsToSign.public_id = publicId;
        }

        if (tags.length > 0) {
            paramsToSign.tags = tags.join(",");
        }

        if (transformation) {
            paramsToSign.transformation = transformation;
        }

        if (eager) {
            paramsToSign.eager = eager;
        }

        // Tạo signature
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            envConfig.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            success: true,
            data: {
                signature,
                timestamp,
                cloudName: envConfig.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                apiKey: envConfig.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
                folder: fullFolder,
                publicId,
                resourceType,
                tags,
                eager,
            },
        });
    } catch (error) {
        console.error("Signature generation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Tạo chữ ký thất bại",
            },
            { status: 500 }
        );
    }
}