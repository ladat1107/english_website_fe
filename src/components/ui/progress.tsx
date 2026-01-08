/**
 * BeeStudy - Progress Component
 * Component thanh tiến trình
 */

"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

// Progress Bar
const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
        indicatorClassName?: string;
        showLabel?: boolean;
        variant?: "default" | "success" | "warning" | "danger";
        size?: "sm" | "md" | "lg";
    }
>(
    (
        {
            className,
            value,
            indicatorClassName,
            showLabel = false,
            variant = "default",
            size = "md",
            ...props
        },
        ref
    ) => {
        const variantColors = {
            default: "bg-primary",
            success: "bg-success",
            warning: "bg-warning",
            danger: "bg-destructive",
        };

        const sizeStyles = {
            sm: "h-1.5",
            md: "h-2.5",
            lg: "h-4",
        };

        return (
            <div className="w-full">
                <ProgressPrimitive.Root
                    ref={ref}
                    className={cn(
                        "relative w-full overflow-hidden rounded-full bg-secondary",
                        sizeStyles[size],
                        className
                    )}
                    {...props}
                >
                    <ProgressPrimitive.Indicator
                        className={cn(
                            "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full",
                            variantColors[variant],
                            indicatorClassName
                        )}
                        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
                    />
                </ProgressPrimitive.Root>
                {/* Hiển thị phần trăm */}
                {showLabel && (
                    <span className="text-sm text-muted-foreground mt-1 block text-right">
                        {value}%
                    </span>
                )}
            </div>
        );
    }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

// Circular Progress - Thanh tiến trình hình tròn
interface CircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showLabel?: boolean;
    variant?: "default" | "success" | "warning" | "danger";
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    size = 80,
    strokeWidth = 8,
    className,
    showLabel = true,
    variant = "default",
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const variantColors = {
        default: "stroke-primary",
        success: "stroke-success",
        warning: "stroke-warning",
        danger: "stroke-destructive",
    };

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-secondary"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={cn("transition-all duration-500 ease-out", variantColors[variant])}
                />
            </svg>
            {/* Label */}
            {showLabel && (
                <span className="absolute text-sm font-semibold">
                    {value}%
                </span>
            )}
        </div>
    );
};

export { Progress, CircularProgress };
