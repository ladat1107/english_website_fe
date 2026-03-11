"use client";

/**
 * Danh sách tin nhắn với auto scroll
 * - Cuộn xuống tự động khi có tin mới hoặc AI đang gõ
 * - Typing indicator khi isLoading
 * - Màn hình chào mừng khi chưa có tin nhắn
 */

import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat.store";
import ChatMessage from "./ChatMessage";
import Image from "next/image";

// Typing indicator - ba chấm nhảy
const TypingIndicator: React.FC = () => (
    <div className="flex gap-2 items-end">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D82222] to-[#FF6B6B] flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7 14v2a1 1 0 001 1h8a1 1 0 001-1v-2H7zm2 4a2 2 0 104 0H9zm-2-6a1 1 0 110 2 1 1 0 010-2zm10 0a1 1 0 110 2 1 1 0 010-2z" />
            </svg>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center">
                {([0, 1, 2] as const).map((i) => (
                    <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                    />
                ))}
            </div>
        </div>
    </div>
);

// Màn hình chào khi chưa có tin nhắn
const WelcomeScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4 py-8">
        <Image
            src={"/image/chat-bot3.png"}
            alt={"chat AI"}
            width={80}
            height={80}
            className="animate-bounce-soft"
        />
        <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Khailingo Assistant
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
                Chào mừng bạn đến với Khailingo Assistant! Tôi có thể giúp gì cho bạn?
            </p>
        </div>

    </div>
);

export default function ChatMessageList() {
    const { messages, isLoading } = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Cuộn xuống cuối khi có tin mới hoặc loading thay đổi
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
            {messages.length === 0 ? (
                <WelcomeScreen />
            ) : (
                <div className="flex flex-col gap-3 p-4">
                    {messages.map((msg, index) => (
                        <ChatMessage key={msg.id} message={msg} isLatest={index === messages.length - 1}
                            onTyping={() => {
                                bottomRef.current?.scrollIntoView({ behavior: "auto" });
                            }}
                        />
                    ))}

                    {/* Typing indicator khi AI đang trả lời */}
                    {isLoading && <TypingIndicator />}

                    {/* Anchor để scrollIntoView */}
                    <div ref={bottomRef} className="h-1" />
                </div>
            )}
        </div>
    );
}