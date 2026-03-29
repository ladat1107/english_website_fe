"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    PenLine,
    Sparkles,
    FileText,
} from 'lucide-react';
import { Input, Pagination, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { WritingExam, WritingExamParams } from '@/types/writing.type';
import { useGetAllWritingExams } from '@/hooks/use-writing-exam';
import { useDebounce } from '@/hooks/use-debounce';
import { Pagination as PaginationType } from '@/types';
import LoadingCustom from '@/components/ui/loading-custom';
import { useSearchParams } from 'next/navigation';
import { LevelExam, TypeLanguage, UserRole } from '@/utils/constants/enum';

import WritingExamCard from '@/components/writing/writing-exam-card';
import { useSpeakingExamStore } from '@/stores/speaking-exam.strore';
import { levelExamOptions } from '@/types/speaking.type';

export default function StudentWritingPage() {
    const searchParams = useSearchParams();

    // States
    const [searchQuery, setSearchQuery] = useState('');
    const { type, setType } = useSpeakingExamStore();
    const [publishedExams, setPublishedExams] = useState<WritingExam[]>([]);
    const searchDebounce = useDebounce(searchQuery, 300);

    const [params, setParams] = useState<WritingExamParams>({
        page: 1,
        limit: 20,
        search: searchDebounce,
        level: undefined,

    });

    const { data: writingExamRes, isLoading } = useGetAllWritingExams(params);
    const pagination: PaginationType = writingExamRes?.data?.pagination;

    useEffect(() => {
        const type = searchParams.get("type");
        if (type && Object.values(TypeLanguage).includes(type as TypeLanguage)) { setType(type as TypeLanguage); }
        else { setType(TypeLanguage.ENGLISH); }
    }, [searchParams]);

    useEffect(() => {
        if (writingExamRes?.success) {
            setPublishedExams(writingExamRes.data.items);
        }
    }, [writingExamRes]);

    useEffect(() => {
        setParams(pre => ({
            ...pre,
            search: searchDebounce,
            type: type || undefined,
        }));
    }, [searchDebounce, type]);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-6 sm:pt-8 pb-8 sm:pb-12 px-3 sm:px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                            <PenLine className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                            Luyện Viết
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                            Rèn luyện kỹ năng viết qua các đề bài đa dạng.
                            Viết trực tiếp hoặc upload bài viết để nhận phản hồi từ AI.
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                Phân tích AI
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                Upload bài viết
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                {/* Search */}
                <div className="flex flex-row gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 ">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm đề bài..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <div className="relative w-40">
                        <Select
                            value={params.level || 'all'}
                            onValueChange={(value) => setParams(pre => ({ ...pre, level: value === 'all' ? undefined : value as LevelExam, page: 1, }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Độ khó" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>

                                {levelExamOptions.map((level) => (
                                    <SelectItem key={level.key} value={level.value}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingCustom className='min-h-[350px]' />
                ) : (
                    <>

                        {/* Exam Grid */}
                        {publishedExams.length > 0 ? (
                            <div className='flex flex-col gap-3'>
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                    {publishedExams.map((exam, index) => (
                                        <motion.div
                                            key={exam._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <WritingExamCard exam={exam} role={UserRole.STUDENT} />
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="px-4 py-3">
                                    <Pagination
                                        pagination={pagination}
                                        onPageChange={(page) => setParams(pre => ({ ...pre, page }))}
                                        variant="compact"
                                        size="sm"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 sm:py-16">
                                <PenLine className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                                <h3 className="text-base sm:text-lg font-semibold mb-2">Không tìm thấy đề bài</h3>
                                <p className="text-sm text-muted-foreground">
                                    Thử thay đổi từ khóa tìm kiếm
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
