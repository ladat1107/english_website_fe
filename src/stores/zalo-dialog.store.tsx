// store/ad-modal.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ZaloDialogState {
    isOpen: boolean;
    closeCount: number;
    lastClosedAt: number | null;
    lastJoinClickAt: number | null;
    lastSessionShown: number | null;

    open: () => void;
    close: () => void;
    clickJoin: () => void;
    markSessionShown: () => void;
}

export const useZaloDialog = create<ZaloDialogState>()(
    persist(
        (set) => ({
            isOpen: false,
            closeCount: 0,
            lastClosedAt: null,
            lastJoinClickAt: null,
            lastSessionShown: null,

            open: () => set({ isOpen: true }),
            close: () =>
                set((state) => ({
                    isOpen: false,
                    closeCount: state.closeCount + 1,
                    lastClosedAt: Date.now(),
                })),

            clickJoin: () =>
                set({
                    isOpen: false,
                    lastJoinClickAt: Date.now(),
                }),

            markSessionShown: () => set({ lastSessionShown: Date.now() }),
        }),
        {
            name: "zalo-dialog-storage",
        }
    )
);