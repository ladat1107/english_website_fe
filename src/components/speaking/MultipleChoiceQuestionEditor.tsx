"use client";

import React, { memo } from "react";
import { Control, useFieldArray, useFormContext, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Plus, Trash2, Check, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button, Input, Badge } from "@/components/ui";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import { MultipleChoiceOption, MultipleChoiceQuestion } from "@/types/speaking.type";

interface QuestionItemProps {
    index: number;
    control: Control<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    onRemove: () => void;
}

const QuestionItem = memo(function QuestionItem({
    index,
    control,
    watch,
    setValue,
    onRemove,
}: QuestionItemProps) {
    const options = watch(`multiple_choice_questions.${index}.options`) || [];
    const correctOption = watch(`multiple_choice_questions.${index}.correct_option`);

    const addOption = () => {
        const newKey = String.fromCharCode(65 + options.length); // A, B, C, D...
        const newOptions = [...options, { key: newKey, text: "" }];
        setValue(`multiple_choice_questions.${index}.options`, newOptions, { shouldDirty: true });
    };

    const removeOption = (optIndex: number) => {
        const newOptions = options.filter((_: any, i: number) => i !== optIndex);
        // Reorder keys
        const reorderedOptions = newOptions.map((opt: MultipleChoiceOption, i: number) => ({
            ...opt,
            key: String.fromCharCode(65 + i),
        }));
        setValue(`multiple_choice_questions.${index}.options`, reorderedOptions, { shouldDirty: true });

        // Reset correct_option if the selected one was removed
        const removedKey = options[optIndex]?.key;
        if (correctOption === removedKey) {
            setValue(`multiple_choice_questions.${index}.correct_option`, "", { shouldDirty: true });
        }
    };

    const selectCorrectOption = (key: string) => {
        setValue(`multiple_choice_questions.${index}.correct_option`, key, { shouldDirty: true });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative ps-5 pb-4 bg-muted/30 rounded-none border-b-2 border-blue-100"
        >
            <div className=" absolute top-1 left-0 w-4 h-4 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {index + 1}
            </div>

            {/* Delete button */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="absolute top-8 -left-1 h-6 w-6 "
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>

            {/* Question number & text */}
            <div className="flex items-start gap-3 mb-4">

                <FormField
                    control={control}
                    name={`multiple_choice_questions.${index}.question_text`}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Textarea
                                    placeholder="Nhập câu hỏi trắc nghiệm..."
                                    className="min-h-[60px] resize-y"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Options list */}
            <div className="relative space-y-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addOption}
                    title="Thêm đáp án"
                    className="absolute top-1 -left-6 w-6 h-6 text-xs gap-1 text-primary hover:text-primary"
                >
                    <Plus className="w-3.5 h-3.5" />
                </Button>
                <AnimatePresence mode="popLayout">
                    {options.map((option: MultipleChoiceOption, optIndex: number) => (
                        <motion.div
                            key={option.key + '-' + index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-2"
                        >
                            {/* Select correct option button */}
                            <button
                                type="button"
                                onClick={() => selectCorrectOption(option.key)}
                                className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center text-sm font-semibold transition-all shrink-0",
                                    correctOption === option.key
                                        ? "bg-green-500 text-white shadow-sm"
                                        : "bg-muted hover:bg-muted/80 text-foreground"
                                )}
                            >
                                {correctOption === option.key ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    option.key
                                )}
                            </button>

                            {/* Option text input */}
                            <FormField
                                control={control}
                                name={`multiple_choice_questions.${index}.options.${optIndex}.text`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                placeholder={`Đáp án ${option.key}...`}
                                                className={cn(
                                                    "h-8 text-sm transition-all rounded-none ring-0 focus-visible:ring-0 border-none",
                                                    correctOption === option.key && "text-green-600"
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Remove option button */}
                            {options.length > 2 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeOption(optIndex)}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {options.length === 0 && (
                    <p className="text-xs text-muted-foreground py-2">
                        Chưa có đáp án. Nhấn "Thêm đáp án" để bắt đầu.
                    </p>
                )}

                {/* Validation message for correct option */}
                {options.length > 0 && !correctOption && (
                    <p className="text-xs text-amber-600 mt-2">
                        Vui lòng chọn đáp án đúng
                    </p>
                )}
            </div>

            {/* Hidden inputs for question_number and correct_option */}
            <input
                type="hidden"
                value={index + 1}
                {...control.register(`multiple_choice_questions.${index}.question_number`)}
            />
        </motion.div>
    );
});

// =====================================================
// MAIN COMPONENT
// =====================================================
interface MultipleChoiceQuestionEditorProps {
    control: Control<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    register: UseFormRegister<any>;
}
export function MultipleChoiceQuestionEditor({
    control,
    watch,
    setValue,
}: MultipleChoiceQuestionEditorProps) {
    // Use useFieldArray for proper re-rendering when adding/removing questions
    const { fields, append, remove } = useFieldArray({
        control,
        name: "multiple_choice_questions",
    });
    const { getValues } = useFormContext();

    const addQuestion = () => {
        const newQuestion: MultipleChoiceQuestion = {
            question_number: fields.length + 1,
            question_text: "",
            options: [
                { key: "A", text: "" },
                { key: "B", text: "" },
                { key: "C", text: "" },
                { key: "D", text: "" },
            ],
            correct_option: "",
        };
        append(newQuestion);
    };

    const removeQuestion = (index: number) => {
        remove(index);
        // Lấy lại tất cả câu hỏi sau khi xóa để cập nhật lại question_number
        const updated = getValues("multiple_choice_questions") || [];

        updated.forEach((_: any, i: number) => {
            setValue(`multiple_choice_questions.${i}.question_number`, i + 1);
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-primary">Câu hỏi trắc nghiệm</span>
                    {fields.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {fields.length} câu
                        </Badge>
                    )}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQuestion}
                    className="gap-1.5 h-8"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm câu hỏi
                </Button>
            </div>

            {/* Questions list */}
            <AnimatePresence mode="popLayout">
                {fields.map((field, index) => (
                    <QuestionItem
                        key={field.id}
                        index={index}
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        onRemove={() => removeQuestion(index)}
                    />
                ))}
            </AnimatePresence>

            {/* Empty state */}
            {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <ListChecks className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có câu hỏi trắc nghiệm</p>
                    <p className="text-xs mt-1">Nhấn "Thêm câu hỏi" để bắt đầu</p>
                </div>
            )}
        </div>
    );
}

export default MultipleChoiceQuestionEditor;
