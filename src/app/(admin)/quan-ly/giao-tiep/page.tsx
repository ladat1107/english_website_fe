/**
 * Khailingo - Admin Speaking Exam Management Page
 * Trang quản lý danh sách đề giao tiếp (Admin)
 */

"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    Filter,
    MessageSquare,
    ChevronDown,
    ClipboardCheck
} from 'lucide-react';
import {
    Button,
    Input,
    Card,
    Badge,
} from '@/components/ui';
import { SpeakingExamCard } from '@/components/speaking';
import { SpeakingExam, SpeakingExamParams, speakingTopicOptions } from '@/types/speaking.type';
import { cn } from '@/utils/cn';
import { SpeakingTopic, UserRole } from '@/utils/constants/enum';
import { useDeleteSpeakingExam, useGetAllSpeakingExams } from '@/hooks/use-speaking-exam';
import { useDebounce } from '@/hooks/use-debounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/types';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { useConfirmDialogContext } from '@/components/ui/confirm-dialog-context';
import { useToast } from '@/components/ui/toaster';


// =====================================================
// ADMIN SPEAKING MANAGEMENT PAGE
// =====================================================
export default function AdminSpeakingManagementPage() {
    const router = useRouter();
    // States
    const [exams, setExams] = useState<SpeakingExam[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTopic, setFilterTopic] = useState<SpeakingTopic | 'all'>('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const searchDebounce = useDebounce(searchQuery, 300);
    const { confirm } = useConfirmDialogContext();

    const [params, setParams] = useState<SpeakingExamParams>({
        page: 1,
        limit: 10,
        search: searchDebounce,
        is_published: undefined,
        topic: undefined,
    });
    const { data: speakingExamRes, isLoading: isExamLoading } = useGetAllSpeakingExams({
        ...params,
        search: searchDebounce,
    });
    const pagination: Pagination = speakingExamRes?.data?.pagination || {};

    const { mutate: deleteSpeakingExam } = useDeleteSpeakingExam();
    const { addToast } = useToast();

    useEffect(() => {
        if (speakingExamRes) {
            setExams(speakingExamRes.data.items);
        }
    }, [speakingExamRes]);

    const setFilter = (key: keyof SpeakingExamParams, value: any) => {
        setParams(prev => ({
            ...prev,
            page: 1, // Reset page khi thay đổi filter
            [key]: value,
        }));
    }

    // =====================================================
    // HANDLERS
    // =====================================================
    const handleEdit = (exam: SpeakingExam) => {
        router.push(PATHS.ADMIN.SPEAKING_EXAM_EDIT(exam._id));
    };

    const handlePreview = (exam: SpeakingExam) => {
        // Mở tab mới để preview
        window.open(`/giao-tiep/${exam._id}?preview=true`, '_blank');
    };

    const handleDeleteClick = (exam: SpeakingExam) => {
        confirm({
            title: "Xác nhận xóa đề",
            description: `Bạn có chắc chắn muốn xóa đề "${exam.title}" không?`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                deleteSpeakingExam(exam._id, {
                    onSuccess: () => {
                        addToast("Xóa đề thành công", "success");
                    }
                });
            }
        });
    };


    // =====================================================
    // STATS
    // =====================================================
    const stats = useMemo(() => ({
        total: exams.length,
        published: exams.filter(e => e.is_published).length,
        draft: exams.filter(e => !e.is_published).length,
    }), [exams]);

    // =====================================================
    // RENDER
    // =====================================================
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                Quản lý đề giao tiếp
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Quản lý tất cả bài luyện giao tiếp tiếng Anh
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link href="/quan-ly/giao-tiep/cham-bai">
                                <Button variant="outline" size='sm' className="gap-2 w-full sm:w-auto">
                                    <ClipboardCheck className="w-4 h-4" />
                                    Chấm bài
                                </Button>
                            </Link>
                            <Link href="/quan-ly/giao-tiep/tao-de">
                                <Button size={"sm"} className="gap-2 w-full sm:w-auto">
                                    <Plus className="w-4 h-4" />
                                    Tạo đề mới
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="text-center p-4">
                        <p className="text-3xl font-bold text-primary">{stats.total}</p>
                        <p className="text-sm text-muted-foreground">Tổng số đề</p>
                    </Card>
                    <Card className="text-center p-4">
                        <p className="text-3xl font-bold text-success">{stats.published}</p>
                        <p className="text-sm text-muted-foreground">Đã xuất bản</p>
                    </Card>
                    <Card className="text-center p-4">
                        <p className="text-3xl font-bold text-warning">{stats.draft}</p>
                        <p className="text-sm text-muted-foreground">Bản nháp</p>
                    </Card>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm đề giao tiếp..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Lọc
                            <ChevronDown className={cn(
                                'w-4 h-4 transition-transform',
                                showFilterDropdown && 'rotate-180'
                            )} />
                        </Button>

                        <AnimatePresence>
                            {showFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg p-4 z-20"
                                >
                                    {/* Topic Filter */}
                                    <div className="mb-4">
                                        <label className="text-sm font-medium mb-2 block">
                                            Chủ đề
                                        </label>

                                        <Select
                                            value={params.topic ?? "all"}
                                            onValueChange={(value) =>
                                                setFilter("topic", value === "all" ? undefined : value)
                                            }
                                        >
                                            <SelectTrigger className="w-full h-10">
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

                                    {/* Status Filter */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Trạng thái
                                        </label>
                                        <Select
                                            value={params.is_published !== undefined ? params.is_published + "" : ""}
                                            onValueChange={(key) =>
                                                setFilter("is_published", key === "all" ? undefined : key === "true" ? true : false)
                                            }
                                        >
                                            <SelectTrigger className="w-full h-10">
                                                <SelectValue placeholder="Trạng thái" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {[
                                                    { key: 'all', label: 'Tất cả' },
                                                    { key: 'true', label: 'Đã xuất bản' },
                                                    { key: 'false', label: 'Bản nháp' },
                                                ].map((item) => (
                                                    <SelectItem key={item.key} value={item.key}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Active Filters */}
                {(filterTopic !== 'all' || params.is_published !== undefined || searchQuery) && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-sm text-muted-foreground">Bộ lọc:</span>
                        {searchQuery && (
                            <Badge variant="secondary" className="gap-1">
                                Tìm kiếm: {searchQuery}
                                <button onClick={() => setSearchQuery('')} className="ml-1">×</button>
                            </Badge>
                        )}
                        {filterTopic !== 'all' && (
                            <Badge variant="secondary" className="gap-1">
                                Chủ đề: {filterTopic}
                                <button onClick={() => setFilterTopic('all')} className="ml-1">×</button>
                            </Badge>
                        )}
                        {params.is_published !== undefined && (
                            <Badge variant="secondary" className="gap-1">
                                Trạng thái: {params.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                                <button onClick={() => setFilter("is_published", undefined)} className="ml-1">×</button>
                            </Badge>
                        )}
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterTopic('all');
                                setFilter("is_published", undefined);
                            }}
                            className="text-sm text-primary hover:underline"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                )}

                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-4">
                    Hiển thị {pagination.totalItems} / {exams.length} đề
                </p>

                {/* Exam List */}
                {
                    isExamLoading ?
                        <LoadingCustom className='min-h-[150px]' />
                        :
                        exams.length > 0 ? (
                            <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
                                {exams.map((exam, index) => (
                                    <motion.div
                                        key={exam._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <SpeakingExamCard
                                            exam={exam}
                                            variant={UserRole.ADMIN}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteClick}
                                            onPreview={handlePreview}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                                <h3 className="text-lg font-semibold mb-2">Không tìm thấy đề nào</h3>
                                <p className="text-muted-foreground mb-4">
                                    Thử thay đổi bộ lọc hoặc tạo đề mới
                                </p>
                                <Link href="/quan-ly/giao-tiep/tao-de">
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Tạo đề mới
                                    </Button>
                                </Link>
                            </Card>
                        )}
            </div>
        </div>
    );
}
