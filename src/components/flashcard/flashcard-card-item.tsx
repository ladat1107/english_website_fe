"use client";

import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiLoader } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Flashcard } from "@/types/flashcard.type";
import { FlashcardImagePicker } from "./flashcard-image-picker";
import { FlashcardAutoFillButton } from "./flashcard-auto-fill-button";
import { TypeLanguage } from "@/utils/constants/enum";
import { POS_OPTIONS_EN, POS_OPTIONS_ZH } from "@/types/speaking.type";
import { AutoResizeTextarea } from "../ui/auto-resize-text-area";
import { useConfirmDialogContext } from "../ui/confirm-dialog-context";

interface FlashcardCardItemProps {
  language: TypeLanguage;
  flashcard: Flashcard;
  index: number;
  onUpdate: (data: Flashcard) => void;
  onDelete: (id: string) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function FlashcardCardItem({
  language,
  flashcard,
  index,
  onUpdate,
  onDelete,
  isSaving = false,
  isDeleting = false,
}: FlashcardCardItemProps) {
  const { confirm } = useConfirmDialogContext();

  const typeOptions = language === TypeLanguage.ENGLISH ? POS_OPTIONS_EN : POS_OPTIONS_ZH;
  const [showTypeList, setShowTypeList] = useState(false);

  // Local state để track thay đổi
  const [localData, setLocalData] = useState({
    text: flashcard.text || "",
    transliteration: flashcard.transliteration || "",
    type: flashcard.type || "",
    meaning: flashcard.meaning || "",
    examples: flashcard.examples || "",
    image_url: flashcard.image_url || "",
  });

  // Track dirty fields
  const originalRef = useRef({ ...localData });
  const [isDirty, setIsDirty] = useState(false);

  // Sync khi flashcard thay đổi từ bên ngoài
  useEffect(() => {
    const newData = {
      text: flashcard.text || "",
      transliteration: flashcard.transliteration || "",
      type: flashcard.type || "",
      meaning: flashcard.meaning || "",
      examples: flashcard.examples || "",
      image_url: flashcard.image_url || "",
    };
    setLocalData(newData);
    originalRef.current = newData;
    setIsDirty(false);
  }, [flashcard]);

  // Check if data changed
  const checkDirty = useCallback((data: typeof localData) => {
    const original = originalRef.current;
    const changed = Object.keys(data).some(
      (key) => data[key as keyof typeof data] !== original[key as keyof typeof original]
    );
    setIsDirty(changed);
    return changed;
  }, []);

  // Handle field change
  const handleChange = (field: keyof typeof localData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    checkDirty(newData);
  };

  // Handle blur - save if dirty
  const handleBlur = useCallback(() => {
    if (isDirty && !isSaving) {
      onUpdate({
        _id: flashcard._id,
        ...localData,
      });
      // Update original ref sau khi save
      originalRef.current = { ...localData };
      setIsDirty(false);
    }
  }, [isDirty, isSaving, flashcard._id, localData, onUpdate]);

  // Handle image change - save immediately
  const handleImageChange = (url: string) => {
    const newData = { ...localData, image_url: url };
    setLocalData(newData);
    onUpdate({
      _id: flashcard._id,
      ...newData,
    });
    originalRef.current = newData;
  };

  // Handle type change - save immediately
  const handleTypeChange = (value: string) => {
    const newData = { ...localData, type: value };
    setLocalData(newData);
    onUpdate({
      _id: flashcard._id,
      ...newData,
    });
    originalRef.current = newData;
  };

  // Handle AI auto-fill
  const handleAutoFill = (data: Flashcard) => {
    const newData = {
      ...localData,
      text: data.text || localData.text,
      transliteration: data.transliteration || localData.transliteration,
      type: data.type || localData.type,
      meaning: data.meaning || localData.meaning,
      examples: data.examples || localData.examples,
    };
    setLocalData(newData);
    onUpdate({
      _id: flashcard._id,
      ...newData,
    });
    originalRef.current = newData;
  };

  const handleDelete = async () => {
    confirm({
      title: "Xóa thẻ này?",
      description: `Bạn có chắc muốn xóa thẻ "${flashcard.text}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      onConfirm: () => onDelete(flashcard._id),
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "p-3 sm:p-4 relative group",
          "border transition-all duration-200",
          isDirty && "border-warning/50",
          isSaving && "border-primary/50",
          isDeleting && "opacity-50 pointer-events-none"
        )}
      >
        {/* Card number badge */}
        <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium shadow-sm">
          {index + 1}
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1.5 ">
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* AI Auto-fill button */}
            <div className="flex justify-end pt-1">
              <FlashcardAutoFillButton
                word={localData.text}
                onAutoFillSuccess={handleAutoFill}
                disabled={!localData.text.trim()}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={isDeleting}
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            >
              <FiTrash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Saving indicator */}
          {(isSaving || isDirty) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {isSaving ? (
                <>
                  <FiLoader className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">Đang lưu...</span>
                </>
              ) : isDirty ? (
                <span className="text-warning">Chưa lưu</span>
              ) : null}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="space-y-3">
          {/* Top section: Word + Image */}
          <div className="flex gap-3">
            {/* Image picker */}
            <FlashcardImagePicker
              value={localData.image_url}
              onChange={handleImageChange}
              className="flex-shrink-0"
            />

            {/* Word fields */}
            <div className="flex-1 space-y-2 min-w-0">
              {/* Word/Phrase */}
              <input
                type="text"
                value={localData.text}
                onChange={(e) => handleChange("text", e.target.value)}
                onBlur={handleBlur}
                placeholder="Từ vựng / Cụm từ"
                size={Math.max(localData.text.length, 4)}
                className={cn(
                  " bg-transparent border-b-2 border-gray-300 max-w-full min-w-56",
                  "text-base font-medium",
                  "focus:outline-none focus:border-primary/50",
                  "placeholder:text-muted-foreground/50",
                  "transition-colors"
                )}
              />

              <div className="flex flex-row items-center gap-2">
                {/* Word type select */}
                <div className="relative">
                  <input
                    type="text"
                    value={localData.type}
                    placeholder="Loại từ"
                    onFocus={() => setShowTypeList(true)}
                    onBlur={() => {
                      setTimeout(() => setShowTypeList(false), 150);
                      handleBlur();
                    }}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-20 h-7 text-xs bg-muted/50 focus:outline-none border-b-2 border-gray-300"
                  />

                  {showTypeList && (
                    <div className="absolute z-20 mt-1 w-28 bg-popover border rounded shadow-md max-h-40 overflow-auto">
                      {typeOptions.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            handleTypeChange(type.value);
                            setShowTypeList(false);
                          }}
                          className="w-full text-left px-2 py-1 text-xs hover:bg-muted"
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Transliteration */}
                <input
                  type="text"
                  value={localData.transliteration}
                  onChange={(e) => handleChange("transliteration", e.target.value)}
                  onBlur={handleBlur}
                  placeholder="/Phiên âm/"
                  size={Math.max(localData.transliteration.length, 4)}
                  className={cn(
                    "bg-transparent border-0 text-sm text-muted-foreground border-b-2 border-gray-300 min-w-40 max-w-full h-7",
                    "focus:outline-none focus:text-foreground",
                    "placeholder:text-muted-foreground/50",
                    "transition-colors"
                  )}
                />
              </div>

              {/* Meaning */}
              <AutoResizeTextarea
                value={localData.meaning}
                onChange={(e) => handleChange("meaning", e.target.value)}
                onBlur={handleBlur}
                placeholder="Nghĩa của từ / cụm từ"
                rows={1}
                className={cn(
                  "w-full bg-gray-100 rounded-lg border-0",
                  "text-sm sm:text-base",
                  "focus:outline-none focus-visible:ring-0 focus:border-0",
                  "placeholder:text-muted-foreground/50"
                )}
                style={{ minHeight: "1.5rem" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed" />

          {/* Bottom section: Meaning + Examples */}
          <div className="space-y-2">


            {/* Examples */}
            <AutoResizeTextarea
              value={localData.examples}
              onChange={(e) => handleChange("examples", e.target.value)}
              onBlur={handleBlur}
              placeholder="Ví dụ sử dụng (tùy chọn)"
              rows={1}
              className={cn(
                "w-full bg-transparent border-0 resize-none",
                "text-xs sm:text-sm text-muted-foreground",
                "focus:outline-none focus:text-foreground",
                "placeholder:text-muted-foreground/50"
              )}
              style={{ minHeight: "1.25rem" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default FlashcardCardItem;
