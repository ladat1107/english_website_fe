/**
 * Khailingo - Writing Exam Form Component
 * Component form chung cho tạo và chỉnh sửa đề luyện viết
 */

"use client";

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ArrowLeft,
    PenLine,
    Save,
    Loader2,
    FileText,
    Image as ImageIcon,
    X,
    Upload,
} from 'lucide-react';
import {
    Button,
    Input,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
} from '@/components/ui';
import { Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { CloudinaryFolder } from '@/lib/cloudinary';
import { levelExamOptions, typeLanguageOptions, Vocabulary, vocabularySchema } from '@/types/speaking.type';
import { LevelExam, TypeLanguage } from '@/utils/constants/enum';
import z from 'zod';
import VocabularyAdmin from '../speaking/vocabulary-admin';

export const writingExamSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề').max(200, 'Tiêu đề không được quá 200 ký tự'),
    content: z.string().min(1, 'Vui lòng nhập nội dung đề bài').max(10000, 'Nội dung không được quá 10000 ký tự'),
    images: z.array(z.string().url('URL hình ảnh không hợp lệ')),
    type: z.enum(TypeLanguage),
    is_published: z.boolean(),
    level: z.enum(LevelExam),
    vocabularies: z.array(vocabularySchema).optional(),
});

export type WritingExamFormData = z.infer<typeof writingExamSchema>;

interface WritingExamFormProps {
    mode: 'create' | 'edit';
    defaultValues?: Partial<WritingExamFormData>;
    onSubmit: (data: WritingExamFormData) => void;
    isSubmitting: boolean;
    backUrl: string;
}

