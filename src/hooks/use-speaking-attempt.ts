import { http } from '@/lib/http';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { useMutation, useQuery } from '@tanstack/react-query';

const prefix = '/speaking-attempt';

// Query hooks
export const useGetSpeakingAttemptHistory = (examId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.speakingAttempt.history, examId],
        queryFn: () => http.get(`${prefix}/history/${examId}`),
        enabled: !!examId,
    });
};

export const useGetSpeakingAttemptDetail = (attemptId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.speakingAttempt.detail, attemptId],
        queryFn: () => http.get(`${prefix}/detail/${attemptId}`),
        enabled: !!attemptId,
    });
};

// Mutation hook  
export const useCreateSpeakingAttempt = () => {
    return useMutation({
        mutationFn: (attemptData: any) => http.post(`${prefix}`, attemptData),
    });
};

export const useSubmitSpeakingAttempt = () => {
    return useMutation({
        mutationFn: (attemptId: string) => http.patch(`${prefix}/${attemptId}/submit`)
    });
};

export const useUpdateSpeakingAttempt = (id: string) => {
    return useMutation({
        mutationFn: (attemptData: any) => http.patch(`${prefix}/${id}`, attemptData),
    });
}

// Delete hook
export const useDeleteSpeakingAttempt = () => {
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.getAll] });
        },
    });
}