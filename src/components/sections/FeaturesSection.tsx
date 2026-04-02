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
import { PATHS } from "@/utils/constants";

// Dữ liệu các tính năng
const features = [
    {
        icon: FaHeadphones,
        title: "Luyện đề Online",
        description:
            "Trải nghiệm thi thử trực tuyến với nhiều dạng đề, giao diện giống thực tế và có giải thích chi tiết.",
        color: "bg-blue-500",
        lightColor: "bg-blue-50",
    },
    {
        icon: FaBookReader,
        title: "Luyện đọc hiểu",
        description:
            "Kho bài đọc đa dạng theo chủ đề và dạng câu hỏi, giúp nâng cao kỹ năng đọc hiểu hiệu quả.",
        color: "bg-green-500",
        lightColor: "bg-green-50",
    },
    {
        icon: FaHeadphones,
        title: "Luyện nghe",
        description:
            "Bài nghe chất lượng cao kèm transcript và luyện tập theo từng cấp độ từ cơ bản đến nâng cao.",
        color: "bg-purple-500",
        lightColor: "bg-purple-50",
    },
    {
        icon: FaKeyboard,
        title: "Nghe & chép chính tả",
        description:
            "Luyện nghe chủ động qua bài tập chép chính tả, giúp cải thiện phản xạ và độ chính xác.",
        color: "bg-orange-500",
        lightColor: "bg-orange-50",
    },
    {
        icon: FaPenFancy,
        title: "Bài mẫu & viết",
        description:
            "Tham khảo bài viết mẫu chất lượng kèm dàn ý, từ vựng và cách triển khai hiệu quả.",
        color: "bg-pink-500",
        lightColor: "bg-pink-50",
    },
    {
        icon: FaMicrophone,
        title: "Luyện nói",
        description:
            "Phát triển kỹ năng nói với bài mẫu, từ vựng và hướng dẫn luyện tập thực tế.",
        color: "bg-cyan-500",
        lightColor: "bg-cyan-50",
    },
];

export const FeaturesSection: React.FC = () => {

    return (
        <section className="py-5 md:py-10 lg:py-16 bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6 sm:mb-10 lg:mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Tính năng nổi bật
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Tự học <span className="text-primary">Ngoại ngữ</span> của Khailingo có gì?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Đầy đủ công cụ và tài liệu giúp bạn chinh phục ngoại ngữ một cách hiệu quả nhất
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid xs:grid-cols-2 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="group block">
                                <Card
                                    variant="bordered"
                                    hoverable
                                    className="border-transparent hover:border-primary/30 transition-all duration-300"
                                >
                                    <CardContent className="p-1 sm:p-4">
                                        <div className="flex items-start gap-3">
                                            {/* Icon */}
                                            <div
                                                className={`
                        w-10 h-10 shrink-0
                        rounded-xl ${feature.lightColor}
                        flex items-center justify-center
                        group-hover:scale-105 transition
                    `}
                                            >
                                                <feature.icon
                                                    className="w-5 h-5"
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

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-1 group-hover:text-primary">
                                                    {feature.title}
                                                </h3>

                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-1">
                                                    {feature.description}
                                                </p>

                                                <div className="flex items-center text-primary text-xs font-medium">
                                                    <span>Xem</span>
                                                    <FiArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
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
                                    <div className="hidden md:flex w-10 h-10 md:w-20 md:h-20 rounded-2xl bg-gradient-primary  items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <FaLayerGroup className="w-5 h-5 md:w-10 md:h-10 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left">
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                                            Mới cập nhật
                                        </span>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            Flashcard Từ vựng
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            Học từ vựng hiệu quả với phương pháp Spaced Repetition.
                                            Hơn 5000+ từ vựng được phân loại theo chủ đề và band điểm.
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
                                    <Link href={PATHS.CLIENT.FLASHCARD}>
                                        <Button size="lg" className="flex-shrink-0">
                                            Học ngay
                                            <FiArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
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
