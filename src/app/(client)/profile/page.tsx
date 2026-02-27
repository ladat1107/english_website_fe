/**
 * Khailingo - Profile Page
 * Trang thông tin cá nhân người dùng
 * Client Component - Hiển thị thông tin user và thống kê học tập
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts';
import { ANIMATION_VARIANTS } from '@/utils/constants';

// Components
import {
    ProfileHeroSection,
    ProfileStatsSection,
    LearningProgressSection,
    RecentActivitySection,
    AchievementsSection,
    ProfileSettingsSection,
} from '@/components/profile';
import { ProfilePageSkeleton } from '@/components/profile/ProfileSkeleton';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Loading state
    if (isLoading) {
        return <ProfilePageSkeleton />;
    }

    // Chưa đăng nhập
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            {/* Hero Section với thông tin user */}
            <ProfileHeroSection user={user} />

            {/* Main Content */}
            <div className="container-custom py-8 sm:py-12">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={{
                        animate: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                    className="space-y-8 sm:space-y-12"
                >
                    {/* Stats Cards */}
                    <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                        <ProfileStatsSection />
                    </motion.div>

                    {/* Learning Progress by Skills */}
                    <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                        <LearningProgressSection />
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                        <RecentActivitySection />
                    </motion.div>

                    {/* Achievements */}
                    <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                        <AchievementsSection />
                    </motion.div>

                    {/* Settings */}
                    <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                        <ProfileSettingsSection user={user} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
