export const QUERY_KEYS = {
    auth: {
        checkStatus: "check-status",
    },
    speakingExam: {
        getAll: "speaking-exams",
        findOne: "speaking-exam",
    },
    speakingAttempt: {
        getAll: "speaking-attempts",
        history: "speaking-attempt-history",
        detail: "speaking-attempt-detail",
        getById: "speaking-attempt-get-by-id",
    },
    user: {
        getAll: "get-all-users",
        getById: "get-user-by-id",
        profileStatus: "profileStatus",
        examAttemptRecent: "examAttemptRecent",
        speakingRecent: "speakingRecent"
    },
    classSession: {
        getAll: "class-sessions",
        getById: "class-session",
        getMySessions:"my-class-sessions",
        getByMonth: "class-sessions-by-month",
    },
    participant: {
        getBySession: "participants-by-session",
        getByUser: "participants-by-user",
    }
}