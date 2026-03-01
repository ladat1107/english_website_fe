/**
 * Khailingo - Admin User Edit Page
 * Trang chỉnh sửa thông tin người dùng (Admin)
 */

"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    User,
    Save,
    Loader2,
} from "lucide-react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Avatar,
    Input,
} from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import { UserRole, ProficiencyLevel, ExamType, SkillEnum } from "@/utils/constants/enum";
import { useGetUserById, useUpdateUser } from "@/hooks";
import { defaultEditUserFormData, EditUserFormData, editUserSchema, UserType } from "@/types/user.type";
import LoadingCustom from "@/components/ui/loading-custom";
import { examOptions, levelOptions, roleOptions, skillOptions } from "@/utils/constants/select";


export default function AdminUserEditPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();

    const userId = params.id as string;
    const { data: userRes, isLoading } = useGetUserById(userId);
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    const user: UserType = userRes?.data;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: defaultEditUserFormData,
    });

    // Load user data vào form
    useEffect(() => {
        if (user) {
            console.log("User data loaded:", user);
            reset({
                full_name: user.full_name,
                role: user.role as UserRole,
                current_level: user?.current_level as ProficiencyLevel || null,
                target_exam: user?.target_exam || null,
                target_score: user?.target_score || null,
                target_date: user?.target_date || null,
                learning_goals: user?.learning_goals || [],
            });
        }
    }, [user, reset]);

    const selectedRole = watch("role");
    const selectedSkills = watch("learning_goals") || [];

    const toggleSkill = (skill: SkillEnum) => {
        const current = selectedSkills;
        if (current.includes(skill)) {
            setValue(
                "learning_goals",
                current.filter((s) => s !== skill)
            );
        } else {
            setValue("learning_goals", [...current, skill]);
        }
    };

    const onSubmit = (data: EditUserFormData) => {
        updateUser(
            { id: userId, data },
            {
                onSuccess: () => {
                    addToast("Cập nhật thông tin thành công", "success");
                    router.push(`/quan-ly/nguoi-dung/${userId}`);
                },
                onError: () => {
                    addToast("Có lỗi xảy ra khi cập nhật", "error");
                },
            }
        );
    };

    if (isLoading) {
        return <LoadingCustom />;
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-semibold mb-2">Không tìm thấy người dùng</h3>
                    <p className="text-muted-foreground mb-4">
                        Người dùng này có thể đã bị xóa hoặc không tồn tại.
                    </p>
                    <Link href="/quan-ly/nguoi-dung">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại danh sách
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    {/* Back Button */}
                    <Link href={`/quan-ly/nguoi-dung/${userId}`}>
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    </Link>

                    {/* Header Info */}
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                            {user.avatar_url ? (
                                <Image
                                    src={user.avatar_url}
                                    alt={user.full_name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-bold text-xl">
                                        {user.full_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </Avatar>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-foreground">
                                Chỉnh sửa tài khoản
                            </h1>
                            <p className="text-muted-foreground text-sm">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="container mx-auto px-4 py-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin cơ bản</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Họ và tên *</Label>
                                        <Input
                                            id="full_name"
                                            {...register("full_name")}
                                            placeholder="Nhập họ và tên"
                                        />
                                        {errors.full_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.full_name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email (readonly) */}
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={user.email}
                                            disabled
                                            className="bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Email không thể thay đổi
                                        </p>
                                    </div>

                                    {/* Role */}
                                    <div className="space-y-2">
                                        <Label>Vai trò *</Label>
                                        <Select
                                            key={selectedRole}
                                            value={selectedRole}
                                            onValueChange={(value) =>
                                                setValue("role", value as UserRole)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn vai trò" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roleOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Current Level */}
                                    <div className="space-y-2">
                                        <Label>Trình độ hiện tại</Label>
                                        <Select
                                            key={watch('current_level')}
                                            value={watch("current_level") ?? undefined}
                                            onValueChange={(value) =>
                                                setValue("current_level", value as ProficiencyLevel)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trình độ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {levelOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Learning Goals */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mục tiêu học tập</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Target Exam */}
                                    <div className="space-y-2">
                                        <Label>Kỳ thi mục tiêu</Label>
                                        <Select
                                            key={watch("target_exam") || "none"}
                                            value={watch("target_exam") || "none"}
                                            onValueChange={(value) =>
                                                setValue(
                                                    "target_exam",
                                                    value === "none" ? null : (value as ExamType)
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn kỳ thi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Không chọn</SelectItem>
                                                {examOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Target Score */}
                                    <div className="space-y-2">
                                        <Label htmlFor="target_score">Điểm mục tiêu</Label>
                                        <Input
                                            id="target_score"
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="990"
                                            {...register("target_score", {
                                                valueAsNumber: true,
                                            })}
                                            placeholder="Nhập điểm mục tiêu"
                                        />
                                    </div>

                                    {/* Target Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="target_date">Ngày mục tiêu</Label>
                                        <Input
                                            id="target_date"
                                            type="date"
                                            {...register("target_date")}
                                        />
                                    </div>

                                    {/* Learning Goals */}
                                    <div className="space-y-2">
                                        <Label>Kỹ năng cần cải thiện</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {skillOptions.map((skill) => (
                                                <button
                                                    key={skill.value}
                                                    type="button"
                                                    onClick={() => toggleSkill(skill.value)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedSkills.includes(skill.value)
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background border-border hover:bg-accent"
                                                        }`}
                                                >
                                                    {skill.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                            <Link href={`/quan-ly/nguoi-dung/${userId}`}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    Hủy
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full sm:w-auto gap-2"
                            >
                                {isUpdating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
