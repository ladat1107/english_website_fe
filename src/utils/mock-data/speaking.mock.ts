/**
 * Khailingo - Speaking Mock Data
 * Dữ liệu mẫu cho module Luyện giao tiếp
 * Cấu trúc khớp với BE schemas
 */

import {
    SpeakingExam,
    SpeakingAttempt,
    SpeakingAnswer,
    SpeakingAttemptStatus,
    OnlineUser,
    SpeakingSubmission,
    ExamAttemptStatus,
} from '@/types/speaking.type';
import { SpeakingTopic } from '../constants/enum';

// =====================================================
// MOCK SPEAKING EXAMS - Đề giao tiếp mẫu
// =====================================================
export const mockSpeakingExams: SpeakingExam[] = [
    {
        _id: 'speaking-exam-001',
        title: 'Job Interview - Phỏng vấn xin việc',
        description: 'Luyện tập các tình huống phỏng vấn xin việc phổ biến. Học cách giới thiệu bản thân và trả lời câu hỏi của nhà tuyển dụng.',
        topic: SpeakingTopic.WORK_AND_CAREER,
        estimated_duration_minutes: 15,
        video_url: 'https://www.youtube.com/embed/HG68Ymazo18',
        video_script: [
            {
                speaker: 'Interviewer',
                content: 'Good morning! Thank you for coming in today. Please, have a seat.',
                translation: 'Chào buổi sáng! Cảm ơn bạn đã đến hôm nay. Xin mời ngồi.',
            },
            {
                speaker: 'Candidate',
                content: 'Good morning! Thank you for having me. I\'m excited to be here.',
                translation: 'Chào buổi sáng! Cảm ơn đã mời tôi. Tôi rất vui được có mặt ở đây.',
            },
            {
                speaker: 'Interviewer',
                content: 'Let\'s start with a brief introduction. Can you tell me a little about yourself?',
                translation: 'Chúng ta bắt đầu với phần giới thiệu ngắn gọn. Bạn có thể cho tôi biết một chút về bản thân không?',
            },
            {
                speaker: 'Candidate',
                content: 'Of course! My name is Sarah, and I recently graduated from ABC University with a degree in Marketing. During my studies, I completed two internships where I gained experience in digital marketing and social media management.',
                translation: 'Tất nhiên! Tên tôi là Sarah, và tôi vừa tốt nghiệp Đại học ABC với bằng Marketing. Trong thời gian học, tôi đã hoàn thành hai kỳ thực tập, nơi tôi có được kinh nghiệm về marketing kỹ thuật số và quản lý mạng xã hội.',
            },
            {
                speaker: 'Interviewer',
                content: 'That\'s impressive! What attracted you to this position at our company?',
                translation: 'Thật ấn tượng! Điều gì đã thu hút bạn đến vị trí này tại công ty chúng tôi?',
            },
            {
                speaker: 'Candidate',
                content: 'I\'ve been following your company\'s innovative marketing campaigns for years. Your approach to sustainability and eco-friendly products really aligns with my personal values. I believe I can contribute fresh ideas to your team.',
                translation: 'Tôi đã theo dõi các chiến dịch marketing sáng tạo của công ty bạn trong nhiều năm. Cách tiếp cận về tính bền vững và sản phẩm thân thiện với môi trường thực sự phù hợp với giá trị cá nhân của tôi. Tôi tin rằng tôi có thể đóng góp những ý tưởng mới mẻ cho nhóm.',
            },
        ],
        questions: [
            {
                _id: 'q1',
                question_number: 1,
                question_text: 'How would you introduce yourself in a job interview? Practice your introduction.',
                suggested_answer: 'Hello, my name is [Name]. I recently graduated from [University] with a degree in [Field]. I have [X years] of experience in [Industry] and I\'m passionate about [Interest]. I believe my skills in [Skill 1] and [Skill 2] make me a strong candidate for this position.',
            },
            {
                _id: 'q2',
                question_number: 2,
                question_text: 'Why do you want to work for our company?',
                suggested_answer: 'I\'ve researched your company extensively and I\'m impressed by your commitment to innovation and quality. Your company culture emphasizes teamwork and continuous learning, which aligns with my professional goals. I believe this opportunity would allow me to grow while contributing to your success.',
            },
            {
                _id: 'q3',
                question_number: 3,
                question_text: 'What are your greatest strengths and weaknesses?',
                suggested_answer: 'My greatest strength is my ability to work well under pressure. I stay calm and focused even with tight deadlines. As for weaknesses, I sometimes tend to be a perfectionist, but I\'ve learned to balance quality with efficiency by setting realistic timelines.',
            },
        ],
        is_published: true,
        created_by: 'admin-001',
        createdAt: '2025-01-15T08:00:00Z',
        updatedAt: '2025-01-20T10:30:00Z',
    },
    {
        _id: 'speaking-exam-002',
        title: 'Ordering Food at a Restaurant - Gọi món tại nhà hàng',
        description: 'Học cách gọi món, hỏi về thực đơn và giao tiếp với nhân viên phục vụ một cách tự tin.',
        topic: SpeakingTopic.DAILY_LIFE,
        estimated_duration_minutes: 10,
        video_url: 'https://www.youtube.com/embed/ekoc0Y_X9I8',
        video_script: [
            {
                speaker: 'Waiter',
                content: 'Good evening! Welcome to The Golden Fork. Do you have a reservation?',
                translation: 'Chào buổi tối! Chào mừng đến The Golden Fork. Quý khách đã đặt bàn chưa ạ?',
            },
            {
                speaker: 'Customer',
                content: 'Yes, I have a reservation for two under the name Smith.',
                translation: 'Vâng, tôi đã đặt bàn cho hai người dưới tên Smith.',
            },
            {
                speaker: 'Waiter',
                content: 'Perfect! Right this way, please. Here are your menus. Can I get you something to drink?',
                translation: 'Tuyệt vời! Mời đi lối này ạ. Đây là thực đơn. Quý khách dùng gì để uống ạ?',
            },
            {
                speaker: 'Customer',
                content: 'I\'ll have a glass of sparkling water, please. And my wife will have a lemonade.',
                translation: 'Cho tôi một ly nước có ga nhé. Còn vợ tôi sẽ dùng nước chanh.',
            },
            {
                speaker: 'Waiter',
                content: 'Certainly! Are you ready to order, or would you like a few more minutes?',
                translation: 'Được ạ! Quý khách đã sẵn sàng gọi món chưa, hay cần thêm vài phút?',
            },
            {
                speaker: 'Customer',
                content: 'We\'re ready. I\'d like the grilled salmon with vegetables, and my wife will have the pasta carbonara.',
                translation: 'Chúng tôi sẵn sàng rồi. Tôi muốn cá hồi nướng với rau củ, còn vợ tôi sẽ dùng mì carbonara.',
            },
            {
                speaker: 'Waiter',
                content: 'Excellent choices! Would you like any appetizers or sides with that?',
                translation: 'Lựa chọn tuyệt vời! Quý khách có muốn dùng khai vị hoặc món ăn kèm không ạ?',
            },
        ],
        questions: [
            {
                _id: 'q1',
                question_number: 1,
                question_text: 'How would you ask about the specials of the day?',
                suggested_answer: 'Excuse me, could you tell me what the specials are today? I\'d also like to know if there are any dishes you particularly recommend.',
            },
            {
                _id: 'q2',
                question_number: 2,
                question_text: 'How would you inform the waiter about your food allergies?',
                suggested_answer: 'I should let you know that I have a nut allergy. Could you please check if any of the dishes I ordered contain nuts? I would also appreciate it if you could inform the kitchen.',
            },
            {
                _id: 'q3',
                question_number: 3,
                question_text: 'How would you ask for the bill and give feedback about the meal?',
                suggested_answer: 'Excuse me, could we have the bill please? The meal was absolutely delicious! The salmon was cooked perfectly. We\'ll definitely be coming back again.',
            },
        ],
        is_published: true,
        created_by: 'admin-001',
        createdAt: '2025-01-10T09:00:00Z',
        updatedAt: '2025-01-18T14:00:00Z',
    },
    {
        _id: 'speaking-exam-003',
        title: 'Asking for Directions - Hỏi đường',
        description: 'Luyện tập hỏi và chỉ đường bằng tiếng Anh khi du lịch hoặc ở nước ngoài.',
        topic: SpeakingTopic.TRAVEL,
        estimated_duration_minutes: 8,
        video_url: 'https://www.youtube.com/embed/9I9F8Jn2dLY',
        video_script: [
            {
                speaker: 'Tourist',
                content: 'Excuse me, could you help me? I\'m trying to find the Central Station.',
                translation: 'Xin lỗi, bạn có thể giúp tôi không? Tôi đang cố tìm ga Trung tâm.',
            },
            {
                speaker: 'Local',
                content: 'Of course! The Central Station is about 10 minutes walk from here.',
                translation: 'Tất nhiên! Ga Trung tâm cách đây khoảng 10 phút đi bộ.',
            },
            {
                speaker: 'Tourist',
                content: 'Great! Could you tell me which direction I should go?',
                translation: 'Tuyệt vời! Bạn có thể cho tôi biết nên đi hướng nào không?',
            },
            {
                speaker: 'Local',
                content: 'Sure! Go straight down this street until you reach the traffic lights. Then turn left onto Main Street.',
                translation: 'Được! Đi thẳng con đường này đến khi bạn gặp đèn giao thông. Sau đó rẽ trái vào đường Main.',
            },
            {
                speaker: 'Local',
                content: 'Continue walking for about 200 meters, and you\'ll see the station on your right. It\'s a big white building.',
                translation: 'Tiếp tục đi bộ khoảng 200 mét, và bạn sẽ thấy ga ở bên phải. Đó là một tòa nhà lớn màu trắng.',
            },
            {
                speaker: 'Tourist',
                content: 'So, go straight, turn left at the traffic lights, and it\'s on the right?',
                translation: 'Vậy là đi thẳng, rẽ trái ở đèn giao thông, và nó ở bên phải?',
            },
            {
                speaker: 'Local',
                content: 'Exactly! You can\'t miss it. There are signs everywhere.',
                translation: 'Chính xác! Bạn không thể bỏ lỡ được. Có biển chỉ dẫn khắp nơi.',
            },
        ],
        questions: [
            {
                _id: 'q1',
                question_number: 1,
                question_text: 'How would you politely ask someone for directions to the nearest hospital?',
                suggested_answer: 'Excuse me, I\'m sorry to bother you, but could you please tell me how to get to the nearest hospital? Is it within walking distance, or should I take a taxi?',
            },
            {
                _id: 'q2',
                question_number: 2,
                question_text: 'How would you give directions from your home to the nearest supermarket?',
                suggested_answer: 'From my home, you would go out and turn right. Walk straight for about 5 minutes until you see a big intersection. Turn left there and the supermarket will be on your left side, next to the pharmacy.',
            },
        ],
        is_published: true,
        created_by: 'admin-001',
        createdAt: '2025-01-05T11:00:00Z',
        updatedAt: '2025-01-12T09:00:00Z',
    },
    {
        _id: 'speaking-exam-004',
        title: 'Making a Phone Call - Gọi điện thoại',
        description: 'Luyện tập gọi điện thoại trong các tình huống công việc và đời sống.',
        topic: SpeakingTopic.DAILY_LIFE,
        estimated_duration_minutes: 12,
        video_url: 'https://www.youtube.com/embed/m5K4hs6O-cA',
        video_script: [
            {
                speaker: 'Receptionist',
                content: 'Good morning, TechCorp Solutions, this is Emma speaking. How may I help you?',
                translation: 'Chào buổi sáng, TechCorp Solutions, tôi là Emma. Tôi có thể giúp gì cho bạn?',
            },
            {
                speaker: 'Caller',
                content: 'Good morning. My name is John Davis. I\'m calling about the software issue we discussed last week.',
                translation: 'Chào buổi sáng. Tôi là John Davis. Tôi gọi về vấn đề phần mềm chúng ta đã thảo luận tuần trước.',
            },
            {
                speaker: 'Receptionist',
                content: 'Of course, Mr. Davis. Let me transfer you to our technical support team. Please hold the line.',
                translation: 'Tất nhiên, ông Davis. Để tôi chuyển máy cho đội hỗ trợ kỹ thuật. Xin vui lòng giữ máy.',
            },
            {
                speaker: 'Tech Support',
                content: 'Hello, this is Mike from technical support. I understand you\'re experiencing some software issues?',
                translation: 'Xin chào, tôi là Mike từ bộ phận hỗ trợ kỹ thuật. Tôi hiểu là bạn đang gặp một số vấn đề về phần mềm?',
            },
            {
                speaker: 'Caller',
                content: 'Yes, the application keeps crashing whenever I try to export files. It started after the latest update.',
                translation: 'Vâng, ứng dụng cứ bị crash mỗi khi tôi cố xuất file. Nó bắt đầu sau bản cập nhật mới nhất.',
            },
        ],
        questions: [
            {
                _id: 'q1',
                question_number: 1,
                question_text: 'How would you answer a professional phone call and identify yourself?',
                suggested_answer: 'Good morning/afternoon, [Company Name], [Your Name] speaking. How may I assist you today?',
            },
            {
                _id: 'q2',
                question_number: 2,
                question_text: 'How would you politely ask to speak with someone specific?',
                suggested_answer: 'Could I please speak with [Person\'s Name] from the [Department] department? This is regarding [brief reason for call].',
            },
            {
                _id: 'q3',
                question_number: 3,
                question_text: 'How would you leave a voicemail message?',
                suggested_answer: 'Hello, this message is for [Name]. My name is [Your Name] and I\'m calling about [reason]. Could you please call me back at [phone number]? I\'m available [availability]. Thank you.',
            },
        ],
        is_published: true,
        created_by: 'admin-002',
        createdAt: '2025-01-08T14:00:00Z',
        updatedAt: '2025-01-15T16:00:00Z',
    },
    {
        _id: 'speaking-exam-005',
        title: 'Discussing Technology - Thảo luận về công nghệ',
        description: 'Luyện tập thảo luận về các chủ đề công nghệ, gadgets và xu hướng số.',
        topic: SpeakingTopic.TECHNOLOGY,
        estimated_duration_minutes: 15,
        video_url: 'https://www.youtube.com/embed/3D_kz05hcWE',
        video_script: [
            {
                speaker: 'Host',
                content: 'Today we\'re discussing how artificial intelligence is changing our daily lives. What do you think about AI assistants?',
                translation: 'Hôm nay chúng ta thảo luận về cách trí tuệ nhân tạo đang thay đổi cuộc sống hàng ngày của chúng ta. Bạn nghĩ gì về trợ lý AI?',
            },
            {
                speaker: 'Guest',
                content: 'I think AI assistants have become incredibly useful. I use mine every day for setting reminders, playing music, and even controlling my smart home devices.',
                translation: 'Tôi nghĩ trợ lý AI đã trở nên vô cùng hữu ích. Tôi sử dụng của mình mỗi ngày để đặt nhắc nhở, phát nhạc, và thậm chí điều khiển các thiết bị nhà thông minh.',
            },
            {
                speaker: 'Host',
                content: 'Are there any concerns about privacy with these devices always listening?',
                translation: 'Có lo ngại gì về quyền riêng tư khi những thiết bị này luôn lắng nghe không?',
            },
            {
                speaker: 'Guest',
                content: 'That\'s a valid concern. We need to find a balance between convenience and privacy. I make sure to review my privacy settings regularly.',
                translation: 'Đó là một lo ngại hợp lý. Chúng ta cần tìm sự cân bằng giữa tiện lợi và quyền riêng tư. Tôi đảm bảo xem xét cài đặt quyền riêng tư của mình thường xuyên.',
            },
        ],
        questions: [
            {
                _id: 'q1',
                question_number: 1,
                question_text: 'What technology do you use most in your daily life and why?',
                suggested_answer: 'The technology I use most is my smartphone. It helps me stay connected with family and friends, manage my schedule, access information instantly, and even handle banking and shopping. It has become an essential tool for both work and personal life.',
            },
            {
                _id: 'q2',
                question_number: 2,
                question_text: 'What do you think about the future of artificial intelligence?',
                suggested_answer: 'I believe AI will continue to transform many industries. While it offers tremendous benefits like improved healthcare and automation, we need to address concerns about job displacement and ethical use. The key is to develop AI responsibly.',
            },
        ],
        is_published: false, // Chưa xuất bản
        created_by: 'admin-001',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-25T11:00:00Z',
    },
];

