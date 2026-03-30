"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useZaloDialogTrigger } from "@/hooks/use-zalo-dialog-trigger";
import { useZaloDialog } from "@/stores/zalo-dialog.store";
import envConfig from "@/utils/env-config";
import { MessageCircleMore } from "lucide-react";
import Image from "next/image";

export default function ZaloGroupModal() {
    useZaloDialogTrigger();

    const { isOpen, close, clickJoin } = useZaloDialog();

    if (!isOpen) return null;
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                        onClick={() => close()}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                        initial={{ scale: 0.8, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    >
                        {/* ── HERO BANNER ── */}
                        <div
                            className="relative px-6 pt-0 pb-4 text-center overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(135deg, #A7F3D0 0%, #6EE7B7 25%, #7DD3FC 65%, #60A5FA 100%)",
                            }}
                        >
                            {/* Decorative shapes */}
                            <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/20" />
                            <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/15" />

                            {/* Close button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => close()}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: "rgba(0,0,0,0.25)" }}
                            >
                                ✕
                            </motion.button>

                            {/* Zalo Image */}
                            <Image
                                src="/image/zalo-modal.png"
                                alt="Zalo Group"
                                width={150}
                                height={90}
                                priority
                                className="absolute top-0 left-1/2 -translate-x-1/2  mx-auto mb-3 drop-shadow-lg opacity-90"
                            />

                            {/* Greeting badges */}
                            <div className="flex items-center justify-between gap-2 mb-3 mt-28">
                                {["Hello 🙋", "🪭 你好"].map((lang) => (
                                    <div
                                        key={lang}
                                        className="text-sm font-semibold px-3 py-1 rounded-full"
                                        style={{ background: "rgba(255,255,255,0.85)", color: "#333" }}
                                    >
                                        {lang}
                                    </div>
                                ))}
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-black text-primary/90 leading-tight drop-shadow-md mb-1.5">
                                Tham gia cộng đồng học <br /> ngoại ngữ Khailingo
                            </h2>
                            <p className="text-sm text-red-800">
                                Group Zalo học vui – miễn phí – hiệu quả
                            </p>
                        </div>

                        {/* ── BODY ── */}
                        <div className="bg-white px-6 pt-5 pb-6">
                            {/* 3 perks */}
                            <div className="grid grid-cols-3 gap-2.5 mb-5">
                                {[
                                    { emoji: "📖", label: "Tài liệu\nmiễn phí", bg: "#FFF8F0", color: "#b45309" },
                                    { emoji: "🎯", label: "Luyện tập\nmỗi ngày", bg: "#F0FFF8", color: "#065f46" },
                                    { emoji: "🤝", label: "Hỗ trợ\nnhiệt tình", bg: "#F0F4FF", color: "#1e40af" },
                                ].map((p) => (
                                    <div
                                        key={p.label}
                                        className="text-center rounded-2xl py-3 px-1"
                                        style={{ background: p.bg }}
                                    >
                                        <div className="text-2xl mb-1">{p.emoji}</div>
                                        <div
                                            className="text-[11px] font-semibold leading-tight whitespace-pre-line"
                                            style={{ color: p.color }}
                                        >
                                            {p.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <motion.div
                                onClick={() => {
                                    window.open(envConfig.NEXT_PUBLIC_ZALO_GROUP_URL, "_blank");
                                    setTimeout(() => {
                                        clickJoin();
                                    }, 100);
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-white font-black text-base cursor-pointer"
                                style={{
                                    background: "linear-gradient(135deg, #0068FF, #00C4FF)",
                                    boxShadow: "0 4px 16px rgba(0,104,255,0.35)",
                                }}
                            >
                                <MessageCircleMore className="w-5 h-5 " />
                                Tham gia Group Zalo
                            </motion.div>

                            <p className="text-center text-[11px] text-gray-400 mt-3">
                                Miễn phí · Không spam · Rời nhóm bất cứ lúc nào
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
}