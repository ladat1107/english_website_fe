"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Calendar, Save, Loader2, ClipboardCheck, FileText, Pin,
} from 'lucide-react';
import {
    Button, Input, Card, CardContent, CardHeader, CardTitle, Badge, Avatar,
    AvatarImage, AvatarFallback,
} from '@/components/ui';
import { Textarea } from '@/components/ui/input';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { WritingAnswer, WritingExam } from '@/types/writing.type';
import { UserType } from '@/types/user.type';
import { useGetWritingAnswerById, useUpdateWritingAnswer, useTogglePinWritingAnswer } from '@/hooks/use-writing-answer';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/toaster';
import { getNameAvatar } from '@/utils/funtions';
import dayjs from 'dayjs';
import { useImagePreview } from '@/contexts/image-preview-context';
import FileCard from '@/components/ui/file-item';
import { useConfirmDialogContext } from '@/components/ui/confirm-dialog-context';
import WrittingAnalysis from '@/components/writing/writing-analysis';
import { AIAnalysis } from '@/types/speaking.type';

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

// =====================================================
// MAIN PAGE
// =====================================================
export default function AdminWritingGradingDetailPage() {
    const params = useParams();
    const answerId = params.answerId as string;
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { openImage } = useImagePreview();
    const { confirm } = useConfirmDialogContext();

    // Form states
    const [score, setScore] = useState('0');
    const [feedback, setFeedback] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Queries
    const { data: answerRes, isLoading } = useGetWritingAnswerById(answerId);
    const { mutate: updateAnswer, isPending: isUpdating } = useUpdateWritingAnswer();
    const { mutate: togglePin, isPending: isTogglingPin } = useTogglePinWritingAnswer();

    const answer: WritingAnswer | null = answerRes?.data || null;
    const user = answer?.user as UserType;
    const exam = answer?.writingexam as WritingExam;

    // Load data into form
    useEffect(() => {
        if (answer) {
            setScore(answer.score?.toString() || '0');
            setFeedback(answer.teacher_feedback || '');
        }
    }, [answer]);

    const handleSave = () => {
        updateAnswer(
            {
                id: answerId,
                data: {
                    score: parseInt(score) || 0,
                    teacher_feedback: feedback,
                },
            },
            {
                onSuccess: () => {
                    addToast('Lưu chấm điểm thành công', 'success');
                    setIsEditing(false);
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.findOne, answerId] });
                }
            }
        );
    };

    const handleTogglePin = () => {
        confirm({
            title: answer?.is_pinned ? 'Bỏ ghim bài viết mẫu?' : 'Ghim bài viết này làm mẫu?',
            description: answer?.is_pinned
                ? 'Bài viết sẽ không còn là bài mẫu và sẽ không hiển thị ở đầu danh sách nữa.'
                : 'Bài viết sẽ được ghim lên đầu danh sách và đánh dấu là bài mẫu.',
            onConfirm: () => {
                togglePin(answerId, {
                    onSuccess: () => {
                        addToast(answer?.is_pinned ? 'Đã bỏ ghim bài viết' : 'Đã ghim bài viết mẫu', 'success');
                        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.findOne, answerId] });
                    },
                    onError: () => {
                        addToast('Có lỗi xảy ra', 'error');
                    },
                });
            }
        })

    };

    // Loading state
    if (isLoading) {
        return <LoadingCustom className="min-h-screen" />;
    }

    // Not found
    if (!answer) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <ClipboardCheck className="w-12 h-12 mx-auto mb-4 text-destructive" />
                    <h2 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h2>
                    <Link href={PATHS.ADMIN.WRITING_GRADING}>
                        <Button>Quay lại danh sách</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-8">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container-custom mx-auto px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link href={PATHS.ADMIN.WRITING_GRADING}>
                            <Button variant="ghost" size="icon-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5 text-primary" />
                                Chấm bài
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                {exam?.title}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* User Info */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                                        getScoreBgClass(answer.score || 0)
                                    )}>
                                        <p className={cn("text-3xl font-bold", getScoreColor(answer.score || 0))}>
                                            {answer.score || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Điểm</p>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        {dayjs(answer.submitted_at || answer.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </div>
                                    {answer.is_pinned && (
                                        <Badge variant="warning" className="gap-1">
                                            <Pin className="w-3 h-3" />
                                            Bài mẫu
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Answer Content */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        Bài viết
                                    </span>
                                    <Button
                                        variant={answer.is_pinned ? "default" : "outline"}
                                        size="sm"
                                        onClick={handleTogglePin}
                                        disabled={isTogglingPin}
                                        className={`${answer.is_pinned ? "bg-amber-500 hover:bg-amber-600" : ""} h-6`}
                                    >
                                        <Pin className="w-3 h-3" />
                                        {answer.is_pinned ? 'Đã ghim' : 'Ghim làm mẫu'}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {answer.answer ? (
                                    <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
                                        <p className="text-sm whitespace-pre-wrap">{answer.answer}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Không có nội dung text
                                    </p>
                                )}

                                {/* Uploaded Files */}
                                {answer.files && answer.files.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">Tệp đính kèm:</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                            </CardContent>
                        </Card>

                        {/* AI Analysis */}

                        <div className='border border-gray-200 rounded-lg p-4'>
                            <WrittingAnalysis
                                analysis={answer?.ai_analysis as AIAnalysis || null}
                                answerId={answerId}
                            />
                        </div>
                    </div>

                    {/* Sidebar - Grading */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center justify-between">
                                    <span>Chấm điểm & Nhận xét</span>
                                    {!isEditing && (
                                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium block mb-1">
                                                Điểm số (0-100)
                                            </label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={score}
                                                onChange={(e) => setScore(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium block mb-1">
                                                Nhận xét của giáo viên
                                            </label>
                                            <Textarea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Nhập nhận xét cho học viên..."
                                                rows={5}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size={'sm'}
                                                variant="ghost"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setScore(answer.score?.toString() || '0');
                                                    setFeedback(answer.teacher_feedback || '');
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                size={'sm'}
                                                onClick={handleSave}
                                                disabled={isUpdating}
                                                className="bg-primary hover:bg-primary/80"
                                            >
                                                {isUpdating ? (
                                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-1" />
                                                )}
                                                Lưu
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className={cn(
                                            "p-4 rounded-lg border text-center",
                                            getScoreBgClass(answer.score || 0)
                                        )}>
                                            <p className={cn("text-3xl font-bold", getScoreColor(answer.score || 0))}>
                                                {answer.score || 0} / 100
                                            </p>
                                        </div>

                                        {answer.teacher_feedback ? (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm">{answer.teacher_feedback}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                                Chưa có nhận xét của giáo viên
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Exam Info */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Thông tin đề</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Tiêu đề</p>
                                        <p className="font-medium">{exam?.title}</p>
                                    </div>
                                    {exam?.content && (
                                        <div>
                                            <p className="text-muted-foreground">Nội dung</p>
                                            <p className="text-foreground line-clamp-3">{exam.content}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
