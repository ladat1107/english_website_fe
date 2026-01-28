"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface Props {
    children: ReactNode;
}

export const ReactQueryProvider: React.FC<Props> = ({ children }) => {
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
        // Parse error message từ backend
        //const message = error?.message || 'Có lỗi xảy ra';

        // Xử lý theo status code
        if (error?.status === 404) {
            alert('Không tìm thấy dữ liệu');
            // toast.error('Không tìm thấy dữ liệu');
        } else if (error?.status === 409) {
            alert('Dữ liệu đã tồn tại hoặc xung đột');
            //toast.error('Dữ liệu đã tồn tại hoặc xung đột');
        } else if (error?.status === 500) {
            alert('Lỗi máy chủ, vui lòng thử lại sau');
            // toast.error('Lỗi máy chủ, vui lòng thử lại sau');
        } 
    };

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
