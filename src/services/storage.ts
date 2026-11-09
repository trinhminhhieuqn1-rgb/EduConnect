import {
  User,
  Classroom,
  Lesson,
  Assignment,
  Submission,
  NotificationItem,
  SystemStats
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'educonnect_current_user',
  USERS: 'educonnect_users',
  CLASSROOMS: 'educonnect_classrooms',
  LESSONS: 'educonnect_lessons',
  ASSIGNMENTS: 'educonnect_assignments',
  SUBMISSIONS: 'educonnect_submissions',
  NOTIFICATIONS: 'educonnect_notifications',
  INIT_FLAG: 'educonnect_seeded_v1',
};

// Initial Seed Users
const DEFAULT_USERS: User[] = [
  {
    id: 'user_teacher_1',
    email: 'thay.tuan@educonnect.vn',
    name: 'Thầy Nguyễn Minh Tuấn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '0912 345 678',
    school: 'THPT Chuyên Hà Nội - Amsterdam',
    bio: 'Giáo viên Toán Chuyên 12 năm kinh nghiệm luyện thi THPT Quốc gia & bồi dưỡng học sinh giỏi.',
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user_teacher_2',
    email: 'co.huong@educonnect.vn',
    name: 'Cô Lê Mai Hương',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '0988 765 432',
    school: 'Trường THPT Chu Văn An',
    bio: 'Thạc sĩ Ngôn ngữ Anh (ĐH Sư Phạm Hà Nội), IELTS 8.5. Giảng viên trực tuyến tiêu biểu.',
    status: 'active',
    createdAt: '2026-01-12T09:30:00Z',
  },
  {
    id: 'user_student_1',
    email: 'hocsinh.hieu@educonnect.vn',
    name: 'Trịnh Minh Hiếu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '0904 111 222',
    school: 'Lớp 12A1 - THPT Chuyên Quốc Học',
    bio: 'Học sinh lớp 12, mục tiêu đỗ Đại học Bách Khoa Hà Nội & ĐH Quốc Gia.',
    status: 'active',
    createdAt: '2026-02-01T10:00:00Z',
    enrolledClassIds: ['class_math_12', 'class_eng_101', 'class_cs_202'],
  },
  {
    id: 'user_student_2',
    email: 'hocsinh.lan@educonnect.vn',
    name: 'Nguyễn Thị Ngọc Lan',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '0933 222 333',
    school: 'Lớp 12A3 - THPT Thăng Long',
    bio: 'Đam mê Ngoại ngữ và Toán học ứng dụng.',
    status: 'active',
    createdAt: '2026-02-05T11:20:00Z',
    enrolledClassIds: ['class_math_12', 'class_eng_101'],
  },
  {
    id: 'user_student_3',
    email: 'hocsinh.khoa@educonnect.vn',
    name: 'Trần Đăng Khoa',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '0977 444 555',
    school: 'Lớp 11 Lý - THPT Lương Thế Vinh',
    bio: 'Thích học lập trình thuật toán và công nghệ thông tin.',
    status: 'active',
    createdAt: '2026-02-08T14:15:00Z',
    enrolledClassIds: ['class_math_12'],
  },
  {
    id: 'user_admin',
    email: 'admin@educonnect.vn',
    name: 'Quản Trị Viên EduConnect',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '1900 6868',
    school: 'Trung Tâm Quản Trị Hệ Thống EduConnect',
    bio: 'Quản trị viên phụ trách vận hành và giám sát chất lượng giảng dạy trên nền tảng.',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

// Initial Seed Classrooms
const DEFAULT_CLASSROOMS: Classroom[] = [
  {
    id: 'class_math_12',
    code: 'MAT12A',
    name: 'Toán Học 12 - Chuyên Đề Hàm Số & Hình Không Gian',
    subject: 'Toán học',
    description: 'Chương trình ôn luyện chuyên sâu kiến thức 12, giải nhanh trắc nghiệm đồ thị hàm số và hình học không gian Oxyz.',
    teacherId: 'user_teacher_1',
    teacherName: 'Thầy Nguyễn Minh Tuấn',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/course_math_science_1794199364346.jpg',
    schedule: 'Thứ 2, Thứ 4, Thứ 6 (19:30 - 21:00)',
    studentIds: ['user_student_1', 'user_student_2', 'user_student_3'],
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'class_eng_101',
    code: 'ENG101',
    name: 'Tiếng Anh THPT - Luyện Thi IELTS & Tốt Nghiệp',
    subject: 'Tiếng Anh',
    description: 'Nâng cao vốn từ vựng học thuật, ngữ pháp cốt lõi và kỹ năng Reading - Listening đạt chuẩn điểm 8.0+.',
    teacherId: 'user_teacher_2',
    teacherName: 'Cô Lê Mai Hương',
    teacherAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/course_literature_languages_1794199364597.jpg',
    schedule: 'Thứ 3, Thứ 5, Thứ 7 (18:00 - 19:30)',
    studentIds: ['user_student_1', 'user_student_2'],
    createdAt: '2026-02-03T09:00:00Z',
  },
  {
    id: 'class_cs_202',
    code: 'CS202',
    name: 'Lập Trình Web & Tư Duy Thuật Toán',
    subject: 'Tin học',
    description: 'Nhập môn lập trình thuật toán, cấu trúc dữ liệu cơ bản và phát triển ứng dụng web thực tế.',
    teacherId: 'user_teacher_1',
    teacherName: 'Thầy Nguyễn Minh Tuấn',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/course_computer_science_1794199363990.jpg',
    schedule: 'Chủ Nhật (08:30 - 11:30)',
    studentIds: ['user_student_1'],
    createdAt: '2026-02-10T10:00:00Z',
  },
];

// Initial Seed Lessons
const DEFAULT_LESSONS: Lesson[] = [
  {
    id: 'lesson_m1',
    classId: 'class_math_12',
    title: 'Bài 1: Tính Đơn Điệu Của Hàm Số & Ứng Dụng Đạo Hàm',
    subject: 'Toán học',
    description: 'Quy tắc xét dấu đạo hàm bậc 1, các định lý cơ bản và phương pháp giải nhanh đồ thị hàm phân thức bậc nhất trên bậc nhất.',
    content: `### 1. Khái niệm cơ bản
Cho hàm số y = f(x) xác định trên khoảng K (với K là một khoảng, đoạn hoặc nửa khoảng).
- Hàm số y = f(x) gọi là đồng biến (tăng) trên K nếu với mọi cặp x1, x2 thuộc K: x1 < x2 => f(x1) < f(x2).
- Hàm số y = f(x) gọi là nghịch biến (giảm) trên K nếu với mọi cặp x1, x2 thuộc K: x1 < x2 => f(x1) > f(x2).

### 2. Định lý về dấu của đạo hàm
Giả sử f(x) có đạo hàm trên khoảng K:
- Nếu f'(x) > 0 với mọi x thuộc K thì f(x) đồng biến trên K.
- Nếu f'(x) < 0 với mọi x thuộc K thì f(x) nghịch biến trên K.
- Nếu f'(x) = 0 với mọi x thuộc K thì f(x) là hàm hằng trên K.`,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order: 1,
    createdAt: '2026-02-02T10:00:00Z',
    attachments: [
      {
        id: 'att_m1_1',
        name: 'Giao_trinh_Hàm_so_Lop_12_Chuyen_de_1.pdf',
        type: 'pdf',
        url: '#download-pdf-ham-so-chuyen-de-1',
        size: '2.4 MB',
      },
      {
        id: 'att_m1_2',
        name: 'So_do_tu_duy_xet_dau_dao_ham.png',
        type: 'image',
        url: '/src/assets/images/course_math_science_1794199364346.jpg',
        size: '1.1 MB',
      },
    ],
  },
  {
    id: 'lesson_m2',
    classId: 'class_math_12',
    title: 'Bài 2: Cực Trị Của Hàm Số & Quy Tắc Tìm Cực Trị',
    subject: 'Toán học',
    description: 'Quy tắc 1 (bảng biến thiên đạo hàm bậc 1) và Quy tắc 2 (đạo hàm cấp 2). Các bài toán cực trị có chứa tham số m.',
    content: `### 1. Định nghĩa cực đại và cực tiểu
Điểm x0 được gọi là điểm cực đại của hàm số f(x) nếu tồn tại khoảng (a, b) chứa x0 sao cho f(x) < f(x0) với mọi x thuộc (a, b) khác x0.

### 2. Quy tắc 2 tìm cực trị bằng đạo hàm cấp hai:
- Bước 1: Tìm tập xác định và tính f'(x). Giải phương trình f'(x) = 0 để tìm các nghiệm x0.
- Bước 2: Tính đạo hàm cấp hai f''(x) và f''(x0).
  - Nếu f''(x0) < 0 thì hàm số đạt cực đại tại x0.
  - Nếu f''(x0) > 0 thì hàm số đạt cực tiểu tại x0.`,
    order: 2,
    createdAt: '2026-02-05T14:00:00Z',
    attachments: [
      {
        id: 'att_m2_1',
        name: 'Bo_50_cau_hoi_cuc_tri_tham_so_m.pdf',
        type: 'pdf',
        url: '#download-pdf-cuc-tri-50-cau',
        size: '3.8 MB',
      },
    ],
  },
  {
    id: 'lesson_e1',
    classId: 'class_eng_101',
    title: 'Unit 1: Academic Vocabulary & Collocations for IELTS Task 2',
    subject: 'Tiếng Anh',
    description: 'Master 30 high-frequency academic vocabulary items and formal transition words for band 7.5+ writing essays.',
    content: `### High-Yield Academic Vocabulary
1. **Prevalent (adj)**: widespread in a particular area or at a particular time.
   *Example: Obesity is becoming increasingly prevalent among adolescents.*
2. **Exacerbate (v)**: to make a problem, bad situation, or negative feeling worse.
   *Example: Rapid urbanization often exacerbates housing shortages.*
3. **Detrimental (adj)**: tending to cause harm.
   *Example: Excessive screen time has a detrimental impact on cognitive development.*

### Topic Sentences & Cohesive Ties:
- *It is widely acknowledged that...*
- *Proponents of this view argue that...*
- *Conversely, critics maintain that...*`,
    order: 1,
    createdAt: '2026-02-04T15:30:00Z',
    attachments: [
      {
        id: 'att_e1_1',
        name: 'IELTS_Band_8_Writing_Vocabulary_Handbook.pdf',
        type: 'pdf',
        url: '#download-ielts-band-8-handbook',
        size: '4.2 MB',
      },
    ],
  },
  {
    id: 'lesson_cs1',
    classId: 'class_cs_202',
    title: 'Chương 1: Tư Duy Thuật Toán & Phân Tích Độ Phức Tạp O(n)',
    subject: 'Tin học',
    description: 'Khái niệm Big-O notation, các bài toán tìm kiếm nhị phân (Binary Search) và sắp xếp tối ưu.',
    content: `### Độ Phức Tạp Thuật Toán (Time Complexity)
1. **O(1) - Constant Time**: Truy cập mảng theo chỉ số arr[i], phép tính số học cơ bản.
2. **O(log n) - Logarithmic Time**: Thuật toán tìm kiếm nhị phân (Binary Search).
3. **O(n) - Linear Time**: Duyệt một vòng lặp qua n phần tử.
4. **O(n log n)**: Merge Sort, Quick Sort trung bình.
5. **O(n^2)**: Vòng lặp lồng nhau (Bubble Sort, Selection Sort).`,
    order: 1,
    createdAt: '2026-02-11T09:00:00Z',
    attachments: [
      {
        id: 'att_cs1_1',
        name: 'DataStructures_Algorithms_CheatSheet.pdf',
        type: 'pdf',
        url: '#download-algorithms-cheatsheet',
        size: '1.9 MB',
      },
    ],
  },
];

// Initial Seed Assignments
const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign_quiz_math_1',
    classId: 'class_math_12',
    title: 'Kiểm Tra 15 Phút: Khảo Sát Tính Đơn Điệu & Cực Trị',
    description: 'Bài kiểm tra trắc nghiệm 5 câu hỏi cốt lõi kiểm tra khả năng xét dấu đạo hàm và tìm điểm cực trị. Có tính giờ tự động 15 phút.',
    type: 'quiz',
    durationMinutes: 15,
    dueDate: '2026-12-31T23:59:59Z',
    totalPoints: 10,
    createdAt: '2026-02-06T10:00:00Z',
    questions: [
      {
        id: 'q1',
        questionText: 'Hàm số y = x³ - 3x² + 2 đồng biến trên khoảng nào sau đây?',
        options: [
          'A. (0; 2)',
          'B. (-∞; 0) và (2; +∞)',
          'C. (-∞; 2)',
          'D. (2; +∞)'
        ],
        correctAnswer: 1,
        explanation: 'Ta có y\' = 3x² - 6x = 3x(x - 2). Cho y\' = 0 => x = 0 hoặc x = 2. Bảng xét dấu cho thấy y\' > 0 khi x < 0 hoặc x > 2, do đó hàm số đồng biến trên (-∞; 0) và (2; +∞).',
        points: 2,
      },
      {
        id: 'q2',
        questionText: 'Cho hàm số f(x) có đạo hàm f\'(x) = x(x - 1)²(x + 2)³. Số điểm cực trị của hàm số là bao nhiêu?',
        options: [
          'A. 1 điểm',
          'B. 2 điểm',
          'C. 3 điểm',
          'D. 4 điểm'
        ],
        correctAnswer: 1,
        explanation: 'Điểm cực trị chỉ xảy ra khi f\'(x) đổi dấu. Nghiệm x = 1 là nghiệm bội chẵn nên qua đó f\'(x) không đổi dấu. Chỉ có x = 0 (bội 1) và x = -2 (bội 3) là các nghiệm bội lẻ làm f\'(x) đổi dấu. Vậy hàm số có đúng 2 điểm cực trị.',
        points: 2,
      },
      {
        id: 'q3',
        questionText: 'Giá trị cực tiểu của hàm số y = x⁴ - 2x² + 3 bằng bao nhiêu?',
        options: [
          'A. y = 3',
          'B. y = 2',
          'C. y = 1',
          'D. y = 0'
        ],
        correctAnswer: 1,
        explanation: 'Đạo hàm y\' = 4x³ - 4x = 4x(x² - 1) = 0 => x = 0 hoặc x = ±1. Điểm cực tiểu đạt tại x = ±1 với giá trị cực tiểu y = (±1)⁴ - 2(±1)² + 3 = 1 - 2 + 3 = 2.',
        points: 2,
      },
      {
        id: 'q4',
        questionText: 'Đường tiệm cận ngang của đồ thị hàm số y = (2x - 1)/(x + 3) là:',
        options: [
          'A. y = 2',
          'B. x = -3',
          'C. y = -1/3',
          'D. x = 2'
        ],
        correctAnswer: 0,
        explanation: 'lim(x→±∞) (2x - 1)/(x + 3) = 2. Do đó đường tiệm cận ngang là y = 2.',
        points: 2,
      },
      {
        id: 'q5',
        questionText: 'Cho hàm số y = f(x) có bảng xét dấu f\'(x). Hàm số nghịch biến khi nào?',
        options: [
          'A. Khi f\'(x) > 0',
          'B. Khi f\'(x) < 0',
          'C. Khi f\'(x) = 0',
          'D. Khi f\'\'(x) > 0'
        ],
        correctAnswer: 1,
        explanation: 'Theo định lý mở rộng về tính đơn điệu, hàm số f(x) nghịch biến trên khoảng K khi và chỉ khi f\'(x) ≤ 0 với mọi x thuộc K và dấu bằng chỉ xảy ra tại hữu hạn điểm.',
        points: 2,
      },
    ],
  },
  {
    id: 'assign_quiz_eng_1',
    classId: 'class_eng_101',
    title: 'Mini Test: Academic Vocabulary & Sentence Structure',
    description: 'Trắc nghiệm kiểm tra độ chuẩn xác ngữ pháp và từ vựng học thuật nâng cao.',
    type: 'quiz',
    durationMinutes: 10,
    dueDate: '2026-12-31T23:59:59Z',
    totalPoints: 10,
    createdAt: '2026-02-07T11:00:00Z',
    questions: [
      {
        id: 'qe1',
        questionText: 'Select the synonym closest in meaning to "DETRIMENTAL":',
        options: [
          'A. Beneficial',
          'B. Harmful',
          'C. Essential',
          'D. Ambiguous'
        ],
        correctAnswer: 1,
        explanation: '"Detrimental" means causing damage or harm, synonymous with "harmful".',
        points: 3,
      },
      {
        id: 'qe2',
        questionText: 'Complete the sentence: "The new governmental policy aimed to _______ unemployment by creating renewable energy jobs."',
        options: [
          'A. mitigate',
          'B. exacerbate',
          'C. jeopardize',
          'D. disperse'
        ],
        correctAnswer: 0,
        explanation: '"Mitigate" means to make something less severe or serious, which matches the context of alleviating unemployment.',
        points: 3,
      },
      {
        id: 'qe3',
        questionText: 'Which phrase is most appropriate for introducing an opposing academic viewpoint?',
        options: [
          'A. In addition to this',
          'B. On the other hand',
          'C. By the same token',
          'D. Furthermore'
        ],
        correctAnswer: 1,
        explanation: '"On the other hand" is standard for contrast and opposing viewpoints.',
        points: 4,
      },
    ],
  },
  {
    id: 'assign_essay_math_1',
    classId: 'class_math_12',
    title: 'Bài Tập Tự Luận: Khảo Sát Đồ Thị & Biện Luận Số Nghiệm Phương Trình',
    description: 'Học sinh trình bày bài giải chi tiết vào vở hoặc file văn bản, nêu rõ từng bước tìm tập xác định, đạo hàm, lập bảng biến thiên và vẽ đồ thị.',
    type: 'essay',
    dueDate: '2026-12-25T23:59:59Z',
    totalPoints: 10,
    essayInstructions: 'Cho hàm số y = -x³ + 3x² - 1 (C).\n1. Khảo sát sự biến thiên và vẽ đồ thị (C) của hàm số.\n2. Dựa vào đồ thị (C), tìm tất cả các giá trị của tham số m để phương trình x³ - 3x² + m = 0 có đúng 3 nghiệm phân biệt.',
    createdAt: '2026-02-08T15:00:00Z',
  },
];

