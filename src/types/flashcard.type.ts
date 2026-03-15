import { z } from 'zod';
import { FlashcardTopic, TypeLanguage } from '@/utils/constants/enum';

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
  flashcards: z.array(flashcardSchema),
});

export type CreateFlashcardDeckFormData = z.infer<typeof flashcardDeckSchema>;
export type FlashcardDeckFormData = CreateFlashcardDeckFormData & { _id?: string };
