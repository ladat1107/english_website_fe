/**
 * Khailingo - Admin Writing Grading List Page
 * Trang danh sách bài viết cần chấm
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    ClipboardCheck,
    Calendar,
    CheckCircle,
    Clock,
    ChevronRight,
    Search,
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Badge,
    Avatar,
    AvatarImage,
    AvatarFallback,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui';
import { WritingAnswer, WritingAnswerParams, WritingExam } from '@/types/writing.type';
import { UserType } from '@/types/user.type';
import { Pagination } from '@/types';
import { useGetAllWritingAnswers } from '@/hooks/use-writing-answer';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { getNameAvatar, getScoreBadgeVariant } from '@/utils/funtions';
import dayjs from 'dayjs';
import { useDebounce } from '@/hooks';

// =====================================================
// GRADING ITEM CARD
// =====================================================
interface GradingItemProps {
    answer: WritingAnswer;
}

function GradingItem({ answer }: GradingItemProps) {
    const user = answer.user as UserType;
    const exam = answer.writingexam as WritingExam;
    const hasTeacherFeedback = !!answer.teacher_feedback;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Link href={PATHS.ADMIN.WRITING_GRADING_DETAIL(answer._id)}>
                <Card className="hover:shadow-md transition-all cursor-pointer" hoverable>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            {/* User Avatar */}
                            <Avatar>
                                <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                                <AvatarFallback>
                                    {getNameAvatar(user?.full_name || 'U')}
                                </AvatarFallback>
                            </Avatar>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-foreground truncate">
                                        {user?.full_name || 'Unknown User'}
                                    </p>
                                    {hasTeacherFeedback ? (
                                        <Badge variant="success" size="sm">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Đã chấm
                                        </Badge>
                                    ) : (
                                        <Badge variant="warning" size="sm">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Chờ chấm
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mb-2">
                                    {exam?.title || 'Đề bài'}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {answer.answer?.substring(0, 150) || 'Bài viết có file đính kèm'}...
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {dayjs(answer.submitted_at || answer.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </span>
                                </div>
                            </div>

                            {/* Score & Action */}
                            <div className="flex flex-col items-end gap-2">
                                {answer.score > 0 && (
                                    <Badge variant={getScoreBadgeVariant(answer.score)} size="lg">
                                        {answer.score} điểm
                                    </Badge>
                                )}
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

// =====================================================
// MAIN PAGE
// =====================================================
export default function AdminWritingGradingPage() {
    // States
    const [answers, setAnswers] = useState<WritingAnswer[]>([]);
    const [params, setParams] = useState<WritingAnswerParams>({ page: 1, limit: 20, search: '', is_pinned: undefined });
    const [searchQuery, setSearchQuery] = useState('');
    const searchDebounce = useDebounce(searchQuery, 300);

    const { data: answersRes, isLoading } = useGetAllWritingAnswers(params);
    const pagination: Pagination = answersRes?.data?.pagination || {};

    useEffect(() => {
        if (answersRes?.success) {
            setAnswers(answersRes.data.items);
        }
    }, [answersRes]);

    useEffect(() => {
        setParams(pre => ({ ...pre, search: searchDebounce, page: 1 }));
    }, [searchDebounce]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container-custom mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link href={PATHS.ADMIN.WRITING_EXAM}>
                            <Button variant="ghost" size="icon-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5 text-primary" />
                                Chấm bài luyện viết
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {pagination?.totalItems || 0} bài viết
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom mx-auto px-4 py-6">
                {/* Filter Tabs */}
                <div className="flex flex-row gap-3 mb-4 sm:mb-6">
                    {/* Search */}
                    <div className='flex-1'>
                        <Input
                            placeholder="Tìm theo tên, email học viên hoặc tên đề..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                            className="w-full h-8"
                        />
                    </div>
                    <div className="sm:w-auto">
                        <Select
                            value={params.is_pinned !== undefined ? params.is_pinned + "" : ""}
                            onValueChange={(value) =>
                                setParams(pre => ({
                                    ...pre,
                                    is_pinned: value === 'all' ? undefined : value === 'true',
                                    page: 1,
                                }))
                            }
                        >
                            <SelectTrigger className="h-8 w-[120px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="true">Đã ghim</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingCustom className="min-h-[350px]" />
                ) : (
                    <>
                        {answers.length > 0 ? (
                            <div className="space-y-3">
                                {answers.map((answer) => (
                                    <GradingItem key={answer._id} answer={answer} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                                <h3 className="text-lg font-semibold mb-2">Không có bài viết nào</h3>

                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
