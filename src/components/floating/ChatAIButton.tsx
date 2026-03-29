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
            <div className="fixed bottom-4 sm:bottom-0 right-20 z-50 pointer-events-none">
                <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>

            <div className="relative">
                {/* 🔥 Pulse viền ngoài (sang hơn background) */}
                <motion.span
                    className="absolute inset-0 rounded-full border border-pink-300/50"
                    animate={{
                        scale: [1, 1.6],
                        opacity: [0.6, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />

                {/* ✨ Pulse lớp 2 */}
                <motion.span
                    className="absolute inset-0 rounded-full border border-pink-200/40"
                    animate={{
                        scale: [1, 2],
                        opacity: [0.5, 0],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: 0.4,
                        ease: "easeOut",
                    }}
                />

                {/* Button */}
                <motion.button
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label={isOpen ? "Đóng chat AI" : "Mở chat AI"}

                    // 🫧 hiệu ứng “thở”
                    animate={{
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}

                    // 🧲 hover hút mắt
                    whileHover={{
                        scale: 1.15,
                        rotate: 2,
                        boxShadow:
                            "0 20px 60px rgba(255,105,180,0.6)",
                    }}

                    whileTap={{
                        scale: 0.9,
                    }}

                    className={cn(
                        "relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden animate-bounce border-4 border-primary ",

                        // 🌈 gradient nổi hơn trên nền trắng
                        "bg-gradient-to-br from-pink-200 via-white to-pink-100",

                        // 💎 viền + ring
                        "border border-pink-200/60 ring-1 ring-pink-200/40",

                        // 🔥 shadow tách nền trắng cực tốt
                        "shadow-[0_10px_25px_rgba(0,0,0,0.08),0_20px_50px_rgba(255,105,180,0.35)]"
                    )}
                >
                    {/* ✨ highlight sáng */}
                    <div className="absolute top-1 left-2 w-6 h-3 bg-white/90 rounded-full blur-sm opacity-90" />

                    {/* 🌊 glow động */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-white/40"
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    />

                    {/* 💫 ánh sáng quét */}
                    <motion.div
                        className="absolute w-20 h-20 bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-45"
                        animate={{
                            rotate: [45, 405],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* 🫧 bubble */}
                    <FloatingBubble className="top-1 left-3" delay={0} />
                    <FloatingBubble className="bottom-2 right-2" delay={0.5} />
                    <FloatingBubble className="top-3 right-1" delay={1} small />

                    {/* 🤖 icon */}
                    <Image
                        src={"/image/chat-bot1.png"}
                        alt="chat"
                        width={40}
                        height={40}
                        className="relative z-10 animate-bounce-soft"
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
                "bg-pink-300",
                className
            )}
            animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
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