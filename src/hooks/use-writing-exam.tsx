import { http } from '@/lib/http';
import { WritingExamParams } from '@/types/writing.type';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const prefix = '/writing-exam';

// =====================================================
// Query hooks
// =====================================================
export const useGetAllWritingExams = (params: WritingExamParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.writingExam.getAll, params],
        queryFn: () => http.get(`${prefix}`, params),
    });
};

export const useGetWritingExamById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.writingExam.findOne, id],
        queryFn: () => http.get(`${prefix}/${id}`),
        enabled: !!id,
    });
};

// =====================================================
// Mutation hooks
// =====================================================
export const useCreateWritingExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (examData: any) => http.post(`${prefix}`, examData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingExam.getAll] });
        },
    });
};

export const useUpdateWritingExam = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (examData: any) => http.patch(`${prefix}/${id}`, examData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingExam.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingExam.findOne, id] });
        },
    });
};

export const useDeleteWritingExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingExam.getAll] });
        },
    });
};
