"use client";

/**
 * MatchPlayer - Game ghép đôi flashcard
 * Style theo DOL English: container lớn, controls rõ ràng
 * - Grid trộn lung tung tất cả cards (terms + meanings)
 * - Tap 2 thẻ khớp nhau → biến mất
 * - Timer đếm lên
 * - Responsive: 2 cột mobile, 3 cột tablet, 4 cột desktop
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiRotateCcw,
  FiCheck,
  FiClock,
  FiLayers,
  FiZap,
  FiAward,
} from "react-icons/fi";
import { useGetFlashcardDeck, useSubmitStudyProgress } from "@/hooks/use-flashcard";
import { PATHS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { Button, Badge, Progress } from "@/components/ui";
import { StudyModeSelector } from "@/components/flashcard-study/study-mode-selector";
import { MatchCard, MatchCardData, MatchCardState } from "./match-card";
import type { Flashcard } from "@/types/flashcard.type";

interface MatchPlayerProps {
  deckId: string;
}

/** Số cặp tối đa trong 1 game */
const MAX_PAIRS = 10;

/** Shuffle array */
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Tạo danh sách cards từ flashcards - trộn lung tung tất cả */
function createMatchCards(flashcards: Flashcard[]): MatchCardData[] {
  // Lấy tối đa MAX_PAIRS cặp, shuffle
  const selected = shuffleArray(flashcards).slice(0, MAX_PAIRS);

  const termCards: MatchCardData[] = selected.map((card) => ({
    id: `term-${card._id}`,
    cardId: card._id,
    content: card.text,
    type: "term" as const,
  }));

  const meaningCards: MatchCardData[] = selected.map((card) => ({
    id: `meaning-${card._id}`,
    cardId: card._id,
    content: card.meaning,
    type: "meaning" as const,
  }));

  // Trộn tất cả cards lung tung
  return shuffleArray([...termCards, ...meaningCards]);
}

