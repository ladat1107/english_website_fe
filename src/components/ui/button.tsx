/**
 * BeeStudy - Button Component
 * Component nút bấm với nhiều biến thể và kích thước
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Định nghĩa các biến thể của button
const buttonVariants = cva(
    // Base styles
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                // Nút chính - màu đỏ BeeStudy
                default:
                    "bg-primary text-primary-foreground shadow-primary hover:bg-primary/90 active:scale-[0.98]",
                // Nút phá hoại - màu đỏ đậm
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                // Nút viền
                outline:
                    "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
                // Nút phụ
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                // Nút ghost - trong suốt
                ghost:
                    "hover:bg-primary/10 hover:text-primary",
                // Nút link
                link:
                    "text-primary underline-offset-4 hover:underline",
                // Nút thành công - màu xanh lá
                success:
                    "bg-success text-success-foreground hover:bg-success/90",
                // Nút cảnh báo - màu cam
                warning:
                    "bg-warning text-warning-foreground hover:bg-warning/90",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-lg px-8 text-base",
                xl: "h-14 rounded-xl px-10 text-lg",
                icon: "h-10 w-10",
                "icon-sm": "h-8 w-8",
                "icon-lg": "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// Props interface
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

// Button Component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {/* Loading spinner */}
                {isLoading && (
                    <svg
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {/* Left icon */}
                {!isLoading && leftIcon && leftIcon}
                {/* Button text */}
                {children}
                {/* Right icon */}
                {!isLoading && rightIcon && rightIcon}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
