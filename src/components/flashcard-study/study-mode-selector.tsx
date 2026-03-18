"use client";

/**
 * StudyModeSelector - Dropdown để chuyển giữa các chế độ học
 * Compact button hiển thị chế độ hiện tại, click để mở dropdown
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Brain, ClipboardCheck, Puzzle, ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { PATHS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import type { StudyMode } from "@/types/flashcard.type";

interface StudyModeSelectorProps {
  deckId: string;
  currentMode: StudyMode;
  className?: string;
}
// Có 2 chỗ nếu sửa thì kiểm tra kỹ nhe
export const STUDY_MODES = [
  {
    mode: "flip" as StudyMode,
    label: "Flashcard",
    icon: Layers,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_FLIP(id),
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    mode: "learn" as StudyMode,
    label: "Ôn tập",
    icon: Brain,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_LEARN(id),
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    mode: "test" as StudyMode,
    label: "Kiểm tra",
    icon: ClipboardCheck,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_TEST(id),
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    mode: "match" as StudyMode,
    label: "Ghép đôi",
    icon: Puzzle,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_MATCH(id),
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
];

export function StudyModeSelector({ deckId, currentMode, className }: StudyModeSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentModeData = STUDY_MODES.find((m) => m.mode === currentMode) || STUDY_MODES[0];
  const CurrentIcon = currentModeData.icon;

  const handleSelect = (mode: typeof STUDY_MODES[0]) => {
    setIsOpen(false);
    if (mode.mode !== currentMode) {
      router.push(mode.href(deckId));
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Trigger button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "gap-1.5 px-2 h-8",
          currentModeData.color
        )}
      >
        <CurrentIcon className="size-4" />
        <span className="hidden sm:inline text-xs font-medium">
          {currentModeData.label}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-card border border-border rounded-xl shadow-lg overflow-hidden"
            >
              {STUDY_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = mode.mode === currentMode;

                return (
                  <button
                    key={mode.mode}
                    onClick={() => handleSelect(mode)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      "hover:bg-muted/50",
                      isActive && mode.bgColor
                    )}
                  >
                    <Icon className={cn("size-4", mode.color)} />
                    <span className={cn(
                      "flex-1 text-sm font-medium",
                      isActive && mode.color
                    )}>
                      {mode.label}
                    </span>
                    {isActive && (
                      <Check className={cn("size-4", mode.color)} />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
