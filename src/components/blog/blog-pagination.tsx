"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils";

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
    basePath?: string;
}

export default function BlogPagination({ currentPage, totalPages, basePath = "/blog" }: BlogPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page <= 1) {
            params.delete("page");
        } else {
            params.set("page", String(page));
        }
        const query = params.toString();
        router.push(`${basePath}${query ? `?${query}` : ""}`);
    };

    // Generate page numbers to show
    const getPages = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const delta = 2;
        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        pages.push(1);
        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("...");
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    return (
        <nav aria-label="Phân trang" className="flex items-center justify-center gap-1.5 mt-10">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border
                         text-muted-foreground hover:bg-muted/50 hover:text-foreground
                         disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trước</span>
            </button>

            {getPages().map((page, index) =>
                page === "..." ? (
                    <span key={`dots-${index}`} className="px-2 py-2 text-sm text-muted-foreground">
                        •••
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={cn(
                            "w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-all duration-200",
                            currentPage === page
                                ? "bg-primary text-primary-foreground font-semibold shadow-primary"
                                : "border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border
                         text-muted-foreground hover:bg-muted/50 hover:text-foreground
                         disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
                <span className="hidden sm:inline">Sau</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
}
