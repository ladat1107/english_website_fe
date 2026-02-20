/**
 * Khailingo - Speaking Types
 * Types cho module Luyện giao tiếp - khớp với BE schemas
 */

import { SpeakingTopic } from "@/utils/constants/enum";
import { ParamBasic } from ".";

export const speakingTopicOptions = Object.entries(SpeakingTopic).map(([key, value]) => ({
    value: value,
    label: value,
    key: key,
}));


// =====================================================
// SPEAKING EXAM STATUS
// =====================================================
export enum SpeakingAttemptStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    ABANDONED = 'abandoned',
}

// Alias for compatibility - dùng trong các page chấm bài
export enum ExamAttemptStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    GRADED = 'graded',
    ABANDONED = 'abandoned',
}

// =====================================================
// SPEAKING TOPIC LABELS - Nhãn tiếng Việt cho các chủ đề
// =====================================================
export const SPEAKING_TOPIC_LABELS: Record<SpeakingTopic, string> = {
    [SpeakingTopic.DAILY_LIFE]: 'Đời sống hàng ngày',
    [SpeakingTopic.EDUCATION]: 'Giáo dục',
    [SpeakingTopic.TECHNOLOGY]: 'Công nghệ',
    [SpeakingTopic.ENVIRONMENT]: 'Môi trường',
    [SpeakingTopic.HEALTH]: 'Sức khỏe',
    [SpeakingTopic.CULTURE]: 'Văn hóa',
    [SpeakingTopic.TRAVEL]: 'Du lịch',
    [SpeakingTopic.WORK_AND_CAREER]: 'Công việc & Sự nghiệp',
    [SpeakingTopic.SOCIAL_ISSUES]: 'Vấn đề xã hội',
    [SpeakingTopic.HOBBIES_AND_INTERESTS]: 'Sở thích',
};

// =====================================================
// VIDEO SCRIPT - Kịch bản video
// =====================================================
export interface VideoScript {
    speaker: string;       // Người nói (A, B, Interviewer, etc.)
    content: string;       // Nội dung tiếng Anh
    translation: string;   // Bản dịch tiếng Việt
}

// =====================================================
// SPEAKING QUESTION - Câu hỏi trong đề giao tiếp
// =====================================================
export interface SpeakingQuestion {
    _id?: string;
    question_number: number;    // Số thứ tự câu hỏi
    question_text: string;      // Nội dung câu hỏi
    suggested_answer?: string;  // Gợi ý trả lời (admin xem được)
}

// =====================================================
// SPEAKING EXAM - Đề giao tiếp
// =====================================================
export interface SpeakingExam {
    _id: string;
    title: string;                          // Tiêu đề đề thi
    description?: string;                   // Mô tả
    topic: SpeakingTopic;                   // Chủ đề
    estimated_duration_minutes: number;     // Thời gian ước tính (phút)
    video_url: string;     
    thumbnail?: string;                 // Link video Cloudinary/Youtube
    video_script: VideoScript[];            // Kịch bản hội thoại
    questions: SpeakingQuestion[];          // Danh sách câu hỏi
    is_published: boolean;                  // Đã xuất bản chưa
    created_by: string;                     // ID người tạo
    createdAt: string;
    updatedAt: string;
}

export interface SpeakingExamParams extends ParamBasic {
    topic?: SpeakingTopic;
    is_published?: boolean;
}

// =====================================================
// SPEAKING ATTEMPT - Lượt làm bài của học viên
// =====================================================
export interface SpeakingAttempt {
    _id: string;
    user_id: string;
    exam_id: string;
    exam?: SpeakingExam;              // Populate từ BE
    status: SpeakingAttemptStatus;
    started_at?: string;
    submitted_at?: string;
    createdAt: string;
    updatedAt: string;
}

// =====================================================
// QUESTION SNAPSHOT - Lưu snapshot câu hỏi tại thời điểm làm bài
// =====================================================
export interface QuestionSnapshot {
    question_number: number;
    question_text: string;
}

// =====================================================
// AI ANALYSIS - Phân tích AI cho bài nói
// =====================================================
export interface AIAnalysis {
    transcript: string;       // Kết quả speech-to-text
    improvement: string[];    // Gợi ý cải thiện
    error: string[];          // Lỗi sai trong bài nói
    ai_fix: string;           // Đoạn text AI sửa lại
}

// =====================================================
// SPEAKING ANSWER - Câu trả lời của học viên
// =====================================================
export interface SpeakingAnswer {
    _id: string;
    attempt_id: string;
    question: QuestionSnapshot;       // Snapshot câu hỏi
    audio_url?: string;               // File audio user ghi âm
    duration_seconds: number;         // Độ dài file nói (giây)
    teacher_feedback?: string;        // Phản hồi của giáo viên
    score: number;                    // Điểm (0-100)
    ai_analysis?: AIAnalysis;         // Phân tích từ AI
    createdAt: string;
    updatedAt: string;
}

// =====================================================
// FORM DATA TYPES - Dùng cho form tạo/sửa đề
// =====================================================
export interface CreateSpeakingExamInput {
    title: string;
    description?: string;
    topic: SpeakingTopic;
    estimated_duration_minutes: number;
    video_url: string;
    video_script: VideoScript[];
    questions: Omit<SpeakingQuestion, '_id'>[];
    is_published: boolean;
}

export interface UpdateSpeakingExamInput extends Partial<CreateSpeakingExamInput> {
    _id: string;
}

// =====================================================
// SUBMIT ANSWER INPUT - Submit câu trả lời
// =====================================================
export interface SubmitSpeakingAnswerInput {
    attempt_id: string;
    question_number: number;
    audio_url: string;
    duration_seconds: number;
}

// =====================================================
// GRADE ANSWER INPUT - Chấm điểm câu trả lời
// =====================================================
export interface GradeSpeakingAnswerInput {
    answer_id: string;
    score: number;
    teacher_feedback?: string;
}

// =====================================================
// FILTER/QUERY TYPES
// =====================================================
export interface SpeakingExamFilter {
    topic?: SpeakingTopic;
    is_published?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}

export interface SpeakingAttemptFilter {
    exam_id?: string;
    user_id?: string;
    status?: SpeakingAttemptStatus;
    page?: number;
    limit?: number;
}

// =====================================================
// REALTIME TYPES - Cho tính năng hiển thị người đang làm cùng
// =====================================================
export interface OnlineUser {
    user_id: string;
    user_name: string;
    avatar_url?: string;
    joined_at: string;
}

export interface SpeakingRoom {
    exam_id: string;
    online_users: OnlineUser[];
    google_meet_link?: string;
}

// =====================================================
// PAGINATION RESPONSE
// =====================================================
export interface PaginatedSpeakingExams {
    data: SpeakingExam[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedSpeakingAttempts {
    data: SpeakingAttempt[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// =====================================================
// SPEAKING SUBMISSION - Bài nộp của học viên (dùng cho màn hình chấm bài)
// =====================================================
export interface SpeakingSubmissionAnswer {
    _id: string;
    questionNumber: number;
    questionText: string;
    audioUrl: string;
    duration: number;
    transcript?: string;
    score?: number;
    feedback?: string;
    aiAnalysis?: AIAnalysis;
}

export interface SpeakingSubmission {
    _id: string;
    speakingExamId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    status: ExamAttemptStatus;
    startedAt: string;
    submittedAt?: string;
    totalDuration: number;
    score?: number;
    feedback?: string;
    answers: SpeakingSubmissionAnswer[];
    createdAt: string;
    updatedAt: string;
}
