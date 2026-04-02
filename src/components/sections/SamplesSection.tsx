/**
 * Khailingo - Samples Section Component
 * Section hiển thị bài mẫu Writing và Speaking
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiPenTool, FiMic } from "react-icons/fi";
import { Card, CardContent, Badge } from "@/components/ui";
import { useGetAllWritingExams } from "@/hooks/use-writing-exam";
import { useGetAllSpeakingExams } from "@/hooks";
import { WritingExam } from "@/types/writing.type";
import { SpeakingExam } from "@/types/speaking.type";
import { PATHS } from "@/utils/constants";
import { useAuth } from "@/contexts";
import dayjs from "dayjs";

export const SamplesSection: React.FC = () => {

    const { isAuthenticated, openAuthModal } = useAuth();
    const { data: writingRes, isLoading: writingLoading } = useGetAllWritingExams({ page: 1, limit: 4 });
    const { data: speakingRes, isLoading: speakingLoading } = useGetAllSpeakingExams({ page: 1, limit: 4 });

    if (writingLoading || speakingLoading) return null;

    const writingSamples: WritingExam[] = writingRes?.data?.items || [];
    const speakingSamples: SpeakingExam[] = speakingRes?.data?.items || [];

    const handleSampleClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            openAuthModal();
        }
    }

    return (
        <section className="py-20 bg-secondary/30">
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
                        Bài mẫu band cao
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bài mẫu <span className="text-primary">Writing</span> &{" "}
                        <span className="text-primary">Speaking</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Kho bài mẫu đa dạng giúp nâng cao kỹ năng và mở rộng vốn từ
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-8">
                    {/* Writing Samples */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                    <FiPenTool className="w-5 h-5 text-pink-500" />
                                </div>
                                <h3 className="text-xl font-bold">Writing Sample</h3>
                            </div>
                            <Link
                                href={PATHS.CLIENT.WRITING()}
                                className="text-primary text-sm font-medium hover:underline flex items-center"
                            >
                                Xem thêm
                                <FiArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {/* Cards */}
                        <div className="space-y-4">
                            {writingSamples.map((sample) => (
                                <Link
                                    key={sample._id}
                                    onClick={handleSampleClick}
                                    href={PATHS.CLIENT.WRITING_DETAIL(sample._id)}
                                    className="block group"
                                >
                                    <Card variant="default" hoverable>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center flex-shrink-0 text-xl">
                                                    📝
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <Badge variant="ghost" size="sm">
                                                            {sample.type}
                                                        </Badge>
                                                        <Badge variant="success" size="sm">
                                                            {sample.level}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {dayjs(sample.updatedAt).format("DD/MM/YYYY")}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-sm group-hover:text-primary transition-colors line-clamp-1 uppercase font-bold">
                                                        {sample.title}
                                                    </h4>
                                                </div>
                                                <FiArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Speaking Samples */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                                    <FiMic className="w-5 h-5 text-cyan-500" />
                                </div>
                                <h3 className="text-xl font-bold">Speaking Sample</h3>
                            </div>
                            <Link
                                href="/bai-mau/speaking"
                                className="text-primary text-sm font-medium hover:underline flex items-center"
                            >
                                Xem thêm
                                <FiArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {/* Cards */}
                        <div className="space-y-4">
                            {speakingSamples.map((sample) => (
                                <Link
                                    key={sample._id}
                                    onClick={handleSampleClick}
                                    href={PATHS.CLIENT.SPEAKING_DETAIL(sample._id)}
                                    className="block group"
                                >
                                    <Card variant="default" hoverable>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center flex-shrink-0 text-xl">
                                                    🎤
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <Badge variant="ghost" size="sm">
                                                            {sample.type}
                                                        </Badge>
                                                        <Badge variant="success" size="sm">
                                                            {sample.level}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {dayjs(sample.updatedAt).format("DD/MM/YYYY")}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-sm group-hover:text-primary transition-colors line-clamp-1 uppercase font-bold">
                                                        {sample.title}
                                                    </h4>
                                                </div>
                                                <FiArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SamplesSection;
