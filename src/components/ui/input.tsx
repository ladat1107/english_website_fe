/**
 * Khailingo - Input Component
 * Component input với nhiều biến thể
 */

"use client";
import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string;
    label?: string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            leftIcon,
            rightIcon,
            error,
            label,
            helperText,
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const inputId = id ?? generatedId;
        //const inputId = id || React.useId();

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-foreground mb-1.5"
                    >
                        {label}
                    </label>
                )}

                {/* Input wrapper */}
                <div className="relative">
                    {/* Left icon */}
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {leftIcon}
                        </div>
                    )}

                    {/* Input field */}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
                            "ring-offset-background transition-all duration-200",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                            "placeholder:text-muted-foreground",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            error && "border-destructive focus-visible:ring-destructive",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {/* Right icon */}
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <p className="mt-1.5 text-sm text-destructive">{error}</p>
                )}

                {/* Helper text */}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

// Textarea Component
export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, label, helperText, id, ...props }, ref) => {
        const generatedId = React.useId();
        const textareaId = id ?? generatedId;
        //const textareaId = id || React.useId();

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-foreground mb-1.5"
                    >
                        {label}
                    </label>
                )}

                {/* Textarea */}
                <textarea
                    id={textareaId}
                    className={cn(
                        "flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
                        "ring-offset-background transition-all duration-200 resize-none",
                        "placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    ref={ref}
                    {...props}
                />

                {/* Error message */}
                {error && (
                    <p className="mt-1.5 text-sm text-destructive">{error}</p>
                )}

                {/* Helper text */}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
