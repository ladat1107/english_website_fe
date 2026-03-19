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
    Pause,
    Mic,
    MicOff
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Badge
} from '@/components/ui';
import { MultipleChoiceSection } from '@/components/speaking';
import { useGetSpeakingAttemptDetail } from '@/hooks/use-speaking-attempt';
import LoadingCustom from '@/components/ui/loading-custom';
import { SpeakingAttemptDetailResponse, SpeakingAnswerType } from '@/types/speaking-attempt.type';
import dayjs from 'dayjs';
import { formatDuration, getScoreBadgeVariant } from '@/utils/funtions';
import { useUpdateAIAnalysis } from '@/hooks/use-speaking-answer';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { PATHS } from '@/utils/constants';
import { useSpeakingExamStore } from '@/stores/speaking-exam.strore';

// =====================================================
// HELPERS
// =====================================================
const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
};

const getScoreBgClass = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
};

const getScoreRingClass = (score: number) => {
    if (score >= 80) return 'border-green-500 bg-green-100';
    if (score >= 60) return 'border-amber-500 bg-amber-100';
    return 'border-red-500 bg-red-100';
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
// ANSWER DETAIL PANEL — used in right panel (desktop) & expanded card (mobile)
// =====================================================
interface AnswerDetailProps {
    answer: SpeakingAnswerType;
}

function AnswerDetail({ answer }: AnswerDetailProps) {
    const [showAiFix, setShowAiFix] = useState(false);
    const [isPlayingAiFix, setIsPlayingAiFix] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const hasTeacherFeedback = !!answer.teacher_feedback;
    const hasAIAnalysis = !!answer.ai_analysis;
    const hasFeedback = hasTeacherFeedback || hasAIAnalysis;

    const { mutate: updatedAnswer, isPending: isUpdatingAI } = useUpdateAIAnalysis();
    const queryClient = useQueryClient();

    useEffect(() => {
        setShowAiFix(false);
        setIsPlayingAiFix(false);
        window.speechSynthesis.cancel();
    }, [answer._id]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleRequestAI = (answerId: string) => {
        updatedAnswer(answerId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.detail, answer.attempt_id] });
            }
        });
    };

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Question header */}
            <div className="hidden sm:flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                        {answer.question.question_number}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug">{answer.question.question_text}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getScoreBadgeVariant(answer.score)} size="sm">
                            {answer.score} điểm
                        </Badge>
                        {answer.audio_url && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {formatDuration(answer.duration_seconds)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Audio */}
            {answer.audio_url ? (
                <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Mic className="w-3 h-3" /> Bản ghi âm của bạn:
                    </p>
                    <audio ref={audioRef} controls src={answer.audio_url} className="w-full h-9" />
                </div>
            ) : (
                <div className="p-3 bg-muted/30 rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                    <MicOff className="w-3.5 h-3.5" />
                    Không có bản ghi âm cho câu này
                </div>
            )}

            {/* Teacher Feedback */}
            {hasTeacherFeedback && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Nhận xét của giáo viên</span>
                    </div>
                    <p className="text-sm text-foreground">{answer.teacher_feedback}</p>
                </div>
            )}

            {/* AI Analysis */}
            {!hasTeacherFeedback && hasAIAnalysis && answer.ai_analysis && (
                <div className="space-y-3">
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

                    <AnalysisSection
                        title="Lỗi cần sửa"
                        icon={<AlertCircle className="w-3 h-3" />}
                        items={answer.ai_analysis.error || []}
                        color="red"
                    />
                    <AnalysisSection
                        title="Gợi ý cải thiện"
                        icon={<Lightbulb className="w-3 h-3" />}
                        items={answer.ai_analysis.improvement || []}
                        color="amber"
                    />

                    {answer.ai_analysis.ai_fix && (
                        <div className="pt-2 border-t border-border">
                            <button
                                onClick={() => setShowAiFix(!showAiFix)}
                                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                            >
                                <CheckCircle className="w-3 h-3" />
                                {showAiFix ? 'Ẩn' : 'Xem bài mẫu đã sửa'}
                                <motion.span animate={{ rotate: showAiFix ? 180 : 0 }}>
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
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 gap-1.5 text-green-600 h-7 text-xs"
                                            onClick={() => {
                                                if ('speechSynthesis' in window && answer.ai_analysis?.ai_fix) {
                                                    if (isPlayingAiFix) {
                                                        window.speechSynthesis.pause();
                                                        setIsPlayingAiFix(false);
                                                    } else {
                                                        window.speechSynthesis.cancel();
                                                        const utterance = new SpeechSynthesisUtterance(answer.ai_analysis.ai_fix);
                                                        utterance.lang = 'en-US';
                                                        utterance.rate = 0.9;
                                                        utterance.onstart = () => setIsPlayingAiFix(true);
                                                        utterance.onend = () => setIsPlayingAiFix(false);
                                                        utterance.onerror = () => setIsPlayingAiFix(false);
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

            {/* No feedback — Request AI */}
            {!hasFeedback && (
                <div className="relative overflow-hidden rounded-lg border border-dashed border-primary/40 bg-gradient-to-br from-blue-50 to-purple-50/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
                                Phân tích AI miễn phí
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                Chỉ ra lỗi, gợi ý cải thiện chi tiết
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => handleRequestAI(answer._id)}
                        disabled={isUpdatingAI || !answer.audio_url}
                        className="w-full gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-8 text-xs sm:h-9 sm:text-sm"
                        size="sm"
                    >
                        {isUpdatingAI ? (
                            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Đang phân tích...</span></>
                        ) : (
                            <><Sparkles className="w-3.5 h-3.5" /><span>Yêu cầu phân tích ngay</span></>
                        )}
                    </Button>
                    {!answer.audio_url && (
                        <p className="text-[10px] sm:text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                            <span>Cần bản ghi âm để phân tích</span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// =====================================================
// ANSWER CARD — mobile only (accordion)
// =====================================================
interface AnswerCardProps {
    answer: SpeakingAnswerType;
    index: number;
}

function AnswerCard({ answer, index }: AnswerCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasTeacherFeedback = !!answer.teacher_feedback;
    const hasAIAnalysis = !!answer.ai_analysis;
    const displayFeedback = hasTeacherFeedback ? 'teacher' : hasAIAnalysis ? 'ai' : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className={`overflow-hidden ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}>
                <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left">
                    <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 min-w-0 flex-1">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary">
                                        {answer.question.question_number}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium line-clamp-2">
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
                                                <User className="w-2.5 h-2.5" /> Giáo viên
                                            </Badge>
                                        )}
                                        {displayFeedback === 'ai' && (
                                            <Badge variant="ghost" className="text-[10px] h-4 gap-0.5">
                                                <Sparkles className="w-2.5 h-2.5" /> AI
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant={getScoreBadgeVariant(answer.score)} size="sm">
                                    {answer.score} điểm
                                </Badge>
                                <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </motion.span>
                            </div>
                        </div>
                    </CardContent>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-border"
                        >
                            <CardContent className="p-3">
                                <AnswerDetail answer={answer} />
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}

// =====================================================
// DESKTOP: LEFT PANEL — question list item
// =====================================================
interface QuestionListItemProps {
    answer: SpeakingAnswerType;
    index: number;
    isSelected: boolean;
    onClick: () => void;
}

function QuestionListItem({ answer, isSelected, onClick, index }: QuestionListItemProps) {
    const hasTeacherFeedback = !!answer.teacher_feedback;
    const hasAIAnalysis = !!answer.ai_analysis;
    const displayFeedback = hasTeacherFeedback ? 'teacher' : hasAIAnalysis ? 'ai' : null;

    return (
        <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={onClick}
            className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all duration-200 group
                ${isSelected
                    ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/30'
                    : 'bg-card border-border hover:bg-muted/60 hover:border-border'
                }`}
        >
            <div className="flex items-start gap-2.5">
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    {answer.question.question_number}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-2 leading-snug">
                        {answer.question.question_text}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge variant={getScoreBadgeVariant(answer.score)} size="sm" className="text-[10px] h-4">
                            {answer.score} điểm
                        </Badge>
                        {!answer.audio_url && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <MicOff className="w-2.5 h-2.5" /> Không có âm
                            </span>
                        )}
                        {displayFeedback === 'teacher' && (
                            <Badge variant="secondary" className="text-[10px] h-4 gap-0.5">
                                <User className="w-2.5 h-2.5" /> GV
                            </Badge>
                        )}
                        {displayFeedback === 'ai' && (
                            <Badge variant="ghost" className="text-[10px] h-4 gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> AI
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

// =====================================================
// SPEAKING RESULT PAGE
// =====================================================
export default function SpeakingResultPage() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const { type } = useSpeakingExamStore();
    const { data: detailRes, isLoading } = useGetSpeakingAttemptDetail(attemptId);
    const detail: SpeakingAttemptDetailResponse | null = detailRes?.data || null;

    // Desktop: selected answer index
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'speaking' | 'multiple-choice'>('speaking');

    if (isLoading) return <LoadingCustom />;

    if (!detail) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center px-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h2>
                    <p className="text-muted-foreground mb-4">Bài làm này có thể đã bị xóa hoặc không tồn tại</p>
                    <Link href={PATHS.CLIENT.SPEAKING(type)}>
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
    const selectedAnswer = answers[selectedIndex] ?? null;

    // Multiple choice results
    const multipleChoiceQuestions = exam.multiple_choice_questions || [];
    const multipleChoiceAnswers = attempt.multiple_choice_answers || [];
    const mcCorrectCount = multipleChoiceAnswers.filter(ans => {
        const question = multipleChoiceQuestions.find(q => q.question_number === ans.question_number);
        return question && ans.selected_option === question.correct_option;
    }).length;

    // =====================================================
    // MAIN RENDER
    // =====================================================
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* ── Header ── */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container-custom px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href={PATHS.CLIENT.SPEAKING_HISTORY(exam._id)}>
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

            {/* ── Body ── */}
            <div className="flex-1 container-custom px-3 sm:px-4 py-4 sm:py-6 w-full">

                {/* ════════════════════════════════════
                    MOBILE LAYOUT (< lg)
                ════════════════════════════════════ */}
                <div className="sm:hidden space-y-4">
                    {/* Score summary */}
                    <Card className={`overflow-hidden border-2 ${getScoreBgClass(average_score)}`}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex-shrink-0 w-20 h-20 rounded-full border-4 ${getScoreRingClass(average_score)} flex items-center justify-center`}>
                                    <div className="text-center">
                                        <span className={`text-2xl font-bold ${getScoreColor(average_score)}`}>{average_score}</span>
                                        <p className="text-xs text-muted-foreground">điểm</p>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-sm font-semibold mb-1 line-clamp-2">{exam.title}</h2>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="secondary">{exam.topic}</Badge>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {dayjs(attempt.createdAt).format('DD/MM/YYYY HH:mm')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            {answeredCount}/{attempt.exam.questions.length} câu
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Answers accordion */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            Chi tiết câu trả lời
                        </h3>
                        <div className="space-y-2">
                            {answers.map((answer, index) => (
                                <AnswerCard key={answer._id} answer={answer} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* Multiple Choice Results */}
                    {multipleChoiceQuestions.length > 0 && (
                        <Card className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold">Kết quả trắc nghiệm</h3>
                                    <Badge variant={mcCorrectCount === multipleChoiceQuestions.length ? "success" : "secondary"}>
                                        {mcCorrectCount}/{multipleChoiceQuestions.length} đúng
                                    </Badge>
                                </div>
                                <MultipleChoiceSection
                                    questions={multipleChoiceQuestions}
                                    answers={multipleChoiceAnswers}
                                    onSelectOption={() => { }}
                                    disabled={true}
                                    showResult={true}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ════════════════════════════════════
                    DESKTOP LAYOUT (≥ lg) — split panel
                ════════════════════════════════════ */}
                {/* h-[calc(100vh-88px)] */}
                <div className="hidden sm:grid sm:grid-cols-[250px_1fr] md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr] gap-6  w-full"> 

                    {/* ── LEFT PANEL ── */}
                    <div className="flex flex-col gap-4 min-h-0 w-full">

                        {/* Score summary */}
                        <Card className={`border-2 flex-shrink-0 ${getScoreBgClass(average_score)}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 ${getScoreRingClass(average_score)} flex items-center justify-center`}>
                                        <div className="text-center">
                                            <span className={`text-xl font-bold ${getScoreColor(average_score)}`}>{average_score}</span>
                                            <p className="text-[10px] text-muted-foreground">điểm</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm font-semibold mb-1 line-clamp-2">{exam.title}</h2>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                                <Badge variant="secondary" className="text-[10px]">{exam.topic}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {dayjs(attempt.createdAt).format('DD/MM/YYYY HH:mm')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MessageSquare className="w-3 h-3" />
                                                {answeredCount}/{attempt.exam.questions.length} câu đã trả lời
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tôi muốn tạo 2 nút là 2 chế độ  */}
                        <div className='hidden md:flex items-center gap-2'>
                            <Button
                                size={'sm'}
                                variant={viewMode === 'speaking' ? 'default' : 'outline'}
                                onClick={() => setViewMode('speaking')}
                            >
                                Luyện nói
                            </Button>
                            <Button
                                variant={viewMode === 'multiple-choice' ? 'default' : 'outline'}
                                size={'sm'}
                                onClick={() => setViewMode('multiple-choice')}
                            >
                                Trắc nghiệm
                            </Button>
                        </div>
                        {/* Question list — scrollable */}
                        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-0.5">
                                Danh sách câu hỏi
                            </p>
                            <div className="space-y-1.5">
                                {answers.map((answer, index) => (
                                    <QuestionListItem
                                        key={answer._id}
                                        answer={answer}
                                        index={index}
                                        isSelected={selectedIndex === index}
                                        onClick={() => setSelectedIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div className="w-full space-y-4"> {/* nếu có sai CSS gì thì thêm overflow-y-auto */}
                        <AnimatePresence mode="wait">
                            {
                                viewMode === 'speaking' ?
                                    selectedAnswer ? (
                                        <motion.div
                                            key={selectedAnswer._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card className="h-full">
                                                <CardContent className="p-5">
                                                    <AnswerDetail answer={selectedAnswer} />
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full flex items-center justify-center text-muted-foreground text-sm"
                                        >
                                            Chọn một câu hỏi để xem kết quả
                                        </motion.div>
                                    ) :
                                    multipleChoiceQuestions.length > 0 && viewMode === 'multiple-choice' && (
                                        <Card className="overflow-y-visible">
                                            <CardContent className="p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-sm font-semibold">Kết quả trắc nghiệm</h3>
                                                    <Badge variant={mcCorrectCount === multipleChoiceQuestions.length ? "success" : "secondary"}>
                                                        {mcCorrectCount}/{multipleChoiceQuestions.length} đúng
                                                    </Badge>
                                                </div>
                                                <MultipleChoiceSection
                                                    questions={multipleChoiceQuestions}
                                                    answers={multipleChoiceAnswers}
                                                    onSelectOption={() => { }}
                                                    disabled={true}
                                                    showResult={true}
                                                />
                                            </CardContent>
                                        </Card>
                                    )
                            }
                        </AnimatePresence>

                        {multipleChoiceQuestions.length > 0 && (
                            <Card className="md:hidden overflow-hidden">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold">Kết quả trắc nghiệm</h3>
                                        <Badge variant={mcCorrectCount === multipleChoiceQuestions.length ? "success" : "secondary"}>
                                            {mcCorrectCount}/{multipleChoiceQuestions.length} đúng
                                        </Badge>
                                    </div>
                                    <MultipleChoiceSection
                                        questions={multipleChoiceQuestions}
                                        answers={multipleChoiceAnswers}
                                        onSelectOption={() => { }}
                                        disabled={true}
                                        showResult={true}
                                    />
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}