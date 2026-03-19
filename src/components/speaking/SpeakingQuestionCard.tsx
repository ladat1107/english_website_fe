/**
 * Khailingo - Speaking Question Card Component
 * Hiển thị câu hỏi speaking với audio recorder - Redesign nhỏ gọn và tinh tế
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mic, ChevronDown, Lightbulb, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SpeakingQuestion } from '@/types/speaking.type';
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
    const [showHint, setShowHint] = useState(false);
    const [isExpanded, setIsExpanded] = useState(isActive);

    // Expand when active changes
    React.useEffect(() => {
        if (isActive) setIsExpanded(true);
    }, [isActive]);

    // Close hint when clicking outside
    React.useEffect(() => {
        if (!showHint) return;
        const handleClickOutside = () => setShowHint(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showHint]);

    const handleToggle = () => {
        if (!disabled) {
            setIsExpanded(!isExpanded);
            onClick?.();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={className}
        >
            <div
                className={cn(
                    'rounded-xl transition-all duration-200',
                    'bg-card',
                    isActive && 'ring-2 ring-primary/50 shadow-sm',
                    isCompleted && !isActive && 'bg-green-50/50 dark:bg-green-950/20'
                )}
            >
                {/* Header - Always visible */}
                <button
                    type="button"
                    onClick={handleToggle}
                    className={cn(
                        'w-full flex items-center gap-3 p-3 text-left transition-colors',
                        'hover:bg-muted/50 rounded-xl',
                        disabled && 'cursor-default hover:bg-transparent'
                    )}
                >
                    {/* Question Number / Status */}
                    <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                        isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground'
                    )}>
                        {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            question.question_number
                        )}
                    </div>

                    {/* Question Text */}
                    <div className="flex-1 min-w-0">
                        <p className={cn(
                            'text-sm font-medium leading-snug',
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                            {question.question_text}
                        </p>
                        {isCompleted && audioUrl && !isExpanded && (
                            <span className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
                                <Mic className="w-3 h-3" /> Đã ghi âm
                            </span>
                        )}
                    </div>

                    {/* Hint button */}
                    {question.suggested_answer && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowHint(!showHint);
                            }}
                            className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors shrink-0"
                            aria-label="Xem gợi ý"
                        >
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                        </button>
                    )}

                    {/* Expand icon */}
                    {!disabled && (
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                        >
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                    )}
                </button>

                {/* Hint Tooltip */}
                <AnimatePresence>
                    {showHint && question.suggested_answer && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden px-3 pb-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 relative">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
                                        <Lightbulb className="w-3 h-3" /> Gợi ý
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setShowHint(false)}
                                        className="p-0.5 rounded hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                                    >
                                        <X className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                    </button>
                                </div>
                                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed whitespace-pre-wrap">
                                    {question.suggested_answer}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Expandable Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-3 pb-3 space-y-3">
                                {/* Audio Recorder - Only when active */}
                                {isActive && !disabled && (
                                    <div className="pt-2 border-t border-border/50">
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
                                    <div className="pt-2 border-t border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                                            <Mic className="w-3 h-3" /> Bài ghi âm của bạn:
                                        </p>
                                        <audio
                                            src={audioUrl}
                                            controls
                                            className="w-full h-9 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default SpeakingQuestionCard;
