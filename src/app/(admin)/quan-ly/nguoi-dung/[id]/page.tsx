/**
 * Khailingo - Admin User Detail Page
 * Trang xem chi tiết thông tin người dùng (Admin)
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    Target,
    BookOpen,
    Award,
    Edit,
    Trash2,
    Shield,
    GraduationCap,
    UserCheck,
    Clock,
} from "lucide-react";
import {
    Button,
    Card,
    Avatar,
} from "@/components/ui";
import { useConfirmDialogContext } from "@/components/ui/confirm-dialog-context";
import { useToast } from "@/components/ui/toaster";
import { cn } from "@/utils/cn";
import { UserRole, ProficiencyLevel, SkillEnum } from "@/utils/constants/enum";
import dayjs from "dayjs";
import { useDeleteUser, useGetUserById } from "@/hooks";
import { UserType } from "@/types/user.type";
import LoadingCustom from "@/components/ui/loading-custom";


const getRoleInfo = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return { variant: "destructive" as const, label: "Quản trị viên", icon: Shield, bgColor: "bg-red-500", textColor: "text-white" };
        case UserRole.TEACHER:
            return { variant: "info" as const, label: "Giáo viên", icon: GraduationCap, bgColor: "bg-blue-500", textColor: "text-white" };
        default:
            return { variant: "secondary" as const, label: "Học viên", icon: UserCheck, bgColor: "bg-emerald-500", textColor: "text-white" };
    }
};

const getLevelInfo = (level?: ProficiencyLevel) => {
    if (!level) return null;
    const levels: Record<ProficiencyLevel, { bg: string; text: string }> = {
        [ProficiencyLevel.BEGINNER]: { bg: "bg-slate-500", text: "text-white" },
        [ProficiencyLevel.ELEMENTARY]: { bg: "bg-green-500", text: "text-white" },
        [ProficiencyLevel.INTERMEDIATE]: { bg: "bg-blue-500", text: "text-white" },
        [ProficiencyLevel.UPPER_INTERMEDIATE]: { bg: "bg-purple-500", text: "text-white" },
        [ProficiencyLevel.ADVANCED]: { bg: "bg-orange-500", text: "text-white" },
    };
    return levels[level];
};

const getSkillInfo = (skill: SkillEnum) => {
    const skills: Record<SkillEnum, { label: string; color: string }> = {
        [SkillEnum.SPEAKING]: { label: "Nói", color: "bg-rose-100 text-rose-700 border-rose-200" },
        [SkillEnum.LISTENING]: { label: "Nghe", color: "bg-violet-100 text-violet-700 border-violet-200" },
        [SkillEnum.READING]: { label: "Đọc", color: "bg-amber-100 text-amber-700 border-amber-200" },
        [SkillEnum.WRITING]: { label: "Viết", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    };
    return skills[skill];
};

export default function AdminUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { confirm } = useConfirmDialogContext();
    const { addToast } = useToast();

    const userId = params.id as string;
    const { data: userRes, isLoading, error } = useGetUserById(userId);
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    const user: UserType | undefined = userRes?.data;

    const handleDelete = () => {
        if (!user) return;
        confirm({
            title: "Xác nhận xóa tài khoản",
            description: `Bạn có chắc chắn muốn xóa tài khoản "${user.full_name}" không? Hành động này không thể hoàn tác.`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                deleteUser(user._id, {
                    onSuccess: () => {
                        addToast("Xóa tài khoản thành công", "success");
                        router.push("/quan-ly/nguoi-dung");
                    },
                    onError: () => {
                        addToast("Có lỗi xảy ra khi xóa tài khoản", "error");
                    },
                });
            },
        });
    };

    if (isLoading) {
        return <LoadingCustom />;
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-sm w-full">
                    <User className="w-14 h-14 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="font-semibold mb-2">Không tìm thấy người dùng</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Người dùng này có thể đã bị xóa hoặc không tồn tại.
                    </p>
                    <Link href="/quan-ly/nguoi-dung">
                        <Button size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const roleInfo = getRoleInfo(user.role);
    const levelInfo = getLevelInfo(user.current_level as ProficiencyLevel);
    const RoleIcon = roleInfo.icon;

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    {/* Back Button */}
                    <Link href="/quan-ly/nguoi-dung">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Quay lại
                        </Button>
                    </Link>

                    {/* User Profile Header */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                                {user.avatar_url ? (
                                    <Image
                                        src={user.avatar_url}
                                        alt={user.full_name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </Avatar>
                            {/* Role Badge on Avatar */}
                            <span className={cn(
                                "absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md",
                                roleInfo.bgColor
                            )}>
                                <RoleIcon className="w-4 h-4 text-white" />
                            </span>
                        </motion.div>

                        {/* Info & Actions */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                        >
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                                    {user.full_name}
                                </h1>
                                <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </p>
                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                                        roleInfo.bgColor, roleInfo.textColor
                                    )}>
                                        <RoleIcon className="w-3.5 h-3.5" />
                                        {roleInfo.label}
                                    </span>
                                    {levelInfo && (
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-semibold",
                                            levelInfo.bg, levelInfo.text
                                        )}>
                                            {user.current_level}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Link href={`/quan-ly/nguoi-dung/chinh-sua/${user._id}`}>
                                    <Button size="sm" variant="outline" className="gap-1.5">
                                        <Edit className="w-4 h-4" />
                                        <span className="hidden sm:inline">Sửa</span>
                                    </Button>
                                </Link>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="gap-1.5"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Xóa</span>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-5">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Account Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-3 border-b">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Thông tin tài khoản
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {/* Name & Email (grouped) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Họ và tên</p>
                                        <p className="font-medium text-foreground">{user.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Vai trò</p>
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                                            roleInfo.bgColor, roleInfo.textColor
                                        )}>
                                            <RoleIcon className="w-3 h-3" />
                                            {roleInfo.label}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                                    <p className="font-medium text-foreground text-sm break-all">{user.email}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Trình độ hiện tại</p>
                                    {levelInfo ? (
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-xs font-medium",
                                            levelInfo.bg, levelInfo.text
                                        )}>
                                            {user.current_level}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Chưa thiết lập</span>
                                    )}
                                </div>

                                {/* Dates (grouped) */}
                                <div className="pt-2 border-t border-border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-start gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tham gia</p>
                                                <p className="text-sm font-medium">{dayjs(user.createdAt).format("DD/MM/YYYY")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Cập nhật</p>
                                                <p className="text-sm font-medium">{dayjs(user.updatedAt).format("DD/MM/YYYY")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Learning Goals Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 px-4 py-3 border-b">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Target className="w-4 h-4 text-amber-600" />
                                    Mục tiêu học tập
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {/* Target Exam & Score (grouped) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Kỳ thi mục tiêu</p>
                                        {user.target_exam ? (
                                            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-0.5 rounded text-xs font-semibold">
                                                <BookOpen className="w-3 h-3" />
                                                {user.target_exam}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Chưa đặt</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Điểm mục tiêu</p>
                                        {user.target_score ? (
                                            <span className="text-lg font-bold text-foreground">
                                                {user.target_score}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Chưa đặt</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Ngày mục tiêu</p>
                                    {user.target_date ? (
                                        <p className="font-medium text-foreground flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {dayjs(user.target_date).format("DD/MM/YYYY")}
                                        </p>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Chưa đặt</span>
                                    )}
                                </div>

                                {/* Skills */}
                                <div className="pt-2 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5" />
                                        Kỹ năng cần cải thiện
                                    </p>
                                    {user.learning_goals && user.learning_goals.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.learning_goals.map((skill) => {
                                                const skillInfo = getSkillInfo(skill);
                                                return (
                                                    <span
                                                        key={skill}
                                                        className={cn(
                                                            "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                            skillInfo.color
                                                        )}
                                                    >
                                                        {skillInfo.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Chưa thiết lập</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
