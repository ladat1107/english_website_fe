/**
 * Khailingo - Trang Chi tiết Flashcard Deck
 * Hiển thị các thẻ flashcard và cho phép học
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiArrowLeft, FiArrowRight, FiRotateCcw, FiVolume2,
    FiCheck, FiX, FiHelpCircle, FiLayers
} from "react-icons/fi";
import { Card, CardContent, Button, Badge, Progress } from "@/components/ui";

// Dữ liệu mẫu flashcards
const sampleCards = [
    {
        id: 1,
        word: "Sustainable",
        phonetic: "/səˈsteɪnəbl/",
        meaning: "(adj) Bền vững, có thể duy trì được",
        example: "We need to find sustainable solutions for climate change.",
        exampleVi: "Chúng ta cần tìm các giải pháp bền vững cho biến đổi khí hậu.",
    },
    {
        id: 2,
        word: "Deteriorate",
        phonetic: "/dɪˈtɪriəreɪt/",
        meaning: "(v) Xấu đi, suy thoái",
        example: "Air quality has deteriorated in many cities.",
        exampleVi: "Chất lượng không khí đã xấu đi ở nhiều thành phố.",
    },
    {
        id: 3,
        word: "Mitigate",
        phonetic: "/ˈmɪtɪɡeɪt/",
        meaning: "(v) Giảm nhẹ, làm dịu",
        example: "The government is trying to mitigate the effects of the crisis.",
        exampleVi: "Chính phủ đang cố gắng giảm nhẹ tác động của cuộc khủng hoảng.",
    },
    {
        id: 4,
        word: "Unprecedented",
        phonetic: "/ʌnˈpresɪdentɪd/",
        meaning: "(adj) Chưa từng có tiền lệ",
        example: "The pandemic caused unprecedented disruption to daily life.",
        exampleVi: "Đại dịch đã gây ra sự gián đoạn chưa từng có đối với cuộc sống hàng ngày.",
    },
    {
        id: 5,
        word: "Resilient",
        phonetic: "/rɪˈzɪliənt/",
        meaning: "(adj) Kiên cường, có khả năng phục hồi",
        example: "Communities need to become more resilient to natural disasters.",
        exampleVi: "Các cộng đồng cần trở nên kiên cường hơn trước thiên tai.",
    },
];

export default function FlashcardDetailPage() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [unknownCount, setUnknownCount] = useState(0);
    const [direction, setDirection] = useState(0);

    const currentCard = sampleCards[currentIndex];
    const progress = ((currentIndex + 1) / sampleCards.length) * 100;

   
    // Xử lý lật thẻ
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // Xử lý đánh dấu đã biết
    const handleKnown = () => {
        setKnownCount((prev) => prev + 1);
        goNext();
    };

    // Xử lý đánh dấu chưa biết
    const handleUnknown = () => {
        setUnknownCount((prev) => prev + 1);
        goNext();
    };

    // Chuyển thẻ tiếp theo
    const goNext = () => {
        if (currentIndex < sampleCards.length - 1) {
            setDirection(1);
            setIsFlipped(false);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    // Quay lại thẻ trước
    const goPrev = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setIsFlipped(false);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Reset học lại
    const handleReset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCount(0);
        setUnknownCount(0);
    };

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

    // Check if completed
    const isCompleted = currentIndex >= sampleCards.length - 1 && (knownCount + unknownCount) === sampleCards.length;

    return (
        <div className="py-8">
            <div className="container-custom max-w-4xl">
                {/* Back button and title */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/flashcard")}
                    >
                        <FiArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold">IELTS Essential Vocabulary</h1>
                        <p className="text-sm text-muted-foreground">
                            Thẻ {currentIndex + 1} / {sampleCards.length}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <FiRotateCcw className="w-4 h-4 mr-2" />
                        Học lại
                    </Button>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-success flex items-center">
                            <FiCheck className="w-4 h-4 mr-1" />
                            Đã biết: {knownCount}
                        </span>
                        <span className="text-destructive flex items-center">
                            <FiX className="w-4 h-4 mr-1" />
                            Chưa biết: {unknownCount}
                        </span>
                    </div>
                    <Progress value={progress} />
                </div>

                {/* Flashcard */}
                {!isCompleted ? (
                    <>
                        <div className="relative h-[400px] mb-8 perspective-1000">
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
                                        className={`w-full h-full cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""
                                            }`}
                                        onClick={handleFlip}
                                        style={{
                                            transformStyle: "preserve-3d",
                                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                                        }}
                                    >
                                        {/* Front of card */}
                                        <Card
                                            className={`absolute w-full h-full backface-hidden ${isFlipped ? "invisible" : ""
                                                }`}
                                            style={{ backfaceVisibility: "hidden" }}
                                        >
                                            <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                                                <Badge variant="secondary" className="mb-4">
                                                    Mặt trước - Click để lật
                                                </Badge>
                                                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                                                    {currentCard.word}
                                                </h2>
                                                <p className="text-lg text-muted-foreground mb-4">
                                                    {currentCard.phonetic}
                                                </p>
                                                <Button variant="outline" size="sm">
                                                    <FiVolume2 className="w-4 h-4 mr-2" />
                                                    Phát âm
                                                </Button>
                                                <div className="mt-8 text-sm text-muted-foreground flex items-center">
                                                    <FiHelpCircle className="w-4 h-4 mr-2" />
                                                    Nhấn vào thẻ để xem nghĩa
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Back of card */}
                                        <Card
                                            className={`absolute w-full h-full ${!isFlipped ? "invisible" : ""
                                                }`}
                                            style={{
                                                backfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)",
                                            }}
                                        >
                                            <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                                                <Badge variant="secondary" className="mb-4">
                                                    Mặt sau - Click để lật
                                                </Badge>
                                                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                                                    {currentCard.word}
                                                </h2>
                                                <p className="text-lg text-muted-foreground mb-4">
                                                    {currentCard.phonetic}
                                                </p>
                                                <div className="text-xl font-medium text-primary mb-6">
                                                    {currentCard.meaning}
                                                </div>
                                                <div className="bg-secondary/50 rounded-xl p-4 w-full max-w-lg">
                                                    <p className="text-sm italic mb-1">
                                                        "{currentCard.example}"
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {currentCard.exampleVi}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={goPrev}
                                disabled={currentIndex === 0}
                            >
                                <FiArrowLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="lg"
                                onClick={handleUnknown}
                                className="min-w-[140px]"
                            >
                                <FiX className="w-5 h-5 mr-2" />
                                Chưa biết
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleKnown}
                                className="min-w-[140px]"
                            >
                                <FiCheck className="w-5 h-5 mr-2" />
                                Đã biết
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={goNext}
                                disabled={currentIndex === sampleCards.length - 1}
                            >
                                <FiArrowRight className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Keyboard hints */}
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Sử dụng phím: <kbd className="px-2 py-1 bg-secondary rounded">Space</kbd> để lật thẻ,
                            <kbd className="px-2 py-1 bg-secondary rounded ml-2">←</kbd>
                            <kbd className="px-2 py-1 bg-secondary rounded">→</kbd> để chuyển thẻ
                        </div>
                    </>
                ) : (
                    /* Completion screen */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6">
                            <FiCheck className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">🎉 Hoàn thành!</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Bạn đã hoàn thành bộ flashcard này
                        </p>
                        <div className="flex justify-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-success">{knownCount}</div>
                                <div className="text-sm text-muted-foreground">Đã biết</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-destructive">{unknownCount}</div>
                                <div className="text-sm text-muted-foreground">Chưa biết</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary">
                                    {Math.round((knownCount / sampleCards.length) * 100)}%
                                </div>
                                <div className="text-sm text-muted-foreground">Hoàn thành</div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={handleReset}>
                                <FiRotateCcw className="w-4 h-4 mr-2" />
                                Học lại
                            </Button>
                            <Button onClick={() => router.push("/flashcard")}>
                                <FiLayers className="w-4 h-4 mr-2" />
                                Bộ flashcard khác
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
