/**
 * Khailingo - Admin Create Speaking Exam Page
 * Trang tạo đề giao tiếp mới (Admin)
 * 
 * @description
 * Page này sử dụng shared component SpeakingExamForm
 * với logic đã được tích hợp sẵn trong component.
 */

"use client";

import React from 'react';
import { SpeakingExamForm, SpeakingExamFormData } from '@/components/speaking';
import { useCreateSpeakingExam } from '@/hooks/use-speaking-exam';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/utils/constants';

// =====================================================
// ADMIN CREATE SPEAKING EXAM PAGE
// =====================================================

export default function AdminCreateSpeakingExamPage() {

    const { mutate: createExam, isPending } = useCreateSpeakingExam();
    const router = useRouter();
    
    const handleSave = (data: SpeakingExamFormData) => {
        // Gọi API để tạo đề thi mới
        createExam(data,{
            onSuccess:()=>{
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
