
export interface SpeakingAttemptResponse {
    attempt: {
        _id: string;
        exam_id: string;
        user_id: string;
        status: string;
        started_at: string;
        completed_at?: string;
        submitted_at?: string;
    };
    answers: {
        question: {
            question_number: number;
            question_text: string;
        }
        audio_url: string;
        duration_seconds: number;
    }[];
    is_resumed: boolean;
}

