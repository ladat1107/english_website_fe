// hooks/useZaloDialogTrigger.ts
import { useEffect, useRef } from "react";
import { useZaloDialog } from "@/stores/zalo-dialog.store";

export const useZaloDialogTrigger = () => {
    // 👇 Lấy state bằng selectors để tránh rerender toàn component
    const open = useZaloDialog((s) => s.open);
    const markSessionShown = useZaloDialog((s) => s.markSessionShown);

    const lastClosedAt = useZaloDialog((s) => s.lastClosedAt);
    const lastJoinClickAt = useZaloDialog((s) => s.lastJoinClickAt);
    const closeCount = useZaloDialog((s) => s.closeCount);
    const lastSessionShown = useZaloDialog((s) => s.lastSessionShown);

    // 👇 Tránh tạo lại timer nhiều lần
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const now = Date.now();

        // 1. Nếu user bấm Join → ẩn 7 ngày
        if (lastJoinClickAt && now - lastJoinClickAt < 7 * 86400000) return;

        // 2. Tính delay theo số lần đóng
        const delayDays =
            closeCount > 3 ? 5 :
                closeCount > 0 ? 3 : 0;

        // 2a. Kiểm tra user vừa đóng modal → delay theo closeCount
        if (lastClosedAt && now - lastClosedAt < delayDays * 86400000) return;

        // 3. Không cho mở trong cùng session 30 phút
        if (lastSessionShown && now - lastSessionShown < 30 * 60 * 1000) return;

        // 4. Set timer 12 giây (an toàn — luôn check lại trước khi mở)
        timerRef.current = setTimeout(() => {
            const now2 = Date.now();

            // Check lần nữa trước khi mở (đề phòng user close/join trong khi timer đang chạy)
            if (lastJoinClickAt && now2 - lastJoinClickAt < 7 * 86400000) return;
            if (lastClosedAt && now2 - lastClosedAt < delayDays * 86400000) return;
            if (lastSessionShown && now2 - lastSessionShown < 30 * 60 * 1000) return;

            open();
            markSessionShown();
        }, 12000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };

   
    }, [
        lastClosedAt,
        lastJoinClickAt,
        closeCount,
        lastSessionShown,
        open,
        markSessionShown,
    ]);
};