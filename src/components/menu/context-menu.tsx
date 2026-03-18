"use client";

import { motion, AnimatePresence } from "framer-motion";
interface ContextMenuProps {
    text: string | null;
    rect: DOMRect | null;
    onAdd: (text: string) => void;
}
export default function ContextMenu({ text, rect, onAdd }: ContextMenuProps) {
    
    const handleClick = () => {
        if (text) {
            onAdd(text);
            window.getSelection()?.removeAllRanges();
        }
    };

    return (
        <AnimatePresence>
            {text && rect && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed z-[1000] pointer-events-auto"
                    style={{
                        top: rect.top + window.scrollY - 40,
                        left: rect.left + rect.width / 2,
                        transform: "translateX(-50%)",
                    }}
                >
                    <div className="bg-white shadow-xl border rounded-lg px-3 py-2 flex gap-2">
                        <button
                            onClick={handleClick}
                            className="text-sm hover:text-primary"
                        >
                            ➕ Add Flashcard
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}