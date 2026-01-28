/**
 * Khailingo - Samples Section Component
 * Section hiển thị bài mẫu Writing và Speaking
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiPenTool, FiMic } from "react-icons/fi";
import { Card, CardContent, Badge } from "@/components/ui";

// Dữ liệu mẫu Writing
const writingSamples = [
    {
        id: "australian-zoo",
        title: "Real IELTS Writing Task 1 - Map - Topic Australian Zoo",
        type: "Task 1 - Map",
        band: "8.5+",
        quarter: "Q4/2025",
    },
    {
        id: "residence-hall",
        title: "Real IELTS Writing Task 1 - Map - Topic Residence Hall",
        type: "Task 1 - Map",
        band: "8.5+",
        quarter: "Q4/2025",
    },
    {
        id: "fruit-jam",
        title: "Real IELTS Writing Task 1 - Process - Topic Fruit Jam",
        type: "Task 1 - Process",
        band: "8.5+",
        quarter: "Q4/2025",
    },
    {
        id: "international-travellers",
        title: "Real IELTS Writing Task 1 - Table - Topic International Travellers",
        type: "Task 1 - Table",
        band: "8.5+",
        quarter: "Q4/2025",
    },
];

// Dữ liệu mẫu Speaking
const speakingSamples = [
    {
        id: "exciting-activity",
        title: "IELTS Speaking Part 3 - Topic Exciting Activity for the First Time",
        part: "Part 3",
        band: "8.0+",
        quarter: "Q4/2025",
    },
    {
        id: "traditional-stories",
        title: "IELTS Speaking Part 3 - Topic Traditional Stories",
        part: "Part 3",
        band: "8.0+",
        quarter: "Q4/2025",
    },
    {
        id: "useful-books",
        title: "IELTS Speaking Part 3 - Topic Useful Books",
        part: "Part 3",
        band: "8.0+",
        quarter: "Q4/2025",
    },
    {
        id: "important-old-thing",
        title: "Describe an important old thing that your family has kept",
        part: "Part 2",
        band: "8.0+",
        quarter: "Q4/2025",
    },
];

export const SamplesSection: React.FC = () => {
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
                        Tổng hợp bài mẫu IELTS band 8.0+ với dàn ý, từ vựng và bài tập ôn luyện
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
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
                                <h3 className="text-xl font-bold">IELTS Writing Sample</h3>
                            </div>
                            <Link
                                href="/bai-mau/writing"
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
                                    key={sample.id}
                                    href={`/bai-mau/writing/${sample.id}`}
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
                                                            Band {sample.band}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {sample.quarter}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
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
                                <h3 className="text-xl font-bold">IELTS Speaking Sample</h3>
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
                                    key={sample.id}
                                    href={`/bai-mau/speaking/${sample.id}`}
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
                                                            {sample.part}
                                                        </Badge>
                                                        <Badge variant="success" size="sm">
                                                            Band {sample.band}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {sample.quarter}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
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
