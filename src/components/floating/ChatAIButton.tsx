"use client";

import { useState, useEffect } from "react";
import { cn } from "@/utils";
import ChatWindow from "../chat/ChatWindow";
import { useChatStore } from "@/stores/chat.store";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ChatAIButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { pruneExpired } = useChatStore();

    useEffect(() => {
        pruneExpired();
    }, [pruneExpired]);

    return (
        <>
            {/* Chat Window */}
            <div className="absolute -bottom-4 sm:-bottom-6 right-16 z-50 pointer-events-none">
                <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>

            {/* Button */}
            <div className="relative">
                <motion.button
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label={isOpen ? "Đóng chat AI" : "Mở chat AI"}

                    // 🫧 Animation “thở”
                    animate={{
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}

                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}

                    className={cn(
                        "relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden",

                        // 🎨 Gradient
                        "bg-[linear-gradient(to_right,#ffe5e5,#fff5f5,#ffffff)]",

                        // 💎 Glass + nổi
                        " border border-white/60",
                        "shadow-[0_10px_30px_rgba(255,182,193,0.6),0_0_0_4px_rgba(255,255,255,0.8)]"
                    )}
                >
                    {/* ✨ highlight */}
                    <div className="absolute top-1 left-2 w-6 h-3 bg-white/70 rounded-full blur-sm opacity-80" />

                    {/* 🌊 glow */}
                    <div className="absolute inset-0 rounded-full bg-white/40 blur-md opacity-50" />

                    {/* 🫧 bubble nhỏ */}
                    <FloatingBubble className="top-1 left-3" delay={0} />
                    <FloatingBubble className="bottom-2 right-2" delay={0.5} />
                    <FloatingBubble className="top-3 right-1" delay={1} small />

                    {/* 🤖 icon */}
                    <Image
                        src={"/image/chat-bot1.png"}
                        alt="chat"
                        width={40}
                        height={40}
                        className="relative z-10"
                    />
                </motion.button>
            </div>
        </>
    );
}

function FloatingBubble({
    className,
    delay = 0,
    small = false,
}: {
    className?: string;
    delay?: number;
    small?: boolean;
}) {
    return (
        <motion.span
            className={cn(
                "absolute rounded-full",
                small ? "w-1.5 h-1.5" : "w-2 h-2",
                "bg-pink-200",
                className
            )}
            animate={{
                y: [0, -8, 0],
                opacity: [0.6, 1, 0.6],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
            }}
        />
    );
}