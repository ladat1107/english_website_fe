/**
 * Khailingo - Hero Section Component
 * Section hero chính trên trang chủ
 */

"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui";
import { ANIMATION_VARIANTS, PATHS } from "@/utils/constants";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";

export const HeroSection: React.FC = () => {
    const { openAuthModal, isAuthenticated } = useAuth();
    const router = useRouter();
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero bee-pattern">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Circle decorations */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 10, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-primary/5 blur-2xl"
                />
            </div>

            <div className="container-custom relative z-10 pt-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={{
                            animate: {
                                transition: {
                                    staggerChildren: 0.15,
                                },
                            },
                        }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Nền tảng học ngoại ngữ miễn phí
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                        >
                            Nền tảng tự học{" "}
                            <span className="text-gradient-primary"></span>
                            <br />
                            <span className="text-primary">miễn phí</span> và chất lượng
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
                        >
                            Khailingo cung cấp đầy đủ nội dung chất lượng gồm Lịch học Online miễn phí,
                            luyện đề Reading, Listening, bài mẫu Writing, Speaking kết hợp
                            nghe chép chính tả và flashcard từ vựng.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Button
                                size="xl"
                                onClick={() => { isAuthenticated ? router.push(PATHS.CLIENT.SPEAKING()) : openAuthModal() }}
                                className="group"
                            >
                                {isAuthenticated ? "Bắt đầu học ngay " :
                                    <>
                                        <FcGoogle className="w-5 h-5 mr-2" />
                                        Đăng ký miễn phí ngay
                                    </>
                                }
                                <FiArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </motion.div>

                    </motion.div>

                    {/* Hero Image/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        {/* Main illustration card */}
                        <div className="relative">
                            {/* Background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl transform scale-110" />

                            {/* Main card */}
                            <div className="relative bg-white rounded-3xl shadow-soft-lg p-6 border">
                                {/* Browser mockup header */}
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                    <div className="flex-1 ml-4 h-6 rounded-lg bg-muted" />
                                </div>

                                {/* Content preview */}
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 w-32 rounded-lg bg-primary/20" />
                                        <div className="h-8 w-24 rounded-full bg-accent/30" />
                                    </div>

                                    {/* Test card */}
                                    <div className="bg-secondary/50 rounded-xl p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                                                <span className="text-2xl">📚</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-4 w-3/4 rounded bg-foreground/20 mb-2" />
                                                <div className="h-3 w-1/2 rounded bg-foreground/10" />
                                            </div>
                                            <Button size="sm" className="h-9">
                                                Làm bài
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Progress bars */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-success/10">
                                            <div className="text-xs text-success font-medium mb-1">
                                                Reading
                                            </div>
                                            <div className="h-2 rounded-full bg-success/20">
                                                <div className="h-full w-3/4 rounded-full bg-success" />
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-info/10">
                                            <div className="text-xs text-info font-medium mb-1">
                                                Listening
                                            </div>
                                            <div className="h-2 rounded-full bg-info/20">
                                                <div className="h-full w-1/2 rounded-full bg-info" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                        ✅
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">+50 điểm</div>
                                        <div className="text-xs text-muted-foreground">Hoàn thành bài</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔥</span>
                                    <div className="text-sm font-semibold">7 ngày streak!</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
