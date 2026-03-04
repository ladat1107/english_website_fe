import { TypeLanguage } from "@/utils/constants/enum"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type SpeakingExamState = {
    type: TypeLanguage;
    setType: (value: TypeLanguage) => void;
    clearType: () => void;
}

export const useSpeakingExamStore = create<SpeakingExamState>()(
    persist(
        (set) => ({
            type: TypeLanguage.ENGLISH, // Mặc định là tiếng Anh

            setType: (value: TypeLanguage) => set({ type: value }),

            clearType: () => set({ type: TypeLanguage.ENGLISH }),
        }),
        {
            name: "speaking-exam-storage", // key trong localStorage
        }
    )
)