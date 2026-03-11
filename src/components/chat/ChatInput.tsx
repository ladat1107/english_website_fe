"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/utils";
import { SendIcon } from "lucide-react";
import { Textarea } from "../ui";


interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}
const MAX_ROWS = 4;
const LINE_HEIGHT = 24; // px (leading-relaxed ~24px)

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const maxHeight = MAX_ROWS * LINE_HEIGHT;

    if (el.scrollHeight > maxHeight) {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = "auto";
    } else {
      el.style.height = `${el.scrollHeight}px`;
      el.style.overflowY = "hidden";
    }
  }, [value]);

  const handleSend = (): void => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    // Enter gửi tin, Shift+Enter xuống dòng
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-2 p-3 bg-white">
      <Textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Nhắn tin..."
        className={cn(
          "flex-1 resize-none rounded-2xl px-3.5 py-2.5 text-sm",
          "bg-gray-100 border-none text-gray-800",
          "placeholder:text-gray-400 outline-none",
          "focus-visible:ring-0 ",
          "transition-all duration-200 leading-relaxed",
          "max-h-[96px] min-h-6", // ~4 dòng
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />

      <button
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Gửi tin nhắn"
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
          "transition-all duration-200",
          canSend
            ? "bg-[#D82222] text-white hover:bg-[#B91C1C] active:scale-95 shadow-md hover:shadow-lg"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </div>
  );
}