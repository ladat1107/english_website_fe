import { z } from 'zod';
import { FlashcardTopic, TypeLanguage } from '@/utils/constants/enum';
import { ParamBasic } from '.';
import { UserType } from './user.type';

export const FLASHCARD_TOPIC_MEANINGS: Record<FlashcardTopic, string> = {
  [FlashcardTopic.BASIC]: "Cơ bản",
  [FlashcardTopic.ADVANCED]: "Nâng cao",
  [FlashcardTopic.TOEIC]: "TOEIC",
  [FlashcardTopic.IELTS]: "IELTS",
  [FlashcardTopic.HSK]: "HSK",
  [FlashcardTopic.ACADEMIC]: "Học thuật",
  [FlashcardTopic.DAILY]: "Giao tiếp",
  [FlashcardTopic.MIXED]: "Hỗn hợp",
};

export const flashCardTopicOptions = Object.entries(FLASHCARD_TOPIC_MEANINGS).map(([value, label]) => ({
  value,
  label,
}));
// Entities
export interface Flashcard {
  _id: string;
  text: string;
  transliteration?: string;
  type?: string;
  image_url?: string;
  meaning: string;
  examples?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashCardResult {
  card_id: string;
  status?: string;
  last_studied_at?: string | null;
}

export interface UserFlashcard {
  user_id: string;
  deck_id: string;
  correct_cards: number;
  incorrect_cards: number;
  last_studied_at: string | null;
  cards_result: FlashCardResult[];
}

export interface FlashcardDeck {
  _id: string;
  created_by: string; // User ID
  title: string;
  description?: string;
  image?: string;
  topic: FlashcardTopic;
  type: TypeLanguage;
  is_admin: boolean;
  flashcards: Flashcard[];
  createdAt?: string;
  updatedAt?: string;
  author?: UserType;
  userFlashcard?: UserFlashcard;
}

export interface FlashCardParams extends ParamBasic {
  topic?: FlashcardTopic;
  type?: TypeLanguage;
  is_admin?: boolean;
}

// Zod Schemas
export const flashcardSchema = z.object({
  _id: z.string().optional(),
  text: z.string().min(1, 'Vui lòng nhập từ vựng'),
  transliteration: z.string().optional(),
  type: z.string().optional(),
  image_url: z.string().optional(),
  meaning: z.string().min(1, 'Vui lòng nhập nghĩa của từ/cụm từ'),
  examples: z.string().optional(),
});

export const flashcardDeckSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  image: z.string().optional(),
  type: z.nativeEnum(TypeLanguage),
  topic: z.nativeEnum(FlashcardTopic),
  flashcards: z.array(flashcardSchema).optional(),
});

export type CreateFlashcardDeckFormData = z.infer<typeof flashcardDeckSchema>;
export type FlashcardDeckFormData = CreateFlashcardDeckFormData & { _id?: string };

// =====================================================
// STUDY TYPES - Dùng cho các chế độ học
// =====================================================

export type StudyMode = 'flip' | 'learn' | 'test' | 'match';

export type CardStatus = 'correct' | 'incorrect' | 'skipped';

/** Kết quả học 1 card trong session */
export interface StudyCardResult {
  card_id: string;
  status: CardStatus;
}

/** DTO gửi lên backend sau khi hoàn thành session */
export interface SubmitStudyProgressPayload {
  deck_id: string;
  cards_result: FlashCardResult[];
  mode?: StudyMode;
}

/** Thống kê kết quả session */
export interface StudySessionStats {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  percentage: number;
  duration: number; // ms
}
