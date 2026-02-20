"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    History,
    Calendar,
    Clock,
    CheckCircle,
    PlayCircle,
    ChevronDown,
    ChevronUp,
    Mic,
    BarChart2,
    MessageSquare,
    Search,
    Filter
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { AIAnalysisCard } from "@/components/speaking";
import {
    MOCK_SPEAKING_SUBMISSIONS,
    getSpeakingExamById,
    formatDuration,
    formatDate
} from "@/utils/mock-data/speaking.mock";
import { SpeakingSubmission, ExamAttemptStatus, SPEAKING_TOPIC_LABELS } from "@/types/speaking.type";
import { SpeakingTopic } from "@/utils/constants/enum";

// Group submissions by exam
interface GroupedSubmission {
    examId: string;
    examTitle: string;
    topic: SpeakingTopic;
    attempts: SpeakingSubmission[];
}

export default function SpeakingHistoryPage() {
    const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
    const [showAIAnalysis, setShowAIAnalysis] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [topicFilter, setTopicFilter] = useState<string>("all");

    // Group submissions by exam
    const groupedSubmissions = useMemo(() => {
        const groups: Record<string, GroupedSubmission> = {};

        MOCK_SPEAKING_SUBMISSIONS.forEach(submission => {
            const exam = getSpeakingExamById(submission.speakingExamId);
            if (!exam) return;

            if (!groups[submission.speakingExamId]) {
                groups[submission.speakingExamId] = {
                    examId: submission.speakingExamId,
                    examTitle: exam.title,
                    topic: exam.topic,
                    attempts: []
                };
            }
            groups[submission.speakingExamId].attempts.push(submission);
        });

        return Object.values(groups);
    }, []);

    // Filter submissions
    const filteredGroups = useMemo(() => {
        return groupedSubmissions.filter(group => {
            // Search filter
            if (searchQuery && !group.examTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Topic filter
            if (topicFilter !== "all" && group.topic !== topicFilter) {
                return false;
            }

            // Status filter - check if any attempt matches
            if (statusFilter !== "all") {
                const hasMatchingStatus = group.attempts.some(a => a.status === statusFilter);
                if (!hasMatchingStatus) return false;
            }

            return true;
        });
    }, [groupedSubmissions, searchQuery, statusFilter, topicFilter]);

    // Stats
    const stats = useMemo(() => {
        const allAttempts = groupedSubmissions.flatMap(g => g.attempts);
        return {
            totalAttempts: allAttempts.length,
            completed: allAttempts.filter(a => a.status === ExamAttemptStatus.COMPLETED).length,
            graded: allAttempts.filter(a => a.status === ExamAttemptStatus.GRADED).length,
            inProgress: allAttempts.filter(a => a.status === ExamAttemptStatus.IN_PROGRESS).length,
        };
    }, [groupedSubmissions]);

    const getStatusBadge = (status: ExamAttemptStatus) => {
        switch (status) {
            case ExamAttemptStatus.GRADED:
                return <Badge className="bg-green-100 text-green-700 border-green-300">Đã chấm điểm</Badge>;
            case ExamAttemptStatus.COMPLETED:
                return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Đã nộp bài</Badge>;
            case ExamAttemptStatus.IN_PROGRESS:
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Đang làm</Badge>;
            case ExamAttemptStatus.ABANDONED:
                return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Đã huỷ</Badge>;
            default:
                return <Badge variant="outline">Chưa xác định</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-orange-50/30">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/giao-tiep">
                        <Button variant="ghost" className="mb-4 gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại danh sách
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <History className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lịch sử luyện tập</h1>
                            <p className="text-gray-600 mt-1">Xem lại các bài luyện giao tiếp đã hoàn thành</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">{stats.totalAttempts}</div>
                            <div className="text-sm text-gray-600">Tổng lượt làm</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">{stats.graded}</div>
                            <div className="text-sm text-gray-600">Đã chấm điểm</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
                            <div className="text-sm text-gray-600">Đã nộp bài</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
                            <div className="text-sm text-gray-600">Đang làm</div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm bài luyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Chủ đề" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả chủ đề</SelectItem>
                            {Object.entries(SPEAKING_TOPIC_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value={ExamAttemptStatus.GRADED}>Đã chấm điểm</SelectItem>
                            <SelectItem value={ExamAttemptStatus.COMPLETED}>Đã nộp bài</SelectItem>
                            <SelectItem value={ExamAttemptStatus.IN_PROGRESS}>Đang làm</SelectItem>
                        </SelectContent>
                    </Select>
                </motion.div>

                {/* Submissions List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {filteredGroups.length === 0 ? (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-12 text-center">
                                <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài luyện nào</h3>
                                <p className="text-gray-600 mb-4">Hãy bắt đầu luyện tập để xem lịch sử tại đây</p>
                                <Link href="/giao-tiep">
                                    <Button className="bg-primary hover:bg-primary/90">
                                        Bắt đầu luyện tập
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredGroups.map((group, groupIndex) => (
                            <motion.div
                                key={group.examId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * groupIndex }}
                            >
                                <Card className="border-0 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-primary/5 to-orange-50/50 border-b">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <CardTitle className="text-lg">{group.examTitle}</CardTitle>
                                                <Badge variant="outline" className="mt-1">
                                                    {SPEAKING_TOPIC_LABELS[group.topic]}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {group.attempts.length} lượt làm
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {group.attempts.map((attempt, attemptIndex) => {
                                            const isExpanded = expandedAttempt === attempt._id;
                                            const showingAI = showAIAnalysis === attempt._id;

                                            return (
                                                <div
                                                    key={attempt._id}
                                                    className={`border-b last:border-b-0 ${attemptIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                                >
                                                    {/* Attempt Summary */}
                                                    <div
                                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                                        onClick={() => setExpandedAttempt(isExpanded ? null : attempt._id)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="hidden sm:block">
                                                                    {attempt.status === ExamAttemptStatus.GRADED ? (
                                                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                                                    ) : attempt.status === ExamAttemptStatus.COMPLETED ? (
                                                                        <CheckCircle className="w-8 h-8 text-blue-500" />
                                                                    ) : (
                                                                        <Clock className="w-8 h-8 text-yellow-500" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="font-medium">Lần {attemptIndex + 1}</span>
                                                                        {getStatusBadge(attempt.status)}
                                                                        {attempt.score !== undefined && (
                                                                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                                                                {attempt.score}/100 điểm
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                            {formatDate(attempt.startedAt)}
                                                                        </span>
                                                                        {attempt.submittedAt && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="w-3.5 h-3.5" />
                                                                                {formatDuration(
                                                                                    Math.round((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 1000)
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
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
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-4 pb-4 space-y-4">
                                                                    {/* Feedback from teacher */}
                                                                    {attempt.feedback && (
                                                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                                            <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                                                                                <MessageSquare className="w-4 h-4" />
                                                                                Nhận xét từ giáo viên
                                                                            </div>
                                                                            <p className="text-gray-700">{attempt.feedback}</p>
                                                                        </div>
                                                                    )}

                                                                    {/* Audio Answers */}
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                                                            <Mic className="w-4 h-4" />
                                                                            Bài ghi âm của bạn ({attempt.answers.length} câu)
                                                                        </h4>
                                                                        <div className="space-y-3">
                                                                            {attempt.answers.map((answer, answerIndex) => (
                                                                                <div key={answer._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                                    <span className="text-sm font-medium text-gray-600 min-w-[60px]">
                                                                                        Câu {answerIndex + 1}
                                                                                    </span>
                                                                                    <audio
                                                                                        controls
                                                                                        src={answer.audioUrl}
                                                                                        className="flex-1 h-8"
                                                                                    />
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {formatDuration(answer.duration)}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    {/* Action Buttons */}
                                                                    <div className="flex flex-wrap gap-3 pt-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="gap-2"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setShowAIAnalysis(showingAI ? null : attempt._id);
                                                                            }}
                                                                        >
                                                                            <BarChart2 className="w-4 h-4" />
                                                                            {showingAI ? "Ẩn phân tích AI" : "Xem phân tích AI"}
                                                                        </Button>
                                                                        <Link href={`/giao-tiep/${group.examId}`}>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="gap-2"
                                                                            >
                                                                                <PlayCircle className="w-4 h-4" />
                                                                                Luyện lại
                                                                            </Button>
                                                                        </Link>
                                                                    </div>

                                                                    {/* AI Analysis */}
                                                                    <AnimatePresence>
                                                                        {showingAI && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: -10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, y: -10 }}
                                                                            >
                                                                                <AIAnalysisCard
                                                                                    analysis={{
                                                                                        transcript: "Hello, my name is... I am a student at...",
                                                                                        improvement: [
                                                                                            "Luyện tập đọc to các đoạn văn mỗi ngày",
                                                                                            "Nghe và bắt chước theo native speakers",
                                                                                            "Ghi âm và nghe lại để tự đánh giá"
                                                                                        ],
                                                                                        error: [
                                                                                            "Phát âm 'th' cần đặt lưỡi giữa răng",
                                                                                            "Nhấn âm sai ở từ 'interesting': IN-ter-es-ting"
                                                                                        ],
                                                                                        ai_fix: "Hello, my name is Nguyen Van A. I am a student at FPT University, studying Software Engineering."
                                                                                    }}
                                                                                    onRequestAnalysis={() => {
                                                                                        window.location.href = `/giao-tiep/${group.examId}`;
                                                                                    }}
                                                                                />
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
}
