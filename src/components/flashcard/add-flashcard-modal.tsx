"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMyFlashcardDecks, useAddFlashcard, useCreateFlashcardDeck, useGenerateFlashcard } from "@/hooks/use-flashcard";
import { FlashcardDeck, FlashcardDeckFormData, Flashcard } from "@/types/flashcard.type";
import { FlashcardTopic, TypeLanguage } from "@/utils/constants/enum";
import { cn } from "@/utils/cn";
import { FiPlus, FiLoader, FiChevronRight, FiCheck, FiArrowLeft } from "react-icons/fi";
import { useToast } from "@/components/ui/toaster";
import { FLASHCARD_TOPIC_MEANINGS } from "@/types/flashcard.type";
import { typeLanguageOptions } from "@/types/speaking.type";
import { FlashcardDeckHeader } from "./flashcard-deck-header";
import { FlashcardImagePicker } from "./flashcard-image-picker";
import { FlashcardAutoFillButton } from "./flashcard-auto-fill-button";
import { AutoResizeTextarea } from "../ui/auto-resize-text-area";
import Image from "next/image";

interface AddFlashcardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedText: string;
}

type Step = "select-deck" | "create-deck" | "add-flashcard";

export function AddFlashcardModal({ open, onOpenChange, selectedText }: AddFlashcardModalProps) {
    const [step, setStep] = useState<Step>("select-deck");
    const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
    const [newDeckData, setNewDeckData] = useState<FlashcardDeckFormData>({
        title: "",
        description: undefined,
        image: undefined,
        type: TypeLanguage.ENGLISH,
        topic: FlashcardTopic.BASIC,
    });
    const [flashcardData, setFlashcardData] = useState({
        text: "",
        meaning: "",
        transliteration: "",
        type: "",
        examples: "",
        image_url: "",
    });

    const { addToast } = useToast();
    const { data: decksRes, isLoading: loadingDecks } = useGetMyFlashcardDecks();
    const decks: FlashcardDeck[] = decksRes?.data || [];
    const createDeckMutation = useCreateFlashcardDeck();
    const generateFlashcardMutation = useGenerateFlashcard();
    const addFlashcardMutation = useAddFlashcard(selectedDeck?._id || "");

    // Update flashcard text when selectedText changes
    useEffect(() => {
        if (selectedText && open) {
            setFlashcardData(prev => ({ ...prev, text: selectedText }));
        }
    }, [selectedText, open]);

    const handleSelectDeck = (deck: FlashcardDeck) => {
        setSelectedDeck(deck);
        setStep("add-flashcard");
        // Auto-generate flashcard data
        handleAutoGenerate();
    };

    const handleDeckFormUpdate = (data: FlashcardDeckFormData) => {
        setNewDeckData(data);
    };

    const handleCreateDeck = async () => {
        if (!newDeckData.title.trim()) {
            addToast("Vui lòng nhập tên bộ thẻ", "warning");
            return;
        }

        try {
            const newDeck = await createDeckMutation.mutateAsync({
                ...newDeckData,
                flashcards: [],
            });
            if (newDeck && newDeck?.success) {
                setSelectedDeck(newDeck.data);
                await handleAutoGenerate();
                setStep("add-flashcard");
                addToast("Đã tạo bộ thẻ mới", "success");
            }

        } catch (error) {
            console.error("Create deck failed:", error);
            addToast("Không thể tạo bộ thẻ", "error");
        }
    };

    const handleAutoGenerate = async () => {
        if (!flashcardData.text) return;

        try {
            const generated = await generateFlashcardMutation.mutateAsync(flashcardData.text);
            if (generated && generated.success) {
                const data = generated.data;
                setFlashcardData(prev => ({
                    ...prev,
                    meaning: data.meaning || prev.meaning,
                    transliteration: data.transliteration || prev.transliteration,
                    type: data.type || prev.type,
                    examples: data.examples || prev.examples,
                    image_url: data.image_url || prev.image_url,
                }));
            }

        } catch (error) {
            console.error("Auto-generate failed:", error);
        }
    };

    const handleAutoFill = (data: Flashcard) => {
        setFlashcardData(prev => ({
            ...prev,
            text: data.text || prev.text,
            transliteration: data.transliteration || prev.transliteration,
            type: data.type || prev.type,
            meaning: data.meaning || prev.meaning,
            examples: data.examples || prev.examples,
            image_url: data.image_url || prev.image_url,
        }));
    };

    const handleAddFlashcard = async () => {
        if (!flashcardData.text.trim() || !flashcardData.meaning.trim()) {
            addToast("Vui lòng nhập đầy đủ từ vựng và nghĩa", "warning");
            return;
        }

        try {
            await addFlashcardMutation.mutateAsync(flashcardData);
            addToast("Đã thêm flashcard thành công", "success");
            onOpenChange(false);
            resetModal();
        } catch (error) {
            console.error("Add flashcard failed:", error);
            addToast("Không thể thêm flashcard", "error");
        }
    };

    const resetModal = () => {
        setStep("select-deck");
        setSelectedDeck(null);
        setNewDeckData({
            title: "",
            description: undefined,
            image: undefined,
            type: TypeLanguage.ENGLISH,
            topic: FlashcardTopic.BASIC
        });
        setFlashcardData({ text: "", meaning: "", transliteration: "", type: "", examples: "", image_url: "" });
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(resetModal, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent size="lg" className="max-h-[85vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {step !== "select-deck" && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setStep("select-deck")}
                            >
                                <FiArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <DialogTitle>
                            {step === "select-deck" && "Chọn bộ thẻ"}
                            {step === "create-deck" && "Tạo bộ thẻ mới"}
                            {step === "add-flashcard" && "Thêm flashcard"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                {/* Step 1: Select Deck */}
                {step === "select-deck" && (
                    <div className="space-y-4">
                        {loadingDecks ? (
                            <div className="flex items-center justify-center py-8">
                                <FiLoader className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                {/* Create new deck button */}
                                <button
                                    onClick={() => setStep("create-deck")}
                                    className={cn(
                                        "w-full p-4 rounded-xl border-2 border-dashed border-primary/30",
                                        "hover:border-primary hover:bg-primary/5",
                                        "transition-all duration-200",
                                        "flex items-center justify-center gap-2",
                                        "text-primary font-medium"
                                    )}
                                >
                                    <FiPlus className="w-5 h-5" />
                                    <span>Tạo bộ thẻ mới</span>
                                </button>

                                {/* Existing decks */}
                                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                                    {decks?.map((deck: FlashcardDeck) => (
                                        <button
                                            key={deck._id}
                                            onClick={() => handleSelectDeck(deck)}
                                            className={cn(
                                                "w-full p-4 rounded-xl border border-border",
                                                "hover:border-primary hover:bg-primary/5",
                                                "transition-all duration-200",
                                                "flex items-center gap-3 text-left"
                                            )}
                                        >
                                            {deck.image ? (
                                                <Image
                                                    src={deck.image}
                                                    alt={deck.title}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xl">📚</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm sm:text-base truncate">
                                                    {deck.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {FLASHCARD_TOPIC_MEANINGS[deck.topic]} • {
                                                        typeLanguageOptions.find(opt => opt.value === deck.type)?.label
                                                    }
                                                </p>
                                            </div>
                                            <FiChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Step 2: Create Deck - Beautiful UI with FlashcardDeckHeader */}
                {step === "create-deck" && (
                    <div className="space-y-4">
                        {/* Card-like container */}
                        <div className="p-4 rounded-xl border-2 border-border/50 bg-card">
                            <FlashcardDeckHeader
                                title={newDeckData.title || ""}
                                description={newDeckData.description}
                                image={newDeckData.image}
                                topic={newDeckData.topic}
                                type={newDeckData.type}
                                onUpdate={handleDeckFormUpdate}
                                isCreateMode={true}
                            />
                        </div>

                        <Button
                            onClick={handleCreateDeck}
                            disabled={createDeckMutation.isPending || !newDeckData.title.trim()}
                            className="w-full"
                        >
                            {createDeckMutation.isPending ? (
                                <>
                                    <FiLoader className="w-4 h-4 animate-spin mr-2" />
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-4 h-4 mr-2" />
                                    Tạo bộ thẻ
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Step 3: Add Flashcard - Beautiful UI inspired by FlashcardCardItem */}
                {step === "add-flashcard" && (
                    <div className="space-y-4">
                        {/* Deck info banner */}
                        <div className="p-3 flex items-center justify-between">
                            <p className="text-base font-bold text-primary">
                                {selectedDeck?.title}
                            </p>
                            {/* AI Auto-fill button */}
                            <FlashcardAutoFillButton
                                word={flashcardData.text}
                                onAutoFillSuccess={handleAutoFill}
                                disabled={!flashcardData.text.trim()}
                                variant={"success"}
                            />
                        </div>

                        {/* Card-like container */}
                        <div className="p-4 rounded-xl border-2 border-border/50 bg-card space-y-3">
                            {/* Top section: Image + Word fields */}
                            <div className="flex gap-3">
                                {/* Image picker */}
                                <FlashcardImagePicker
                                    value={flashcardData.image_url}
                                    onChange={(url) => setFlashcardData({ ...flashcardData, image_url: url })}
                                    className="flex-shrink-0"
                                />

                                {/* Word fields */}
                                <div className="flex-1 space-y-2 min-w-0">
                                    {/* Word/Phrase */}
                                    <input
                                        type="text"
                                        value={flashcardData.text}
                                        onChange={(e) => setFlashcardData({ ...flashcardData, text: e.target.value })}
                                        placeholder="Từ vựng / Cụm từ"
                                        className={cn(
                                            "w-full bg-transparent border-b-2 border-gray-300",
                                            "text-base font-medium",
                                            "focus:outline-none focus:border-primary/50",
                                            "placeholder:text-muted-foreground/50",
                                            "transition-colors pb-1"
                                        )}
                                    />

                                    {/* Type + Transliteration */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={flashcardData.type}
                                            onChange={(e) => setFlashcardData({ ...flashcardData, type: e.target.value })}
                                            placeholder="Loại từ"
                                            className="w-20 h-7 text-xs bg-muted/50 focus:outline-none border-b-2 border-gray-300 px-2"
                                        />
                                        <input
                                            type="text"
                                            value={flashcardData.transliteration}
                                            onChange={(e) => setFlashcardData({ ...flashcardData, transliteration: e.target.value })}
                                            placeholder="/Phiên âm/"
                                            className={cn(
                                                "flex-1 bg-transparent border-b-2 border-gray-300 h-7",
                                                "text-sm text-primary px-2",
                                                "focus:outline-none focus:text-foreground",
                                                "placeholder:text-muted-foreground/50",
                                                "transition-colors"
                                            )}
                                        />
                                    </div>

                                    {/* Meaning */}
                                    <AutoResizeTextarea
                                        value={flashcardData.meaning}
                                        onChange={(e) => setFlashcardData({ ...flashcardData, meaning: e.target.value })}
                                        placeholder="Nghĩa của từ / cụm từ"
                                        rows={1}
                                        className={cn(
                                            "w-full bg-gray-100 rounded-lg border-0 px-3 py-2",
                                            "text-sm sm:text-base",
                                            "focus:outline-none focus-visible:ring-0 focus:border-0",
                                            "placeholder:text-muted-foreground/50"
                                        )}
                                        style={{ minHeight: "1.5rem" }}
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-dashed" />

                            {/* Bottom section: Examples */}
                            <div>
                                <AutoResizeTextarea
                                    value={flashcardData.examples}
                                    onChange={(e) => setFlashcardData({ ...flashcardData, examples: e.target.value })}
                                    placeholder="Ví dụ sử dụng (tùy chọn)"
                                    rows={1}
                                    className={cn(
                                        "w-full bg-transparent border-0 resize-none",
                                        "text-xs sm:text-sm text-muted-foreground",
                                        "focus:outline-none focus:text-foreground",
                                        "placeholder:text-muted-foreground/50"
                                    )}
                                    style={{ minHeight: "1.25rem" }}
                                />
                            </div>
                        </div>

                        {/* Loading indicator */}
                        {generateFlashcardMutation.isPending && (
                            <div className="flex items-center gap-2 text-sm text-primary">
                                <FiLoader className="w-4 h-4 animate-spin" />
                                <span>Đang tạo nội dung tự động...</span>
                            </div>
                        )}

                        {/* Submit button */}
                        <Button
                            onClick={handleAddFlashcard}
                            disabled={addFlashcardMutation.isPending}
                            className="w-full"
                        >
                            {addFlashcardMutation.isPending ? (
                                <>
                                    <FiLoader className="w-4 h-4 animate-spin mr-2" />
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-4 h-4 mr-2" />
                                    Thêm flashcard
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
