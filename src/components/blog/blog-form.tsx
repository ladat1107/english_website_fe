"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, EyeOff, ArrowLeft, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BlogType, BLOG_CATEGORY_LABELS } from "@/types/blog.type";
import { BlogCategory } from "@/utils/constants/enum";
import { PATHS } from "@/utils/constants";
import { cn } from "@/utils";
import { useCloudinaryUpload } from "@/hooks";
import { CloudinaryFolder } from "@/lib/cloudinary";
import Image from "next/image";
import { z } from "zod";

// Lazy load editor để tránh SSR issues
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { AutoResizeTextarea } from "../ui/auto-resize-text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui";
const TextEditor = dynamic(
    () => import("@/components/text-editor/text-editor"),
    { ssr: false, loading: () => <div className="h-[400px] bg-gray-50 rounded-lg animate-pulse" /> }
);



export const blogSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    content: z.string().min(1, "Nội dung không hợp lệ"),
    image: z.string().min(1, "Ảnh bìa không được để trống"),
    category: z.string(),
    is_public: z.boolean(),
    is_special: z.boolean(),
});

export type BlogSchema = z.infer<typeof blogSchema>;

interface BlogFormProps {
    initialData?: BlogType;
    onSubmit: (data: BlogSchema) => Promise<void>;
    isSubmitting?: boolean;
}

export default function BlogForm({ initialData, onSubmit, isSubmitting }: BlogFormProps) {
    const router = useRouter();
    const [showPreview, setShowPreview] = useState(false);

    const form = useForm<BlogSchema>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            content: initialData?.content || "",
            image: initialData?.image || "",
            category: initialData?.category || BlogCategory.NEWS,
            is_public: initialData?.is_public ?? false,
            is_special: initialData?.is_special ?? false,
        },
    });
    const { setValue, watch, formState } = form;
    const errors = formState.errors;



    const { isUploading, progress, uploadImage } = useCloudinaryUpload({
        folder: CloudinaryFolder.BLOG_IMAGES,
        onSuccess: (result) => {
            setValue("image", result.secureUrl);
        },
    });

    const handleSubmit = async (data: BlogSchema) => {
        await onSubmit(data);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    return (
        <div className="container-custom py-4 sm:py-6 md:py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push(PATHS.ADMIN.BLOG)}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </Button>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPreview(!showPreview)}
                                className="gap-2"
                            >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {showPreview ? "Ẩn preview" : "Xem trước"}
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[140px]">
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {initialData ? "Cập nhật" : "Đăng bài"}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main content - left */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Title */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-2 space-y-4">
                                    <div>
                                        <Label htmlFor="blog-title" className="text-sm font-semibold mb-1.5 block">
                                            Tiêu đề bài viết <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="blog-title"
                                            {...form.register("title")}
                                            placeholder="Nhập tiêu đề bài viết..."
                                            className={cn("text-base", errors.title && "border-red-500")}
                                        />
                                        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="blog-description" className="text-sm font-semibold mb-1.5 block">
                                            Mô tả ngắn <span className="text-red-500">*</span>
                                        </Label>
                                        <AutoResizeTextarea
                                            id="blog-description"
                                            {...form.register("description")}
                                            placeholder="Mô tả ngắn gọn về bài viết"
                                            rows={8}
                                            style={{ minHeight: "1.25rem" }}
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = "auto";
                                                target.style.height = target.scrollHeight + "px";
                                            }}
                                        />
                                        <div className="flex justify-between mt-1">
                                            {errors.description ? (<p className="text-red-500 text-xs">{errors.description.message}</p>) : (<span />)}

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Editor */}
                            <Card className="hidden md:block border-0 shadow-sm">
                                <CardContent className="p-2">
                                    <Label className="text-sm font-semibold mb-3 block">Nội dung bài viết <span className="text-red-500">*</span></Label>
                                    <TextEditor
                                        value={watch("content")}
                                        onChange={(val) => setValue("content", val)}
                                        placeholder="Bắt đầu viết nội dung..."
                                        error={errors.content?.message}
                                        className="sm:max-h-[80vh]"
                                    />

                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - right */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 gap-2">
                                {/* Thumbnail */}
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-2">
                                        <Label className="text-sm font-semibold mb-3 block">Ảnh bìa *</Label>
                                        <div
                                            className={cn(
                                                "relative rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                                                watch("image") ? "border-transparent" : "border-border hover:border-primary/50",
                                                errors.image && !watch("image") && "border-red-500"
                                            )}
                                        >
                                            {watch("image") ? (
                                                <div className="relative aspect-video">
                                                    <Image
                                                        src={watch("image")}
                                                        alt="Ảnh bìa"
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                        <label className="cursor-pointer text-white text-sm font-medium px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors">
                                                            Đổi ảnh
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
                                                    {isUploading ? (
                                                        <div className="text-center">
                                                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                                                            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="w-10 h-10 text-muted-foreground/50 mb-2" />
                                                            <span className="text-sm text-muted-foreground">Nhấn để tải ảnh lên</span>
                                                            <span className="text-xs text-muted-foreground/70 mt-1">PNG, JPG (tối đa 5MB)</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        {errors.image && !watch("image") && (<p className="text-red-500 text-xs mt-1">{errors.image.message}</p>)}
                                    </CardContent>
                                </Card>

                                {/* Settings */}
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-2 space-y-4">
                                        <Label className="text-sm font-semibold block">Cài đặt</Label>

                                        {/* Category */}
                                        <div>
                                            <Label htmlFor="blog-category" className="text-xs text-muted-foreground mb-1 block">
                                                Danh mục
                                            </Label>
                                            <Select
                                                key="blog-category"
                                                value={watch("category")}
                                                onValueChange={(value) => setValue("category", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(BlogCategory).map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {BLOG_CATEGORY_LABELS[cat]}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Toggles */}
                                        <div className="flex items-center justify-between py-2">
                                            <div>
                                                <p className="text-sm font-medium">Công khai</p>
                                                <p className="text-xs text-muted-foreground">Hiển thị cho tất cả người dùng</p>
                                            </div>
                                            <Switch
                                                checked={watch("is_public")}
                                                onCheckedChange={(value) => setValue("is_public", value)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-t border-border/50">
                                            <div>
                                                <p className="text-sm font-medium">Nổi bật</p>
                                                <p className="text-xs text-muted-foreground">Ghim lên đầu danh sách</p>
                                            </div>
                                            <Switch
                                                checked={watch("is_special")}
                                                onCheckedChange={(value) => setValue("is_special", value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Editor */}
                            <Card className="md:hidden border-0 shadow-sm">
                                <CardContent className="p-2">
                                    <Label className="text-sm font-semibold mb-3 block">Nội dung bài viết <span className="text-red-500">*</span></Label>
                                    <TextEditor
                                        value={watch("content")}
                                        onChange={(val) => setValue("content", val)}
                                        placeholder="Bắt đầu viết nội dung..."
                                        error={errors.content?.message}
                                        className="sm:max-h-[80vh]"
                                    />

                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form >
        </div>
    );
}
