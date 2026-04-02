"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { List } from "lucide-react";
import { cn } from "@/utils";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface BlogTocProps {
    content: string;
    className?: string;
}

/**
 * Table of Contents - Auto generate từ headings trong HTML content
 * Sticky sidebar, highlight heading đang xem
 */
export default function BlogToc({ content, className }: BlogTocProps) {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    // Parse headings từ content HTML
    useEffect(() => {
        // Đợi DOM render xong
        const timer = setTimeout(() => {
            const articleEl = document.querySelector("[data-blog-content]");
            if (!articleEl) return;

            const elements = articleEl.querySelectorAll("h2, h3, h4");
            const items: TocItem[] = [];

            elements.forEach((el, index) => {
                const id = el.id || `heading-${index}`;
                if (!el.id) el.id = id;
                items.push({
                    id,
                    text: el.textContent || "",
                    level: parseInt(el.tagName.charAt(1)),
                });
            });

            setHeadings(items);
        }, 300);

        return () => clearTimeout(timer);
    }, [content]);

    // Observer để track heading đang visible
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Tìm heading đầu tiên đang visible
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) {
                    setActiveId(visible.target.id);
                }
            },
            {
                rootMargin: "-80px 0px -60% 0px",
                threshold: 0.1,
            }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 90; // Header height + padding
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    }, []);

    if (headings.length < 2) return null;

    return (
        <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={cn(
                "max-h-[90vh] overflow-y-auto",
                className
            )}
            aria-label="Mục lục bài viết"
        >
            <div className="bg-white border-l-2  ps-5">
                <div className="flex items-center gap-2 mb-4">
                    <List className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Mục lục</h3>
                </div>

                <ul className="space-y-1">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <button
                                onClick={() => scrollToHeading(heading.id)}
                                className={cn(
                                    "w-full text-left text-sm py-1.5 px-3 transition-all duration-200 leading-snug",
                                    heading.level === 2 && "font-medium",
                                    heading.level === 3 && "pl-6 text-xs",
                                    heading.level === 4 && "pl-9 text-xs",
                                    activeId === heading.id
                                        ? "text-primary bg-primary/8 font-semibold border-l-4 border-primary -ml-[2px]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {heading.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.nav>
    );
}
