/**
 * Khailingo - Student Speaking Practice Page
 * Trang danh sách bài luyện giao tiếp cho học viên
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    MessageSquare,
    Sparkles
} from 'lucide-react';
import { Input, Badge } from '@/components/ui';
import { SpeakingExamCard } from '@/components/speaking';
import { SpeakingExam, SpeakingExamParams, speakingTopicOptions } from '@/types/speaking.type';
import { useGetAllSpeakingExams } from '@/hooks/use-speaking-exam';
import { useDebounce } from '@/hooks/use-debounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/types';
import LoadingCustom from '@/components/ui/loading-custom';

// =====================================================
// STUDENT SPEAKING PRACTICE PAGE
// =====================================================
export default function StudentSpeakingPage() {

    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [publishedExams, setPublishedExams] = useState<SpeakingExam[] | []>([]);
    const searchDebounce = useDebounce(searchQuery, 300);

    const [params, setParams] = useState<SpeakingExamParams>({
        page: 1,
        limit: 20,
        search: searchDebounce,
        topic: undefined
    });
    const { data: speakingExamRes, isLoading: isExamLoading } = useGetAllSpeakingExams(params);
    const pagination: Pagination = speakingExamRes?.data.pagination;
    useEffect(() => {
        if (speakingExamRes?.success) {
            setPublishedExams(speakingExamRes.data.items);
        }
    }, [speakingExamRes]);


    useEffect(() => {
        setParams(pre => ({
            ...pre,
            search: searchDebounce,
        }))
    }, [searchDebounce]);


    const setFilter = (key: keyof SpeakingExamParams, value: any) => {
        setParams(pre => ({
            ...pre,
            [key]: value,
            page: 1, // Reset page to 1 on filter change
        }))
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section - Compact on mobile */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-6 sm:pt-8 pb-8 sm:pb-12 px-3 sm:px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                            Luyện Giao Tiếp
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                            Cải thiện kỹ năng nói tiếng Anh qua các tình huống thực tế.
                            Xem video, luyện phát âm và nhận phản hồi từ AI.
                        </p>

                        {/* Features - Compact on mobile */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                Phân tích AI
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                Kịch bản hội thoại
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content - Compact spacing on mobile */}
            <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm bài luyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        {/* Filter Dropdown */}
                        <div className="relative w-full sm:w-auto">
                            <Select
                                value={params.topic || 'all'}
                                onValueChange={(val) => setFilter("topic", val === 'all' ? undefined : val)}
                            >
                                <SelectTrigger className="w-full sm:w-64">
                                    <Filter className="w-4 h-4 mr-2 opacity-70" />
                                    <SelectValue placeholder="Tất cả chủ đề" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">Tất cả chủ đề</SelectItem>

                                    {speakingTopicOptions.map((topic) => (
                                        <SelectItem key={topic.key} value={topic.value}>
                                            {topic.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </div>

                {/* Active Filter Badge */}
                {params.topic !== undefined && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-muted-foreground">Đang lọc:</span>
                        <Badge variant="secondary" className="gap-1">
                            {speakingTopicOptions.find(opt => opt.value === params.topic)?.label}
                            <button
                                onClick={() => setFilter("topic", undefined)}
                                className="ml-1 hover:text-destructive"
                            >
                                ×
                            </button>
                        </Badge>
                    </div>
                )}

                {isExamLoading ? <LoadingCustom className='min-h-[350px]' /> : (
                    <>
                        {/* Results Count */}
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                            {pagination?.totalItems} bài luyện
                        </p>

                        {/* Exam Grid - Compact gap on mobile */}
                        {publishedExams.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                {publishedExams.map((exam, index) => (
                                    <motion.div
                                        key={exam._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <SpeakingExamCard
                                            exam={exam}
                                            variant="student"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 sm:py-16">
                                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                                <h3 className="text-base sm:text-lg font-semibold mb-2">Không tìm thấy bài luyện</h3>
                                <p className="text-sm text-muted-foreground">
                                    Thử thay đổi từ khóa hoặc bộ lọc
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
