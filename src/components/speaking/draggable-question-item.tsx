/**
 * DraggableQuestionItem - Component hiển thị 1 câu hỏi có thể kéo thả
 * 
 * @description
 * Đây là component RIÊNG cho Questions Section.
 * Chứa UI cụ thể: số thứ tự, textarea câu hỏi, textarea gợi ý, nút xóa.
 * Sử dụng SortableItem từ thư mục dnd/ làm wrapper.
 */

import React, { memo } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import { GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SortableItem } from "@/components/dnd";
import { cn } from "@/utils/cn";
import type { SpeakingExamFormValues } from "./SpeakingExamForm";

// =====================================================
// TYPES
// =====================================================

interface DraggableQuestionItemProps {
    /** ID duy nhất của item (từ useFieldArray) */
    id: string;

    /** Vị trí index trong mảng questions */
    index: number;

    /** Control từ React Hook Form */
    control: Control<SpeakingExamFormValues>;

    /** Register function từ form (để register hidden field) */
    register: UseFormRegister<SpeakingExamFormValues>;

    /** Callback khi nhấn nút xóa */
    onRemove: (index: number) => void;
}

// =====================================================
// COMPONENT
// =====================================================

export const DraggableQuestionItem = memo(function DraggableQuestionItem({
    id,
    index,
    control,
    register,
    onRemove,
}: DraggableQuestionItemProps) {

    return (
        <SortableItem
            id={id}
            // Class khi đang kéo: thêm viền primary và shadow
            draggingClassName="opacity-90 shadow-xl border-primary bg-background"
            className="transition-all duration-200"
        >
            {({ dragHandleProps, isDragging }) => (
                // Container chính của câu hỏi
                <div
                    className={cn(
                        "p-3 sm:p-4 border border-border rounded-xl bg-muted/30",
                        // Hover effect khi không drag
                        !isDragging && "hover:border-muted-foreground/30",
                        // Style khi đang drag
                        isDragging && "border-primary ring-2 ring-primary/20"
                    )}
                >
                    <div className="flex items-start gap-2 sm:gap-3">

                        {/* ===== DRAG HANDLE - Nút để kéo ===== */}
                        <button
                            type="button"
                            className={cn(
                                // Style cơ bản
                                "mt-2 p-1 rounded touch-none",
                                "text-muted-foreground hover:text-foreground",
                                "hover:bg-muted transition-colors duration-200",
                                // Cursor grab khi hover, grabbing khi đang kéo
                                isDragging ? "cursor-grabbing" : "cursor-grab",
                                // Focus visible cho accessibility
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            )}
                            // Gắn các props từ dnd-kit
                            {...dragHandleProps.attributes}
                            {...dragHandleProps.listeners}
                            // Ngăn không cho focus vào button (tránh conflict với drag)
                            tabIndex={-1}
                        >
                            <GripVertical className="w-5 h-5" />
                        </button>

                        {/* ===== SỐ THỨ TỰ ===== */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 mt-1">
                            {index + 1}
                        </div>

                        {/* ===== NỘI DUNG CÂU HỎI ===== */}
                        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">

                            {/* Input: Nội dung câu hỏi */}
                            <FormField
                                control={control}
                                name={`questions.${index}.question_text`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nội dung câu hỏi (VD: What do you usually do on weekends?)"
                                                className="min-h-[60px] sm:min-h-[80px] resize-y"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Input: Gợi ý trả lời */}
                            <FormField
                                control={control}
                                name={`questions.${index}.suggested_answer`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Gợi ý trả lời (tùy chọn)"
                                                className="min-h-[50px] sm:min-h-[60px] resize-y"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Hidden field: question_number 
                                Được tự động cập nhật khi đổi thứ tự */}
                            <input
                                type="hidden"
                                {...register(`questions.${index}.question_number`)}
                                value={index + 1}
                            />
                        </div>

                        {/* ===== NÚT XÓA ===== */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(index)}
                            className="text-destructive hover:bg-destructive/10 shrink-0"
                            // Tooltip có thể thêm sau
                            aria-label={`Xóa câu hỏi ${index + 1}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </SortableItem>
    );
});

export default DraggableQuestionItem;