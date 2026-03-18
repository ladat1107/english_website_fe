"use client";

/**
 * FlipCard - Thẻ flashcard 3D flip
 * Animation: rotateY 180deg với perspective
 * Tap/click để flip, hiệu ứng mượt với Framer Motion
 */

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { Flashcard } from "@/types/flashcard.type";
import Image from "next/image";

interface FlipCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}

export function FlipCard({ card, isFlipped, onFlip, className }: FlipCardProps) {
  return (
    <div
      className={cn("w-full h-full cursor-pointer select-none", className)}
      style={{ perspective: 1200 }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* === MẶT TRƯỚC: Từ vựng === */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            "bg-white dark:bg-zinc-900 rounded-2xl shadow-lg",
            "border border-zinc-200 dark:border-zinc-700",
            "p-6 sm:p-8"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Hình ảnh nếu có */}
          {card.image_url && (
            <div className="w-20 h-20 rounded-xl overflow-hidden mb-4">
              <Image
                src={card.image_url}
                alt={card.text}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            </div>
          )}

          {/* Từ vựng */}
          <p className="text-2xl sm:text-3xl font-bold text-center leading-tight">
            {card.text}
          </p>

          {/* Phiên âm */}
          {card.transliteration && (
            <p className="text-base text-muted-foreground mt-2">
              {card.transliteration}
            </p>
          )}

          {/* Loại từ */}
          {card.type && (
            <span className="mt-3 text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {card.type}
            </span>
          )}

          {/* Gợi ý flip */}
          <p className="text-xs text-muted-foreground/60 mt-auto pt-4">
            Nhấn để xem nghĩa
          </p>
        </div>

        {/* === MẶT SAU: Nghĩa + Ví dụ === */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            "bg-gradient-to-b from-emerald-50 to-white",
            "dark:from-emerald-950/40 dark:to-zinc-900",
            "rounded-2xl shadow-lg",
            "border border-emerald-200 dark:border-emerald-800",
            "p-6 sm:p-8"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Nghĩa */}
          <p className="text-2xl sm:text-3xl font-bold text-center leading-tight">
            {card.meaning}
          </p>

          {/* Từ gốc nhỏ bên dưới */}
          <p className="text-sm text-muted-foreground mt-2">{card.text}</p>

          {/* Ví dụ */}
          {card.examples && (
            <div className="mt-4 w-full max-w-sm">
              <div className="bg-white/60 dark:bg-zinc-800/60 rounded-lg p-3">
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed line-clamp-4">
                  {card.examples}
                </p>
              </div>
            </div>
          )}

          {/* Gợi ý */}
          <p className="text-xs text-muted-foreground/60 mt-auto pt-4">
            Nhấn để lật lại
          </p>
        </div>
      </motion.div>
    </div>
  );
}
