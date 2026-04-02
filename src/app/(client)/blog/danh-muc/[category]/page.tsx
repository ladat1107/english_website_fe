"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import BlogHero from "@/components/blog/blog-hero";
import BlogGrid from "@/components/blog/blog-grid";
import BlogSidebar from "@/components/blog/blog-sidebar";
import BlogPagination from "@/components/blog/blog-pagination";
import BlogBreadcrumb from "@/components/blog/blog-breadcrumb";
import { useGetAllBlogs } from "@/hooks/use-blog";
import { getCategoryFromSlug, BLOG_CATEGORY_LABELS, BLOG_CATEGORY_DESCRIPTIONS } from "@/types/blog.type";
import { BlogType } from "@/types/blog.type";
import { PATHS } from "@/utils/constants";
import BlogSearch from "@/components/blog/blog-search";
import { BlogCategory } from "@/utils/constants/enum";

function CategoryPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const categorySlug = params.category as string;
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";

    const blogCategory = getCategoryFromSlug(categorySlug);
    const categoryLabel = blogCategory
        ? BLOG_CATEGORY_LABELS[blogCategory]
        : categorySlug;

    const { data, isLoading } = useGetAllBlogs({
        page,
        limit: 9,
        search: search || undefined,
        category: blogCategory || undefined
    });

    const blogs: BlogType[] = data?.data?.items || data?.data || [];
    const pagination = data?.data?.pagination || data?.pagination;
    const totalPages = pagination?.totalPages || 1;

    return (
        <>
            <BlogHero
                title={categoryLabel}
                description={BLOG_CATEGORY_DESCRIPTIONS[blogCategory as BlogCategory]}
            />

            <div className="container-custom py-8 md:py-12">
                {/* Breadcrumb */}
                <BlogBreadcrumb
                    items={[
                        { label: "Blog", href: PATHS.CLIENT.BLOG },
                        { label: categoryLabel },
                    ]}
                />

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="hidden md:block md:w-[200px] lg:w-[300px] sticky top-16 shrink-0">
                        <BlogSidebar
                            activeCategory={categorySlug}
                        />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6"
                        >
                            <h2 className="!text-xl font-bold text-primary">
                                {categoryLabel}
                                {pagination?.totalItems !== undefined && (
                                    <span className="text-muted-foreground font-normal text-sm ml-2">
                                        ({pagination.totalItems} bài viết)
                                    </span>
                                )}
                            </h2>
                        </motion.div>

                        <div className="mb-4">
                            {/* Search bar */}
                            <BlogSearch activeCategory={blogCategory} />

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

                        <BlogGrid
                            blogs={blogs}
                            loading={isLoading}
                            emptyMessage={`Chưa có bài viết nào trong danh mục "${categoryLabel}".`}
                        />

                        <BlogPagination
                            currentPage={page}
                            totalPages={totalPages}
                            basePath={PATHS.CLIENT.BLOG_CATEGORY(categorySlug)}
                        />
                    </div>


                </div>
            </div>
        </>
    );
}

export default function BlogCategoryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background">
                <div className="h-48 bg-muted animate-pulse" />
                <div className="container-custom py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <CategoryPageContent />
        </Suspense>
    );
}