/** Format time mm:ss.ms */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}.${milliseconds.toString().padStart(2, "0")}s`;
}

export function MatchPlayer({ deckId }: MatchPlayerProps) {
  const router = useRouter();

  // Fetch deck
  const { data: deckRes, isLoading } = useGetFlashcardDeck(deckId);
  const deck = deckRes?.data;
  const submitProgress = useSubmitStudyProgress();

  // Game state
  const [allCards, setAllCards] = useState<MatchCardData[]>([]);
  const [cardStates, setCardStates] = useState<Record<string, MatchCardState>>({});
  const [selectedCards, setSelectedCards] = useState<MatchCardData[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [totalPairs, setTotalPairs] = useState(0);

  // Timer
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  // Khởi tạo game
  const initGame = useCallback(() => {
    if (!deck?.flashcards?.length) return;

    const cards = createMatchCards(deck.flashcards);
    setAllCards(cards);
    setTotalPairs(cards.length / 2);

    // Reset states
    const initialStates: Record<string, MatchCardState> = {};
    cards.forEach((card) => {
      initialStates[card.id] = "idle";
    });
    setCardStates(initialStates);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setIsCompleted(false);
    setIsStarted(false);
    setStartTime(null);
    setElapsedTime(0);
  }, [deck?.flashcards]);

  // Init khi deck load
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer effect
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Date.now() - startTime);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [isStarted, isCompleted, startTime]);

  // Số cặp đã ghép và progress
  const progressPercent = totalPairs > 0 ? Math.round((matchedPairs.size / totalPairs) * 100) : 0;

  // Xử lý click card
  const handleCardClick = useCallback(
    (card: MatchCardData) => {
      // Start timer on first click
      if (!isStarted) {
        setIsStarted(true);
        setStartTime(Date.now());
      }

      // Đã matched thì bỏ qua
      if (matchedPairs.has(card.cardId)) return;

      // Đang trong trạng thái wrong thì bỏ qua
      if (cardStates[card.id] === "wrong") return;

      // Đã selected thì deselect
      if (selectedCards.some((c) => c.id === card.id)) {
        setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
        setCardStates((prev) => ({ ...prev, [card.id]: "idle" }));
        return;
      }

      // Nếu đã có 1 card selected cùng type, bỏ qua
      if (selectedCards.length === 1 && selectedCards[0].type === card.type) {
        // Deselect card cũ, select card mới
        setCardStates((prev) => ({
          ...prev,
          [selectedCards[0].id]: "idle",
          [card.id]: "selected",
        }));
        setSelectedCards([card]);
        return;
      }

      // Select card này
      setCardStates((prev) => ({ ...prev, [card.id]: "selected" }));
      const newSelected = [...selectedCards, card];
      setSelectedCards(newSelected);

      // Nếu đủ 2 card, kiểm tra match
      if (newSelected.length === 2) {
        const [first, second] = newSelected;

        // Phải khác type (term + meaning)
        if (first.type !== second.type && first.cardId === second.cardId) {
          // Match!
          setTimeout(() => {
            setCardStates((prev) => ({
              ...prev,
              [first.id]: "matched",
              [second.id]: "matched",
            }));
            setMatchedPairs((prev) => new Set([...prev, first.cardId]));
            setSelectedCards([]);

            // Check hoàn thành
            if (matchedPairs.size + 1 === totalPairs) {
              setIsCompleted(true);
              const finalTime = Date.now() - (startTime || Date.now());
              setElapsedTime(finalTime);

              // Lưu best time
              if (!bestTime || finalTime < bestTime) {
                setBestTime(finalTime);
              }

              // Submit progress
              submitProgress.mutate({
                deck_id: deckId,
                cards_result: Array.from(new Set([...matchedPairs, first.cardId])).map((id) => ({
                  card_id: id,
                  status: "correct" as const,
                })),
                mode: "match",
              });
            }
          }, 200);
        } else {
          // Wrong!
          setCardStates((prev) => ({
            ...prev,
            [first.id]: "wrong",
            [second.id]: "wrong",
          }));

          setTimeout(() => {
            setCardStates((prev) => ({
              ...prev,
              [first.id]: "idle",
              [second.id]: "idle",
            }));
            setSelectedCards([]);
          }, 400);
        }
      }
    },
    [
      isStarted,
      matchedPairs,
      cardStates,
      selectedCards,
      totalPairs,
      startTime,
      bestTime,
      deckId,
      submitProgress,
    ]
  );

  // Loading
  if (isLoading || allCards.length === 0) {
    return (
      <div className="py-8">
        <div className="container-custom max-w-4xl">
          <div className="h-12 mb-8 bg-muted rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Màn hình hoàn thành
  if (isCompleted) {
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
            <StudyModeSelector deckId={deckId} currentMode="match" />
          </div>

          {/* Completion content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-6"
            >
              <FiAward className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Hoàn thành!</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Bạn đã ghép xong tất cả các cặp
            </p>
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary h-12 flex items-center justify-center">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-muted-foreground">Thời gian</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 h-12 flex items-center justify-center">{totalPairs}</div>
                <div className="text-sm text-muted-foreground">Cặp từ</div>
              </div>
              {bestTime && bestTime >= elapsedTime && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-500 flex items-center gap-1 h-12 justify-center">
                    <FiZap className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-muted-foreground">Kỷ lục mới!</div>
                </div>
              )}
            </div>
            {bestTime && bestTime < elapsedTime && (
              <p className="text-sm text-muted-foreground mb-4">
                Kỷ lục: {formatTime(bestTime)}
              </p>
            )}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={initGame}>
                <FiRotateCcw className="w-4 h-4 mr-2" />
                Chơi lại
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

  return (
    <div className="py-6 sm:py-8 bg-[linear-gradient(135deg,#ffffff,#fffaf5,#fff1f1)]">
      <div className="container-custom">
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
            <Button variant="outline" size="sm" onClick={initGame}>
              <FiRotateCcw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Chơi lại</span>
            </Button>
            <StudyModeSelector deckId={deckId} currentMode="match" />
          </div>
        </div>

        {/* Progress + Timer */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-green-600 flex items-center">
              <FiCheck className="w-4 h-4 mr-1" />
              Đã ghép: {matchedPairs.size}/{totalPairs}
            </span>
            <span className={cn(
              "flex items-center font-mono",
              isStarted ? "text-primary font-semibold" : "text-muted-foreground"
            )}>
              <FiClock className="w-4 h-4 mr-1" />
              {formatTime(elapsedTime)}
            </span>
          </div>
          <Progress value={progressPercent} variant="default" />
        </div>

        {/* Instruction */}
        {!isStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              Chọn 2 thẻ khớp nhau: từ vựng với nghĩa tương ứng
            </Badge>
          </motion.div>
        )}

        {/* Game grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          <AnimatePresence mode="popLayout">
            {allCards
              .filter((card) => !matchedPairs.has(card.cardId))
              .map((card) => (
                <MatchCard
                  key={card.id}
                  data={card}
                  state={cardStates[card.id] || "idle"}
                  onClick={() => handleCardClick(card)}
                />
              ))}
          </AnimatePresence>
        </div>

        {/* Keyboard hint - desktop */}
        <div className="mt-6 text-center text-sm text-muted-foreground hidden sm:block">
          Click vào thẻ để chọn, ghép từ vựng màu xanh với nghĩa màu tím
        </div>
      </div>
    </div>
  );
}
