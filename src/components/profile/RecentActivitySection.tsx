/**
 * Khailingo - Recent Activity Section
 * Section hiển thị lịch sử hoạt động gần đây
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FiBook,
    FiMic,
    FiClock,
    FiCheckCircle,
    FiArrowRight,
    FiAlertCircle,
    FiMessageSquare
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetRecentExams, useGetRecentSpeakingAttempts } from '@/hooks/use-user';
import { RecentExamAttempt, RecentSpeakingAttempt } from '@/types/profile.type';
import { ProfileActivitySkeleton } from './ProfileSkeleton';
import { ExamAttemptStatus } from '@/utils/constants/enum';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

// Mock data
const MOCK_RECENT_EXAMS: RecentExamAttempt[] = [
    {
        _id: '1',
        exam_id: 'exam1',
        exam_title: 'Cambridge IELTS 18 - Test 1',
        exam_type: 'Full Test',
        status: ExamAttemptStatus.COMPLETED,
        total_score: 6.5,
        percentage: 75,
        time_spent_seconds: 7200,
        completed_at: '2024-01-15T10:30:00Z',
    },
    {
        _id: '2',
        exam_id: 'exam2',
        exam_title: 'IELTS Listening Practice 15',
        exam_type: 'Listening',
        status: ExamAttemptStatus.COMPLETED,
        total_score: 32,
        percentage: 80,
        time_spent_seconds: 2400,
        completed_at: '2024-01-14T15:20:00Z',
    },
    {
        _id: '3',
        exam_id: 'exam3',
        exam_title: 'IELTS Reading - Academic Set 8',
        exam_type: 'Reading',
        status: ExamAttemptStatus.IN_PROGRESS,
        total_score: 0,
        percentage: 45,
        time_spent_seconds: 1800,
        started_at: '2024-01-14T09:00:00Z',
    },
];

const MOCK_RECENT_SPEAKING: RecentSpeakingAttempt[] = [
    {
        _id: '1',
        exam_id: 'speak1',
        exam_title: 'Describing your hometown',
        topic: 'Daily Life',
        status: ExamAttemptStatus.COMPLETED,
        has_teacher_feedback: true,
        submitted_at: '2024-01-15T14:00:00Z',
    },
    {
        _id: '2',
        exam_id: 'speak2',
        exam_title: 'Technology in education',
        topic: 'Education',
        status: ExamAttemptStatus.COMPLETED,
        has_teacher_feedback: false,
        submitted_at: '2024-01-13T16:30:00Z',
    },
    {
        _id: '3',
        exam_id: 'speak3',
        exam_title: 'Environmental issues',
        topic: 'Environment',
        status: ExamAttemptStatus.IN_PROGRESS,
        has_teacher_feedback: false,
    },
];

// Status config
const STATUS_CONFIG: Record<ExamAttemptStatus, {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'secondary' | 'destructive';
    icon: React.ElementType;
}> = {
    [ExamAttemptStatus.COMPLETED]: {
        label: 'Hoàn thành',
        variant: 'success',
        icon: FiCheckCircle,
    },
    [ExamAttemptStatus.IN_PROGRESS]: {
        label: 'Đang làm',
        variant: 'warning',
        icon: FiClock,
    },
    [ExamAttemptStatus.NOT_STARTED]: {
        label: 'Chưa bắt đầu',
        variant: 'secondary',
        icon: FiAlertCircle,
    },
    [ExamAttemptStatus.ABANDONED]: {
        label: 'Đã hủy',
        variant: 'destructive',
        icon: FiAlertCircle,
    },
};

// Format time spent
const formatTimeSpent = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes} phút`;
};

// Exam Activity Card
interface ExamActivityItemProps {
    exam: RecentExamAttempt;
    delay?: number;
}

const ExamActivityItem: React.FC<ExamActivityItemProps> = ({ exam, delay = 0 }) => {
    const statusConfig = STATUS_CONFIG[exam.status as ExamAttemptStatus];
    const StatusIcon = statusConfig?.icon || FiAlertCircle;
    const timeAgo = exam.completed_at
        ? dayjs(exam.completed_at).fromNow()
        : exam.started_at
            ? dayjs(exam.started_at).fromNow()
            : '';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <FiBook className="w-5 h-5 text-blue-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h4 className="font-medium text-foreground truncate">
                                {exam.exam_title}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                <span>{exam.exam_type}</span>
                                <span>•</span>
                                <span>{timeAgo}</span>
                            </p>
                        </div>
                        <Badge
                            variant={statusConfig?.variant as 'default' | 'success' | 'warning'}
                            size="sm"
                        >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig?.label}
                        </Badge>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                        {exam.status === ExamAttemptStatus.COMPLETED ? (
                            <>
                                <span className="text-foreground font-medium">
                                    {exam.percentage}%
                                </span>
                                <span className="text-muted-foreground">
                                    {formatTimeSpent(exam.time_spent_seconds)}
                                </span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">
                                Đã làm {exam.percentage}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Action */}
                <Link
                    href={`/luyen-thi-ielts/ket-qua/${exam._id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Button variant="ghost" size="icon-sm">
                        <FiArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

// Speaking Activity Card
interface SpeakingActivityItemProps {
    attempt: RecentSpeakingAttempt;
    delay?: number;
}

const SpeakingActivityItem: React.FC<SpeakingActivityItemProps> = ({ attempt, delay = 0 }) => {
    const statusConfig = STATUS_CONFIG[attempt.status as ExamAttemptStatus];
    const StatusIcon = statusConfig?.icon || FiAlertCircle;
    const timeAgo = attempt.submitted_at
        ? dayjs(attempt.submitted_at).fromNow()
        : '';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <FiMic className="w-5 h-5 text-purple-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h4 className="font-medium text-foreground truncate">
                                {attempt.exam_title}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                <span>{attempt.topic}</span>
                                {timeAgo && (
                                    <>
                                        <span>•</span>
                                        <span>{timeAgo}</span>
                                    </>
                                )}
                            </p>
                        </div>
                        <Badge
                            variant={statusConfig?.variant as 'default' | 'success' | 'warning'}
                            size="sm"
                        >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig?.label}
                        </Badge>
                    </div>

                    {/* Feedback status */}
                    {attempt.status === ExamAttemptStatus.COMPLETED && (
                        <div className="mt-2 flex items-center gap-2">
                            {attempt.has_teacher_feedback ? (
                                <Badge variant="info" size="sm">
                                    <FiMessageSquare className="w-3 h-3 mr-1" />
                                    Đã có phản hồi
                                </Badge>
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    Đang chờ phản hồi từ giáo viên
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action */}
                <Link
                    href={`/giao-tiep/ket-qua/${attempt._id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Button variant="ghost" size="icon-sm">
                        <FiArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

export const RecentActivitySection: React.FC = () => {
    const { data: recentExams, isLoading: isLoadingExams } = useGetRecentExams(5);
    const { data: recentSpeaking, isLoading: isLoadingSpeaking } = useGetRecentSpeakingAttempts(5);

    // Sử dụng mock data nếu API chưa có
    const exams = recentExams ?? MOCK_RECENT_EXAMS;
    const speaking = recentSpeaking ?? MOCK_RECENT_SPEAKING;

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Hoạt động gần đây
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Theo dõi các bài thi và luyện tập của bạn
                    </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Exams */}
                <Card variant="bordered">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FiBook className="w-5 h-5 text-blue-600" />
                            Bài thi gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingExams ? (
                            <ProfileActivitySkeleton />
                        ) : exams.length > 0 ? (
                            <div className="space-y-3">
                                {exams.map((exam, index) => (
                                    <ExamActivityItem
                                        key={exam._id}
                                        exam={exam}
                                        delay={index * 0.1}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FiBook className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Chưa có bài thi nào</p>
                                <Link href="/luyen-thi-ielts">
                                    <Button variant="outline" size="sm" className="mt-4">
                                        Bắt đầu làm bài
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {exams.length > 0 && (
                            <Link href="/luyen-thi-ielts" className="mt-4 block">
                                <Button variant="ghost" size="sm" className="w-full">
                                    Xem tất cả bài thi
                                    <FiArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Speaking */}
                <Card variant="bordered">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FiMic className="w-5 h-5 text-purple-600" />
                            Luyện nói gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingSpeaking ? (
                            <ProfileActivitySkeleton />
                        ) : speaking.length > 0 ? (
                            <div className="space-y-3">
                                {speaking.map((attempt, index) => (
                                    <SpeakingActivityItem
                                        key={attempt._id}
                                        attempt={attempt}
                                        delay={index * 0.1}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FiMic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Chưa có bài luyện nói nào</p>
                                <Link href="/giao-tiep">
                                    <Button variant="outline" size="sm" className="mt-4">
                                        Bắt đầu luyện nói
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {speaking.length > 0 && (
                            <Link href="/giao-tiep" className="mt-4 block">
                                <Button variant="ghost" size="sm" className="w-full">
                                    Xem tất cả bài luyện nói
                                    <FiArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default RecentActivitySection;
