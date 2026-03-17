/**
 * Khailingo - Chỉnh sửa Flashcard (Admin)
 * Trang chỉnh sửa bộ flashcard cho admin
 */

"use client";

import { use } from "react";
import { FlashcardEditor } from "@/components/flashcard";

interface AdminEditFlashcardPageProps {
    params: Promise<{ id: string }>;
}

export default function AdminEditFlashcardPage({ params }: AdminEditFlashcardPageProps) {
    const { id } = use(params);

    return <FlashcardEditor mode="edit" deckId={id} isAdmin={true} />;
}
