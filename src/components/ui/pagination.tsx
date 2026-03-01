/**
 * Khailingo - Pagination Component
 * Component phân trang dùng chung cho toàn project
 */

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./button";
import { Pagination as PaginationType } from "@/types";

// =====================================================
// TYPES
// =====================================================
export interface PaginationProps {
    pagination: PaginationType;
    onPageChange: (page: number) => void;
    className?: string;
    showInfo?: boolean;
    size?: "xs" | "sm" | "default";
    variant?: "default" | "compact" | "minimal";
}

// =====================================================
// PAGINATION COMPONENT
// =====================================================
export function Pagination({
    pagination,
    onPageChange,
    className,
    showInfo = true,
    size = "default",
    variant = "default",
}: PaginationProps) {
    const { currentPage, totalPages, totalItems, hasNextPage, hasPreviousPage } = pagination;

    // Tính toán các trang hiển thị
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisiblePages = variant === "compact" ? 3 : 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("ellipsis");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("ellipsis");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    // Size configurations
    const sizeConfig = {
        xs: {
            buttonSize: "icon-sm" as const,
            buttonClass: "h-7 w-7",
            textSize: "text-[11px]",
            iconSize: "h-3 w-3",
            gap: "gap-0.5",
            pageButtonClass: "h-7 min-w-[28px] px-2",
        },
        sm: {
            buttonSize: "icon-sm" as const,
            buttonClass: "h-8 w-8",
            textSize: "text-xs",
            iconSize: "h-3.5 w-3.5",
            gap: "gap-1",
            pageButtonClass: "h-8 min-w-[32px] px-2.5",
        },
        default: {
            buttonSize: "icon" as const,
            buttonClass: "h-9 w-9",
            textSize: "text-sm",
            iconSize: "h-4 w-4",
            gap: "gap-1",
            pageButtonClass: "h-9 min-w-[36px] px-3",
        },
    };

    const config = sizeConfig[size];

    if (totalPages <= 1) {
        return showInfo ? (
            <div className={cn("flex items-center justify-center", className)}>
                <p className={cn("text-muted-foreground", config.textSize)}>
                    {totalItems} kết quả
                </p>
            </div>
        ) : null;
    }

    // Minimal variant - chỉ hiển thị prev/next với số trang
    if (variant === "minimal") {
        return (
            <div className={cn("flex items-center justify-between", config.gap, className)}>
                {showInfo && (
                    <span className={cn("text-muted-foreground", config.textSize)}>
                        {totalItems} kết quả
                    </span>
                )}
                <div className={cn("flex items-center", config.gap)}>
                    <Button
                        variant="ghost"
                        size={config.buttonSize}
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPreviousPage}
                        className={cn(config.buttonClass, "hover:bg-muted")}
                    >
                        <ChevronLeft className={config.iconSize} />
                    </Button>
                    <span className={cn("px-2 font-medium text-foreground tabular-nums", config.textSize)}>
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="ghost"
                        size={config.buttonSize}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className={cn(config.buttonClass, "hover:bg-muted")}
                    >
                        <ChevronRight className={config.iconSize} />
                    </Button>
                </div>
            </div>
        );
    }

    // Compact variant - gọn hơn, có số trang nhưng nhỏ hơn
    if (variant === "compact") {
        return (
            <div className={cn("flex items-center justify-between", className)}>
                {showInfo && (
                    <span className={cn("text-muted-foreground hidden sm:block", config.textSize)}>
                        {totalItems} kết quả
                    </span>
                )}
                <div className={cn("flex items-center", config.gap, !showInfo && "w-full justify-center")}>

                    {/* Previous button */}
                    <Button
                        variant="ghost"
                        size={config.buttonSize}
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPreviousPage}
                        className={cn(config.buttonClass, "hover:bg-muted")}
                    >
                        <ChevronLeft className={config.iconSize} />
                    </Button>

                    {/* Page numbers - desktop */}
                    <div className={cn("hidden sm:flex items-center", config.gap)}>
                        {pageNumbers.map((page, index) => {
                            if (page === "ellipsis") {
                                return (
                                    <div
                                        key={`ellipsis-${index}`}
                                        className={cn(
                                            "flex items-center justify-center text-muted-foreground w-6",
                                            config.textSize
                                        )}
                                    >
                                        <MoreHorizontal className={config.iconSize} />
                                    </div>
                                );
                            }

                            const isActive = currentPage === page;
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={cn(
                                        "rounded-md font-medium transition-all duration-150",
                                        config.pageButtonClass,
                                        config.textSize,
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile: Current/Total */}
                    <span className={cn(
                        "sm:hidden px-3 font-medium text-foreground tabular-nums",
                        config.textSize
                    )}>
                        {currentPage} / {totalPages}
                    </span>

                    {/* Next button */}
                    <Button
                        variant="ghost"
                        size={config.buttonSize}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className={cn(config.buttonClass, "hover:bg-muted")}
                    >
                        <ChevronRight className={config.iconSize} />
                    </Button>
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3", className)}>
            {showInfo && (
                <p className={cn("text-muted-foreground order-2 sm:order-1", config.textSize)}>
                    Trang {currentPage} / {totalPages} ({totalItems} kết quả)
                </p>
            )}

            <div className={cn("flex items-center order-1 sm:order-2", config.gap)}>
                <Button
                    variant="outline"
                    size={config.buttonSize}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className={cn(config.buttonClass, "border-border")}
                >
                    <ChevronLeft className={config.iconSize} />
                </Button>

                <div className={cn("hidden sm:flex items-center", config.gap)}>
                    {pageNumbers.map((page, index) => {
                        if (page === "ellipsis") {
                            return (
                                <div
                                    key={`ellipsis-${index}`}
                                    className={cn(
                                        "flex items-center justify-center text-muted-foreground",
                                        config.buttonClass
                                    )}
                                >
                                    <MoreHorizontal className={config.iconSize} />
                                </div>
                            );
                        }

                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size={config.buttonSize}
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    config.buttonClass,
                                    currentPage === page
                                        ? ""
                                        : "border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                )}
                            >
                                <span className={config.textSize}>{page}</span>
                            </Button>
                        );
                    })}
                </div>

                <div className={cn(
                    "flex sm:hidden items-center justify-center px-3 font-medium text-foreground",
                    config.textSize
                )}>
                    {currentPage} / {totalPages}
                </div>

                <Button
                    variant="outline"
                    size={config.buttonSize}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={cn(config.buttonClass, "border-border")}
                >
                    <ChevronRight className={config.iconSize} />
                </Button>
            </div>
        </div>
    );
}

// =====================================================
// SIMPLE PAGINATION - Đơn giản hơn, chỉ có prev/next
// =====================================================
interface SimplePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function SimplePagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: SimplePaginationProps) {
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;

    return (
        <div className={cn("flex items-center justify-center gap-2", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevious}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
            </Button>
            <span className="text-sm text-muted-foreground px-2">
                {currentPage} / {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
            >
                Sau
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    );
}

export default Pagination;
