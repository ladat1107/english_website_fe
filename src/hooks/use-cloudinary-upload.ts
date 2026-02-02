"use client";

import { useState, useCallback } from "react";
import { uploadService } from "@/services/upload.service";
import {
    CloudinaryFolder,
    UploadResult,
    CloudinaryResourceType,
} from "@/lib/cloudinary";

// =====================================================
// HOOK: useCloudinaryUpload
// Custom hook để quản lý upload với state
// =====================================================

export interface UseCloudinaryUploadOptions {
    // Folder mặc định
    folder?: CloudinaryFolder | string;

    // Loại resource mặc định
    resourceType?: CloudinaryResourceType;

    // Callback khi upload thành công
    onSuccess?: (result: UploadResult) => void;

    // Callback khi upload thất bại
    onError?: (error: Error) => void;
}

export interface UseCloudinaryUploadReturn {
    // State
    isUploading: boolean;
    progress: number;
    error: string | null;
    result: UploadResult | null;

    // Actions
    uploadVideo: (
        file: File,
        options?: { publicId?: string; oldUrl?: string }
    ) => Promise<UploadResult | null>;

    uploadImage: (
        file: File,
        options?: { publicId?: string; oldUrl?: string; width?: number; height?: number }
    ) => Promise<UploadResult | null>;

    uploadAudio: (
        file: File | Blob,
        options?: { publicId?: string; oldUrl?: string; fileName?: string }
    ) => Promise<UploadResult | null>;

    uploadMultiple: (files: File[]) => Promise<UploadResult[]>;

    reset: () => void;
}

export function useCloudinaryUpload(
    options: UseCloudinaryUploadOptions = {}
): UseCloudinaryUploadReturn {
    const { folder, resourceType, onSuccess, onError } = options;

    // State
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<UploadResult | null>(null);

    // Reset state
    const reset = useCallback(() => {
        setIsUploading(false);
        setProgress(0);
        setError(null);
        setResult(null);
    }, []);

    // Upload video
    const uploadVideo = useCallback(
        async (
            file: File,
            uploadOptions?: { publicId?: string; oldUrl?: string }
        ): Promise<UploadResult | null> => {
            setIsUploading(true);
            setProgress(0);
            setError(null);

            try {
                // Giả lập progress (vì fetch không hỗ trợ progress natively)
                const progressInterval = setInterval(() => {
                    setProgress((prev) => Math.min(prev + 10, 90));
                }, 500);

                const uploadResult = await uploadService.uploadVideo(file, {
                    folder: folder || CloudinaryFolder.SPEAKING_VIDEOS,
                    publicId: uploadOptions?.publicId,
                    oldUrl: uploadOptions?.oldUrl,
                });

                clearInterval(progressInterval);
                setProgress(100);
                setResult(uploadResult);
                onSuccess?.(uploadResult);

                return uploadResult;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Upload video thất bại";
                setError(errorMessage);
                onError?.(err instanceof Error ? err : new Error(errorMessage));
                return null;
            } finally {
                setIsUploading(false);
            }
        },
        [folder, onSuccess, onError]
    );

    // Upload image
    const uploadImage = useCallback(
        async (
            file: File,
            uploadOptions?: {
                publicId?: string;
                oldUrl?: string;
                width?: number;
                height?: number;
            }
        ): Promise<UploadResult | null> => {
            setIsUploading(true);
            setProgress(0);
            setError(null);

            try {
                setProgress(30);

                const uploadResult = await uploadService.uploadImage(file, {
                    folder: folder || CloudinaryFolder.GENERAL_IMAGES,
                    publicId: uploadOptions?.publicId,
                    oldUrl: uploadOptions?.oldUrl,
                    width: uploadOptions?.width,
                    height: uploadOptions?.height,
                });

                setProgress(100);
                setResult(uploadResult);
                onSuccess?.(uploadResult);

                return uploadResult;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Upload ảnh thất bại";
                setError(errorMessage);
                onError?.(err instanceof Error ? err : new Error(errorMessage));
                return null;
            } finally {
                setIsUploading(false);
            }
        },
        [folder, onSuccess, onError]
    );

    // Upload audio
    const uploadAudio = useCallback(
        async (
            file: File | Blob,
            uploadOptions?: { publicId?: string; oldUrl?: string; fileName?: string }
        ): Promise<UploadResult | null> => {
            setIsUploading(true);
            setProgress(0);
            setError(null);

            try {
                setProgress(30);

                const uploadResult = await uploadService.uploadAudio(file, {
                    folder: folder || CloudinaryFolder.USER_RECORDINGS,
                    publicId: uploadOptions?.publicId,
                    oldUrl: uploadOptions?.oldUrl,
                    fileName: uploadOptions?.fileName,
                });

                setProgress(100);
                setResult(uploadResult);
                onSuccess?.(uploadResult);

                return uploadResult;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Upload audio thất bại";
                setError(errorMessage);
                onError?.(err instanceof Error ? err : new Error(errorMessage));
                return null;
            } finally {
                setIsUploading(false);
            }
        },
        [folder, onSuccess, onError]
    );

    // Upload multiple files
    const uploadMultiple = useCallback(
        async (files: File[]): Promise<UploadResult[]> => {
            setIsUploading(true);
            setProgress(0);
            setError(null);

            try {
                const uploadResult = await uploadService.uploadMultiple(files, {
                    folder: folder || CloudinaryFolder.GENERAL_FILES,
                    resourceType,
                });

                setProgress(100);
                return uploadResult;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Upload nhiều file thất bại";
                setError(errorMessage);
                onError?.(err instanceof Error ? err : new Error(errorMessage));
                return [];
            } finally {
                setIsUploading(false);
            }
        },
        [folder, resourceType, onError]
    );

    return {
        isUploading,
        progress,
        error,
        result,
        uploadVideo,
        uploadImage,
        uploadAudio,
        uploadMultiple,
        reset,
    };
}

export default useCloudinaryUpload;