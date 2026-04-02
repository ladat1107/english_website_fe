"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui";
import { BLOG_CATEGORY_LABELS, BLOG_CATEGORY_SLUGS } from "@/types/blog.type";
import { BlogCategory } from "@/utils/constants/enum";
import { PATHS } from "@/utils/constants";

interface BlogSearchProps {
    className?: string;
    placeholder?: string;
    activeCategory?: string;
}

export default function BlogSearch({ className, placeholder = "Tìm kiếm bài viết...", activeCategory }: BlogSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("search") || "");

    const categories: BlogCategory[] = ["ALL" as BlogCategory, ...Object.values(BlogCategory)];

    const handleSelectCategory = (value: string) => {
        if (value === "ALL") {
            router.push(PATHS.CLIENT.BLOG)
        } else {
            router.push(PATHS.CLIENT.BLOG_CATEGORY(BLOG_CATEGORY_SLUGS[value as BlogCategory]));
        }
    }

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const params = new URLSearchParams(searchParams.toString());
            if (value.trim()) {
                params.set("search", value.trim());
                params.delete("page");
            } else {
                params.delete("search");
            }

            if (activeCategory && activeCategory !== "ALL") {
                router.push(PATHS.CLIENT.BLOG_CATEGORY(BLOG_CATEGORY_SLUGS[activeCategory as BlogCategory]) + `?${params.toString()}`);
            } else {
                router.push(PATHS.CLIENT.BLOG + `?${params.toString()}`);
            }
        },
        [value, searchParams, router]
    );

    const handleClear = useCallback(() => {
        setValue("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");

        if (activeCategory && activeCategory !== "ALL") {
            router.push(PATHS.CLIENT.BLOG_CATEGORY(BLOG_CATEGORY_SLUGS[activeCategory as BlogCategory]) + `?${params.toString()}`);
        } else {
            router.push(PATHS.CLIENT.BLOG + `?${params.toString()}`);
        }
    }, [searchParams, router]);


    return (
        <div className="flex flex-row gap-2">
            <div className="flex-1">
                <form onSubmit={handleSearch} className={cn("relative", className)}>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full pl-10 pr-10 py-2.5 h-9 text-sm bg-white border border-border rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                             placeholder:text-muted-foreground transition-all duration-200"
                        />
                        {value && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="block md:hidden w-32">
                <Select
                    value={activeCategory || "ALL"}
                    onValueChange={handleSelectCategory}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((option) => (
                            <SelectItem key={option} value={option}>
                                {BLOG_CATEGORY_LABELS[option]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

    );
}
