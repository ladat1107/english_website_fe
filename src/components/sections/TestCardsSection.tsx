/**
 * BeeStudy - Test Cards Section Component
 * Section hiển thị các đề thi IELTS nổi bật
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiUsers, FiClock, FiBookOpen } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
    Card,
    CardContent,
    CardImage,
    CardBadge,
    Button,
    Badge,
} from "@/components/ui";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
    return (
        <section className="py-20 bg-secondary/30">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
                >
                    <div>
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                            Đề thi mới nhất
                        </span>
                        <h2 className="text-3xl font-bold">
                            <span className="text-primary">IELTS</span> Online Test
                        </h2>
                    </div>
                    <Link
                        href="/luyen-thi-ielts/full-test"
                        className="group inline-flex items-center text-primary font-medium hover:underline"
                    >
                        Xem tất cả
                        <FiArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* Tests Swiper */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
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
                                <Link href={`/luyen-thi-ielts/${test.id}`} className="block group">
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
                                                    <span>{test.attempts} lượt làm</span>
                                                </div>
                                            </div>

                                            {/* Button */}
                                            <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                                Xem bài test
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
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
        .tests-swiper .swiper-button-prev,
        .tests-swiper .swiper-button-next {
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .tests-swiper .swiper-button-prev:after,
        .tests-swiper .swiper-button-next:after {
          font-size: 16px;
          color: #D42525;
          font-weight: bold;
        }
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
