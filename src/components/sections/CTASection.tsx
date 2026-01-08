/**
 * BeeStudy - CTA Section Component
 * Section call-to-action đăng ký tài khoản
 */

"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui";

interface CTASectionProps {
    onOpenAuthModal: () => void;
}

// Danh sách lợi ích
const benefits = [
    "Truy cập không giới hạn kho đề thi IELTS",
    "Lưu tiến độ và theo dõi kết quả học tập",
    "Học flashcard với phương pháp Spaced Repetition",
    "Nhận thông báo đề thi mới và bài mẫu cập nhật",
];

export const CTASection: React.FC<CTASectionProps> = ({ onOpenAuthModal }) => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container-custom">
                <div className="relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-bee-red-dark rounded-3xl" />
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white blur-3xl" />
                    </div>

                    {/* Content */}
                    <div className="relative px-6 py-16 md:px-12 md:py-20">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Đăng ký tài khoản
                                    <br />
                                    <span className="text-bee-yellow">miễn phí ngay hôm nay!</span>
                                </h2>
                                <p className="text-white/80 text-lg mb-8">
                                    Tham gia cùng hơn 100,000+ người học và bắt đầu hành trình
                                    chinh phục IELTS của bạn với BeeStudy.
                                </p>

                                {/* Benefits list */}
                                <ul className="space-y-4 mb-8">
                                    {benefits.map((benefit, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="flex items-center gap-3 text-white"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-bee-yellow flex items-center justify-center flex-shrink-0">
                                                <FiCheck className="w-4 h-4 text-foreground" />
                                            </div>
                                            <span>{benefit}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    onClick={onOpenAuthModal}
                                    size="xl"
                                    className="bg-white text-primary hover:bg-white/90 shadow-lg"
                                >
                                    <FcGoogle className="w-6 h-6 mr-2" />
                                    Đăng ký miễn phí với Google
                                    <FiArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>

                            {/* Right Content - Illustration */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative hidden lg:block"
                            >
                                {/* Floating cards */}
                                <div className="relative h-[400px]">
                                    {/* Card 1 */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute top-0 left-0 bg-white rounded-2xl p-4 shadow-lg w-64"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                                                📊
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Tiến độ học tập</div>
                                                <div className="text-xs text-muted-foreground">Hôm nay</div>
                                            </div>
                                        </div>
                                        <div className="h-2 rounded-full bg-green-100 mb-2">
                                            <div className="h-full w-3/4 rounded-full bg-green-500" />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            75% hoàn thành mục tiêu
                                        </div>
                                    </motion.div>

                                    {/* Card 2 */}
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                        className="absolute top-20 right-0 bg-white rounded-2xl p-4 shadow-lg w-56"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">🔥</div>
                                            <div>
                                                <div className="font-bold text-2xl text-primary">15</div>
                                                <div className="text-sm text-muted-foreground">
                                                    ngày học liên tục
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Card 3 */}
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 3.5, repeat: Infinity }}
                                        className="absolute bottom-20 left-10 bg-white rounded-2xl p-4 shadow-lg w-60"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                                                📚
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm">IELTS Reading</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Hoàn thành 8/10 bài
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-primary font-bold">Band 7.5</div>
                                    </motion.div>

                                    {/* Card 4 - Score */}
                                    <motion.div
                                        animate={{ y: [0, 12, 0] }}
                                        transition={{ duration: 4.5, repeat: Infinity }}
                                        className="absolute bottom-0 right-10 bg-white rounded-2xl p-6 shadow-lg"
                                    >
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-3">
                                                <span className="text-2xl font-bold text-white">7.5</span>
                                            </div>
                                            <div className="font-semibold">Overall Band</div>
                                            <div className="text-xs text-muted-foreground">Dự đoán</div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
