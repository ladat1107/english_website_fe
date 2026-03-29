/**
 * Khailingo - Writing Exam Detail Page
 * Trang làm bài luyện viết - có sidebar bài ghim
 */

"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    PenLine,
    Upload,
    Send,
    Loader2,
    FileText,
    Image as ImageIcon,
    X,
    Pin,
    ChevronRight,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { useGetWritingExamById } from '@/hooks/use-writing-exam';
import { useGetPinnedAnswers, useCreateWritingAnswer } from '@/hooks/use-writing-answer';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { CloudinaryFolder } from '@/lib/cloudinary';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@/utils/cn';
import { FileInfo, WritingAnswer, WritingExam } from '@/types/writing.type';
import { UserType } from '@/types/user.type';
import { getNameAvatar } from '@/utils/funtions';
import dayjs from 'dayjs';
import VocabularyPanel from '@/components/speaking/VocabularyPanel';
import { useImagePreview } from '@/contexts/image-preview-context';
import { PinnedAnswerModal } from '@/components/writing/pinned-answer-modal';
import { AutoResizeTextarea } from '@/components/ui/auto-resize-text-area';
import { usePreventLeave } from '@/hooks';

// =====================================================
// PINNED ANSWER CARD COMPONENT
// =====================================================
interface PinnedAnswerCardProps {
    answer: WritingAnswer;
    onView: (answer: WritingAnswer) => void;
}

