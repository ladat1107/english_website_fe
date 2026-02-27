/**
 * Khailingo - Profile Settings Section
 * Section chỉnh sửa thông tin cá nhân và mục tiêu học tập
 */

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    FiUser,
    FiTarget,
    FiCalendar,
    FiEdit3,
    FiSave,
    FiX,
    FiUpload,
    FiCheck
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/use-user';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { useToast } from '@/components/ui/toaster';
import { UserType } from '@/types/user.type';
import { UpdateProfileForm } from '@/types/profile.type';
import { ExamType, ProficiencyLevel, SkillEnum } from '@/utils/constants/enum';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts';

interface ProfileSettingsSectionProps {
    user: UserType;
}

// Exam type options
const EXAM_TYPE_OPTIONS = [
    { value: ExamType.IELTS, label: 'IELTS' },
    { value: ExamType.TOEIC, label: 'TOEIC' },
    { value: ExamType.TOEFL, label: 'TOEFL' },
];

// Proficiency level options
const LEVEL_OPTIONS = [
    { value: ProficiencyLevel.BEGINNER, label: 'Beginner - Mới bắt đầu' },
    { value: ProficiencyLevel.ELEMENTARY, label: 'Elementary - Cơ bản' },
    { value: ProficiencyLevel.INTERMEDIATE, label: 'Intermediate - Trung cấp' },
    { value: ProficiencyLevel.UPPER_INTERMEDIATE, label: 'Upper-Intermediate - Trung cao cấp' },
    { value: ProficiencyLevel.ADVANCED, label: 'Advanced - Nâng cao' },
];

// Skill options
const SKILL_OPTIONS = [
    { value: SkillEnum.LISTENING, label: 'Listening' },
    { value: SkillEnum.READING, label: 'Reading' },
    { value: SkillEnum.WRITING, label: 'Writing' },
    { value: SkillEnum.SPEAKING, label: 'Speaking' },
];

// Target score options based on exam type
const TARGET_SCORE_OPTIONS: Record<string, { value: number; label: string }[]> = {
    IELTS: [
        { value: 5.0, label: '5.0' },
        { value: 5.5, label: '5.5' },
        { value: 6.0, label: '6.0' },
        { value: 6.5, label: '6.5' },
        { value: 7.0, label: '7.0' },
        { value: 7.5, label: '7.5' },
        { value: 8.0, label: '8.0' },
        { value: 8.5, label: '8.5' },
        { value: 9.0, label: '9.0' },
    ],
    TOEIC: [
        { value: 450, label: '450+' },
        { value: 550, label: '550+' },
        { value: 650, label: '650+' },
        { value: 750, label: '750+' },
        { value: 850, label: '850+' },
        { value: 900, label: '900+' },
    ],
    TOEFL: [
        { value: 60, label: '60+' },
        { value: 80, label: '80+' },
        { value: 90, label: '90+' },
        { value: 100, label: '100+' },
        { value: 110, label: '110+' },
    ],
};

