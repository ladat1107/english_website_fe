"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BlogHero from "@/components/blog/blog-hero";
import BlogGrid from "@/components/blog/blog-grid";
import BlogSidebar from "@/components/blog/blog-sidebar";
import BlogSearch from "@/components/blog/blog-search";
import BlogPagination from "@/components/blog/blog-pagination";
import { useGetAllBlogs } from "@/hooks/use-blog";
import { BlogType } from "@/types/blog.type";
import { motion } from "framer-motion";


function BlogPageContent() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";

    const { data, isLoading } = useGetAllBlogs({
        page,
        limit: 10,
        search: search || undefined,
    });

    const blogs: BlogType[] = data?.data?.items || data?.data || [];
    const pagination = data?.data?.pagination || data?.pagination;
    const totalPages = pagination?.totalPages || 1;

    return (
        <>
            <BlogHero />

            <div className="container-custom pt-5 pb-8 md:pb-12">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="hidden md:block md:w-[200px] lg:w-[300px] sticky top-16 shrink-0">
                        <BlogSidebar />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-4">
                            {/* Search bar */}
                            <BlogSearch activeCategory="ALL" />

                            {search && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-muted-foreground mb-6"
                                >
                                    Kết quả tìm kiếm cho: <strong className="text-foreground">&quot;{search}&quot;</strong>
                                    {pagination?.totalItems !== undefined && (
                                        <span className="ml-1">({pagination.totalItems} bài viết)</span>
                                    )}
                                </motion.p>
                            )}
                        </div>

                        {/* Blog grid */}
                        <BlogGrid
                            blogs={blogs}
                            loading={isLoading}
                            emptyMessage={
                                search
                                    ? `Không tìm thấy bài viết nào cho "${search}"`
                                    : "Chưa có bài viết nào."
                            }
                        />

                        {/* Pagination */}
                        <BlogPagination currentPage={page} totalPages={totalPages} />
                    </div>


                </div>
            </div>
        </>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background">
                <div className="h-48 bg-muted animate-pulse" />
                <div className="container-custom py-12">
                    <div className="h-10 w-64 bg-muted rounded-xl animate-pulse mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <BlogPageContent />
        </Suspense>
    );
}
