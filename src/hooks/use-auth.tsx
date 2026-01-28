import { http } from '@/lib/http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Mutation hook  
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: any) => http.post('/users', userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};