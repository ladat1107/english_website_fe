/**
 * Khailingo - Speaking Practice History Page
 * Trang xem lịch sử làm bài giao tiếp
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock,
    Calendar,
    MessageSquare,
    Trophy,
    ChevronRight,
    History,
    AlertCircle,
    Play
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Badge
} from '@/components/ui';
import { useGetSpeakingAttemptHistory } from '@/hooks/use-speaking-attempt';
import { useGetSpeakingExamById } from '@/hooks/use-speaking-exam';
import LoadingCustom from '@/components/ui/loading-custom';
import { SpeakingAttemptAvg } from '@/types/speaking-attempt.type';
import dayjs from 'dayjs';
import { getScoreBadgeVariant } from '@/utils/funtions';


// =====================================================
// ATTEMPT HISTORY CARD COMPONENT
// =====================================================
interface AttemptHistoryCardProps {
    attempt: SpeakingAttemptAvg;
    index: number;
}

function AttemptHistoryCard({ attempt, index }: AttemptHistoryCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/giao-tiep/ket-qua/${attempt._id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30"
                onClick={handleClick}
            >
                <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left: Attempt info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Attempt number badge */}
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs sm:text-sm font-bold text-primary">
                                    #{index + 1}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {dayjs(attempt.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{attempt.answered_count}/{attempt.exam.questions.length} câu đã trả lời</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Score & Arrow */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {/* Score */}
                            <div className="text-right">
                                <Badge variant={getScoreBadgeVariant(attempt.average_score)} size="lg">
                                    <Trophy className="w-3 h-3 mr-1" />
                                    {attempt.average_score} điểm
                                </Badge>
                            </div>

                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// =====================================================
// SPEAKING HISTORY PAGE
// =====================================================
export default function SpeakingHistoryPage() {
    const params = useParams();
    const examId = params.examId as string;

    const { data: examRes, isLoading: isExamLoading } = useGetSpeakingExamById(examId);
    const { data: historyRes, isLoading: isHistoryLoading } = useGetSpeakingAttemptHistory(examId);

    const exam = examRes?.data;
    const attempts: SpeakingAttemptAvg[] = historyRes?.data || [];

    const isLoading = isExamLoading || isHistoryLoading;

    if (isLoading) {
        return <LoadingCustom />;
    }

    // =====================================================
    // NO EXAM FOUND
    // =====================================================
    if (!exam) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center px-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Không tìm thấy bài luyện</h2>
                    <p className="text-muted-foreground mb-4">Bài luyện này có thể đã bị xóa hoặc không tồn tại</p>
                    <Link href="/giao-tiep">
                        <Button>Quay lại danh sách</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // =====================================================
    // MAIN RENDER
    // =====================================================
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container-custom px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href="/giao-tiep">
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base sm:text-xl font-bold text-foreground line-clamp-1">
                                Lịch sử làm bài
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
                {/* Exam Info Card */}
                <Card className="mb-4 sm:mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2">{exam.title}</h2>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                                    <Badge variant="secondary">{exam.topic}</Badge>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {exam.estimated_duration_minutes} phút
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        {exam.questions?.length || 0} câu
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* History List */}
                {attempts.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="text-sm sm:text-base font-semibold">
                                {attempts.length} lần làm bài
                            </h3>
                            <Link href={`/giao-tiep/${examId}`}>
                                <Button size="sm" className="gap-1">
                                    <Play className="w-3 h-3" />
                                    <span className="hidden sm:inline">Làm bài mới</span>
                                    <span className="sm:hidden">Làm mới</span>
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            {attempts.map((attempt, index) => (
                                <AttemptHistoryCard
                                    key={attempt._id}
                                    attempt={attempt}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 sm:py-16">
                        <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Chưa có lịch sử làm bài</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Bạn chưa hoàn thành bài luyện giao tiếp này
                        </p>
                        <Link href={`/giao-tiep/${examId}`}>
                            <Button className="gap-2">
                                <Play className="w-4 h-4" />
                                Bắt đầu làm bài
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
