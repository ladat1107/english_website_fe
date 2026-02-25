"use client";

import { useCallback, useRef } from "react";
import { Upload, ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { CloudinaryFolder, UploadResult } from "@/lib/cloudinary";

// =====================================================
// COMPONENT: ImageUploader
// Upload ảnh đơn với preview
// =====================================================

export interface ImageUploaderProps {
    // Giá trị hiện tại (URL)
    value?: string;

    // Callback khi có URL mới
    onChange: (url: string) => void;

    // Folder lưu trữ
    folder?: CloudinaryFolder | string;

    // Public ID để ghi đè
    publicId?: string;

    // Kích thước resize
    width?: number;
    height?: number;

    // Label
    label?: string;

    // Error message
    error?: string;

    // Disabled
    disabled?: boolean;

    // Class name
    className?: string;

    // Aspect ratio class
    aspectRatio?: string;

    // Callback khi upload thành công
    onUploadSuccess?: (result: UploadResult) => void;

    // Callback khi upload thất bại
    onUploadError?: (error: Error) => void;
}

export function ImageUploader({
    value,
    onChange,
    folder = CloudinaryFolder.GENERAL_IMAGES,
    publicId,
    width,
    height,
    label = "Ảnh",
    error,
    disabled = false,
    className,
    aspectRatio = "aspect-video",
    onUploadSuccess,
    onUploadError,
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hook upload
    const {
        isUploading,
        progress,
        error: uploadError,
        uploadImage,
    } = useCloudinaryUpload({
        folder,
        onSuccess: (result) => {
            onChange(result.versionedUrl);
            onUploadSuccess?.(result);
        },
        onError: onUploadError,
    });

    // Handle file select
    const handleFileSelect = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            await uploadImage(file, {
                publicId,
                oldUrl: value,
                width,
                height,
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [uploadImage, publicId, value, width, height]
    );

    // Handle drag & drop
    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                await uploadImage(file, {
                    publicId,
                    oldUrl: value,
                    width,
                    height,
                });
            }
        },
        [uploadImage, publicId, value, width, height]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    // Clear image
    const handleClear = useCallback(() => {
        onChange("");
    }, [onChange]);

    const displayError = error || uploadError;

    return (
        <div className={cn("space-y-2", className)}>
            {/* Label */}
            {label && (
                <label className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    {label}
                </label>
            )}

            {/* Upload area */}
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl overflow-hidden transition-colors",
                    "hover:border-primary/50 hover:bg-primary/5",
                    aspectRatio,
                    isUploading && "pointer-events-none",
                    displayError && "border-destructive"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                    disabled={disabled || isUploading}
                />

                {value && !isUploading ? (
                    // Preview image
                    <div className="relative w-full h-full">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer"
                            >
                                <Button type="button" variant="secondary" size="sm">
                                    <Upload className="w-4 h-4 mr-1" />
                                    Đổi ảnh
                                </Button>
                            </label>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleClear}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ) : isUploading ? (
                    // Uploading state
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <Progress value={progress} className="w-1/2" />
                        <p className="text-xs text-muted-foreground">{progress}%</p>
                    </div>
                ) : (
                    // Empty state
                    <label
                        htmlFor="image-upload"
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                    >
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Kéo thả hoặc click để upload</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, WebP (tối đa 20MB)
                        </p>
                    </label>
                )}
            </div>

            {/* Error message */}
            {displayError && (
                <p className="text-sm text-destructive">{displayError}</p>
            )}
        </div>
    );
}

export default ImageUploader;