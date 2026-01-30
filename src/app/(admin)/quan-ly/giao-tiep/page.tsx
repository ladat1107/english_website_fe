/**
 * Khailingo - Admin Speaking Exam Management Page
 * Trang quản lý danh sách đề giao tiếp (Admin)
 */

"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    Filter,
    Grid3X3,
    List,
    MessageSquare,
    ChevronDown,
    Trash2,
    AlertCircle
} from 'lucide-react';
import {
    Button,
    Input,
    Card,
    Badge,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui';
import { SpeakingExamCard } from '@/components/speaking';
import { SpeakingExam, SpeakingTopic } from '@/types/speaking.type';
import { mockSpeakingExams, speakingTopicOptions } from '@/utils/mock-data/speaking.mock';
import { cn } from '@/utils/cn';

// =====================================================
// TYPES
// =====================================================
type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'published' | 'draft';

// =====================================================
// ADMIN SPEAKING MANAGEMENT PAGE
// =====================================================
export default function AdminSpeakingManagementPage() {
    const router = useRouter();

    // States
    const [exams, setExams] = useState<SpeakingExam[]>(mockSpeakingExams);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTopic, setFilterTopic] = useState<SpeakingTopic | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [examToDelete, setExamToDelete] = useState<SpeakingExam | null>(null);

    // =====================================================
    // FILTERED EXAMS
    // =====================================================
    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    exam.title.toLowerCase().includes(query) ||
                    exam.description?.toLowerCase().includes(query) ||
                    exam.topic.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Topic filter
            if (filterTopic !== 'all' && exam.topic !== filterTopic) {
                return false;
            }

            // Status filter
            if (filterStatus === 'published' && !exam.is_published) {
                return false;
            }
            if (filterStatus === 'draft' && exam.is_published) {
                return false;
            }

            return true;
        });
    }, [exams, searchQuery, filterTopic, filterStatus]);

    // =====================================================
    // HANDLERS
    // =====================================================
    const handleEdit = (exam: SpeakingExam) => {
        router.push(`/quan-ly/giao-tiep/chinh-sua/${exam._id}`);
    };

    const handlePreview = (exam: SpeakingExam) => {
        // Mở tab mới để preview
        window.open(`/giao-tiep/${exam._id}?preview=true`, '_blank');
    };

    const handleDeleteClick = (exam: SpeakingExam) => {
        setExamToDelete(exam);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (examToDelete) {
            // Mock delete - sau này gọi API
            setExams(prev => prev.filter(e => e._id !== examToDelete._id));
            setDeleteDialogOpen(false);
            setExamToDelete(null);
        }
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
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="font-bold text-foreground flex items-center gap-2">
                                <MessageSquare className="w-7 h-7 text-primary" />
                                Quản lý đề giao tiếp
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                Quản lý tất cả bài luyện giao tiếp tiếng Anh
                            </p>
                        </div>

                        <Link href="/quan-ly/giao-tiep/tao-de">
                            <Button className="gap-2 w-full sm:w-auto">
                                <Plus className="w-4 h-4" />
                                Tạo đề mới
                            </Button>
                        </Link>
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
                                        <select
                                            value={filterTopic}
                                            onChange={(e) => setFilterTopic(e.target.value as any)}
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                        >
                                            <option value="all">Tất cả chủ đề</option>
                                            {speakingTopicOptions.map(topic => (
                                                <option key={topic.key} value={topic.value}>
                                                    {topic.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Trạng thái
                                        </label>
                                        <div className="flex gap-2">
                                            {[
                                                { value: 'all', label: 'Tất cả' },
                                                { value: 'published', label: 'Đã xuất bản' },
                                                { value: 'draft', label: 'Bản nháp' },
                                            ].map(status => (
                                                <button
                                                    key={status.value}
                                                    onClick={() => setFilterStatus(status.value as FilterStatus)}
                                                    className={cn(
                                                        'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                                                        filterStatus === status.value
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted hover:bg-muted/80'
                                                    )}
                                                >
                                                    {status.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'p-2 transition-colors',
                                viewMode === 'grid'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            )}
                        >
                            <Grid3X3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 transition-colors',
                                viewMode === 'list'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            )}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Active Filters */}
                {(filterTopic !== 'all' || filterStatus !== 'all' || searchQuery) && (
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
                        {filterStatus !== 'all' && (
                            <Badge variant="secondary" className="gap-1">
                                Trạng thái: {filterStatus === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                <button onClick={() => setFilterStatus('all')} className="ml-1">×</button>
                            </Badge>
                        )}
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterTopic('all');
                                setFilterStatus('all');
                            }}
                            className="text-sm text-primary hover:underline"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                )}

                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-4">
                    Hiển thị {filteredExams.length} / {exams.length} đề
                </p>

                {/* Exam List */}
                {filteredExams.length > 0 ? (
                    <div className={cn(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    )}>
                        {filteredExams.map((exam, index) => (
                            <motion.div
                                key={exam._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <SpeakingExamCard
                                    exam={exam}
                                    variant="admin"
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                            Xác nhận xóa đề
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa đề "{examToDelete?.title}"?
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            className="gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Xóa đề
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