export const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({ user }) => {
    const { addToast } = useToast();
    const { checkAuthStatus } = useAuth();
    const updateProfileMutation = useUpdateProfile();
    const uploadAvatarMutation = useUploadAvatar();
    const { uploadImage, isUploading } = useCloudinaryUpload();

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState<UpdateProfileForm>({
        full_name: user.full_name || '',
        target_exam: user.target_exam,
        target_score: user.target_score,
        current_level: user.current_level,
        target_date: user.target_date || '',
        learning_goals: user.learning_goals || [],
    });

    // Reset form when user changes
    useEffect(() => {
        setFormData({
            full_name: user.full_name || '',
            target_exam: user.target_exam,
            target_score: user.target_score,
            current_level: user.current_level,
            target_date: user.target_date || '',
            learning_goals: user.learning_goals || [],
        });
    }, [user]);

    // Handle form submit
    const handleSubmit = async () => {
        try {
            await updateProfileMutation.mutateAsync(formData);
            await checkAuthStatus();
            setIsEditing(false);
            addToast("Cập nhật thành công", "success");
        } catch (error) {
            console.log(error);
            addToast("Xảy ra lỗi", "error")
        }
    };

    // Handle avatar upload
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await uploadImage(file);
            if (result?.secureUrl) {
                await uploadAvatarMutation.mutateAsync(result.secureUrl);
                await checkAuthStatus();
                addToast("Thành công", "success")
            }
        } catch (error) {
            console.log(error);
            addToast("Xảy ra lỗi", "error")
        }
    };

    // Toggle learning goal
    const toggleLearningGoal = (skill: SkillEnum) => {
        const currentGoals = formData.learning_goals || [];
        const newGoals = currentGoals.includes(skill)
            ? currentGoals.filter(g => g !== skill)
            : [...currentGoals, skill];
        setFormData({ ...formData, learning_goals: newGoals });
    };

    // Get target scores based on selected exam type
    const targetScoreOptions = formData.target_exam
        ? TARGET_SCORE_OPTIONS[formData.target_exam] || []
        : [];

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Cài đặt hồ sơ
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Quản lý thông tin cá nhân và mục tiêu học tập
                    </p>
                </div>

                {!isEditing ? (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                    >
                        <FiEdit3 className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                        >
                            <FiX className="w-4 h-4 mr-2" />
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={updateProfileMutation.isPending}
                        >
                            <FiSave className="w-4 h-4 mr-2" />
                            {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Personal Info Card */}
                <Card variant="bordered">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FiUser className="w-5 h-5 text-primary" />
                            Thông tin cá nhân
                        </CardTitle>
                        <CardDescription>
                            Thông tin cơ bản của tài khoản
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10">
                                    {user.avatar_url ? (
                                        <Image
                                            src={user.avatar_url}
                                            alt={user.full_name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiUser className="w-8 h-8 text-primary" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                                        <FiUpload className="w-3 h-3" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Ảnh đại diện</p>
                                {isEditing && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Click vào icon để thay đổi
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Họ và tên
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Nhập họ và tên"
                                />
                            ) : (
                                <p className="text-foreground">{user.full_name}</p>
                            )}
                        </div>

                        {/* Email (readonly) */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Email
                            </label>
                            <p className="text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Email không thể thay đổi
                            </p>
                        </div>

                        {/* Current Level */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Trình độ hiện tại
                            </label>
                            {isEditing ? (
                                <Select
                                    value={formData.current_level}
                                    onValueChange={(value) => setFormData({ ...formData, current_level: value as ProficiencyLevel })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trình độ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LEVEL_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge variant="secondary">
                                    {user.current_level || 'Chưa thiết lập'}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Goals Card */}
                <Card variant="bordered">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FiTarget className="w-5 h-5 text-primary" />
                            Mục tiêu học tập
                        </CardTitle>
                        <CardDescription>
                            Thiết lập mục tiêu để theo dõi tiến độ
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Target Exam */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Kỳ thi mục tiêu
                            </label>
                            {isEditing ? (
                                <Select
                                    value={formData.target_exam}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        target_exam: value as ExamType,
                                        target_score: undefined // Reset score when exam changes
                                    })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn kỳ thi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EXAM_TYPE_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge variant="ghost">
                                    {user.target_exam || 'Chưa thiết lập'}
                                </Badge>
                            )}
                        </div>

                        {/* Target Score */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Điểm mục tiêu
                            </label>
                            {isEditing ? (
                                <Select
                                    value={formData.target_score?.toString()}
                                    onValueChange={(value) => setFormData({ ...formData, target_score: parseFloat(value) })}
                                    disabled={!formData.target_exam}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={formData.target_exam ? "Chọn điểm mục tiêu" : "Chọn kỳ thi trước"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {targetScoreOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <span className="text-foreground">
                                    {user.target_score || 'Chưa thiết lập'}
                                </span>
                            )}
                        </div>

                        {/* Target Date */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Ngày thi dự kiến
                            </label>
                            {isEditing ? (
                                <Input
                                    type="date"
                                    value={formData.target_date?.split('T')[0] || ''}
                                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                                />
                            ) : (
                                <span className="text-foreground flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4 text-muted-foreground" />
                                    {user.target_date
                                        ? new Date(user.target_date).toLocaleDateString('vi-VN')
                                        : 'Chưa thiết lập'
                                    }
                                </span>
                            )}
                        </div>

                        {/* Learning Goals (Skills to focus) */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Kỹ năng muốn cải thiện
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SKILL_OPTIONS.map(skill => {
                                    const isSelected = formData.learning_goals?.includes(skill.value);
                                    return (
                                        <button
                                            key={skill.value}
                                            type="button"
                                            onClick={() => isEditing && toggleLearningGoal(skill.value)}
                                            disabled={!isEditing}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                                                isSelected
                                                    ? "bg-primary text-white"
                                                    : "bg-secondary text-muted-foreground",
                                                isEditing && "hover:bg-primary/80 hover:text-white cursor-pointer"
                                            )}
                                        >
                                            {isSelected && <FiCheck className="w-3 h-3 inline mr-1" />}
                                            {skill.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ProfileSettingsSection;
