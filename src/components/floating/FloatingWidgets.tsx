"use client";

import ContactButton from "./ContactButton";
import ChatAIButton from "./ChatAIButton";
import { useAuth } from "@/contexts";

export default function FloatingWidgets() {
    const { isAuthenticated } = useAuth();
    return (
        <div
            className="fixed bottom-2 right-2 sm:bottom-4 sm:right-3 z-50 flex flex-col items-center gap-3"
            aria-label="Floating action buttons"
        >
            {/* Nút Liên hệ mạng xã hội */}
            <ContactButton />

            {/* Nút Chat AI */}
            {isAuthenticated && <ChatAIButton />}
        </div>
    );
}