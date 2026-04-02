/**
 * Khailingo - Test Cards Section Component
 * Section hiển thị các đề thi IELTS nổi bật
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiUsers, FiBookOpen } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import {
    Card,
    CardContent,
    Button,
    Badge,
} from "@/components/ui";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useToast } from "../ui/toaster";

// Dữ liệu mẫu các đề thi
const featuredTests = [
    {
        id: "cam-20",
        title: "Cambridge IELTS 20",
        image: "/images/tests/cambridge-20.jpg",
        tests: 8,
        attempts: "149K",
        badge: "Mới nhất",
        badgeVariant: "default" as const,
    },
    {
        id: "cam-19",
        title: "Cambridge IELTS 19",
        image: "/images/tests/cambridge-19.jpg",
        tests: 4,
        attempts: "120K",
        badge: "Hot",
        badgeVariant: "warning" as const,
    },
    {
        id: "cam-18",
        title: "Cambridge IELTS 18",
        image: "/images/tests/cambridge-18.jpg",
        tests: 4,
        attempts: "98K",
        badge: null,
        badgeVariant: "default" as const,
    },
    {
        id: "cam-17",
        title: "Cambridge IELTS 17",
        image: "/images/tests/cambridge-17.jpg",
        tests: 4,
        attempts: "85K",
        badge: null,
        badgeVariant: "default" as const,
    },
    {
        id: "cam-16",
        title: "Cambridge IELTS 16",
        image: "/images/tests/cambridge-16.jpg",
        tests: 4,
        attempts: "72K",
        badge: null,
        badgeVariant: "default" as const,
    },
    {
        id: "cam-15",
        title: "Cambridge IELTS 15",
        image: "/images/tests/cambridge-15.jpg",
        tests: 4,
        attempts: "65K",
        badge: null,
        badgeVariant: "default" as const,
    },
];

export const TestCardsSection: React.FC = () => {
    const { addToast } = useToast();
    return (
        <section className="py-20 bg-secondary/30">
            <div className="container-custom">
                {/* ===== HEADER ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col lg:flex-row justify-between gap-6 mb-8"
                >
                    {/* LEFT */}
                    <div className="flex-1">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold mb-3">
                            🚀 Sắp ra mắt
                        </span>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug">
                            <span className="text-primary">Khailingo</span> Online Test
                        </h2>

                        <p className="text-sm text-muted-foreground mt-2 max-w-md">
                            Thi thử trực tuyến với trải nghiệm thực tế, chấm điểm tự động và kho đề đa dạng.
                        </p>
                    </div>

                    {/* RIGHT CTA */}
                    <div className="flex items-center">
                        <Link
                            href="#"
                            className="group inline-flex items-center px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary hover:text-white transition"
                        >
                            Khám phá
                            <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                        </Link>
                    </div>
                </motion.div>

                {/* Tests Swiper */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.5,
                            },
                            480: {
                                slidesPerView: 2.5,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                        className="!pb-12 tests-swiper"
                    >
                        {featuredTests.map((test) => (
                            <SwiperSlide key={test.id}>
                                <div className="block group"
                                    onClick={() => addToast("Tính năng đang phát triển, Bạn vui lòng chờ nhé!", "info")}
                                >
                                    <Card variant="default" hoverable className="overflow-hidden">
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20">
                                            {/* Placeholder image - sẽ thay bằng ảnh thật */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <FiBookOpen className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {test.title}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Badge */}
                                            {test.badge && (
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant={test.badgeVariant}>{test.badge}</Badge>
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-4">
                                            {/* Title */}
                                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                {test.title}
                                            </h3>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center gap-1">
                                                    <FiBookOpen className="w-4 h-4" />
                                                    <span>{test.tests} bài tests</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiUsers className="w-4 h-4" />
                                                    <span>{test.attempts} lượt đăng ký</span>
                                                </div>
                                            </div>

                                            {/* Button */}
                                            <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                                Xem bài test
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>

                {/* Quick Access Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-3 mt-8"
                >
                    <Link href="/luyen-thi-ielts/reading">
                        <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                            IELTS Reading
                        </Badge>
                    </Link>
                    <Link href="/luyen-thi-ielts/listening">
                        <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                            IELTS Listening
                        </Badge>
                    </Link>
                    <Link href="/bai-mau/writing">
                        <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                            Writing Samples
                        </Badge>
                    </Link>
                    <Link href="/bai-mau/speaking">
                        <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                            Speaking Samples
                        </Badge>
                    </Link>
                </motion.div>
            </div>

            {/* Custom Swiper Styles */}
            <style jsx global>{`        
        .tests-swiper .swiper-pagination-bullet {
          background: #D42525;
        }
        .tests-swiper .swiper-pagination-bullet-active {
          background: #D42525;
        }
      `}</style>
        </section>
    );
};

export default TestCardsSection;
