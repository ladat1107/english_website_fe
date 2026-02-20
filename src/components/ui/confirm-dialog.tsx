"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Xác nhận hành động",
    description = "Bạn có chắc chắn muốn thực hiện hành động này?",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
}: ConfirmDialogProps) {

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                className="rounded-lg sm:max-w-md p-0 gap-0 fixed top-[20vh] sm:top-[25vh] left-[50%] transform"
            >
                <AlertDialogHeader className="px-6 pt-4 pb-2 rounded-t-lg space-y-0">
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-5 h-5" />
                        {title}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="px-6 pt-2 pb-4 space-y-4">
                    {typeof description === 'string' ? (
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400 m-0">
                            {description}
                        </AlertDialogDescription>
                    ) : (
                        <div className="text-gray-600 dark:text-gray-400 m-0">
                            {description}
                        </div>
                    )}
                    <AlertDialogFooter className="flex flex-row justify-end gap-2 mt-0 p-0">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-9"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant="destructive"
                            className="h-9"
                        >
                            {confirmText}
                        </Button>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface UseConfirmDialogReturn {
    confirm: (options: {
        title?: string;
        description?: string;
        confirmText?: string;
        cancelText?: string;
        icon?: React.ReactNode;
        onConfirm: () => void;
    }) => void;
    ConfirmDialogComponent: React.ReactNode;
    isConfirmOpen: boolean;
}

// Hook để sử dụng confirm dialog dễ dàng hơn
export function useConfirmDialog(): UseConfirmDialogReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<Omit<ConfirmDialogProps, 'open' | 'onOpenChange' | 'onConfirm'>>({});
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    const confirm = (options: {
        title?: string;
        description?: string | React.ReactNode;
        confirmText?: string;
        cancelText?: string;
        icon?: React.ReactNode;
        onConfirm: () => void;
    }) => {
        setConfig({
            title: options.title,
            description: options.description,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
        });
        // Sử dụng function form để set callback
        setOnConfirmCallback(() => options.onConfirm);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        setIsOpen(false);
        // Reset callback sau khi confirm
        setOnConfirmCallback(null);
    };

    const handleCancel = () => {
        setIsOpen(false);
        // Reset callback khi cancel
        setOnConfirmCallback(null);
    };

    const ConfirmDialogComponent = (
        <ConfirmDialog
            open={isOpen}
            onOpenChange={handleCancel}
            onConfirm={handleConfirm}
            {...config}
        />
    );

    return {
        confirm,
        ConfirmDialogComponent,
        isConfirmOpen: isOpen,
    };
}
