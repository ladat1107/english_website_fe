/**
 * Khailingo - Trang Flashcard
 * Trang học từ vựng với flashcard
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiLayers, FiUsers, FiSearch, FiPlus } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Input, Progress } from "@/components/ui";

export const metadata: Metadata = {
    title: "Flashcard - Học từ vựng IELTS hiệu quả",
    description: "Học từ vựng IELTS hiệu quả với phương pháp Spaced Repetition. Hơn 5000+ từ vựng được phân loại theo chủ đề.",
};

// Dữ liệu mẫu các bộ flashcard
const flashcardDecks = [
    {
        id: "ielts-essential",
        title: "IELTS Essential Vocabulary",
        description: "Từ vựng cơ bản cần thiết cho IELTS",
        totalCards: 500,
        learned: 0,
        category: "IELTS",
        level: "Beginner",
        attempts: "25K",
        isNew: true,
    },
    {
        id: "ielts-academic",
        title: "IELTS Academic Words",
        description: "Từ vựng học thuật cho IELTS Academic",
        totalCards: 300,
        learned: 0,
        category: "IELTS",
        level: "Intermediate",
        attempts: "18K",
        isNew: false,
    },
    {
        id: "ielts-environment",
        title: "Environment & Nature",
        description: "Từ vựng về môi trường và thiên nhiên",
        totalCards: 150,
        learned: 0,
        category: "Topic",
        level: "Intermediate",
        attempts: "12K",
        isNew: false,
    },
    {
        id: "ielts-technology",
        title: "Technology & Innovation",
        description: "Từ vựng về công nghệ và đổi mới",
        totalCards: 120,
        learned: 0,
        category: "Topic",
        level: "Intermediate",
        attempts: "10K",
        isNew: true,
    },
    {
        id: "ielts-education",
        title: "Education & Learning",
        description: "Từ vựng về giáo dục và học tập",
        totalCards: 100,
        learned: 0,
        category: "Topic",
        level: "Beginner",
        attempts: "15K",
        isNew: false,
    },
    {
        id: "ielts-health",
        title: "Health & Lifestyle",
        description: "Từ vựng về sức khỏe và lối sống",
        totalCards: 130,
        learned: 0,
        category: "Topic",
        level: "Intermediate",
        attempts: "9K",
        isNew: false,
    },
    {
        id: "ielts-collocations",
        title: "IELTS Collocations",
        description: "Các cụm từ phổ biến trong IELTS",
        totalCards: 200,
        learned: 0,
        category: "Grammar",
        level: "Advanced",
        attempts: "8K",
        isNew: false,
    },
    {
        id: "ielts-idioms",
        title: "Common Idioms",
        description: "Thành ngữ phổ biến cho IELTS Speaking",
        totalCards: 80,
        learned: 0,
        category: "Idioms",
        level: "Advanced",
        attempts: "7K",
        isNew: false,
    },
];

// Level color mapping
const levelColors = {
    Beginner: "text-success bg-success/10",
    Intermediate: "text-warning bg-warning/10",
    Advanced: "text-destructive bg-destructive/10",
};

export default function FlashcardPage() {
  
    return (
        <div className="py-8">
            <div className="container-custom">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
                        <FiLayers className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-primary">Flashcard</span> Từ vựng IELTS
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Học từ vựng hiệu quả với phương pháp Spaced Repetition.
                        Hơn 5000+ từ vựng IELTS được phân loại theo chủ đề và cấp độ.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-4 gap-4 mb-10">
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">5000+</div>
                            <div className="text-sm text-muted-foreground">Từ vựng</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">50+</div>
                            <div className="text-sm text-muted-foreground">Bộ flashcard</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">100K+</div>
                            <div className="text-sm text-muted-foreground">Người học</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">∞</div>
                            <div className="text-sm text-muted-foreground">Miễn phí</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Create */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm bộ flashcard..."
                            leftIcon={<FiSearch className="w-5 h-5" />}
                        />
                    </div>
                    <Button>
                        <FiPlus className="w-4 h-4 mr-2" />
                        Tạo bộ flashcard
                    </Button>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <Badge variant="default" className="cursor-pointer">
                        Tất cả
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        IELTS
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Chủ đề
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Grammar
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Idioms
                    </Badge>
                </div>

                {/* Flashcard Decks Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {flashcardDecks.map((deck) => (
                        <Link
                            key={deck.id}
                            href={`/flashcard/${deck.id}`}
                            className="group block"
                        >
                            <Card variant="default" hoverable className="h-full">
                                {/* Header */}
                                <div className="relative h-32 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-t-xl p-4">
                                    {/* Category badge */}
                                    <Badge variant="secondary" size="sm" className="absolute top-3 left-3">
                                        {deck.category}
                                    </Badge>
                                    {/* New badge */}
                                    {deck.isNew && (
                                        <Badge variant="default" size="sm" className="absolute top-3 right-3">
                                            Mới
                                        </Badge>
                                    )}
                                    {/* Icon */}
                                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                        <FiLayers className="w-6 h-6 text-primary" />
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    {/* Title */}
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {deck.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {deck.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                                        <span>{deck.totalCards} từ</span>
                                        <span>•</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[deck.level as keyof typeof levelColors]}`}>
                                            {deck.level}
                                        </span>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Tiến độ</span>
                                            <span className="font-medium">{deck.learned}/{deck.totalCards}</span>
                                        </div>
                                        <Progress value={0} size="sm" />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <FiUsers className="w-3.5 h-3.5 mr-1" />
                                            {deck.attempts} lượt học
                                        </span>
                                        <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-white">
                                            Học ngay
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* How it works */}
                <div className="mt-16 p-8 bg-secondary/50 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 text-center">🧠 Phương pháp Spaced Repetition</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">1</span>
                            </div>
                            <h4 className="font-medium mb-1">Học từ mới</h4>
                            <p className="text-sm text-muted-foreground">
                                Xem mặt trước và cố gắng nhớ nghĩa
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">2</span>
                            </div>
                            <h4 className="font-medium mb-1">Kiểm tra</h4>
                            <p className="text-sm text-muted-foreground">
                                Lật thẻ và đánh giá mức độ nhớ
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">3</span>
                            </div>
                            <h4 className="font-medium mb-1">Lặp lại</h4>
                            <p className="text-sm text-muted-foreground">
                                Hệ thống tự động lên lịch ôn tập
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">4</span>
                            </div>
                            <h4 className="font-medium mb-1">Ghi nhớ lâu</h4>
                            <p className="text-sm text-muted-foreground">
                                Từ vựng được lưu vào trí nhớ dài hạn
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
