/**
 * Khailingo - Tạo Flashcard Mới (Admin)
 * Trang tạo bộ flashcard cho admin
 */

import { FlashcardEditor } from "@/components/flashcard";

export default function AdminCreateFlashcardPage() {
    return <FlashcardEditor mode="create" isAdmin={true} />;
}
