import { http } from '@/lib/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const prefix = '/speaking-attempt';
// Query hook
// export const useGetAllSpeakingAttempts = (params: SpeakingAttemptParams) => {
//     return useQuery({
//         queryKey: [QUERY_KEYS.speakingAttempt.getAll, { ...params }],
//         queryFn: () => http.get(`${prefix}`, params),
//     });
// };

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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (attemptData: any) => http.patch(`${prefix}/${id}`, attemptData),
        onSuccess: () => {
            //queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.getAll] });
            //queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.findOne, id] });
        },
    });
}

// export const useGetSpeakingAttemptById = (id: string) => {
//     return useQuery({
//         queryKey: [QUERY_KEYS.speakingAttempt.findOne, id],
//         queryFn: () => http.get(`${prefix}/${id}`),
//         enabled: !!id,
//     });
// }

// Delete hook
export const useDeleteSpeakingAttempt = () => {
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingAttempt.getAll] });
        },
    });
}