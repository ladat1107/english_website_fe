"use client";

import { motion } from "framer-motion";

const float = {
    animate: { y: [0, -12, 0], x: [0, 6, 0] },
    transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

const rotate = {
    animate: { rotate: [0, 15, -15, 0] },
    transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

const scale = {
    animate: { scale: [1, 1.25, 1] },
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

export default function HeroDecorations() {
    return (
        <>
            {/* 🔵 Circle lớn */}
            <motion.div
                {...float}
                className="absolute top-8 left-[5%] opacity-70 pointer-events-none"
            >
                <svg width="80" height="80">
                    <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="#6366F1"
                        strokeWidth="2.5"
                        fill="none"
                        strokeDasharray="8 6"
                    />
                </svg>
            </motion.div>

            {/* 🟠 Wave lớn */}
            <motion.div
                {...float}
                className="absolute bottom-12 right-[8%] opacity-70 pointer-events-none hidden md:block"
            >
                <svg width="100" height="50" viewBox="0 0 200 100">
                    <path
                        d="M0 50 Q50 0 100 50 T200 50"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        fill="none"
                    />
                </svg>
            </motion.div>

            {/* 🔴 Sparkle */}
            <motion.div
                {...scale}
                className="absolute top-[20%] right-[15%] opacity-80 pointer-events-none hidden md:block"
            >
                <svg width="26" height="26">
                    <path
                        d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z"
                        stroke="#EF4444"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </motion.div>

            {/* 🔵 Book */}
            <motion.div
                {...rotate}
                className="absolute top-[35%] left-[18%] opacity-70 pointer-events-none hidden md:block"
            >
                <svg width="30" height="30" viewBox="0 0 24 24">
                    <path
                        d="M4 19V5a2 2 0 0 1 2-2h10v16H6a2 2 0 0 0-2 2z"
                        stroke="#0EA5E9"
                        strokeWidth="1.8"
                        fill="none"
                    />
                    <path
                        d="M16 3a2 2 0 0 1 2 2v14"
                        stroke="#0EA5E9"
                        strokeWidth="1.8"
                        fill="none"
                    />
                </svg>
            </motion.div>

            {/* 🟣 Circle nhỏ */}
            <motion.div
                {...float}
                className="absolute bottom-[20%] left-[15%] opacity-70 pointer-events-none"
            >
                <svg width="26" height="26">
                    <circle
                        cx="13"
                        cy="13"
                        r="8"
                        stroke="#6366F1"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </motion.div>

            {/* 🔴 Cross */}
            <motion.div
                {...scale}
                className="absolute bottom-[10%] right-[15%] opacity-70 pointer-events-none"
            >
                <svg width="22" height="22">
                    <line x1="0" y1="11" x2="22" y2="11" stroke="#EF4444" strokeWidth="2" />
                    <line x1="11" y1="0" x2="11" y2="22" stroke="#EF4444" strokeWidth="2" />
                </svg>
            </motion.div>

            {/* 🟠 Triangle */}
            <motion.div
                {...rotate}
                className="absolute top-[12%] right-[25%] opacity-70 pointer-events-none hidden md:block"
            >
                <svg width="24" height="24">
                    <polygon
                        points="12,2 22,22 2,22"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </motion.div>
        </>
    );
}