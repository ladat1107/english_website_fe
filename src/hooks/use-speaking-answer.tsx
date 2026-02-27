import { http } from '@/lib/http';
import { useMutation } from '@tanstack/react-query';

const prefix = '/speaking-answer';

// Mutation hook  
export const useCreateSpeakingAnswer = () => {
    return useMutation({
        mutationFn: (answerData: any) => http.post(`${prefix}`, answerData),
    });
};

export const useUpdateAIAnalysis = () => {
    return useMutation({
        mutationFn: (id: string) => http.patch(`${prefix}/${id}/ai-analysis`)
    });
}

// =====================================================
// ADMIN GRADING HOOKS
// =====================================================

export const useUpdateSpeakingAnswer = () => {
    return useMutation({
        mutationFn: ({ answerId, data }: { answerId: string; data: any }) =>
            http.patch(`${prefix}/${answerId}`, data),
    });
}
