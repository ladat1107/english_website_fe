"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiRotateCcw,
  FiCheck,
  FiLayers,
} from "react-icons/fi";
import { useGetFlashcardDeck, useSubmitStudyProgress } from "@/hooks/use-flashcard";
import { useFlashcardStudyStore } from "@/stores/flashcard-study.store";
import { PATHS } from "@/utils/constants";
import { Button, Badge, Progress, Card, CardContent } from "@/components/ui";
import { StudyModeSelector } from "@/components/flashcard-study/study-mode-selector";
import { LearnQuestion, QuestionType } from "./learn-question";
import type { Flashcard } from "@/types/flashcard.type";
import LoadingCustom from "@/components/ui/loading-custom";

interface LearnPlayerProps {
  deckId: string;
}

interface LearnState {
  round: number;
  currentIndex: number;
  queue: Flashcard[];
  incorrectIds: Set<string>;
  correctIds: Set<string>;
  isCompleted: boolean;
}

/** Tạo distractor options từ danh sách cards */
function generateOptions(
  correctAnswer: string,
  allCards: Flashcard[],
  isTermQuestion: boolean
): string[] {
  const answers = allCards.map((c) => (isTermQuestion ? c.text : c.meaning));
  const distractors = answers.filter((a) => a !== correctAnswer);

  // Shuffle và lấy 3 distractors
  const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);

  // Thêm đáp án đúng và shuffle lại
  const options = [...shuffled, correctAnswer].sort(() => Math.random() - 0.5);

  return options;
}

