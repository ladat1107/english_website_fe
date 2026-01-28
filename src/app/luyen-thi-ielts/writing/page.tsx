/**
 * Khailingo - Trang Luyện Thi IELTS Writing
 * Danh sách bài mẫu và luyện tập Writing
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiEdit3, FiUsers, FiArrowRight, FiFileText } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Tabs, TabsList, TabsTrigger } from "@/components/ui";

export const metadata: Metadata = {
    title: "IELTS Writing - Luyện Viết IELTS",
    description: "Luyện viết IELTS Writing Task 1 và Task 2 với bài mẫu band 7+ và hướng dẫn chi tiết.",
};

// Dữ liệu mẫu Writing tasks
const writingTasks = [
    {
        id: "task1-line-graph-1",
        title: "Line Graph - Population Growth",
        description: "Biểu đồ đường về tăng trưởng dân số qua các năm",
        type: "Task 1",
        category: "Line Graph",
        difficulty: "Medium",
        attempts: "12K",
        modelBand: 8.0,
        isNew: true,
    },
    {
        id: "task1-bar-chart-1",
        title: "Bar Chart - Energy Consumption",
        description: "Biểu đồ cột về tiêu thụ năng lượng các quốc gia",
        type: "Task 1",
        category: "Bar Chart",
        difficulty: "Easy",
        attempts: "15K",
        modelBand: 7.5,
        isNew: false,
    },
    {
        id: "task1-pie-chart-1",
        title: "Pie Chart - Household Spending",
        description: "Biểu đồ tròn về chi tiêu hộ gia đình",
        type: "Task 1",
        category: "Pie Chart",
        difficulty: "Easy",
        attempts: "10K",
        modelBand: 7.5,
        isNew: false,
    },
    {
        id: "task1-process-1",
        title: "Process - Recycling Paper",
        description: "Quy trình tái chế giấy",
        type: "Task 1",
        category: "Process",
        difficulty: "Hard",
        attempts: "8K",
        modelBand: 8.0,
        isNew: true,
    },
    {
        id: "task1-map-1",
        title: "Map - Town Development",
        description: "Bản đồ thể hiện sự phát triển của thị trấn",
        type: "Task 1",
        category: "Map",
        difficulty: "Hard",
        attempts: "6K",
        modelBand: 7.5,
        isNew: false,
    },
    {
        id: "task2-education-1",
        title: "Should children learn practical skills?",
        description: "Trẻ em nên học kỹ năng thực tế hay kiến thức học thuật?",
        type: "Task 2",
        category: "Education",
        difficulty: "Medium",
        attempts: "20K",
        modelBand: 8.0,
        isNew: true,
    },
    {
        id: "task2-environment-1",
        title: "Individual actions vs Government policies",
        description: "Hành động cá nhân hay chính sách chính phủ hiệu quả hơn cho môi trường?",
        type: "Task 2",
        category: "Environment",
        difficulty: "Medium",
        attempts: "18K",
        modelBand: 8.5,
        isNew: false,
    },
    {
        id: "task2-technology-1",
        title: "Impact of social media on young people",
        description: "Ảnh hưởng của mạng xã hội đến giới trẻ",
        type: "Task 2",
        category: "Technology",
        difficulty: "Easy",
        attempts: "25K",
        modelBand: 7.5,
        isNew: false,
    },
];

// Difficulty color mapping
const difficultyColors = {
    Easy: "text-success bg-success/10",
    Medium: "text-warning bg-warning/10",
    Hard: "text-destructive bg-destructive/10",
};

// Task type color
const taskTypeColors = {
    "Task 1": "bg-blue-100 text-blue-700",
    "Task 2": "bg-purple-100 text-purple-700",
};

export default function WritingPage() {
    return (
        <div className="py-8">
            <div className="container-custom">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
                        <FiEdit3 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        IELTS <span className="text-primary">Writing</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Luyện viết IELTS với bài mẫu band 7+. Task 1 và Task 2 đầy đủ
                        với hướng dẫn chi tiết và từ vựng học thuật.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-4 gap-4 mb-10">
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">200+</div>
                            <div className="text-sm text-muted-foreground">Bài mẫu</div>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-primary/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">50+</div>
                            <div className="text-sm text-muted-foreground">Chủ đề Task 2</div>
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
                            <div className="text-3xl font-bold text-primary">100%</div>
                            <div className="text-sm text-muted-foreground">Miễn phí</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tips Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <Card variant="bordered" className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <FiFileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-lg">Task 1 Tips</h3>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• Viết ít nhất 150 từ trong 20 phút</li>
                                <li>• Mô tả xu hướng chính, không liệt kê số liệu</li>
                                <li>• Sử dụng từ vựng so sánh và mô tả xu hướng</li>
                                <li>• Không đưa ra ý kiến cá nhân</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card variant="bordered" className="border-purple-200 bg-purple-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <FiEdit3 className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-lg">Task 2 Tips</h3>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• Viết ít nhất 250 từ trong 40 phút</li>
                                <li>• Phân tích rõ ràng các quan điểm</li>
                                <li>• Đưa ra ví dụ cụ thể để hỗ trợ ý kiến</li>
                                <li>• Kết luận rõ ràng, mạch lạc</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Filter */}
                <Tabs defaultValue="all" className="mb-8">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        <TabsTrigger value="task1">Task 1</TabsTrigger>
                        <TabsTrigger value="task2">Task 2</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <Badge variant="default" className="cursor-pointer">
                        Tất cả
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Line Graph
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Bar Chart
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Pie Chart
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Process
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Map
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Education
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Environment
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        Technology
                    </Badge>
                </div>

                {/* Writing Tasks Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {writingTasks.map((task) => (
                        <Link
                            key={task.id}
                            href={`/luyen-thi-ielts/writing/${task.id}`}
                            className="group block"
                        >
                            <Card variant="default" hoverable className="h-full">
                                {/* Header */}
                                <div className="relative h-28 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-t-xl p-4">
                                    {/* Task type badge */}
                                    <Badge
                                        size="sm"
                                        className={`absolute top-3 left-3 ${taskTypeColors[task.type as keyof typeof taskTypeColors]}`}
                                    >
                                        {task.type}
                                    </Badge>
                                    {/* New badge */}
                                    {task.isNew && (
                                        <Badge variant="default" size="sm" className="absolute top-3 right-3">
                                            Mới
                                        </Badge>
                                    )}
                                    {/* Category */}
                                    <div className="absolute bottom-4 left-4">
                                        <Badge variant="secondary" size="sm">
                                            {task.category}
                                        </Badge>
                                    </div>
                                    {/* Band score */}
                                    <div className="absolute bottom-4 right-4 bg-white rounded-lg px-2 py-1 shadow-sm">
                                        <span className="text-xs text-muted-foreground">Band </span>
                                        <span className="text-sm font-bold text-primary">{task.modelBand}</span>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    {/* Title */}
                                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {task.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {task.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${difficultyColors[task.difficulty as keyof typeof difficultyColors]}`}>
                                            {task.difficulty}
                                        </span>
                                        <span className="flex items-center">
                                            <FiUsers className="w-3.5 h-3.5 mr-1" />
                                            {task.attempts} lượt xem
                                        </span>
                                    </div>

                                    {/* Action button */}
                                    <Button size="sm" variant="secondary" className="w-full group-hover:bg-primary group-hover:text-white">
                                        Xem bài mẫu
                                        <FiArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Scoring Criteria */}
                <div className="mt-16 p-8 bg-secondary/50 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 text-center">📝 Tiêu chí chấm điểm Writing</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">TA</span>
                            </div>
                            <h4 className="font-medium mb-1">Task Achievement</h4>
                            <p className="text-sm text-muted-foreground">
                                Hoàn thành yêu cầu đề bài
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">CC</span>
                            </div>
                            <h4 className="font-medium mb-1">Coherence & Cohesion</h4>
                            <p className="text-sm text-muted-foreground">
                                Sự liên kết và mạch lạc
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
                    </div>
                </div>
            </div>
        </div>
    );
}
