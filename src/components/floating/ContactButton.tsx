"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";
import type { ContactChannel } from "@/types/chat.type";
import envConfig from "@/utils/env-config";
import { HeadphoneOff, HeadsetIcon } from "lucide-react";

// ─── Cấu hình kênh liên hệ ─────────────────────────────────────────

const CONTACT_CHANNELS: ContactChannel[] = [
    {
        id: "zalo",
        label: "Zalo",
        image: "/image/zalo.png",
        href: envConfig.NEXT_PUBLIC_ZALO_GROUP_URL,
    },
    {
        id: "facebook",
        label: "Facebook",
        image: "/image/facebook.png",
        href: envConfig.NEXT_PUBLIC_FACEBOOK_URL,
    },
    {
        id: "tiktok",
        label: "TikTok",
        image: "/image/tiktok.png",
        href: envConfig.NEXT_PUBLIC_TIKTOK_URL,
    },
    {
        id: "youtube",
        label: "YouTube",
        image: "/image/youtube.png",
        href: envConfig.NEXT_PUBLIC_YOUTUBE_URL,
    },
];

// ─── Animation variants ────────────────────────────────────────────

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.8,
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
};

// ─── Component ─────────────────────────────────────────────────────

export default function ContactButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex flex-col items-center gap-3">
            {/* Danh sách kênh */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex flex-col items-center gap-2.5"
                    >
                        {CONTACT_CHANNELS.map((channel) => (
                            <motion.div
                                key={channel.id}
                                variants={itemVariants}
                                className="flex items-center gap-2"
                            >

                                {/* Nút */}
                                <a
                                    href={channel.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Liên hệ qua ${channel.label}`}
                                    className={cn(
                                        "w-9 h-9 rounded-full flex items-center justify-center shadow-lg",
                                        "transition hover:scale-110 active:scale-95",
                                    )}
                                >
                                    <Image
                                        src={channel.image}
                                        alt={channel.label}
                                        width={34}
                                        height={34}
                                    />
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nút chính */}
            <button onClick={() => setIsOpen((prev) => !prev)} aria-label={isOpen ? "Đóng liên hệ" : "Mở liên hệ"} className={cn("w-10 h-10 rounded-full flex items-center justify-center", "bg-cyan-500 text-white shadow-xl", "transition-all duration-300 hover:scale-110 active:scale-95", "hover:bg-cyan-600 hover:shadow-2xl")} > {isOpen ? <HeadphoneOff /> : <HeadsetIcon />} </button>
        </div>
    );
}