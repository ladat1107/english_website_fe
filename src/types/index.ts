/**
 * Khailingo - Type Definitions
 * File chứa các type và interface dùng trong toàn bộ ứng dụng
 */

// =====================================================
// USER TYPES
// =====================================================
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    googleId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// =====================================================
// EXAM TYPES
// =====================================================
export interface Exam {
    id: string;
    title: string;
    slug: string;
    description?: string;
    type: ExamType;
    duration: number; // phút
    totalQuestions: number;
    totalAttempts: number;
    thumbnail?: string;
    sections: Section[];
    createdAt: string;
    updatedAt: string;
}

export type ExamType =
    | "ielts-full"
    | "ielts-reading"
    | "ielts-listening"
    | "toeic";

export interface Section {
    id: string;
    examId: string;
    title: string;
    order: number;
    type: SectionType;
    content?: string;
    audioUrl?: string;
    questionGroups: QuestionGroup[];
}

export type SectionType = "reading" | "listening" | "writing" | "speaking";

export interface QuestionGroup {
    id: string;
    sectionId: string;
    title?: string;
    instruction?: string;
    passage?: string;
    imageUrl?: string;
    order: number;
    questions: Question[];
}

export interface Question {
    id: string;
    groupId: string;
    content: string;
    type: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string;
    explanation?: string;
    order: number;
}

export type QuestionType =
    | "multiple-choice"
    | "true-false-not-given"
    | "fill-in-blank"
    | "matching"
    | "short-answer"
    | "essay";

export interface QuestionOption {
    id: string;
    label: string;
    content: string;
}

// =====================================================
// EXAM ATTEMPT TYPES
// =====================================================
export interface ExamAttempt {
    id: string;
    examId: string;
    userId: string;
    startTime: string;
    endTime?: string;
    status: AttemptStatus;
    score?: number;
    totalCorrect?: number;
    totalWrong?: number;
    answers: UserAnswer[];
}

export type AttemptStatus = "in-progress" | "completed" | "submitted";

export interface UserAnswer {
    id: string;
    attemptId: string;
    questionId: string;
    answer: string;
    isCorrect?: boolean;
}

// =====================================================
// FLASHCARD TYPES
// =====================================================
export interface FlashcardDeck {
    id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    totalCards: number;
    isPublic: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Flashcard {
    id: string;
    deckId: string;
    front: string;
    back: string;
    example?: string;
    imageUrl?: string;
    audioUrl?: string;
    order: number;
}

export interface UserFlashcardProgress {
    id: string;
    userId: string;
    cardId: string;
    status: FlashcardStatus;
    lastReviewedAt?: string;
    nextReviewAt?: string;
    reviewCount: number;
}

export type FlashcardStatus = "new" | "learning" | "review" | "mastered";

// =====================================================
// DICTATION TYPES (Chép chính tả)
// =====================================================
export interface DictationExercise {
    id: string;
    title: string;
    slug: string;
    audioUrl: string;
    transcript: string;
    sentences: DictationSentence[];
    difficulty: DifficultyLevel;
    totalAttempts: number;
}

export interface DictationSentence {
    id: string;
    exerciseId: string;
    content: string;
    startTime: number; // giây
    endTime: number; // giây
    order: number;
}

export type DifficultyLevel = "easy" | "medium" | "hard";

// =====================================================
// WRITING/SPEAKING SAMPLE TYPES
// =====================================================
export interface WritingSample {
    id: string;
    title: string;
    slug: string;
    type: WritingType;
    topic: string;
    question: string;
    sampleAnswer: string;
    outline?: string;
    vocabulary?: VocabularyItem[];
    band?: number;
    createdAt: string;
}

export type WritingType = "task1" | "task2";

export interface SpeakingSample {
    id: string;
    title: string;
    slug: string;
    part: SpeakingPart;
    topic: string;
    questions: string[];
    sampleAnswer: string;
    vocabulary?: VocabularyItem[];
    audioUrl?: string;
    band?: number;
    createdAt: string;
}

export type SpeakingPart = "part1" | "part2" | "part3";

export interface VocabularyItem {
    word: string;
    meaning: string;
    example?: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================
/**
 * Interface response chuẩn từ Backend
 * Khớp 100% với BE ApiResponse DTO
 */
export interface ApiResponse<T> {
    success: boolean;          // true = thành công, false = lỗi
    message?: string;          // Thông báo cho user
    data?: T;                  // Dữ liệu trả về (khi success = true)
    error?: {                  // Thông tin lỗi (khi success = false)
        code: string;          // Mã lỗi (VD: UNAUTHORIZED, VALIDATION_ERROR)
        details?: any;         // Chi tiết lỗi (validation errors, stack trace...)
    };
    timestamp: string;         // Thời gian response
    path: string;              // Đường dẫn API được gọi
    statusCode?: number;       // HTTP status code
}
export interface Pagination {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: Pagination;
}

// =====================================================
// UI COMPONENT TYPES
// =====================================================
export interface NavItem {
    title: string;
    href: string;
    description?: string;
    children?: NavItem[];
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
}

export interface ParamBasic {
    page?: number;
    limit?: number;
    search?: string;
}