function PinnedAnswerCard({ answer, onView }: PinnedAnswerCardProps) {
    const user = answer.user as UserType;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            onClick={() => onView(answer)}
        >
            <div className="flex items-center gap-2 mb-2">
                <Avatar size="sm">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                    <AvatarFallback className="text-xs">
                        {getNameAvatar(user?.full_name || 'U')}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{user?.full_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                        {dayjs(answer.submitted_at).format('DD/MM/YYYY')}
                    </p>
                </div>
                {answer.score > 0 && (
                    <Badge variant="success" size="sm">{answer.score}</Badge>
                )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
                {answer.answer.substring(0, 100)}...
            </p>
            <div className="flex items-center justify-end mt-2">
                <span className="text-[10px] text-primary flex items-center gap-1">
                    Xem chi tiết <ChevronRight className="w-3 h-3" />
                </span>
            </div>
        </motion.div>
    );
}

// =====================================================
// MAIN PAGE COMPONENT
// =====================================================
export default function WritingExamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id as string;
    const { addToast } = useToast();
    const { openImage } = useImagePreview();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { allowNavigation } = usePreventLeave({ enabled: true });

    // States
    const [answerText, setAnswerText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [selectedPinnedAnswer, setSelectedPinnedAnswer] = useState<WritingAnswer | null>(null);
    const [showPinnedAnswers, setShowPinnedAnswers] = useState(true);
    const [mode, setMode] = useState<"text" | "image">("text");

    // Queries
    const { data: examRes, isLoading: examLoading } = useGetWritingExamById(examId);
    const { data: pinnedRes } = useGetPinnedAnswers(examId);
    const { mutate: createAnswer, isPending: isSubmitting } = useCreateWritingAnswer();

    // Upload hook
    const { uploadMultipleFile, isUploading, progress } = useCloudinaryUpload({
        folder: CloudinaryFolder.GENERAL_IMAGES,
    });

    const exam: WritingExam | null = examRes?.data || null;
    const pinnedAnswers: WritingAnswer[] = pinnedRes?.data || [];

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) {
            alert('Không có tệp nào được chọn');
            return;
        };
        const fileArray = Array.from(files);

        try {
            const uploadResults = await uploadMultipleFile(fileArray);
            const newFileUrls = uploadResults.map(res => ({
                name: res.originalFilename || `File ${Date.now()}`,
                url: res.secureUrl,
                size: res.bytes,
                type: res.resourceType,
            }));
            setUploadedFiles(prev => [...prev, ...newFileUrls]);
            addToast('Tải lên thành công!', 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Tải lên thất bại';
            addToast(errorMessage, 'error');
        } finally {            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }

    };

    // Remove uploaded file
    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Submit answer
    const handleSubmit = () => {
        if (mode === "text" && !answerText.trim()) {
            addToast("Vui lòng nhập bài viết", "warning");
            return;
        }

        if (mode === "image" && uploadedFiles.length === 0) {
            addToast("Vui lòng tải ảnh lên", "warning");
            return;
        }

        createAnswer(
            {
                writing_exam_id: examId,
                answer: mode === "text" ? answerText : "",
                files: mode === "image" ? uploadedFiles : [],
            },
            {
                onSuccess: () => {
                    addToast("Nộp bài thành công!", "success");
                    allowNavigation();
                    setTimeout(() => {
                        router.push(PATHS.CLIENT.WRITING_HISTORY(examId));
                    }, 100);
                },
                onError: () => addToast("Có lỗi xảy ra khi nộp bài", "error"),
            }
        );
    };

    // Loading state
    if (examLoading) {
        return <LoadingCustom className="min-h-screen" />;
    }

    // Not found
    if (!exam) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <PenLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
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
                        <h1 className="text-lg sm:text-xl font-bold text-primary truncate">
                            {exam.title}
                        </h1>
                    </div>
                    <Button variant="default" size="sm" className="gap-1"
                        onClick={handleSubmit}
                        disabled={isSubmitting || (mode === "text" ? !answerText.trim() : uploadedFiles.length === 0)
                        }
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span className="hidden sm:inline">Nộp bài</span>
                    </Button>
                </div>
            </div>

            <div className="container-custom mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Main Content */}
                    <div className="space-y-4">
                        {/* Exam Content */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Đề bài
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <p className="whitespace-pre-wrap text-foreground">{exam.content}</p>
                                </div>
                                {exam.images && exam.images.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {exam.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                                                <Image src={img} alt={`Hình ${idx + 1}`} fill className="object-contain cursor-zoom-in hover:scale-105 transition-transform"
                                                    onClick={() => openImage(img)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <VocabularyPanel
                            data={exam.vocabularies}
                            language={exam.type}
                        />

                        {pinnedAnswers && pinnedAnswers.length > 0 &&
                            <Card className='hidden md:block'>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Pin className="w-4 h-4 text-amber-500" />
                                            Bài viết mẫu
                                            {pinnedAnswers.length > 0 && (
                                                <Badge variant="secondary" size="sm">{pinnedAnswers.length}</Badge>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="icon-sm" onClick={() => setShowPinnedAnswers(prev => !prev)}>
                                            {showPinnedAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {showPinnedAnswers && (
                                        <div className="space-y-3">
                                            {pinnedAnswers.map((answer) => (
                                                <PinnedAnswerCard
                                                    key={answer._id}
                                                    answer={answer}
                                                    onView={setSelectedPinnedAnswer}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>}

                    </div>

                    {/* Sidebar - Pinned Answers */}
                    <div className="space-y-4">
                        <div className="flex gap-2 border rounded-lg p-1 w-full max-w-[260px] bg-muted">
                            <button
                                onClick={() => setMode("text")}
                                className={cn(
                                    "flex-1 py-2 text-sm rounded-md transition",
                                    mode === "text"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                ✍️ Nhập văn bản
                            </button>

                            <button
                                onClick={() => setMode("image")}
                                className={cn(
                                    "flex-1 py-2 text-sm rounded-md transition",
                                    mode === "image"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                🖼️ Upload ảnh
                            </button>
                        </div>

                        {/* Writing Area */}
                        <Card className='border-none p-0'>
                            <CardHeader className="p-0">
                                <div className='flex items-center justify-between'>
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <PenLine className="w-5 h-5 text-primary" />
                                        Bài làm của bạn
                                    </CardTitle>

                                    {mode === "image" &&
                                        <div className="flex justify-end">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                                className="gap-2 h-8"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Đang tải ({progress}%)
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        Tải ảnh
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    }
                                </div>

                            </CardHeader>
                            <CardContent className="space-y-4 px-0 mt-4">

                                {/* MODE = TEXT */}
                                {mode === "text" && (
                                    <AutoResizeTextarea
                                        placeholder="Viết bài của bạn tại đây..."
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        rows={15}
                                        className="resize-none"
                                    />
                                )}

                                {/* MODE = IMAGE */}
                                {mode === "image" && (
                                    <>
                                        <p className="text-xs text-amber-600 mt-1">
                                            ⚠️ Ảnh sẽ không được AI sửa bài. Nếu bạn muốn AI phân tích → hãy nhập văn bản.
                                        </p>

                                        {uploadedFiles.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {uploadedFiles.map((file, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div className="w-32 h-32 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                                                            <Image src={file.url} alt="" fill className="object-cover" />
                                                        </div>
                                                        <button
                                                            onClick={() => removeFile(idx)}
                                                            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) :
                                            <div className="flex flex-col items-center gap-2 py-10 border rounded-lg">
                                                <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">Chưa có ảnh nào được tải lên</p>
                                            </div>
                                        }
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Pinned Answer Modal */}
            {selectedPinnedAnswer && (
                <PinnedAnswerModal
                    open={!!selectedPinnedAnswer}
                    answer={selectedPinnedAnswer}
                    onOpenChange={() => setSelectedPinnedAnswer(null)}
                />
            )}
        </div>
    );
}
