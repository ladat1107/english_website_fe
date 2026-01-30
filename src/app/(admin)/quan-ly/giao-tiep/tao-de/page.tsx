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
import { SpeakingExamForm } from '@/components/speaking';

// =====================================================
// ADMIN CREATE SPEAKING EXAM PAGE
// =====================================================

export default function AdminCreateSpeakingExamPage() {
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
            onSaveSuccess={() => {
                console.log('Đề thi đã được tạo thành công!');
            }}
            onSaveError={(error) => {
                console.error('Tạo đề thi thất bại:', error);
            }}
        />
    );
}