// =====================================================
// MOCK SPEAKING ATTEMPTS - Lượt làm bài mẫu
// =====================================================
export const mockSpeakingAttempts: SpeakingAttempt[] = [
    {
        _id: 'attempt-001',
        user_id: 'user-001',
        exam_id: 'speaking-exam-001',
        exam: mockSpeakingExams[0],
        status: SpeakingAttemptStatus.COMPLETED,
        started_at: '2025-01-22T09:00:00Z',
        submitted_at: '2025-01-22T09:25:00Z',
        createdAt: '2025-01-22T09:00:00Z',
        updatedAt: '2025-01-22T09:25:00Z',
    },
    {
        _id: 'attempt-002',
        user_id: 'user-001',
        exam_id: 'speaking-exam-002',
        exam: mockSpeakingExams[1],
        status: SpeakingAttemptStatus.IN_PROGRESS,
        started_at: '2025-01-25T14:00:00Z',
        createdAt: '2025-01-25T14:00:00Z',
        updatedAt: '2025-01-25T14:00:00Z',
    },
    {
        _id: 'attempt-003',
        user_id: 'user-002',
        exam_id: 'speaking-exam-001',
        exam: mockSpeakingExams[0],
        status: SpeakingAttemptStatus.COMPLETED,
        started_at: '2025-01-23T10:00:00Z',
        submitted_at: '2025-01-23T10:30:00Z',
        createdAt: '2025-01-23T10:00:00Z',
        updatedAt: '2025-01-23T10:30:00Z',
    },
];

