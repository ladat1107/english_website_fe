"use client";

import { useParams, useRouter } from "next/navigation";
import { Newspaper, Loader2 } from "lucide-react";
import BlogForm, { BlogSchema } from "@/components/blog/blog-form";
import { useGetBlogById, useUpdateBlog } from "@/hooks/use-blog";
import { PATHS } from "@/utils/constants";
import { useToast } from "@/components/ui/toaster";

export default function AdminBlogEditPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params.id as string;
    const { addToast } = useToast();

    const { data, isLoading } = useGetBlogById(blogId);
    const blog = data?.data || data;
    const updateMutation = useUpdateBlog(blogId);

    const handleSubmit = async (data: BlogSchema) => {
        try {
            await updateMutation.mutateAsync(data);
            addToast("Cập nhật bài viết thành công!", "success");
            router.push(PATHS.ADMIN.BLOG);
        } catch (error: any) {
            addToast(error?.message || "Có lỗi khi cập nhật bài viết.", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="p-6 text-center py-20">
                <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h2>
                <p className="text-gray-500 mb-4">Bài viết không tồn tại hoặc đã bị xóa.</p>
                <button
                    onClick={() => router.push(PATHS.ADMIN.BLOG)}
                    className="text-primary hover:underline text-sm font-medium"
                >
                    ← Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <BlogForm
            initialData={blog}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
        />
    );
}
