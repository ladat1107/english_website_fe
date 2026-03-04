"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vocabulary } from "@/types/speaking.type";

interface VocabularyPanelProps {
    data?: Vocabulary[] | [];
    defaultExpanded?: boolean;
}

export default function VocabularyPanel({
    data,
    defaultExpanded = true,
}: VocabularyPanelProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    if (!data || data.length === 0) {
        return null; // Không hiển thị panel nếu không có dữ liệu
    }
    return (
        <Card className="shadow-sm hover:shadow-md transition-all">
            {/* Header */}
            <CardHeader
                className="cursor-pointer select-none py-4"
                onClick={() => setExpanded((prev) => !prev)}
            >
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Từ vựng
                        <Badge variant="secondary" className="ml-1 text-xs">
                            {data.length}
                        </Badge>
                    </CardTitle>

                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        {expanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            {/* Body */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <CardContent className="pt-0 pb-4">
                            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                {data.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row items-start sm:items-center p-0 rounded-lg bg-muted/40 hover:bg-muted transition-colors shadow-sm"
                                    >
                                        <div className="flex-1 text-sm font-medium text-primary line-clamp-2">
                                            {item.vocabulary}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-0 w-full sm:w-1/2 sm:mt-1 line-clamp-2">
                                            {item.meaning}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}