/**
 * BeeStudy - Trang IELTS Listening Practice
 * Hiển thị danh sách các bài luyện Listening
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiHeadphones, FiUsers, FiFilter, FiSearch, FiPlay } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Input, Tabs, TabsList, TabsTrigger } from "@/components/ui";

export const metadata: Metadata = {
    title: "IELTS Listening Practice - Luyện nghe IELTS online",
    description: "Kho đề luyện IELTS Listening với hơn 400+ audio chất lượng cao, transcript chi tiết và giải thích đáp án.",
};

// Loại bài Listening
const sectionTypes = [
    { value: "all", label: "Tất cả" },
    { value: "section1", label: "Section 1 - Conversation" },
    { value: "section2", label: "Section 2 - Monologue" },
    { value: "section3", label: "Section 3 - Discussion" },
    { value: "section4", label: "Section 4 - Lecture" },
];

// Dữ liệu mẫu bài Listening
const listeningAudios = [
    {
        id: "romeo-juliet",
        title: "Romeo and Juliet",
        source: "Cambridge IELTS 17 - Test 2 - Section 3",
        section: "Section 3",
        questionTypes: ["Multiple Choice", "Matching"],
        questions: 10,
        duration: "8:30",
        attempts: "6K",
        difficulty: "Medium",
    },
    {
        id: "seed-germination",
        title: "Seed Germination",
        source: "Cambridge IELTS 13 - Test 1 - Section 3",
        section: "Section 3",
        questionTypes: ["Note Completion", "Multiple Choice"],
        questions: 10,
        duration: "7:45",
        attempts: "2K",
        difficulty: "Hard",
    },
    {
        id: "community-project",
        title: "Community Project",
        source: "Cambridge IELTS 20 - Test 3 - Section 2",
        section: "Section 2",
        questionTypes: ["Map Labelling", "Matching"],
        questions: 10,
        duration: "6:20",
        attempts: "2K",
        difficulty: "Medium",
    },
    {
        id: "family-excursions",
        title: "Family Excursions",
        source: "Cambridge IELTS 12 - Test 1 - Section 1",
        section: "Section 1",
        questionTypes: ["Form Completion"],
        questions: 10,
        duration: "5:40",
        attempts: "15K",
        difficulty: "Easy",
    },
    {
        id: "paper-public-libraries",
        title: "Paper on Public Libraries",
        source: "Cambridge IELTS 12 - Test 1 - Section 3",
        section: "Section 3",
        questionTypes: ["Multiple Choice", "Sentence Completion"],
        questions: 10,
        duration: "8:15",
        attempts: "12K",
        difficulty: "Medium",
    },
    {
        id: "marine-biology",
        title: "Marine Biology Research",
        source: "Cambridge IELTS 15 - Test 2 - Section 4",
        section: "Section 4",
        questionTypes: ["Note Completion"],
        questions: 10,
        duration: "9:00",
        attempts: "8K",
        difficulty: "Hard",
    },
];

// Difficulty color mapping
const difficultyColors = {
    Easy: "text-success bg-success/10",
    Medium: "text-warning bg-warning/10",
    Hard: "text-destructive bg-destructive/10",
};

// Section color mapping
const sectionColors = {
    "Section 1": "text-blue-600 bg-blue-50",
    "Section 2": "text-purple-600 bg-purple-50",
    "Section 3": "text-orange-600 bg-orange-50",
    "Section 4": "text-red-600 bg-red-50",
};

export default function ListeningPracticePage() {
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
                    <span className="text-foreground">Listening Practice</span>
                </div>

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <FiHeadphones className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                IELTS <span className="text-primary">Listening</span> Practice
                            </h1>
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Kho đề luyện tập IELTS Listening với hơn 400+ audio chất lượng cao.
                        Transcript chi tiết và giải thích đáp án giúp bạn cải thiện kỹ năng nghe hiệu quả.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm bài Listening..."
                            leftIcon={<FiSearch className="w-5 h-5" />}
                        />
                    </div>
                    <Button variant="outline">
                        <FiFilter className="w-4 h-4 mr-2" />
                        Lọc nâng cao
                    </Button>
                </div>

                {/* Section Tabs */}
                <div className="mb-8">
                    <Tabs defaultValue="all">
                        <TabsList variant="pills" className="flex-wrap">
                            {sectionTypes.map((section) => (
                                <TabsTrigger key={section.value} value={section.value} variant="pills">
                                    {section.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Audio List */}
                <div className="grid md:grid-cols-2 gap-4">
                    {listeningAudios.map((audio) => (
                        <Link
                            key={audio.id}
                            href={`/luyen-thi-ielts/listening/${audio.id}`}
                            className="group block"
                        >
                            <Card variant="default" hoverable className="h-full">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Play icon */}
                                        <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <FiPlay className="w-5 h-5 text-purple-600 ml-0.5 group-hover:text-primary" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sectionColors[audio.section as keyof typeof sectionColors]}`}>
                                                    {audio.section}
                                                </span>
                                                <Badge variant="ghost" size="sm">
                                                    {audio.questions} câu
                                                </Badge>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[audio.difficulty as keyof typeof difficultyColors]}`}>
                                                    {audio.difficulty}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                                {audio.title}
                                            </h3>

                                            {/* Source */}
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {audio.source}
                                            </p>

                                            {/* Duration */}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                                <FiHeadphones className="w-3.5 h-3.5" />
                                                <span>{audio.duration}</span>
                                            </div>

                                            {/* Question Types */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {audio.questionTypes.map((type) => (
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
                                                    {audio.attempts} lượt làm
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
                        Xem thêm bài Listening
                    </Button>
                </div>
            </div>
        </div>
    );
}
