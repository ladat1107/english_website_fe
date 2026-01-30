/**
 * Khailingo - Trang Luyện Thi IELTS Speaking
 * Danh sách bài mẫu và luyện tập Speaking
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiMic, FiUsers, FiClock, FiPlay, FiVideo } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Tabs, TabsList, TabsTrigger } from "@/components/ui";

export const metadata: Metadata = {
    title: "IELTS Speaking - Luyện Nói IELTS",
    description: "Luyện nói IELTS Speaking Part 1, 2, 3 với bài mẫu và video hướng dẫn chi tiết.",
};

// Dữ liệu mẫu Speaking topics
const speakingTopics = [
    {
        id: "part1-hometown",
        title: "Hometown - Where are you from?",
        description: "Câu hỏi về quê hương và nơi ở của bạn",
        part: "Part 1",
        category: "Personal",
        duration: "4-5 mins",
        attempts: "30K",
        hasVideo: true,
        isNew: true,
    },
    {
        id: "part1-work-study",
        title: "Work & Study - What do you do?",
        description: "Câu hỏi về công việc hoặc học tập",
        part: "Part 1",
        category: "Personal",
        duration: "4-5 mins",
        attempts: "28K",
        hasVideo: true,
        isNew: false,
    },
    {
        id: "part1-hobbies",
        title: "Hobbies - Free time activities",
        description: "Câu hỏi về sở thích và hoạt động giải trí",
        part: "Part 1",
        category: "Lifestyle",
        duration: "4-5 mins",
        attempts: "25K",
        hasVideo: true,
        isNew: false,
    },
    {
        id: "part1-technology",
        title: "Technology - Mobile phones & Internet",
        description: "Câu hỏi về công nghệ và thiết bị điện tử",
        part: "Part 1",
        category: "Technology",
        duration: "4-5 mins",
        attempts: "20K",
        hasVideo: false,
        isNew: true,
    },
    {
        id: "part2-person-admire",
        title: "Describe a person you admire",
        description: "Mô tả một người bạn ngưỡng mộ",
        part: "Part 2",
        category: "People",
        duration: "2 mins",
        attempts: "22K",
        hasVideo: true,
        isNew: false,
    },
    {
        id: "part2-memorable-trip",
        title: "Describe a memorable trip",
        description: "Mô tả một chuyến đi đáng nhớ",
        part: "Part 2",
        category: "Experience",
        duration: "2 mins",
        attempts: "18K",
        hasVideo: true,
        isNew: true,
    },
    {
        id: "part2-useful-skill",
        title: "Describe a useful skill you learned",
        description: "Mô tả một kỹ năng hữu ích bạn đã học",
        part: "Part 2",
        category: "Skills",
        duration: "2 mins",
        attempts: "15K",
        hasVideo: false,
        isNew: false,
    },
    {
        id: "part2-special-place",
        title: "Describe a special place in your city",
        description: "Mô tả một địa điểm đặc biệt ở thành phố bạn",
        part: "Part 2",
        category: "Places",
        duration: "2 mins",
        attempts: "16K",
        hasVideo: true,
        isNew: false,
    },
    {
        id: "part3-education-system",
        title: "Discussion: Education System",
        description: "Thảo luận về hệ thống giáo dục",
        part: "Part 3",
        category: "Education",
        duration: "4-5 mins",
        attempts: "12K",
        hasVideo: true,
        isNew: false,
    },
    {
        id: "part3-technology-impact",
        title: "Discussion: Technology Impact",
        description: "Thảo luận về tác động của công nghệ",
        part: "Part 3",
        category: "Technology",
        duration: "4-5 mins",
        attempts: "14K",
        hasVideo: false,
        isNew: true,
    },
];

// Part colors
const partColors = {
    "Part 1": "bg-green-100 text-green-700",
    "Part 2": "bg-blue-100 text-blue-700",
    "Part 3": "bg-purple-100 text-purple-700",
};

export default function SpeakingPage() {
    return (
        <div className="py-8">
            <div className="container-custom">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
                        <FiMic className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        IELTS <span className="text-primary">Speaking</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Luyện nói IELTS với bài mẫu và video hướng dẫn chi tiết.
                        Part 1, Part 2 và Part 3 đầy đủ với từ vựng band 7+.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-4 gap-4 mb-10">
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">150+</div>
                            <div className="text-sm text-muted-foreground">Topics</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">50+</div>
                            <div className="text-sm text-muted-foreground">Video bài mẫu</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">Band 7+</div>
                            <div className="text-sm text-muted-foreground">Bài mẫu</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">AI</div>
                            <div className="text-sm text-muted-foreground">Đánh giá</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Speaking Parts Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <Card variant="bordered" className="border-green-200 bg-green-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <span className="font-bold text-green-700">P1</span>
                                </div>
                                <h3 className="font-semibold text-lg">Part 1: Introduction</h3>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• 4-5 phút trả lời</li>
                                <li>• Câu hỏi về bản thân, gia đình, sở thích</li>
                                <li>• Trả lời ngắn gọn 2-3 câu</li>
                                <li>• Không cần mở rộng quá nhiều</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <span className="font-bold text-blue-700">P2</span>
                                </div>
                                <h3 className="font-semibold text-lg">Part 2: Long Turn</h3>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• 1 phút chuẩn bị, 2 phút nói</li>
                                <li>• Mô tả theo cue card</li>
                                <li>• Cần có cấu trúc rõ ràng</li>
                                <li>• Sử dụng linking words</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-purple-200 bg-purple-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <span className="font-bold text-purple-700">P3</span>
                                </div>
                                <h3 className="font-semibold text-lg">Part 3: Discussion</h3>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• 4-5 phút thảo luận</li>
                                <li>• Câu hỏi trừu tượng, học thuật</li>
                                <li>• Cần đưa ra lập luận và ví dụ</li>
                                <li>• Liên quan đến chủ đề Part 2</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Filter */}
                <Tabs defaultValue="all" className="mb-8">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        <TabsTrigger value="part1">Part 1</TabsTrigger>
                        <TabsTrigger value="part2">Part 2</TabsTrigger>
                        <TabsTrigger value="part3">Part 3</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <Badge variant="default" className="cursor-pointer">
                        Tất cả
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Personal
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Lifestyle
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Technology
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Education
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        People
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Experience
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Places
                    </Badge>
                </div>

                {/* Speaking Topics Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {speakingTopics.map((topic) => (
                        <Link
                            key={topic.id}
                            href={`/luyen-thi-ielts/speaking/${topic.id}`}
                            className="group block"
                        >
                            <Card variant="default" hoverable className="h-full">
                                {/* Header */}
                                <div className="relative h-28 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-t-xl p-4">
                                    {/* Part badge */}
                                    <Badge
                                        size="sm"
                                        className={`absolute top-3 left-3 ${partColors[topic.part as keyof typeof partColors]}`}
                                    >
                                        {topic.part}
                                    </Badge>
                                    {/* New badge */}
                                    {topic.isNew && (
                                        <Badge variant="default" size="sm" className="absolute top-3 right-3">
                                            Mới
                                        </Badge>
                                    )}
                                    {/* Video indicator */}
                                    {topic.hasVideo && (
                                        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm">
                                            <FiVideo className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-xs font-medium">Video</span>
                                        </div>
                                    )}
                                    {/* Play icon */}
                                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FiPlay className="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    {/* Title */}
                                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {topic.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {topic.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center">
                                            <FiClock className="w-3.5 h-3.5 mr-1" />
                                            {topic.duration}
                                        </span>
                                        <span className="flex items-center">
                                            <FiUsers className="w-3.5 h-3.5 mr-1" />
                                            {topic.attempts} lượt
                                        </span>
                                    </div>

                                    {/* Category */}
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" size="sm">
                                            {topic.category}
                                        </Badge>
                                        <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-white">
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Scoring Criteria */}
                <div className="mt-16 p-8 bg-secondary/50 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 text-center">🎤 Tiêu chí chấm điểm Speaking</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">FC</span>
                            </div>
                            <h4 className="font-medium mb-1">Fluency & Coherence</h4>
                            <p className="text-sm text-muted-foreground">
                                Trôi chảy và mạch lạc
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">LR</span>
                            </div>
                            <h4 className="font-medium mb-1">Lexical Resource</h4>
                            <p className="text-sm text-muted-foreground">
                                Vốn từ vựng phong phú
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">GRA</span>
                            </div>
                            <h4 className="font-medium mb-1">Grammatical Range</h4>
                            <p className="text-sm text-muted-foreground">
                                Đa dạng ngữ pháp
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">PR</span>
                            </div>
                            <h4 className="font-medium mb-1">Pronunciation</h4>
                            <p className="text-sm text-muted-foreground">
                                Phát âm chuẩn xác
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI Practice CTA */}
                <div className="mt-10">
                    <Card className="bg-gradient-primary text-white p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">🤖 Luyện Speaking với AI</h3>
                        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                            Thử tính năng luyện Speaking mới với AI đánh giá phát âm,
                            ngữ pháp và từ vựng theo tiêu chuẩn IELTS.
                        </p>
                        <Button size="lg" variant="secondary">
                            Bắt đầu luyện tập
                            <FiMic className="w-5 h-5 ml-2" />
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
