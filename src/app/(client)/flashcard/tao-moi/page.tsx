/**
 * Khailingo - Tạo Flashcard Mới (Client)
 * Trang tạo bộ flashcard cho người dùng
 */

import { FlashcardEditor } from "@/components/flashcard";

export default function CreateFlashcardPage() {
    return <FlashcardEditor mode="create" isAdmin={false} />;
}
