"use client";

import { BlogType } from "@/types/blog.type";
import { motion } from "framer-motion";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { useGetAllBlogs } from "@/hooks/use-blog";
import BlogCard from "../blog/blog-card";
import { FiArrowRight } from "react-icons/fi";
import { PATHS } from "@/utils/constants";

export default function BlogSection() {
    const { data: posts, isLoading } = useGetAllBlogs({
        page: 1,
        limit: 20,
        is_special: true,
    });

    const blogs: BlogType[] = posts?.data?.items || [];
    if (blogs.length === 0 || isLoading) return null;

    return (
        <section className="py-5 bg-gradient-to-br from-primary/5 via-primary/5 to-background">
            <div className="container-custom">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Link
                            href={PATHS.CLIENT.BLOG}
                            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                        >
                            Blogs
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bài viết nổi bật của <span className="text-primary">Khailingo</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Khám phá những bài viết chất lượng được chọn lọc,
                        giúp bạn nâng cao kiến thức, kỹ năng và cập nhật xu hướng học tập mới nhất.
                    </p>
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className=""
                >
                    {/* SLIDER */}
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={16}
                        pagination={{ clickable: true }}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1.2 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="!pb-10"
                    >
                        {blogs.map((post, index) => (
                            <SwiperSlide key={post._id}>
                                <BlogCard blog={post} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.section>

            </div>

        </section>

    );
}