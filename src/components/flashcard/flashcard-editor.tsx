/**
 * Khailingo - FlashcardEditor
 * Main editor component cho tạo/sửa flashcard deck
 */

"use client";

import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiArrowLeft, FiSave, FiLoader, FiLayers } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlashcardDeck, Flashcard, CreateFlashcardDeckFormData, FlashcardDeckFormData } from "@/types/flashcard.type";
import { FlashcardTopic, TypeLanguage } from "@/utils/constants/enum";
import { PATHS } from "@/utils/constants";
import { FlashcardDeckHeader } from "./flashcard-deck-header";
import { FlashcardCardItem } from "./flashcard-card-item";
import {
  useGetFlashcardDeck,
  useCreateFlashcardDeck,
  useUpdateFlashcardDeck,
  useAddFlashcard,
  useUpdateFlashcard,
  useDeleteFlashcard,
} from "@/hooks/use-flashcard";

interface FlashcardEditorProps {
  mode: "create" | "edit";
  deckId?: string;
  isAdmin?: boolean;
}

// Default values cho create mode
const DEFAULT_DECK_DATA: CreateFlashcardDeckFormData = {
  title: "",
  description: "",
  topic: FlashcardTopic.BASIC,
  type: TypeLanguage.ENGLISH,
  image: "https://res.cloudinary.com/dnyodp0rd/image/upload/v1773669365/studying_rmfc63.png",
};

