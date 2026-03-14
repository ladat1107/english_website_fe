/**
 * Khailingo - Speaking Types
 * Types cho module Luyện giao tiếp - khớp với BE schemas
 */

import { LevelExam, SpeakingTopic, TypeLanguage } from "@/utils/constants/enum";
import { ParamBasic } from ".";
import { UserType } from "./user.type";

export interface OnlineUser {
    count: number;
    topic: SpeakingTopic;
    users: UserType[];
}
export const speakingGoogleMeetLink = {
    [SpeakingTopic.DAILY_LIFE]: "https://meet.google.com/rjd-vvqv-xzs",
    [SpeakingTopic.WORK_AND_CAREER]: "https://meet.google.com/ybh-knbh-boo",
    [SpeakingTopic.EDUCATION]: "https://meet.google.com/seb-fiwy-scs",
    [SpeakingTopic.HEALTH]: "https://meet.google.com/yjj-xkxr-wmb",
    [SpeakingTopic.TRAVEL]: "https://meet.google.com/ofe-xzdo-myv",
    [SpeakingTopic.CULTURE]: "https://meet.google.com/spd-vdcw-jnv",
    [SpeakingTopic.HOBBIES_AND_INTERESTS]: "https://meet.google.com/tkh-ihpz-ydv",
    [SpeakingTopic.SOCIAL_ISSUES]: "https://meet.google.com/nox-qsab-who",
    [SpeakingTopic.ENVIRONMENT]: "https://meet.google.com/hhg-oubq-ani",
    [SpeakingTopic.TECHNOLOGY]: "https://meet.google.com/nfr-dvec-tjm",
    [SpeakingTopic.ACADEMIC_TOPICS]: "https://meet.google.com/ijm-mjar-kuu",
};

export const levelExamMeaning: Record<LevelExam, string> = {
    [LevelExam.EASY]: "Dễ",
    [LevelExam.MEDIUM]: "Thường",
    [LevelExam.HARD]: "Khó",
};

export const levelExamOptions = Object.entries(LevelExam).map(([key, value]) => ({
    value: value,
    label: levelExamMeaning[value],
    key: key,
}));

export const TypeLanguageMeaning: Record<TypeLanguage, string> = {
    [TypeLanguage.ENGLISH]: "Tiếng Anh",
    [TypeLanguage.CHINESE]: "Tiếng Trung",
};

export const typeLanguageOptions = Object.entries(TypeLanguage).map(([key, value]) => ({
    value: value,
    label: TypeLanguageMeaning[value],
    key: key,
}));

export const speakingTopicMeaning: Record<SpeakingTopic, string> = {
    [SpeakingTopic.DAILY_LIFE]: "Hàng ngày",
    [SpeakingTopic.WORK_AND_CAREER]: "Việc làm",
    [SpeakingTopic.EDUCATION]: "Giáo dục",
    [SpeakingTopic.HEALTH]: "Sức khỏe",
    [SpeakingTopic.TRAVEL]: "Du lịch",
    [SpeakingTopic.CULTURE]: "Văn hóa",
    [SpeakingTopic.HOBBIES_AND_INTERESTS]: "Sở thích",
    [SpeakingTopic.SOCIAL_ISSUES]: "Vấn đề xã hội",
    [SpeakingTopic.ENVIRONMENT]: "Môi trường",
    [SpeakingTopic.TECHNOLOGY]: "Công nghệ",
    [SpeakingTopic.ACADEMIC_TOPICS]: "Chủ đề học thuật",
};

export const speakingTopicOptions = Object.entries(SpeakingTopic)
    .sort(([, a], [, b]) => speakingTopicMeaning[a as SpeakingTopic].localeCompare(speakingTopicMeaning[b as SpeakingTopic], "vi"))
    .map(([key, value]) => ({
        value: value,
        label: speakingTopicMeaning[value as SpeakingTopic],
        key: key,
    }));


// =====================================================
// VIDEO SCRIPT - Kịch bản video
// =====================================================
export interface VideoScript {
    speaker: string;       // Người nói (A, B, Interviewer, etc.)
    content: string;       // Nội dung tiếng Anh
    translation: string;   // Bản dịch tiếng Việt
}

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
    level: LevelExam;
    type: TypeLanguage;
    vocabularies: Vocabulary[];              // Từ vựng kèm nghĩa
    created_by: string;                     // ID người tạo
    createdAt: string;
    updatedAt: string;
}

export interface SpeakingExamParams extends ParamBasic {
    topic?: SpeakingTopic;
    is_published?: boolean;
    level?: LevelExam;
    type?: TypeLanguage;
}

export interface AIAnalysis {
    transcript: string;       // Kết quả speech-to-text
    improvement: string[];    // Gợi ý cải thiện
    error: string[];          // Lỗi sai trong bài nói
    ai_fix: string;           // Đoạn text AI sửa lại
}


// Loại từ (Part of Speech) - dùng để phân loại từ vựng trong phần từ vựng của đề thi giao tiếp
export enum PartOfSpeech {
    NOUN = "noun",
    VERB = "verb",
    ADJECTIVE = "adjective",
    ADVERB = "adverb",
    PRONOUN = "pronoun",
    NUMERAL = "numeral",
    MEASURE_WORD = "measure_word",
    CONJUNCTION = "conjunction",
    PREPOSITION = "preposition",
    INTERJECTION = "interjection",
}

// Viết tắt loại từ cho hiển thị trong phần từ vựng
export const POS_ABBR = {
    noun: { en: "noun", zh: "名" },
    verb: { en: "verb", zh: "动" },
    adjective: { en: "adj", zh: "形" },
    adverb: { en: "adv", zh: "副" },
    pronoun: { en: "pron", zh: "代" },
    numeral: { en: "num", zh: "数" },
    measure_word: { en: "mw", zh: "量" },
    conjunction: { en: "conj", zh: "连" },
    preposition: { en: "prep", zh: "介" },
    interjection: { en: "int", zh: "叹" },
} as const;;

export const POS_OPTIONS_EN = Object.values(PartOfSpeech).map((pos) => ({
    value: pos,
    label: POS_ABBR[pos].en, // hoặc zh
}));

export const POS_OPTIONS_ZH = Object.values(PartOfSpeech).map((pos) => ({
    value: pos,
    label: POS_ABBR[pos].zh, // hoặc en
}));

export interface Vocabulary {
    vocabulary: string;
    meaning: string;
    type?: string;   // Loại từ (danh từ, động từ, tính từ, v.v.)
}













