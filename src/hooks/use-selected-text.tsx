"use client";

import { useAuth } from "@/contexts";
import { useEffect, useState } from "react";

// Kiểm tra có chứa tiếng Trung không
const hasChinese = (text: string) => {
    return /[\u4e00-\u9fff]/.test(text);
};

// Đếm số ký tự tiếng Trung (chuẩn hơn length)
const countChineseChars = (text: string) => {
    const match = text.match(/[\u4e00-\u9fff]/g);
    return match ? match.length : 0;
};

export function useTextSelection() {
    const { isAuthenticated } = useAuth();
    const [selection, setSelection] = useState<{
        text: string;
        rect: DOMRect | null;
    }>({
        text: "",
        rect: null,
    });

    useEffect(() => {
        const handleSelection = () => {
            if (!isAuthenticated) return;

            // Không trigger trong input, textarea để tránh làm phiền khi người dùng đang gõ thì làm sao?
            const active = document.activeElement;
            if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || (active as HTMLElement).isContentEditable)) {
                return;
            }

            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                setSelection({ text: "", rect: null });
                return;
            }

            const text = sel.toString().trim();

            if (!text) return;

            const isChinese = hasChinese(text);

            // ✅ Validate theo ngôn ngữ
            if (isChinese) {
                const chineseLength = countChineseChars(text);
                if (chineseLength > 5) return;
            } else {
                if (text.length < 2 || text.length > 25) return;
            }

            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setTimeout(() => {
                setSelection({ text, rect, });
            }, 100); // Delay để chắc chắn đã có text mới


        };

        const handleClear = () => {
            setSelection({ text: "", rect: null });
        };

        // ✅ Desktop
        document.addEventListener("mouseup", handleSelection);
        document.addEventListener("mousedown", handleClear);

        // ✅ Mobile
        document.addEventListener("touchend", handleSelection);
        document.addEventListener("touchstart", handleClear);

        return () => {
            document.removeEventListener("mouseup", handleSelection);
            document.removeEventListener("mousedown", handleClear);

            document.removeEventListener("touchend", handleSelection);
            document.removeEventListener("touchstart", handleClear);
        };
    }, [isAuthenticated]);

    return selection;
}