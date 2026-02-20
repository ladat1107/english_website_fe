/**
 * Khailingo - Speaking Exam Card Component
 * Card hiển thị thông tin đề giao tiếp trong danh sách
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Clock,
    HelpCircle,
    Play,
    Eye,
    Edit,
    Trash2,
    MessageCircle,
    Tag,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { SpeakingExam } from '@/types/speaking.type';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Button,
    Badge
} from '@/components/ui';
import { SpeakingTopic } from '@/utils/constants/enum';
import Image from 'next/image';

// =====================================================
// TYPES
// =====================================================
interface SpeakingExamCardProps {
    exam: SpeakingExam;
    variant?: 'student' | 'admin';
    onEdit?: (exam: SpeakingExam) => void;
    onDelete?: (exam: SpeakingExam) => void;
    onPreview?: (exam: SpeakingExam) => void;
    className?: string;
}

// =====================================================
// TOPIC COLORS
// =====================================================
const TOPIC_COLORS: Record<string, { bg: string; text: string }> = {
    [SpeakingTopic.DAILY_LIFE]: { bg: 'bg-blue-100', text: 'text-blue-700' },
    [SpeakingTopic.EDUCATION]: { bg: 'bg-purple-100', text: 'text-purple-700' },
    [SpeakingTopic.TECHNOLOGY]: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    [SpeakingTopic.ENVIRONMENT]: { bg: 'bg-green-100', text: 'text-green-700' },
    [SpeakingTopic.HEALTH]: { bg: 'bg-pink-100', text: 'text-pink-700' },
    [SpeakingTopic.CULTURE]: { bg: 'bg-orange-100', text: 'text-orange-700' },
    [SpeakingTopic.TRAVEL]: { bg: 'bg-teal-100', text: 'text-teal-700' },
    [SpeakingTopic.WORK_AND_CAREER]: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    [SpeakingTopic.SOCIAL_ISSUES]: { bg: 'bg-red-100', text: 'text-red-700' },
    [SpeakingTopic.HOBBIES_AND_INTERESTS]: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

const getTopicColor = (topic: SpeakingTopic) => {
    return TOPIC_COLORS[topic] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

// =====================================================
// SPEAKING EXAM CARD COMPONENT
// =====================================================
export function SpeakingExamCard({
    exam,
    variant = 'student',
    onEdit,
    onDelete,
    onPreview,
    className,
}: SpeakingExamCardProps) {
    const topicColor = getTopicColor(exam.topic);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={cn(
                    'h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300',
                    !exam.is_published && variant === 'admin' && 'opacity-70 border-dashed',
                    className
                )}
                hoverable
            >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                    {/* Thumbnail - có thể lấy từ video_url hoặc placeholder */}
                    {exam.thumbnail ?
                        <Image
                            src={exam.thumbnail}
                            alt={exam.title}
                            fill
                            className="object-cover"
                        /> :
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Play className="w-10 h-10 sm:w-12 sm:h-12 text-primary/50" />
                        </div>
                    }

                    {/* Duration Badge */}
                    <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white gap-1 text-xs">
                            <Clock className="w-3 h-3" />
                            {exam.estimated_duration_minutes} phút
                        </Badge>
                    </div>

                    {/* Publish Status (Admin only) */}
                    {variant === 'admin' && (
                        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                            {exam.is_published ? (
                                <Badge variant="success" className="gap-1 text-xs">
                                    <CheckCircle className="w-3 h-3" />
                                    Đã xuất bản
                                </Badge>
                            ) : (
                                <Badge variant="warning" className="gap-1 text-xs">
                                    <XCircle className="w-3 h-3" />
                                    Bản nháp
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Content - Compact padding on mobile */}
                <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-2">
                    <div className='flex justify-between'>
                        {/* Topic Tag */}
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                            <Badge
                                variant="outline"
                                className={cn('gap-1 text-xs', topicColor.bg, topicColor.text, 'border-none')}
                            >
                                <Tag className="w-3 h-3" />
                                {exam.topic}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground" >
                            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{exam.questions.length} câu hỏi</span>
                        </div>
                    </div>


                    <CardTitle className="text-base sm:text-lg line-clamp-1 min-h-[1.5rem] sm:min-h-[1.75rem]">
                        {exam.title}
                    </CardTitle>

                    {exam.description ? (
                        <CardDescription className="line-clamp-2 mt-1 text-xs sm:text-sm min-h-[2.5rem] sm:min-h-[2.8rem]">
                            {exam.description}
                        </CardDescription>
                    ) : <div className="mt-1 text-xs sm:text-sm min-h-[2.5rem] sm:min-h-[2.8rem]"></div>}
                </CardHeader>

                {/* <CardContent className="flex-1 p-3 sm:p-4 pt-0 pb-3 sm:pb-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{exam.questions.length} câu hỏi</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{exam.video_script.length} đoạn</span>
                        </div>
                    </div>
                </CardContent> */}

                {/* Footer Actions - Compact on mobile */}
                <CardFooter className="p-3 sm:p-4 !pt-0 gap-2">
                    {variant === 'student' ? (
                        // Student Actions
                        <Link href={`/giao-tiep/${exam._id}`} className="w-full">
                            <Button variant="default" className="w-full gap-2 h-9 sm:h-10 text-sm">
                                <Play className="w-4 h-4" />
                                Bắt đầu luyện tập
                            </Button>
                        </Link>
                    ) : (
                        // Admin Actions
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm"
                                onClick={() => onPreview?.(exam)}
                            >
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Xem
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm"
                                onClick={() => onEdit?.(exam)}
                            >
                                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Sửa
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-9 sm:w-9"
                                onClick={() => onDelete?.(exam)}
                            >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default SpeakingExamCard;
