"use client";

import { cn } from "@/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chat.type";
import dayjs from "dayjs";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useTyping } from "@/hooks/use-typing";
import { useEffect, useState } from "react";

// Avatar robot cho AI
const BotAvatar: React.FC = () => (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D82222] to-[#FF6B6B] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Image
            src={"/image/chat-bot1.png"}
            alt={"chat AI"}
            width={20}
            height={20}
        />
    </div>
);

interface ChatMessageProps {
    message: ChatMessageType;
    isLatest?: boolean;
    onTyping?: () => void;
}

export default function ChatMessage({ message, isLatest, onTyping }: ChatMessageProps) {
    const isUser = message.role === "user";
    const [isShowTimestamp, setIsShowTimestamp] = useState(false);

    const isTyping: boolean = (!isUser && isLatest) || false;

    const animatedText = useTyping(message.content, isTyping);

    useEffect(() => {
        onTyping?.();
    }, [animatedText]);


    return (
        <div
            className={cn(
                "flex gap-2 animate-fade-in-up",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar chỉ hiện cho AI */}
            {!isUser && <BotAvatar />}

            <div
                className={cn(
                    "max-w-[78%] flex flex-col gap-1",
                    isUser ? "items-end" : "items-start"
                )}
            >
                {/* Nội dung bong bóng */}
                <div
                    className={cn(
                        "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                        "break-words",
                        isUser
                            ? "bg-[#D82222] text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-800 rounded-tl-sm border border-gray-100"
                    )}
                    onClick={() => setIsShowTimestamp(!isShowTimestamp)}
                >
                    <ReactMarkdown components={{
                        p: ({ children }) => <p className="m-0">{children}</p>,
                        ul: ({ children }) => <ul className="my-1 pl-4 list-disc">{children}</ul>,
                        ol: ({ children }) => <ol className="my-1 pl-4 list-decimal">{children}</ol>,
                        li: ({ children }) => <li className="my-0">{children}</li>,
                    }}>
                        {animatedText}
                    </ReactMarkdown>
                </div>

                {/* Timestamp */}
                {(isShowTimestamp || isLatest) &&
                    <span className="text-[10px] text-gray-400 px-1">
                        {dayjs(message.createdAt).format("DD/MM HH:mm")}
                    </span>
                }
            </div>
        </div>
    );
}