// =====================================================
// MOCK SPEAKING ANSWERS - Câu trả lời mẫu
// =====================================================
export const mockSpeakingAnswers: SpeakingAnswer[] = [
    {
        _id: 'answer-001',
        attempt_id: 'attempt-001',
        question: {
            question_number: 1,
            question_text: 'How would you introduce yourself in a job interview? Practice your introduction.',
        },
        audio_url: 'https://res.cloudinary.com/demo/video/upload/sample-audio-1.mp3',
        duration_seconds: 45,
        teacher_feedback: 'Good introduction! Clear pronunciation and confident delivery. Consider adding more specific achievements.',
        score: 85,
        ai_analysis: {
            transcript: 'Hello, my name is Nguyen Van A. I graduated from FPT University with a degree in Software Engineering. I have two years of experience in web development and I am passionate about creating user-friendly applications.',
            improvement: [
                'Thêm chi tiết cụ thể về thành tích đạt được',
                'Nói chậm hơn ở phần cuối để rõ ràng hơn',
                'Có thể thêm lý do tại sao muốn ứng tuyển vị trí này',
            ],
            error: [
                'Phát âm "graduated" cần stress đúng âm tiết đầu',
                '"Software Engineering" - âm /s/ cuối cần rõ hơn',
            ],
            ai_fix: 'Hello, my name is Nguyen Van A. I graduated from FPT University with a degree in Software Engineering. During my two years of experience in web development, I led a team of three developers to build an e-commerce platform that increased our client\'s sales by 30%. I am passionate about creating user-friendly applications and I believe my skills would be a great fit for this position.',
        },
        createdAt: '2025-01-22T09:10:00Z',
        updatedAt: '2025-01-22T15:00:00Z',
    },
    {
        _id: 'answer-002',
        attempt_id: 'attempt-001',
        question: {
            question_number: 2,
            question_text: 'Why do you want to work for our company?',
        },
        audio_url: 'https://res.cloudinary.com/demo/video/upload/sample-audio-2.mp3',
        duration_seconds: 38,
        teacher_feedback: 'Good answer with specific company knowledge. Work on fluency and reduce filler words.',
        score: 78,
        ai_analysis: {
            transcript: 'I want to work for your company because I have researched about your products and I like your culture. Your company has, um, good reputation in the market.',
            improvement: [
                'Giảm thiểu từ đệm như "um", "uh"',
                'Thêm ví dụ cụ thể về sản phẩm/dự án của công ty',
                'Liên kết mục tiêu cá nhân với định hướng của công ty',
            ],
            error: [
                'Cần nói "I have done research" thay vì "I have researched about"',
                'Tránh dùng "like" trong ngữ cảnh formal, thay bằng "admire" hoặc "appreciate"',
            ],
            ai_fix: 'I want to work for your company because I have done extensive research on your innovative products, particularly your AI-powered solutions. I truly admire your company culture that emphasizes collaboration and continuous learning. Your excellent reputation in the market and commitment to sustainability align perfectly with my professional values.',
        },
        createdAt: '2025-01-22T09:15:00Z',
        updatedAt: '2025-01-22T15:00:00Z',
    },
    {
        _id: 'answer-003',
        attempt_id: 'attempt-001',
        question: {
            question_number: 3,
            question_text: 'What are your greatest strengths and weaknesses?',
        },
        audio_url: 'https://res.cloudinary.com/demo/video/upload/sample-audio-3.mp3',
        duration_seconds: 52,
        score: 0, // Chưa chấm điểm
        createdAt: '2025-01-22T09:20:00Z',
        updatedAt: '2025-01-22T09:20:00Z',
    },
    {
        _id: 'answer-004',
        attempt_id: 'attempt-003',
        question: {
            question_number: 1,
            question_text: 'How would you introduce yourself in a job interview? Practice your introduction.',
        },
        audio_url: 'https://res.cloudinary.com/demo/video/upload/sample-audio-4.mp3',
        duration_seconds: 40,
        teacher_feedback: 'Very good! Natural delivery and excellent vocabulary.',
        score: 92,
        createdAt: '2025-01-23T10:10:00Z',
        updatedAt: '2025-01-23T16:00:00Z',
    },
];

