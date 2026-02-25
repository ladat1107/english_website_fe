"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { SpeakingExamForm, SpeakingExamFormData } from '@/components/speaking';
import { SpeakingExam } from '@/types/speaking.type';
import { useGetSpeakingExamById, useUpdateSpeakingExam } from '@/hooks/use-speaking-exam';
import { PATHS } from '@/utils/constants';
import LoadingCustom from '@/components/ui/loading-custom';
import { useConfirmDialogContext } from '@/components/ui/confirm-dialog-context';
import { useToast } from '@/components/ui/toaster';


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

    const { data: speakingExamResponse, isLoading: isExamLoading } = useGetSpeakingExamById(examId);
    const { mutate: updateExam, isPending: isUpdating } = useUpdateSpeakingExam(examId);
    const { confirm } = useConfirmDialogContext();
    const { addToast } = useToast();
    // States
    const [exam, setExam] = useState<SpeakingExam | null>(null);
    const [initialData, setInitialData] = useState<SpeakingExamFormData | null>(null);

    // Load exam data on mount
    useEffect(() => {
        if (speakingExamResponse) {
            setExam(speakingExamResponse.data);
            const examData: SpeakingExam = speakingExamResponse.data;
            setInitialData({
                _id: examData._id,
                title: examData.title,
                description: examData.description || '',
                topic: examData.topic,
                estimated_duration_minutes: examData.estimated_duration_minutes,
                video_url: examData.video_url,
                video_script: examData.video_script,
                thumbnail: examData.thumbnail || '',
                questions: examData.questions.map(q => ({
                    question_number: q.question_number,
                    question_text: q.question_text,
                    suggested_answer: q.suggested_answer,
                })),
                is_published: examData.is_published,
            });
        }
    }, [speakingExamResponse]);

    // Loading state
    if (isExamLoading) {
        return <LoadingCustom />;
    }

    // Not found state
    if (!exam || !initialData) {
        return <NotFoundState onBack={() => router.push(PATHS.ADMIN.SPEAKING_EXAM)} />;
    }

    const handleUpdate = (data: SpeakingExamFormData) => {
        confirm({
            title: 'Xác nhận cập nhật đề thi',
            description: 'Bạn có chắc chắn muốn cập nhật đề thi này không?',
            confirmText: 'Cập nhật',
            cancelText: 'Hủy',
            onConfirm: () => {
                updateExam(data, {
                    onSuccess: () => {
                        router.push(PATHS.ADMIN.SPEAKING_EXAM);
                        addToast("Cập nhật đề thi thành công", "success");
                    },
                });
            }
        })

    }

    // Render form with data
    return (
        <SpeakingExamForm
            mode="edit"
            title="Chỉnh sửa đề giao tiếp"
            subtitle={exam.title}
            initialData={initialData}
            isSaving={isUpdating}
            onSaveSuccess={handleUpdate}
            onSaveError={(error) => {
                console.error('Cập nhật đề thi thất bại:', error);
            }}
        />
    );
}
