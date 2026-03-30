"use client";

import React, { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingCustom from '@/components/ui/loading-custom';
import { PATHS } from '@/utils/constants';
import { useGetWritingExamById, useUpdateWritingExam } from '@/hooks/use-writing-exam';
import { useToast } from '@/components/ui/toaster';
import WritingExamForm, { WritingExamFormData } from '@/components/writing/writing-exam-form';
import { WritingExam } from '@/types/writing.type';
import { usePreventLeave } from '@/hooks';

export default function AdminEditWritingExamPage() {
    const router = useRouter();
    const params = useParams();
    const examId = params.id as string;
    const { addToast } = useToast();
    const { allowNavigation } = usePreventLeave({ enabled: true });

    // Queries & Mutations
    const { data: examRes, isLoading } = useGetWritingExamById(examId);
    const { mutate: updateExam, isPending: isUpdating } = useUpdateWritingExam(examId);

    // Prepare default values from fetched data
    const defaultValues: WritingExamFormData | undefined = useMemo(() => {
        if (!examRes?.data) return undefined;

        const exam: WritingExam = examRes.data;
        return {
            title: exam.title,
            content: exam.content,
            images: exam?.images || [],
            vocabularies: exam?.vocabularies || [],
            level: exam.level,
            type: exam.type,
            is_published: exam.is_published,
            suggest: exam?.suggest || '',
        };
    }, [examRes]);

    // Handle form submission
    const handleSubmit = (data: WritingExamFormData) => {
        updateExam(data, {
            onSuccess: () => {
                addToast('Cập nhật đề thành công!', 'success');
                allowNavigation();
                setTimeout(() => {
                    router.push(PATHS.ADMIN.WRITING_EXAM);
                }, 100);
            },
        });
    };

    if (isLoading) {
        return <LoadingCustom className="min-h-screen" />;
    }

    return (
        <WritingExamForm
            mode="edit"
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
            backUrl={PATHS.ADMIN.WRITING_EXAM}
        />
    );
}
