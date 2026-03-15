
"use client";


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateFlashcardDeckFormData } from '@/types/flashcard.type';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { http } from '@/lib/http';

const prefix = '/flash-card-deck';

export const useGetAllFlashcardDecks = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.flashcardDeck.getAll],
        queryFn: () => http.get(`${prefix}`),
    });
};

export const useGetFlashcardDeckById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.flashcardDeck.findOne, id],
        queryFn: () => http.get(`${prefix}/${id}`),
        enabled: !!id,
    });
};

export const useCreateFlashcardDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFlashcardDeckFormData) => http.post(`${prefix}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAll] });
        },
    });
};

export const useUpdateFlashcardDeck = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CreateFlashcardDeckFormData>) => http.patch(`${prefix}/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck.findOne, id] });
        },
    });
};

export const useDeleteFlashcardDeck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.flashcardDeck?.getAll || 'flashcard-decks'] });
        },
    });
};
