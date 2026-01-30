/**
 * Khailingo - Trang IELTS Reading Practice
 * Hiển thị danh sách các bài luyện Reading
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiBook, FiUsers, FiFilter, FiSearch } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Input, Tabs, TabsList, TabsTrigger } from "@/components/ui";

export const metadata: Metadata = {
    title: "IELTS Reading Practice - Luyện đề Reading online",
    description: "Kho đề luyện IELTS Reading với hơn 300+ passages, phân loại theo dạng câu hỏi và chủ đề.",
};

// Dạng câu hỏi Reading
const questionTypes = [
    "Tất cả",
    "True/False/Not Given",
    "Matching Headings",
    "Matching Information",
    "Multiple Choice",
    "Fill in the Blanks",
    "Summary Completion",
];

// Dữ liệu mẫu bài Reading
const readingPassages = [
    {
        id: "european-transport",
        title: "European transport systems",
        source: "Cambridge IELTS 10 - Test 1 - Passage 2",
        questionTypes: ["True/False/Not Given", "Matching Headings"],
        questions: 14,
        attempts: "3K",
        difficulty: "Medium",
    },
    {
        id: "london-underground",
        title: "The development of the London underground railway",
        source: "Cambridge IELTS 17 - Test 1 - Passage 1",
        questionTypes: ["True/False/Not Given", "Summary Completion"],
        questions: 13,
        attempts: "9K",
        difficulty: "Easy",
    },
    {
        id: "thylacine",
        title: "The thylacine",
        source: "Cambridge IELTS 17 - Test 3 - Passage 1",
        questionTypes: ["True/False/Not Given", "Matching Information"],
        questions: 13,
        attempts: "6K",
        difficulty: "Medium",
    },
    {
        id: "palm-oil",
        title: "Palm oil",
        source: "Cambridge IELTS 17 - Test 3 - Passage 2",
        questionTypes: ["Multiple Choice", "Matching Headings"],
        questions: 13,
        attempts: "7K",
        difficulty: "Hard",
    },
    {
        id: "making-every-drop-count",
        title: "Making Every Drop Count",
        source: "Cambridge IELTS 16 - Test 1 - Passage 1",
        questionTypes: ["True/False/Not Given", "Fill in the Blanks"],
        questions: 13,
        attempts: "12K",
        difficulty: "Easy",
    },
    {
        id: "why-being-bored",
        title: "Why being bored is stimulating - and useful, too",
        source: "Cambridge IELTS 15 - Test 1 - Passage 1",
        questionTypes: ["Matching Information", "Summary Completion"],
        questions: 13,
        attempts: "15K",
        difficulty: "Medium",
    },
];

// Difficulty color mapping
const difficultyColors = {
    Easy: "text-success bg-success/10",
    Medium: "text-warning bg-warning/10",
    Hard: "text-destructive bg-destructive/10",
};

export default function ReadingPracticePage() {
    return (
        <div className="py-8">
            <div className="container-custom">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-primary">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link href="/luyen-thi-ielts" className="hover:text-primary">
                        Luyện thi IELTS
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">Reading Practice</span>
                </div>

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <FiBook className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                IELTS <span className="text-primary">Reading</span> Practice
                            </h1>
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Kho đề luyện tập IELTS Reading với hơn 300+ passages. Lọc theo dạng câu hỏi,
                        chủ đề và độ khó để luyện tập hiệu quả.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm bài Reading..."
                            leftIcon={<FiSearch className="w-5 h-5" />}
                        />
                    </div>
                    <Button variant="outline">
                        <FiFilter className="w-4 h-4 mr-2" />
                        Lọc nâng cao
                    </Button>
                </div>

                {/* Question Type Tabs */}
                <div className="mb-8">
                    <Tabs defaultValue="all">
                        <TabsList variant="pills" className="flex-wrap">
                            {questionTypes.map((type, index) => (
                                <TabsTrigger key={type} value={index === 0 ? "all" : type} variant="pills">
                                    {type}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Passages List */}
                <div className="grid md:grid-cols-2 gap-4">
                    {readingPassages.map((passage) => (
                        <Link
                            key={passage.id}
                            href={`/luyen-thi-ielts/reading/${passage.id}`}
                            className="group block"
                        >
                            <Card variant="default" hoverable className="h-full">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <FiBook className="w-7 h-7 text-green-600" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <Badge variant="ghost" size="sm">
                                                    {passage.questions} câu
                                                </Badge>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[passage.difficulty as keyof typeof difficultyColors]}`}>
                                                    {passage.difficulty}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                                {passage.title}
                                            </h3>

                                            {/* Source */}
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {passage.source}
                                            </p>

                                            {/* Question Types */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {passage.questionTypes.map((type) => (
                                                    <span
                                                        key={type}
                                                        className="text-xs px-2 py-0.5 bg-secondary rounded-full"
                                                    >
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <FiUsers className="w-3.5 h-3.5 mr-1" />
                                                    {passage.attempts} lượt làm
                                                </span>
                                                <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-white">
                                                    Làm bài
                                                    <FiArrowRight className="w-3.5 h-3.5 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                        Xem thêm bài Reading
                    </Button>
                </div>
            </div>
        </div>
    );
}
