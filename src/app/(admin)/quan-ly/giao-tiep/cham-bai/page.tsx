"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ClipboardCheck,
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    Mic,
    CheckCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Send,
    Eye,
    MessageSquare,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
    MOCK_SPEAKING_SUBMISSIONS,
    getSpeakingExamById,
    formatDate,
    formatDuration,
} from "@/utils/mock-data/speaking.mock";
import {
    SpeakingSubmission,
    ExamAttemptStatus,
    SPEAKING_TOPIC_LABELS,
} from "@/types/speaking.type";

interface GradingForm {
    score: number;
    feedback: string;
    pronunciationScore: number;
    grammarScore: number;
    fluencyScore: number;
    vocabularyScore: number;
}

export default function AdminGradingPage() {
    const [selectedSubmission, setSelectedSubmission] =
        useState<SpeakingSubmission | null>(null);
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("pending");
    const [topicFilter, setTopicFilter] = useState<string>("all");
    const [gradingForm, setGradingForm] = useState<GradingForm>({
        score: 70,
        feedback: "",
        pronunciationScore: 70,
        grammarScore: 70,
        fluencyScore: 70,
        vocabularyScore: 70,
    });

    // Filter submissions
    const filteredSubmissions = useMemo(() => {
        return MOCK_SPEAKING_SUBMISSIONS.filter((submission) => {
            const exam = getSpeakingExamById(submission.speakingExamId);
            if (!exam) return false;

            // Search filter
            if (
                searchQuery &&
                !exam.title.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                return false;
            }

            // Topic filter
            if (topicFilter !== "all" && exam.topic !== topicFilter) {
                return false;
            }

            // Status filter
            if (statusFilter === "pending") {
                return submission.status === ExamAttemptStatus.COMPLETED;
            } else if (statusFilter === "graded") {
                return submission.status === ExamAttemptStatus.GRADED;
            }

            return true;
        });
    }, [searchQuery, statusFilter, topicFilter]);

    // Stats
    const stats = useMemo(() => {
        return {
            total: MOCK_SPEAKING_SUBMISSIONS.length,
            pending: MOCK_SPEAKING_SUBMISSIONS.filter(
                (s) => s.status === ExamAttemptStatus.COMPLETED
            ).length,
            graded: MOCK_SPEAKING_SUBMISSIONS.filter(
                (s) => s.status === ExamAttemptStatus.GRADED
            ).length,
            inProgress: MOCK_SPEAKING_SUBMISSIONS.filter(
                (s) => s.status === ExamAttemptStatus.IN_PROGRESS
            ).length,
        };
    }, []);

    const getStatusBadge = (status: ExamAttemptStatus) => {
        switch (status) {
            case ExamAttemptStatus.GRADED:
                return (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã chấm
                    </Badge>
                );
            case ExamAttemptStatus.COMPLETED:
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Chờ chấm
                    </Badge>
                );
            case ExamAttemptStatus.IN_PROGRESS:
                return (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                        <Clock className="w-3 h-3 mr-1" />
                        Đang làm
                    </Badge>
                );
            default:
                return <Badge variant="outline">Khác</Badge>;
        }
    };

    const openGradingModal = (submission: SpeakingSubmission) => {
        setSelectedSubmission(submission);
        setGradingForm({
            score: submission.score || 70,
            feedback: submission.feedback || "",
            pronunciationScore: 70,
            grammarScore: 70,
            fluencyScore: 70,
            vocabularyScore: 70,
        });
        setIsGradingModalOpen(true);
    };

    const handleSubmitGrade = () => {
        if (!selectedSubmission) return;
        // Here you would call API to submit grade
        console.log("Submitting grade:", {
            submissionId: selectedSubmission._id,
            ...gradingForm,
        });
        setIsGradingModalOpen(false);
        // Show success toast or update UI
    };

    const calculateAverageScore = () => {
        return Math.round(
            (gradingForm.pronunciationScore +
                gradingForm.grammarScore +
                gradingForm.fluencyScore +
                gradingForm.vocabularyScore) /
            4
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <ClipboardCheck className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chấm bài luyện giao tiếp</h1>
                        <p className="text-gray-600">Đánh giá và chấm điểm bài nộp của học viên</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                                <div className="text-sm text-gray-600">Tổng bài nộp</div>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Mic className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                <div className="text-sm text-gray-600">Chờ chấm</div>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{stats.graded}</div>
                                <div className="text-sm text-gray-600">Đã chấm</div>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                                <div className="text-sm text-gray-600">Đang làm</div>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm theo tên bài..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ chấm</SelectItem>
                        <SelectItem value="graded">Đã chấm</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả chủ đề</SelectItem>
                        {Object.entries(SPEAKING_TOPIC_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </motion.div>

            {/* Submissions List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                {filteredSubmissions.length === 0 ? (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-12 text-center">
                            <ClipboardCheck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Không có bài nộp nào
                            </h3>
                            <p className="text-gray-600">
                                {statusFilter === "pending"
                                    ? "Chưa có bài nộp nào đang chờ chấm"
                                    : "Không tìm thấy bài nộp phù hợp với bộ lọc"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredSubmissions.map((submission, index) => {
                        const exam = getSpeakingExamById(submission.speakingExamId);
                        if (!exam) return null;
                        const isExpanded = expandedSubmission === submission._id;

                        return (
                            <motion.div
                                key={submission._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                            >
                                <Card className="border-0 shadow-sm overflow-hidden">
                                    {/* Submission Header */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() =>
                                            setExpandedSubmission(isExpanded ? null : submission._id)
                                        }
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3.5 h-3.5" />
                                                            User ID: {submission.userId.slice(-6)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {formatDate(submission.startedAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Mic className="w-3.5 h-3.5" />
                                                            {submission.answers.length} câu trả lời
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {SPEAKING_TOPIC_LABELS[exam.topic]}
                                                        </Badge>
                                                        {getStatusBadge(submission.status)}
                                                        {submission.score !== undefined && (
                                                            <Badge className="bg-primary/10 text-primary">
                                                                <Star className="w-3 h-3 mr-1" />
                                                                {submission.score}/100
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {submission.status === ExamAttemptStatus.COMPLETED && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-primary hover:bg-primary/90"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openGradingModal(submission);
                                                        }}
                                                    >
                                                        <ClipboardCheck className="w-4 h-4 mr-1" />
                                                        Chấm bài
                                                    </Button>
                                                )}
                                                {submission.status === ExamAttemptStatus.GRADED && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openGradingModal(submission);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Xem lại
                                                    </Button>
                                                )}
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden border-t"
                                            >
                                                <div className="p-4 bg-gray-50 space-y-4">
                                                    {/* Audio Answers */}
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-3">
                                                            Bài ghi âm của học viên
                                                        </h4>
                                                        <div className="grid gap-3">
                                                            {submission.answers.map((answer, answerIndex) => (
                                                                <div
                                                                    key={answer._id}
                                                                    className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                                                                >
                                                                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0">
                                                                        <span className="text-sm font-medium text-primary">
                                                                            {answerIndex + 1}
                                                                        </span>
                                                                    </div>
                                                                    <audio
                                                                        controls
                                                                        src={answer.audioUrl}
                                                                        className="flex-1 h-8"
                                                                    />
                                                                    <span className="text-xs text-gray-500 min-w-[50px] text-right">
                                                                        {formatDuration(answer.duration)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Feedback if graded */}
                                                    {submission.feedback && (
                                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                            <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                                                                <MessageSquare className="w-4 h-4" />
                                                                Nhận xét đã gửi
                                                            </div>
                                                            <p className="text-gray-700">{submission.feedback}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* Grading Modal */}
            <Dialog open={isGradingModalOpen} onOpenChange={setIsGradingModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ClipboardCheck className="w-5 h-5 text-primary" />
                            Chấm điểm bài luyện giao tiếp
                        </DialogTitle>
                    </DialogHeader>

                    {selectedSubmission && (
                        <Tabs defaultValue="listen" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="listen">Nghe bài làm</TabsTrigger>
                                <TabsTrigger value="grade">Chấm điểm</TabsTrigger>
                            </TabsList>

                            <TabsContent value="listen" className="space-y-4 mt-4">
                                {/* Exam Info */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium mb-2">
                                        {getSpeakingExamById(selectedSubmission.speakingExamId)?.title}
                                    </h4>
                                    <div className="text-sm text-gray-600">
                                        Nộp lúc: {formatDate(selectedSubmission.startedAt)}
                                    </div>
                                </div>

                                {/* Audio Answers */}
                                <div className="space-y-3">
                                    {selectedSubmission.answers.map((answer, index) => (
                                        <div
                                            key={answer._id}
                                            className="p-4 bg-white rounded-lg border"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium">Câu {index + 1}</span>
                                                <span className="text-sm text-gray-500">
                                                    ({formatDuration(answer.duration)})
                                                </span>
                                            </div>
                                            <audio controls src={answer.audioUrl} className="w-full" />
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="grade" className="space-y-6 mt-4">
                                {/* Score Sliders */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Phát âm (Pronunciation)</Label>
                                            <span className="font-medium text-primary">
                                                {gradingForm.pronunciationScore}/100
                                            </span>
                                        </div>
                                        <Slider
                                            value={[gradingForm.pronunciationScore]}
                                            onValueChange={([value]) =>
                                                setGradingForm({ ...gradingForm, pronunciationScore: value })
                                            }
                                            max={100}
                                            step={1}
                                            className="[&_[role=slider]]:bg-primary"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Ngữ pháp (Grammar)</Label>
                                            <span className="font-medium text-primary">
                                                {gradingForm.grammarScore}/100
                                            </span>
                                        </div>
                                        <Slider
                                            value={[gradingForm.grammarScore]}
                                            onValueChange={([value]) =>
                                                setGradingForm({ ...gradingForm, grammarScore: value })
                                            }
                                            max={100}
                                            step={1}
                                            className="[&_[role=slider]]:bg-primary"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Độ trôi chảy (Fluency)</Label>
                                            <span className="font-medium text-primary">
                                                {gradingForm.fluencyScore}/100
                                            </span>
                                        </div>
                                        <Slider
                                            value={[gradingForm.fluencyScore]}
                                            onValueChange={([value]) =>
                                                setGradingForm({ ...gradingForm, fluencyScore: value })
                                            }
                                            max={100}
                                            step={1}
                                            className="[&_[role=slider]]:bg-primary"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Từ vựng (Vocabulary)</Label>
                                            <span className="font-medium text-primary">
                                                {gradingForm.vocabularyScore}/100
                                            </span>
                                        </div>
                                        <Slider
                                            value={[gradingForm.vocabularyScore]}
                                            onValueChange={([value]) =>
                                                setGradingForm({ ...gradingForm, vocabularyScore: value })
                                            }
                                            max={100}
                                            step={1}
                                            className="[&_[role=slider]]:bg-primary"
                                        />
                                    </div>
                                </div>

                                {/* Average Score Display */}
                                <div className="p-4 bg-gradient-to-r from-primary/10 to-orange-50 rounded-lg text-center">
                                    <div className="text-sm text-gray-600 mb-1">Điểm trung bình</div>
                                    <div className="text-4xl font-bold text-primary">
                                        {calculateAverageScore()}
                                        <span className="text-lg text-gray-500">/100</span>
                                    </div>
                                </div>

                                {/* Overall Score Override */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <Label>Điểm tổng kết (có thể điều chỉnh)</Label>
                                        <span className="font-medium text-primary">
                                            {gradingForm.score}/100
                                        </span>
                                    </div>
                                    <Slider
                                        value={[gradingForm.score]}
                                        onValueChange={([value]) =>
                                            setGradingForm({ ...gradingForm, score: value })
                                        }
                                        max={100}
                                        step={1}
                                        className="[&_[role=slider]]:bg-primary"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() =>
                                            setGradingForm({
                                                ...gradingForm,
                                                score: calculateAverageScore(),
                                            })
                                        }
                                    >
                                        Dùng điểm trung bình
                                    </Button>
                                </div>

                                {/* Feedback */}
                                <div>
                                    <Label className="mb-2 block">Nhận xét cho học viên</Label>
                                    <Textarea
                                        placeholder="Nhập nhận xét, góp ý cho học viên..."
                                        value={gradingForm.feedback}
                                        onChange={(e) =>
                                            setGradingForm({ ...gradingForm, feedback: e.target.value })
                                        }
                                        rows={4}
                                    />
                                </div>

                                {/* Quick Feedback Templates */}
                                <div>
                                    <Label className="mb-2 block text-sm text-gray-600">
                                        Mẫu nhận xét nhanh
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Phát âm tốt, cần cải thiện ngữ điệu",
                                            "Cần luyện thêm các âm cuối",
                                            "Từ vựng phong phú, ngữ pháp chính xác",
                                            "Cần nói chậm hơn và rõ ràng hơn",
                                        ].map((template) => (
                                            <Button
                                                key={template}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() =>
                                                    setGradingForm({
                                                        ...gradingForm,
                                                        feedback: gradingForm.feedback
                                                            ? `${gradingForm.feedback}. ${template}`
                                                            : template,
                                                    })
                                                }
                                            >
                                                {template}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsGradingModalOpen(false)}>
                            Huỷ
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={handleSubmitGrade}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Gửi kết quả
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