// Initial Seed Submissions
const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_lan_math_quiz',
    assignmentId: 'assign_quiz_math_1',
    classId: 'class_math_12',
    studentId: 'user_student_2',
    studentName: 'Nguyễn Thị Ngọc Lan',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-02-09T14:20:00Z',
    type: 'quiz',
    quizAnswers: { q1: 1, q2: 1, q3: 1, q4: 0, q5: 1 },
    score: 10,
    feedback: 'Xuất sắc! Em làm bài chính xác 100% và nắm rất chắc lý thuyết nghiệm bội chẵn/bội lẻ.',
    status: 'graded',
    timeSpentSeconds: 380,
  },
  {
    id: 'sub_khoa_math_quiz',
    assignmentId: 'assign_quiz_math_1',
    classId: 'class_math_12',
    studentId: 'user_student_3',
    studentName: 'Trần Đăng Khoa',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-02-10T16:45:00Z',
    type: 'quiz',
    quizAnswers: { q1: 1, q2: 2, q3: 1, q4: 0, q5: 1 },
    score: 8,
    feedback: 'Làm tốt lắm. Chú ý câu số 2: điểm x=1 là nghiệm bội chẵn nên đạo hàm không đổi dấu qua đó.',
    status: 'graded',
    timeSpentSeconds: 520,
  },
  {
    id: 'sub_lan_math_essay',
    assignmentId: 'assign_essay_math_1',
    classId: 'class_math_12',
    studentId: 'user_student_2',
    studentName: 'Nguyễn Thị Ngọc Lan',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-02-11T10:15:00Z',
    type: 'essay',
    essayContent: `Em xin nộp lời giải bài tập khảo sát hàm số:
1. Tập xác định: D = R.
2. Sự biến thiên:
- Đạo hàm: y' = -3x^2 + 6x = -3x(x - 2).
- Cho y' = 0 <=> x = 0 (y = -1) hoặc x = 2 (y = 3).
- Bảng biến thiên: Hàm số đồng biến trên (0; 2), nghịch biến trên (-oo; 0) và (2; +oo).
- Điểm cực tiểu: (0; -1), Điểm cực đại: (2; 3).
3. Biện luận số nghiệm:
Phương trình x^3 - 3x^2 + m = 0 <=> -x^3 + 3x^2 - 1 = m - 1.
Số nghiệm của phương trình là số giao điểm của đồ thị (C) và đường thẳng y = m - 1.
Để phương trình có đúng 3 nghiệm phân biệt thì:
-1 < m - 1 < 3 <=> 0 < m < 4.
Kết luận: Với 0 < m < 4 thì phương trình có đúng 3 nghiệm phân biệt.`,
    status: 'pending',
  },
];