export default function WritingExamForm({ mode, defaultValues, onSubmit, isSubmitting, backUrl, }: WritingExamFormProps) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<WritingExamFormData>({
        resolver: zodResolver(writingExamSchema),
        defaultValues: {
            title: '',
            content: '',
            images: [],
            type: TypeLanguage.ENGLISH,
            is_published: false,
            ...defaultValues,
        },
    });

    const { uploadImage, isUploading, progress } = useCloudinaryUpload({
        folder: CloudinaryFolder.GENERAL_IMAGES,
    });

    // Watch fields
    const images = watch('images');
    const content = watch('content');
    const isPublished = watch('is_published');

    // Update form values when defaultValues change (for edit mode)
    useEffect(() => {
        if (defaultValues) {
            Object.entries(defaultValues).forEach(([key, value]) => {
                setValue(key as keyof WritingExamFormData, value as any);
            });
        }
    }, [defaultValues, setValue]);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages = [...images];
        for (let i = 0; i < files.length; i++) {
            const result = await uploadImage(files[i]);
            if (result) {
                newImages.push(result.secureUrl);
            }
        }
        setValue('images', newImages);
    };

    // Remove image
    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setValue('images', newImages);
    };

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

    return (
        <div className="min-h-screen bg-background pb-8">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link href={backUrl}>
                            <Button variant="ghost" size="icon-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <PenLine className="w-5 h-5 text-primary" />
                                {mode === 'create' ? 'Tạo đề luyện viết mới' : 'Chỉnh sửa đề luyện viết'}
                            </h1>
                        </div>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {mode === 'create' ? 'Đang tạo...' : 'Đang lưu...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {mode === 'create' ? 'Lưu đề' : 'Lưu thay đổi'}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="container-custom mx-auto px-4 py-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-3 space-y-4">
                            {/* Basic Info Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        Thông tin đề bài
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">
                                            Tiêu đề đề bài <span className="text-destructive">*</span>
                                        </label>
                                        <Controller
                                            name="title"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="VD: Viết về gia đình của bạn"
                                                    className={errors.title ? 'border-destructive' : ''}
                                                />
                                            )}
                                        />
                                        {errors.title && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.title.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-2 gap-2'>

                                        {/* Language */}
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">
                                                Ngôn ngữ <span className="text-destructive">*</span>
                                            </label>
                                            <Controller
                                                name="type"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className={`w-full ${errors.type ? 'border-destructive' : ''}`}>
                                                            <SelectValue placeholder="Chọn ngôn ngữ" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {typeLanguageOptions.map((opt) => (
                                                                <SelectItem key={opt.key} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.type && (
                                                <p className="text-xs text-destructive mt-1">{errors.type.message}</p>
                                            )}
                                        </div>

                                        {/* Level */}
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">
                                                Độ khó <span className="text-destructive">*</span>
                                            </label>
                                            <Controller
                                                name="level"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className={`w-full ${errors.level ? 'border-destructive' : ''}`}>
                                                            <SelectValue placeholder="Chọn độ khó" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {levelExamOptions.map((opt) => (
                                                                <SelectItem key={opt.key} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.level && (
                                                <p className="text-xs text-destructive mt-1">{errors.level.message}</p>
                                            )}
                                        </div>
                                    </div>



                                    {/* Content */}
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">
                                            Nội dung đề bài <span className="text-destructive">*</span>
                                        </label>
                                        <Controller
                                            name="content"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    placeholder="Nhập nội dung đề bài chi tiết..."
                                                    rows={10}
                                                    className={errors.content ? 'border-destructive' : ''}
                                                />
                                            )}
                                        />
                                        <div className="flex items-center justify-between mt-1">
                                            {errors.content ? (
                                                <p className="text-xs text-destructive">
                                                    {errors.content.message}
                                                </p>
                                            ) : (
                                                <span />
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {content?.length || 0} / 10000 ký tự
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Status & Images Card */}
                            <Card>
                                <CardContent className="pt-6">
                                    {/* Status Section */}
                                    <div className="pb-4 border-b border-border mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium">
                                                Trạng thái
                                                <Badge
                                                    className="text-[10px] ms-2 py-0.5"
                                                    variant={isPublished ? 'success' : 'warning'}
                                                >
                                                    {isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                                                </Badge>
                                            </div>
                                            <Controller
                                                name="is_published"
                                                control={control}
                                                render={({ field }) => (
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isSubmitting}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="pb-4 border-b border-border mb-4 min-h-[200px]">
                                        <VocabularyAdmin
                                            examType={watch('type') as TypeLanguage}
                                            vocabularies={watch('vocabularies') || []}
                                            addVocabulary={addVocabulary}
                                            updateVocabulary={updateVocabulary}
                                            deleteVocabulary={deleteVocabulary}
                                        />
                                    </div>


                                    {/* Images Section */}
                                    <div>
                                        <div className='flex justify-between items-center gap-2'>
                                            <div className="text-base font-medium flex items-center gap-2 mb-4">
                                                <ImageIcon className="w-5 h-5 text-primary" />
                                                Hình ảnh đề bài (tùy chọn)
                                            </div>

                                            {/* Upload button */}
                                            <div className="mb-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                    disabled={isUploading}
                                                />
                                                <Button
                                                    type="button"
                                                    size={'sm'}
                                                    variant="outline"
                                                    className="gap-2 w-full sm:w-auto"
                                                    disabled={isUploading}
                                                    onClick={() => document.getElementById('image-upload')?.click()}
                                                >
                                                    {isUploading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Đang tải ({progress}%)
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-4 h-4" />
                                                            Tải ảnh lên
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>


                                        {/* Image preview */}
                                        {images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {images.map((url, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative aspect-video rounded-lg overflow-hidden group"
                                                    >
                                                        <Image
                                                            src={url}
                                                            alt={`Image ${idx + 1}`}
                                                            fill
                                                            className="object-contain cursor-pointer"
                                                            onClick={() => window.open(url, '_blank')}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {errors.images && (
                                            <p className="text-xs text-destructive mt-2">
                                                {errors.images.message}
                                            </p>
                                        )}
                                    </div>


                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
