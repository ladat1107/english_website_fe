"use client";

import React, { memo, useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Eye,
    Plus,
    Trash2,
    GripVertical,
    MessageCircle,
    HelpCircle,
    CheckCircle,
    Loader2,
    AlertCircle,
    Pencil,
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
import { VideoScriptDisplay } from "@/components/speaking";
import { VideoUploader } from "@/components/upload";
import { CloudinaryFolder } from "@/lib/cloudinary";
import { cn } from "@/utils/cn";
import { SortableContainer } from "../dnd";
import DraggableQuestionItem from "./draggable-question-item";
import { LevelExam, SpeakingTopic, TypeLanguage } from "@/utils/constants/enum";
import { Switch } from "../ui/switch";
import { PATHS } from "@/utils/constants";
import { levelExamOptions, POS_OPTIONS_EN, POS_OPTIONS_ZH, speakingTopicOptions, typeLanguageOptions, Vocabulary } from "@/types/speaking.type";
import Link from "next/link";
import MultipleChoiceQuestionEditor from "./MultipleChoiceQuestionEditor";

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

const vocabularySchema = z.object({
    vocabulary: z.string().min(1, "Vui lòng nhập từ vựng"),
    meaning: z.string().min(1, "Vui lòng nhập nghĩa"),
    type: z.string().optional(), // Loại từ (danh từ, động từ, tính từ, v.v.)
});

const multipleChoiceOptionSchema = z.object({
    key: z.string().min(1),
    text: z.string().min(1, "Vui lòng nhập nội dung đáp án"),
});

const multipleChoiceQuestionSchema = z.object({
    question_number: z.number(),
    question_text: z.string().min(1, "Vui lòng nhập nội dung câu hỏi"),
    options: z.array(multipleChoiceOptionSchema).min(2, "Cần ít nhất 2 đáp án"),
    correct_option: z.string().min(1, "Vui lòng chọn đáp án đúng"),
});

const speakingExamFormSchema = z.object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    description: z.string().optional(),
    topic: z.enum(SpeakingTopic),
    estimated_duration_minutes: z.number().min(1).max(60, "Thời gian không được vượt quá 60 phút"),
    video_url: z.string().min(1, "Vui lòng thêm video"),
    thumbnail: z.string().optional(),
    video_script: z.array(videoScriptSchema),
    questions: z.array(questionSchema).min(1, "Vui lòng thêm ít nhất 1 câu hỏi"),
    multiple_choice_questions: z.array(multipleChoiceQuestionSchema).optional(),
    is_published: z.boolean(),
    _id: z.string().optional(),
    level: z.enum(LevelExam),
    type: z.enum(TypeLanguage),
    vocabularies: z.array(vocabularySchema).optional(),
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
    isSaving: boolean;
    onPreview?: () => void;
    onSaveSuccess?: (data: SpeakingExamFormData) => void;
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
    thumbnail: "",
    video_script: [],
    questions: [],
    multiple_choice_questions: [],
    vocabularies: [],
    type: TypeLanguage.ENGLISH,
    level: LevelExam.EASY,
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
    onPreview?: () => void;
    onSaveDraft: () => void;
}

