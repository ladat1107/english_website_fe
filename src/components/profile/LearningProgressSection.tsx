/**
 * Khailingo - Learning Progress Section
 * Section hiển thị tiến độ theo từng kỹ năng
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiHeadphones,
    FiBookOpen,
    FiEdit3,
    FiMic,
    FiArrowRight
} from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useGetProfileStats } from '@/hooks/use-user';
import { ProfileProgressSkeleton } from './ProfileSkeleton';
import { SkillEnum } from '@/utils/constants/enum';
import { cn } from '@/utils/cn';
import Link from 'next/link';

// Mock data cho skills progress
const MOCK_SKILL_PROGRESS = [
    {
        skill: SkillEnum.LISTENING,
        progress: 65,
        total_practices: 45,
        average_score: 72,
        last_practiced: '2024-01-15',
    },
    {
        skill: SkillEnum.READING,
        progress: 78,
        total_practices: 32,
        average_score: 80,
        last_practiced: '2024-01-14',
    },
    {
        skill: SkillEnum.WRITING,
        progress: 45,
        total_practices: 15,
        average_score: 68,
        last_practiced: '2024-01-10',
    },
    {
        skill: SkillEnum.SPEAKING,
        progress: 55,
        total_practices: 28,
        average_score: 65,
        last_practiced: '2024-01-13',
    },
];

// Skill configuration
const SKILL_CONFIG: Record<SkillEnum, {
    icon: React.ElementType;
    label: string;
    color: string;
    bgColor: string;
    href: string;
    variant: 'default' | 'success' | 'warning' | 'danger';
}> = {
    [SkillEnum.LISTENING]: {
        icon: FiHeadphones,
        label: 'Listening',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        href: '/luyen-thi-ielts/listening',
        variant: 'default',
    },
    [SkillEnum.READING]: {
        icon: FiBookOpen,
        label: 'Reading',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        href: '/luyen-thi-ielts/reading',
        variant: 'success',
    },
    [SkillEnum.WRITING]: {
        icon: FiEdit3,
        label: 'Writing',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        href: '/luyen-thi-ielts/writing',
        variant: 'warning',
    },
    [SkillEnum.SPEAKING]: {
        icon: FiMic,
        label: 'Speaking',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        href: '/giao-tiep',
        variant: 'default',
    },
};

interface SkillProgressCardProps {
    skill: SkillEnum;
    progress: number;
    totalPractices: number;
    averageScore: number;
    delay?: number;
}

const SkillProgressCard: React.FC<SkillProgressCardProps> = ({
    skill,
    progress,
    totalPractices,
    averageScore,
    delay = 0,
}) => {
    const config = SKILL_CONFIG[skill];
    const Icon = config.icon;

    // Determine progress variant based on score
    const getProgressVariant = () => {
        if (progress >= 75) return 'success';
        if (progress >= 50) return 'warning';
        return 'danger';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <Card
                variant="bordered"
                hoverable
                className="h-full group hover:border-primary/30"
            >
                <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", config.bgColor)}>
                                <Icon className={cn("w-5 h-5", config.color)} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    {config.label}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {totalPractices} bài luyện tập
                                </p>
                            </div>
                        </div>

                        {/* Score Badge */}
                        <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">
                                {averageScore}%
                            </p>
                            <p className="text-xs text-muted-foreground">Điểm TB</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                            <span>Tiến độ</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress
                            value={progress}
                            variant={getProgressVariant()}
                            size="md"
                            className="h-2"
                        />
                    </div>

                    {/* Action */}
                    <Link href={config.href}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full group-hover:bg-primary/10"
                        >
                            Luyện tập ngay
                            <FiArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export const LearningProgressSection: React.FC = () => {
    const { data: statsData, isLoading } = useGetProfileStats();

    // Sử dụng mock data nếu API chưa có
    const skillProgress = statsData?.skill_progress || MOCK_SKILL_PROGRESS;

    if (isLoading) {
        return <ProfileProgressSkeleton />;
    }

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Tiến độ theo kỹ năng
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Theo dõi sự tiến bộ của bạn trong từng kỹ năng
                    </p>
                </div>

                <Link href="/luyen-thi-ielts">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        Xem thêm
                        <FiArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {skillProgress.map((item, index) => (
                    <SkillProgressCard
                        key={item.skill}
                        skill={item.skill as SkillEnum}
                        progress={item.progress}
                        totalPractices={item.total_practices}
                        averageScore={item.average_score}
                        delay={index * 0.1}
                    />
                ))}
            </div>
        </section>
    );
};

export default LearningProgressSection;
