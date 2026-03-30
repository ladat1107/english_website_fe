/**
 * Khailingo - Writing History Page
 * Trang lịch sử luyện viết - accordion hiển thị kết quả AI
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, PenLine, Calendar, ChevronDown, ChevronUp, Sparkles, AlertCircle,
} from 'lucide-react';
import {
    Button, Card, CardContent, Badge,
} from '@/components/ui';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { useGetWritingExamById } from '@/hooks/use-writing-exam';
import { useDeleteWritingAnswer, useGetWritingHistory, useUpdateWritingAIAnalysis } from '@/hooks/use-writing-answer';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@/utils/cn';
import { WritingAnswer, WritingExam } from '@/types/writing.type';
import dayjs from 'dayjs';
import { getScoreBadgeVariant } from '@/utils/funtions';
import FileCard from '@/components/ui/file-item';
import { useImagePreview } from '@/contexts/image-preview-context';
import WrittingAnalysis from '@/components/writing/writing-analysis';
import { useConfirmDialogContext } from '@/components/ui/confirm-dialog-context';
import { AIAnalysis } from '@/types/speaking.type';

// =====================================================
// WRITING HISTORY ITEM (ACCORDION)
// =====================================================
interface HistoryItemProps {
    answer: WritingAnswer;
    index: number;
    onRefreshAI: (id: string) => void;
    isRefreshing: boolean;
}

function HistoryItem({ answer, index, onRefreshAI, isRefreshing }: HistoryItemProps) {
    const [isExpanded, setIsExpanded] = useState(index === 0);
    const hasAIAnalysis = !!answer.ai_analysis;
    const { openImage } = useImagePreview();
    const { confirm } = useConfirmDialogContext();
    const { mutate: deleteWritingAnswer, isPending } = useDeleteWritingAnswer();

    const handleDelete = () => {
        confirm({
            title: 'Xóa bài làm',
            description: 'Bạn có chắc chắn muốn xóa bài làm này? Hành động này không thể hoàn tác.',
            onConfirm: () => {
                deleteWritingAnswer(answer._id,);
            }
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
                isExpanded && "ring-1 ring-gray-300"
            )}>

                {/* HEADER */}
                <div className="flex items-center justify-between p-4 gap-3">
                    {/* LEFT */}
                    <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className={cn(
                            "hidden sm:flex w-10 h-10 rounded-full items-center justify-center",
                            answer.score > 0 ? "bg-emerald-100" : "bg-muted"
                        )}>
                            <PenLine className={cn(
                                "w-5 h-5",
                                answer.score > 0 ? "text-emerald-600" : "text-muted-foreground"
                            )} />
                        </div>

                        <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">
                                Bài làm {index + 1}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {dayjs(answer.submitted_at || answer.createdAt).format('DD/MM/YYYY HH:mm')}

                                {hasAIAnalysis && (
                                    <Badge variant="info" size="sm">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        AI đã phân tích
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2">
                        {answer.score > 0 && (
                            <Badge variant={getScoreBadgeVariant(answer.score)} size="lg">
                                {answer.score} điểm
                            </Badge>
                        )}

                        {/* Toggle Expand */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 rounded-md hover:bg-muted"
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <CardContent className="px-1 sm:px-3 lg:px-6 pt-0 pb-4 border-t">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* LEFT Column */}
                                    <div className="flex flex-col gap-4">

                                        {/* Answer */}
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                                Bài viết của bạn:
                                            </p>
                                            <div className="py-3 px-2 bg-sky-50 rounded-lg">
                                                <p className="text-sm whitespace-pre-wrap text-justify">
                                                    {answer.answer || (
                                                        <span className="italic text-muted-foreground">
                                                            Không có nội dung
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Files */}
                                        {answer?.files && answer.files?.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                                    Tệp đính kèm:
                                                </p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {answer.files.map((file, idx) => (
                                                        <FileCard
                                                            key={idx}
                                                            file={file}
                                                            onClick={() => openImage(file.url)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT Column */}
                                    <div className="flex flex-col gap-4">

                                        {/* AI Analysis */}
                                        {hasAIAnalysis && (
                                            <WrittingAnalysis
                                                key={answer._id}
                                                analysis={answer.ai_analysis as AIAnalysis}
                                                answerId={answer._id}
                                            />
                                        )}

                                        {/* Request AI */}
                                        {!hasAIAnalysis && answer.answer && (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => onRefreshAI(answer._id)}
                                                disabled={isRefreshing}
                                            >
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                {isRefreshing ? "Đang phân tích..." : "Yêu cầu AI phân tích"}
                                            </Button>
                                        )}

                                        {/* Teacher feedback */}
                                        {answer.teacher_feedback && (
                                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                <p className="text-xs font-medium text-emerald-700 mb-1">
                                                    Nhận xét của giáo viên:
                                                </p>
                                                <p className="text-sm text-emerald-800">
                                                    {answer.teacher_feedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Button - placed at bottom, separate from content */}
                                <div className="mt-6">
                                    <Button
                                        variant="destructive"
                                        className="w-full sm:w-auto"
                                        onClick={handleDelete}
                                        disabled={isPending}
                                    >
                                        Xóa bài làm
                                    </Button>
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
export default function WritingHistoryPage() {
    const params = useParams();
    const examId = params.examId as string;
    const { addToast } = useToast();

    // Queries
    const { data: examRes, isLoading: examLoading } = useGetWritingExamById(examId);
    const { data: historyRes, isLoading: historyLoading, refetch } = useGetWritingHistory(examId);
    const { mutate: refreshAI, isPending: isRefreshingAI } = useUpdateWritingAIAnalysis();

    const exam: WritingExam | null = examRes?.data || null;
    const historyItems: WritingAnswer[] = historyRes?.data || [];

    const handleRefreshAI = (answerId: string) => {
        refreshAI(answerId, {
            onSuccess: () => {
                addToast('AI đang phân tích lại bài viết...', 'info');
                refetch();
            },
            onError: () => {
                addToast('Có lỗi xảy ra khi phân tích', 'error');
            },
        });
    };

    const isLoading = examLoading || historyLoading;

    // Loading state
    if (isLoading) {
        return <LoadingCustom className="min-h-screen" />;
    }

    // Not found
    if (!exam) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                    <h2 className="text-lg font-semibold mb-2">Không tìm thấy đề bài</h2>
                    <Link href={PATHS.CLIENT.WRITING()}>
                        <Button>Quay lại danh sách</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-8">
            {/* Header */}
            <div className="container-custom mx-auto px-3 sm:px-4 py-3 sm:py-4">
                <div className="flex items-center gap-3">
                    <Link href={PATHS.CLIENT.WRITING()}>
                        <Button variant="ghost" size="icon-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                            Lịch sử luyện viết
                        </h1>
                        <p className="text-sm text-muted-foreground truncate">
                            {exam.title}
                        </p>
                    </div>
                    <Link href={PATHS.CLIENT.WRITING_DETAIL(examId)}>
                        <Button variant="default" size="sm" className="gap-1">
                            <PenLine className="w-4 h-4" />
                            <span className="hidden sm:inline">Làm bài mới</span>
                        </Button>
                    </Link>
                </div>
            </div>


            <div className="container-custom mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Exam Info Card */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <h3 className="font-medium text-foreground mb-2">Đề bài:</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                            {exam.content}
                        </p>
                    </CardContent>
                </Card>

                {/* History List */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">
                        Bài làm của bạn ({historyItems.length})
                    </h2>
                </div>

                {historyItems.length > 0 ? (
                    <div className="space-y-4">
                        {historyItems.map((answer, index) => (
                            <HistoryItem
                                key={answer._id}
                                answer={answer}
                                index={index}
                                onRefreshAI={handleRefreshAI}
                                isRefreshing={isRefreshingAI}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <PenLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-semibold mb-2">Chưa có bài làm nào</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Bắt đầu làm bài để lưu lịch sử
                        </p>
                        <Link href={PATHS.CLIENT.WRITING_DETAIL(examId)}>
                            <Button className="gap-2">
                                <PenLine className="w-4 h-4" />
                                Làm bài ngay
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
