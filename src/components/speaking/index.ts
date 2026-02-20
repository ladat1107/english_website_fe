/**
 * Khailingo - Speaking Components Index
 * Export tất cả components của module Speaking
 */

// Audio Recorder - Ghi âm
export { AudioRecorder } from './AudioRecorder';

export { VideoPlayer } from './VideoPlayer';

// Video Script Display - Hiển thị kịch bản hội thoại
export { VideoScriptDisplay } from './VideoScriptDisplay';

// Speaking Question Card - Card câu hỏi
export { SpeakingQuestionCard } from './SpeakingQuestionCard';

// Online Users Panel - Hiển thị người đang làm cùng
export { OnlineUsersPanel } from './OnlineUsersPanel';

// AI Analysis Card - Kết quả phân tích AI
export { AIAnalysisCard } from './AIAnalysisCard';

// Speaking Exam Card - Card đề giao tiếp
export { SpeakingExamCard } from './SpeakingExamCard';

// Speaking Exam Form - Form tạo/chỉnh sửa đề giao tiếp (Admin)
export { SpeakingExamForm } from './SpeakingExamForm';
export type {
    SpeakingExamFormMode,
    VideoInputMode,
    SpeakingExamFormData,
    FormErrors,
    SpeakingExamFormProps,
} from './SpeakingExamForm';
