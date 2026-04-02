"use client";

import { BlogType } from "@/types/blog.type";
import { PATHS } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { estimateReadingTime, generateBlogSlug } from "@/utils/seo-funtions";

interface BlogCardProps {
    blog: BlogType;
    index?: number;
    variant?: "default" | "horizontal";
}

export default function BlogCard({ blog, index = 0, variant = "default" }: BlogCardProps) {
    const slug = generateBlogSlug(blog.title, blog._id);
    const readTime = estimateReadingTime(blog.content);

    if (variant === "horizontal") {
        return (
            <motion.article
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors duration-200"
            >
                <Link href={PATHS.CLIENT.BLOG_DETAIL(slug)} className="flex gap-4 w-full">
                    <div className="relative w-28 h-20 sm:w-40 sm:h-24 rounded-lg overflow-hidden shrink-0">
                        <Image
                            src={blog.image || "/image/placeholder-blog.jpg"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span>{dayjs(blog.createdAt).format("DD/MM/YYYY")}</span>
                            <span>·</span>
                            <span>{readTime} phút đọc</span>
                        </div>

                        <h3 className="text-lg md:text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {blog.title}
                        </h3>

                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                            {blog.description}
                        </p>

                    </div>
                </Link>
            </motion.article>
        );
    }

    // Default card
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-border/50 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
        >
            <Link href={PATHS.CLIENT.BLOG_DETAIL(slug)} className="block">
                <div className="relative aspect-[16/8] overflow-hidden">
                    <Image
                        src={blog.image || "/image/placeholder-blog.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                </div>
                <div className="flex flex-col flex-1 py-2 px-3">
                    <h3 className="text-lg font-bold text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-1 min-h-[3rem]">
                        {blog.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1 min-h-[3rem] whitespace-pre-line">
                        {blog.description}
                    </p>
                </div>
            </Link>
        </motion.article>
    );
}
