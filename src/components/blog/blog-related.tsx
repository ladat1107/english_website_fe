"use client";

import { BlogType } from "@/types/blog.type";
import { motion } from "framer-motion";
import BlogCard from "./blog-card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BlogRelatedProps {
    posts: BlogType[];
    currentId: string;
}

export default function BlogRelated({ posts, currentId }: BlogRelatedProps) {
    const filtered = posts.filter((p) => p._id !== currentId).slice(0, 8);

    if (filtered.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 md:mt-16 pt-10 border-t border-border"
        >
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                Bài viết liên quan
            </h2>

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    0: {
                        slidesPerView: 1.2,
                    },
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1280: {
                        slidesPerView: 4,
                    },
                }}
                className="!pb-8"
            >
                {filtered.map((post, index) => (
                    <SwiperSlide key={post._id}>
                        <BlogCard blog={post} index={index} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.section>
    );
}