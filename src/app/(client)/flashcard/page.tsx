import { FlashcardClient } from "@/components/flashcard/flashcard-client";
import { Metadata } from "next";
import { FiLayers } from "react-icons/fi";

export const metadata: Metadata = {
    title: "Flashcard - Học từ vựng IELTS hiệu quả",
    description: "Học từ vựng IELTS hiệu quả với phương pháp Spaced Repetition. Hơn 5000+ từ vựng được phân loại theo chủ đề.",
};

export default function FlashcardPage() {
    return (
        <div className="py-8">
            <div className="container-custom">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
                        <FiLayers className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-primary">Flashcard</span> Từ vựng IELTS
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Học từ vựng hiệu quả với phương pháp Spaced Repetition.
                        Toàn bộ từ vựng được phân loại theo chủ đề và cấp độ.
                    </p>
                </div>

                {/* Flashcard Decks */}
                <FlashcardClient />

                {/* How it works */}
                <div className="mt-16 p-8 bg-secondary/50 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 text-center">🧠 Phương pháp Spaced Repetition</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">1</span>
                            </div>
                            <h4 className="font-medium mb-1">Học từ mới</h4>
                            <p className="text-sm text-muted-foreground">
                                Xem mặt trước và cố gắng nhớ nghĩa
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">2</span>
                            </div>
                            <h4 className="font-medium mb-1">Kiểm tra</h4>
                            <p className="text-sm text-muted-foreground">
                                Lật thẻ và đánh giá mức độ nhớ
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">3</span>
                            </div>
                            <h4 className="font-medium mb-1">Lặp lại</h4>
                            <p className="text-sm text-muted-foreground">
                                Hệ thống tự động lên lịch ôn tập
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">4</span>
                            </div>
                            <h4 className="font-medium mb-1">Ghi nhớ lâu</h4>
                            <p className="text-sm text-muted-foreground">
                                Từ vựng được lưu vào trí nhớ dài hạn
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
