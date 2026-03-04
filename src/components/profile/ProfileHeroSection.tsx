"use client";

import React, { useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    FiUser,
    FiMail,
    FiCalendar,
    FiTarget,
    FiAward,
    FiEdit3
} from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { UserType } from '@/types/user.type';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useCloudinaryUpload, useUpdateProfile } from '@/hooks';
import { CloudinaryFolder } from '@/lib/cloudinary';
import { useToast } from '../ui/toaster';
import { Loader2 } from 'lucide-react';

dayjs.locale('vi');

interface ProfileHeroSectionProps {
    user: UserType;
}

export const ProfileHeroSection: React.FC<ProfileHeroSectionProps> = ({ user }) => {

    const { mutate: updateProfileMutation } = useUpdateProfile();
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const {
        isUploading,
        uploadImage,
    } = useCloudinaryUpload({
        folder: CloudinaryFolder.USER_AVATARS,
        onSuccess: (result) => {
            if (result?.secureUrl) {
                updateProfileMutation({ avatar_url: result.secureUrl }, {
                    onSuccess: () => {
                        addToast("Cập nhật ảnh đại diện thành công", "success");
                    }
                })
            }
        },
        onError: (error) => {
            console.error("Cloudinary upload error:", error);
            addToast("Xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.", "error");
        },
    });
    const handleClickAvatar = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    const handleChangeFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await uploadImage(file);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [uploadImage,]);
    // Format ngày tham gia
    const joinDate = user.createdAt
        ? dayjs(user.createdAt).format('DD [tháng] MM, YYYY')
        : 'Chưa xác định';

    return (
        <section className="relative overflow-hidden">
            {/* Background với gradient và blur effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-background" />

            {/* Decorative circles */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-0 left-10 w-56 h-56 rounded-full bg-accent/15 blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, 10, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-primary/5 blur-2xl hidden lg:block"
            />

            {/* Content */}
            <div className="relative container-custom pt-8 sm:pt-12 pb-20 sm:pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
                >
                    {/* Avatar với ring effect */}
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />

                        {/* Avatar container */}
                        <div
                            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-xl overflow-hidden bg-primary/10 cursor-pointer group"
                        >
                            {user.avatar_url ? (
                                <Image
                                    src={user.avatar_url}
                                    alt={user.full_name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FiUser className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
                                </div>
                            )}

                            {/* Hover effect nhẹ */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                            {/* Loading Overlay */}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}

                            {/* Input ẩn */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleChangeFile}
                                disabled={isUploading}
                            />
                        </div>

                        {/* Edit button overlay */}
                        <button
                            onClick={handleClickAvatar}
                            className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-border"
                            aria-label="Thay đổi ảnh đại diện"
                        >
                            <FiEdit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="text-center sm:text-left flex-1">
                        {/* Name */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                            {user.full_name}
                        </h1>

                        {/* Email */}
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-4">
                            <FiMail className="w-4 h-4" />
                            <span className="text-sm sm:text-base">{user.email}</span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                            {/* Role Badge */}
                            <Badge variant="ghost" className="capitalize">
                                <FiUser className="w-3 h-3 mr-1" />
                                {user.role || 'Học viên'}
                            </Badge>

                            {/* Join Date */}
                            <Badge variant="secondary">
                                <FiCalendar className="w-3 h-3 mr-1" />
                                Tham gia: {joinDate}
                            </Badge>
                        </div>

                        {/* Quick Stats - visible on larger screens */}
                        <div className="hidden md:flex items-center gap-6 pt-4 border-t border-border/50">
                            <QuickStat icon={FiTarget} label="Mục tiêu" value="IELTS 7.0" />
                            <QuickStat icon={FiAward} label="Chuỗi học" value="12 ngày" />
                        </div>
                    </div>

                    {/* Action Buttons - Desktop */}
                    <div className="hidden lg:block absolute right-0 top-10 pointer-events-none opacity-40">
                        <svg
                            width="420"
                            height="420"
                            viewBox="0 0 420 420"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="profileRed" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#fecaca" />
                                    <stop offset="100%" stopColor="#f87171" />
                                </linearGradient>
                            </defs>

                            {/* Outer Circle */}
                            <circle
                                cx="210"
                                cy="210"
                                r="170"
                                stroke="url(#profileRed)"
                                strokeWidth="2"
                                opacity="0.5"
                            />

                            {/* User Head */}
                            <circle
                                cx="210"
                                cy="170"
                                r="55"
                                fill="url(#profileRed)"
                                opacity="0.6"
                            />

                            {/* User Body */}
                            <path
                                d="M130 290C150 250 190 230 210 230C230 230 270 250 290 290"
                                stroke="#f87171"
                                strokeWidth="6"
                                strokeLinecap="round"
                                opacity="0.6"
                            />

                            {/* Data Dots */}
                            <circle cx="80" cy="210" r="6" fill="#fca5a5" />
                            <circle cx="340" cy="210" r="6" fill="#fca5a5" />
                            <circle cx="210" cy="60" r="6" fill="#fca5a5" />
                            <circle cx="210" cy="360" r="6" fill="#fca5a5" />
                        </svg>
                    </div>
                </motion.div>
            </div>

            {/* Wave decoration at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-8 sm:h-12"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 30 1440 40V60H0Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    );
};

// Quick stat component
interface QuickStatProps {
    icon: React.ElementType;
    label: string;
    value: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    </div>
);

export default ProfileHeroSection;
