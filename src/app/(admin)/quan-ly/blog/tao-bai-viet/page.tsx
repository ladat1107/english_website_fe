"use client";

import { useRouter } from "next/navigation";

import BlogForm, { BlogSchema } from "@/components/blog/blog-form";
import { useCreateBlog } from "@/hooks/use-blog";
import { PATHS } from "@/utils/constants";
import { useToast } from "@/components/ui/toaster";

export default function AdminBlogCreatePage() {
    const router = useRouter();
    const { addToast } = useToast();
    const createMutation = useCreateBlog();

    const handleSubmit = async (data: BlogSchema) => {
        try {
            await createMutation.mutateAsync(data);
            addToast("Tạo bài viết thành công!", "success");
            router.push(PATHS.ADMIN.BLOG);
        } catch (error: any) {
            addToast(error?.message || "Có lỗi khi tạo bài viết.", "error");
        }
    };

    return (
        <BlogForm
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
        />
    );
}
