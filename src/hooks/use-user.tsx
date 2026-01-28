import { http } from '@/lib/http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query hook
export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => http.get('/users'),
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