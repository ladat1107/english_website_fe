/**
 * BeeStudy - Tabs Component
 * Component tabs sử dụng Radix UI
 */

"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Tabs Root
const Tabs = TabsPrimitive.Root;

// Tabs List - Container chứa các tab trigger
const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
        variant?: "default" | "pills" | "underline";
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
        default:
            "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        pills:
            "inline-flex items-center justify-center gap-2",
        underline:
            "inline-flex items-center justify-center gap-4 border-b border-border",
    };

    return (
        <TabsPrimitive.List
            ref={ref}
            className={cn(variantStyles[variant], className)}
            {...props}
        />
    );
});
TabsList.displayName = TabsPrimitive.List.displayName;

// Tabs Trigger - Nút chuyển tab
const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
        variant?: "default" | "pills" | "underline";
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
        default:
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        pills:
            "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted",
        underline:
            "inline-flex items-center justify-center whitespace-nowrap pb-2 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
    };

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(variantStyles[variant], className)}
            {...props}
        />
    );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Tabs Content - Nội dung của tab
const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
