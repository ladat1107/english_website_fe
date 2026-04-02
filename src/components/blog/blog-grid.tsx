"use client";

import { BlogType } from "@/types/blog.type";
import BlogCard from "./blog-card";
import LoadingCustom from "../ui/loading-custom";

interface BlogGridProps {
    blogs: BlogType[];
    loading?: boolean;
    emptyMessage?: string;
}

export default function BlogGrid({ blogs, loading, emptyMessage = "Chưa có bài viết nào." }: BlogGridProps) {
    if (loading) {
        return <LoadingCustom />
    }

    if (!blogs || blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>
                <p className="text-muted-foreground font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {blogs.map((blog, index) => (
                <BlogCard key={blog._id} blog={blog} index={index} variant="horizontal" />
            ))}
        </div>
    );
}
