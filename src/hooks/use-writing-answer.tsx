import { useToast } from '@/components/ui/toaster';
import { http } from '@/lib/http';
import { CreateWritingAnswerDto, UpdateWritingAnswerDto, WritingAnswerParams } from '@/types/writing.type';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const prefix = '/writing-answer';

// =====================================================
// Query hooks
// =====================================================
export const useGetAllWritingAnswers = (params: WritingAnswerParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.writingAnswer.getAll, { ...params }],
        queryFn: () => http.get(`${prefix}`, params),
    });
};

export const useGetWritingAnswerById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.writingAnswer.findOne, id],
        queryFn: () => http.get(`${prefix}/${id}`),
        enabled: !!id,
    });
};

export const useGetWritingAnswersByExam = (examId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.writingAnswer.byExam, examId],
        queryFn: () => http.get(`${prefix}/exam/${examId}`),
        enabled: !!examId,
    });
};

export const useGetPinnedAnswers = (examId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.writingAnswer.pinned, examId],
        queryFn: () => http.get(`${prefix}/exam/${examId}/pinned`),
        enabled: !!examId,
    });
};

export const useGetWritingHistory = (examId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.writingAnswer.history, examId],
        queryFn: () => http.get(`${prefix}/history/${examId}`),
        enabled: !!examId,
    });
};

// =====================================================
// Mutation hooks
// =====================================================
export const useCreateWritingAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateWritingAnswerDto) => http.post(`${prefix}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.history, variables.writing_exam_id] });
        },
    });
};

export const useUpdateWritingAnswer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWritingAnswerDto }) =>
            http.patch(`${prefix}/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.history] });
        },
    });
};

export const useUpdateWritingAIAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => http.patch(`${prefix}/${id}/ai-analysis`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.history] });

        },
    });
};

export const useTogglePinWritingAnswer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => http.patch(`${prefix}/${id}/toggle-pin`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.pinned] });
        },
    });
};

export const useDeleteWritingAnswer = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.history] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.writingAnswer.pinned] });
            addToast("Xóa bài viết thành công", "success");
        },
    });
};
