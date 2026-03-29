"use client";

import ContactButton from "./ContactButton";
import ChatAIButton from "./ChatAIButton";
import { useAuth } from "@/contexts";

export default function FloatingWidgets() {
    const { isAuthenticated } = useAuth();
    return (
        <div
            className="fixed bottom-4 right-2 sm:bottom-7 sm:right-5 z-50 flex flex-col items-center gap-3"
            aria-label="Floating action buttons"
        >
            {/* Nút Liên hệ mạng xã hội */}
            <ContactButton />

            {/* Nút Chat AI */}
            {isAuthenticated && <ChatAIButton />}
        </div>
    );
}