/**
 * Zustand store quản lý lịch sử chat
 * - Lưu vào localStorage qua persist middleware
 * - Tự động xóa tin nhắn sau 30 ngày
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { ChatMessage, ChatState, MessageRole, PersistedChatState } from "@/types/chat.type";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Lọc bỏ các tin nhắn đã quá 30 ngày
 */
const filterExpiredMessages = (messages: ChatMessage[]): ChatMessage[] => {
    const now = Date.now();
    return messages.filter(
        (msg) => now - new Date(msg.createdAt).getTime() < THIRTY_DAYS_MS
    );
};

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            // Danh sách tin nhắn
            messages: [],

            // Trạng thái đang chờ phản hồi AI
            isLoading: false,

            // Thêm tin nhắn mới vào store
            addMessage: (role: MessageRole, content: string): ChatMessage => {
                const newMessage: ChatMessage = {
                    id: nanoid(),
                    role,
                    content,
                    createdAt: new Date().toISOString(),
                };

                set((state) => ({
                    messages: [...state.messages, newMessage],
                }));

                return newMessage;
            },

            // Cập nhật trạng thái loading
            setLoading: (isLoading: boolean) => set({ isLoading }),

            // Xóa toàn bộ lịch sử chat
            clearMessages: () => set({ messages: [] }),

            // Xóa tin nhắn đã quá 30 ngày
            pruneExpired: () => {
                set((state) => ({
                    messages: filterExpiredMessages(state.messages),
                }));
            },
        }),
        {
            name: "chat-history",
            // Chỉ persist messages, bỏ qua isLoading
            partialize: (state): PersistedChatState => ({
                messages: state.messages,
            }),
            // Xóa tin nhắn hết hạn ngay khi rehydrate từ localStorage
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.messages = filterExpiredMessages(state.messages);
                }
            },
        }
    )
);