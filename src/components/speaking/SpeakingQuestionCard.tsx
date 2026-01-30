/**
 * Khailingo - Speaking Question Card Component
 * Hiển thị câu hỏi speaking với audio recorder
 */

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, Clock, Mic } from 'lucide-react';
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
    duration?: number;
    onRecordingComplete?: (questionNumber: number, audioBlob: Blob, duration: number) => void;
    onUploadComplete?: (questionNumber: number, audioUrl: string, duration: number) => void;
    onClick?: () => void;
    showSuggestedAnswer?: boolean;
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
    duration,
    onRecordingComplete,
    onUploadComplete,
    onClick,
    showSuggestedAnswer = false, // Chỉ admin mới thấy
    disabled = false,
    className,
}: SpeakingQuestionCardProps) {
    const [showAnswer, setShowAnswer] = useState(false);

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
                <CardContent className="p-4 md:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4" onClick={onClick}>
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
                        <div className="flex-1">
                            <p className="text-foreground font-medium leading-relaxed">
                                {question.question_text}
                            </p>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {isCompleted && audioUrl && (
                            <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã ghi âm
                            </Badge>
                        )}
                        {duration && duration > 0 && (
                            <Badge variant="secondary" className="gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(duration)}
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
                                maxDuration={120}
                                onRecordingComplete={(blob, dur) => {
                                    onRecordingComplete?.(question.question_number, blob, dur);
                                }}
                                onUploadComplete={(url, dur) => {
                                    onUploadComplete?.(question.question_number, url, dur);
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

                    {/* Suggested Answer (Admin only) */}
                    {showSuggestedAnswer && question.suggested_answer && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <button
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <HelpCircle className="w-4 h-4" />
                                {showAnswer ? 'Ẩn gợi ý trả lời' : 'Xem gợi ý trả lời'}
                            </button>
                            
                            {showAnswer && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 p-4 bg-muted/50 rounded-lg"
                                >
                                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                                        {question.suggested_answer}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default SpeakingQuestionCard;
