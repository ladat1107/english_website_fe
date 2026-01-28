/**
 * Khailingo - Skeleton Component
 * Component skeleton loading
 */

import { cn } from "@/utils/cn";

// Skeleton Base
function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted",
                className
            )}
            {...props}
        />
    );
}

// Skeleton Text - Cho text loading
interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === lines - 1 ? "w-4/5" : "w-full"
                    )}
                />
            ))}
        </div>
    );
}

// Skeleton Card - Cho card loading
interface SkeletonCardProps {
    hasImage?: boolean;
    className?: string;
}

function SkeletonCard({ hasImage = true, className }: SkeletonCardProps) {
    return (
        <div className={cn("rounded-xl border bg-card p-4", className)}>
            {hasImage && <Skeleton className="w-full h-40 rounded-lg mb-4" />}
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    );
}

// Skeleton Avatar - Cho avatar loading
interface SkeletonAvatarProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

function SkeletonAvatar({ size = "md", className }: SkeletonAvatarProps) {
    const sizeStyles = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    return (
        <Skeleton
            className={cn("rounded-full", sizeStyles[size], className)}
        />
    );
}

// Skeleton Table Row - Cho table loading
interface SkeletonTableRowProps {
    columns?: number;
    className?: string;
}

function SkeletonTableRow({ columns = 4, className }: SkeletonTableRowProps) {
    return (
        <div className={cn("flex items-center gap-4 p-4 border-b", className)}>
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === 0 ? "w-12" : "flex-1"
                    )}
                />
            ))}
        </div>
    );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonTableRow };
