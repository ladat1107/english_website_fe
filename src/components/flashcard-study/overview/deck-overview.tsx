"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiEdit2,
  FiClock,
  FiBookOpen,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { useGetFlashcardDeck } from "@/hooks/use-flashcard";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/utils/cn";
import { PATHS, ANIMATION_VARIANTS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudyModeNav } from "@/components/flashcard-study/study-mode-nav";
import { DeckHeroCard } from "./deck-hero-card";
import { DeckTermList } from "./deck-term-list";
import LoadingCustom from "@/components/ui/loading-custom";
import dayjs from "dayjs";

interface DeckOverviewProps {
  deckId: string;
}

export function DeckOverview({ deckId }: DeckOverviewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: deckRes, isLoading, error } = useGetFlashcardDeck(deckId);
  const deck = deckRes?.data;

  // Loading skeleton
  if (isLoading) {
    return <LoadingCustom />;
  }

  // Lỗi hoặc không tìm thấy
  if (error || !deck) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#ffffff,#f9f6f6,#fdf3f3)]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <FiBookOpen className="size-10 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Không tìm thấy bộ thẻ</p>
          <p className="text-slate-500 mb-6 text-center">Bộ thẻ này có thể đã bị xóa hoặc không tồn tại</p>
          <Button
            variant="outline"
            onClick={() => router.push(PATHS.CLIENT.FLASHCARD)}
            className="gap-2"
          >
            <FiChevronLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Tính progress từ userFlashcard
  const totalCards = deck.flashcards?.length || 0;
  const correctCards = deck.userFlashcard?.correct_cards || 0;
  const progressPercent = totalCards > 0 ? Math.round((correctCards / totalCards) * 100) : 0;

  // Kiểm tra user có phải chủ deck không
  const isOwner = user?._id === deck.created_by;

  // Format thời gian học gần nhất
  const lastStudied = deck.userFlashcard?.last_studied_at
    ? dayjs(deck.userFlashcard.last_studied_at).format("DD/MM/YYYY HH:mm") // Hoặc .fromNow() nếu muốn hiển thị "x ngày trước"
    : null;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#ffffff,#f9f6f6,#fdf3f3)]">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container-custom flex items-center gap-3 h-14 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(PATHS.CLIENT.FLASHCARD)}
            className="gap-1.5 px-2"
          >
            <FiChevronLeft className="size-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-bold truncate text-slate-800 dark:text-slate-100">
              {deck.title}
            </h1>
          </div>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(PATHS.CLIENT.FLASHCARD_EDIT(deckId))}
              className="gap-1.5"
            >
              <FiEdit2 className="size-4" />
              <span className="hidden sm:inline">Chỉnh sửa</span>
            </Button>
          )}
        </div>
      </div>

      <div className="container-custom px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">

          {/* Deck info card */}
          <motion.div
            {...ANIMATION_VARIANTS.fadeInUp}
            className="mt-4 sm:mt-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Description */}
              {deck.description && (
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {deck.description}
                  </p>
                </div>
              )}

              {/* Progress */}
              {deck.userFlashcard && (
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiTrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tiến độ học</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {correctCards}/{totalCards} từ
                    </span>
                  </div>
                  <Progress
                    value={progressPercent}
                    className="h-2.5 rounded-full"
                  />
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full font-medium",
                      progressPercent >= 70 ? "bg-emerald-100 text-emerald-700" :
                        progressPercent >= 40 ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                    )}>
                      {progressPercent}% hoàn thành
                    </span>
                    {lastStudied && (
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        Học gần nhất: {lastStudied}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Study mode navigation */}
          <motion.div
            {...ANIMATION_VARIANTS.fadeInUp}
            transition={{ delay: 0.15 }}
            className="mt-6"
          >
            <div className="flex md:hidden items-center gap-2 mb-3">
              <FiTarget className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Chế độ học</h3>
            </div>
            <StudyModeNav deckId={deckId} />
          </motion.div>

          {/* Hero card - flip preview */}
          <motion.div
            {...ANIMATION_VARIANTS.fadeInUp}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            <DeckHeroCard deck={deck} flashcards={deck.flashcards} className="md:sticky top-32" />
          </motion.div>

          {/* Term list */}
          <motion.div
            {...ANIMATION_VARIANTS.fadeInUp}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <DeckTermList deck={deck} flashcards={deck.flashcards} />
          </motion.div>
        </div>

      </div>
    </div>
  );
}

