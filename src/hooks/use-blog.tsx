import { BlogSchema } from '@/components/blog/blog-form';
import { http } from '@/lib/http';
import { BlogParams } from '@/types/blog.type';
import { QUERY_KEYS } from '@/utils/constants/querykey';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const prefix = '/blog';

// =====================================================
// QUERY HOOKS
// =====================================================

/**
 * Lấy danh sách blog - hỗ trợ filter, search, pagination
 */
export const useGetAllBlogs = (params: BlogParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.blog.getAll, { ...params }],
        queryFn: () => http.get(`${prefix}`, params),
    });
};

/**
 * Lấy danh sách blog public (cho client pages)
 */
export const useGetPublicBlogs = (params: BlogParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.blog.getPublic, { ...params }],
        queryFn: () => http.get(`${prefix}`, { ...params, is_public: true }),
    });
};

/**
 * Lấy chi tiết blog theo ID
 */
export const useGetBlogById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.blog.findOne, id],
        queryFn: () => http.get(`${prefix}/${id}`),
        enabled: !!id,
    });
};

/**
 * Lấy blog theo category
 */
export const useGetBlogsByCategory = (category: string, params: BlogParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.blog.getByCategory, category, { ...params }],
        queryFn: () => http.get(`${prefix}`, { ...params, category, is_public: true }),
        enabled: !!category,
    });
};

// =====================================================
// MUTATION HOOKS
// =====================================================

/**
 * Tạo blog mới
 */
export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BlogSchema) => http.post(`${prefix}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.getPublic] });
        },
    });
};

/**
 * Cập nhật blog
 */
export const useUpdateBlog = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => http.patch(`${prefix}/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.findOne, id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.getPublic] });
        },
    });
};

/**
 * Xóa blog
 */
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => http.delete(`${prefix}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.getAll] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.getPublic] });
        },
    });
};
