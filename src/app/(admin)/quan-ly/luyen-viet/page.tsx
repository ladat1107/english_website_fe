"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    PenLine,
    ClipboardCheck,
} from 'lucide-react';
import {
    Button,
    Input,
    Pagination,
} from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WritingExam, WritingExamParams } from '@/types/writing.type';
import { Pagination as PaginationType } from '@/types';
import { useDeleteWritingExam, useGetAllWritingExams } from '@/hooks/use-writing-exam';
import { useDebounce } from '@/hooks/use-debounce';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { useConfirmDialogContext } from '@/components/ui/confirm-dialog-context';
import { useToast } from '@/components/ui/toaster';
import { typeLanguageOptions } from '@/types/speaking.type';
import { levelOptions } from '@/utils/constants/select';
import { UserRole } from '@/utils/constants/enum';
import WritingExamCard from '@/components/writing/writing-exam-card';



export default function AdminWritingManagementPage() {
    const router = useRouter();
    const { confirm } = useConfirmDialogContext();
    const { addToast } = useToast();

    // States
    const [exams, setExams] = useState<WritingExam[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [params, setParams] = useState<WritingExamParams>({
        page: 1,
        limit: 12,
        search: '',
        is_published: undefined,
        type: undefined,
    });
    const searchDebounce = useDebounce(searchQuery, 300);

    const { data: writingExamRes, isLoading } = useGetAllWritingExams(params);
    const pagination: PaginationType = writingExamRes?.data?.pagination || {};

    const { mutate: deleteWritingExam } = useDeleteWritingExam();

    useEffect(() => {
        if (writingExamRes?.success) {
            setExams(writingExamRes.data.items);
        }
    }, [writingExamRes]);

    useEffect(() => {
        setParams((prev) => ({ ...prev, search: searchDebounce, page: 1 }));
    }, [searchDebounce]);


    const setFilter = (key: keyof WritingExamParams, value: any) => {
        setParams((prev) => ({ ...prev, [key]: value, page: 1, }));
    };

    // Handlers
    const handleEdit = (exam: WritingExam) => {
        router.push(PATHS.ADMIN.WRITING_EXAM_EDIT(exam._id));
    };

    const handlePreview = (exam: WritingExam) => {
        window.open(`${PATHS.CLIENT.WRITING_DETAIL(exam._id)}?preview=true`, '_blank');
    };

    const handleDeleteClick = (exam: WritingExam) => {
        confirm({
            title: "Xác nhận xóa đề",
            description: `Bạn có chắc chắn muốn xóa đề "${exam.title}" không?`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                deleteWritingExam(exam._id, {
                    onSuccess: () => {
                        addToast("Xóa đề thành công", "success");
                    },
                    onError: () => {
                        addToast("Có lỗi xảy ra", "error");
                    }
                });
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        setParams((prev) => ({ ...prev, page: newPage }));
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container-custom mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <PenLine className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                Quản lý đề luyện viết
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Quản lý tất cả bài luyện viết
                            </p>
                        </div>

                        <div className="flex flex-row gap-2">
                            <Link href={PATHS.ADMIN.WRITING_GRADING}>
                                <Button variant="outline" size='sm' className="gap-2 w-full sm:w-auto">
                                    <ClipboardCheck className="w-4 h-4" />
                                    Chấm bài
                                </Button>
                            </Link>
                            <Link href={PATHS.ADMIN.WRITING_EXAM_CREATE}>
                                <Button size={"sm"}>
                                    <Plus className="w-4 h-4" />
                                    Tạo đề mới
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom mx-auto px-4 py-6">
                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm đề bài..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                            className="h-8"
                        />
                    </div>
                    <div className='flex flex-row gap-2'>
                        <div className="w-full sm:w-auto">
                            <Select
                                value={params.type !== undefined ? params.type + "" : ""}
                                onValueChange={(value) =>
                                    setFilter("type", value === "all" ? undefined : value)
                                }
                            >
                                <SelectTrigger className="h-8 min-w-[120px]">
                                    <SelectValue placeholder="Loại đề" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    {typeLanguageOptions.map((item) => (
                                        <SelectItem key={item.key} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <Select
                                value={params.level !== undefined ? params.level + "" : ""}
                                onValueChange={(value) =>
                                    setFilter("level", value === "all" ? undefined : value)
                                }
                            >
                                <SelectTrigger className="h-8 min-w-[120px]">
                                    <SelectValue placeholder="Mức độ" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    {levelOptions.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingCustom className="min-h-[350px]" />
                ) : (
                    <>
                        {/* Count */}
                        <p className="text-sm text-muted-foreground mb-4">
                            {pagination?.totalItems || 0} đề bài
                        </p>

                        {/* Grid */}
                        {exams.length > 0 ? (
                            <div className='flex flex-col gap-2'>
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {exams.map((exam) => (
                                        <WritingExamCard
                                            role={UserRole.ADMIN}
                                            key={exam._id}
                                            exam={exam}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteClick}
                                            onPreview={handlePreview}
                                        />
                                    ))}
                                </div>
                                {/* Pagination */}
                                <div className="border-t border-border px-4 py-3 bg-muted/30">
                                    <Pagination
                                        pagination={pagination}
                                        onPageChange={handlePageChange}
                                        variant="compact"
                                        size="sm"
                                    />
                                </div>
                            </div>

                        ) : (
                            <div className="text-center py-16">
                                <PenLine className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                                <h3 className="text-lg font-semibold mb-2">Chưa có đề bài nào</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Tạo đề bài đầu tiên để bắt đầu
                                </p>
                                <Link href={PATHS.ADMIN.WRITING_EXAM_CREATE}>
                                    <Button >
                                        <Plus className="w-4 h-4" />
                                        Tạo đề mới
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
