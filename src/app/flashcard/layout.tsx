/**
 * BeeStudy - Flashcard Layout
 * Layout chung cho các trang Flashcard
 */

import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/layout/AuthModal";

interface FlashcardLayoutProps {
    children: ReactNode;
}

export default function FlashcardLayout({ children }: FlashcardLayoutProps) {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                {children}
            </main>
            <Footer />
        </>
    );
}
