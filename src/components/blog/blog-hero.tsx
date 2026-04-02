"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import HeroDecorations from "./blog-hero-decorations";

interface BlogHeroProps {
    title?: string;
    description?: string;
}

export default function BlogHero({
    title = "Blog & Kiến thức",
    description = "Khám phá kho kiến thức IELTS từ cơ bản đến nâng cao.\nChia sẻ mẹo thi, chiến lược học tập hiệu quả, dễ áp dụng.\nCập nhật tin tức mới nhất và xu hướng học Ngoại ngữ cùng Khailingo."
}: BlogHeroProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-hero py-12 md:py-16 lg:py-24">
            <div className="hidden sm:block">
                <HeroDecorations />
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 bee-pattern opacity-30" />

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                        {<span> <span className="text-primary">{title}</span> cùng Khailingo</span>}
                    </h1>

                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed mx-auto whitespace-pre-line">
                        {description}
                    </p>
                </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-1 left-0 right-0">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12">
                    <path d="M0,60 C300,20 600,100 1200,60 L1200,120 L0,120 Z" fill="hsl(var(--background))" />
                </svg>
            </div>
        </section>
    );
}
