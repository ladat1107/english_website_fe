/**
 * Zustand store quản lý trạng thái study session
 * - Không persist (in-memory only) - reset khi rời trang
 * - Dùng chung cho tất cả study modes (flip, learn, test, match)
 */

import { create } from 'zustand';
import type { Flashcard, StudyMode, CardStatus, StudySessionStats } from '@/types/flashcard.type';

interface FlashcardStudyState {
  // Session info
  mode: StudyMode | null;
  deckId: string | null;
  cards: Flashcard[];
  currentIndex: number;
  isCompleted: boolean;
  isShuffled: boolean;

  // Kết quả từng card
  results: Record<string, CardStatus>;
  startTime: number | null;
  endTime: number | null;

  // Actions
  initSession: (deckId: string, cards: Flashcard[], mode: StudyMode) => void;
  setCurrentIndex: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  markCard: (cardId: string, status: CardStatus) => void;
  shuffleCards: () => void;
  completeSession: () => void;
  resetSession: () => void;
  getStats: () => StudySessionStats;
}

/** Thuật toán Fisher-Yates shuffle */
const shuffleArray = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useFlashcardStudyStore = create<FlashcardStudyState>()((set, get) => ({
  mode: null,
  deckId: null,
  cards: [],
  currentIndex: 0,
  isCompleted: false,
  isShuffled: false,
  results: {},
  startTime: null,
  endTime: null,

  /** Khởi tạo session học mới */
  initSession: (deckId, cards, mode) => {
    set({
      mode,
      deckId,
      cards: [...cards],
      currentIndex: 0,
      isCompleted: false,
      isShuffled: false,
      results: {},
      startTime: Date.now(),
      endTime: null,
    });
  },

  setCurrentIndex: (index) => {
    const { cards } = get();
    if (index >= 0 && index < cards.length) {
      set({ currentIndex: index });
    }
  },

  nextCard: () => {
    const { currentIndex, cards } = get();
    if (currentIndex < cards.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevCard: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  /** Đánh dấu kết quả cho card */
  markCard: (cardId, status) => {
    set((state) => ({
      results: { ...state.results, [cardId]: status },
    }));
  },

  /** Trộn ngẫu nhiên thứ tự cards */
  shuffleCards: () => {
    const { cards } = get();
    set({
      cards: shuffleArray(cards),
      currentIndex: 0,
      isShuffled: true,
    });
  },

  /** Hoàn thành session */
  completeSession: () => {
    set({ isCompleted: true, endTime: Date.now() });
  },

  /** Reset toàn bộ session */
  resetSession: () => {
    set({
      mode: null,
      deckId: null,
      cards: [],
      currentIndex: 0,
      isCompleted: false,
      isShuffled: false,
      results: {},
      startTime: null,
      endTime: null,
    });
  },

  /** Tính thống kê kết quả */
  getStats: () => {
    const { cards, results, startTime, endTime } = get();
    const total = cards.length;
    const correct = Object.values(results).filter((s) => s === 'correct').length;
    const incorrect = Object.values(results).filter((s) => s === 'incorrect').length;
    const skipped = total - correct - incorrect;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const duration = startTime ? (endTime || Date.now()) - startTime : 0;

    return { total, correct, incorrect, skipped, percentage, duration };
  },
}));
