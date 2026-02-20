"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";

type ConfirmOptions = {
    title?: string;
    description?: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
    onConfirm: () => void;
};

interface ConfirmDialogContextValue {
    confirm: (options: ConfirmOptions) => void;
    isOpen: boolean;
    close: () => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<Omit<ConfirmOptions, "onConfirm">>({});
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions) => {
        setConfig({
            title: options.title,
            description: options.description,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
            icon: options.icon,
        });
        setOnConfirmCallback(() => options.onConfirm);
        setIsOpen(true);
    }, []);

    const handleConfirm = useCallback(() => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        setIsOpen(false);
        setOnConfirmCallback(null);
    }, [onConfirmCallback]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        setOnConfirmCallback(null);
    }, []);

    return (
        <ConfirmDialogContext.Provider value={{ confirm, isOpen, close: handleCancel }}>
            {children}
            <ConfirmDialog
                open={isOpen}
                onOpenChange={handleCancel}
                onConfirm={handleConfirm}
                title={config.title}
                description={config.description}
                confirmText={config.confirmText}
                cancelText={config.cancelText}
            />
        </ConfirmDialogContext.Provider>
    );
}

export function useConfirmDialogContext(): ConfirmDialogContextValue {
    const ctx = useContext(ConfirmDialogContext);
    if (!ctx) {
        throw new Error("useConfirmDialogContext must be used within ConfirmDialogProvider");
    }
    return ctx;
}


