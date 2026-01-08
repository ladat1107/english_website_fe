/**
 * BeeStudy - Trang IELTS Full Test
 * Hiển thị danh sách các bài thi đầy đủ IELTS
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiClock, FiUsers, FiHeadphones, FiBook, FiCheckCircle } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Progress } from "@/components/ui";

export const metadata: Metadata = {
    title: "IELTS Full Test - Làm bài thi IELTS đầy đủ online",
    description: "Làm bài thi IELTS đầy đủ với Reading và Listening, trải nghiệm như thi thật với giới hạn thời gian.",
};

// Dữ liệu mẫu các bài full test
const fullTests = [
    {
        id: "cam-20-test-1",
        book: "Cambridge IELTS 20",
        testNumber: 1,
        duration: 140,
        sections: {
            listening: { questions: 40, duration: 30 },
            reading: { questions: 40, duration: 60 },
        },
        attempts: "25K",
        avgScore: 6.5,
        isNew: true,
    },
    {
        id: "cam-20-test-2",
        book: "Cambridge IELTS 20",
        testNumber: 2,
        duration: 140,
        sections: {
            listening: { questions: 40, duration: 30 },
            reading: { questions: 40, duration: 60 },
        },
        attempts: "22K",
        avgScore: 6.3,
        isNew: true,
    },
    {
        id: "cam-19-test-1",
        book: "Cambridge IELTS 19",
        testNumber: 1,
        duration: 140,
        sections: {
            listening: { questions: 40, duration: 30 },
            reading: { questions: 40, duration: 60 },
        },
        attempts: "35K",
        avgScore: 6.4,
        isNew: false,
    },
    {
        id: "cam-19-test-2",
        book: "Cambridge IELTS 19",
        testNumber: 2,
        duration: 140,
        sections: {
            listening: { questions: 40, duration: 30 },
            reading: { questions: 40, duration: 60 },
        },
        attempts: "30K",
        avgScore: 6.2,
        isNew: false,
    },
    {
        id: "cam-18-test-1",
        book: "Cambridge IELTS 18",
        testNumber: 1,
        duration: 140,
        sections: {
            listening: { questions: 40, duration: 30 },
            reading: { questions: 40, duration: 60 },
        },
        attempts: "28K",
        avgScore: 6.5,
        isNew: false,
    },
    {
        id: "cam-18-test-2",
        book: "Cambridge IELTS 18",
        testNumber: 2,
        duration: 140,
        sections: {
            listening: { questions: 40, duration: 30 },
            reading: { questions: 40, duration: 60 },
        },
        attempts: "25K",
        avgScore: 6.3,
        isNew: false,
    },
];

export default function FullTestPage() {
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
                    <span className="text-foreground">Full Test</span>
                </div>

                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        IELTS <span className="text-primary">Full Test</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Làm bài thi IELTS đầy đủ với Listening và Reading. Trải nghiệm như thi thật với
                        giới hạn thời gian và nhận kết quả ngay sau khi hoàn thành.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                    <Card variant="bordered" className="border-primary/20 bg-primary/5">
                        <CardContent className="p-4 text-center">
                            <FiClock className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="font-semibold">~2 giờ 20 phút</div>
                            <div className="text-sm text-muted-foreground">Thời gian làm bài</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20 bg-primary/5">
                        <CardContent className="p-4 text-center">
                            <FiCheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="font-semibold">80 câu hỏi</div>
                            <div className="text-sm text-muted-foreground">Listening + Reading</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20 bg-primary/5">
                        <CardContent className="p-4 text-center">
                            <FiUsers className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="font-semibold">50K+ lượt làm</div>
                            <div className="text-sm text-muted-foreground">Mỗi tháng</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tests List */}
                <div className="space-y-4">
                    {fullTests.map((test) => (
                        <Card key={test.id} variant="default" hoverable>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Test Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold">
                                                {test.book} - Test {test.testNumber}
                                            </h3>
                                            {test.isNew && <Badge variant="default">Mới</Badge>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center">
                                                <FiClock className="w-4 h-4 mr-1.5" />
                                                {test.duration} phút
                                            </span>
                                            <span className="flex items-center">
                                                <FiUsers className="w-4 h-4 mr-1.5" />
                                                {test.attempts} lượt làm
                                            </span>
                                            <span className="flex items-center">
                                                <span className="text-warning mr-1.5">★</span>
                                                Điểm TB: {test.avgScore}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sections */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-6 p-3 bg-secondary/50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <FiHeadphones className="w-5 h-5 text-purple-500" />
                                                <div className="text-sm">
                                                    <span className="font-medium">Listening</span>
                                                    <span className="text-muted-foreground ml-1">
                                                        ({test.sections.listening.questions} câu)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-border" />
                                            <div className="flex items-center gap-2">
                                                <FiBook className="w-5 h-5 text-green-500" />
                                                <div className="text-sm">
                                                    <span className="font-medium">Reading</span>
                                                    <span className="text-muted-foreground ml-1">
                                                        ({test.sections.reading.questions} câu)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <Link href={`/luyen-thi-ielts/full-test/${test.id}`}>
                                            <Button size="lg">
                                                Bắt đầu làm bài
                                                <FiArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                        Xem thêm đề thi
                    </Button>
                </div>
            </div>
        </div>
    );
}
