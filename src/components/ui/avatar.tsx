/**
 * Khailingo - Avatar Component
 * Component hiển thị avatar người dùng
 */

"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/utils/cn";

// Avatar Root
const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
        size?: "xs" | "sm" | "md" | "lg" | "xl";
    }
>(({ className, size = "md", ...props }, ref) => {
    const sizeStyles = {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
    };

    return (
        <AvatarPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex shrink-0 overflow-hidden rounded-full",
                sizeStyles[size],
                className
            )}
            {...props}
        />
    );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

// Avatar Image
const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// Avatar Fallback - Hiển thị khi không có ảnh
const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full",
            "bg-primary/10 text-primary font-medium",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Avatar với border và status
interface AvatarWithStatusProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    status?: "online" | "offline" | "busy" | "away";
    className?: string;
}

const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({
    src,
    alt,
    fallback,
    size = "md",
    status,
    className,
}) => {
    const statusColors = {
        online: "bg-success",
        offline: "bg-muted-foreground",
        busy: "bg-destructive",
        away: "bg-warning",
    };

    const statusSizes = {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
        xl: "h-4 w-4",
    };

    return (
        <div className={cn("relative inline-block", className)}>
            <Avatar size={size}>
                <AvatarImage src={src} alt={alt} />
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
                        statusColors[status],
                        statusSizes[size]
                    )}
                />
            )}
        </div>
    );
};

export { Avatar, AvatarImage, AvatarFallback, AvatarWithStatus };
