"use client";

import { BLOG_CATEGORY_LABELS, BLOG_CATEGORY_SLUGS } from "@/types/blog.type";
import { BlogCategory } from "@/utils/constants/enum";
import { PATHS } from "@/utils/constants";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import {
    Newspaper,
    LayoutDashboard,
    Lightbulb,
    BookOpen,
    Sigma,
    Library,
    Bell
} from "lucide-react";

export const BLOG_CATEGORY_ICONS = {
    ["ALL" as BlogCategory]: LayoutDashboard,
    [BlogCategory.NEWS]: Newspaper,
    [BlogCategory.OVERVIEW]: LayoutDashboard,
    [BlogCategory.IELTS_TIPS]: Lightbulb,
    [BlogCategory.STUDY_GUIDE]: BookOpen,
    [BlogCategory.GRAMMAR]: Sigma,
    [BlogCategory.VOCABULARY]: Library,
    [BlogCategory.ANNOUNCEMENT]: Bell,
};

interface BlogSidebarProps {
    activeCategory?: string;
    className?: string;
}

export default function BlogSidebar({ activeCategory, className }: BlogSidebarProps) {
    const categories: BlogCategory[] = ["ALL" as BlogCategory, ...Object.values(BlogCategory)];

    return (
        <aside className={cn("space-y-6 border-r-2 border-border/50 ", className)}>
            {/* Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white pe-5"
            >
                <ul className="space-y-2">
                    {/* Categories */}
                    {categories.map((cat, index) => {
                        const slug = BLOG_CATEGORY_SLUGS[cat];
                        const isActive = activeCategory === slug;

                        const Icon = BLOG_CATEGORY_ICONS[cat];

                        return (
                            <li key={cat}>
                                <Link href={index === 0 ? PATHS.CLIENT.BLOG : PATHS.CLIENT.BLOG_CATEGORY(slug)}>
                                    <div
                                        className={cn(
                                            "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer pe-5",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-muted/60"
                                        )}
                                    >
                                        <Icon className="w-5 h-5 group-hover:text-primary" />

                                        <span
                                            className={cn(
                                                "text-base font-medium",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-foreground group-hover:text-primary"
                                            )}
                                        >
                                            {BLOG_CATEGORY_LABELS[cat]}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </motion.div>


        </aside>
    );
}
