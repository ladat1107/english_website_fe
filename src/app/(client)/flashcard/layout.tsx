/**
 * Khailingo - Flashcard Layout
 * Layout chung cho các trang Flashcard
 */

import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface FlashcardLayoutProps {
    children: ReactNode;
}

export default function FlashcardLayout({ children }: FlashcardLayoutProps) {
    return (
        <ClientLayout>{children}</ClientLayout>
    );
}
