import { http } from '@/lib/http';
import { useMutation } from '@tanstack/react-query';

const prefix = '/speaking-answer';

// Mutation hook  
export const useCreateSpeakingAnswer = () => {
    return useMutation({
        mutationFn: (answerData: any) => http.post(`${prefix}`, answerData),
    });
};
