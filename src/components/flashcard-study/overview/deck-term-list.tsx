"use client";

/**
 * DeckTermList - Danh sách từ vựng collapsible
 * Style theo DOL English: soft shadows, modern cards
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiBookOpen, FiVolume2 } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import type { Flashcard, FlashcardDeck } from "@/types/flashcard.type";
import { speakText } from "@/utils/funtions";

interface DeckTermListProps {
  deck: FlashcardDeck;
  flashcards: Flashcard[];
  initialCount?: number;
  className?: string;
}

/** Số thẻ hiển thị ban đầu */
const DEFAULT_VISIBLE = 5;

export function DeckTermList({
  deck,
  flashcards,
  initialCount = DEFAULT_VISIBLE,
  className,
}: DeckTermListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Danh sách hiển thị: 5 đầu hoặc tất cả
  const visibleCards = useMemo(
    () => (isExpanded ? flashcards : flashcards.slice(0, initialCount)),
    [isExpanded, flashcards, initialCount]
  );

  const hasMore = flashcards.length > initialCount;

  const handleVoice = (e: any, text: string) => {
    e.stopPropagation();
    speakText(text, deck.type);
  }
  return (
    <section className={cn("", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FiBookOpen className="w-4 h-4 text-[#D42525]" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Danh sách từ vựng
        </h3>
        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          {flashcards.length}
        </span>
      </div>

      {/* Semantic HTML: danh sách định nghĩa cho SEO */}
      <dl className="grid grid-cols-1 gap-4">
        <AnimatePresence initial={false}>
          {visibleCards.map((card, index) => (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <div className={cn(
                "relative flex items-start gap-3 p-3 sm:p-4 rounded-xl",
                "bg-white dark:bg-slate-900",
                "border border-slate-200 dark:border-slate-800",
                "hover:border-slate-300 dark:hover:border-slate-700",
                "hover:shadow-sm transition-all duration-200",
                "group"
              )}>
                <Button
                  onClick={(e) => handleVoice(e, card.text)}
                  variant={'ghost'} className="absolute top-2 right-2 focus-visible:ring-0 z-20 text-primary" size="sm">
                  <FiVolume2 className="w-5 h-5 " />
                </Button>

                {/* Nội dung */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <dt className="font-semibold dark:text-slate-100">
                          {card.text}
                        </dt>
                        {card.type && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-slate-800 rounded text-purple-900 font-medium">
                            {card.type}
                          </span>
                        )}
                      </div>
                      {card.transliteration && (
                        <span className="text-xs text-slate-400 italic block mt-0.5">
                          {card.transliteration}
                        </span>
                      )}
                    </div>
                  </div>
                  <dd className="text-sm text-primary/70 dark:text-slate-400 mt-1 leading-relaxed">
                    {card.meaning}
                  </dd>
                  {card.examples && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-1 italic">
                      {card.examples}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </dl>

      {/* Nút mở rộng/thu gọn */}
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full mt-3 text-slate-600 dark:text-slate-400",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            "border border-dashed border-slate-300 dark:border-slate-700",
            "rounded-xl h-11"
          )}
        >
          <FiChevronDown
            className={cn(
              "size-4 mr-2 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
          {isExpanded
            ? "Thu gọn danh sách"
            : `Xem thêm ${flashcards.length - initialCount} từ`}
        </Button>
      )}
    </section>
  );
}
