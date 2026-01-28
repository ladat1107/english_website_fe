/**
 * Khailingo - Card Component
 * Component thẻ card với nhiều biến thể
 */

"use client";
import * as React from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";

// Card Container
const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "elevated" | "bordered" | "ghost";
        hoverable?: boolean;
    }
>(({ className, variant = "default", hoverable = false, ...props }, ref) => {
    const variantStyles = {
        default: "bg-card border border-border shadow-sm",
        elevated: "bg-card shadow-soft",
        bordered: "bg-card border-2 border-primary/20",
        ghost: "bg-transparent",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "rounded-xl text-card-foreground",
                variantStyles[variant],
                hoverable && "hover-card-lift cursor-pointer",
                className
            )}
            {...props}
        />
    );
});
Card.displayName = "Card";

// Card Header
const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

// Card Title
const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement> & {
        as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    }
>(({ className, as: Comp = "h3", ...props }, ref) => (
    <Comp
        ref={ref}
        className={cn(
            "text-xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Footer
const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

// Card Image - Ảnh đầu card
const CardImage = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        src: string;
        alt: string;
        aspectRatio?: "video" | "square" | "wide";
    }
>(({ className, src, alt, aspectRatio = "video", ...props }, ref) => {
    const aspectRatioStyles = {
        video: "aspect-video",
        square: "aspect-square",
        wide: "aspect-[21/9]",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "relative overflow-hidden rounded-t-xl",
                aspectRatioStyles[aspectRatio],
                className
            )}
            {...props}
        >
            <Image
                src={src}
                alt={alt}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                width={500}
                height={300}
            />
        </div>
    );
});
CardImage.displayName = "CardImage";

// Card Badge - Nhãn trên card
const CardBadge = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & {
        variant?: "default" | "primary" | "secondary" | "success" | "warning";
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
    };

    return (
        <span
            ref={ref}
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                variantStyles[variant],
                className
            )}
            {...props}
        />
    );
});
CardBadge.displayName = "CardBadge";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    CardImage,
    CardBadge,
};