const FormHeader = memo(function FormHeader({
    title,
    subtitle,
    mode,
    isSaving,
    showPreview,
    onPreview,
    onSaveDraft,
}: FormHeaderProps) {
    return (
        <div className="bg-card border-b border-border  z-10">
            <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Link href={PATHS.ADMIN.SPEAKING_EXAM} className="shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
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
                            onClick={onSaveDraft}
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
                                {mode === "create" ? "Lưu nháp" : "Lưu"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

interface SummarySidebarProps {
    mode: SpeakingExamFormMode;
    isPublished: boolean;
    isSaving: boolean;
    examType: TypeLanguage;
    vocabularies: Vocabulary[];
    onPublish: () => void;
    addVocabulary: (vocab: Vocabulary) => void;
    updateVocabulary: (index: number, vocab: Vocabulary) => void;
    deleteVocabulary: (index: number) => void;
}

const SummarySidebar = memo(function SummarySidebar({
    mode,
    isPublished,
    isSaving,
    examType,
    vocabularies,
    onPublish,
    addVocabulary,
    updateVocabulary,
    deleteVocabulary,
}: SummarySidebarProps) {

    const [newWord, setNewWord] = useState<Vocabulary>({ vocabulary: "", meaning: "", type: "" });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<Vocabulary>({ vocabulary: "", meaning: "", type: "" });

    const POS_OPTIONS = examType === TypeLanguage.ENGLISH ? POS_OPTIONS_EN : POS_OPTIONS_ZH;
    const handleAddWord = () => {
        addVocabulary({
            vocabulary: newWord.vocabulary,
            meaning: newWord.meaning,
            type: POS_OPTIONS.find(option => option.value === newWord.type)?.label || newWord.type || "", // Lấy label hiển thị hoặc giữ nguyên nếu không tìm thấy
        });
        setNewWord({ vocabulary: "", meaning: "", type: "" });
    };

    const deleteWord = (index: number) => {
        deleteVocabulary(index);
    };

    const startEdit = (index: number) => {
        setEditIndex(index);
        setEditItem(vocabularies[index]);
    };

    const handleSave = (index: number) => {
        updateVocabulary(index, editItem);
        setEditItem({ vocabulary: "", meaning: "", type: "" });
        setEditIndex(null);
    };

    const cancelEdit = () => {
        setEditIndex(null);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <Card className="sticky top-12 sm:top-16">
                <CardContent className="p-3 pt-0 space-y-3 sm:space-y-4">
                    <div className="py-3 sm:py-4 border-b border-border space-y-2">
                        {/* Switch Xuất bản */}
                        {mode === "edit" && (
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">
                                    {"Trạng thái"}
                                    {mode === "edit" && (
                                        <Badge className="text-[10px] ms-2 py-0.5" variant={isPublished ? "success" : "warning"}>
                                            {isPublished ? "Đã xuất bản" : "Bản nháp"}
                                        </Badge>
                                    )}
                                </div>

                                <Switch
                                    checked={isPublished}          // bạn cần truyền state này
                                    onCheckedChange={onPublish}    // toggle → publish
                                    disabled={isSaving}
                                />
                            </div>
                        )}
                    </div>
                    {/* Quản lý từ vựng */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Danh sách từ vựng</h3>
                            <Button
                                size="sm"
                                className="px-3"
                                onClick={handleAddWord}
                                disabled={!newWord.vocabulary || !newWord.meaning}
                            >
                                Thêm
                            </Button>
                        </div>

                        {/* Form nhập từ */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                className="text-sm"
                                placeholder="Từ vựng"
                                value={newWord.vocabulary}
                                onChange={(e) => setNewWord({ ...newWord, vocabulary: e.target.value })}
                            />
                            <Input
                                className="text-sm"
                                placeholder="Nghĩa"
                                value={newWord.meaning}
                                onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
                            />
                            <Select
                                value={newWord.type}
                                onValueChange={(value) => setNewWord({ ...newWord, type: value })}
                            >
                                <SelectTrigger className="text-sm w-20">
                                    <SelectValue placeholder="Loại từ" />
                                </SelectTrigger>
                                <SelectContent className="text-sm w-20">
                                    {POS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>


                        </div>

                        {/* Danh sách từ vựng */}
                        <div className=" space-y-2 max-h-80 overflow-y-auto">
                            {vocabularies.length === 0 && (
                                <p className="text-xs text-muted-foreground">Chưa có từ nào.</p>
                            )}

                            {vocabularies.map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex items-start justify-between bg-muted/30 p-2 rounded-md"
                                >
                                    {/* Text */}
                                    {editIndex === index ? (
                                        <div className="flex flex-1 gap-2 pr-8"> {/* chừa không gian cho nút */}
                                            <Input
                                                className="text-xs h-6"
                                                value={editItem.vocabulary}
                                                onChange={(e) =>
                                                    setEditItem({ ...editItem, vocabulary: e.target.value })
                                                }
                                            />
                                            <Input
                                                className="text-xs h-6"
                                                value={editItem.meaning}
                                                onChange={(e) =>
                                                    setEditItem({ ...editItem, meaning: e.target.value })
                                                }
                                            />
                                            <Input
                                                className="text-xs h-6"
                                                value={editItem.type}
                                                onChange={(e) =>
                                                    setEditItem({ ...editItem, type: e.target.value })
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap flex-row flex-1 min-w-0 pr-8"> {/* chừa chỗ */}
                                            <span className="flex-1 font-medium text-sm break-words">
                                                {item.vocabulary}
                                            </span>
                                            <span className="text-xs text-muted-foreground break-words w-1/2">
                                                {item.meaning}
                                            </span>
                                            <span className="text-xs text-muted-foreground break-words w-1/6">
                                                {item.type}
                                            </span>
                                        </div>
                                    )}

                                    {/* Nút (KHÔNG đẩy layout, nhờ fixed width + absolute) */}
                                    <div className="relative w-8 flex justify-end">
                                        <div className="
        absolute right-0 top-[10px] -translate-y-1/2 
        flex gap-1 
        opacity-0 group-hover:opacity-100 
        pointer-events-none group-hover:pointer-events-auto
        transition-opacity
      ">
                                            {editIndex === index ? (
                                                <>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        className="text-[10px] h-6 px-2"
                                                        onClick={() => handleSave(index)}
                                                    >
                                                        Lưu
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-[10px] h-6 px-0"
                                                        onClick={cancelEdit}
                                                    >
                                                        Huỷ
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-4 w-4 text-blue-600"
                                                        onClick={() => startEdit(index)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-4 w-4 text-red-600"
                                                        onClick={() => deleteWord(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
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
    isSaving,
    onPreview,
    onSaveSuccess,
    className,
}: SpeakingExamFormProps) {
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
        register,
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
        move: moveQuestion,
    } = useFieldArray({
        control,
        name: "questions",
    });


    // Watch form values for summary
    const watchedValues = watch();

    // =====================================================
    // HANDLERS
    // =====================================================

    // Handler khi video upload thành công
    const handleVideoUploadSuccess = useCallback(
        (_result: { versionedUrl: string }) => { // dấu _ là để tạm tránh lỗi build
            //console.log("Video uploaded:", result);
            // URL đã được cập nhật qua onChange của VideoUploader
        },
        []
    );

    // Handler khi video upload thất bại
    const handleVideoUploadError = useCallback(
        (error: Error) => {
            console.error("Video upload failed:", error);
            // Có thể show toast notification ở đây
        },
        []
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

    const deleteVocabulary = useCallback((index: number) => {
        const currentVocabularies = watch("vocabularies") || [];
        const updated = currentVocabularies.filter((_: any, i: number) => i !== index);
        setValue("vocabularies", updated);
    }, [watch, setValue]);

    const updateVocabulary = useCallback((index: number, vocab: Vocabulary) => {
        const currentVocabularies = watch("vocabularies") || [];
        const updated = currentVocabularies.map((item: Vocabulary, i: number) => i === index ? vocab : item);
        setValue("vocabularies", updated);
    }, [watch, setValue]);

    const addVocabulary = useCallback((vocab: Vocabulary) => {
        const currentVocabularies = watch("vocabularies") || [];
        const sortVocabulary = [...currentVocabularies, vocab].sort((a, b) =>
            a.vocabulary.localeCompare(b.vocabulary)
        );
        setValue("vocabularies", sortVocabulary);
    }, [watch, setValue]);


    const onSubmit = useCallback(
        async (data: SpeakingExamFormValues) => {
            const dataToSave = { ...data, is_published: mode === "create" ? false : watchedValues.is_published };
            console.log("Submitting form with data:", dataToSave);
            onSaveSuccess?.(dataToSave);
        },
        [mode, onSaveSuccess, watchedValues.is_published]
    );

    const handleSaveDraft = useCallback(() => {
        handleSubmit((data: SpeakingExamFormValues) => onSubmit(data))();
    }, [handleSubmit, onSubmit]);

    const handlePublish = useCallback(() => {
        setValue("is_published", !watchedValues.is_published); // Cập nhật giá trị is_published trong form
    }, [setValue, watchedValues.is_published]);

    const handleQuestionsReorder = useCallback(
        (oldIndex: number, newIndex: number) => {
            // Di chuyển item trong mảng (useFieldArray cung cấp sẵn)
            moveQuestion(oldIndex, newIndex);

            // Cập nhật lại question_number cho tất cả câu hỏi
            // Dùng setTimeout để đảm bảo form đã cập nhật xong
            setTimeout(() => {
                questionFields.forEach((_, index) => {
                    setValue(`questions.${index}.question_number`, index + 1);
                });
            }, 0);
        },
        [moveQuestion, questionFields, setValue]
    );

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
                    onPreview={onPreview}
                    onSaveDraft={handleSaveDraft}
                />

                {/* Main Content */}
                <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
                        {/* Left Column - Main Form */}
                        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                            {/* Basic Info Section */}
                            <Card>
                                <CardHeader className="p-1 sm:p-3 !pb-0">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-primary">
                                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 " />
                                        Thông tin cơ bản
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-1 sm:p-3 space-y-3 sm:space-y-4">
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

                                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Loại đề *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn loại đề" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {typeLanguageOptions.map((option) => (
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
                                            name="level"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Độ khó *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn mức độ" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {levelExamOptions.map((option) => (
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
                                                    <FormLabel>Uớc tính (phút) *</FormLabel>
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

                            {/* Video Section - Sử dụng VideoUploader mới */}
                            <Card>
                                <CardContent className="p-1 sm:p-3 space-y-3 sm:space-y-4">
                                    <FormField
                                        control={control}
                                        name="video_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <VideoUploader
                                                        value={field.value}
                                                        thumbnailUrl={watchedValues.thumbnail}
                                                        onChange={(url, thumbnailUrl) => {
                                                            field.onChange(url);
                                                            setValue("thumbnail", thumbnailUrl);
                                                        }}
                                                        folder={CloudinaryFolder.SPEAKING_VIDEOS}
                                                        // Tạo publicId dựa trên ID của exam để ghi đè khi edit
                                                        publicId={
                                                            initialData?._id
                                                                ? `speaking_${initialData._id}`
                                                                : undefined
                                                        }
                                                        label=""
                                                        placeholder="Nhập link video YouTube hoặc Cloudinary"
                                                        error={errors.video_url?.message}
                                                        onUploadSuccess={handleVideoUploadSuccess}
                                                        onUploadError={handleVideoUploadError}
                                                    />
                                                </FormControl>
                                                {/* <FormMessage /> */}
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Script Section */}
                            <Card className="hidden">
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
                            <Card className="border-none space-y-4">
                                <CardHeader className="p-0 flex flex-row items-center justify-between">
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
                                <CardContent className="p-0 space-y-3 sm:space-y-4">
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
                                        <SortableContainer
                                            items={questionFields}
                                            onReorder={handleQuestionsReorder}
                                            direction="vertical"
                                            className="space-y-3 sm:space-y-4"
                                        >
                                            <div className="space-y-3 sm:space-y-4">
                                                {questionFields.map((field, index) => (
                                                    <DraggableQuestionItem
                                                        id={field.id}
                                                        key={field.id}
                                                        index={index}
                                                        control={control}
                                                        register={register}
                                                        onRemove={removeQuestion}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContainer>

                                    )}
                                </CardContent>
                            </Card>

                        </div>

                        {/* Right Column - Summary */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            <SummarySidebar
                                mode={mode}
                                isPublished={watchedValues.is_published}
                                isSaving={isSaving}
                                examType={watchedValues.type}
                                vocabularies={watchedValues.vocabularies || []}
                                onPublish={handlePublish}
                                addVocabulary={addVocabulary}
                                updateVocabulary={updateVocabulary}
                                deleteVocabulary={deleteVocabulary}
                            />
                            <div>
                                {/* Multiple Choice Questions Section */}
                                <Card className="p-0">
                                    <CardContent className="p-1 sm:p-3">
                                        <MultipleChoiceQuestionEditor
                                            control={control}
                                            watch={watch}
                                            setValue={setValue}
                                            register={register}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </Form>
    );
}

export default SpeakingExamForm;
