import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FileCheck2,
  Users,
  BarChart3,
  Bell,
  Plus,
  Copy,
  Check,
  Calendar,
  Clock,
  Download,
  Video,
  FileText,
  AlertCircle,
  ExternalLink,
  Award,
  Edit3,
  Trash2,
  LogOut,
  UserMinus,
  CheckCircle2
} from 'lucide-react';
import { Classroom, User, Lesson, Assignment, Submission } from '../types';
import { StorageService } from '../services/storage';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

interface ClassroomDetailProps {
  classroom: Classroom;
  currentUser: User;
  onBack: () => void;
  lessons: Lesson[];
  assignments: Assignment[];
  submissions: Submission[];
  allUsers: User[];
  onOpenTakeQuiz: (assignment: Assignment) => void;
  onOpenSubmitEssay: (assignment: Assignment) => void;
  onOpenGrading: (submission: Submission, assignment: Assignment) => void;
  onRefresh: () => void;
}

export const ClassroomDetail: React.FC<ClassroomDetailProps> = ({
  classroom,
  currentUser,
  onBack,
  lessons,
  assignments,
  submissions,
  allUsers,
  onOpenTakeQuiz,
  onOpenSubmitEssay,
  onOpenGrading,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'assignments' | 'gradebook' | 'members' | 'announcements'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Edit Classroom Modal
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editName, setEditName] = useState(classroom.name);
  const [editSubject, setEditSubject] = useState(classroom.subject);
  const [editDesc, setEditDesc] = useState(classroom.description);
  const [editSchedule, setEditSchedule] = useState(classroom.schedule);

  // Modal: Add Lesson
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [lessonDocName, setLessonDocName] = useState('');

  // Modal: Add Assignment
  const [showAddAssModal, setShowAddAssModal] = useState(false);
  const [assTitle, setAssTitle] = useState('');
  const [assDesc, setAssDesc] = useState('');
  const [assType, setAssType] = useState<'quiz' | 'essay'>('quiz');
  const [assDuration, setAssDuration] = useState(15);
  const [assDueDate, setAssDueDate] = useState('2026-12-31');
  const [assEssayInstructions, setAssEssayInstructions] = useState('');

  // View Submissions Modal for Teacher
  const [viewingAssignmentSubs, setViewingAssignmentSubs] = useState<Assignment | null>(null);

  // Announcement post
  const [announcementText, setAnnouncementText] = useState('');

  const { showToast } = useToast();

  const isTeacher = classroom.teacherId === currentUser.id || currentUser.role === 'admin';
  const isStudent = classroom.studentIds.includes(currentUser.id);

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    setCopiedCode(true);
    showToast(`Đã sao chép mã lớp: ${classroom.code}`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Edit classroom
  const handleUpdateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editDesc.trim()) {
      showToast('Vui lòng điền đầy đủ tên và mô tả lớp học.', 'error');
      return;
    }

    StorageService.updateClassroom(classroom.id, {
      name: editName.trim(),
      subject: editSubject.trim(),
      description: editDesc.trim(),
      schedule: editSchedule.trim() || 'Linh hoạt',
    });

    showToast('Đã cập nhật thông tin lớp học!', 'success');
    setShowEditClassModal(false);
    onRefresh();
  };

  // Delete classroom
  const handleDeleteClassroom = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${classroom.name}"? Thao tác này không thể hoàn tác.`)) {
      StorageService.deleteClassroom(classroom.id);
      showToast('Đã xóa lớp học thành công.', 'success');
      onRefresh();
      onBack();
    }
  };

  // Student leave classroom
  const handleLeaveClassroom = () => {
    if (window.confirm(`Bạn có chắc muốn rời khỏi lớp học "${classroom.name}"?`)) {
      StorageService.removeStudentFromClass(classroom.id, currentUser.id);
      showToast('Bạn đã rời khỏi lớp học.', 'info');
      onRefresh();
      onBack();
    }
  };

  // Remove student from class
  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa học sinh "${studentName}" khỏi lớp?`)) {
      StorageService.removeStudentFromClass(classroom.id, studentId);
      showToast(`Đã xóa học sinh ${studentName} khỏi lớp.`, 'success');
      onRefresh();
    }
  };

  // Delete lesson
  const handleDeleteLesson = (lessonId: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài giảng "${title}"?`)) {
      StorageService.deleteLesson(lessonId);
      showToast('Đã xóa bài giảng thành công.', 'success');
      onRefresh();
    }
  };

  // Delete assignment
  const handleDeleteAssignment = (assId: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài tập "${title}"?`)) {
      StorageService.deleteAssignment(assId);
      showToast('Đã xóa bài tập thành công.', 'success');
      onRefresh();
    }
  };

  // Add Lesson
  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonContent.trim()) {
      showToast('Vui lòng nhập tiêu đề và nội dung bài học.', 'error');
      return;
    }

    const attachments = lessonDocName
      ? [
          {
            id: `att_${Date.now()}`,
            name: lessonDocName.endsWith('.pdf') ? lessonDocName : `${lessonDocName}.pdf`,
            type: 'pdf' as const,
            url: `#download-${lessonDocName}`,
            size: '2.5 MB',
          },
        ]
      : [];

    StorageService.createLesson({
      classId: classroom.id,
      title: lessonTitle.trim(),
      description: lessonDesc.trim(),
      subject: classroom.subject,
      content: lessonContent.trim(),
      videoUrl: lessonVideo.trim() || undefined,
      order: lessons.length + 1,
      attachments,
    });

    showToast('Đã thêm bài giảng mới thành công!', 'success');
    setShowAddLessonModal(false);
    setLessonTitle('');
    setLessonDesc('');
    setLessonContent('');
    setLessonVideo('');
    setLessonDocName('');
    onRefresh();
  };

  // Add Assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assTitle.trim()) {
      showToast('Vui lòng nhập tiêu đề bài tập.', 'error');
      return;
    }

    const sampleQuizQuestions = [
      {
        id: `q_${Date.now()}_1`,
        questionText: 'Cho hàm số y = f(x) liên tục trên R. Mệnh đề nào sau đây là đúng?',
        options: [
          'A. Nếu f\'(x) > 0 thì hàm số đồng biến',
          'B. Nếu f\'(x) < 0 thì hàm số nghịch biến',
          'C. Cả A và B đều đúng',
          'D. Cả A và B đều sai'
        ],
        correctAnswer: 2,
        explanation: 'Theo định lý cơ bản về tính đơn điệu, f\'(x) mang dấu dương thì hàm số đồng biến, mang dấu âm thì hàm số nghịch biến.',
        points: 5,
      },
      {
        id: `q_${Date.now()}_2`,
        questionText: 'Số đường tiệm cận của đồ thị hàm số phân thức bậc nhất trên bậc nhất là:',
        options: [
          'A. 1 đường tiệm cận',
          'B. 2 đường tiệm cận (1 đứng, 1 ngang)',
          'C. 3 đường tiệm cận',
          'D. Không có đường tiệm cận nào'
        ],
        correctAnswer: 1,
        explanation: 'Hàm số bậc nhất trên bậc nhất y = (ax+b)/(cx+d) luôn có 1 tiệm cận đứng x = -d/c và 1 tiệm cận ngang y = a/c.',
        points: 5,
      },
    ];

    StorageService.createAssignment({
      classId: classroom.id,
      title: assTitle.trim(),
      description: assDesc.trim() || 'Bài tập rèn luyện kiến thức bài học.',
      type: assType,
      durationMinutes: assType === 'quiz' ? assDuration : undefined,
      dueDate: new Date(assDueDate).toISOString(),
      totalPoints: 10,
      questions: assType === 'quiz' ? sampleQuizQuestions : undefined,
      essayInstructions: assType === 'essay' ? assEssayInstructions : undefined,
    });

    showToast('Đã giao bài tập mới cho lớp học!', 'success');
    setShowAddAssModal(false);
    setAssTitle('');
    setAssDesc('');
    setAssEssayInstructions('');
    onRefresh();
  };

  // Post announcement
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    classroom.studentIds.forEach((sid) => {
      StorageService.addNotification({
        userId: sid,
        title: `Thông báo từ ${classroom.name}`,
        message: announcementText.trim(),
        type: 'announcement',
        classId: classroom.id,
        read: false,
      });
    });

    showToast('Đã gửi thông báo đến toàn bộ học sinh trong lớp!', 'success');
    setAnnouncementText('');
  };

  // Student members
  const memberStudents = allUsers.filter((u) => classroom.studentIds.includes(u.id));

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách lớp</span>
        </button>

        {/* Role action buttons */}
        <div className="flex items-center gap-2">
          {isTeacher ? (
            <>
              <button
                onClick={() => {
                  setEditName(classroom.name);
                  setEditSubject(classroom.subject);
                  setEditDesc(classroom.description);
                  setEditSchedule(classroom.schedule);
                  setShowEditClassModal(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Chỉnh sửa lớp</span>
              </button>

              <button
                onClick={handleDeleteClassroom}
                className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa lớp học</span>
              </button>
            </>
          ) : isStudent ? (
            <button
              onClick={handleLeaveClassroom}
              className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Rời khỏi lớp</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Classroom Hero Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src={classroom.coverImage}
            alt={classroom.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

          {/* Quick info overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded text-white">
                  {classroom.subject}
                </span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {classroom.schedule}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">{classroom.name}</h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-1">
                {classroom.description}
              </p>
            </div>

            {/* Class code button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyCode}
                className="bg-white/90 hover:bg-white text-slate-900 text-xs font-mono font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                title="Sao chép mã lớp để gửi cho học sinh"
              >
                <span>Mã lớp: {classroom.code}</span>
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 px-5 py-2 border-t border-slate-100 bg-slate-50/80 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`py-2 px-3.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'lessons' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bài giảng & Tài liệu ({lessons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2 px-3.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'assignments' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Bài tập & Đề thi ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gradebook')}
            className={`py-2 px-3.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'gradebook' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Bảng điểm lớp</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`py-2 px-3.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'members' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Thành viên ({classroom.studentIds.length})</span>
          </button>

          {isTeacher && (
            <button
              onClick={() => setActiveTab('announcements')}
              className={`py-2 px-3.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'announcements' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Gửi thông báo</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Bài giảng & Tài liệu */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Danh Sách Bài Học ({lessons.length})
            </h3>
            {isTeacher && (
              <button
                onClick={() => setShowAddLessonModal(true)}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm bài giảng mới</span>
              </button>
            )}
          </div>

          {lessons.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Chưa có bài giảng nào trong lớp</p>
              {isTeacher && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hãy nhấn "Thêm bài giảng mới" để chia sẻ kiến thức với học sinh.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                          Bài {idx + 1}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-400">
                          {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{lesson.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Xem bài học →
                      </button>

                      {isTeacher && (
                        <button
                          onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa bài học"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Attachments preview */}
                  {lesson.attachments && lesson.attachments.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400">Tài liệu:</span>
                      {lesson.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.url}
                          onClick={(e) => {
                            e.preventDefault();
                            showToast(`Đang tải tệp: ${att.name}`, 'info');
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 transition-colors font-medium"
                        >
                          <Download className="w-3.5 h-3.5 text-sky-600" />
                          <span className="truncate max-w-[200px]">{att.name}</span>
                          {att.size && <span className="text-[10px] text-slate-400">({att.size})</span>}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bài tập & Kiểm tra */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Danh Sách Bài Tập & Đề Thi ({assignments.length})
            </h3>
            {isTeacher && (
              <button
                onClick={() => setShowAddAssModal(true)}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Giao bài tập mới</span>
              </button>
            )}
          </div>

          {assignments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Chưa có bài tập nào được giao</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((ass) => {
                const isQuiz = ass.type === 'quiz';
                const mySub = submissions.find(
                  (s) => s.assignmentId === ass.id && s.studentId === currentUser.id
                );
                const classSubs = submissions.filter((s) => s.assignmentId === ass.id);

                return (
                  <div
                    key={ass.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isQuiz ? 'bg-sky-50 text-sky-700' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {isQuiz ? 'Trắc nghiệm tính giờ' : 'Tự luận'}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          Hạn nộp: {new Date(ass.dueDate).toLocaleDateString('vi-VN')}
                        </span>
                        {isQuiz && (
                          <span className="text-xs text-slate-500">
                            · {ass.durationMinutes} phút
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{ass.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-1">{ass.description}</p>
                    </div>

                    {/* Actions based on role */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {isTeacher ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingAssignmentSubs(ass)}
                            className="px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs transition-colors"
                          >
                            Xem bài nộp ({classSubs.length})
                          </button>

                          <button
                            onClick={() => handleDeleteAssignment(ass.id, ass.title)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Xóa bài tập"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : mySub ? (
                        <div className="text-right">
                          {mySub.score !== undefined ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                              <Award className="w-4 h-4 text-emerald-600" />
                              <span>{mySub.score}/10đ (Đã chấm)</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                              Đã nộp (Chờ chấm)
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => (isQuiz ? onOpenTakeQuiz(ass) : onOpenSubmitEssay(ass))}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                        >
                          {isQuiz ? 'Bắt đầu làm bài thi' : 'Nộp bài tự luận'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Bảng điểm lớp */}
      {activeTab === 'gradebook' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Bảng Điểm Học Sinh Lớp {classroom.name}
            </h3>
            <span className="text-xs text-slate-500">{memberStudents.length} học sinh</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-3">Học sinh</th>
                  {assignments.map((ass) => (
                    <th key={ass.id} className="px-4 py-3 truncate max-w-[150px]">
                      {ass.title}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Điểm TB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberStudents.map((st) => {
                  let totalScore = 0;
                  let count = 0;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-900">{st.name}</span>
                        </div>
                      </td>

                      {assignments.map((ass) => {
                        const sub = submissions.find(
                          (s) => s.assignmentId === ass.id && s.studentId === st.id
                        );
                        if (sub?.score !== undefined) {
                          totalScore += sub.score;
                          count++;
                        }

                        return (
                          <td key={ass.id} className="px-4 py-3 font-mono">
                            {sub ? (
                              sub.score !== undefined ? (
                                <span className="font-bold text-emerald-600">{sub.score}đ</span>
                              ) : (
                                <span className="text-amber-600 font-semibold">Chờ chấm</span>
                              )
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {count > 0 ? (totalScore / count).toFixed(1) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Thành viên */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Giáo Viên Phụ Trách</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={classroom.teacherAvatar}
                alt={classroom.teacherName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{classroom.teacherName}</p>
                <p className="text-[11px] text-slate-500">Giáo viên bộ môn {classroom.subject}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Danh Sách Học Sinh ({memberStudents.length})
            </h3>
            {memberStudents.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có học sinh nào tham gia lớp này.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {memberStudents.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{st.name}</p>
                        <p className="text-[10px] text-slate-400">{st.school || 'Học sinh'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Thành viên
                      </span>

                      {isTeacher && (
                        <button
                          onClick={() => handleRemoveStudent(st.id, st.name)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa học sinh khỏi lớp"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Announcements */}
      {activeTab === 'announcements' && isTeacher && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Gửi Thông Báo Cho Lớp Học</h3>
          <p className="text-xs text-slate-500">
            Thông báo này sẽ được gửi trực tiếp đến trung tâm thông báo của tất cả học sinh trong lớp.
          </p>

          <form onSubmit={handlePostAnnouncement} className="space-y-3">
            <textarea
              rows={4}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Nhập nội dung nhắc nhở lịch thi, tài liệu mới hoặc lưu ý bài tập..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                Phát thông báo cho cả lớp
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: View Lesson Content */}
      {selectedLesson && (
        <Modal
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          title={selectedLesson.title}
          maxWidth="3xl"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {selectedLesson.subject}
              </span>
              <span>·</span>
              <span>Đăng ngày: {new Date(selectedLesson.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>

            {selectedLesson.videoUrl && (
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Video Bài Giảng Tương Tác</p>
                    <p className="text-[11px] text-slate-300">Nhấp để phát video bài học trực tuyến</p>
                  </div>
                </div>
                <a
                  href={selectedLesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Mở video</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              {selectedLesson.content}
            </div>

            {selectedLesson.attachments && selectedLesson.attachments.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800">Tài liệu đính kèm bài học:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedLesson.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="text-xs font-medium text-slate-800 truncate">
                          {att.name}
                        </span>
                      </div>
                      <button
                        onClick={() => showToast(`Đang tải tệp: ${att.name}`, 'info')}
                        className="p-1 text-slate-400 hover:text-sky-600"
                        title="Tải về"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Đóng bài học
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Edit Classroom */}
      <Modal
        isOpen={showEditClassModal}
        onClose={() => setShowEditClassModal(false)}
        title="Chỉnh Sửa Thông Tin Lớp Học"
        maxWidth="lg"
      >
        <form onSubmit={handleUpdateClassroom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên lớp học:
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn học:
              </label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lịch học:
              </label>
              <input
                type="text"
                value={editSchedule}
                onChange={(e) => setEditSchedule(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả lớp học:
            </label>
            <textarea
              rows={3}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowEditClassModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Assignment Submissions for Teacher */}
      {viewingAssignmentSubs && (
        <Modal
          isOpen={!!viewingAssignmentSubs}
          onClose={() => setViewingAssignmentSubs(null)}
          title={`Danh Sách Bài Nộp - ${viewingAssignmentSubs.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {submissions.filter((s) => s.assignmentId === viewingAssignmentSubs.id).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có học sinh nào nộp bài cho đề kiểm tra này.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {submissions
                  .filter((s) => s.assignmentId === viewingAssignmentSubs.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={sub.studentAvatar}
                          alt={sub.studentName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{sub.studentName}</p>
                          <p className="text-[11px] text-slate-400">
                            Nộp lúc: {new Date(sub.submittedAt).toLocaleTimeString('vi-VN')} · {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {sub.score !== undefined ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg font-mono">
                            {sub.score}/10đ
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            Chờ chấm
                          </span>
                        )}

                        <button
                          onClick={() => {
                            onOpenGrading(sub, viewingAssignmentSubs);
                            setViewingAssignmentSubs(null);
                          }}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                        >
                          {sub.status === 'graded' ? 'Xem & sửa điểm' : 'Chấm điểm ngay'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingAssignmentSubs(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add Lesson */}
      <Modal
        isOpen={showAddLessonModal}
        onClose={() => setShowAddLessonModal(false)}
        title="Đăng Tải Bài Giảng Mới"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateLesson} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề bài học:
            </label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Ví dụ: Bài 3: Ứng dụng đạo hàm giải bài toán thực tế"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tóm tắt nội dung:
            </label>
            <input
              type="text"
              value={lessonDesc}
              onChange={(e) => setLessonDesc(e.target.value)}
              placeholder="Tóm tắt ngắn gọn mục tiêu của bài học..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nội dung chi tiết bài giảng:
            </label>
            <textarea
              rows={6}
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              placeholder="Nhập lý thuyết, các công thức định lý và ví dụ minh họa..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link video bài giảng (YouTube / Drive):
              </label>
              <input
                type="text"
                value={lessonVideo}
                onChange={(e) => setLessonVideo(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên file tài liệu đính kèm:
              </label>
              <input
                type="text"
                value={lessonDocName}
                onChange={(e) => setLessonDocName(e.target.value)}
                placeholder="Ví dụ: Giao_trinh_bai_3.pdf"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddLessonModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Xuất bản bài học
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Assignment */}
      <Modal
        isOpen={showAddAssModal}
        onClose={() => setShowAddAssModal(false)}
        title="Giao Bài Tập & Bài Kiểm Tra Mới"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề bài kiểm tra:
            </label>
            <input
              type="text"
              value={assTitle}
              onChange={(e) => setAssTitle(e.target.value)}
              placeholder="Ví dụ: Kiểm tra 15 phút chuyên đề hàm số"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hình thức làm bài:
              </label>
              <select
                value={assType}
                onChange={(e) => setAssType(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="quiz">Trắc nghiệm bấm giờ (Auto-grade)</option>
                <option value="essay">Tự luận (Chấm thủ công)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hạn nộp bài:
              </label>
              <input
                type="date"
                value={assDueDate}
                onChange={(e) => setAssDueDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          {assType === 'quiz' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời gian làm bài (Phút):
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={assDuration}
                onChange={(e) => setAssDuration(parseInt(e.target.value) || 15)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Hệ thống sẽ nạp sẵn bộ câu hỏi trắc nghiệm chuẩn kèm đáp án tự động chấm điểm.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Yêu cầu & Đề bài tự luận:
              </label>
              <textarea
                rows={3}
                value={assEssayInstructions}
                onChange={(e) => setAssEssayInstructions(e.target.value)}
                placeholder="Nêu rõ câu hỏi và tiêu chí đánh giá cho học sinh..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddAssModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Giao bài cho lớp
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