export function FlashcardEditor({
  mode,
  deckId,
  isAdmin = false,
}: FlashcardEditorProps) {
  const router = useRouter();

  // State cho create mode
  const [createDeckData, setCreateDeckData] = useState(DEFAULT_DECK_DATA);
  const [createFlashcards, setCreateFlashcards] = useState<Array<Omit<Flashcard, "_id"> & { tempId: string }>>([]);
  const [savingFlashcardId, setSavingFlashcardId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: deckRes, isLoading: isLoadingDeck } = useGetFlashcardDeck(mode === "edit" && deckId ? deckId : "");
  const deck: FlashcardDeck = useMemo(() => {
    if (mode === "edit" && deckRes?.success) {
      return deckRes.data;
    }
  }, [deckRes, mode])
  
  const { mutate: createDeckMutation, isPending: isCreatingDeck } = useCreateFlashcardDeck();
  const { mutate: updateDeckMutation, isPending: isUpdatingDeck } = useUpdateFlashcardDeck();
  const { mutate: addFlashcardMutation, isPending: isAddingFlashcard } = useAddFlashcard(deckId || "");
  const { mutate: updateFlashcardMutation, isPending: isUpdatingFlashcard } = useUpdateFlashcard(deckId || "");
  const { mutate: deleteFlashcardMutation, isPending: isDeletingFlashcard } = useDeleteFlashcard(deckId || "");

  // Derived state
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mode === "edit" ? deck?.flashcards || [] : []);
  useEffect(() => {
    if (mode === "edit" && deck?.flashcards) {
      setFlashcards(deck.flashcards);
    }
  }, [mode, deck]);


  // Navigation paths
  const backPath = isAdmin ? PATHS.ADMIN.FLASHCARD : PATHS.CLIENT.FLASHCARD;

  // =====================================================
  // HANDLERS
  // =====================================================

  // Update deck info (blur-to-save in edit mode)
  const handleUpdateDeck = useCallback((data: FlashcardDeckFormData) => {
    if (mode === "edit" && deckId) {
      updateDeckMutation({ id: deckId, data });
    } else {
      setCreateDeckData((prev) => ({ ...prev, ...data }));
    }
  }, [mode, deckId, updateDeckMutation]);

  // Update flashcard (blur-to-save in edit mode)
  const handleUpdateFlashcard = useCallback((data: Flashcard) => {
    setSavingFlashcardId(data._id);
    if (mode === "edit") {
      updateFlashcardMutation(data, {
        onSuccess: (updatedDeck) => {
          if (updatedDeck && updatedDeck?.success) {
            setFlashcards(updatedDeck.data.flashcards);
          }
        },
        onError: (error) => { console.error("Error updating flashcard:", error); },
        onSettled: () => { setSavingFlashcardId(null); }
      });
    } else {
      // Update in local state for create mode
      setCreateFlashcards((prev) =>
        prev.map((card) =>
          card.tempId === data._id ? { ...card, ...data, tempId: card.tempId } : card
        )
      );
    }
  }, [mode, updateFlashcardMutation]);

  // Delete flashcard
  const handleDeleteFlashcard = useCallback((id: string) => {
    if (mode === "edit") {
      deleteFlashcardMutation(id);
    } else {
      setCreateFlashcards((prev) => prev.filter((card) => card.tempId !== id));
    }
  }, [mode, deleteFlashcardMutation]);

  // Add new flashcard
  const handleAddFlashcard = useCallback(() => {
    if (mode === "edit" && deckId) {
      addFlashcardMutation({
        text: "",
        meaning: "",
      });
    } else {
      const tempId = `temp-${Date.now()}`;
      setCreateFlashcards((prev) => [
        ...prev,
        { tempId, text: "", meaning: "" },
      ]);
    }
  }, [mode, deckId, addFlashcardMutation]);

  // Create deck (only for create mode)
  const handleCreateDeck = useCallback(async () => {
    if (mode !== "create") return;

    // Validate
    if (!createDeckData.title.trim()) {
      return;
    }

    // Remove cards without text
    const validCards = createFlashcards
      .filter((card) => card.text.trim() && card.meaning.trim())
      .map(({ tempId, ...rest }) => rest);

    createDeckMutation({ ...createDeckData, flashcards: validCards, }, {
      onSuccess: (result) => {
        if (result && result?.success) {
          // Redirect to edit page
          console.log("Created deck:", result.data);
          const newDeckId = result.data._id;
          const editPath = isAdmin ? PATHS.ADMIN.FLASHCARD_EDIT(newDeckId) : PATHS.CLIENT.FLASHCARD_EDIT(newDeckId);
          router.push(editPath);
        }
      }
    });


  }, [mode, createDeckData, createFlashcards, createDeckMutation, router, isAdmin]);

  // =====================================================
  // RENDER
  // =====================================================

  // Loading state
  if (mode === "edit" && isLoadingDeck) {
    return (
      <div className="container-custom py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare flashcard list for rendering
  const cardList: Flashcard[] =
    mode === "edit"
      ? flashcards
      : createFlashcards.map((card) => ({
        ...card,
        _id: card.tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

  return (
    <div className="container-custom py-4 sm:py-6 md:py-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(backPath)}
            className="gap-1.5"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>

          {/* Save button for create mode */}
          {mode === "create" && (
            <Button
              onClick={handleCreateDeck}
              disabled={isCreatingDeck || !createDeckData.title.trim()}
              className="gap-1.5"
            >
              {isCreatingDeck ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              <span>Tạo bộ thẻ</span>
            </Button>
          )}
        </div>

        {/* Deck Header */}
        <div className="mb-6 sm:mb-8">
          <FlashcardDeckHeader
            title={mode === "edit" ? deck?.title || "" : createDeckData.title}
            description={mode === "edit" ? deck?.description : createDeckData.description}
            image={mode === "edit" ? deck?.image : createDeckData.image}
            topic={mode === "edit" ? deck?.topic || FlashcardTopic.BASIC : createDeckData.topic as FlashcardTopic}
            type={mode === "edit" ? deck?.type || TypeLanguage.ENGLISH : createDeckData.type as TypeLanguage}
            onUpdate={handleUpdateDeck}
            isSaving={isUpdatingDeck}
            isCreateMode={mode === "create"}
          />
        </div>

        {/* Flashcard count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FiLayers className="w-4 h-4" />
            <span>{cardList.length} thẻ</span>
          </div>
        </div>

        {/* Flashcard List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {cardList.map((card, index) => (
              <FlashcardCardItem
                key={card._id}
                language={mode === "edit" ? deck?.type : createDeckData.type}
                flashcard={card as Flashcard}
                index={index}
                onUpdate={handleUpdateFlashcard}
                onDelete={handleDeleteFlashcard}
                isSaving={savingFlashcardId === card._id && isUpdatingFlashcard}
                isDeleting={isDeletingFlashcard}
              />
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {cardList.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8 sm:p-12 text-center">
                <FiLayers className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa có thẻ nào</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bắt đầu thêm các thẻ từ vựng cho bộ thẻ của bạn
                </p>
                <Button onClick={handleAddFlashcard} className="gap-1.5">
                  <FiPlus className="w-4 h-4" />
                  Thêm thẻ đầu tiên
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Add card button */}
          {cardList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="outline"
                onClick={handleAddFlashcard}
                disabled={isAddingFlashcard}
                className={cn(
                  "w-full h-14 border-dashed border-2",
                  "text-muted-foreground hover:text-foreground",
                  "hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                {isAddingFlashcard ? (
                  <FiLoader className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <FiPlus className="w-5 h-5 mr-2" />
                )}
                Thêm thẻ mới
              </Button>
            </motion.div>
          )}
        </div>

        {/* Bottom spacer for mobile */}
        <div className="h-20" />
      </div>
    </div>
  );
}

export default FlashcardEditor;
