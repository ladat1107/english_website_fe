"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Newspaper,
    MoreVertical,
    Pencil,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { PATHS } from "@/utils/constants";
import { useGetAllBlogs, useDeleteBlog } from "@/hooks/use-blog";
import { BlogType, BLOG_CATEGORY_LABELS, BlogParams } from "@/types/blog.type";
import { BlogCategory } from "@/utils/constants/enum";
import { cn } from "@/utils";
import { useToast } from "@/components/ui/toaster";
import { generateBlogSlug } from "@/utils/seo-funtions";
import { useDebounce } from "@/hooks";
import { useConfirmDialogContext } from "@/components/ui/confirm-dialog-context";

function BlogManagementContent() {
    const router = useRouter();
    const { addToast } = useToast();
    const { confirm } = useConfirmDialogContext();

    const [search, setSearch] = useState("");
    const seachDebounce = useDebounce(search, 300);
    const [params, setParams] = useState<BlogParams>({
        page: 1,
        limit: 12,
        search: seachDebounce,
        category: undefined,
    });

    const { data, isLoading } = useGetAllBlogs(params);

    const blogs: BlogType[] = data?.data?.items || data?.data || [];
    const pagination = data?.data?.pagination || data?.pagination;

    const { mutate: deleteMutation } = useDeleteBlog();

    useEffect(() => {
        setParams((pre) => ({
            ...pre,
            page: 1, // reset về trang 1 khi search thay đổi
            search: seachDebounce,
        }));
    }, [seachDebounce]);

    const handleDelete = async (id: string, title: string) => {
        confirm({
            title: "Xác nhận xóa",
            description: `Bạn có chắc muốn xóa bài viết "${title}"? Hành động này không thể hoàn tác.`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: async () => {
                deleteMutation(id, {
                    onSuccess: () => { addToast("Đã xóa bài viết thành công!", "success"); }
                })
            }
        });
    };

    const setFilter = (key: keyof BlogParams, value: any) => {
        setParams((prev) => ({ ...prev, [key]: value, page: 1, }));
    };
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Newspaper className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Blog</h1>
                        <p className="text-sm text-gray-500">
                            {pagination?.totalItems || 0} bài viết
                        </p>
                    </div>
                </div>
                <Link href={PATHS.ADMIN.BLOG_CREATE}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tạo bài viết
                    </Button>
                </Link>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm bài viết..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                                 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>

                <select
                    value={params.category || ""}
                    onChange={(e) => setFilter("category", e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                             focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[160px]"
                >
                    <option value="">Tất cả danh mục</option>
                    {Object.values(BlogCategory).map((cat) => (
                        <option key={cat} value={cat}>
                            {BLOG_CATEGORY_LABELS[cat]}
                        </option>
                    ))}
                </select>
            </motion.div>

            {/* Blog list */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="border-0 shadow-sm overflow-hidden">
                                <div className="aspect-video bg-gray-100 animate-pulse" />
                                <CardContent className="p-4 space-y-3">
                                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-16 text-center">
                            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Chưa có bài viết nào</p>
                            <Link href={PATHS.ADMIN.BLOG_CREATE}>
                                <Button variant="outline" className="mt-4 gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tạo bài viết đầu tiên
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {blogs.map((blog) => (
                            <Card key={blog._id} className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="relative aspect-video bg-gray-100">
                                    {blog.image ? (
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Newspaper className="w-8 h-8 text-gray-300" />
                                        </div>
                                    )}
                                    {/* Status badges */}
                                    <div className="absolute top-2 left-2 flex gap-1.5">
                                        <span className={cn(
                                            "px-2 py-0.5 text-xs font-semibold rounded-full",
                                            blog.is_public
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        )}>
                                            {blog.is_public ? "Công khai" : "Bản nháp"}
                                        </span>
                                        {blog.is_special && (
                                            <span className="px-2 py-0.5 text-xxs font-semibold bg-amber-100 text-amber-700 rounded-full">
                                                Nổi bật
                                            </span>
                                        )}
                                    </div>
                                    {/* Actions */}
                                    <div className="absolute top-2 right-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(PATHS.ADMIN.BLOG_EDIT(blog._id))}
                                                    className="gap-2"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        const slug = generateBlogSlug(blog.title, blog._id);
                                                        window.open(PATHS.CLIENT.BLOG_DETAIL(slug), "_blank");
                                                    }}
                                                    className="gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Xem trước
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(blog._id, blog.title)}
                                                    className="gap-2 text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa bài viết
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 text-xxs font-medium text-primary bg-primary/10 rounded-full">
                                            {BLOG_CATEGORY_LABELS[blog.category as BlogCategory] || blog.category}
                                        </span>
                                        <span className="text-xxs text-gray-400">
                                            {dayjs(blog.createdAt).format("DD/MM/YYYY")}
                                        </span>
                                    </div>
                                    <h3
                                        className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => router.push(PATHS.ADMIN.BLOG_EDIT(blog._id))}
                                    >
                                        {blog.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {blog.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function AdminBlogPage() {
    return (
        <Suspense fallback={
            <div className="p-6">
                <div className="h-10 w-48 bg-gray-100 rounded animate-pulse mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        }>
            <BlogManagementContent />
        </Suspense>
    );
}
