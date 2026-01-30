/**
 * Khailingo - SpeakingExamForm Component
 * Form tạo/chỉnh sửa đề Speaking sử dụng React Hook Form + Zod + Shadcn UI
 *
 * @description
 * Component này sử dụng:
 * - React Hook Form để quản lý form state
 * - Zod để validation
 * - Shadcn UI Form components
 *
 * Features:
 * - Responsive layout (mobile-first)
 * - Real-time validation với Zod
 * - Video upload/URL input
 * - Dynamic script & question management
 * - Summary sidebar
 */

"use client";

import React, { memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Save,
    Eye,
    Plus,
    Trash2,
    GripVertical,
    Video,
    Upload,
    Link as LinkIcon,
    MessageCircle,
    HelpCircle,
    CheckCircle,
    Loader2,
    AlertCircle,
} from "lucide-react";
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Input,
} from "@/components/ui";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VideoPlayer, VideoScriptDisplay } from "@/components/speaking";
import { speakingTopicOptions } from "@/utils/mock-data/speaking.mock";
import { cn } from "@/utils/cn";
import { SpeakingTopic } from "@/types/speaking.type";

// =====================================================
// ZOD SCHEMA - Validation
// =====================================================

const videoScriptSchema = z.object({
    speaker: z.string().min(1, "Vui lòng nhập người nói"),
    content: z.string().min(1, "Vui lòng nhập nội dung"),
    translation: z.string(),
});

const questionSchema = z.object({
    question_number: z.number(),
    question_text: z.string().min(1, "Vui lòng nhập nội dung câu hỏi"),
    suggested_answer: z.string().optional(),
});

const speakingExamFormSchema = z.object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    description: z.string().optional(),
    topic: z.nativeEnum(SpeakingTopic),
    estimated_duration_minutes: z.number().min(1).max(60),
    video_url: z.string().min(1, "Vui lòng thêm video"),
    video_script: z.array(videoScriptSchema),
    questions: z.array(questionSchema).min(1, "Vui lòng thêm ít nhất 1 câu hỏi"),
    is_published: z.boolean(),
    _id: z.string().optional(),
});

export type SpeakingExamFormValues = z.infer<typeof speakingExamFormSchema>;

// =====================================================
// TYPES
// =====================================================

export type SpeakingExamFormMode = "create" | "edit";
export type VideoInputMode = "upload" | "url";

// For backward compatibility
export type SpeakingExamFormData = SpeakingExamFormValues;
export type FormErrors = Record<string, string>;

export interface SpeakingExamFormProps {
    mode: SpeakingExamFormMode;
    title: string;
    subtitle?: string;
    initialData?: Partial<SpeakingExamFormValues>;
    showPreview?: boolean;
    onPreview?: () => void;
    onSaveSuccess?: () => void;
    onSaveError?: (error: Error) => void;
    className?: string;
}

// =====================================================
// CONSTANTS
// =====================================================

const DEFAULT_FORM_VALUES: SpeakingExamFormValues = {
    title: "",
    description: "",
    topic: SpeakingTopic.DAILY_LIFE,
    estimated_duration_minutes: 10,
    video_url: "",
    video_script: [],
    questions: [],
    is_published: false,
};

// =====================================================
// SUB-COMPONENTS
// =====================================================

interface FormHeaderProps {
    title: string;
    subtitle?: string;
    mode: SpeakingExamFormMode;
    isSaving: boolean;
    showPreview?: boolean;
    onBack: () => void;
    onPreview?: () => void;
    onSaveDraft: () => void;
    onPublish: () => void;
}

