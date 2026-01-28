/**
 * Khailingo - Practice Section Component
 * Section luyện tập Reading và Listening
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiUsers, FiHeadphones, FiBook } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardContent, Button, Badge } from "@/components/ui";

// Dữ liệu mẫu bài luyện Listening
const listeningPractices = [
    {
        id: "romeo-juliet",
        title: "Romeo and Juliet",
        source: "Cambridge IELTS 17 - Test 2 - Section 3",
        questions: 10,
        attempts: "6K",
    },
    {
        id: "seed-germination",
        title: "Seed Germination",
        source: "Cambridge IELTS 13 - Test 1 - Section 3",
        questions: 10,
        attempts: "2K",
    },
    {
        id: "community-project",
        title: "Community Project",
        source: "Cambridge IELTS 20 - Test 3 - Section 2",
        questions: 10,
        attempts: "2K",
    },
    {
        id: "family-excursions",
        title: "Family Excursions",
        source: "Cambridge IELTS 12 - Test 1 - Section 1",
        questions: 10,
        attempts: "15K",
    },
];

// Dữ liệu mẫu bài luyện Reading
const readingPractices = [
    {
        id: "european-transport",
        title: "European transport systems",
        source: "Cambridge IELTS 10 - Test 1 - Passage 2",
        questions: 14,
        attempts: "3K",
    },
    {
        id: "london-underground",
        title: "The development of the London underground railway",
        source: "Cambridge IELTS 17 - Test 1 - Passage 1",
        questions: 13,
        attempts: "9K",
    },
    {
        id: "thylacine",
        title: "The thylacine",
        source: "Cambridge IELTS 17 - Test 3 - Passage 1",
        questions: 13,
        attempts: "6K",
    },
    {
        id: "palm-oil",
        title: "Palm oil",
        source: "Cambridge IELTS 17 - Test 3 - Passage 2",
        questions: 13,
        attempts: "7K",
    },
];

// Practice Card Component
const PracticeCard: React.FC<{
    practice: typeof listeningPractices[0];
    type: "listening" | "reading";
}> = ({ practice, type }) => {
    const Icon = type === "listening" ? FiHeadphones : FiBook;
    const color = type === "listening" ? "text-purple-500 bg-purple-50" : "text-green-500 bg-green-50";

    return (
        <Link
            href={`/luyen-thi-ielts/${type}/${practice.id}`}
            className="group block"
        >
            <Card variant="default" hoverable className="h-full">
                <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="ghost" size="sm">
                                    {practice.questions} câu
                                </Badge>
                            </div>
                            <h4 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                {practice.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                                {practice.source}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <FiUsers className="w-3.5 h-3.5 mr-1" />
                                {practice.attempts} lượt làm
                            </div>
                        </div>

                        {/* Action */}
                        <Button size="sm" variant="secondary" className="flex-shrink-0 group-hover:bg-primary group-hover:text-white">
                            Làm bài
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export const PracticeSection: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Luyện tập hàng ngày
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Luyện tập <span className="text-primary">Listening</span> &{" "}
                        <span className="text-primary">Reading</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Kho đề luyện tập phong phú với phân loại theo dạng câu hỏi và chủ đề
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Tabs defaultValue="listening" className="w-full">
                        <div className="flex justify-center mb-8">
                            <TabsList variant="pills">
                                <TabsTrigger value="listening" variant="pills">
                                    <FiHeadphones className="w-4 h-4 mr-2" />
                                    IELTS Listening
                                </TabsTrigger>
                                <TabsTrigger value="reading" variant="pills">
                                    <FiBook className="w-4 h-4 mr-2" />
                                    IELTS Reading
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Listening Tab */}
                        <TabsContent value="listening">
                            <div className="grid md:grid-cols-2 gap-4">
                                {listeningPractices.map((practice) => (
                                    <PracticeCard
                                        key={practice.id}
                                        practice={practice}
                                        type="listening"
                                    />
                                ))}
                            </div>
                            <div className="text-center mt-8">
                                <Link href="/luyen-thi-ielts/listening">
                                    <Button variant="outline" size="lg">
                                        Xem tất cả bài Listening
                                        <FiArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </TabsContent>

                        {/* Reading Tab */}
                        <TabsContent value="reading">
                            <div className="grid md:grid-cols-2 gap-4">
                                {readingPractices.map((practice) => (
                                    <PracticeCard
                                        key={practice.id}
                                        practice={practice}
                                        type="reading"
                                    />
                                ))}
                            </div>
                            <div className="text-center mt-8">
                                <Link href="/luyen-thi-ielts/reading">
                                    <Button variant="outline" size="lg">
                                        Xem tất cả bài Reading
                                        <FiArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </section>
    );
};

export default PracticeSection;
