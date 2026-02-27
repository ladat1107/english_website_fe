import { AIAnalysis, SpeakingExam } from "./speaking.type";
import { UserType } from "./user.type";

export interface SpeakingAttemptResponse {
    attempt: {
        _id: string;
        exam_id: string;
        user_id: string;
        status: string;
        started_at: string;
        completed_at?: string;
        submitted_at?: string;
    };
    answers: {
        question: {
            question_number: number;
            question_text: string;
        }
        audio_url: string;
        duration_seconds: number;
    }[];
    is_resumed: boolean;
}

export interface SpeakingAttemptType {
    _id: string;
    exam_id: string;
    user_id: string;
    status: string;
    started_at: string;
    submitted_at?: string;
    has_teacher_feedback: boolean;
    createdAt: string;
    updatedAt: string;
    exam: SpeakingExam;
    answers: SpeakingAnswerType[];
    user: UserType;
}

// Lịch sử làm bài
export interface SpeakingAttemptAvg extends SpeakingAttemptType {
    average_score: number;
    answered_count: number;
}

// Chi tiết lần làm bài
export interface SpeakingAnswerType {
    _id: string;
    attempt_id: string;
    question: {
        question_number: number;
        question_text: string;
    };
    audio_url?: string;
    duration_seconds: number;
    teacher_feedback?: string;
    score: number;
    ai_analysis?: AIAnalysis;
    createdAt: string;
    updatedAt: string;
}

export interface SpeakingAttemptDetailResponse {
    attempt: SpeakingAttemptType;
    average_score: number;
}

// Chi tiết bài làm cho admin chấm
export interface GradingAttemptDetail {
    attempt: SpeakingAttemptType;
    average_score: number;
    history: SpeakingAttemptAvg[];
}

// Query params cho danh sách chấm bài
export interface SpeakingAttemptParams {
    page?: number;
    limit?: number;
    search?: string;
    topic?: string;
    has_teacher_feedback?: boolean;
}

