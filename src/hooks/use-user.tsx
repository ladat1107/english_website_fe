import { http } from '@/lib/http';
import { Achievement, LearningStats, RecentExamAttempt, RecentSpeakingAttempt, SkillProgress, UpdateProfileForm } from '@/types/profile.type';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query hook
export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => http.get('/users'),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Mutation hook  
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: any) => http.post('/users', userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

/**
 * Hook lấy thống kê học tập của user
 */
export const useGetProfileStats = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.user.profileStatus],
        queryFn: async () => {
            const response = await http.get('/users/me/stats');
            return response.data as {
                stats: LearningStats;
                skill_progress: SkillProgress[];
            };
        },
        staleTime: 5 * 60 * 1000, // 5 phút
    });
};

/**
 * Hook lấy danh sách bài thi gần đây
 */
export const useGetRecentExams = (limit: number = 5) => {
    return useQuery({
        queryKey: [QUERY_KEYS.user.examAttemptRecent, limit],
        queryFn: async () => {
            const response = await http.get(`/users/exam-attempts/me/recent?limit=${limit}`);
            return response.data as RecentExamAttempt[];
        },
        staleTime: 2 * 60 * 1000, // 2 phút
    });
};

/**
 * Hook lấy danh sách luyện nói gần đây
 */
export const useGetRecentSpeakingAttempts = (limit: number = 5) => {
    return useQuery({
        queryKey: [QUERY_KEYS.user.speakingRecent, limit],
        queryFn: async () => {
            const response = await http.get(`/users/speaking-attempts/me/recent?limit=${limit}`);
            return response.data as RecentSpeakingAttempt[];
        },
        staleTime: 2 * 60 * 1000, // 2 phút
    });
};

/**
 * Hook lấy danh sách achievements
 */
export const useGetAchievements = () => {
    return useQuery({
        queryKey: ["useGetAchievements"],
        queryFn: async () => {
            const response = await http.get('/users/me/achievements');
            return response.data as Achievement[];
        },
        staleTime: 10 * 60 * 1000, // 10 phút
    });
};

/**
 * Hook cập nhật thông tin profile
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProfileForm) => {
            const response = await http.patch('/users/me', data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate tất cả queries liên quan đến profile
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            // Cũng cần refresh auth status để cập nhật user info
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
    });
};

/**
 * Hook upload avatar
 */
export const useUploadAvatar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (avatarUrl: string) => {
            const response = await http.patch('/users/me', { avatar_url: avatarUrl });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
    });
};
