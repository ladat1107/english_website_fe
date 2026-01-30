/**
 * Khailingo - Video Script Display Component
 * Hiển thị kịch bản hội thoại với animation
 * Có thể ẩn/hiện transcript và translation
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { VideoScript } from '@/types/speaking.type';
import { Button } from '@/components/ui';

// =====================================================
// TYPES
// =====================================================
interface VideoScriptDisplayProps {
    scripts: VideoScript[];
    className?: string;
    defaultExpanded?: boolean;
    showTranslation?: boolean;
}

// =====================================================
// SPEAKER COLORS - Màu cho từng speaker
// =====================================================
const SPEAKER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Interviewer': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Candidate': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Waiter': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Customer': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Tourist': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Local': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    'Host': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Guest': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Receptionist': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    'Caller': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
    'Tech Support': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    // Default
    'A': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'B': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

const getColorForSpeaker = (speaker: string) => {
    return SPEAKER_COLORS[speaker] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
};

// =====================================================
// SINGLE SCRIPT LINE COMPONENT
// =====================================================
interface ScriptLineProps {
    script: VideoScript;
    index: number;
    showTranslation: boolean;
}

const ScriptLine = ({ script, index, showTranslation }: ScriptLineProps) => {
    const colors = getColorForSpeaker(script.speaker);
    const isLeft = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={cn(
                'flex gap-3',
                !isLeft && 'flex-row-reverse'
            )}
        >
            {/* Avatar / Speaker Initial */}
            <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
                colors.bg,
                colors.text
            )}>
                {script.speaker.charAt(0).toUpperCase()}
            </div>

            {/* Content */}
            <div className={cn(
                'flex-1 max-w-[85%]',
                !isLeft && 'flex flex-col items-end'
            )}>
                {/* Speaker Name */}
                <span className={cn(
                    'text-xs font-medium mb-1',
                    colors.text
                )}>
                    {script.speaker}
                </span>

                {/* Message Bubble */}
                <div className={cn(
                    'rounded-2xl p-3 md:p-4 border',
                    colors.bg,
                    colors.border,
                    isLeft ? 'rounded-tl-sm' : 'rounded-tr-sm'
                )}>
                    {/* English content */}
                    <p className="text-foreground text-sm md:text-base leading-relaxed">
                        {script.content}
                    </p>

                    {/* Translation */}
                    <AnimatePresence>
                        {showTranslation && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-muted-foreground text-xs md:text-sm mt-2 pt-2 border-t border-dashed border-current/20 italic"
                            >
                                {script.translation}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// =====================================================
// VIDEO SCRIPT DISPLAY COMPONENT
// =====================================================
export function VideoScriptDisplay({
    scripts,
    className,
    defaultExpanded = true,
    showTranslation: initialShowTranslation = true,
}: VideoScriptDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [showTranslation, setShowTranslation] = useState(initialShowTranslation);

    if (!scripts || scripts.length === 0) {
        return null;
    }

    return (
        <div className={cn('w-full hidden', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
                >
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span>Kịch bản hội thoại</span>
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.span>
                </button>

                {/* Toggle Translation */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="text-muted-foreground"
                >
                    {showTranslation ? (
                        <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Ẩn dịch</span>
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Hiện dịch</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Scripts Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
                            {scripts.map((script, index) => (
                                <ScriptLine
                                    key={index}
                                    script={script}
                                    index={index}
                                    showTranslation={showTranslation}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default VideoScriptDisplay;