// =====================================================
// MOCK ONLINE USERS - Người đang làm cùng đề
// =====================================================
export const mockOnlineUsers: OnlineUser[] = [
    {
        user_id: 'user-002',
        user_name: 'Trần Thị B',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        joined_at: '2025-01-25T14:05:00Z',
    },
    {
        user_id: 'user-003',
        user_name: 'Lê Văn C',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
        joined_at: '2025-01-25T14:10:00Z',
    },
    {
        user_id: 'user-004',
        user_name: 'Phạm Thị D',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
        joined_at: '2025-01-25T14:15:00Z',
    },
];

// =====================================================
// MOCK GOOGLE MEET LINK
// =====================================================
export const mockGoogleMeetLink = 'https://meet.google.com/rjd-vvqv-xzs';

// =====================================================
// TOPIC OPTIONS - Dùng cho Select dropdown
// =====================================================


// =====================================================
// HELPER FUNCTIONS - Các hàm tiện ích mock
// =====================================================

/**
 * Lấy danh sách đề giao tiếp với filter
 */
export const getMockSpeakingExams = (filter?: {
    topic?: SpeakingTopic;
    is_published?: boolean;
    search?: string;
}) => {
    let result = [...mockSpeakingExams];

    if (filter?.topic) {
        result = result.filter(exam => exam.topic === filter.topic);
    }

    if (filter?.is_published !== undefined) {
        result = result.filter(exam => exam.is_published === filter.is_published);
    }

    if (filter?.search) {
        const searchLower = filter.search.toLowerCase();
        result = result.filter(
            exam =>
                exam.title.toLowerCase().includes(searchLower) ||
                exam.description?.toLowerCase().includes(searchLower)
        );
    }

    return result;
};