// Initial Seed Notifications
const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'all',
    title: 'Chào mừng bạn đến với EduConnect!',
    message: 'Nền tảng học trực tuyến thông minh kết nối giáo viên và học sinh đã sẵn sàng hoạt động.',
    type: 'system',
    read: true,
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'notif_2',
    userId: 'user_student_1',
    title: 'Bài tập mới: Kiểm Tra 15 Phút Toán 12',
    message: 'Thầy Nguyễn Minh Tuấn vừa giao bài kiểm tra mới trong lớp Toán Học 12. Hạn nộp sắp tới!',
    type: 'assignment',
    classId: 'class_math_12',
    read: false,
    createdAt: '2026-02-06T10:05:00Z',
  },
  {
    id: 'notif_3',
    userId: 'user_student_2',
    title: 'Đã có điểm bài làm Toán 12',
    message: 'Thầy Tuấn đã chấm điểm bài làm trắc nghiệm của bạn: 10/10 điểm! Nhận xét: Xuất sắc!',
    type: 'grade',
    classId: 'class_math_12',
    read: true,
    createdAt: '2026-02-09T14:30:00Z',
  },
  {
    id: 'notif_4',
    userId: 'user_teacher_1',
    title: 'Có bài nộp mới cần chấm',
    message: 'Học sinh Nguyễn Thị Ngọc Lan vừa nộp bài tự luận Khảo sát hàm số trong lớp Toán 12.',
    type: 'assignment',
    classId: 'class_math_12',
    read: false,
    createdAt: '2026-02-11T10:16:00Z',
  },
];

