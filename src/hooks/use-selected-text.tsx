"use client";

import { useEffect, useState } from "react";

export function useTextSelection() {
    const [selection, setSelection] = useState<{
        text: string;
        rect: DOMRect | null;
    }>({
        text: "",
        rect: null,
    });

    useEffect(() => {

        // Không trigger trong input, textarea để tránh làm phiền khi người dùng đang gõ thì làm sao?
        const active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
            return;
        }

        const handleMouseUp = () => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                setSelection({ text: "", rect: null });
                return;
            }

            const text = sel.toString().trim();
            if (!text || text.length < 3) return;

            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setTimeout(() => {
                setSelection({ text, rect, });
            }, 100); // Delay để chắc chắn đã có text mới


        };

        const handleMouseDown = () => {
            setSelection({ text: "", rect: null });
        }

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    return selection;
}