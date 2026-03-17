"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiLoader } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useGenerateFlashcard } from "@/hooks/use-flashcard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Flashcard } from "@/types/flashcard.type";

interface FlashcardAutoFillButtonProps {
  word: string;
  onAutoFillSuccess: (data: Flashcard) => void;
  disabled?: boolean;
  className?: string;
}


export function FlashcardAutoFillButton({
  word,
  onAutoFillSuccess,
  disabled = false,
  className,
}: FlashcardAutoFillButtonProps) {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { mutate, isPending } = useGenerateFlashcard();

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = React.useCallback(() => {
    const trimmed = word.trim();
    if (!trimmed || disabled || isPending) return;

    mutate(trimmed, {
      onSuccess(data) {
        if (data?.success) { onAutoFillSuccess(data.data); }
      },
    });
  }, [word, disabled, isPending, mutate, onAutoFillSuccess]);

  const isDisabled = disabled || !word.trim() || isPending;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={"ghost"}
            size="sm"
            disabled={isDisabled}
            onClick={handleClick}
            className={cn(
              "h-5 px-2 gap-1 text-xs transition-all",
              className
            )}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`${word}-${isPending}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center"
              >
                {isPending ? (
                  <FiLoader className="animate-spin w-3.5 h-3.5" />
                ) : (
                  <FiZap className="w-3.5 h-3.5" />
                )}
              </motion.span>
            </AnimatePresence>

            <span className="text-xs">Đề xuất</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent side="top" className="text-xs">
          <p>
            {isDisabled
              ? "Nhập từ vựng trước"
              : "Tự động điền nghĩa, phiên âm, ví dụ bằng AI"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default React.memo(FlashcardAutoFillButton);