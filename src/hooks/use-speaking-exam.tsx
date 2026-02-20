import { http } from '@/lib/http';
import { SpeakingExamParams } from '@/types/speaking.type';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const prefix = '/speaking-exam';
// Query hook
export const useGetAllSpeakingExams = (params: SpeakingExamParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.speakingExam.getAll, { ...params }],
        queryFn: () => http.get(`${prefix}`, params),
    });
};

// Mutation hook  
export const useCreateSpeakingExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (examData: any) => http.post(`${prefix}`, examData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingExam.getAll] });
        },
    });
};

export const useUpdateSpeakingExam = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (examData: any) => http.patch(`${prefix}/${id}`, examData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingExam.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingExam.findOne, id] });
        },
    });
}

export const useGetSpeakingExamById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.speakingExam.findOne, id],
        queryFn: () => http.get(`${prefix}/${id}`),
        enabled: !!id,
    });
}

// Delete hook
export const useDeleteSpeakingExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.speakingExam.getAll] });
        },
    });
}