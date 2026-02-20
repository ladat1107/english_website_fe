"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon, InfoIcon, XIcon } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, message, type, duration };

        //setToasts((prev) => [...prev, toast]);
        setToasts((prev) => {
            return [toast];
        });
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({
    toasts,
    onRemove
}: {
    toasts: Toast[];
    onRemove: (id: string) => void;
}) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[10000] space-y-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({
    toast,
    onRemove
}: {
    toast: Toast;
    onRemove: (id: string) => void;
}) {
    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
            case "error":
                return <XCircleIcon className="h-5 w-5 text-red-600" />;
            case "warning":
                return <AlertCircleIcon className="h-5 w-5 text-yellow-600" />;
            case "info":
                return <InfoIcon className="h-5 w-5 text-blue-600" />;
        }
    };

    const getBackgroundColor = () => {
        switch (toast.type) {
            case "success":
                return "bg-green-50 border-green-200";
            case "error":
                return "bg-red-50 border-red-200";
            case "warning":
                return "bg-yellow-50 border-yellow-200";
            case "info":
                return "bg-blue-50 border-blue-200";
        }
    };

    return (
        <div
            className={`flex items-center p-4 rounded-lg border shadow-lg min-w-[250px] sm:min-w-[300px] max-w-[500px] ${getBackgroundColor()} animate-in slide-in-from-right-full`}
        >
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
            <div className="ml-3 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900">{toast.message}</p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <XIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

// Component chính để export
export function Toaster() {
    return <ToastProvider>{null}</ToastProvider>;
} 