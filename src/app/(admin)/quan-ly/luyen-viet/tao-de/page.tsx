/**
 * Khailingo - Admin Create Writing Exam Page
 * Trang tạo đề luyện viết mới
 */

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/utils/constants';
import { useCreateWritingExam } from '@/hooks/use-writing-exam';
import { useToast } from '@/components/ui/toaster';
import WritingExamForm, { WritingExamFormData } from '@/components/writing/writing-exam-form';
import { usePreventLeave } from '@/hooks';

export default function AdminCreateWritingExamPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const { allowNavigation } = usePreventLeave({ enabled: true });

    // Mutations
    const { mutate: createExam, isPending: isCreating } = useCreateWritingExam();

    // Handle form submission
    const handleSubmit = (data: WritingExamFormData) => {
        createExam(data, {
            onSuccess: () => {
                addToast('Tạo đề luyện viết thành công!', 'success');
                allowNavigation();
                setTimeout(() => {
                    router.push(PATHS.ADMIN.WRITING_EXAM);
                }, 100);
            },
        });
    };

    return (
        <WritingExamForm
            mode="create"
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            backUrl={PATHS.ADMIN.WRITING_EXAM}
        />
    );
}
