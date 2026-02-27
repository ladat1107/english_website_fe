/**
 * Khailingo - Audio Recorder Component
 * Component ghi âm audio sử dụng Web Audio API
 * Hỗ trợ ghi âm, phát lại, và upload lên Cloudinary
 */

"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, RotateCcw, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import useCloudinaryUpload from '@/hooks/use-cloudinary-upload';
import { CloudinaryFolder } from '@/lib/cloudinary';

// =====================================================
// TYPES
// =====================================================
interface AudioRecorderProps {
    onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
    onUploadComplete?: (audioUrl: string, duration: number) => void;
    maxDuration?: number; // Giới hạn thời gian ghi (giây)
    disabled?: boolean;
    className?: string;
    showUploadButton?: boolean;
    autoUpload?: boolean; // Tự động upload sau khi ghi xong
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';


// =====================================================
// AUDIO RECORDER COMPONENT
// =====================================================
export function AudioRecorder({
    onRecordingComplete,
    onUploadComplete,
    maxDuration = 300, // 5 phút mặc định
    disabled = false,
    className,
    showUploadButton = true,
    autoUpload = false,
}: AudioRecorderProps) {
    // States
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);

    // Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const {
        isUploading,
        uploadAudio,
    } = useCloudinaryUpload({
        folder: CloudinaryFolder.SPEAKING_AUDIO,
        onSuccess: (result) => {
            onUploadComplete?.(result.secureUrl, duration);
        },
        onError: (err) => {
            console.error('Upload error:', err);
            setError('Không thể upload audio. Vui lòng thử lại.');
        }
    });

    // =====================================================
    // CLEANUP
    // =====================================================
    useEffect(() => {
        return () => {
            // Cleanup khi unmount
            if (timerRef.current) clearInterval(timerRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    // =====================================================
    // AUDIO LEVEL VISUALIZATION
    // =====================================================
    const updateAudioLevel = useCallback(() => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Tính average level
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average / 255); // Normalize to 0-1

        if (recordingState === 'recording') {
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
    }, [recordingState]);

    // =====================================================
    // START RECORDING
    // =====================================================
    const startRecording = async () => {
        try {
            setError(null);

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                }
            });

            // Setup audio analyser for visualization
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            // Setup MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            // Collect audio data
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // Handle recording stop
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);

                // Tạo URL để phát lại
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                // Callback
                onRecordingComplete?.(blob, duration);

                // Auto upload nếu được bật
                if (autoUpload) {
                    uploadToCloudinary(blob);
                }

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms
            setRecordingState('recording');
            setDuration(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => {
                    if (prev >= maxDuration) {
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

            // Start audio level animation
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);

        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
        }
    };

    // =====================================================
    // STOP RECORDING
    // =====================================================
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.stop();
            setRecordingState('stopped');

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            setAudioLevel(0);
        }
    }, [recordingState]);

    // =====================================================
    // RESET RECORDING
    // =====================================================
    const resetRecording = () => {
        setRecordingState('idle');
        setDuration(0);
        setAudioBlob(null);
        setIsPlaying(false);
        setError(null);
        setAudioLevel(0);

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
    };

    // =====================================================
    // PLAY/PAUSE AUDIO
    // =====================================================
    const togglePlayback = () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // =====================================================
    // UPLOAD TO CLOUDINARY
    // =====================================================
    const uploadToCloudinary = async (blob?: Blob) => {
        const audioToUpload = blob || audioBlob;
        if (!audioToUpload) return;

        setError(null);

        try {
            // const formData = new FormData();
            // formData.append('file', audioToUpload);
            // formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            // formData.append('resource_type', 'video'); // Cloudinary uses 'video' for audio

            // const response = await fetch(
            //     `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
            //     {
            //         method: 'POST',
            //         body: formData,
            //     }
            // );

            // if (!response.ok) {
            //     throw new Error('Upload failed');
            // }

            // const data = await response.json();
            // onUploadComplete?.(data.secure_url, duration);

            await uploadAudio(audioToUpload, {
                fileName: `recording_${Date.now()}.webm`,
            });

        } catch (err) {
            console.error('Upload error:', err);
            setError('Không thể upload audio. Vui lòng thử lại.');
        } finally {
            //setIsUploading(false);
        }
    };

    // =====================================================
    // FORMAT TIME
    // =====================================================
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // =====================================================
    // RENDER
    // =====================================================
    return (
        <div className={cn('flex flex-col items-center gap-4', className)}>
            {/* Audio Element (hidden) */}
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                />
            )}

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recording Visualization */}
            <div className="relative flex items-center justify-center w-32 h-32">
                {/* Background circles for animation */}
                <AnimatePresence>
                    {recordingState === 'recording' && (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 rounded-full bg-primary/20"
                                    initial={{ scale: 1, opacity: 0.5 }}
                                    animate={{
                                        scale: 1 + audioLevel * (i + 1) * 0.3,
                                        opacity: 0.5 - audioLevel * 0.3,
                                    }}
                                    transition={{ duration: 0.1 }}
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>

                {/* Main button */}
                <motion.button
                    className={cn(
                        'relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-colors',
                        recordingState === 'recording'
                            ? 'bg-destructive text-white'
                            : 'bg-primary text-white hover:bg-primary/90',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={recordingState === 'recording' ? stopRecording : startRecording}
                    disabled={disabled || recordingState === 'stopped'}
                    whileTap={{ scale: 0.95 }}
                >
                    {recordingState === 'recording' ? (
                        <Square className="w-8 h-8" />
                    ) : (
                        <Mic className="w-8 h-8" />
                    )}
                </motion.button>
            </div>

            {/* Timer */}
            <div className="text-2xl font-mono font-semibold text-foreground">
                {formatTime(duration)}
                {recordingState === 'recording' && (
                    <span className="text-muted-foreground text-base ml-2">
                        / {formatTime(maxDuration)}
                    </span>
                )}
            </div>

            {/* Status text */}
            <p className="text-sm text-muted-foreground">
                {recordingState === 'idle' && 'Nhấn để bắt đầu ghi âm'}
                {recordingState === 'recording' && (
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                        Đang ghi âm...
                    </span>
                )}
                {recordingState === 'stopped' && 'Ghi âm hoàn tất'}
            </p>

            {/* Playback & Actions */}
            <AnimatePresence>
                {recordingState === 'stopped' && audioUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-3"
                    >
                        {/* Play/Pause */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={togglePlayback}
                            title={isPlaying ? 'Tạm dừng' : 'Phát lại'}
                        >
                            {isPlaying ? (
                                <Pause className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                        </Button>

                        {/* Reset */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={resetRecording}
                            title="Ghi lại"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>

                        {/* Upload */}
                        {showUploadButton && !autoUpload && (
                            <Button
                                variant="default"
                                onClick={() => uploadToCloudinary()}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Gửi bài
                                    </>
                                )}
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AudioRecorder;
