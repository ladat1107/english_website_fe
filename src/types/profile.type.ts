/**
 * Khailingo - Profile Types
 * Định nghĩa các types cho trang Profile
 */

import { ExamAttemptStatus, ProficiencyLevel, SkillEnum, ExamType } from "@/utils/constants/enum";

// Thông tin user mở rộng cho profile
export interface UserProfile {
    _id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    role?: string;
    target_exam?: ExamType;
    target_score?: number;
    current_level?: ProficiencyLevel;
    target_date?: string;
    learning_goals?: SkillEnum[];
    createdAt?: string;
    updatedAt?: string;
}

// Thống kê học tập tổng quan
export interface LearningStats {
    total_exams_taken: number;
    total_speaking_practices: number;
    total_flashcards_learned: number;
    total_study_time_hours: number;
    current_streak: number;
    longest_streak: number;
    average_score: number;
}

// Tiến độ theo kỹ năng
export interface SkillProgress {
    skill: SkillEnum;
    progress: number; // 0-100
    total_practices: number;
    average_score: number;
    last_practiced?: string;
}

// Lịch sử bài test gần đây
export interface RecentExamAttempt {
    _id: string;
    exam_id: string;
    exam_title: string;
    exam_type: string;
    status: ExamAttemptStatus;
    total_score: number;
    percentage: number;
    time_spent_seconds: number;
    completed_at?: string;
    started_at?: string;
}

// Lịch sử luyện nói gần đây
export interface RecentSpeakingAttempt {
    _id: string;
    exam_id: string;
    exam_title: string;
    topic: string;
    status: ExamAttemptStatus;
    has_teacher_feedback: boolean;
    submitted_at?: string;
}

// Achievement/Badge
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlocked_at?: string;
    progress?: number; // 0-100 cho badge chưa mở khóa
}

// Response từ API profile
export interface ProfileStatsResponse {
    success: boolean;
    data: {
        stats: LearningStats;
        skill_progress: SkillProgress[];
        recent_exams: RecentExamAttempt[];
        recent_speaking: RecentSpeakingAttempt[];
        achievements: Achievement[];
    };
}

// Form cập nhật profile
export interface UpdateProfileForm {
    full_name?: string;
    avatar_url?: string;
    target_exam?: ExamType;
    target_score?: number;
    current_level?: ProficiencyLevel;
    target_date?: string;
    learning_goals?: SkillEnum[];
}
