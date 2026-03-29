"use client";

import { cn } from "@/utils";
import { useState } from "react";
import { Badge, Button } from "@/components/ui";
import { CheckCircle, ChevronDown, ChevronUp, Lightbulb, RefreshCw, Sparkles, XCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { AIAnalysis } from "@/types/speaking.type";
import { useUpdateWritingAIAnalysis } from "@/hooks/use-writing-answer";
import { useConfirmDialogContext } from "../ui/confirm-dialog-context";

interface AnalysisSectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
    color: 'blue' | 'red' | 'green' | 'amber';
}

function AnalysisSection({ title, icon, items, color }: AnalysisSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const colorStyles = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        red: 'bg-red-50 border-red-200 text-red-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
    };

    const dotColors = {
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        amber: 'bg-amber-500',
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="mb-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                    colorStyles[color]
                )}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                    <Badge variant="outline" size="sm" className="ml-1">
                        {items.length}
                    </Badge>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <ul className="pt-2 pl-4 space-y-1">
                            {items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                    <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", dotColors[color])} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface WrittingAnalysisProps {
    analysis: AIAnalysis;
    answerId: string;
}

const WrittingAnalysis = ({ analysis, answerId }: WrittingAnalysisProps) => {
    const { mutate: updateAI, isPending: isUpdatingAI } = useUpdateWritingAIAnalysis();
    const { confirm } = useConfirmDialogContext();

    const handleRequestAI = () => {
        confirm({
            title: 'Xác nhận yêu cầu AI',
            description: 'Bạn có chắc muốn yêu cầu AI phân tích bài viết này? Hành động này sẽ ghi đè phân tích cũ (nếu có) và không thể hoàn tác.',
            onConfirm: () => { updateAI(answerId); }
        })
    };

    const hasAIAnalysis = !!analysis;
    return (
        <div>
            <div className="text-base flex items-center justify-between mb-5">
                <span className="flex items-center gap-2 font-medium">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Phân tích AI
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRequestAI}
                    disabled={isUpdatingAI}
                >
                    <RefreshCw className={cn("w-4 h-4 mr-1", isUpdatingAI && "animate-spin")} />
                    {hasAIAnalysis ? 'Phân tích lại' : 'Yêu cầu AI'}
                </Button>
            </div>

            {
                hasAIAnalysis && analysis ? (
                    <>
                        <AnalysisSection
                            title="Lỗi sai"
                            icon={<XCircle className="w-4 h-4" />}
                            items={analysis.error || []}
                            color="red"
                        />
                        <AnalysisSection
                            title="Gợi ý cải thiện"
                            icon={<Lightbulb className="w-4 h-4" />}
                            items={analysis.improvement || []}
                            color="amber"
                        />

                        {analysis.ai_fix && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Bài viết gợi ý:
                                </p>
                                <p className="text-sm text-green-800 whitespace-pre-wrap">
                                    {analysis.ai_fix}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Chưa có phân tích AI</p>
                    </div>
                )
            }
        </div>
    )
}

export default WrittingAnalysis;
