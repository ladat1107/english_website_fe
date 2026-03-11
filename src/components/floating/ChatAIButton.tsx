"use client";

import { useState, useEffect } from "react";
import { cn } from "@/utils";
import ChatWindow from "../chat/ChatWindow";
import { useChatStore } from "@/stores/chat.store";
import Image from "next/image";

export default function ChatAIButton() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { pruneExpired } = useChatStore();

    // Dọn tin nhắn hết hạn khi component được mount
    useEffect(() => {
        pruneExpired();
    }, [pruneExpired]);

    return (
        <>
            {/* Cửa sổ chat - absolute so với container */}
            <div className="absolute -bottom-2 sm:-bottom-4 right-16 z-50 pointer-events-none">
                <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>

            {/* Nút Chat AI */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label={isOpen ? "Đóng chat AI" : "Mở chat AI"}
                    className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center",
                        "shadow-xl transition-all duration-300 bg-slate-50",
                        "hover:scale-110 active:scale-95",

                    )}
                >
                    <Image
                        src={"/image/chat-bot1.png"}
                        alt={isOpen ? "Đóng chat AI" : "Mở chat AI"}
                        width={30}
                        height={30}
                        className="animate-bounce-soft"
                    />
                </button>
            </div>
        </>
    );
}