type StorageSubscriber = () => void;
const subscribers: Set<StorageSubscriber> = new Set();

function notifySubscribers() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Storage subscriber error:', e);
    }
  });
}

export const StorageService = {
  subscribe(callback: StorageSubscriber) {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  },

  // Initialize storage if empty or not versioned
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.INIT_FLAG)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(DEFAULT_CLASSROOMS));
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(DEFAULT_LESSONS));
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(DEFAULT_SUBMISSIONS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0])); // Teacher default
      localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
    }
  },

  resetAll() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(DEFAULT_CLASSROOMS));
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(DEFAULT_LESSONS));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(DEFAULT_SUBMISSIONS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    notifySubscribers();
  },

  // USER & AUTH METHODS
  getCurrentUser(): User | null {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    notifySubscribers();
  },

  getUsers(): User[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifySubscribers();
  },

  login(email: string, role?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, error: 'Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại.' };
    }
    if (user.status === 'locked') {
      return { success: false, error: 'Tài khoản này đã bị khóa bởi quản trị viên hệ thống.' };
    }
    if (role && user.role !== role) {
      return { success: false, error: `Tài khoản này có vai trò là "${user.role === 'teacher' ? 'Giáo viên' : user.role === 'student' ? 'Học sinh' : 'Quản trị viên'}", không thể đăng nhập với vai trò đã chọn.` };
    }
    this.setCurrentUser(user);
    return { success: true, user };
  },

  register(data: { name: string; email: string; role: 'teacher' | 'student'; school?: string }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'Email này đã được sử dụng. Vui lòng chọn email khác.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      role: data.role,
      avatar: data.role === 'teacher'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      school: data.school || 'Trường THPT',
      bio: data.role === 'teacher' ? 'Giáo viên nhiệt huyết tại EduConnect.' : 'Học sinh chăm chỉ tại EduConnect.',
      status: 'active',
      createdAt: new Date().toISOString(),
      enrolledClassIds: [],
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    // Welcome notification
    this.addNotification({
      userId: newUser.id,
      title: 'Chào mừng bạn đến với EduConnect!',
      message: `Xin chào ${newUser.name}, tài khoản của bạn đã được khởi tạo thành công với vai trò ${newUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}.`,
      type: 'system',
      read: false,
    });

    return { success: true, user: newUser };
  },

  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    this.saveUsers(users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[index]);
    }

    return users[index];
  },

  toggleUserStatus(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    user.status = user.status === 'active' ? 'locked' : 'active';
    this.saveUsers(users);
    return true;
  },

  deleteUser(userId: string): boolean {
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.saveUsers(users);
    return true;
  },

  // CLASSROOM METHODS
  getClassrooms(): Classroom[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
    return data ? JSON.parse(data) : [];
  },

  saveClassrooms(classrooms: Classroom[]) {
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(classrooms));
    notifySubscribers();
  },

  getClassroomById(id: string): Classroom | null {
    const classrooms = this.getClassrooms();
    return classrooms.find((c) => c.id === id) || null;
  },

  createClassroom(data: {
    name: string;
    subject: string;
    description: string;
    schedule: string;
    teacher: User;
    coverImage?: string;
  }): Classroom {
    const classrooms = this.getClassrooms();
    // Generate unique 6-character code
    const code = (data.subject.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900)).replace(/[^A-Z0-9]/g, 'X');

    const covers = [
      '/src/assets/images/course_math_science_1794199364346.jpg',
      '/src/assets/images/course_literature_languages_1794199364597.jpg',
      '/src/assets/images/course_computer_science_1794199363990.jpg',
    ];

    const newClass: Classroom = {
      id: `class_${Date.now()}`,
      code,
      name: data.name.trim(),
      subject: data.subject.trim(),
      description: data.description.trim(),
      teacherId: data.teacher.id,
      teacherName: data.teacher.name,
      teacherAvatar: data.teacher.avatar,
      coverImage: data.coverImage || covers[Math.floor(Math.random() * covers.length)],
      schedule: data.schedule || 'Linh hoạt',
      studentIds: [],
      createdAt: new Date().toISOString(),
    };

    classrooms.unshift(newClass);
    this.saveClassrooms(classrooms);
    return newClass;
  },

  updateClassroom(id: string, updates: Partial<Classroom>): Classroom | null {
    const classrooms = this.getClassrooms();
    const index = classrooms.findIndex((c) => c.id === id);
    if (index === -1) return null;

    classrooms[index] = { ...classrooms[index], ...updates };
    this.saveClassrooms(classrooms);
    return classrooms[index];
  },

  deleteClassroom(id: string): boolean {
    const classrooms = this.getClassrooms().filter((c) => c.id !== id);
    this.saveClassrooms(classrooms);
    return true;
  },

  joinClassroomByCode(code: string, studentId: string): { success: boolean; classroom?: Classroom; error?: string } {
    const classrooms = this.getClassrooms();
    const classroom = classrooms.find((c) => c.code.trim().toUpperCase() === code.trim().toUpperCase());

    if (!classroom) {
      return { success: false, error: 'Mã lớp không hợp lệ hoặc lớp học không tồn tại.' };
    }

    if (classroom.studentIds.includes(studentId)) {
      return { success: false, error: 'Bạn đã là thành viên của lớp học này rồi.' };
    }

    classroom.studentIds.push(studentId);
    this.saveClassrooms(classrooms);

    // Update user's enrolledClassIds
    const users = this.getUsers();
    const student = users.find((u) => u.id === studentId);
    if (student) {
      student.enrolledClassIds = student.enrolledClassIds || [];
      if (!student.enrolledClassIds.includes(classroom.id)) {
        student.enrolledClassIds.push(classroom.id);
        this.saveUsers(users);
      }
    }

    // Add notification
    this.addNotification({
      userId: studentId,
      title: `Đã tham gia lớp ${classroom.name}`,
      message: `Chào mừng bạn gia nhập lớp ${classroom.name} do ${classroom.teacherName} phụ trách.`,
      type: 'system',
      classId: classroom.id,
      read: false,
    });

    return { success: true, classroom };
  },

  removeStudentFromClass(classId: string, studentId: string): boolean {
    const classrooms = this.getClassrooms();
    const classroom = classrooms.find((c) => c.id === classId);
    if (!classroom) return false;

    classroom.studentIds = classroom.studentIds.filter((sid) => sid !== studentId);
    this.saveClassrooms(classrooms);

    const users = this.getUsers();
    const student = users.find((u) => u.id === studentId);
    if (student && student.enrolledClassIds) {
      student.enrolledClassIds = student.enrolledClassIds.filter((cid) => cid !== classId);
      this.saveUsers(users);
    }

    return true;
  },

  // LESSON METHODS
  getLessons(classId?: string): Lesson[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
    const lessons: Lesson[] = data ? JSON.parse(data) : [];
    if (classId) {
      return lessons.filter((l) => l.classId === classId).sort((a, b) => a.order - b.order);
    }
    return lessons;
  },

  saveLessons(lessons: Lesson[]) {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    notifySubscribers();
  },

  createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt'>): Lesson {
    const lessons = this.getLessons();
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    lessons.push(newLesson);
    this.saveLessons(lessons);

    // Notify students of the class
    const classroom = this.getClassroomById(lessonData.classId);
    if (classroom) {
      classroom.studentIds.forEach((sid) => {
        this.addNotification({
          userId: sid,
          title: `Bài giảng mới: ${newLesson.title}`,
          message: `Thầy/Cô ${classroom.teacherName} đã đăng bài giảng mới trong lớp ${classroom.name}.`,
          type: 'announcement',
          classId: classroom.id,
          read: false,
        });
      });
    }

    return newLesson;
  },

  deleteLesson(lessonId: string): boolean {
    const lessons = this.getLessons().filter((l) => l.id !== lessonId);
    this.saveLessons(lessons);
    return true;
  },

  // ASSIGNMENT METHODS
  getAssignments(classId?: string): Assignment[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    const assignments: Assignment[] = data ? JSON.parse(data) : [];
    if (classId) {
      return assignments.filter((a) => a.classId === classId);
    }
    return assignments;
  },

  saveAssignments(assignments: Assignment[]) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    notifySubscribers();
  },

  createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Assignment {
    const assignments = this.getAssignments();
    const newAssignment: Assignment = {
      ...data,
      id: `assign_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    assignments.push(newAssignment);
    this.saveAssignments(assignments);

    // Notify students
    const classroom = this.getClassroomById(data.classId);
    if (classroom) {
      classroom.studentIds.forEach((sid) => {
        this.addNotification({
          userId: sid,
          title: `Bài tập mới: ${newAssignment.title}`,
          message: `Lớp ${classroom.name} vừa có bài ${newAssignment.type === 'quiz' ? 'trắc nghiệm' : 'tự luận'} mới. Hạn nộp: ${new Date(newAssignment.dueDate).toLocaleDateString('vi-VN')}.`,
          type: 'assignment',
          classId: classroom.id,
          read: false,
        });
      });
    }

    return newAssignment;
  },

  deleteAssignment(id: string): boolean {
    const assignments = this.getAssignments().filter((a) => a.id !== id);
    this.saveAssignments(assignments);
    return true;
  },

  // SUBMISSION METHODS
  getSubmissions(assignmentId?: string): Submission[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const submissions: Submission[] = data ? JSON.parse(data) : [];
    if (assignmentId) {
      return submissions.filter((s) => s.assignmentId === assignmentId);
    }
    return submissions;
  },

  saveSubmissions(submissions: Submission[]) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    notifySubscribers();
  },

  submitQuiz(data: {
    assignmentId: string;
    classId: string;
    student: User;
    answers: Record<string, number>;
    timeSpentSeconds: number;
  }): Submission {
    const assignments = this.getAssignments();
    const assignment = assignments.find((a) => a.id === data.assignmentId);
    let calculatedScore = 0;

    if (assignment && assignment.questions) {
      assignment.questions.forEach((q) => {
        if (data.answers[q.id] === q.correctAnswer) {
          calculatedScore += q.points;
        }
      });
    }

    const submissions = this.getSubmissions();
    const newSubmission: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId: data.assignmentId,
      classId: data.classId,
      studentId: data.student.id,
      studentName: data.student.name,
      studentAvatar: data.student.avatar,
      submittedAt: new Date().toISOString(),
      type: 'quiz',
      quizAnswers: data.answers,
      score: calculatedScore,
      feedback: calculatedScore >= 8 ? 'Rất tốt! Bạn nắm rất vững kiến thức.' : calculatedScore >= 5 ? 'Đạt yêu cầu. Hãy xem lại các câu sai để củng cố.' : 'Cần ôn tập kỹ hơn nội dung lý thuyết bài học.',
      status: 'graded',
      timeSpentSeconds: data.timeSpentSeconds,
    };

    submissions.push(newSubmission);
    this.saveSubmissions(submissions);

    // Notify teacher
    const classroom = this.getClassroomById(data.classId);
    if (classroom) {
      this.addNotification({
        userId: classroom.teacherId,
        title: `Học sinh đã nộp bài trắc nghiệm`,
        message: `${data.student.name} đã hoàn thành bài "${assignment?.title || 'Trắc nghiệm'}" với số điểm ${calculatedScore}/10.`,
        type: 'assignment',
        classId: classroom.id,
        read: false,
      });
    }

    return newSubmission;
  },

  submitEssay(data: {
    assignmentId: string;
    classId: string;
    student: User;
    content: string;
    attachmentUrl?: string;
  }): Submission {
    const submissions = this.getSubmissions();
    const assignments = this.getAssignments();
    const assignment = assignments.find((a) => a.id === data.assignmentId);

    const newSubmission: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId: data.assignmentId,
      classId: data.classId,
      studentId: data.student.id,
      studentName: data.student.name,
      studentAvatar: data.student.avatar,
      submittedAt: new Date().toISOString(),
      type: 'essay',
      essayContent: data.content,
      essayAttachmentUrl: data.attachmentUrl,
      status: 'pending',
    };

    submissions.push(newSubmission);
    this.saveSubmissions(submissions);

    // Notify teacher
    const classroom = this.getClassroomById(data.classId);
    if (classroom) {
      this.addNotification({
        userId: classroom.teacherId,
        title: `Có bài tự luận mới cần chấm`,
        message: `${data.student.name} vừa nộp bài tự luận "${assignment?.title || 'Bài tập'}" trong lớp ${classroom.name}.`,
        type: 'assignment',
        classId: classroom.id,
        read: false,
      });
    }

    return newSubmission;
  },

  gradeSubmission(submissionId: string, score: number, feedback: string): Submission | null {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex((s) => s.id === submissionId);
    if (index === -1) return null;

    submissions[index].score = score;
    submissions[index].feedback = feedback;
    submissions[index].status = 'graded';
    this.saveSubmissions(submissions);

    // Notify student
    const sub = submissions[index];
    this.addNotification({
      userId: sub.studentId,
      title: `Bài tập của bạn đã được chấm điểm!`,
      message: `Giáo viên đã chấm bài làm của bạn với số điểm: ${score}/10 điểm. Nhận xét: "${feedback}"`,
      type: 'grade',
      classId: sub.classId,
      read: false,
    });

    return submissions[index];
  },

  // NOTIFICATION METHODS
  getNotifications(userId: string): NotificationItem[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: NotificationItem[] = data ? JSON.parse(data) : [];
    return notifications
      .filter((n) => n.userId === userId || n.userId === 'all')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'createdAt'>): NotificationItem {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: NotificationItem[] = data ? JSON.parse(data) : [];
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    notifySubscribers();
    return newNotif;
  },

  markNotificationAsRead(id: string) {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) return;
    const notifications: NotificationItem[] = JSON.parse(data);
    const target = notifications.find((n) => n.id === id);
    if (target) {
      target.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      notifySubscribers();
    }
  },

  markAllNotificationsRead(userId: string) {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) return;
    const notifications: NotificationItem[] = JSON.parse(data);
    notifications.forEach((n) => {
      if (n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    notifySubscribers();
  },

  // SYSTEM STATS (FOR ADMIN)
  getSystemStats(): SystemStats {
    const users = this.getUsers();
    const classrooms = this.getClassrooms();
    const assignments = this.getAssignments();
    const submissions = this.getSubmissions();

    return {
      totalUsers: users.length,
      totalTeachers: users.filter((u) => u.role === 'teacher').length,
      totalStudents: users.filter((u) => u.role === 'student').length,
      totalClasses: classrooms.length,
      totalAssignments: assignments.length,
      totalSubmissions: submissions.length,
      systemHealth: '100% Hoạt động ổn định',
    };
  },
};
