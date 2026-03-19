"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ListChecks } from "lucide-react";
import { cn } from "@/utils/cn";
import { MultipleChoiceQuestion, MultipleChoiceAnswer } from "@/types/speaking.type";

// =====================================================
// TYPES
// =====================================================

interface MultipleChoiceQuestionCardProps {
    question: MultipleChoiceQuestion;
    index: number;
    selectedOption?: string;
    onSelectOption: (questionNumber: number, selectedOption: string) => void;
    disabled?: boolean;
    showResult?: boolean;
    className?: string;
}

interface MultipleChoiceSectionProps {
    questions: MultipleChoiceQuestion[];
    answers: MultipleChoiceAnswer[];
    onSelectOption: (questionNumber: number, selectedOption: string) => void;
    disabled?: boolean;
    showResult?: boolean;
    className?: string;
}

// =====================================================
// SINGLE QUESTION CARD
// =====================================================

export function MultipleChoiceQuestionCard({
    question,
    index,
    selectedOption,
    onSelectOption,
    disabled = false,
    showResult = false,
    className,
}: MultipleChoiceQuestionCardProps) {
    const handleSelect = (optionKey: string) => {
        if (disabled) return;
        onSelectOption(question.question_number, optionKey);
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn("space-y-3", className)}
        >
            {/* Question text */}
            <div className="flex items-start gap-2.5">
                <p className="text-sm font-bold text-foreground leading-relaxed flex-1">
                    {question.question_number}. {question.question_text}
                </p>
            </div>

            {/* Options */}
            <div className="grid gap-2">
                {question.options.map((option) => {
                    const isSelected = selectedOption === option.key;
                    const isCorrect = showResult && option.key === question.correct_option;
                    const isWrong = showResult && isSelected && option.key !== question.correct_option;

                    return (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => handleSelect(option.key)}
                            disabled={disabled}
                            className={cn(
                                "flex items-center gap-3 pb-3 rounded-xl text-left transition-all duration-200",
                                "hover:bg-muted/60 active:scale-[0.98]",
                                !disabled && "cursor-pointer",
                                disabled && "cursor-default",
                            )}
                        >
                            {/* Option key circle */}
                            <div
                                className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all",
                                    isSelected && !showResult && "bg-primary text-white",
                                    isCorrect && "bg-green-500 text-white",
                                    isWrong && "bg-red-500 text-white",
                                    !isSelected && !isCorrect && !isWrong && "bg-muted text-muted-foreground"
                                )}
                            >
                                {isSelected && (isCorrect || !showResult) ? (
                                    <Check className="w-4 h-4" />
                                ) : isWrong ? (
                                    <span className="text-xs">✕</span>
                                ) : (
                                    option.key
                                )}
                            </div>

                            {/* Option text */}
                            <span
                                className={cn(
                                    "text-sm flex-1",
                                    isSelected && !showResult && "text-primary font-medium",
                                    isCorrect && "text-green-700 dark:text-green-400 font-medium",
                                    isWrong && "text-red-700 dark:text-red-400"
                                )}
                            >
                                {option.text}
                            </span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}

// =====================================================
// MULTIPLE CHOICE SECTION
// =====================================================

export function MultipleChoiceSection({
    questions,
    answers,
    onSelectOption,
    disabled = false,
    showResult = false,
    className,
}: MultipleChoiceSectionProps) {
    if (!questions || questions.length === 0) {
        return null;
    }

    const answeredCount = answers.filter(a => a.selected_option).length;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold flex items-center gap-2  text-primary">
                    <ListChecks className="w-5 h-5 font-bold" />
                    Câu hỏi trắc nghiệm
                </h2>
                <span className="text-xs text-muted-foreground">
                    {answeredCount}/{questions.length} câu đã trả lời
                </span>
            </div>

            {/* Questions */}
            <div className="space-y-5">
                {questions.map((question, index) => {
                    const answer = answers.find(
                        (a) => a.question_number === question.question_number
                    );
                    return (
                        <MultipleChoiceQuestionCard
                            key={question.question_number}
                            question={question}
                            index={index}
                            selectedOption={answer?.selected_option}
                            onSelectOption={onSelectOption}
                            disabled={disabled}
                            showResult={showResult}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default MultipleChoiceQuestionCard;
