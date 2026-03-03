/**
 * Khailingo - Class Session Hooks
 * Hooks cho quản lý lịch học
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants/querykey";
import { RegistrationStatus } from "@/utils/constants/enum";
import {
    ClassSessionParams,
    CreateClassSessionDto,
    UpdateClassSessionDto,
} from "@/types/class-session.type";
import { http } from "@/lib/http";

const prefix = "/class-sessions"


export const useGetClassSessions = (params?: ClassSessionParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.classSession.getAll, params],
        queryFn: () => {
            return http.get(`${prefix}`, params);
        }
    });
};

export const useGetClassSessionById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.classSession.getById, id],
        queryFn: () => { return http.get(`${prefix}/${id}`); },
        enabled: !!id,
    });
};


export const useCreateClassSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClassSessionDto) => {
            return http.post(`${prefix}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getByMonth] });
        },
    });
};

export const useUpdateClassSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateClassSessionDto }) => {
            return http.patch(`${prefix}/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getById] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getByMonth] });
        },
    });
};

export const useDeleteClassSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return http.delete(`${prefix}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getByMonth] });
        },
    });
};

export const useFindMyClassSessions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.classSession.getMySessions],
        queryFn: () => {
            return http.get(`${prefix}/my-classes-sessions`);
        }
    });
};

//  Participant related hooks =======================================================================================

export const useUpdateParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ participantId, status }: { participantId: string; status: RegistrationStatus }) => {
            return http.patch(`/participants/${participantId}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getById] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getMySessions] });
        },
    });
}

export const useCancelRegistration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (participantId: string) => {
            return http.delete(`/participants/${participantId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getMySessions] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getById] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getAll] });
        },
    });
};

export const useRegisterForSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sessionId }: { sessionId: string }) => {
            return http.post(`/participants`, { class_session_id: sessionId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getById] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.classSession.getMySessions] });
        }
    });
};





