"use client";

/**
 * TestQuestion - Component câu hỏi trong Test mode
 * Style theo DOL English: #D42525 primary, 12px radius, soft shadows
 */

import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { FiCheck, FiX, FiEdit3, FiList, FiHelpCircle } from "react-icons/fi";
import type { Flashcard } from "@/types/flashcard.type";

export type TestQuestionType = "mc_term" | "mc_meaning" | "written" | "true_false";

export interface TestQuestionData {
  id: string;
  card: Flashcard;
  type: TestQuestionType;
  options?: string[];
  tfStatement?: { text: string; isTrue: boolean };
  /** Cho written question: true = hỏi term, false = hỏi meaning */
  askTerm?: boolean;
}

interface TestQuestionProps {
  question: TestQuestionData;
  questionNumber: number;
  answer: string | null;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  className?: string;
  compact?: boolean;
}

// Icon cho mỗi loại câu hỏi
const TYPE_ICONS = {
  mc_term: FiList,
  mc_meaning: FiList,
  written: FiEdit3,
  true_false: FiHelpCircle,
};

const TYPE_LABELS = {
  mc_term: "Chọn từ vựng",
  mc_meaning: "Chọn nghĩa",
  written: "Điền đáp án",
  true_false: "Đúng/Sai",
};

export function TestQuestion({
  question,
  questionNumber,
  answer,
  onAnswer,
  showResult = false,
  className,
  compact = false,
}: TestQuestionProps) {
  const { card, type, options, tfStatement, askTerm } = question;

  // Xác định prompt và đáp án đúng - dựa vào type và askTerm (không random)
  const isTermQuestion = type === "mc_term" || (type === "written" && askTerm === true);
  const prompt = type === "true_false"
    ? tfStatement?.text
    : isTermQuestion
      ? card.meaning
      : card.text;
  const correctAnswer = type === "true_false"
    ? (tfStatement?.isTrue ? "true" : "false")
    : isTermQuestion
      ? card.text
      : card.meaning;

  // Check nếu đáp án đúng (cho show result)
  const isCorrect = answer !== null && (
    type === "written"
      ? answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
      : answer === correctAnswer
  );

  const TypeIcon = TYPE_ICONS[type];

  return (
    <div className={cn(
      "rounded-xl transition-all duration-200",
      !compact && "bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800",
      className
    )}>
      {/* Header câu hỏi */}
      <div className={cn("flex items-start gap-3", !compact && "p-4 sm:p-5 pb-3")}>
        {/* Số câu hỏi với icon */}
        <div className={cn(
          "flex flex-col items-center gap-1 shrink-0",
          showResult && isCorrect && "text-emerald-600",
          showResult && !isCorrect && answer && "text-red-500"
        )}>
          <div
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-bold",
              "transition-all duration-200",
              showResult && isCorrect && "bg-emerald-100 text-emerald-700",
              showResult && !isCorrect && answer && "bg-red-100 text-red-600",
              !showResult && answer && "bg-[rgb(212,37,37)] text-white",
              !showResult && !answer && "bg-slate-100 text-slate-500 dark:bg-slate-800"
            )}
          >
            {showResult ? (
              isCorrect ? <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              questionNumber
            )}
          </div>
        </div>

        {/* Nội dung câu hỏi */}
        <div className="flex-1 min-w-0">
          {/* Badge loại câu hỏi */}
          <div className="flex items-center gap-1.5 mb-2">
            <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {TYPE_LABELS[type]}
            </span>
          </div>
          {/* Prompt */}
          <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
            {prompt}
          </p>
          {/* Transliteration */}
          {!isTermQuestion && card.transliteration && type !== "true_false" && (
            <p className="text-sm text-slate-500 mt-1 italic">{card.transliteration}</p>
          )}
        </div>
      </div>

      {/* Các lựa chọn */}
      <div className={cn(!compact && "px-4 sm:px-5 pb-4 sm:pb-5", compact && "mt-3")}>
        {/* Multiple Choice */}
        {(type === "mc_term" || type === "mc_meaning") && options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {options.map((option, idx) => {
              const isSelected = answer === option;
              const isCorrectOption = option === correctAnswer;
              const optionLetter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  onClick={() => !showResult && onAnswer(option)}
                  disabled={showResult}
                  className={cn(
                    "group relative flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 text-left",
                    "transition-all duration-200 text-sm sm:text-base",
                    // Default state
                    !showResult && !isSelected && "border-slate-200 dark:border-slate-700 hover:border-[#D42525]/50 hover:bg-red-50/30 dark:hover:bg-red-950/10",
                    // Selected state
                    !showResult && isSelected && "border-[#D42525] bg-red-50 dark:bg-red-950/30",
                    // Result - correct
                    showResult && isCorrectOption && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                    // Result - wrong selected
                    showResult && isSelected && !isCorrectOption && "border-red-500 bg-red-50 dark:bg-red-950/30"
                  )}
                >
                  {/* Letter badge */}
                  <span
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0",
                      "transition-all duration-200",
                      !showResult && !isSelected && "bg-slate-100 text-slate-600 group-hover:bg-[#D42525]/10 group-hover:text-[#D42525]",
                      !showResult && isSelected && "bg-[#D42525] text-white",
                      showResult && isCorrectOption && "bg-emerald-500 text-white",
                      showResult && isSelected && !isCorrectOption && "bg-red-500 text-white"
                    )}
                  >
                    {showResult && isCorrectOption ? <FiCheck className="w-3.5 h-3.5" /> :
                      showResult && isSelected && !isCorrectOption ? <FiX className="w-3.5 h-3.5" /> :
                        optionLetter}
                  </span>
                  <span className="font-medium flex-1">{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* True/False */}
        {type === "true_false" && (
          <div className="flex gap-3">
            {[
              { value: "true", label: "Đúng", icon: FiCheck },
              { value: "false", label: "Sai", icon: FiX }
            ].map(({ value, label, icon: Icon }) => {
              const isSelected = answer === value;
              const isCorrectOption = value === correctAnswer;

              return (
                <button
                  key={value}
                  onClick={() => !showResult && onAnswer(value)}
                  disabled={showResult}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold",
                    "transition-all duration-200",
                    !showResult && !isSelected && "border-slate-200 hover:border-[#D42525]/50 hover:bg-red-50/30",
                    !showResult && isSelected && "border-[#D42525] bg-red-50",
                    showResult && isCorrectOption && "border-emerald-500 bg-emerald-50",
                    showResult && isSelected && !isCorrectOption && "border-red-500 bg-red-50"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    value === "true" ? "text-emerald-600" : "text-red-500"
                  )} />
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Written */}
        {type === "written" && (
          <div className="space-y-3">
            <Input
              type="text"
              value={answer || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Nhập đáp án của bạn..."
              disabled={showResult}
              className={cn(
                "text-center text-base font-medium h-12 rounded-xl border-2",
                "placeholder:text-slate-400 transition-all duration-200",
                !showResult && "border-slate-200 focus:border-[#D42525] focus:ring-[#D42525]/20",
                showResult && isCorrect && "border-emerald-500 bg-emerald-50",
                showResult && !isCorrect && answer && "border-red-500 bg-red-50"
              )}
            />
            {showResult && !isCorrect && answer && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <FiCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-sm">
                  Đáp án đúng: <span className="font-bold text-emerald-700">{correctAnswer}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
