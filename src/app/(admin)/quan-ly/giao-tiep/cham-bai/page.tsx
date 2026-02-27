"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    ClipboardCheck,
    Clock,
    CheckCircle,
    User,
    Calendar,
    ChevronRight,
    X,
    Mic,
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
    Pagination,
} from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { SpeakingAttemptAvg, SpeakingAttemptParams } from '@/types/speaking-attempt.type';
import { Pagination as PaginationType } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetAllSpeakingAttempts } from '@/hooks/use-speaking-attempt';
import { cn } from '@/utils/cn';
import { speakingTopicOptions } from '@/types/speaking.type';
import { getNameAvatar, getScoreBadgeVariant } from '@/utils/funtions';
import dayjs from 'dayjs';


// =====================================================
// GRADING CARD COMPONENT
// =====================================================
interface GradingCardProps {
    attempt: SpeakingAttemptAvg;
    index: number;
}

function GradingCard({ attempt, index }: GradingCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(PATHS.ADMIN.SPEAKING_GRADING_DETAIL(attempt._id));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
        >
            <Card
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30"
                onClick={handleClick}
            >
                <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar size="md" className="shrink-0">
                                <AvatarImage src={attempt.user?.avatar_url} alt={attempt.user?.full_name} />
                                <AvatarFallback>
                                    {getNameAvatar(attempt.user?.full_name || 'U')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">
                                    {attempt.user?.full_name || 'Unknown User'}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                    {attempt.user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Exam Info */}
                        <div className="flex-1 min-w-0 pl-11 sm:pl-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {attempt.exam?.title || 'Unknown Exam'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="ghost" size="sm">
                                    {attempt.exam?.topic}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {attempt.answers.length}/{attempt.exam?.questions.length || 0} câu
                                </span>
                            </div>
                        </div>

                        {/* Score & Status */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pl-11 sm:pl-0">
                            <div className="flex items-center gap-2">
                                {/* Score */}
                                <Badge
                                    variant={getScoreBadgeVariant(attempt.average_score)}
                                    size="lg"
                                >
                                    {attempt.average_score} điểm
                                </Badge>

                                {/* Grading Status */}
                                {attempt.has_teacher_feedback ? (
                                    <Badge variant="success" size="sm" className="hidden sm:flex">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Đã chấm
                                    </Badge>
                                ) : (
                                    <Badge variant="warning" size="sm" className="hidden sm:flex">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Chưa chấm
                                    </Badge>
                                )}
                            </div>

                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Mobile: Extra Info */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border sm:hidden">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {dayjs(attempt.submitted_at || attempt.createdAt).format('DD/MM/YYYY HH:mm')}
                        </div>

                        {attempt.has_teacher_feedback ? (
                            <Badge variant="success" size="sm">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Đã chấm
                            </Badge>
                        ) : (
                            <Badge variant="warning" size="sm">
                                <Clock className="w-3 h-3 mr-1" />
                                Chưa chấm
                            </Badge>
                        )}
                    </div>

                    {/* Desktop: Submitted At */}
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Calendar className="w-3 h-3" />
                        Nộp lúc: {dayjs(attempt.submitted_at || attempt.createdAt).format('DD/MM/YYYY HH:mm')}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// =====================================================
// STATS CARD COMPONENT
// =====================================================
interface StatsCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    className?: string;
}

function StatsCard({ icon, value, label, className }: StatsCardProps) {
    return (
        <Card className={cn("text-center", className)}>
            <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                    {icon}
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{value}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
            </CardContent>
        </Card>
    );
}

// =====================================================
// MAIN PAGE COMPONENT
// =====================================================
export default function AdminSpeakingGradingPage() {
    // States
    const [searchQuery, setSearchQuery] = useState('');
    const searchDebounce = useDebounce(searchQuery, 300);

    const [params, setParams] = useState<SpeakingAttemptParams>({
        page: 1,
        limit: 10,
        search: '',
        topic: undefined,
        has_teacher_feedback: undefined,
    });

    // Fetch grading list
    const { data: gradingRes, isLoading } = useGetAllSpeakingAttempts({
        ...params,
        search: searchDebounce,
    });

    const items: SpeakingAttemptAvg[] = gradingRes?.data?.items || [];
    const pagination: PaginationType = gradingRes?.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    // Handlers
    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    const setFilter = (key: keyof SpeakingAttemptParams, value: any) => {
        setParams(prev => ({
            ...prev,
            [key]: value,
            page: 1,
        }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setParams({
            page: 1,
            limit: 10,
            search: '',
            topic: undefined,
            has_teacher_feedback: undefined,
        });
    };

    // Calculate stats
    const gradedCount = items.filter(i => i.has_teacher_feedback).length;
    const notGradedCount = items.filter(i => !i.has_teacher_feedback).length;

    const hasActiveFilters = params.topic || params.has_teacher_feedback !== undefined || searchQuery;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-3 sm:px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                Chấm bài giao tiếp
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                                Quản lý và chấm điểm bài luyện nói của học viên
                            </p>
                        </div>

                        <Link href={PATHS.ADMIN.SPEAKING_EXAM}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                <Mic className="w-4 h-4 mr-2" />
                                Quản lý đề
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <StatsCard
                        icon={<User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                        value={pagination.totalItems}
                        label="Tổng bài nộp"
                    />
                    <StatsCard
                        icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                        value={gradedCount}
                        label="Đã chấm"
                    />
                    <StatsCard
                        icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
                        value={notGradedCount}
                        label="Chưa chấm"
                    />
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                    {/* Search */}
                    <Input
                        placeholder="Tìm theo tên, email học viên hoặc tên đề..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                        className="w-full"
                    />

                    {/* Filter Row */}
                    <div className="flex flex-wrap gap-2">
                        {/* Exam Filter */}
                        <Select
                            value={params.topic || 'all'}
                            onValueChange={(value) => setFilter('topic', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Chọn chủ đề" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả chủ đề</SelectItem>
                                {speakingTopicOptions.map((topic) => (
                                    <SelectItem key={topic.value} value={topic.value}>
                                        {topic.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            value={params.has_teacher_feedback?.toString() || 'all'}
                            onValueChange={(value) => setFilter('has_teacher_feedback', value === 'all' ? undefined : value === 'true')}
                        >
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="true">Đã chấm</SelectItem>
                                <SelectItem value="false">Chưa chấm</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-muted-foreground"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                </div>

                {/* Results Info */}
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                    Hiển thị {items.length} / {pagination.totalItems} bài nộp
                </p>

                {/* Content */}
                {isLoading ? (
                    <LoadingCustom className="min-h-[300px]" />
                ) : items.length > 0 ? (
                    <>
                        {/* Grading List */}
                        <div className="space-y-3">
                            {items.map((attempt, index) => (
                                <GradingCard
                                    key={attempt._id}
                                    attempt={attempt}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 sm:py-16">
                        <ClipboardCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                            Không tìm thấy bài nộp
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {hasActiveFilters
                                ? 'Thử thay đổi bộ lọc để xem kết quả khác'
                                : 'Chưa có học viên nào nộp bài luyện nói'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
