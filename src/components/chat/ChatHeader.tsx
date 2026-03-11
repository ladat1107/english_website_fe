"use client";

/**
 * Header cửa sổ chat
 * - Gradient đỏ theo brand màu Khailingo
 * - Nút xóa lịch sử (hiện khi có tin nhắn)
 * - Nút đóng chat
 */

import { useChatStore } from "@/stores/chat.store";
import { cn } from "@/utils";
import { TrashIcon, X } from "lucide-react";
import Image from "next/image";
import { useConfirmDialogContext } from "../ui/confirm-dialog-context";

interface ChatHeaderProps {
    onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
    const { clearMessages, messages } = useChatStore();
    const { confirm } = useConfirmDialogContext();

    const handleClear = (): void => {
        confirm({
            title: "Xóa lịch sử chat",
            description: "Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat không? Hành động này không thể hoàn tác.",
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                clearMessages();
            },
        })
    };

    return (
        <div className="bg-gradient-to-r from-[#D82222] to-[#FF4444] px-4 py-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            {/* Thông tin AI */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                        <Image
                            src={"/image/chat-bot1.png"}
                            alt={"chat AI"}
                            width={25}
                            height={25}
                        />
                    </div>
                    {/* Chấm xanh - online */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>

                <div>
                    <p className="text-white text-sm font-semibold leading-tight">
                        Assistant
                    </p>
                    <p className="text-white/70 text-xs">Khailingo</p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
                {/* Nút xóa lịch sử - ẩn khi chưa có tin */}
                {messages.length > 0 && (
                    <button
                        onClick={handleClear}
                        aria-label="Xóa lịch sử chat"
                        title="Xóa lịch sử"
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            "text-white/70 hover:text-white hover:bg-white/20",
                            "transition-all duration-200"
                        )}
                    >
                        <TrashIcon />
                    </button>
                )}

                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    aria-label="Đóng chat"
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        "text-white/70 hover:text-white hover:bg-white/20",
                        "transition-all duration-200"
                    )}
                >
                    <X />
                </button>
            </div>
        </div>
    );
}