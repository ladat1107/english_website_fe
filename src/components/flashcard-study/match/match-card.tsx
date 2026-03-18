"use client";

/**
 * MatchCard - Thẻ trong game ghép đôi
 * States: idle, selected, matched, wrong
 * Term cards có màu xanh, Meaning cards có màu tím
 */

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export type MatchCardState = "idle" | "selected" | "matched" | "wrong";

export interface MatchCardData {
  id: string;
  cardId: string; // ID của flashcard gốc
  content: string;
  type: "term" | "meaning";
}

interface MatchCardProps {
  data: MatchCardData;
  state: MatchCardState;
  onClick: () => void;
  disabled?: boolean;
}

export function MatchCard({ data, state, onClick, disabled }: MatchCardProps) {
  const isTerm = data.type === "term";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || state === "matched"}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: state === "matched" ? 0 : 1,
        scale: state === "matched" ? 0.8 : 1,
        x: state === "wrong" ? [0, -4, 4, -4, 4, 0] : 0,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        duration: state === "wrong" ? 0.3 : 0.2,
        layout: { duration: 0.3 },
      }}
      className={cn(
        "w-full h-24 md:h-28 lg:h-32 p-2 sm:p-3 rounded-xl transition-all duration-150",
        "border-2 text-xs sm:text-sm leading-tight",
        "flex items-center justify-center text-center",
        // Idle state - phân biệt term vs meaning
        state === "idle" && isTerm && [
          "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
          "hover:border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40",
          "active:scale-[0.97]",
        ],
        state === "idle" && !isTerm && [
          "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
          "hover:border-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40",
          "active:scale-[0.97]",
        ],
        // Selected state
        state === "selected" && [
          "bg-primary/10 border-primary"
        ],
        // Matched state - ẩn đi
        state === "matched" && [
          "bg-success/20 border-success pointer-events-none",
        ],
        // Wrong state
        state === "wrong" && [
          "bg-destructive/10 border-destructive",
        ],
        // Disabled
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <span
        className={cn(
          "line-clamp-3 font-medium text-xs sm:text-lg",
          state === "idle" && isTerm && "text-blue-700 dark:text-blue-300",
          state === "idle" && !isTerm && "text-purple-700 dark:text-purple-300",
          state === "selected" && "text-primary",
          state === "matched" && "text-success",
          state === "wrong" && "text-destructive"
        )}
      >
        {data.content}
      </span>
    </motion.button>
  );
}
