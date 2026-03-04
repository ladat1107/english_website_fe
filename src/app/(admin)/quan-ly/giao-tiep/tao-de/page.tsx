
"use client";

import React from 'react';
import { SpeakingExamForm, SpeakingExamFormData } from '@/components/speaking';
import { useCreateSpeakingExam } from '@/hooks/use-speaking-exam';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/utils/constants';
import { usePreventLeave } from '@/hooks';

// =====================================================
// ADMIN CREATE SPEAKING EXAM PAGE
// =====================================================

export default function AdminCreateSpeakingExamPage() {

    const { mutate: createExam, isPending } = useCreateSpeakingExam();
    const router = useRouter();
    const { allowNavigation } = usePreventLeave({ enabled: true });

    const handleSave = (data: SpeakingExamFormData) => {
        // Gọi API để tạo đề thi mới
        createExam(data, {
            onSuccess: () => {
                allowNavigation(); // Cho phép rời trang sau khi đã lưu thành công
                router.push(PATHS.ADMIN.SPEAKING_EXAM);
            }
        });
    };
    return (
        <SpeakingExamForm
            mode="create"
            title="Tạo đề giao tiếp mới"
            subtitle="Điền thông tin để tạo bài luyện giao tiếp"
            showPreview={true}
            onPreview={() => {
                // TODO: Implement preview modal
                console.log('Preview exam');
            }}
            onSaveSuccess={handleSave}
            onSaveError={(error) => {
                console.error('Tạo đề thi thất bại:', error);
            }}
            isSaving={isPending}
        />
    );
}