/** Shuffle array */
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function LearnPlayer({ deckId }: LearnPlayerProps) {
  const router = useRouter();

  // Fetch deck data
  const { data: deckRes, isLoading } = useGetFlashcardDeck(deckId);
  const deck = deckRes?.data;
  const submitProgress = useSubmitStudyProgress();

  // Zustand store cho results
  const { initSession, markCard, resetSession } = useFlashcardStudyStore();

  // Local learn state
  const [state, setState] = useState<LearnState>({
    round: 1,
    currentIndex: 0,
    queue: [],
    incorrectIds: new Set(),
    correctIds: new Set(),
    isCompleted: false,
  });

  // Khởi tạo session khi deck load xong
  useEffect(() => {
    if (deck?.flashcards?.length > 0 && !state.isCompleted) {
      initSession(deckId, deck.flashcards, "learn");
      setState({
        round: 1,
        currentIndex: 0,
        queue: shuffleArray(deck.flashcards),
        incorrectIds: new Set(),
        correctIds: new Set(),
        isCompleted: false,
      });
    }

  }, [deck, deckId]);

  useEffect(() => {
    return () => resetSession();
  }, []);

  // Current card và question type
  const currentCard = state.queue[state.currentIndex];
  const questionType: QuestionType = useMemo(() => {
    if (state.round === 1) {
      // Vòng 1: MC, random hỏi term hoặc meaning
      return Math.random() > 0.5 ? "mc_term" : "mc_meaning";
    } else {
      // Vòng 2+: Written cho cards sai
      return Math.random() > 0.5 ? "written_term" : "written_meaning";
    }
  }, [state.round, state.currentIndex]);

  // Tạo options cho MC
  const options = useMemo(() => {
    if (!currentCard || !deck?.flashcards || !questionType.startsWith("mc_")) {
      return [];
    }
    const isTermQuestion = questionType.includes("term");
    const correctAnswer = isTermQuestion ? currentCard.text : currentCard.meaning;
    return generateOptions(correctAnswer, deck.flashcards, isTermQuestion);
  }, [currentCard, deck?.flashcards, questionType]);

  // Xử lý trả lời
  const handleAnswer = useCallback(
    (isCorrect: boolean, _answer: string) => {
      if (!currentCard) return;

      // Cập nhật Zustand store
      markCard(currentCard._id, isCorrect ? "correct" : "incorrect");

      setState((prev) => {
        const newCorrectIds = new Set(prev.correctIds);
        const newIncorrectIds = new Set(prev.incorrectIds);

        if (isCorrect) {
          newCorrectIds.add(currentCard._id);
          newIncorrectIds.delete(currentCard._id);
        } else {
          newIncorrectIds.add(currentCard._id);
        }

        // Kiểm tra xem còn card nào trong queue không
        const nextIndex = prev.currentIndex + 1;

        if (nextIndex >= prev.queue.length) {
          // Hết queue hiện tại
          if (newIncorrectIds.size === 0) {
            // Tất cả đều đúng → hoàn thành
            return { ...prev, isCompleted: true, correctIds: newCorrectIds, incorrectIds: newIncorrectIds };
          } else {
            // Còn cards sai → tạo queue mới từ cards sai
            const incorrectCards = deck?.flashcards?.filter((c: Flashcard) =>
              newIncorrectIds.has(c._id)
            ) || [];

            return {
              ...prev,
              round: prev.round + 1,
              currentIndex: 0,
              queue: shuffleArray(incorrectCards),
              correctIds: newCorrectIds,
              incorrectIds: newIncorrectIds,
            };
          }
        }

        // Còn cards trong queue → tiếp tục
        return {
          ...prev,
          currentIndex: nextIndex,
          correctIds: newCorrectIds,
          incorrectIds: newIncorrectIds,
        };
      });
    },
    [currentCard, markCard, deck?.flashcards]
  );

  // submit results khi hoàn thành
  useEffect(() => {
    if (state.isCompleted && deck?.flashcards) {
      const cardsResult = deck.flashcards.map((c: Flashcard) => ({
        card_id: c._id,
        status: state.correctIds.has(c._id) ? ("correct" as const) : ("incorrect" as const),
      }));

      submitProgress.mutate({
        deck_id: deckId,
        cards_result: cardsResult,
        mode: "learn",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isCompleted]);

  // Restart
  const handleRestart = useCallback(() => {
    if (deck?.flashcards) {
      initSession(deckId, deck.flashcards, "learn");
      setState({
        round: 1,
        currentIndex: 0,
        queue: shuffleArray(deck.flashcards),
        incorrectIds: new Set(),
        correctIds: new Set(),
        isCompleted: false,
      });
    }
  }, [deck, deckId, initSession]);

  // Loading
  if (isLoading || state.queue.length === 0) {
    return <LoadingCustom />;
  }

  // Kết quả
  if (state.isCompleted) {
    return (
      <div className="py-8 bg-[linear-gradient(135deg,#ffffff,#fffaf5,#fff1f1)]">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(PATHS.CLIENT.FLASHCARD_DETAIL(deckId))}
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{deck?.title}</h1>
            </div>
            <StudyModeSelector deckId={deckId} currentMode="learn" />
          </div>

          {/* Completion content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 mb-6">
              <FiCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Hoàn thành!</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Bạn đã hoàn thành bài ôn tập này
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Đã qua {state.round} vòng học
            </p>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleRestart}>
                <FiRotateCcw className="w-4 h-4 mr-2" />
                Học lại
              </Button>
              <Button onClick={() => router.push(PATHS.CLIENT.FLASHCARD_DETAIL(deckId))}>
                <FiLayers className="w-4 h-4 mr-2" />
                Về trang chi tiết
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Tính progress tổng thể
  const totalCards = deck?.flashcards?.length || 0;
  const masteredCount = state.correctIds.size;
  const progressPercent = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  return (
    <div className="py-6 sm:py-8 bg-[linear-gradient(135deg,#ffffff,#fffaf5,#fff1f1)]">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(PATHS.CLIENT.FLASHCARD_DETAIL(deckId))}
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">{deck?.title}</h1>

          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <FiRotateCcw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Học lại</span>
            </Button>
            <StudyModeSelector deckId={deckId} currentMode="learn" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-sm mb-2">

            <Badge variant={'secondary'} >
              Chưa biết: {state.incorrectIds.size}
            </Badge>
            <p className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:block">Câu</span> {state.currentIndex + 1} / {state.queue.length}
            </p>
            <Badge variant={'success'} >
              <FiCheck className="w-4 h-4 mr-1" />
              Đã biết: {state.correctIds.size}
            </Badge>
          </div>
          <Progress value={progressPercent} variant="success" />
        </div>

        {/* Round indicator */}


        {/* Question Card */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
          <CardContent className="p-6 sm:p-8">
            <motion.div
              key={`${currentCard?._id}-${state.round}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {currentCard && (
                <LearnQuestion
                  card={currentCard}
                  questionType={questionType}
                  options={options}
                  onAnswer={handleAnswer}
                />
              )}
            </motion.div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
