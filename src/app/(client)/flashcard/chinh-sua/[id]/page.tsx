/**
 * Khailingo - Chỉnh sửa Flashcard (Client)
 * Trang chỉnh sửa bộ flashcard cho người dùng
 */

"use client";

import { use } from "react";
import { FlashcardEditor } from "@/components/flashcard";

interface EditFlashcardPageProps {
    params: Promise<{ id: string }>;
}

export default function EditFlashcardPage({ params }: EditFlashcardPageProps) {
    const { id } = use(params);

    return <FlashcardEditor mode="edit" deckId={id} isAdmin={false} />;
}
