/**
 * Khailingo - Trang Nghe Chép Chính Tả (Dictation)
 * Luyện nghe và ghi chép để cải thiện khả năng nghe
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiHeadphones, FiUsers, FiClock, FiPlay } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Progress } from "@/components/ui";

export const metadata: Metadata = {
    title: "Nghe Chép Chính Tả - Luyện Nghe IELTS Hiệu Quả",
    description: "Luyện nghe IELTS hiệu quả với phương pháp nghe chép chính tả. Cải thiện khả năng nghe và chính tả tiếng Anh.",
};

// Dữ liệu mẫu dictation exercises
const dictationItems = [
    {
        id: "ielts-16-test-1",
        title: "IELTS 16 - Test 1 - Part 1",
        description: "Cuộc hội thoại về đặt phòng khách sạn",
        duration: "5:30",
        difficulty: "Easy",
        category: "Conversation",
        attempts: "15K",
        completionRate: 85,
        isNew: true,
    },
    {
        id: "ielts-16-test-1-part-2",
        title: "IELTS 16 - Test 1 - Part 2",
        description: "Bài giới thiệu về tour du lịch",
        duration: "7:15",
        difficulty: "Easy",
        category: "Monologue",
        attempts: "12K",
        completionRate: 78,
        isNew: true,
    },
    {
        id: "ielts-16-test-1-part-3",
        title: "IELTS 16 - Test 1 - Part 3",
        description: "Thảo luận về dự án nghiên cứu",
        duration: "8:45",
        difficulty: "Medium",
        category: "Discussion",
        attempts: "10K",
        completionRate: 65,
        isNew: false,
    },
    {
        id: "ielts-16-test-1-part-4",
        title: "IELTS 16 - Test 1 - Part 4",
        description: "Bài giảng về kiến trúc bền vững",
        duration: "10:00",
        difficulty: "Hard",
        category: "Lecture",
        attempts: "8K",
        completionRate: 52,
        isNew: false,
    },
    {
        id: "ielts-15-test-2-part-1",
        title: "IELTS 15 - Test 2 - Part 1",
        description: "Hỏi thông tin về câu lạc bộ thể thao",
        duration: "5:45",
        difficulty: "Easy",
        category: "Conversation",
        attempts: "18K",
        completionRate: 88,
        isNew: false,
    },
    {
        id: "ielts-15-test-2-part-2",
        title: "IELTS 15 - Test 2 - Part 2",
        description: "Giới thiệu về công viên quốc gia",
        duration: "7:30",
        difficulty: "Easy",
        category: "Monologue",
        attempts: "14K",
        completionRate: 75,
        isNew: false,
    },
    {
        id: "bbc-6-minute-climate",
        title: "BBC 6 Minute English - Climate",
        description: "Chủ đề biến đổi khí hậu",
        duration: "6:00",
        difficulty: "Medium",
        category: "News",
        attempts: "22K",
        completionRate: 70,
        isNew: false,
    },
    {
        id: "ted-talk-education",
        title: "TED Talk - Future of Education",
        description: "Bài nói về tương lai giáo dục",
        duration: "12:30",
        difficulty: "Hard",
        category: "TED Talk",
        attempts: "9K",
        completionRate: 45,
        isNew: false,
    },
];

// Difficulty color mapping
const difficultyColors = {
    Easy: "text-success bg-success/10",
    Medium: "text-warning bg-warning/10",
    Hard: "text-destructive bg-destructive/10",
};

export default function DictationPage() {
    return (
        <div className="py-8">
            <div className="container-custom">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
                        <FiHeadphones className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-primary">Nghe Chép</span> Chính Tả
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Phương pháp luyện nghe hiệu quả nhất. Nghe và ghi lại từng câu
                        để cải thiện khả năng nghe và chính tả tiếng Anh.
                    </p>
                </div>              
                

                {/* Difficulty Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <Badge variant="default" className="cursor-pointer">
                        Tất cả
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-success hover:text-white hover:border-success">
                        Easy
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-warning hover:text-white hover:border-warning">
                        Medium
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-white hover:border-destructive">
                        Hard
                    </Badge>
                </div>

                {/* Dictation Items Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dictationItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/nghe-chep-chinh-ta/${item.id}`}
                            className="group block"
                        >
                            <Card variant="default" hoverable className="h-full">
                                {/* Header */}
                                <div className="relative h-28 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-t-xl p-4 flex items-center justify-center">
                                    {/* Category badge */}
                                    <Badge variant="secondary" size="sm" className="absolute top-3 left-3">
                                        {item.category}
                                    </Badge>
                                    {/* New badge */}
                                    {item.isNew && (
                                        <Badge variant="default" size="sm" className="absolute top-3 right-3">
                                            Mới
                                        </Badge>
                                    )}
                                    {/* Play icon */}
                                    <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FiPlay className="w-6 h-6 ml-1" />
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    {/* Title */}
                                    <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                        <span className="flex items-center">
                                            <FiClock className="w-3.5 h-3.5 mr-1" />
                                            {item.duration}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${difficultyColors[item.difficulty as keyof typeof difficultyColors]}`}>
                                            {item.difficulty}
                                        </span>
                                    </div>

                                    {/* Completion rate */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Tỉ lệ hoàn thành</span>
                                            <span className="font-medium">{item.completionRate}%</span>
                                        </div>
                                        <Progress value={item.completionRate} size="sm" />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <FiUsers className="w-3.5 h-3.5 mr-1" />
                                            {item.attempts} lượt
                                        </span>
                                        <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-white">
                                            Bắt đầu
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="mt-16 p-8 bg-secondary/50 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 text-center">🎧 Lợi ích của phương pháp Nghe Chép Chính Tả</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">👂</span>
                            </div>
                            <h4 className="font-medium mb-1">Cải thiện Nghe</h4>
                            <p className="text-sm text-muted-foreground">
                                Nâng cao khả năng nghe chi tiết và bắt âm
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">✍️</span>
                            </div>
                            <h4 className="font-medium mb-1">Chính tả tốt</h4>
                            <p className="text-sm text-muted-foreground">
                                Ghi nhớ cách viết từ vựng chuẩn xác
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📝</span>
                            </div>
                            <h4 className="font-medium mb-1">Ngữ pháp vững</h4>
                            <p className="text-sm text-muted-foreground">
                                Nhận biết cấu trúc câu tự nhiên
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h4 className="font-medium mb-1">Band 7+</h4>
                            <p className="text-sm text-muted-foreground">
                                Đạt điểm cao trong phần Listening
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
