import { http } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { AuthStatusResponse } from '@/types/auth.type';

// Query hook
export const useCheckStatus = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.auth.checkStatus],
        queryFn: () => http.get('/auth/status'),
        select: (data) => data.data as AuthStatusResponse,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