const FormHeader = memo(function FormHeader({
    title,
    subtitle,
    mode,
    isSaving,
    showPreview,
    onBack,
    onPreview,
    onSaveDraft,
    onPublish,
}: FormHeaderProps) {
    return (
        <div className="bg-card border-b border-border sticky top-0 z-10">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {showPreview && onPreview && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onPreview}
                                className="gap-2 hidden sm:flex"
                                size="sm"
                            >
                                <Eye className="w-4 h-4" />
                                Xem trước
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onSaveDraft}
                            disabled={isSaving}
                            className="gap-1.5 sm:gap-2"
                            size="sm"
                        >
                            <Save className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {mode === "create" ? "Lưu nháp" : "Lưu"}
                            </span>
                        </Button>
                        <Button
                            type="button"
                            onClick={onPublish}
                            disabled={isSaving}
                            className="gap-1.5 sm:gap-2"
                            size="sm"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            <span className="hidden xs:inline">
                                {mode === "create" ? "Xuất bản" : "Cập nhật"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

interface VideoSectionProps {
    videoUrl: string;
    videoTitle: string;
    videoInputMode: VideoInputMode;
    isUploading: boolean;
    error?: string;
    onVideoUrlChange: (url: string) => void;
    setVideoInputMode: (mode: VideoInputMode) => void;
    handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const VideoSection = memo(function VideoSection({
    videoUrl,
    videoTitle,
    videoInputMode,
    isUploading,
    error,
    onVideoUrlChange,
    setVideoInputMode,
    handleVideoUpload,
}: VideoSectionProps) {
    return (
        <Card>
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Video bài học
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant={videoInputMode === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVideoInputMode("url")}
                        className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                        <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Nhập link
                    </Button>
                    <Button
                        type="button"
                        variant={videoInputMode === "upload" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVideoInputMode("upload")}
                        className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Upload
                    </Button>
                </div>

                {videoInputMode === "url" && (
                    <div className="space-y-2">
                        <Input
                            placeholder="Nhập link video YouTube hoặc Cloudinary"
                            value={videoUrl}
                            onChange={(e) => onVideoUrlChange(e.target.value)}
                            leftIcon={<LinkIcon className="w-4 h-4" />}
                        />
                        {error && (
                            <p className="text-xs sm:text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                {error}
                            </p>
                        )}
                    </div>
                )}

                {videoInputMode === "upload" && (
                    <div className="border-2 border-dashed border-border rounded-xl p-4 sm:p-8 text-center">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                            disabled={isUploading}
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-spin mb-2 sm:mb-3" />
                                    <p className="text-muted-foreground text-sm">Đang tải lên...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-2 sm:mb-3" />
                                    <p className="text-foreground font-medium mb-1 text-sm sm:text-base">
                                        Kéo thả hoặc click để upload
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        MP4, WebM (Max 100MB)
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>
                )}

                {videoUrl && (
                    <div className="mt-3 sm:mt-4">
                        <p className="text-xs sm:text-sm font-medium mb-2">Xem trước:</p>
                        <VideoPlayer src={videoUrl} title={videoTitle} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

interface SummarySidebarProps {
    mode: SpeakingExamFormMode;
    title: string;
    topic: SpeakingTopic;
    duration: number;
    videoUrl: string;
    scriptsCount: number;
    questionsCount: number;
    isPublished: boolean;
    isSaving: boolean;
    onSaveDraft: () => void;
    onPublish: () => void;
}

const SummarySidebar = memo(function SummarySidebar({
    mode,
    title,
    topic,
    duration,
    videoUrl,
    scriptsCount,
    questionsCount,
    isPublished,
    isSaving,
    onSaveDraft,
    onPublish,
}: SummarySidebarProps) {
    return (
        <div className="space-y-4 sm:space-y-6">
            <Card className="sticky top-20 sm:top-24">
                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Tóm tắt</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        {mode === "edit" && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Trạng thái:</span>
                                <Badge variant={isPublished ? "success" : "warning"}>
                                    {isPublished ? "Đã xuất bản" : "Bản nháp"}
                                </Badge>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tiêu đề:</span>
                            <span className="font-medium text-right max-w-[55%] truncate">
                                {title || "Chưa nhập"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Chủ đề:</span>
                            <Badge variant="secondary" className="text-xs">
                                {topic}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Thời gian:</span>
                            <span>{duration} phút</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Video:</span>
                            <span className={videoUrl ? "text-success" : "text-muted-foreground"}>
                                {videoUrl ? "✓ Đã thêm" : "Chưa có"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Số đoạn hội thoại:</span>
                            <span>{scriptsCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Số câu hỏi:</span>
                            <span>{questionsCount}</span>
                        </div>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-border space-y-2">
                        <Button
                            type="button"
                            className="w-full gap-2 h-9 sm:h-10 text-sm"
                            onClick={onPublish}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            {mode === "create" ? "Xuất bản đề thi" : "Cập nhật & Xuất bản"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2 h-9 sm:h-10 text-sm"
                            onClick={onSaveDraft}
                            disabled={isSaving}
                        >
                            <Save className="w-4 h-4" />
                            {mode === "create" ? "Lưu bản nháp" : "Lưu thay đổi"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {mode === "create" && (
                <Card className="hidden lg:block">
                    <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                        <CardTitle className="text-sm sm:text-base">💡 Mẹo tạo đề tốt</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 pt-0">
                        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                Video nên có độ dài 3-5 phút
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                Thêm kịch bản để học viên đọc theo
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                Nên có 3-5 câu hỏi mỗi đề
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                Câu hỏi nên thực tế, gần gũi
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
});

// =====================================================
// MAIN COMPONENT
// =====================================================

export function SpeakingExamForm({
    mode,
    title,
    subtitle,
    initialData,
    showPreview = false,
    onPreview,
    onSaveSuccess,
    onSaveError,
    className,
}: SpeakingExamFormProps) {
    const router = useRouter();

    // =====================================================
    // LOCAL STATE
    // =====================================================
    const [videoInputMode, setVideoInputMode] = useState<VideoInputMode>("url");
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // =====================================================
    // FORM SETUP
    // =====================================================
    const form = useForm<SpeakingExamFormValues>({
        resolver: zodResolver(speakingExamFormSchema),
        defaultValues: {
            ...DEFAULT_FORM_VALUES,
            ...initialData,
        },
        mode: "onChange",
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = form;

    // Field arrays for dynamic lists
    const {
        fields: scriptFields,
        append: appendScript,
        remove: removeScript,
    } = useFieldArray({
        control,
        name: "video_script",
    });

    const {
        fields: questionFields,
        append: appendQuestion,
        remove: removeQuestion,
    } = useFieldArray({
        control,
        name: "questions",
    });

    // Watch form values for summary
    const watchedValues = watch();

    // =====================================================
    // HANDLERS
    // =====================================================

    const handleVideoUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setIsUploading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const mockUrl = `https://res.cloudinary.com/demo/video/upload/${file.name}`;
                setValue("video_url", mockUrl, { shouldValidate: true });
            } catch (error) {
                console.error("Video upload failed:", error);
            } finally {
                setIsUploading(false);
            }
        },
        [setValue]
    );

    const addScript = useCallback(() => {
        appendScript({
            speaker: "",
            content: "",
            translation: "",
        });
    }, [appendScript]);

    const addQuestion = useCallback(() => {
        appendQuestion({
            question_number: questionFields.length + 1,
            question_text: "",
            suggested_answer: "",
        });
    }, [appendQuestion, questionFields.length]);

    const onSubmit = useCallback(
        async (data: SpeakingExamFormValues, publish: boolean) => {
            setIsSaving(true);
            try {
                const dataToSave = { ...data, is_published: publish };
                console.log(`${mode === "create" ? "Creating" : "Updating"} exam:`, dataToSave);

                await new Promise((resolve) => setTimeout(resolve, 1500));

                onSaveSuccess?.();
                router.push("/quan-ly/giao-tiep");
            } catch (error) {
                console.error("Save failed:", error);
                onSaveError?.(error as Error);
            } finally {
                setIsSaving(false);
            }
        },
        [mode, onSaveSuccess, onSaveError, router]
    );

    const handleSaveDraft = useCallback(() => {
        handleSubmit((data) => onSubmit(data, false))();
    }, [handleSubmit, onSubmit]);

    const handlePublish = useCallback(() => {
        handleSubmit((data) => onSubmit(data, true))();
    }, [handleSubmit, onSubmit]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Form {...form}>
            <form className={cn("min-h-screen bg-background pb-16 sm:pb-20", className)}>
                {/* Header */}
                <FormHeader
                    title={title}
                    subtitle={subtitle}
                    mode={mode}
                    isSaving={isSaving}
                    showPreview={showPreview}
                    onBack={() => router.back()}
                    onPreview={onPreview}
                    onSaveDraft={handleSaveDraft}
                    onPublish={handlePublish}
                />

                {/* Main Content */}
                <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Left Column - Main Form */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            {/* Basic Info Section */}
                            <Card>
                                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                        Thông tin cơ bản
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                                    <FormField
                                        control={control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tiêu đề đề thi *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="VD: Job Interview - Phỏng vấn xin việc"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Mô tả ngắn gọn về nội dung bài luyện"
                                                        className="min-h-[80px] sm:min-h-[100px] resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <FormField
                                            control={control}
                                            name="topic"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Chủ đề *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn chủ đề" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {speakingTopicOptions.map((option) => (
                                                                <SelectItem
                                                                    key={option.key}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="estimated_duration_minutes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Thời gian ước tính (phút) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={60}
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(parseInt(e.target.value) || 10)
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Video Section */}
                            <VideoSection
                                videoUrl={watchedValues.video_url || ""}
                                videoTitle={watchedValues.title || ""}
                                videoInputMode={videoInputMode}
                                isUploading={isUploading}
                                error={errors.video_url?.message}
                                onVideoUrlChange={(url) =>
                                    setValue("video_url", url, { shouldValidate: true })
                                }
                                setVideoInputMode={setVideoInputMode}
                                handleVideoUpload={handleVideoUpload}
                            />

                            {/* Script Section */}
                            <Card>
                                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                        <span className="hidden xs:inline">Kịch bản hội thoại</span>
                                        <span className="xs:hidden">Kịch bản</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {scriptFields.length}
                                        </Badge>
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addScript}
                                        className="gap-1 text-xs sm:text-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Thêm đoạn</span>
                                        <span className="sm:hidden">Thêm</span>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                                    {scriptFields.length === 0 ? (
                                        <div className="text-center py-6 sm:py-8 text-muted-foreground">
                                            <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                                            <p className="text-sm">Chưa có đoạn hội thoại nào</p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={addScript}
                                                className="mt-2 gap-1 text-xs sm:text-sm"
                                            >
                                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Thêm đoạn đầu tiên
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                            {scriptFields.map((field, index) => (
                                                <motion.div
                                                    key={field.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-3 sm:p-4 border border-border rounded-xl bg-muted/30"
                                                >
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="text-muted-foreground mt-2 cursor-grab hidden sm:block">
                                                            <GripVertical className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                                                            <FormField
                                                                control={control}
                                                                name={`video_script.${index}.speaker`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="Người nói (VD: Interviewer, A, B)"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={control}
                                                                name={`video_script.${index}.content`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Nội dung tiếng Anh"
                                                                                className="min-h-[60px] sm:min-h-[80px] resize-y"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={control}
                                                                name={`video_script.${index}.translation`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Bản dịch tiếng Việt"
                                                                                className="min-h-[50px] sm:min-h-[60px] resize-y"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeScript(index)}
                                                            className="text-destructive hover:bg-destructive/10 shrink-0"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {scriptFields.length > 0 && (
                                        <div className="pt-3 sm:pt-4 border-t border-border">
                                            <p className="text-xs sm:text-sm font-medium mb-2">
                                                Xem trước hội thoại:
                                            </p>
                                            <VideoScriptDisplay
                                                scripts={watchedValues.video_script || []}
                                                defaultExpanded={true}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Questions Section */}
                            <Card>
                                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                        <span className="hidden xs:inline">Câu hỏi luyện nói</span>
                                        <span className="xs:hidden">Câu hỏi</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {questionFields.length}
                                        </Badge>
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addQuestion}
                                        className="gap-1 text-xs sm:text-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Thêm câu</span>
                                        <span className="sm:hidden">Thêm</span>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                                    {errors.questions?.message && (
                                        <p className="text-xs sm:text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            {errors.questions.message}
                                        </p>
                                    )}

                                    {questionFields.length === 0 ? (
                                        <div className="text-center py-6 sm:py-8 text-muted-foreground">
                                            <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                                            <p className="text-sm">Chưa có câu hỏi nào</p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={addQuestion}
                                                className="mt-2 gap-1 text-xs sm:text-sm"
                                            >
                                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Thêm câu hỏi đầu tiên
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                            {questionFields.map((field, index) => (
                                                <motion.div
                                                    key={field.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-3 sm:p-4 border border-border rounded-xl bg-muted/30"
                                                >
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                                                            <FormField
                                                                control={control}
                                                                name={`questions.${index}.question_text`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Nội dung câu hỏi"
                                                                                className="min-h-[60px] sm:min-h-[80px] resize-y"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={control}
                                                                name={`questions.${index}.suggested_answer`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Gợi ý trả lời (tùy chọn)"
                                                                                className="min-h-[50px] sm:min-h-[60px] resize-y"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            {/* Hidden field for question_number */}
                                                            <input
                                                                type="hidden"
                                                                {...form.register(
                                                                    `questions.${index}.question_number`
                                                                )}
                                                                value={index + 1}
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeQuestion(index)}
                                                            className="text-destructive hover:bg-destructive/10 shrink-0"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Summary */}
                        <SummarySidebar
                            mode={mode}
                            title={watchedValues.title || ""}
                            topic={watchedValues.topic}
                            duration={watchedValues.estimated_duration_minutes}
                            videoUrl={watchedValues.video_url || ""}
                            scriptsCount={scriptFields.length}
                            questionsCount={questionFields.length}
                            isPublished={watchedValues.is_published}
                            isSaving={isSaving}
                            onSaveDraft={handleSaveDraft}
                            onPublish={handlePublish}
                        />
                    </div>
                </div>
            </form>
        </Form>
    );
}

export default SpeakingExamForm;
