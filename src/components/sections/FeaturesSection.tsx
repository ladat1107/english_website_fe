/**
 * Khailingo - Features Section Component
 * Section giới thiệu các tính năng chính
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import {
    FaHeadphones,
    FaBookReader,
    FaPenFancy,
    FaMicrophone,
    FaKeyboard,
    FaLayerGroup,
} from "react-icons/fa";
import { Card, CardContent, Button } from "@/components/ui";

// Dữ liệu các tính năng
const features = [
    {
        icon: FaHeadphones,
        title: "IELTS Online Test",
        description:
            "Đề thi IELTS Online Test với trải nghiệm thi thật và kho đề khủng kèm giải thích chi tiết.",
        href: "/luyen-thi-ielts/full-test",
        color: "bg-blue-500",
        lightColor: "bg-blue-50",
        count: "500+ đề",
    },
    {
        icon: FaBookReader,
        title: "IELTS Reading Practice",
        description:
            "Kho đề luyện tập IELTS Reading với phân loại theo dạng câu hỏi và chủ đề.",
        href: "/luyen-thi-ielts/reading",
        color: "bg-green-500",
        lightColor: "bg-green-50",
        count: "300+ passages",
    },
    {
        icon: FaHeadphones,
        title: "IELTS Listening Practice",
        description:
            "Kho đề luyện tập IELTS Listening với audio chất lượng cao và transcript chi tiết.",
        href: "/luyen-thi-ielts/listening",
        color: "bg-purple-500",
        lightColor: "bg-purple-50",
        count: "400+ audios",
    },
    {
        icon: FaKeyboard,
        title: "Nghe chép chính tả",
        description:
            "Phần mềm luyện nghe chép chính tả theo từng câu với kho đề nghe IELTS và TOEIC.",
        href: "/nghe-chep-chinh-ta",
        color: "bg-orange-500",
        lightColor: "bg-orange-50",
        count: "1000+ bài",
    },
    {
        icon: FaPenFancy,
        title: "Bài mẫu Writing",
        description:
            "Tổng hợp bài mẫu IELTS Writing Task 1 & Task 2 band 8.0+ với dàn ý và từ vựng.",
        href: "/bai-mau/writing",
        color: "bg-pink-500",
        lightColor: "bg-pink-50",
        count: "200+ samples",
    },
    {
        icon: FaMicrophone,
        title: "Bài mẫu Speaking",
        description:
            "Bài mẫu IELTS Speaking Part 1, 2, 3 band 8.0+ với từ vựng và audio mẫu.",
        href: "/bai-mau/speaking",
        color: "bg-cyan-500",
        lightColor: "bg-cyan-50",
        count: "300+ topics",
    },
];

export const FeaturesSection: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Tính năng nổi bật
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Tự học <span className="text-primary">IELTS</span> của Khailingo có gì?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Đầy đủ công cụ và tài liệu giúp bạn chinh phục IELTS một cách hiệu quả nhất
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={feature.href} className="group block h-full">
                                <Card
                                    variant="bordered"
                                    hoverable
                                    className="h-full border-transparent hover:border-primary/30 transition-all duration-300"
                                >
                                    <CardContent className="p-6">
                                        {/* Icon */}
                                        <div
                                            className={`w-14 h-14 rounded-2xl ${feature.lightColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <feature.icon
                                                className={`w-7 h-7 text-${feature.color.replace("bg-", "")}`}
                                                style={{
                                                    color: feature.color.includes("blue")
                                                        ? "#3B82F6"
                                                        : feature.color.includes("green")
                                                            ? "#22C55E"
                                                            : feature.color.includes("purple")
                                                                ? "#A855F7"
                                                                : feature.color.includes("orange")
                                                                    ? "#F97316"
                                                                    : feature.color.includes("pink")
                                                                        ? "#EC4899"
                                                                        : "#06B6D4",
                                                }}
                                            />
                                        </div>

                                        {/* Count badge */}
                                        <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-3">
                                            {feature.count}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-muted-foreground text-sm mb-4">
                                            {feature.description}
                                        </p>

                                        {/* Link */}
                                        <div className="flex items-center text-primary font-medium text-sm">
                                            <span>Xem thêm</span>
                                            <FiArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Flashcard Feature - Special Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8"
                >
                    <Link href="/flashcard" className="group block">
                        <Card
                            variant="elevated"
                            hoverable
                            className="bg-gradient-to-br from-primary/5 via-white to-accent/5 border-primary/20"
                        >
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    {/* Icon */}
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <FaLayerGroup className="w-10 h-10 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left">
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                                            Mới cập nhật
                                        </span>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            Flashcard Từ vựng IELTS
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            Học từ vựng hiệu quả với phương pháp Spaced Repetition.
                                            Hơn 5000+ từ vựng IELTS được phân loại theo chủ đề và band điểm.
                                        </p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                            <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm">
                                                5000+ từ vựng
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-info/10 text-info text-sm">
                                                50+ chủ đề
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm">
                                                Spaced Repetition
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <Button size="lg" className="flex-shrink-0">
                                        Học ngay
                                        <FiArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
