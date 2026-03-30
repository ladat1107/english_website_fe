import { LevelExam, TypeLanguage } from "@/utils/constants/enum";
import { ParamBasic } from ".";
import { UserType } from "./user.type";
import { AIAnalysis, Vocabulary } from "./speaking.type";

// =====================================================
// WRITING EXAM - Đề luyện viết
// =====================================================
export interface WritingExam {
    _id: string;
    title: string;
    content: string; // Nội dung đề bài
    suggest: string; // Nội dung gợi ý
    images: string[]; // Hình ảnh đề bài (nếu có)
    type: TypeLanguage;
    is_published: boolean;
    level: LevelExam;
    vocabularies: Vocabulary[]; // Từ vựng kèm nghĩa
    created_by: string;
    createdAt: string;
    updatedAt: string;
}

export interface WritingExamParams extends ParamBasic {
    is_published?: boolean;
    type?: TypeLanguage;
    level?: LevelExam;
}

// =====================================================
// WRITING ANSWER - Bài làm luyện viết
// =====================================================
export interface FileInfo {
    name?: string;
    url: string;
    size?: number;
}

export interface WritingAnswer {
    _id: string;
    user_id: string;
    user?: UserType;
    writing_exam_id: string;
    writingexam?: WritingExam;
    answer: string; // Nội dung bài viết
    files?: FileInfo[]; // Link ảnh/file bài viết
    is_pinned: boolean;
    score: number;
    teacher_feedback: string;
    submitted_at: string;
    ai_analysis: AIAnalysis | null;
    createdAt: string;
    updatedAt: string;
}

export interface WritingAnswerParams extends ParamBasic {
    is_pinned?: boolean;
}

// =====================================================
// CREATE/UPDATE DTOs
// =====================================================
export interface CreateWritingAnswerDto {
    writing_exam_id: string;
    answer?: string;
    files?: FileInfo[];
}

export interface UpdateWritingAnswerDto {
    answer?: string;
    files?: FileInfo[];
    score?: number;
    teacher_feedback?: string;
    is_pinned?: boolean;
}


export const IMAGE_DEFAULT = [
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359999/Annotation-bro_i1kykk.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774360000/Annotation-rafiki_tc5vxn.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359999/New_entries-rafiki_azsidx.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359999/Fill_out-rafiki_nn42qp.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359998/Online_article-amico_dqsbim.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359998/Signing_a_contract-bro_jb5fis.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359998/Writing_on_the_wall-amico_jaommt.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359998/Work_in_progress-bro_ozpg7w.png',
    'https://res.cloudinary.com/dnyodp0rd/image/upload/v1774359998/Writing_on_the_wall-pana_mgedxy.png',
]
