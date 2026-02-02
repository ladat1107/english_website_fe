"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Mic, Square, Loader2, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { CloudinaryFolder, UploadResult } from "@/lib/cloudinary";

// =====================================================
// COMPONENT: AudioUploader
// Upload audio hoặc ghi âm trực tiếp
// =====================================================

export interface AudioUploaderProps {
    // Giá trị hiện tại (URL)
    value?: string;

    // Callback khi có URL mới
    onChange: (url: string) => void;

    // Folder lưu trữ
    folder?: CloudinaryFolder | string;

    // Public ID để ghi đè
    publicId?: string;

    // Cho phép ghi âm
    allowRecording?: boolean;

    // Label
    label?: string;

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

export function AudioUploader({
    value,
    onChange,
    folder = CloudinaryFolder.USER_RECORDINGS,
    publicId,
    allowRecording = true,
    label = "Audio",
    error,
    disabled = false,
    className,
    onUploadSuccess,
    onUploadError,
}: AudioUploaderProps) {
    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);

    // State
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    // Hook upload
    const {
        isUploading,
        progress,
        error: uploadError,
        uploadAudio,
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

            await uploadAudio(file, {
                publicId,
                oldUrl: value,
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [uploadAudio, publicId, value]
    );

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                stream.getTracks().forEach((track) => track.stop());

                // Upload recording
                await uploadAudio(audioBlob, {
                    publicId,
                    oldUrl: value,
                    fileName: `recording_${Date.now()}.webm`,
                });
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Timer
            const startTime = Date.now();
            const timer = setInterval(() => {
                setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);

            //mediaRecorderRef.current.timer = timer as unknown as number;
        } catch (err) {
            console.error("Không thể truy cập microphone:", err);
            onUploadError?.(new Error("Không thể truy cập microphone"));
        }
    }, [uploadAudio, publicId, value, onUploadError]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            //clearInterval(mediaRecorderRef.current.timer);
            setIsRecording(false);
            setRecordingTime(0);
        }
    }, [isRecording]);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    // Clear audio
    const handleClear = useCallback(() => {
        onChange("");
        setIsPlaying(false);
    }, [onChange]);

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const displayError = error || uploadError;

    return (
        <div className={cn("space-y-3", className)}>
            {/* Label */}
            {label && (
                <label className="text-sm font-medium flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary" />
                    {label}
                </label>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
                {/* Upload button */}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="audio-upload"
                        disabled={disabled || isUploading || isRecording}
                    />
                    <label htmlFor="audio-upload">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={disabled || isUploading || isRecording}
                            asChild
                        >
                            <span className="cursor-pointer">
                                <Upload className="w-4 h-4 mr-1" />
                                Upload file
                            </span>
                        </Button>
                    </label>
                </div>

                {/* Recording button */}
                {allowRecording && (
                    <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={disabled || isUploading}
                    >
                        {isRecording ? (
                            <>
                                <Square className="w-4 h-4 mr-1" />
                                Dừng ({formatTime(recordingTime)})
                            </>
                        ) : (
                            <>
                                <Mic className="w-4 h-4 mr-1" />
                                Ghi âm
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Upload progress */}
            {isUploading && (
                <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <Progress value={progress} className="flex-1" />
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
            )}

            {/* Audio player */}
            {value && !isUploading && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <audio
                        ref={audioRef}
                        src={value}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5" />
                        )}
                    </Button>
                    <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-0" />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="text-destructive"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Error message */}
            {displayError && (
                <p className="text-sm text-destructive">{displayError}</p>
            )}
        </div>
    );
}

export default AudioUploader;