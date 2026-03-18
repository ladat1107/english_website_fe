"use client";

/**
 * LearnQuestion - Component hiển thị câu hỏi trong Learn mode
 * Hỗ trợ: Multiple Choice (4 lựa chọn) + Written (nhập đáp án)
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Flashcard } from "@/types/flashcard.type";

export type QuestionType = "mc_term" | "mc_meaning" | "written_term" | "written_meaning";

interface LearnQuestionProps {
  card: Flashcard;
  questionType: QuestionType;
  options?: string[]; // 4 đáp án cho MC
  onAnswer: (isCorrect: boolean, answer: string) => void;
  className?: string;
}

/** So sánh đáp án written (normalize + fuzzy) */
function checkWrittenAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      // Bỏ dấu tiếng Việt để so sánh linh hoạt hơn
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[.,!?;:'"]/g, "");

  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  // Exact match hoặc chứa đúng từ
  if (user === correct) return true;
  if (correct.includes(user) && user.length > correct.length * 0.7) return true;

  return false;
}

export function LearnQuestion({
  card,
  questionType,
  options = [],
  onAnswer,
  className,
}: LearnQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Xác định prompt và đáp án đúng
  const isMC = questionType.startsWith("mc_");
  const isTermQuestion = questionType.includes("term");

  // Nếu là term question: hiện meaning, hỏi term
  // Nếu là meaning question: hiện term, hỏi meaning
  const prompt = isTermQuestion ? card.meaning : card.text;
  const correctAnswer = isTermQuestion ? card.text : card.meaning;

  // Reset khi chuyển card
  useEffect(() => {
    setSelectedAnswer(null);
    setWrittenAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    if (!isMC) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [card._id, isMC]);

  // Xử lý chọn đáp án MC
  const handleSelectOption = useCallback(
    (option: string) => {
      if (isAnswered) return;

      setSelectedAnswer(option);
      setIsAnswered(true);
      const correct = option === correctAnswer;
      setIsCorrect(correct);

      // Delay một chút để user thấy feedback trước khi chuyển
      setTimeout(() => onAnswer(correct, option), 800);
    },
    [correctAnswer, isAnswered, onAnswer]
  );

  // Xử lý submit written answer
  const handleSubmitWritten = useCallback(() => {
    if (isAnswered || !writtenAnswer.trim()) return;

    setIsAnswered(true);
    const correct = checkWrittenAnswer(writtenAnswer, correctAnswer);
    setIsCorrect(correct);

    setTimeout(() => onAnswer(correct, writtenAnswer), 1000);
  }, [writtenAnswer, correctAnswer, isAnswered, onAnswer]);

  // Enter để submit written
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAnswered) {
      handleSubmitWritten();
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Prompt - Câu hỏi */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="text-gray-800 text-sm mb-2">
          {isTermQuestion ? "Từ vựng của?" : "Nghĩa của từ này là gì?"}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-blue-600">{prompt}</p>
        {!isTermQuestion && card.transliteration && (
          <p className="text-sm text-muted-foreground mt-1">{card.transliteration}</p>
        )}
      </motion.div>

      {/* Multiple Choice Options */}
      {isMC && (
        <div className="grid grid-cols-1 gap-2">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === correctAnswer;
            const showAsCorrect = isAnswered && isCorrectOption;
            const showAsWrong = isAnswered && isSelected && !isCorrectOption;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:bg-muted/50 active:scale-[0.98]",
                  !isAnswered && "border-primary/80 hover:border-primary",
                  showAsCorrect && "border-success bg-success/10",
                  showAsWrong && "border-destructive bg-destructive/10",
                  isAnswered && !showAsCorrect && !showAsWrong && "opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                      !isAnswered && "bg-secondary text-secondary-foreground",
                      showAsCorrect && "bg-success text-white",
                      showAsWrong && "bg-destructive text-white"
                    )}
                  >
                    {showAsCorrect ? (
                      <Check className="size-4" />
                    ) : showAsWrong ? (
                      <X className="size-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className={cn("flex-1", showAsCorrect && "font-medium")}>
                    {option}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Written Answer Input */}
      {!isMC && (
        <div className="space-y-3">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập đáp án..."
              disabled={isAnswered}
              className={cn(
                "text-center text-lg h-14",
                isAnswered && isCorrect && "border-success bg-success/10",
                isAnswered && !isCorrect && "border-destructive bg-destructive/10"
              )}
            />
            {isAnswered && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  "absolute right-3 top-[10px]",
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isCorrect ? "bg-success" : "bg-destructive"
                )}
              >
                {isCorrect ? (
                  <Check className="size-5 text-white" />
                ) : (
                  <X className="size-5 text-white" />
                )}
              </motion.div>
            )}
          </div>

          {/* Nút submit + hint */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(true)}
              disabled={isAnswered || showHint}
              className="flex-1"
            >
              <Lightbulb className="size-4 mr-1" />
              Gợi ý
            </Button>
            <Button
              onClick={handleSubmitWritten}
              disabled={isAnswered || !writtenAnswer.trim()}
              className="flex-1"
            >
              Kiểm tra
            </Button>
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && !isAnswered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center text-sm text-muted-foreground"
              >
                Chữ cái đầu:{" "}
                <span className="font-bold text-primary">
                  {correctAnswer.charAt(0).toUpperCase()}...
                </span>
              </motion.p>
            )}
          </AnimatePresence>

          {/* Đáp án đúng khi sai */}
          <AnimatePresence>
            {isAnswered && !isCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-3 bg-muted rounded-lg"
              >
                <p className="text-sm text-muted-foreground">Đáp án đúng:</p>
                <p className="font-bold text-success">{correctAnswer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
