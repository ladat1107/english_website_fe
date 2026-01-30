/**
 * Khailingo - Admin Edit Speaking Exam Page
 * Trang chỉnh sửa đề giao tiếp (Admin)
 * 
 * @description
 * Page này sử dụng shared component SpeakingExamForm
 * với logic đã được tích hợp sẵn trong component.
 * Load dữ liệu đề thi từ API và populate vào form.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { SpeakingExamForm, SpeakingExamFormData } from '@/components/speaking';
import { SpeakingExam } from '@/types/speaking.type';
import { getMockSpeakingExamById } from '@/utils/mock-data/speaking.mock';

// =====================================================
// LOADING STATE COMPONENT
// =====================================================

function LoadingState() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-spin mx-auto mb-3 sm:mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">Đang tải dữ liệu...</p>
            </div>
        </div>
    );
}

// =====================================================
// NOT FOUND STATE COMPONENT
// =====================================================

interface NotFoundStateProps {
    onBack: () => void;
}

function NotFoundState({ onBack }: NotFoundStateProps) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto mb-3 sm:mb-4" />
                <h2 className="text-base sm:text-lg font-semibold mb-2">Không tìm thấy đề thi</h2>
                <p className="text-muted-foreground text-sm mb-4">
                    Đề thi này có thể đã bị xóa hoặc không tồn tại
                </p>
                <Button onClick={onBack} size="sm">
                    Quay lại danh sách
                </Button>
            </div>
        </div>
    );
}

// =====================================================
// ADMIN EDIT SPEAKING EXAM PAGE
// =====================================================

export default function AdminEditSpeakingExamPage() {
    const router = useRouter();
    const params = useParams();
    const examId = params.id as string;

    // States
    const [exam, setExam] = useState<SpeakingExam | null>(null);
    const [initialData, setInitialData] = useState<SpeakingExamFormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load exam data on mount
    useEffect(() => {
        const loadExam = async () => {
            setIsLoading(true);

            // TODO: Replace with actual API call
            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const examData = getMockSpeakingExamById(examId);

            if (examData) {
                setExam(examData);
                // Transform exam data to form data format
                setInitialData({
                    _id: examData._id,
                    title: examData.title,
                    description: examData.description || '',
                    topic: examData.topic,
                    estimated_duration_minutes: examData.estimated_duration_minutes,
                    video_url: examData.video_url,
                    video_script: examData.video_script,
                    questions: examData.questions.map(q => ({
                        question_number: q.question_number,
                        question_text: q.question_text,
                        suggested_answer: q.suggested_answer,
                    })),
                    is_published: examData.is_published,
                });
            }

            setIsLoading(false);
        };

        loadExam();
    }, [examId]);

    // Loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Not found state
    if (!exam || !initialData) {
        return <NotFoundState onBack={() => router.push('/quan-ly/giao-tiep')} />;
    }

    // Render form with data
    return (
        <SpeakingExamForm
            mode="edit"
            title="Chỉnh sửa đề giao tiếp"
            subtitle={exam.title}
            initialData={initialData}
            onSaveSuccess={() => {
                console.log('Đề thi đã được cập nhật thành công!');
            }}
            onSaveError={(error) => {
                console.error('Cập nhật đề thi thất bại:', error);
            }}
        />
    );
}
