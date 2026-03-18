"use client";

/**
 * DeckHeroCard - Card lớn preview có thể flip
 * Style theo DOL English: gradients, soft shadows, modern design
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiRotateCcw, FiVolume2 } from "react-icons/fi";
import { cn } from "@/utils/cn";
import type { Flashcard, FlashcardDeck } from "@/types/flashcard.type";
import { Button } from "@/components/ui";
import { speakText } from "@/utils/funtions";

interface DeckHeroCardProps {
  deck: FlashcardDeck;
  flashcards: Flashcard[];
  className?: string;
}

export function DeckHeroCard({ deck, flashcards, className }: DeckHeroCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
  }, [flashcards.length]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
  }, [flashcards.length]);

  const card = flashcards[currentIndex];
  if (!card) return null;

  const handleVoice = (e: any, text: string) => {
    e.stopPropagation();
    speakText(text, deck.type);
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Card flip container */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] cursor-pointer select-none group"
        style={{ perspective: 1200 }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Mặt trước - text */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center",
              "bg-white dark:bg-slate-900 rounded-2xl",
              "border border-slate-200 dark:border-slate-800",
              "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]",
              "p-6 sm:p-8"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <Button
              onClick={(e) => handleVoice(e, card.text)}
              variant={'outline'} className="absolute top-4 right-4 focus-visible:ring-0 z-20" size="sm">
              <FiVolume2 className="w-5 h-5 mr-2" />
              Phát âm
            </Button>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D42525]/5 to-transparent rounded-bl-[100px]" />

            {/* Word type badge */}
            {card.type && (
              <span className="absolute top-4 left-4 text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 font-medium">
                {card.type}
              </span>
            )}

            {/* Main content */}
            <div className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {card.text}
              </p>
              {card.transliteration && (
                <p className="text-base sm:text-lg text-slate-500 mt-2 italic">
                  {card.transliteration}
                </p>
              )}
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-slate-400">
              <FiRotateCcw className="w-3.5 h-3.5" />
              <span>Nhấn để lật thẻ</span>
            </div>
          </div>

          {/* Mặt sau - meaning */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center",
              "bg-gradient-to-br from-emerald-50 to-teal-50",
              "dark:from-emerald-950/40 dark:to-teal-950/40",
              "rounded-2xl border border-emerald-200 dark:border-emerald-800/50",
              "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]",
              "p-6 sm:p-8"
            )}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-[100px]" />

            {/* Main content */}
            <div className="text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-800 dark:text-emerald-200 leading-tight">
                {card.meaning}
              </p>
              {card.examples && (
                <div className="mt-4 max-w-md">
                  <p className="text-sm sm:text-base text-emerald-700/70 dark:text-emerald-300/70 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {card.examples}
                  </p>
                </div>
              )}
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-emerald-500">
              <FiRotateCcw className="w-3.5 h-3.5" />
              <span>Nhấn để lật lại</span>
            </div>
          </div>
        </motion.div>

        {/* Side navigation buttons */}
        {flashcards.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-white/90 dark:bg-slate-800/90 backdrop-blur",
                "border border-slate-200 dark:border-slate-700",
                "shadow-lg text-slate-600 dark:text-slate-300",
                "hover:bg-white dark:hover:bg-slate-800 hover:scale-105",
                "transition-all duration-200",
                "opacity-0 group-hover:opacity-100 sm:opacity-100"
              )}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-white/90 dark:bg-slate-800/90 backdrop-blur",
                "border border-slate-200 dark:border-slate-700",
                "shadow-lg text-slate-600 dark:text-slate-300",
                "hover:bg-white dark:hover:bg-slate-800 hover:scale-105",
                "transition-all duration-200",
                "opacity-0 group-hover:opacity-100 sm:opacity-100"
              )}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation dots & counter */}
      {flashcards.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          {/* Dot indicators (show max 7) */}
          <div className="flex items-center gap-1.5">
            {flashcards.slice(0, 7).map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setIsFlipped(false); setCurrentIndex(idx); }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  idx === currentIndex
                    ? "w-6 bg-[#D42525]"
                    : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                )}
              />
            ))}
            {flashcards.length > 7 && (
              <span className="text-xs text-slate-400 ml-1">+{flashcards.length - 7}</span>
            )}
          </div>

          {/* Counter */}
          <span className="text-sm text-slate-500 font-medium tabular-nums">
            {currentIndex + 1} / {flashcards.length}
          </span>
        </div>
      )}
    </div>
  );
}
