"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useToast } from "../ui/toaster";

interface Props {
    children: ReactNode;
}

export const ReactQueryProvider: React.FC<Props> = ({ children }) => {
    const { addToast } = useToast();
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 3, // 3 phút (phù hợp web luyện đề)
                        refetchOnWindowFocus: false, // không tự động refetch khi window chuyển tab
                        retry: 1,
                    },
                    mutations: {
                        retry: 0,
                    },
                },
                queryCache: new QueryCache({
                    onError: (error: any) => {
                        handleError(error);
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error: any) => {
                        handleError(error);
                    },
                }),
            })
    );

    const handleError = (error: any) => {
        // error từ http.ts đã có sẵn các trường: message, status, code, details, data
        const status = error?.status;
        const message = error?.message || '';

        // Xử lý theo status code
        switch (status) {
            case 400:
                addToast(message || 'Dữ liệu không hợp lệ', 'error');
                break;
            case 401:
                // 401 đã được xử lý trong http.ts (refresh token hoặc redirect)
                break;
            case 403:
                // 403 đã được xử lý trong http.ts (logout + redirect)
                break;
            case 404:
                addToast(message || 'Không tìm thấy dữ liệu', 'error');
                break;
            case 409:
                addToast(message || 'Dữ liệu đã tồn tại. Vui lòng kiểm tra lại', 'error');
                break;
            case 500:
                addToast('Lỗi máy chủ, vui lòng thử lại sau', 'error');
                break;
            default:
                if (message) {
                    addToast(message, 'error');
                }
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
