import { AIAnalysis, SpeakingExam } from "./speaking.type";

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

// Lịch sử làm bài
export interface SpeakingAttemptHistoryItem {
    _id: string;
    exam_id: string;
    user_id: string;
    status: string;
    started_at: string;
    completed_at?: string;
    createdAt: string;
    updatedAt: string;
    exam: {
        _id: string;
        title: string;
        topic: string;
        estimated_duration_minutes: number;
        thumbnail?: string;
    };
    average_score: number;
    answered_count: number;
    total_questions: number;
}

// Chi tiết lần làm bài
export interface SpeakingAttemptDetailAnswer {
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
    attempt: {
        _id: string;
        exam_id: string;
        user_id: string;
        status: string;
        started_at: string;
        completed_at?: string;
        createdAt: string;
        updatedAt: string;
        exam: SpeakingExam;
        answers: SpeakingAttemptDetailAnswer[];
    };
    average_score: number;
}