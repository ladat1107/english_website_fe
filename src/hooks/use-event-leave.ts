'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface Options {
    enabled: boolean;
    message?: string;
    onNavigateAway?: () => void;
}

export function usePreventLeave({
    enabled,
    message = 'Những thay đổi của bạn có thể không được lưu. Bạn có chắc chắn muốn rời khỏi trang này?',
    onNavigateAway,
}: Options) {
    const pathname = usePathname();
    const allowNavigationRef = useRef(false);
    const isHandlingPopStateRef = useRef(false);

    const handleAllowedNavigation = useCallback(() => {
        allowNavigationRef.current = true;
        onNavigateAway?.();
    }, [onNavigateAway]);

    useEffect(() => {
        if (!enabled) return;

        // ========================
        // 1. Reload / đóng tab
        // ========================
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!allowNavigationRef.current) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        // ========================
        // 2. Click Link / <a>
        // ========================
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a');

            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;
            if (anchor.target === '_blank') return;
            if (href.startsWith('#')) return;

            if (!window.confirm(message)) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                allowNavigationRef.current = true;
            }
        };

        // ========================
        // 3. Back / Forward
        // ========================
        const handlePopState = (_e: PopStateEvent) => {
            // Nếu đã cho phép navigation, không làm gì cả
            if (allowNavigationRef.current) {
                return;
            }

            // Tránh xử lý nhiều lần cùng một event
            if (isHandlingPopStateRef.current) {
                return;
            }

            isHandlingPopStateRef.current = true;
        
            if (window.confirm(message)) {
                console.log('User confirmed - allowing navigation');
                allowNavigationRef.current = true;
                onNavigateAway?.();
                // Không gọi history.back() ở đây!
                // Thay vào đó, reload lại trang trước đó bằng cách xóa listener và back
                isHandlingPopStateRef.current = false;
                window.removeEventListener('popstate', handlePopState);
                window.history.back();
            } else {
                // Push state để ở lại trang hiện tại
                window.history.pushState(null, document.title, window.location.href);
                isHandlingPopStateRef.current = false;
            }
        };

        // Thêm một entry vào history khi component mount
        window.history.pushState(null, document.title, window.location.href);

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleClick, true);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('click', handleClick, true);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [enabled, message, pathname, onNavigateAway, handleAllowedNavigation]);

    return {
        allowNavigation: handleAllowedNavigation,
    };
}