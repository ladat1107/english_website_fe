"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiRotateCcw,
  FiCheck,
  FiSend,
  FiList,
  FiClock,
  FiTarget,
  FiChevronLeft,
} from "react-icons/fi";
import { useGetFlashcardDeck, useSubmitStudyProgress } from "@/hooks/use-flashcard";
import { PATHS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { Button, Progress } from "@/components/ui";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StudyModeSelector } from "@/components/flashcard-study/study-mode-selector";
import { TestQuestion, TestQuestionData, TestQuestionType } from "./test-question";
import type { Flashcard, StudySessionStats } from "@/types/flashcard.type";
import LoadingCustom from "@/components/ui/loading-custom";

interface TestPlayerProps {
  deckId: string;
}

/** Tạo distractor options cho MC */
function generateMCOptions(
  correctAnswer: string,
  allAnswers: string[]
): string[] {
  const distractors = allAnswers
    .filter((a) => a !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
}

/** Tạo True/False statement */
function generateTFStatement(
  card: Flashcard,
  allCards: Flashcard[]
): { text: string; isTrue: boolean } {
  const isTrue = Math.random() > 0.5;

  if (isTrue) {
    return {
      text: `"${card.text}" có nghĩa là "${card.meaning}"`,
      isTrue: true,
    };
  } else {
    const otherCards = allCards.filter((c) => c._id !== card._id);
    const wrongCard = otherCards[Math.floor(Math.random() * otherCards.length)];
    return {
      text: `"${card.text}" có nghĩa là "${wrongCard?.meaning || "???"}"`,
      isTrue: false,
    };
  }
}

/** Tạo danh sách câu hỏi từ flashcards */
function generateQuestions(cards: Flashcard[]): TestQuestionData[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const allTerms = cards.map((c) => c.text);
  const allMeanings = cards.map((c) => c.meaning);

  // Phân bổ loại câu hỏi: 40% MC term, 30% MC meaning, 20% T/F, 10% written
  const questions: TestQuestionData[] = shuffled.map((card, idx) => {
    const rand = Math.random();
    let type: TestQuestionType;

    if (rand < 0.4) type = "mc_term";
    else if (rand < 0.7) type = "mc_meaning";
    else if (rand < 0.9) type = "true_false";
    else type = "written";

    const question: TestQuestionData = {
      id: `${card._id}-${idx}`,
      card,
      type,
      // Xác định askTerm cho written question tại đây (không random trong render)
      askTerm: type === "written" ? Math.random() > 0.5 : undefined,
    };

    // Thêm options cho MC
    if (type === "mc_term") {
      question.options = generateMCOptions(card.text, allTerms);
    } else if (type === "mc_meaning") {
      question.options = generateMCOptions(card.meaning, allMeanings);
    } else if (type === "true_false") {
      question.tfStatement = generateTFStatement(card, cards);
    }

    return question;
  });

  return questions;
}

/** Check đáp án đúng sai */
function checkAnswer(question: TestQuestionData, answer: string | null): boolean {
  if (!answer) return false;

  const { card, type, tfStatement, askTerm } = question;

  if (type === "true_false") {
    return answer === (tfStatement?.isTrue ? "true" : "false");
  }

  if (type === "written") {
    const correctAnswer = askTerm ? card.text : card.meaning;
    return answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  }

  // MC
  const correctAnswer = type === "mc_term" ? card.text : card.meaning;
  return answer === correctAnswer;
}

/** Format thời gian */
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function TestPlayer({ deckId }: TestPlayerProps) {
  const router = useRouter();

  // Fetch deck data
  const { data: deckRes, isLoading } = useGetFlashcardDeck(deckId);
  const deck = deckRes?.data;
  const submitProgress = useSubmitStudyProgress();

  // State
  const [questions, setQuestions] = useState<TestQuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isSubmitted]);

  // Tạo questions khi deck load xong
  useEffect(() => {
    if (deck?.flashcards?.length > 0 && !isSubmitted) {
      const qs = generateQuestions(deck.flashcards);
      setQuestions(qs);
      setAnswers({});
      setCurrentIndex(0);
      setIsSubmitted(false);
    }
  }, [deck]);

  // Current question
  const currentQuestion = questions[currentIndex];

  // Navigation
  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, questions.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
    setSheetOpen(false);
  }, []);

  // Handle answer
  const handleAnswer = useCallback(
    (answer: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    },
    [currentQuestion]
  );

  // Submit test
  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);

    // Gửi kết quả lên server
    const cardsResult = questions.map((q) => ({
      card_id: q.card._id,
      status: checkAnswer(q, answers[q.id]) ? ("correct" as const) : ("incorrect" as const),
    }));

    submitProgress.mutate({
      deck_id: deckId,
      cards_result: cardsResult,
      mode: "test",
    });
  }, [questions, answers, deckId, submitProgress]);

  // Restart
  const handleRestart = useCallback(() => {
    if (deck?.flashcards) {
      const qs = generateQuestions(deck.flashcards);
      setQuestions(qs);
      setAnswers({});
      setCurrentIndex(0);
      setIsSubmitted(false);
    }
  }, [deck]);

  // Tính điểm
  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (checkAnswer(q, answers[q.id])) correct++;
    });
    return correct;
  }, [questions, answers]);

  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== "").length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  // Loading
  if (isLoading || questions.length === 0) {
    return <LoadingCustom />;
  }

  // Kết quả
  if (isSubmitted) {
    const stats: StudySessionStats = {
      total: questions.length,
      correct: score,
      incorrect: questions.length - score,
      skipped: 0,
      percentage: Math.round((score / questions.length) * 100),
      duration: elapsedTime,
    };

    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#ffffff,#fffaf5,#fff1f1)]">
        <div className="container-custom max-w-4xl py-6 sm:py-8 px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(PATHS.CLIENT.FLASHCARD_DETAIL(deckId))}
              className="gap-2"
            >
              <FiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div className="flex-1" />
            <StudyModeSelector deckId={deckId} currentMode="test" />
          </div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className=" mb-8"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800">
              <div className="py-6 text-center border-2 border-emerald-500 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.correct}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">Đúng</div>
              </div>
              <div className="py-6 text-center border-2 border-red-400 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-red-500">{stats.incorrect}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">Sai</div>
              </div>
              <div className="py-6 text-center border-2 border-primary rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.percentage}%</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">Điểm</div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3">
              {/* Time */}
              <div className="bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <FiClock className="w-4 h-4" />
                Thời gian: {formatTime(stats.duration)}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size={'sm'} variant="outline" onClick={handleRestart} className="gap-2">
                  <FiRotateCcw className="w-4 h-4" />
                  Làm lại
                </Button>
                <Button
                  size={'sm'}
                  onClick={() => router.push(PATHS.CLIENT.FLASHCARD_DETAIL(deckId))}
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white"
                >
                  <FiTarget className="w-4 h-4" />
                  Về trang chi tiết
                </Button>
              </div>
            </div>

          </motion.div>

          {/* Chi tiết từng câu */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FiList className="w-5 h-5" />
              Chi tiết kết quả
            </h3>
            {questions.map((q, idx) => (
              <TestQuestion
                key={q.id}
                question={q}
                questionNumber={idx + 1}
                answer={answers[q.id] || null}
                onAnswer={() => { }}
                showResult
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Question sidebar component
  const QuestionSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex flex-col",
      !isMobile && "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-fit sticky top-20"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-slate-100 dark:border-slate-800",
        isMobile && "pb-3"
      )}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Bài kiểm tra</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            <FiClock className="w-3.5 h-3.5" />
            {formatTime(elapsedTime)}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600 dark:text-slate-400">Tiến độ</span>
          <span className="font-medium">{answeredCount}/{questions.length}</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question grid */}
      <div className={cn(
        "p-4 grid grid-cols-6 gap-2",
        isMobile && "max-h-[50vh] overflow-y-auto"
      )}>
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== null && answers[q.id] !== "" && answers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => goToQuestion(idx)}
              className={cn(
                "w-full aspect-square rounded-xl text-sm font-semibold transition-all duration-200",
                "flex items-center justify-center",
                isCurrent && "bg-primary text-white",
                isAnswered && !isCurrent && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                !isAnswered && !isCurrent && "bg-gray-200 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Submit button */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          onClick={handleSubmit}
          disabled={answeredCount < questions.length}
          className={cn(
            "w-full gap-2 font-semibold",
            answeredCount >= questions.length
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-slate-200 text-slate-500"
          )}
        >
          <FiSend className="w-4 h-4" />
          Nộp bài {answeredCount < questions.length && `(${answeredCount}/${questions.length})`}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#ffffff,#fffaf5,#fff1f1)]">
      <div className="container-custom max-w-6xl py-4 sm:py-6 px-4">
        {/* Header mobile */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(PATHS.CLIENT.FLASHCARD_DETAIL(deckId))}
            className="gap-1.5 px-2"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold truncate text-slate-800 dark:text-slate-100">
              {deck?.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile sheet trigger */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                  <FiList className="w-4 h-4" />
                  <span className="text-xs">{answeredCount}/{questions.length}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                <SheetHeader className="pb-2">
                  <SheetTitle>Danh sách câu hỏi</SheetTitle>
                </SheetHeader>
                <QuestionSidebar isMobile />
              </SheetContent>
            </Sheet>
            <StudyModeSelector deckId={deckId} currentMode="test" />
          </div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-4 sm:gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <QuestionSidebar />
          </div>

          {/* Main question area */}
          <div className="flex flex-col gap-4">
            {/* Progress bar mobile */}
            <div className="lg:hidden bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Câu {currentIndex + 1} / {questions.length}</span>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <FiClock className="w-3.5 h-3.5" />
                  {formatTime(elapsedTime)}
                </div>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentQuestion && (
                  <TestQuestion
                    question={currentQuestion}
                    questionNumber={currentIndex + 1}
                    answer={answers[currentQuestion.id] || null}
                    onAnswer={handleAnswer}
                    className="min-h-72"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="gap-2 px-4"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trước</span>
              </Button>

              <div className="flex-1 flex justify-center">
                <span className="text-sm text-slate-500 hidden sm:block">
                  {answeredCount === questions.length ? (
                    <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                      <FiCheck className="w-4 h-4" />
                      Đã trả lời hết!
                    </span>
                  ) : (
                    `Còn ${questions.length - answeredCount} câu chưa trả lời`
                  )}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={goNext}
                disabled={currentIndex === questions.length - 1}
                className="gap-2 px-4"
              >
                <span className="hidden sm:inline">Tiếp</span>
                <FiArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile submit button */}
            <div className="lg:hidden">
              <Button
                onClick={handleSubmit}
                disabled={answeredCount < questions.length}
                className={cn(
                  "w-full gap-2 font-semibold h-12",
                  answeredCount >= questions.length
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-slate-200 text-slate-500"
                )}
              >
                <FiSend className="w-4 h-4" />
                Nộp bài {answeredCount < questions.length && `(${answeredCount}/${questions.length})`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
