"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiRotateCcw,
  FiCheck,
  FiX,
  FiLayers,
  FiVolume2,
  FiShuffle,
  FiFilter,
} from "react-icons/fi";
import { useGetFlashcardDeck, useSubmitStudyProgress } from "@/hooks/use-flashcard";
import { useFlashcardStudyStore } from "@/stores/flashcard-study.store";
import { PATHS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { Card, CardContent, Button, Badge, Progress } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { StudyModeSelector } from "@/components/flashcard-study/study-mode-selector";
import { speakText } from "@/utils/funtions";
import LoadingCustom from "@/components/ui/loading-custom";
import type { Flashcard, FlashcardDeck } from "@/types/flashcard.type";

interface FlipPlayerProps {
  deckId: string;
}

/** Chế độ lọc cards */
type StudyFilterMode = "all" | "unknown";

const FILTER_OPTIONS = [
  { value: "all" as StudyFilterMode, label: "Học tất cả", icon: FiLayers },
  { value: "unknown" as StudyFilterMode, label: "Từ chưa biết", icon: FiFilter },
];

export function FlipPlayer({ deckId }: FlipPlayerProps) {
  const router = useRouter();

  // Fetch deck data
  const { data: deckRes, isLoading } = useGetFlashcardDeck(deckId);
  const deck: FlashcardDeck = deckRes?.data;
  const submitProgress = useSubmitStudyProgress();

  // Zustand store
  const {
    cards,
    currentIndex,
    isCompleted,
    results,
    isShuffled,
    initSession,
    setCurrentIndex,
    markCard,
    shuffleCards,
    completeSession,
    resetSession,
    getStats,
  } = useFlashcardStudyStore();

  // Local state
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [filterMode, setFilterMode] = useState<StudyFilterMode>("all");

  /**
   * Lọc cards theo mode:
   * - "all": tất cả cards
   * - "unknown": các cards chưa biết (chưa correct trong userFlashcard)
   * - "reset": học lại (reset progress)
   */
  const getFilteredCards = useCallback((mode: StudyFilterMode): Flashcard[] => {
    if (!deck?.flashcards?.length) return [];

    const allCards = deck.flashcards;

    if (mode === "all") {
      return allCards;
    }

    // Mode "unknown": lọc các từ chưa biết
    if (mode === "unknown") {
      const userFlashcard = deck.userFlashcard;

      // Nếu chưa học lần nào, tất cả đều là chưa biết
      if (!userFlashcard || !userFlashcard.cards_result?.length) {
        return allCards;
      }

      // Lấy danh sách card_id đã correct
      const masteredCardIds = new Set(
        userFlashcard.cards_result
          .filter((r) => r.status === "correct")
          .map((r) => r.card_id)
      );

      // Filter ra các cards chưa mastered
      const unknownCards = allCards.filter((card) => !masteredCardIds.has(card._id));

      // Nếu tất cả đã biết, trả về toàn bộ để không bị rỗng
      return unknownCards.length > 0 ? unknownCards : allCards;
    }

    return allCards;
  }, [deck]);

  // Khởi tạo hoặc restart session khi filter mode thay đổi
  const startSession = useCallback((mode: StudyFilterMode) => {
    if (!deck?.flashcards?.length) return;

    const filteredCards = getFilteredCards(mode);

    // Reset nếu là mode "reset"
    if (mode === "all") {
      resetSession();
    }

    initSession(deckId, filteredCards, "flip");
    setIsFlipped(false);
    setFilterMode(mode);
  }, [deck, deckId, getFilteredCards, initSession, resetSession]);

  // Khởi tạo session khi deck data load xong
  useEffect(() => {
    if (deck?.flashcards?.length > 0 && !isCompleted) {
      startSession(filterMode);
    };
  }, [deck, deckId]);

  useEffect(() => {
    return () => resetSession();
  }, []);

  // Handler thay đổi filter mode
  const handleFilterChange = useCallback((value: StudyFilterMode) => {
    startSession(value);
  }, [startSession]);

  // Current card
  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  // Count stats from results
  const knownCount = Object.values(results).filter((r) => r === "correct").length;
  const unknownCount = Object.values(results).filter((r) => r === "incorrect").length;

  // Flip card
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Mark as known and go next
  const handleKnown = useCallback(() => {
    if (!currentCard) return;
    markCard(currentCard._id, "correct");
    goNext();
  }, [currentCard, markCard]);

  // Mark as unknown and go next
  const handleUnknown = useCallback(() => {
    if (!currentCard) return;
    markCard(currentCard._id, "incorrect");
    goNext();
  }, [currentCard, markCard]);

  // Go to next card
  const goNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Last card - complete session
      completeSession();
    }
  }, [currentIndex, cards.length, setCurrentIndex, completeSession]);

  // Go to previous card
  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, setCurrentIndex]);

  // Shuffle cards
  const handleShuffle = useCallback(() => {
    shuffleCards();
    setIsFlipped(false);
  }, [shuffleCards]);

  const handleSubmitProgress = () => {
    const cardsResult = Object.entries(results)
      .filter(([_, status]) => status === "correct" || status === "incorrect")
      .map(([card_id, status]) => ({
        card_id,
        status: status as "correct" | "incorrect",
      }));

    if (cardsResult.length > 0) {
      submitProgress.mutate({
        deck_id: deckId,
        cards_result: cardsResult,
        mode: "flip",
      });
    }
  }

  // Submit results when completed
  useEffect(() => {
    if (isCompleted) {
      handleSubmitProgress();
    }
  }, [isCompleted]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          handleFlip();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "1":
          handleUnknown();
          break;
        case "2":
          handleKnown();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleKnown, handleUnknown, goNext, goPrev, isCompleted]);

  // Animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const handleVoice = useCallback((e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakText(text, deck.type || "en");

  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingCustom />
  }

  // Completion screen
  if (isCompleted) {
    const stats = getStats();
    return (
      <div className="py-8 bg-[linear-gradient(135deg,#ffffff,#fffaf5,#fff1f1)]">
        <div className="container-custom px-4">
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
            <StudyModeSelector deckId={deckId} currentMode="flip" />
          </div>

          {/* Completion content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/80 mb-6">
              <FiCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Hoàn thành!</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Bạn đã hoàn thành bộ flashcard này
            </p>
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{stats.correct}</div>
                <div className="text-sm text-muted-foreground">Đã biết</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">{stats.incorrect}</div>
                <div className="text-sm text-muted-foreground">Chưa biết</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {stats.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Hoàn thành</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
              {/* Nút chọn học lại */}
              <Button
                variant="outline"
                onClick={() => { startSession("all") }}
              >
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

  return (
    <div className="py-6 sm:py-8 bg-[linear-gradient(135deg,#ffffff,#fffaf5,#fff1f1)]">
      <div className="container-custom max-w-4xl mx-auto px-4">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              className={cn(isShuffled && "text-primary border-primary")}
            >
              <FiShuffle className="w-4 h-4" />
            </Button>
            {/* Select chế độ học */}
            <Select value={filterMode} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[70px] h-8 text-primary font-medium">
                Lọc
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <StudyModeSelector deckId={deckId} currentMode="flip" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <Badge variant={'secondary'} >
              Chưa biết: {unknownCount}
            </Badge>
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:block">Thẻ</span> {currentIndex + 1} / {cards.length}
            </p>
            <Badge variant={'success'} >
              <FiCheck className="w-4 h-4 mr-1" />
              Đã biết: {knownCount}
            </Badge>
          </div>
          <Progress value={progress} />
        </div>

        {/* Flashcard */}
        <div className="relative h-[270px] sm:h-[300px] mb-6 sm:mb-8" style={{ perspective: 1000 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div
                className="w-full h-full cursor-pointer transition-transform duration-500 select-none"
                onClick={handleFlip}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                }}
              >
                {/* Front of card */}
                <Card
                  className={cn(
                    "absolute w-full h-full",
                    isFlipped && "invisible"
                  )}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <CardContent className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                    <Button
                      onClick={(e) => handleVoice(e, currentCard.text)}
                      variant={'outline'} className="absolute top-4 right-4" size="sm">
                      <FiVolume2 className="w-5 h-5 mr-2" />
                      Phát âm
                    </Button>
                    <h2 className=" text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
                      {currentCard?.text}
                    </h2>
                    {currentCard?.transliteration && (
                      <p className="text-lg text-muted-foreground mb-4">
                        {currentCard.transliteration}
                      </p>
                    )}

                    {currentCard?.type &&
                      <span className="text-sm text-muted-foreground">({currentCard.type})</span>}
                  </CardContent>
                </Card>

                {/* Back of card */}
                <Card
                  className={cn(
                    "absolute w-full h-full",
                    !isFlipped && "invisible"
                  )}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardContent className="h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                      {currentCard?.meaning}
                    </h2>

                    {currentCard?.examples && (
                      <div className="bg-secondary/50 rounded-xl p-4 w-full max-w-lg">
                        <p className="text-sm italic line-clamp-3">
                          "{currentCard.examples}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="h-7 w-7"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleUnknown}
            className="min-w-[100px] sm:min-w-[120px] rounded-full"
          >
            <FiX className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Chưa biết</span>
          </Button>
          <Button
            size="sm"
            onClick={handleKnown}
            className="min-w-[100px] sm:min-w-[120px] bg-green-600 hover:bg-green-700 rounded-full"
          >
            <FiCheck className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Đã biết</span>
          </Button>
          <Button
            variant="outline"
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
            className="w-7 h-7"
          >
            <FiArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Keyboard hints */}
        <div className="mt-6 text-center text-sm text-muted-foreground hidden sm:block">
          Sử dụng phím: <kbd className="px-2 py-1 bg-secondary rounded">Space</kbd> để lật thẻ,
          <kbd className="px-2 py-1 bg-secondary rounded ml-2">←</kbd>
          <kbd className="px-2 py-1 bg-secondary rounded">→</kbd> để chuyển thẻ,
          <kbd className="px-2 py-1 bg-secondary rounded ml-2">1</kbd> chưa biết,
          <kbd className="px-2 py-1 bg-secondary rounded ml-1">2</kbd> đã biết
        </div>
      </div>
    </div>
  );
}
