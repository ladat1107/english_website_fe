"use client";

import { ReactNode, useState } from "react";
import { Header, Footer } from "@/components/layout";
import { FloatingWidgets } from "../floating";
import { useTextSelection } from "@/hooks/use-selected-text";
import ContextMenu from "../menu/context-menu";
import { AddFlashcardModal } from "../flashcard/add-flashcard-modal";
import { useAuth } from "@/contexts";

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const { isAuthenticated } = useAuth();
    const { text, rect } = useTextSelection();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedText, setSelectedText] = useState("");

    const handleAdd = (text: string) => {
        setSelectedText(text);
        setModalOpen(true);
    };

    return (
        <>

            {/* Header */}
            <Header />

            {/* Main content với padding top cho header fixed */}
            <main className="pt-14 min-h-screen">
                {children}
                {isAuthenticated && <ContextMenu text={text} rect={rect} onAdd={handleAdd} />}
            </main>

            <FloatingWidgets />

            {/* Footer */}
            <Footer />

            {/* Add Flashcard Modal */}
            <AddFlashcardModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                selectedText={selectedText}
            />
        </>
    );
}
