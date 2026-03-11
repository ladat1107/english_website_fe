import { useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/stores/chat.store";
import { http } from "@/lib/http";

export function useAIChat() {
    const { addMessage, setLoading, isLoading } = useChatStore();

    const mutation = useMutation({
        mutationFn: (messages: { role: string; content: string }[]) => {
            console.log("Sending messages to AI:", messages);
            return http.post("/chat", { messages: messages });
        },

        onSuccess: (data) => {
            console.log("AI response:", data);
            addMessage(
                "assistant",
                data.data || "Xin lỗi, tôi không thể trả lời lúc này."
            );
        },

        onError: () => {
            addMessage("assistant", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        },

        onSettled: () => {
            setLoading(false);
        },
    });

    const sendMessage = async (userContent: string) => {
        if (!userContent.trim() || isLoading) return;

        addMessage("user", userContent.trim());
        setLoading(true);

        const { messages } = useChatStore.getState();

        mutation.mutate(
            messages.slice(-14).map((m) => ({
                role: m.role,
                content: m.content,
            }))
        );
    };

    return {
        sendMessage,
        isLoading,
    };
}