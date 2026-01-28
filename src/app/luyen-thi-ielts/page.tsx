/**
 * Khailingo - Trang danh sách đề thi IELTS
 * Hiển thị tất cả các bộ đề thi IELTS
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiUsers, FiSearch, FiFilter } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Input } from "@/components/ui";

export const metadata: Metadata = {
    title: "Luyện thi IELTS - Đề thi IELTS Online miễn phí",
    description: "Kho đề thi IELTS online miễn phí với hơn 500+ đề thi từ Cambridge, giải thích chi tiết và trải nghiệm như thi thật.",
};

// Dữ liệu mẫu các bộ đề thi
const examCategories = [
    {
        id: "cambridge-ielts",
        name: "Cambridge IELTS",
        description: "Bộ đề thi chính thức từ Cambridge",
        exams: [
            { id: "cam-20", title: "Cambridge IELTS 20", tests: 8, attempts: "149K", isNew: true },
            { id: "cam-19", title: "Cambridge IELTS 19", tests: 4, attempts: "120K", isNew: false },
            { id: "cam-18", title: "Cambridge IELTS 18", tests: 4, attempts: "98K", isNew: false },
            { id: "cam-17", title: "Cambridge IELTS 17", tests: 4, attempts: "85K", isNew: false },
            { id: "cam-16", title: "Cambridge IELTS 16", tests: 4, attempts: "72K", isNew: false },
            { id: "cam-15", title: "Cambridge IELTS 15", tests: 4, attempts: "65K", isNew: false },
            { id: "cam-14", title: "Cambridge IELTS 14", tests: 4, attempts: "58K", isNew: false },
            { id: "cam-13", title: "Cambridge IELTS 13", tests: 4, attempts: "52K", isNew: false },
        ],
    },
    {
        id: "actual-tests",
        name: "Đề thi thật IELTS",
        description: "Đề thi IELTS thật từ các kỳ thi gần đây",
        exams: [
            { id: "actual-2024", title: "IELTS Actual Test 2024", tests: 12, attempts: "45K", isNew: true },
            { id: "actual-2023", title: "IELTS Actual Test 2023", tests: 15, attempts: "38K", isNew: false },
        ],
    },
];

export default function IELTSExamsPage() {
    return (
        <div className="py-8">
            <div className="container-custom">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <Badge variant="ghost" className="mb-4">
                        500+ đề thi miễn phí
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Kho đề thi <span className="text-primary">IELTS Online</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Trải nghiệm thi IELTS như thi thật với kho đề khủng từ Cambridge và các đề thi thật
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <Link href="/luyen-thi-ielts/full-test">
                        <Button variant="outline" size="sm">
                            Full Test
                        </Button>
                    </Link>
                    <Link href="/luyen-thi-ielts/reading">
                        <Button variant="outline" size="sm">
                            Reading Practice
                        </Button>
                    </Link>
                    <Link href="/luyen-thi-ielts/listening">
                        <Button variant="outline" size="sm">
                            Listening Practice
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm đề thi..."
                            leftIcon={<FiSearch className="w-5 h-5" />}
                        />
                    </div>
                    <Button variant="outline">
                        <FiFilter className="w-4 h-4 mr-2" />
                        Lọc
                    </Button>
                </div>

                {/* Exam Categories */}
                <div className="space-y-12">
                    {examCategories.map((category) => (
                        <section key={category.id}>
                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{category.name}</h2>
                                    <p className="text-muted-foreground">{category.description}</p>
                                </div>
                            </div>

                            {/* Exams Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {category.exams.map((exam) => (
                                    <Link
                                        key={exam.id}
                                        href={`/luyen-thi-ielts/${exam.id}`}
                                        className="group block"
                                    >
                                        <Card variant="default" hoverable className="h-full">
                                            {/* Image placeholder */}
                                            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-xl">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <FiBookOpen className="w-12 h-12 text-primary/30" />
                                                </div>
                                                {exam.isNew && (
                                                    <Badge variant="default" className="absolute top-3 left-3">
                                                        Mới
                                                    </Badge>
                                                )}
                                            </div>

                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                                    {exam.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                    <span>{exam.tests} bài tests</span>
                                                    <span>•</span>
                                                    <span className="flex items-center">
                                                        <FiUsers className="w-4 h-4 mr-1" />
                                                        {exam.attempts} lượt
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                                                >
                                                    Xem đề thi
                                                    <FiArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Tips Section */}
                <div className="mt-16 p-8 bg-secondary/50 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">💡 Mẹo làm bài thi IELTS</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">Quản lý thời gian</h4>
                                <p className="text-sm text-muted-foreground">
                                    Phân bổ thời gian hợp lý cho từng phần, không dành quá nhiều thời gian cho câu khó
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">Đọc kỹ đề bài</h4>
                                <p className="text-sm text-muted-foreground">
                                    Hiểu rõ yêu cầu của từng dạng câu hỏi trước khi trả lời
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">Luyện tập đều đặn</h4>
                                <p className="text-sm text-muted-foreground">
                                    Làm bài đều đặn mỗi ngày để quen với format và áp lực thời gian
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
