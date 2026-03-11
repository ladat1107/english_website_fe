/**
 * Định nghĩa kiểu dữ liệu dùng chung cho toàn dự án
 */

/** Role của người tham gia hội thoại */
export type MessageRole = "user" | "assistant";

/** Cấu trúc một tin nhắn chat */
export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: string; // ISO 8601 string
}

/** Payload gửi lên API /api/chat */
export interface ChatRequestBody {
    messages: Pick<ChatMessage, "role" | "content">[];
}

/** Response trả về từ API /api/chat */
export interface ChatApiResponse {
    content: string;
    error?: string;
}

/** Cấu trúc response từ Anthropic API */
export interface AnthropicContentBlock {
    type: "text" | "tool_use";
    text?: string;
}

export interface AnthropicApiResponse {
    content: AnthropicContentBlock[];
    id: string;
    model: string;
    role: "assistant";
    stop_reason: string;
}

/** State của Zustand chat store */
export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    addMessage: (role: MessageRole, content: string) => ChatMessage;
    setLoading: (isLoading: boolean) => void;
    clearMessages: () => void;
    pruneExpired: () => void;
}

/** Phần state được persist vào localStorage */
export type PersistedChatState = Pick<ChatState, "messages">;

/** Kênh liên hệ mạng xã hội */
export interface ContactChannel {
    id: string;
    label: string;
    image: string;
    href: string;
}