/**
 * Lấy chi tiết một đề giao tiếp
 */
export const getMockSpeakingExamById = (id: string) => {
    return mockSpeakingExams.find(exam => exam._id === id) || null;
};

/**
 * Lấy danh sách lượt làm bài của user
 */
export const getMockUserAttempts = (userId: string) => {
    return mockSpeakingAttempts.filter(attempt => attempt.user_id === userId);
};

/**
 * Lấy câu trả lời của một lượt làm bài
 */
export const getMockAnswersByAttemptId = (attemptId: string) => {
    return mockSpeakingAnswers.filter(answer => answer.attempt_id === attemptId);
};

/**
 * Lấy tất cả submissions cần chấm điểm (admin)
 */
export const getMockUngradedAnswers = () => {
    return mockSpeakingAnswers.filter(answer => answer.score === 0);
};

// =====================================================
// MOCK SPEAKING SUBMISSIONS - Dữ liệu bài nộp mẫu cho trang chấm điểm
// =====================================================
export const MOCK_SPEAKING_SUBMISSIONS: SpeakingSubmission[] = [
    {
        _id: 'submission-001',
        speakingExamId: 'speaking-exam-001',
        userId: 'user-001',
        userName: 'Nguyễn Văn An',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        status: ExamAttemptStatus.COMPLETED,
        startedAt: '2025-01-22T09:00:00Z',
        submittedAt: '2025-01-22T09:25:00Z',
        totalDuration: 1500, // 25 phút
        answers: [
            {
                _id: 'ans-001-1',
                questionNumber: 1,
                questionText: 'How would you introduce yourself in a job interview? Practice your introduction.',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-1.mp3',
                duration: 45,
                transcript: 'Hello, my name is Nguyen Van An. I graduated from FPT University with a degree in Software Engineering.',
                aiAnalysis: {
                    transcript: 'Hello, my name is Nguyen Van An. I graduated from FPT University with a degree in Software Engineering.',
                    improvement: ['Thêm chi tiết cụ thể về thành tích', 'Nói chậm hơn ở cuối câu'],
                    error: ['Phát âm "graduated" cần stress đúng âm tiết đầu'],
                    ai_fix: 'Hello, my name is Nguyen Van An. I graduated from FPT University with a degree in Software Engineering. During my studies, I developed several web applications.',
                },
            },
            {
                _id: 'ans-001-2',
                questionNumber: 2,
                questionText: 'Why do you want to work for our company?',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-2.mp3',
                duration: 38,
                transcript: 'I want to work for your company because I have researched about your products.',
            },
            {
                _id: 'ans-001-3',
                questionNumber: 3,
                questionText: 'What are your greatest strengths and weaknesses?',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-3.mp3',
                duration: 52,
            },
        ],
        createdAt: '2025-01-22T09:00:00Z',
        updatedAt: '2025-01-22T09:25:00Z',
    },
    {
        _id: 'submission-002',
        speakingExamId: 'speaking-exam-001',
        userId: 'user-002',
        userName: 'Trần Thị Bình',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        status: ExamAttemptStatus.GRADED,
        startedAt: '2025-01-23T10:00:00Z',
        submittedAt: '2025-01-23T10:30:00Z',
        totalDuration: 1800,
        score: 85,
        feedback: 'Bài làm tốt! Phát âm rõ ràng, ngữ pháp chính xác. Cần cải thiện thêm về độ trôi chảy.',
        answers: [
            {
                _id: 'ans-002-1',
                questionNumber: 1,
                questionText: 'How would you introduce yourself in a job interview? Practice your introduction.',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-4.mp3',
                duration: 40,
                transcript: 'Hello, my name is Tran Thi Binh. I am a marketing graduate with 2 years of experience.',
                score: 88,
                feedback: 'Rất tốt! Giới thiệu rõ ràng và tự tin.',
            },
            {
                _id: 'ans-002-2',
                questionNumber: 2,
                questionText: 'Why do you want to work for our company?',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-5.mp3',
                duration: 35,
                transcript: 'I admire your company innovative approach to sustainable products.',
                score: 82,
                feedback: 'Tốt, nhưng cần thêm ví dụ cụ thể.',
            },
        ],
        createdAt: '2025-01-23T10:00:00Z',
        updatedAt: '2025-01-23T16:00:00Z',
    },
    {
        _id: 'submission-003',
        speakingExamId: 'speaking-exam-002',
        userId: 'user-003',
        userName: 'Lê Văn Cường',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
        status: ExamAttemptStatus.COMPLETED,
        startedAt: '2025-01-24T14:00:00Z',
        submittedAt: '2025-01-24T14:20:00Z',
        totalDuration: 1200,
        answers: [
            {
                _id: 'ans-003-1',
                questionNumber: 1,
                questionText: 'How would you ask about the specials of the day?',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-6.mp3',
                duration: 30,
                transcript: 'Excuse me, what are the specials today?',
            },
            {
                _id: 'ans-003-2',
                questionNumber: 2,
                questionText: 'How would you inform the waiter about your food allergies?',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-7.mp3',
                duration: 42,
                transcript: 'I have a nut allergy. Please check if any dishes contain nuts.',
            },
        ],
        createdAt: '2025-01-24T14:00:00Z',
        updatedAt: '2025-01-24T14:20:00Z',
    },
    {
        _id: 'submission-004',
        speakingExamId: 'speaking-exam-003',
        userId: 'user-001',
        userName: 'Nguyễn Văn An',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        status: ExamAttemptStatus.GRADED,
        startedAt: '2025-01-25T08:00:00Z',
        submittedAt: '2025-01-25T08:15:00Z',
        totalDuration: 900,
        score: 92,
        feedback: 'Xuất sắc! Ngữ điệu tự nhiên, từ vựng phong phú.',
        answers: [
            {
                _id: 'ans-004-1',
                questionNumber: 1,
                questionText: 'How would you politely ask someone for directions to the nearest hospital?',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-8.mp3',
                duration: 35,
                transcript: 'Excuse me, could you please tell me how to get to the nearest hospital?',
                score: 92,
                feedback: 'Rất lịch sự và tự nhiên!',
            },
        ],
        createdAt: '2025-01-25T08:00:00Z',
        updatedAt: '2025-01-25T12:00:00Z',
    },
    {
        _id: 'submission-005',
        speakingExamId: 'speaking-exam-001',
        userId: 'user-004',
        userName: 'Phạm Thị Dung',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: '2025-01-26T09:00:00Z',
        totalDuration: 600,
        answers: [
            {
                _id: 'ans-005-1',
                questionNumber: 1,
                questionText: 'How would you introduce yourself in a job interview? Practice your introduction.',
                audioUrl: 'https://res.cloudinary.com/demo/video/upload/sample-audio-9.mp3',
                duration: 48,
                transcript: 'My name is Pham Thi Dung and I am a fresh graduate.',
            },
        ],
        createdAt: '2025-01-26T09:00:00Z',
        updatedAt: '2025-01-26T09:10:00Z',
    },
];

// =====================================================
// HELPER FUNCTIONS - Alias cho getSpeakingExamById
// =====================================================
export const getSpeakingExamById = getMockSpeakingExamById;

// =====================================================
// FORMAT HELPERS - Các hàm format dữ liệu
// =====================================================

/**
 * Format date sang dạng dd/mm/yyyy hh:mm
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Format duration từ giây sang dạng mm:ss hoặc hh:mm:ss
 */
export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
