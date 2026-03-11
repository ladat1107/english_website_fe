"use client";

/**
 * Cửa sổ chat hoàn chỉnh
 * Ghép: ChatHeader + ChatMessageList + ChatInput
 * Animation mở/đóng từ góc phải dưới
 */

import { cn } from "@/utils";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { useAIChat } from "@/hooks/use-chat-ai";

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
    const { sendMessage, isLoading } = useAIChat();

    return (
        <div
            className={cn(
                // Kích thước responsive
                "w-[300px] xs:w-[360px] sm:w-[380px] border-red-500",
                "h-[500px] sm:h-[520px] max-h-screen",
                // Layout flex dọc
                "flex flex-col",
                // Visual
                "bg-white rounded-2xl shadow-2xl border border-gray-100",
                "overflow-hidden",
                // Animation scale từ góc phải dưới
                "transition-all duration-300 origin-bottom-right",
                isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-90 translate-y-4 pointer-events-none"
            )}
        >
            <ChatHeader onClose={onClose} />
            <ChatMessageList />
            <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
    );
}