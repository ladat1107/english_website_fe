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
                        "relative border rounded-xl p-4 bg-muted/30 transition-all",
                        isDragging && "border-primary ring-2 ring-primary/20"
                    )}
                >
                    {/* Drag handle – fixed top-left */}
                    <button
                        type="button"
                        className={cn(
                            "absolute top-1/2 left-2 p-1 rounded",
                            "text-muted-foreground hover:text-foreground hover:bg-muted",
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                        )}
                        {...dragHandleProps.attributes}
                        {...dragHandleProps.listeners}
                        tabIndex={-1}
                    >
                        <GripVertical className="w-5 h-5" />
                    </button>

                    {/* Delete button – fixed top-right */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(index)}
                        className="absolute -top-2 -right-2 text-destructive hover:bg-destructive/10"
                        aria-label="Xóa câu hỏi"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Nội dung chính */}
                    <div className="flex items-start gap-2 mt-1">
                        {/* Index */}
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                            {index + 1}
                        </div>

                        <div className="space-y-3 flex-1">
                            {/* Nội dung câu hỏi */}
                            <FormField
                                control={control}
                                name={`questions.${index}.question_text`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nội dung câu hỏi…"
                                                className="min-h-[80px] resize-y w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gợi ý */}
                            <FormField
                                control={control}
                                name={`questions.${index}.suggested_answer`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Gợi ý trả lời (tùy chọn)…"
                                                className="min-h-[70px] resize-y w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <input
                                type="hidden"
                                {...register(`questions.${index}.question_number`)}
                                value={index + 1}
                            />
                        </div>
                    </div>
                </div>
            )}
        </SortableItem>
    );
});

export default DraggableQuestionItem;