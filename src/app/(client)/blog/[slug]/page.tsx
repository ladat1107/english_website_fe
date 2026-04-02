"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, Copy } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";

import BlogContent from "@/components/blog/blog-content";
import BlogToc from "@/components/blog/blog-toc";
import BlogBreadcrumb from "@/components/blog/blog-breadcrumb";
import BlogRelated from "@/components/blog/blog-related";
import SidebarPromo from "@/components/blog/blog-sidebar-promo";
import LoadingCustom from "@/components/ui/loading-custom";

import {
    useGetBlogById,
    useGetPublicBlogs,
} from "@/hooks/use-blog";

import {
    BLOG_CATEGORY_LABELS,
    BLOG_CATEGORY_SLUGS,
    BlogType,
} from "@/types/blog.type";

import { BlogCategory } from "@/utils/constants/enum";
import { PATHS, SITE_CONFIG } from "@/utils/constants";
import { useToast } from "@/components/ui/toaster";
import BlogHero from "@/components/blog/blog-hero";
import { estimateReadingTime, extractIdFromSlug } from "@/utils/seo-funtions";

export default function BlogDetailPage() {
    const params = useParams();
    const { addToast } = useToast();
    const slug = params.slug as string;
    const blogId = extractIdFromSlug(slug);

    const { data, isLoading, error } = useGetBlogById(blogId);
    const blog: BlogType = data?.data || data;

    const { data: relatedData } = useGetPublicBlogs({ limit: 1000, category: blog?.category });

    const relatedPosts =
        relatedData?.data?.items || relatedData?.data || [];

    if (isLoading) return <LoadingCustom />;

    if (error || !blog) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-2xl font-bold mb-3">
                    Không tìm thấy bài viết
                </h1>
                <a
                    href={PATHS.CLIENT.BLOG}
                    className="px-5 py-2.5 bg-primary text-white rounded-lg"
                >
                    Quay lại Blog
                </a>
            </div>
        );
    }

    const readTime = estimateReadingTime(blog.content);
    const categoryLabel =
        BLOG_CATEGORY_LABELS[blog.category as BlogCategory] ||
        blog.category;

    const categorySlug =
        BLOG_CATEGORY_SLUGS[blog.category as BlogCategory] ||
        blog.category;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.description,
        image: blog.image,
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt,
        author: {
            "@type": "Person",
            name: blog.author?.full_name || "Khailingo",
        },
        publisher: {
            "@type": "Organization",
            name: SITE_CONFIG.name,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
            },
        },
    };

    const getCurrentUrl = (): string => {
        if (typeof window === "undefined") return "";
        return window.location.href;
    };

    const handleCopyLink = async (): Promise<void> => {
        try {
            const url = getCurrentUrl();
            await navigator.clipboard.writeText(url);
            addToast("Đã sao chép liên kết!", "success");
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    return (
        <>
            {/* SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />

            <BlogHero />

            <div className="bg-background min-h-screen">
                <div className="container-custom py-6 md:py-8">

                    {/* Breadcrumb */}
                    <BlogBreadcrumb
                        items={[
                            { label: "Blog", href: PATHS.CLIENT.BLOG },
                            {
                                label: categoryLabel,
                                href: PATHS.CLIENT.BLOG_CATEGORY(categorySlug),
                            },
                            { label: blog.title },
                        ]}
                    />

                    {/* ===== MAIN LAYOUT ===== */}
                    <div className="relative mt-6">
                        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">

                            {/* LEFT SIDEBAR */}
                            <aside className="hidden lg:block w-[260px] shrink-0 sticky top-16 self-start">
                                <SidebarPromo />
                            </aside>

                            {/* MAIN CONTENT */}
                            <main className="flex-1 min-w-0 max-w-3xl">

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* Category */}
                                    <div className="mb-4">
                                        <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                                            {categoryLabel}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                                        {blog.title}
                                    </h1>

                                    {/* Description */}
                                    {blog.description && (
                                        <p className="text-sm sm:text-base text-muted-foreground mb-6 whitespace-pre-line text-justify">
                                            {blog.description}
                                        </p>
                                    )}

                                    {/* Meta */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                                        {/* Author */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                {blog.author?.avatar_url ? (
                                                    <Image
                                                        src={blog.author.avatar_url}
                                                        alt={blog.author.full_name || "K"}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <span className="text-xs font-bold text-primary">
                                                        {(blog.author?.full_name || "K")[0]}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="font-medium text-foreground">
                                                {blog.author?.full_name || "Khailingo"}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {dayjs(blog.createdAt).format("DD/MM/YYYY")}
                                        </span>

                                        {/* Read time */}
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {readTime} phút đọc
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-auto">
                                            {/* Copy */}
                                            <button
                                                onClick={handleCopyLink}
                                                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition"
                                            >
                                                <Copy className="w-3 h-3" />
                                                <span className="hidden sm:inline text-xs">Copy link</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    {blog.image && (
                                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                                            <Image
                                                src={blog.image}
                                                alt={blog.title}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <BlogContent content={blog.content} />
                                </motion.div>
                            </main>

                            {/* RIGHT TOC */}
                            <aside className="hidden md:block w-[260px] shrink-0 sticky top-16 self-start">
                                <BlogToc content={blog.content} />
                            </aside>
                        </div>
                    </div>

                    {/* ===== RELATED POSTS (OUTSIDE) ===== */}
                    <div className="mt-16">
                        <BlogRelated
                            posts={relatedPosts}
                            currentId={blog._id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}