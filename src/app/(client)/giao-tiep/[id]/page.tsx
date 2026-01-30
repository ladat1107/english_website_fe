/**
 * Khailingo - Speaking Practice Detail Page
 * Trang làm bài luyện giao tiếp chi tiết
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock,
    Play,
    MessageSquare,
    Send,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Badge,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui';
import {
    VideoPlayer,
    VideoScriptDisplay,
    SpeakingQuestionCard,
    OnlineUsersPanel
} from '@/components/speaking';
import {
    SpeakingExam,
    OnlineUser
} from '@/types/speaking.type';
import {
    getMockSpeakingExamById,
    mockOnlineUsers,
    mockGoogleMeetLink
} from '@/utils/mock-data/speaking.mock';

// =====================================================
// TYPES
// =====================================================
interface QuestionAnswer {
    question_number: number;
    audio_url?: string;
    duration_seconds: number;
    completed: boolean;
}

// =====================================================
// SPEAKING PRACTICE DETAIL PAGE
// =====================================================
export default function SpeakingPracticeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id as string;

    // States
    const [exam, setExam] = useState<SpeakingExam | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [attemptStarted, setAttemptStarted] = useState(false);
    const [onlineUsers] = useState<OnlineUser[]>(mockOnlineUsers);

    // =====================================================
    // LOAD EXAM DATA
    // =====================================================
    useEffect(() => {
        const loadExam = async () => {
            setIsLoading(true);

            // Mock API call
            setTimeout(() => {
                const examData = getMockSpeakingExamById(examId);
                if (examData) {
                    setExam(examData);
                    // Initialize answers array
                    setAnswers(examData.questions.map(q => ({
                        question_number: q.question_number,
                        duration_seconds: 0,
                        completed: false,
                    })));
                }
                setIsLoading(false);
            }, 500);
        };

        loadExam();
    }, [examId]);

    // =====================================================
    // HANDLERS
    // =====================================================
    const handleStartAttempt = () => {
        setAttemptStarted(true);
    };

    const handleRecordingComplete = (questionNumber: number, audioBlob: Blob, duration: number) => {
        console.log(`Recording completed for question ${questionNumber}`, { duration });
    };

    const handleUploadComplete = (questionNumber: number, audioUrl: string, duration: number) => {
        setAnswers(prev => prev.map(a =>
            a.question_number === questionNumber
                ? { ...a, audio_url: audioUrl, duration_seconds: duration, completed: true }
                : a
        ));

        // Move to next question if not last
        if (exam && questionNumber < exam.questions.length) {
            setActiveQuestion(questionNumber); // question_number is 1-indexed
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Mock submit
        console.log('Submitting answers:', answers);

        setTimeout(() => {
            setIsSubmitting(false);
            setShowSubmitDialog(false);
            // Navigate to results page
            router.push(`/giao-tiep/ket-qua/mock-attempt-id`);
        }, 1500);
    };

    // Completion stats
    const completedCount = answers.filter(a => a.completed).length;
    const totalQuestions = exam?.questions.length || 0;
    const canSubmit = completedCount > 0;

    // =====================================================
    // LOADING STATE
    // =====================================================
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Đang tải bài luyện...</p>
                </div>
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Không tìm thấy bài luyện</h2>
                    <p className="text-muted-foreground mb-4">Bài luyện này có thể đã bị xóa hoặc không tồn tại</p>
                    <Link href="/giao-tiep">
                        <Button>Quay lại danh sách</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // =====================================================
    // NOT STARTED STATE
    // =====================================================
    if (!attemptStarted) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-card border-b border-border">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-4">
                            <Link href="/giao-tiep">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">
                                    {exam.title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {exam.topic}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-4xl px-4 py-8">
                    <Card className="overflow-hidden">
                        {/* Video Preview */}
                        <div className="aspect-video bg-black">
                            <VideoPlayer
                                src={exam.video_url}
                                title={exam.title}
                                showControls={true}
                            />
                        </div>

                        <CardContent className="p-6">
                            {/* Info */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
                                {exam.description && (
                                    <p className="text-muted-foreground mb-4">{exam.description}</p>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{exam.topic}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{exam.estimated_duration_minutes} phút</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{exam.questions.length} câu hỏi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-muted/50 rounded-xl p-4 mb-6">
                                <h3 className="font-semibold mb-2">Hướng dẫn:</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Xem video và đọc kịch bản hội thoại</li>
                                    <li>Trả lời các câu hỏi bằng cách ghi âm</li>
                                    <li>Mỗi câu trả lời nên dài 30-60 giây</li>
                                    <li>Nộp bài để nhận phản hồi từ giáo viên hoặc AI</li>
                                </ol>
                            </div>

                            {/* Start Button */}
                            <Button
                                size="lg"
                                className="w-full gap-2"
                                onClick={handleStartAttempt}
                            >
                                <Play className="w-5 h-5" />
                                Bắt đầu luyện tập
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // =====================================================
    // PRACTICE IN PROGRESS
    // =====================================================
    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Fixed Header */}
            <div className="bg-card sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/giao-tiep">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-lg font-bold text-foreground line-clamp-1">
                                    {exam.title}
                                </h1>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span>{completedCount}/{totalQuestions} câu đã trả lời</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => setShowSubmitDialog(true)}
                            disabled={!canSubmit}
                            className="gap-2"
                        >
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Nộp bài</span>
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedCount / totalQuestions) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Section */}
                        <Card>
                            <CardContent className="p-0 border-none">
                                <VideoPlayer
                                    src={exam.video_url}
                                    title={exam.title}
                                />
                            </CardContent>
                        </Card>

                        {/* Script Section */}
                        {exam.video_script.length > 0 && (
                            <VideoScriptDisplay
                                scripts={exam.video_script}
                                defaultExpanded={false}
                            />
                        )}

                        {/* Questions Section */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Câu hỏi luyện nói
                            </h2>

                            <div className="space-y-4">
                                {exam.questions.map((question, index) => {
                                    const answer = answers.find(a => a.question_number === question.question_number);
                                    return (
                                        <SpeakingQuestionCard
                                            key={question._id || index}
                                            question={question}
                                            index={index}
                                            isActive={activeQuestion === index}
                                            isCompleted={answer?.completed || false}
                                            audioUrl={answer?.audio_url}
                                            duration={answer?.duration_seconds}
                                            onRecordingComplete={handleRecordingComplete}
                                            onUploadComplete={handleUploadComplete}
                                            onClick={() => setActiveQuestion(index)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Online Users */}
                        <OnlineUsersPanel
                            users={onlineUsers}
                            googleMeetLink={mockGoogleMeetLink}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Dialog */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận nộp bài</DialogTitle>
                        <DialogDescription>
                            Bạn đã hoàn thành {completedCount}/{totalQuestions} câu hỏi.
                            {completedCount < totalQuestions && (
                                <span className="text-warning block mt-1">
                                    Còn {totalQuestions - completedCount} câu chưa trả lời.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowSubmitDialog(false)}
                        >
                            Tiếp tục làm bài
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Nộp bài
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Fixed Bottom Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="text-sm font-medium">
                            {completedCount}/{totalQuestions} câu đã hoàn thành
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${(completedCount / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowSubmitDialog(true)}
                        disabled={!canSubmit}
                        className="gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Nộp bài
                    </Button>
                </div>
            </div>
        </div>
    );
}
