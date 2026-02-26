/**
 * Khailingo - Speaking Practice Result Page
 * Trang xem chi tiết kết quả bài luyện giao tiếp
 */

"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock,
    Calendar,
    MessageSquare,
    AlertCircle,
    ChevronDown,
    FileText,
    Lightbulb,
    CheckCircle,
    Volume2,
    Sparkles,
    RefreshCw,
    User,
    Pause
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Badge
} from '@/components/ui';
import { useGetSpeakingAttemptDetail } from '@/hooks/use-speaking-attempt';
import LoadingCustom from '@/components/ui/loading-custom';
import { SpeakingAttemptDetailResponse, SpeakingAttemptDetailAnswer } from '@/types/speaking-attempt.type';
import dayjs from 'dayjs';
import { formatDuration } from '@/utils/funtions';
import { useUpdateAIAnalysis } from '@/hooks/use-speaking-answer';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants/querykey';

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
};

const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'destructive' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
};

const getScoreBgClass = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
};

// =====================================================
// ANALYSIS SECTION COMPONENT
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
        <div className="mb-2 sm:mb-3 last:mb-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-lg border transition-colors ${colorStyles[color]}`}
            >
                <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="font-medium text-xs">{title}</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                        {items.length}
                    </Badge>
                </div>
                <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-3 h-3" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1.5 space-y-1 pl-3"
                    >
                        {items.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="flex items-start gap-1.5 text-xs text-foreground"
                            >
                                <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${dotColors[color]}`} />
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
// ANSWER CARD COMPONENT
// =====================================================
interface AnswerCardProps {
    answer: SpeakingAttemptDetailAnswer;
    index: number;
}

function AnswerCard({ answer, index }: AnswerCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAiFix, setShowAiFix] = useState(false);
    const [isPlayingAiFix, setIsPlayingAiFix] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const hasTeacherFeedback = !!answer.teacher_feedback;
    const hasAIAnalysis = !!answer.ai_analysis;
    const hasFeedback = hasTeacherFeedback || hasAIAnalysis;
    const displayFeedback = hasTeacherFeedback ? 'teacher' : hasAIAnalysis ? 'ai' : null;

    const { mutate: updatedAnswer, isPending: isUpdatingAI } = useUpdateAIAnalysis();
    const queryClient = useQueryClient();

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            window.speechSynthesis.cancel(); // Dừng mọi âm thanh đang phát khi component unmount
        }
    }, []);

    const handleRequestAI = (answerId: string) => {
        updatedAnswer(answerId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.detail, answer.attempt_id] })
            }
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className={`overflow-hidden ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}>
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full text-left"
                >
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-3">
                            {/* Left: Question */}
                            <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs sm:text-sm font-bold text-primary">
                                        {answer.question.question_number}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium line-clamp-2">
                                        {answer.question.question_text}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        {answer.audio_url && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDuration(answer.duration_seconds)}
                                            </span>
                                        )}
                                        {displayFeedback === 'teacher' && (
                                            <Badge variant="secondary" className="text-[10px] h-4 gap-0.5">
                                                <User className="w-2.5 h-2.5" />
                                                Giáo viên
                                            </Badge>
                                        )}
                                        {displayFeedback === 'ai' && (
                                            <Badge variant="ghost" className="text-[10px] h-4 gap-0.5">
                                                <Sparkles className="w-2.5 h-2.5" />
                                                AI
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Score & Expand */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant={getScoreBadgeVariant(answer.score)} size="sm">
                                    {answer.score} điểm
                                </Badge>
                                <motion.span
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </motion.span>
                            </div>
                        </div>
                    </CardContent>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-border"
                        >
                            <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                                {/* Audio Player */}
                                {answer.audio_url && (
                                    <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">Bản ghi âm của bạn:</p>
                                        <audio
                                            controls
                                            src={answer.audio_url}
                                            className="w-full h-8 sm:h-10"
                                        />
                                    </div>
                                )}

                                {/* Teacher Feedback - Priority */}
                                {hasTeacherFeedback && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-700">
                                                Nhận xét của giáo viên
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground">
                                            {answer.teacher_feedback}
                                        </p>
                                    </div>
                                )}

                                {/* AI Analysis - Show if no teacher feedback */}
                                {!hasTeacherFeedback && hasAIAnalysis && answer.ai_analysis && (
                                    <div className="space-y-3">
                                        {/* Transcript */}
                                        {answer.ai_analysis.transcript && (
                                            <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <FileText className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-xs font-medium">Nội dung bạn nói:</span>
                                                </div>
                                                <p className="text-xs text-foreground leading-relaxed italic">
                                                    "{answer.ai_analysis.transcript}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Errors */}
                                        <AnalysisSection
                                            title="Lỗi cần sửa"
                                            icon={<AlertCircle className="w-3 h-3" />}
                                            items={answer.ai_analysis.error || []}
                                            color="red"
                                        />

                                        {/* Improvements */}
                                        <AnalysisSection
                                            title="Gợi ý cải thiện"
                                            icon={<Lightbulb className="w-3 h-3" />}
                                            items={answer.ai_analysis.improvement || []}
                                            color="amber"
                                        />

                                        {/* AI Fix */}
                                        {answer.ai_analysis.ai_fix && (
                                            <div className="pt-2 border-t border-border">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowAiFix(!showAiFix);
                                                    }}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                                                >
                                                    <CheckCircle className="w-3 h-3" />
                                                    {showAiFix ? 'Ẩn' : 'Xem bài mẫu đã sửa'}
                                                    <motion.span
                                                        animate={{ rotate: showAiFix ? 180 : 0 }}
                                                    >
                                                        <ChevronDown className="w-3 h-3" />
                                                    </motion.span>
                                                </button>

                                                <AnimatePresence>
                                                    {showAiFix && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                                                        >
                                                            <p className="text-xs text-foreground leading-relaxed">
                                                                {answer.ai_analysis.ai_fix}
                                                            </p>

                                                            {/*  */}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="mt-2 gap-1.5 text-green-600 h-7 text-xs"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if ('speechSynthesis' in window && answer.ai_analysis?.ai_fix) {
                                                                        if (isPlayingAiFix) {
                                                                            window.speechSynthesis.pause();
                                                                            setIsPlayingAiFix(false);
                                                                        } else {
                                                                            window.speechSynthesis.cancel(); // Dừng mọi âm thanh đang phát trước đó để tránh chồng chéo

                                                                            const utterance = new SpeechSynthesisUtterance(answer.ai_analysis.ai_fix);
                                                                            utterance.lang = 'en-US';
                                                                            utterance.rate = 0.9;

                                                                            utterance.onstart = () => { setIsPlayingAiFix(true); };
                                                                            utterance.onend = () => { setIsPlayingAiFix(false); };
                                                                            utterance.onerror = () => { setIsPlayingAiFix(false); };

                                                                            speechSynthesis.speak(utterance);
                                                                        }

                                                                    }
                                                                }}
                                                            >
                                                                {isPlayingAiFix ? <Pause className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                                                Nghe bài mẫu
                                                            </Button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* No feedback yet - Request AI Analysis */}
                                {!hasFeedback && (
                                    <div className="relative overflow-hidden rounded-lg border border-dashed border-primary/40 bg-gradient-to-br from-blue-50 to-purple-50/50 p-3">
                                        {/* Icon và Title */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
                                                    Phân tích AI miễn phí
                                                </h4>
                                                <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug mt-0.5">
                                                    Chỉ ra lỗi, gợi ý cải thiện chi tiết
                                                </p>
                                            </div>
                                        </div>

                                        {/* Button */}
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRequestAI(answer._id);
                                            }}
                                            disabled={isUpdatingAI || !answer.audio_url}
                                            className="w-full gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-8 text-xs sm:h-9 sm:text-sm"
                                            size="sm"
                                        >
                                            {isUpdatingAI ? (
                                                <>
                                                    <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                                    <span>Đang phân tích...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span>Yêu cầu phân tích ngay</span>
                                                </>
                                            )}
                                        </Button>

                                        {/* Warning nếu không có audio */}
                                        {!answer.audio_url && (
                                            <p className="text-[10px] sm:text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                                <span>Cần bản ghi âm để phân tích</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}

// =====================================================
// SPEAKING RESULT PAGE
// =====================================================
export default function SpeakingResultPage() {
    const params = useParams();
    const attemptId = params.attemptId as string;

    const { data: detailRes, isLoading } = useGetSpeakingAttemptDetail(attemptId);
    const detail: SpeakingAttemptDetailResponse | null = detailRes?.data || null;

    // =====================================================
    // LOADING STATE
    // =====================================================
    if (isLoading) {
        return <LoadingCustom />;
    }

    // =====================================================
    // NO DATA FOUND
    // =====================================================
    if (!detail) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center px-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h2>
                    <p className="text-muted-foreground mb-4">Bài làm này có thể đã bị xóa hoặc không tồn tại</p>
                    <Link href="/giao-tiep">
                        <Button>Quay lại danh sách</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { attempt, average_score } = detail;
    const exam = attempt.exam;
    const answers = attempt.answers || [];
    const answeredCount = answers.filter(a => a.audio_url).length || 0;

    // =====================================================
    // MAIN RENDER
    // =====================================================
    return (
        <div className="min-h-screen bg-background pb-20 sm:pb-6">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container-custom px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href={`/giao-tiep/lich-su/${exam._id}`}>
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base sm:text-xl font-bold text-foreground line-clamp-1">
                                Kết quả bài luyện
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                                {exam.title}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom px-3 sm:px-4 py-4 sm:py-6">
                {/* Score Summary Card */}
                <Card className={`mb-4 sm:mb-6 overflow-hidden border-2 ${getScoreBgClass(average_score)}`}>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            {/* Score Circle */}
                            <div className="flex-shrink-0">
                                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${average_score >= 80 ? 'border-green-500 bg-green-100' :
                                    average_score >= 60 ? 'border-amber-500 bg-amber-100' :
                                        'border-red-500 bg-red-100'
                                    } flex items-center justify-center`}>
                                    <div className="text-center">
                                        <span className={`text-2xl sm:text-3xl font-bold ${getScoreColor(average_score)}`}>
                                            {average_score}
                                        </span>
                                        <p className="text-xs text-muted-foreground">điểm</p>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">{exam.title}</h2>
                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                                    <Badge variant="secondary">{exam.topic}</Badge>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {dayjs(attempt.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        {answeredCount}/{answers.length} câu
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Answers List */}
                <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Chi tiết câu trả lời
                    </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {answers.map((answer, index) => (
                        <AnswerCard
                            key={answer._id}
                            answer={answer}
                            index={index}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}
