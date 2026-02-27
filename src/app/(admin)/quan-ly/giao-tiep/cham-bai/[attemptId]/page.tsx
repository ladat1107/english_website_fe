/**
 * Khailingo - Admin Speaking Grading Detail Page
 * Trang chấm bài chi tiết
 */

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Volume2,
    ChevronDown,
    ChevronUp,
    Save,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    Lightbulb,
    XCircle,
    Sparkles,
    RefreshCw,
    Loader2,
    BookCheck,
} from 'lucide-react';
import {
    Button,
    Input,
    Card,
    CardContent,
    Badge,
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui';
import { Textarea } from '@/components/ui/input';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import {
    SpeakingAnswerType,
    SpeakingAttemptAvg,
} from '@/types/speaking-attempt.type';
import { useGetSpeakingAttemptById } from '@/hooks/use-speaking-attempt';
import { useUpdateAIAnalysis, useUpdateSpeakingAnswer } from '@/hooks/use-speaking-answer';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toaster';
import { formatDuration, getNameAvatar, getScoreBadgeVariant } from '@/utils/funtions';
import dayjs from 'dayjs';

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

interface AnalysisSectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
    color: 'blue' | 'red' | 'green' | 'amber';
}

function AnalysisSection({ title, icon, items, color }: AnalysisSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

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
        <div className="mb-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                    colorStyles[color]
                )}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                    <Badge variant="outline" size="sm" className="ml-1">
                        {items.length}
                    </Badge>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <ul className="pt-2 pl-4 space-y-1">
                            {items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                    <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", dotColors[color])} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =====================================================
// ANSWER GRADING CARD COMPONENT
// =====================================================
interface AnswerGradingCardProps {
    answer: SpeakingAnswerType;
    index: number;
    onGradeSuccess: () => void;
}

function AnswerGradingCard({ answer, index, onGradeSuccess }: AnswerGradingCardProps) {
    const [isExpanded, setIsExpanded] = useState(index === 0);
    const [score, setScore] = useState(answer.score?.toString() || '0');
    const [feedback, setFeedback] = useState(answer.teacher_feedback || '');
    const [isEditing, setIsEditing] = useState(false);

    const { mutate: updateAnswer, isPending: isUpdating } = useUpdateSpeakingAnswer();
    const { mutate: updateAI, isPending: isUpdatingAI } = useUpdateAIAnalysis();
    const { addToast } = useToast();

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            window.speechSynthesis.cancel(); // Dừng tất cả các giọng nói đang phát nếu có khi component unmount
        };
    }, [audioRef])

    const hasAIAnalysis = !!answer.ai_analysis;
    const hasTeacherFeedback = !!answer.teacher_feedback;

    const handleSave = () => {
        updateAnswer(
            {
                answerId: answer._id,
                data: {
                    score: parseInt(score) || 0,
                    teacher_feedback: feedback,
                },
            },
            {
                onSuccess: () => {
                    addToast('Lưu chấm điểm thành công', 'success');
                    setIsEditing(false);
                    onGradeSuccess();
                },
                onError: () => {
                    addToast('Có lỗi xảy ra khi lưu', 'error');
                },
            }
        );
    };

    const handleRequestAI = () => {
        updateAI(answer._id, {
            onSuccess: () => {
                addToast('Đang phân tích bằng AI...', 'info');
                onGradeSuccess();
            },
            onError: () => {
                addToast('Có lỗi xảy ra', 'error');
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className={cn(
                "transition-all",
                isExpanded && "ring-2 ring-primary/20"
            )}>
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center justify-between text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            answer.audio_url ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            {answer.question.question_number}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm sm:text-base truncate">
                                {answer.question.question_text}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                {answer.audio_url && (
                                    <Badge variant="ghost" size="sm">
                                        <Volume2 className="w-3 h-3 mr-1" />
                                        {formatDuration(answer.duration_seconds)}
                                    </Badge>
                                )}
                                {hasTeacherFeedback && (
                                    <Badge variant="success" size="sm">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Đã chấm
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant={getScoreBadgeVariant(answer.score)} size="lg">
                            {answer.score} điểm
                        </Badge>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </button>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <CardContent className="pt-0 pb-4 border-t">
                                {/* Audio Player */}
                                {answer.audio_url ? (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Bản ghi âm của học viên:
                                        </p>

                                        <audio
                                            src={answer.audio_url}
                                            controls
                                            className="w-full rounded-lg bg-muted/50 h-8 sm:h-10"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Học viên chưa ghi âm câu trả lời này
                                        </p>
                                    </div>
                                )}

                                {/* AI Analysis */}
                                {hasAIAnalysis && answer.ai_analysis && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                Phân tích AI
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRequestAI}
                                                disabled={isUpdatingAI}
                                            >
                                                <RefreshCw className={cn("w-3 h-3 mr-1", isUpdatingAI && "animate-spin")} />
                                                Phân tích lại
                                            </Button>
                                        </div>

                                        {/* Transcript */}
                                        {answer.ai_analysis.transcript && (
                                            <div className="p-3 bg-muted/50 rounded-lg mb-3">
                                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                                    Nội dung ghi âm:
                                                </p>
                                                <p className="text-sm text-foreground italic">
                                                    "{answer.ai_analysis.transcript}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Analysis Sections */}
                                        <AnalysisSection
                                            title="Lỗi sai"
                                            icon={<XCircle className="w-4 h-4" />}
                                            items={answer.ai_analysis.error || []}
                                            color="red"
                                        />
                                        <AnalysisSection
                                            title="Gợi ý cải thiện"
                                            icon={<Lightbulb className="w-4 h-4" />}
                                            items={answer.ai_analysis.improvement || []}
                                            color="amber"
                                        />

                                        {/* AI Fix */}
                                        {answer.ai_analysis.ai_fix && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Câu trả lời gợi ý:
                                                </p>
                                                <p className="text-sm text-green-800">
                                                    "{answer.ai_analysis.ai_fix}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Request AI Analysis Button */}
                                {!hasAIAnalysis && answer.audio_url && (
                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={handleRequestAI}
                                            disabled={isUpdatingAI}
                                        >
                                            <Sparkles className={cn("w-4 h-4 mr-2", isUpdatingAI && "animate-pulse")} />
                                            {isUpdatingAI ? 'Đang phân tích...' : 'Yêu cầu AI phân tích'}
                                        </Button>
                                    </div>
                                )}

                                {/* Grading Section */}
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                            Chấm điểm & Nhận xét
                                        </p>
                                        {!isEditing && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-3">
                                            {/* Score Input */}
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground block mb-1">
                                                    Điểm số (0-100)
                                                </label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={score}
                                                    onChange={(e) => setScore(e.target.value)}
                                                    className="w-32"
                                                />
                                            </div>

                                            {/* Feedback Input */}
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground block mb-1">
                                                    Nhận xét của giáo viên
                                                </label>
                                                <Textarea
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                    placeholder="Nhập nhận xét cho học viên..."
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={isUpdating}
                                                    size="sm"
                                                >
                                                    {isUpdating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                                                    {isUpdating ? 'Đang lưu...' : 'Lưu'}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setScore(answer.score?.toString() || '0');
                                                        setFeedback(answer.teacher_feedback || '');
                                                    }}
                                                >
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className={cn(
                                                "p-3 rounded-lg border",
                                                getScoreBgClass(answer.score)
                                            )}>
                                                <p className={cn("text-2xl font-bold", getScoreColor(answer.score))}>
                                                    {answer.score} / 100
                                                </p>
                                            </div>
                                            {answer.teacher_feedback && (
                                                <div className="p-3 bg-muted/50 rounded-lg">
                                                    <p className="text-sm text-foreground">
                                                        {answer.teacher_feedback}
                                                    </p>
                                                </div>
                                            )}
                                            {!answer.teacher_feedback && (
                                                <p className="text-sm text-muted-foreground italic">
                                                    Chưa có nhận xét của giáo viên
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}

// =====================================================
// MAIN PAGE COMPONENT
// =====================================================
export default function AdminSpeakingGradingDetailPage() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const queryClient = useQueryClient();

    // Fetch data
    const { data: detailRes, isLoading } = useGetSpeakingAttemptById(attemptId);
    const detail: SpeakingAttemptAvg | null = detailRes?.data || null;

    const handleGradeSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.getById, attemptId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.getAll] });
    };

    // Loading state
    if (isLoading) {
        return <LoadingCustom className="min-h-screen" />;
    }

    // Not found state
    if (!detail) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                    <h2 className="text-lg font-semibold mb-2">Không tìm thấy bài làm</h2>
                    <p className="text-muted-foreground mb-4">
                        Bài làm này có thể đã bị xóa hoặc không tồn tại
                    </p>
                    <Link href={PATHS.ADMIN.SPEAKING_GRADING}>
                        <Button>Quay lại danh sách</Button>
                    </Link>
                </div>
            </div>
        );
    }


    const exam = detail?.exam;
    const user = detail?.user;
    const answers = detail?.answers || [];

    return (
        <div className="min-h-screen bg-background pb-8">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-3 sm:px-4 py-2">
                    <div className="flex items-center gap-3">
                        <Link href={PATHS.ADMIN.SPEAKING_GRADING}>
                            <Button variant="ghost" size="icon-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <BookCheck className="w-5 h-5 text-primary" />
                                Chấm bài
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                {exam?.title}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* User & Exam Info Card */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <Avatar size="lg">
                                            <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                                            <AvatarFallback>
                                                {getNameAvatar(user?.full_name || 'U')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className="font-semibold text-foreground">
                                                {user?.full_name || 'Unknown User'}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className={cn(
                                        "p-4 rounded-lg border text-center",
                                        getScoreBgClass(detail?.average_score || 0)
                                    )}>
                                        <p className={cn("text-3xl font-bold", getScoreColor(detail?.average_score || 0))}>
                                            {detail?.average_score || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Điểm TB</p>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                                    <Badge variant="ghost">
                                        {exam?.topic}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        {dayjs(detail?.submitted_at || detail?.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        {exam?.estimated_duration_minutes} phút
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Answers List */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">
                                Câu trả lời ({answers.length} câu)
                            </h3>
                            {answers.map((answer, index) => (
                                <AnswerGradingCard
                                    key={answer._id}
                                    answer={answer}
                                    index={index}
                                    onGradeSuccess={handleGradeSuccess}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">

                        {/* Exam Info */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-foreground mb-3">
                                    Thông tin đề
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Tiêu đề</p>
                                        <p className="font-medium">{exam?.title}</p>
                                    </div>
                                    {exam?.description && (
                                        <div>
                                            <p className="text-muted-foreground">Mô tả</p>
                                            <p className="text-foreground">{exam.description}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-muted-foreground">Số câu hỏi</p>
                                        <p className="font-medium">{exam?.questions?.length || 0} câu</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
