export type UserRole = 'teacher' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  school?: string;
  bio?: string;
  status: 'active' | 'locked';
  createdAt: string;
  enrolledClassIds?: string[]; // for students
}

export interface Classroom {
  id: string;
  code: string;
  name: string;
  subject: string;
  description: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  coverImage: string;
  schedule: string;
  studentIds: string[];
  createdAt: string;
  archived?: boolean;
}

export interface LessonAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link';
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  classId: string;
  title: string;
  description: string;
  subject: string;
  content: string;
  videoUrl?: string;
  attachments: LessonAttachment[];
  order: number;
  createdAt: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation?: string;
  points: number;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  type: 'quiz' | 'essay';
  durationMinutes?: number; // e.g. 15, 30, 45
  dueDate: string;
  totalPoints: number;
  questions?: Question[];
  essayInstructions?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  submittedAt: string;
  type: 'quiz' | 'essay';
  quizAnswers?: Record<string, number>; // questionId -> selectedIndex
  essayContent?: string;
  essayAttachmentUrl?: string;
  score?: number;
  feedback?: string;
  status: 'pending' | 'graded';
  timeSpentSeconds?: number;
}

export type NotificationType = 'assignment' | 'grade' | 'announcement' | 'system';

export interface NotificationItem {
  id: string;
  userId: string; // user id or 'all'
  title: string;
  message: string;
  type: NotificationType;
  classId?: string;
  read: boolean;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  totalAssignments: number;
  totalSubmissions: number;
  systemHealth: string;
}
