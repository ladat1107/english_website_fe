/**
 * Khailingo - Speaking Question Card Component
 * Hiển thị câu hỏi speaking với audio recorder
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mic, Lightbulb, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SpeakingQuestion } from '@/types/speaking.type';
import { Card, CardContent, Badge } from '@/components/ui';
import { AudioRecorder } from './AudioRecorder';

// =====================================================
// TYPES
// =====================================================
interface SpeakingQuestionCardProps {
    question: SpeakingQuestion;
    index: number;
    isActive?: boolean;
    isCompleted?: boolean;
    audioUrl?: string;
    onRecordingComplete?: (questionNumber: number, audioBlob: Blob, duration: number) => void;
    onUploadComplete?: (questionNumber: number, questionText: string, audioUrl: string, duration: number) => void;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

// =====================================================
// SPEAKING QUESTION CARD COMPONENT
// =====================================================
export function SpeakingQuestionCard({
    question,
    index,
    isActive = false,
    isCompleted = false,
    audioUrl,
    onRecordingComplete,
    onUploadComplete,
    onClick,
    disabled = false,
    className,
}: SpeakingQuestionCardProps) {
    const [showAnswer, setShowAnswer] = useState(false);

    // Close tooltip when clicking outside
    React.useEffect(() => {
        if (!showAnswer) return;

        const handleClickOutside = () => setShowAnswer(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showAnswer]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card
                className={cn(
                    'transition-all duration-300',
                    isActive && 'ring-2 ring-primary shadow-lg',
                    isCompleted && 'bg-success/5 border-success/30',
                    className
                )}
            >
                <CardContent className="p-4 md:p-6 relative">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                        {/* Question Number */}
                        <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                            isCompleted
                                ? 'bg-success text-white'
                                : isActive
                                    ? 'bg-primary text-white'
                                    : 'bg-muted text-muted-foreground'
                        )}>
                            {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5" />
                            ) : (
                                question.question_number
                            )}
                        </div>

                        {/* Question Text */}
                        <div className="flex-1" onClick={onClick}>
                            <p className="text-foreground font-medium leading-relaxed">
                                {question.question_text}
                            </p>
                        </div>

                        {/* Lightbulb Icon - Show Hint */}
                        {question.suggested_answer && (
                            <div className="shrink-0 relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAnswer(!showAnswer);
                                    }}
                                    className={cn(
                                        'p-2 rounded-full transition-all duration-200',
                                        'hover:bg-amber-50 dark:hover:bg-amber-950/20',
                                        'group'
                                    )}
                                    aria-label="Xem gợi ý"
                                >
                                    {/* <Lightbulb className={cn(
                                        'w-5 h-5 text-amber-500 dark:text-amber-400',
                                        'group-hover:scale-110 transition-transform duration-200',
                                        'drop-shadow-sm'
                                    )} /> */}
                                    💡
                                </button>

                                {/* Tooltip */}
                                <AnimatePresence>
                                    {showAnswer && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] z-50"
                                        >
                                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/90 dark:to-orange-950/90 rounded-xl shadow-xl border border-amber-200/50 dark:border-amber-800/50 p-4 backdrop-blur-sm">
                                                {/* Arrow */}
                                                <div className="absolute -top-2 right-4 w-4 h-4 bg-amber-50 dark:bg-amber-950/90 border-l border-t border-amber-200/50 dark:border-amber-800/50 rotate-45"></div>

                                                {/* Header */}
                                                <div className="flex items-center gap-2 mb-2.5 relative">
                                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                                                        Gợi ý
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowAnswer(false);
                                                        }}
                                                        className="ml-auto p-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                                                        aria-label="Đóng"
                                                    >
                                                        <X className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                                                    {question.suggested_answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {isCompleted && audioUrl && (
                            <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã ghi âm
                            </Badge>
                        )}
                        {isActive && !isCompleted && (
                            <Badge variant="warning" className="gap-1">
                                <Mic className="w-3 h-3" />
                                Đang chờ ghi âm
                            </Badge>
                        )}
                    </div>

                    {/* Audio Recorder - Chỉ hiện khi active hoặc chưa completed */}
                    {isActive && !disabled && (
                        <div className="mt-6 pt-4 border-t border-border">
                            <AudioRecorder
                                maxDuration={300}
                                onRecordingComplete={(blob, dur) => {
                                    onRecordingComplete?.(question.question_number, blob, dur);
                                }}
                                onUploadComplete={(url, dur) => {
                                    onUploadComplete?.(question.question_number, question.question_text, url, dur);
                                }}
                                showUploadButton={true}
                                disabled={disabled}
                            />


                        </div>
                    )}

                    {/* Completed Audio Playback */}
                    {isCompleted && audioUrl && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">Bài ghi âm của bạn:</p>
                            <audio
                                src={audioUrl}
                                controls
                                className="w-full h-10 rounded-lg"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default SpeakingQuestionCard;
