/**
 * BeeStudy - Badge Component
 * Component nhãn/tag với nhiều biến thể
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Định nghĩa các biến thể của badge
const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                // Mặc định - màu đỏ BeeStudy
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/80",
                // Phụ
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                // Phá hoại
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/80",
                // Viền
                outline:
                    "text-foreground border border-input hover:bg-accent",
                // Thành công
                success:
                    "bg-success text-success-foreground hover:bg-success/80",
                // Cảnh báo
                warning:
                    "bg-warning text-warning-foreground hover:bg-warning/80",
                // Thông tin
                info:
                    "bg-info text-info-foreground hover:bg-info/80",
                // Ghost - nhẹ
                ghost:
                    "bg-primary/10 text-primary hover:bg-primary/20",
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                sm: "px-2 py-0.5 text-[10px]",
                lg: "px-3 py-1 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
}

// Badge Component
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    (
        {
            className,
            variant,
            size,
            icon,
            removable,
            onRemove,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(badgeVariants({ variant, size }), className)}
                {...props}
            >
                {/* Icon bên trái */}
                {icon && <span className="mr-1 -ml-0.5">{icon}</span>}

                {/* Nội dung */}
                {children}

                {/* Nút xóa */}
                {removable && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove?.();
                        }}
                        className="ml-1 -mr-0.5 h-3.5 w-3.5 rounded-full hover:bg-black/10 inline-flex items-center justify-center"
                    >
                        <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span className="sr-only">Xóa</span>
                    </button>
                )}
            </div>
        );
    }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
