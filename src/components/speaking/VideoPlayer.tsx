/**
 * Khailingo - Video Player Component
 * Component phát video với các tùy chọn điều khiển
 * Hỗ trợ YouTube embed và Cloudinary video
 */

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// =====================================================
// TYPES
// =====================================================
interface VideoPlayerProps {
    src: string;
    title?: string;
    poster?: string;
    autoPlay?: boolean;
    showControls?: boolean;
    className?: string;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
}

// =====================================================
// HELPER: Detect YouTube URL
// =====================================================
const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
};

const getYouTubeEmbedUrl = (url: string): string => {
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }

    // Already an embed URL
    if (url.includes('embed')) {
        return url;
    }

    return url;
};

// =====================================================
// VIDEO PLAYER COMPONENT
// =====================================================
export function VideoPlayer({
    src,
    title = 'Video',
    poster,
    autoPlay = false,
    showControls = true,
    className,
    onEnded,
    onTimeUpdate,
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showOverlay, setShowOverlay] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const isYouTube = isYouTubeUrl(src);

    // =====================================================
    // VIDEO EVENT HANDLERS
    // =====================================================
    useEffect(() => {
        const video = videoRef.current;
        if (!video || isYouTube) return;

        const handleLoadedData = () => {
            setIsLoading(false);
            setDuration(video.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            onTimeUpdate?.(video.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setShowOverlay(true);
            onEnded?.();
        };

        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('canplay', handleCanPlay);

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('canplay', handleCanPlay);
        };
    }, [isYouTube, onEnded, onTimeUpdate]);

    // =====================================================
    // CONTROLS
    // =====================================================
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
            setShowOverlay(false);
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen();
        }
    };

    const restart = () => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = 0;
        video.play();
        setIsPlaying(true);
        setShowOverlay(false);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const newTime = parseFloat(e.target.value);
        video.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // =====================================================
    // FORMAT TIME
    // =====================================================
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // =====================================================
    // RENDER YOUTUBE EMBED
    // =====================================================
    if (isYouTube) {
        return (
            <div className={cn('relative w-full aspect-video rounded-xl overflow-hidden bg-black', className)}>
                <iframe
                    src={getYouTubeEmbedUrl(src)}
                    title={title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                />

                {/* Loading overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/50"
                        >
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // =====================================================
    // RENDER NATIVE VIDEO
    // =====================================================
    return (
        <div
            ref={containerRef}
            className={cn(
                'relative w-full aspect-video rounded-xl overflow-hidden bg-black group',
                className
            )}
            onMouseEnter={() => setShowOverlay(true)}
            onMouseLeave={() => isPlaying && setShowOverlay(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                playsInline
                preload="metadata"
            />

            {/* Loading Spinner */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                    >
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Play/Pause Overlay */}
            <AnimatePresence>
                {showOverlay && showControls && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30"
                    >
                        <motion.button
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 text-white flex items-center justify-center hover:bg-primary transition-colors"
                            onClick={togglePlay}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isPlaying ? (
                                <Pause className="w-8 h-8 md:w-10 md:h-10" />
                            ) : (
                                <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Bar */}
            {showControls && (
                <motion.div
                    className={cn(
                        'absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent',
                        'transition-opacity duration-300',
                        showOverlay || !isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                >
                    {/* Progress Bar */}
                    <div className="mb-2 md:mb-3">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 md:h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-3
                                [&::-webkit-slider-thumb]:h-3
                                [&::-webkit-slider-thumb]:md:w-4
                                [&::-webkit-slider-thumb]:md:h-4
                                [&::-webkit-slider-thumb]:rounded-full
                                [&::-webkit-slider-thumb]:bg-primary
                                [&::-webkit-slider-thumb]:cursor-pointer
                                [&::-webkit-slider-thumb]:shadow-lg"
                            style={{
                                background: `linear-gradient(to right, #D42525 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`
                            }}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Play/Pause */}
                            <button
                                onClick={togglePlay}
                                className="p-1.5 md:p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4 md:w-5 md:h-5" />
                                ) : (
                                    <Play className="w-4 h-4 md:w-5 md:h-5" />
                                )}
                            </button>

                            {/* Restart */}
                            <button
                                onClick={restart}
                                className="p-1.5 md:p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                            </button>

                            {/* Mute */}
                            <button
                                onClick={toggleMute}
                                className="p-1.5 md:p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                                ) : (
                                    <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                                )}
                            </button>

                            {/* Time Display */}
                            <span className="text-xs md:text-sm font-mono">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Fullscreen */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 md:p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <Maximize className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default VideoPlayer;
