"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { FiLoader } from "react-icons/fi";
import { cn } from "@/utils/cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FlashcardTopic, TypeLanguage } from "@/utils/constants/enum";

import {
  FlashcardDeckFormData,
  flashCardTopicOptions,
} from "@/types/flashcard.type";
import { typeLanguageOptions } from "@/types/speaking.type";
import FlashcardImagePicker from "./flashcard-image-picker";

interface FlashcardDeckHeaderProps {
  title: string;
  description?: string;
  image?: string;
  topic: FlashcardTopic;
  type: TypeLanguage;
  onUpdate: (data: FlashcardDeckFormData) => void;
  isSaving?: boolean;
  isCreateMode?: boolean;
}

export function FlashcardDeckHeader({
  title,
  description,
  image,
  topic,
  type,
  onUpdate,
  isSaving = false,
  isCreateMode = false,
}: FlashcardDeckHeaderProps) {
  const [form, setForm] = useState<FlashcardDeckFormData>({ title, description, image, topic, type, });

  const [isDirty, _] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>(null);

  // sync props
  useEffect(() => {
    setForm({ title, description, image, topic, type });
  }, [title, description, image, topic, type]);

  // autosave debounce
  const triggerUpdate = (data: FlashcardDeckFormData) => {

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onUpdate({ ...data, description: data.description || undefined, });
    }, 500);
  };

  const updateField = <K extends keyof FlashcardDeckFormData>(
    key: K,
    value: FlashcardDeckFormData[K]
  ) => {
    const newForm = { ...form, [key]: value };

    setForm(newForm);
    triggerUpdate(newForm);
  };


  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 space-y-4">
        {/* Title */}
        <div className="relative">
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Tiêu đề bộ thẻ"
            className={cn(
              "w-full bg-transparent border-0",
              "text-xl sm:text-2xl md:text-3xl font-bold text-primary",
              "focus:outline-none",
              "placeholder:text-muted-foreground/50"
            )}
          />

          {(isSaving || isDirty) && !isCreateMode && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {isSaving ? (
                <FiLoader className="w-3 h-3 animate-spin" />
              ) : (
                <span className="text-warning">•</span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <textarea
          value={form.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Mô tả ngắn gọn về bộ thẻ của bạn..."
          rows={1}
          className={cn(
            "w-full bg-transparent border-0 resize-none",
            "text-sm sm:text-base text-muted-foreground",
            "focus:outline-none focus:text-foreground"
          )}
        />

        {/* Settings */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Language */}
          <Select
            value={form.type}
            onValueChange={(v) => {
              updateField("type", v as TypeLanguage);
              if (!isCreateMode) onUpdate({ ...form, type: v as TypeLanguage });
            }}
          >
            <SelectTrigger className="w-auto h-9 text-sm">
              <SelectValue placeholder="Ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              {typeLanguageOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Topic */}
          <Select
            value={form.topic}
            onValueChange={(v) => {
              updateField("topic", v as FlashcardTopic);
              if (!isCreateMode) onUpdate({ ...form, topic: v as FlashcardTopic });
            }}
          >
            <SelectTrigger className="w-auto h-9 text-sm">
              <SelectValue placeholder="Chủ đề" />
            </SelectTrigger>
            <SelectContent>
              {flashCardTopicOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <FlashcardImagePicker
          value={form.image}
          onChange={(url) => updateField("image", url)}
          className="sm:w-20 sm:h-20"
        />
      </div>
    </div>
  );
}