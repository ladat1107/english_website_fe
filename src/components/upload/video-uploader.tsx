"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Video, X, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { CloudinaryFolder, UploadResult } from "@/lib/cloudinary";

// =====================================================
// COMPONENT: VideoUploader
// Upload video với 2 mode: URL hoặc Upload file
// =====================================================

export type VideoInputMode = "url" | "upload";

export interface VideoUploaderProps {
    // Giá trị hiện tại (URL)
    value?: string;

    // Callback khi có URL mới
    onChange: (url: string) => void;

    // Folder lưu trữ
    folder?: CloudinaryFolder | string;

    // Public ID để ghi đè
    publicId?: string;

    // Label
    label?: string;

    // Placeholder
    placeholder?: string;

    // Error message
    error?: string;

    // Disabled
    disabled?: boolean;

    // Class name
    className?: string;

    // Callback khi upload thành công
    onUploadSuccess?: (result: UploadResult) => void;

    // Callback khi upload thất bại
    onUploadError?: (error: Error) => void;
}

export function VideoUploader({
    value,
    onChange,
    folder = CloudinaryFolder.SPEAKING_VIDEOS,
    publicId,
    label = "Video",
    placeholder = "Nhập link video YouTube hoặc Cloudinary",
    error,
    disabled = false,
    className,
    onUploadSuccess,
    onUploadError,
}: VideoUploaderProps) {
    // State
    const [inputMode, setInputMode] = useState<VideoInputMode>("url");
    const [urlInput, setUrlInput] = useState(value || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hook upload
    const {
        isUploading,
        progress,
        error: uploadError,
        uploadVideo,
    } = useCloudinaryUpload({
        folder,
        onSuccess: (result) => {
            onChange(result.versionedUrl);
            onUploadSuccess?.(result);
        },
        onError: onUploadError,
    });

    // Handle URL change
    const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setUrlInput(url);
        onChange(url);
    }, [onChange]);

    // Handle file select
    const handleFileSelect = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            await uploadVideo(file, {
                publicId,
                oldUrl: value, // Ghi đè file cũ
            });

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [uploadVideo, publicId, value]
    );

    // Handle drag & drop
    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("video/")) {
                await uploadVideo(file, {
                    publicId,
                    oldUrl: value,
                });
            }
        },
        [uploadVideo, publicId, value]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    // Clear video
    const handleClear = useCallback(() => {
        setUrlInput("");
        onChange("");
    }, [onChange]);

    const displayError = error || uploadError;

    return (
        <div className={cn("space-y-3", className)}>
            {/* Label */}
            {label && (
                <label className="text-sm font-medium flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    {label}
                </label>
            )}

            {/* Mode toggle */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant={inputMode === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInputMode("url")}
                    disabled={disabled || isUploading}
                    className="gap-1.5"
                >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Nhập link
                </Button>
                <Button
                    type="button"
                    variant={inputMode === "upload" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInputMode("upload")}
                    disabled={disabled || isUploading}
                    className="gap-1.5"
                >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                </Button>
            </div>

            {/* URL input mode */}
            {inputMode === "url" && (
                <div className="space-y-2">
                    <div className="relative">
                        <Input
                            placeholder={placeholder}
                            value={urlInput}
                            onChange={handleUrlChange}
                            disabled={disabled}
                            className={cn(displayError && "border-destructive")}
                        />
                        {urlInput && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={handleClear}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Upload mode */}
            {inputMode === "upload" && (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
                        "hover:border-primary/50 hover:bg-primary/5",
                        isUploading && "pointer-events-none opacity-70",
                        displayError && "border-destructive"
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="video-upload"
                        disabled={disabled || isUploading}
                    />

                    {isUploading ? (
                        <div className="space-y-3">
                            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Đang tải lên...</p>
                            <Progress value={progress} className="w-full max-w-xs mx-auto" />
                            <p className="text-xs text-muted-foreground">{progress}%</p>
                        </div>
                    ) : (
                        <label
                            htmlFor="video-upload"
                            className="cursor-pointer block space-y-2"
                        >
                            <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                            <p className="text-sm font-medium">
                                Kéo thả video vào đây hoặc click để chọn
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Hỗ trợ: MP4, WebM, MOV (tối đa 500MB)
                            </p>
                        </label>
                    )}
                </div>
            )}

            {/* Error message */}
            {displayError && (
                <p className="text-sm text-destructive">{displayError}</p>
            )}

            {/* Preview */}
            {value && !isUploading && (
                <div className="mt-3 relative rounded-lg overflow-hidden bg-black">
                    <video
                        src={value}
                        controls
                        className="w-full max-h-[300px] object-contain"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleClear}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default VideoUploader;