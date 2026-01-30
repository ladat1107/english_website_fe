/**
 * Khailingo - AI Analysis Card Component
 * Hiển thị kết quả phân tích AI cho bài nói
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    ChevronDown,
    FileText,
    AlertCircle,
    Lightbulb,
    CheckCircle,
    Volume2,
    Loader2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { AIAnalysis } from '@/types/speaking.type';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';

// =====================================================
// TYPES
// =====================================================
interface AIAnalysisCardProps {
    analysis?: AIAnalysis;
    audioUrl?: string;
    isLoading?: boolean;
    onRequestAnalysis?: () => void;
    className?: string;
}

// =====================================================
// SECTION COMPONENT
// =====================================================
interface AnalysisSectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
    color: 'blue' | 'red' | 'green' | 'amber';
    defaultExpanded?: boolean;
}

const AnalysisSection = ({ title, icon, items, color, defaultExpanded = true }: AnalysisSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const colorStyles = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        red: 'bg-red-50 border-red-200 text-red-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
    };

    const dotColors = {
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        amber: 'bg-amber-500',
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="mb-3 sm:mb-4 last:mb-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg border transition-colors',
                    colorStyles[color]
                )}
            >
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {icon}
                    <span className="font-medium text-xs sm:text-sm">{title}</span>
                    <Badge variant="secondary" className="text-xs h-5">
                        {items.length}
                    </Badge>
                </div>
                <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1.5 sm:mt-2 space-y-1.5 sm:space-y-2 pl-3 sm:pl-4"
                    >
                        {items.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-foreground"
                            >
                                <span className={cn(
                                    'w-1.5 h-1.5 rounded-full mt-1.5 sm:mt-2 shrink-0',
                                    dotColors[color]
                                )} />
                                {item}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

// =====================================================
// AI ANALYSIS CARD COMPONENT
// =====================================================
export function AIAnalysisCard({
    analysis,
    audioUrl,
    isLoading = false,
    onRequestAnalysis,
    className,
}: AIAnalysisCardProps) {
    const [showAiFix, setShowAiFix] = useState(false);

    // Chưa có analysis và chưa loading
    if (!analysis && !isLoading) {
        return (
            <Card className={cn('border-dashed', className)}>
                <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
                        Phân tích AI
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                        Sử dụng AI để phân tích bài nói của bạn, nhận gợi ý cải thiện phát âm và ngữ pháp.
                    </p>
                    {audioUrl && (
                        <Button
                            variant="default"
                            onClick={onRequestAnalysis}
                            className="gap-2 h-9 sm:h-10 text-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            Phân tích bằng AI
                        </Button>
                    )}
                    {!audioUrl && (
                        <p className="text-xs text-muted-foreground">
                            Vui lòng ghi âm trước khi yêu cầu phân tích
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <Card className={className}>
                <CardContent className="p-4 sm:p-6 text-center">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">
                        AI đang phân tích bài nói của bạn...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2">
                        Quá trình này có thể mất vài giây
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Has analysis
    return (
        <Card className={className}>
            <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Kết quả phân tích AI
                </CardTitle>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4">
                {/* Transcript */}
                {analysis?.transcript && (
                    <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                            <span className="text-xs sm:text-sm font-medium">Nội dung bạn nói:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                            "{analysis.transcript}"
                        </p>
                    </div>
                )}

                {/* Errors */}
                <AnalysisSection
                    title="Lỗi cần sửa"
                    icon={<AlertCircle className="w-4 h-4" />}
                    items={analysis?.error || []}
                    color="red"
                />

                {/* Improvements */}
                <AnalysisSection
                    title="Gợi ý cải thiện"
                    icon={<Lightbulb className="w-4 h-4" />}
                    items={analysis?.improvement || []}
                    color="amber"
                />

                {/* AI Fix */}
                {analysis?.ai_fix && (
                    <div className="pt-4 border-t border-border">
                        <button
                            onClick={() => setShowAiFix(!showAiFix)}
                            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {showAiFix ? 'Ẩn bài mẫu AI' : 'Xem bài mẫu AI đã sửa'}
                            <motion.span
                                animate={{ rotate: showAiFix ? 180 : 0 }}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </motion.span>
                        </button>

                        <AnimatePresence>
                            {showAiFix && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 p-4 bg-success/10 border border-success/30 rounded-lg"
                                >
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {analysis.ai_fix}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-3 gap-2 text-success"
                                        onClick={() => {
                                            // Mock text-to-speech
                                            if ('speechSynthesis' in window) {
                                                const utterance = new SpeechSynthesisUtterance(analysis.ai_fix);
                                                utterance.lang = 'en-US';
                                                utterance.rate = 0.9;
                                                speechSynthesis.speak(utterance);
                                            }
                                        }}
                                    >
                                        <Volume2 className="w-4 h-4" />
                                        Nghe bài mẫu
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default AIAnalysisCard;
