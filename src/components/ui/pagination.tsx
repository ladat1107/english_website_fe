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
    size?: "sm" | "default";
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
}: PaginationProps) {
    const { currentPage, totalPages, totalItems, hasNextPage, hasPreviousPage } = pagination;

    // Tính toán các trang hiển thị
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Hiển thị tất cả nếu ít trang
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu
            pages.push(1);

            if (currentPage > 3) {
                pages.push("ellipsis");
            }

            // Các trang xung quanh trang hiện tại
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("ellipsis");
            }

            // Luôn hiển thị trang cuối
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const buttonSize = size === "sm" ? "icon-sm" : "icon";
    const textSize = size === "sm" ? "text-xs" : "text-sm";

    if (totalPages <= 1) {
        return showInfo ? (
            <div className={cn("flex items-center justify-center", className)}>
                <p className={cn("text-muted-foreground", textSize)}>
                    Hiển thị {totalItems} kết quả
                </p>
            </div>
        ) : null;
    }

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3", className)}>
            {/* Thông tin phân trang */}
            {showInfo && (
                <p className={cn("text-muted-foreground order-2 sm:order-1", textSize)}>
                    Trang {currentPage} / {totalPages} ({totalItems} kết quả)
                </p>
            )}

            {/* Các nút pagination */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                {/* Nút Previous */}
                <Button
                    variant="outline"
                    size={buttonSize}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className="border-border"
                >
                    <ChevronLeft className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
                </Button>

                {/* Các số trang - ẩn trên mobile, hiện trên tablet+ */}
                <div className="hidden sm:flex items-center gap-1">
                    {pageNumbers.map((page, index) => {
                        if (page === "ellipsis") {
                            return (
                                <div
                                    key={`ellipsis-${index}`}
                                    className={cn(
                                        "flex items-center justify-center text-muted-foreground",
                                        size === "sm" ? "w-7 h-7" : "w-9 h-9"
                                    )}
                                >
                                    <MoreHorizontal className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
                                </div>
                            );
                        }

                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size={buttonSize}
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    currentPage === page
                                        ? ""
                                        : "border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                )}
                            >
                                <span className={textSize}>{page}</span>
                            </Button>
                        );
                    })}
                </div>

                {/* Hiển thị trang hiện tại trên mobile */}
                <div className={cn(
                    "flex sm:hidden items-center justify-center px-3 font-medium text-foreground",
                    textSize
                )}>
                    {currentPage} / {totalPages}
                </div>

                {/* Nút Next */}
                <Button
                    variant="outline"
                    size={buttonSize}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="border-border"
                >
                    <ChevronRight className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
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
