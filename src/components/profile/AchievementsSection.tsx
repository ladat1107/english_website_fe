/**
 * Khailingo - Achievements Section
 * Section hiển thị các huy hiệu và thành tích
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiAward,
    FiStar,
    FiZap,
    FiTarget,
    FiTrendingUp,
    FiBook,
    FiMic,
    FiCalendar,
    FiLock
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetAchievements } from '@/hooks/use-user';
import { Achievement } from '@/types/profile.type';
import { cn } from '@/utils/cn';

// Mock achievements data
const MOCK_ACHIEVEMENTS: Achievement[] = [
    {
        id: '1',
        title: 'Người mới bắt đầu',
        description: 'Hoàn thành bài thi đầu tiên',
        icon: 'star',
        unlocked: true,
        unlocked_at: '2024-01-05T10:00:00Z',
    },
    {
        id: '2',
        title: 'Siêng năng',
        description: 'Học liên tục 7 ngày',
        icon: 'zap',
        unlocked: true,
        unlocked_at: '2024-01-12T08:00:00Z',
    },
    {
        id: '3',
        title: 'Bookworm',
        description: 'Hoàn thành 10 bài Reading',
        icon: 'book',
        unlocked: true,
        unlocked_at: '2024-01-10T14:30:00Z',
    },
    {
        id: '4',
        title: 'Chuỗi 30 ngày',
        description: 'Học liên tục 30 ngày',
        icon: 'calendar',
        unlocked: false,
        progress: 40, // 12/30
    },
    {
        id: '5',
        title: 'Vua Speaking',
        description: 'Hoàn thành 50 bài luyện nói',
        icon: 'mic',
        unlocked: false,
        progress: 36, // 18/50
    },
    {
        id: '6',
        title: 'IELTS 7.0+',
        description: 'Đạt điểm IELTS tổng 7.0 trở lên',
        icon: 'target',
        unlocked: false,
        progress: 85,
    },
];

// Icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
    'star': FiStar,
    'zap': FiZap,
    'book': FiBook,
    'mic': FiMic,
    'target': FiTarget,
    'calendar': FiCalendar,
    'trending': FiTrendingUp,
    'award': FiAward,
};

interface AchievementCardProps {
    achievement: Achievement;
    delay?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, delay = 0 }) => {
    const Icon = ICON_MAP[achievement.icon] || FiAward;
    const isUnlocked = achievement.unlocked;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
        >
            <div
                className={cn(
                    "relative p-4 rounded-xl border transition-all overflow-hidden",
                    isUnlocked
                        ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm"
                        : "bg-secondary/30 border-border"
                )}
            >
                {/* Shine effect for unlocked */}
                {isUnlocked && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -inset-1/4 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-12 animate-shine" />
                    </div>
                )}

                <div className="relative flex items-start gap-3">
                    {/* Icon */}
                    <div
                        className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                            isUnlocked
                                ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        {isUnlocked ? (
                            <Icon className="w-6 h-6" />
                        ) : (
                            <FiLock className="w-5 h-5" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4
                            className={cn(
                                "font-semibold truncate",
                                isUnlocked ? "text-amber-800" : "text-muted-foreground"
                            )}
                        >
                            {achievement.title}
                        </h4>
                        <p
                            className={cn(
                                "text-xs mt-0.5",
                                isUnlocked ? "text-amber-600" : "text-muted-foreground/80"
                            )}
                        >
                            {achievement.description}
                        </p>

                        {/* Progress for locked */}
                        {!isUnlocked && achievement.progress !== undefined && (
                            <div className="mt-2">
                                <Progress
                                    value={achievement.progress}
                                    size="sm"
                                    className="h-1.5"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {achievement.progress}% hoàn thành
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const AchievementsSection: React.FC = () => {
    const { data: achievements, isLoading } = useGetAchievements();

    // Sử dụng mock data nếu API chưa có
    const achievementsList = achievements ?? MOCK_ACHIEVEMENTS;

    // Tách thành unlocked và locked
    const unlockedAchievements = achievementsList.filter((a) => a.unlocked);
    const lockedAchievements = achievementsList.filter((a) => !a.unlocked);

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Thành tích
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Mở khóa các huy hiệu khi hoàn thành mục tiêu
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-sm">
                    <FiAward className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-foreground">
                        {unlockedAchievements.length}/{achievementsList.length}
                    </span>
                </div>
            </div>

            <Card variant="bordered">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FiAward className="w-5 h-5 text-amber-500" />
                        Huy hiệu của bạn
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-24 rounded-xl bg-muted animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Unlocked Achievements */}
                            {unlockedAchievements.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <FiStar className="w-4 h-4 text-amber-500" />
                                        Đã mở khóa ({unlockedAchievements.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {unlockedAchievements.map((achievement, index) => (
                                            <AchievementCard
                                                key={achievement.id}
                                                achievement={achievement}
                                                delay={index * 0.1}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Locked Achievements */}
                            {lockedAchievements.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <FiLock className="w-4 h-4" />
                                        Chưa mở khóa ({lockedAchievements.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {lockedAchievements.map((achievement, index) => (
                                            <AchievementCard
                                                key={achievement.id}
                                                achievement={achievement}
                                                delay={index * 0.05}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {achievementsList.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FiAward className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Chưa có thành tích nào</p>
                                    <p className="text-sm mt-1">
                                        Bắt đầu học để mở khóa các huy hiệu!
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
};

export default AchievementsSection;
