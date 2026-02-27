/**
 * Khailingo - Profile Stats Section
 * Section hiển thị các thống kê học tập dạng cards
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiBook,
    FiMic,
    FiLayers,
    FiClock,
    FiZap,
    FiTrendingUp
} from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileStatsSkeleton } from './ProfileSkeleton';
import { cn } from '@/utils/cn';
import { useGetProfileStats } from '@/hooks';

// Dữ liệu mẫu khi API chưa có
const MOCK_STATS = {
    total_exams_taken: 24,
    total_speaking_practices: 18,
    total_flashcards_learned: 356,
    total_study_time_hours: 48,
    current_streak: 12,
    average_score: 75,
};

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    subtext?: string;
    color: string;
    bgColor: string;
    delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    label,
    value,
    subtext,
    color,
    bgColor,
    delay = 0
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
    >
        <Card
            variant="elevated"
            hoverable
            className="h-full border border-transparent hover:border-primary/20 transition-all"
        >
            <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn("p-2.5 rounded-xl", bgColor)}>
                        <Icon className={cn("w-5 h-5", color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {label}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">
                            {value}
                        </p>
                        {subtext && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {subtext}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export const ProfileStatsSection: React.FC = () => {
    const { data: statsData, isLoading } = useGetProfileStats();

    // Sử dụng mock data nếu API chưa có hoặc lỗi
    const stats = statsData?.stats || MOCK_STATS;

    if (isLoading) {
        return <ProfileStatsSkeleton />;
    }

    const statCards = [
        {
            icon: FiBook,
            label: 'Bài thi đã làm',
            value: stats.total_exams_taken,
            subtext: 'Full Tests',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            icon: FiMic,
            label: 'Luyện nói',
            value: stats.total_speaking_practices,
            subtext: 'Phiên luyện tập',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            icon: FiLayers,
            label: 'Flashcards',
            value: stats.total_flashcards_learned,
            subtext: 'Từ vựng đã học',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            icon: FiClock,
            label: 'Thời gian học',
            value: `${stats.total_study_time_hours}h`,
            subtext: 'Tổng cộng',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            icon: FiZap,
            label: 'Chuỗi ngày học',
            value: `${stats.current_streak}`,
            subtext: 'Ngày liên tiếp',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            icon: FiTrendingUp,
            label: 'Điểm trung bình',
            value: `${stats.average_score}%`,
            subtext: 'Accuracy',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
    ];

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Tổng quan học tập
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Thống kê hoạt động của bạn trên Khailingo
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {statCards.map((card, index) => (
                    <StatCard
                        key={card.label}
                        {...card}
                        delay={index * 0.05}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProfileStatsSection;
