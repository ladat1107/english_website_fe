"use client";

import { http } from '@/lib/http';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toaster';
import { FlashCardParams, SubmitStudyProgressPayload } from '@/types/flashcard.type';

const prefix = '/flash-card-deck';
const userFlashcardPrefix = '/user-flashcard';

export const useGetAllFlashcardDecks = (params?: FlashCardParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.flashcardDeck.getAll, params],
        queryFn: () => http.get(prefix, params),
    });
};

export const useGetAllFlashcardDecksForClient = (params?: FlashCardParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.flashcardDeck.getAllForClient, params],
        queryFn: () => http.get(`${prefix}/client`, params),
    });
}

export const useGetFlashcardDeck = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.flashcardDeck.findOne, id],
        queryFn: () => http.get(`${prefix}/${id}`),
        enabled: !!id,
    });
};

export const useCreateFlashcardDeck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => http.post(prefix, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAllForClient] });
        },
    });
};

/**
 * Cập nhật thông tin deck (title, description, topic, type)
 */
export const useUpdateFlashcardDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            http.patch(`${prefix}/${id}`, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.findOne, variables.id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAllForClient] });
        },
    });
};

export const useDeleteFlashcardDeck = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAllForClient] });
            addToast('Đã xóa bộ thẻ thành công', "success");
        },
    });
};

// =====================================================
// FLASHCARD MUTATIONS (Individual card operations)
// =====================================================

/**
 * Thêm flashcard mới vào deck
 */
export const useAddFlashcard = (deckId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) =>
            http.patch(`${prefix}/${deckId}/create-flashcard`, data),
        onSuccess: (newDeck) => {
            // Cập nhật cache với deck mới (có flashcard mới)
            queryClient.setQueryData([QUERY_KEYS.flashcardDeck.findOne, deckId], newDeck);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAllForClient] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAll] });
        },
    });
};

/**
 * Cập nhật flashcard (blur-to-save)
 */
export const useUpdateFlashcard = (deckId: string) => {
    return useMutation({
        mutationFn: (data: any) =>
            http.patch(`${prefix}/${deckId}/update-flashcard`, data),
    });
};

/**
 * Xóa flashcard (với optimistic update)
 */
export const useDeleteFlashcard = (deckId: string) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    return useMutation({
        mutationFn: (flashcardId: string) =>
            http.patch(`${prefix}/${deckId}/delete-flashcard`, { flashcardId }),
        onSuccess: () => {
            addToast('Đã xóa thẻ thành công', "success");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.findOne, deckId] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAllForClient] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAll] });
        },
    });
};

export const useGenerateFlashcard = () => {
    return useMutation({
        mutationFn: (word: string) =>
            http.post(`${prefix}/generate-flashcard`, { word }),
    });
};

// =====================================================
// PUBLIC & STUDY PROGRESS HOOKS
// =====================================================

/** Lấy deck công khai (cho SSR metadata, không cần auth) */
export const useGetFlashcardDeckPublic = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.flashcardDeck.findOnePublic, id],
        queryFn: () => http.get(`${prefix}/public/${id}`),
        enabled: !!id,
    });
};

/** Gửi kết quả học lên backend */
export const useSubmitStudyProgress = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: (data: SubmitStudyProgressPayload) =>
            http.patch(`${userFlashcardPrefix}/progress`, data),
        onSuccess: (_data, variables) => {
            // Invalidate deck data để cập nhật progress mới
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.flashcardDeck.findOne, variables.deck_id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.flashcardDeck.getAllForClient],
            });
        },
        onError: () => {
            addToast('Không thể lưu kết quả học', 'error');
        },
    });
};

/** Lấy danh sách deck của user (để add flashcard) */
export const useGetMyFlashcardDecks = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.flashcardDeck.getMyDecks],
        queryFn: () => http.get(`${userFlashcardPrefix}/my-decks`),
    });
};
