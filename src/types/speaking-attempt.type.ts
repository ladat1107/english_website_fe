
export interface CreateSpeakingAttempt {
    exam_id: string;
    started_at: string;
    answers: {
        question: {
            question_number: number;
            question_text: string;
        }
        audio_url: string;
        duration_seconds: number;
    }[];
}