/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import {
  User,
  Classroom,
  Lesson,
  Assignment,
  Submission,
  NotificationItem
} from './types';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClassroomsPage } from './pages/ClassroomsPage';
import { ClassroomDetail } from './pages/ClassroomDetail';
import { LessonsPage } from './pages/LessonsPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { GradebookPage } from './pages/GradebookPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { QuizTakingModal } from './components/QuizTakingModal';
import { EssaySubmitModal } from './components/EssaySubmitModal';
import { GradingModal } from './components/GradingModal';
import { FirebaseDeploymentModal } from './components/FirebaseDeploymentModal';
import { Modal } from './components/Modal';

function EduConnectApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    StorageService.getCurrentUser()
  );
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [classrooms, setClassrooms] = useState<Classroom[]>(() =>
    StorageService.getClassrooms()
  );
  const [lessons, setLessons] = useState<Lesson[]>(() => StorageService.getLessons());
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    StorageService.getAssignments()
  );
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    StorageService.getSubmissions()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    currentUser ? StorageService.getNotifications(currentUser.id) : []
  );

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);

  // Test taking & grading modals
  const [activeQuizAssignment, setActiveQuizAssignment] = useState<Assignment | null>(null);
  const [activeEssayAssignment, setActiveEssayAssignment] = useState<Assignment | null>(null);
  const [gradingContext, setGradingContext] = useState<{
    submission: Submission;
    assignment: Assignment;
  } | null>(null);

  // Quick create modals from dashboard
  const [quickCreateClassOpen, setQuickCreateClassOpen] = useState(false);
  const [quickCreateAssOpen, setQuickCreateAssOpen] = useState(false);
  const [joinClassOpen, setJoinClassOpen] = useState(false);

  // Quick form states
  const [qClassName, setQClassName] = useState('');
  const [qClassSubject, setQClassSubject] = useState('Toán học');
  const [qClassDesc, setQClassDesc] = useState('');
  const [qJoinCode, setQJoinCode] = useState('');
  const [qJoinError, setQJoinError] = useState('');

  // Assignment quick create
  const [qAssClassId, setQAssClassId] = useState('');
  const [qAssTitle, setQAssTitle] = useState('');
  const [qAssType, setQAssType] = useState<'quiz' | 'essay'>('quiz');
  const [qAssDueDate, setQAssDueDate] = useState('2026-12-31');

  const { showToast } = useToast();

  const refreshAllData = () => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    setUsers(StorageService.getUsers());
    setClassrooms(StorageService.getClassrooms());
    setLessons(StorageService.getLessons());
    setAssignments(StorageService.getAssignments());
    setSubmissions(StorageService.getSubmissions());
    if (user) {
      setNotifications(StorageService.getNotifications(user.id));
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    StorageService.init();
    refreshAllData();

    const unsubscribe = StorageService.subscribe(() => {
      refreshAllData();
    });

    return unsubscribe;
  }, []);

  // Update notifications when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setNotifications(StorageService.getNotifications(currentUser.id));
    }
  }, [currentUser]);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveView('landing');
    showToast('Đã đăng xuất khỏi tài khoản.', 'info');
  };

  const handleSwitchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      StorageService.setCurrentUser(target);
      setCurrentUser(target);
      showToast(`Đã chuyển sang tài khoản: ${target.name} (${target.role})`, 'success');
      setActiveView(target.role === 'admin' ? 'admin' : 'dashboard');
    }
  };

  const handleNavigateToRoleDemo = (role: 'teacher' | 'student' | 'admin') => {
    const target = users.find((u) => u.role === role);
    if (target) {
      StorageService.setCurrentUser(target);
      setCurrentUser(target);
      showToast(`Đang trải nghiệm với vai trò ${target.role === 'teacher' ? 'Giáo viên' : target.role === 'student' ? 'Học sinh' : 'Quản trị viên'}`, 'success');
      setActiveView(role === 'admin' ? 'admin' : 'dashboard');
    }
  };

  const handleSelectClassroom = (cls: Classroom) => {
    setSelectedClassroom(cls);
    setActiveView('classroom-detail');
  };

  // Quick Create Class
  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !qClassName.trim()) return;

    const created = StorageService.createClassroom({
      name: qClassName.trim(),
      subject: qClassSubject,
      description: qClassDesc.trim() || 'Lớp học trực tuyến tại EduConnect.',
      schedule: 'Thứ 2, 4, 6 (19:30 - 21:00)',
      teacher: currentUser,
    });

    showToast(`Đã tạo lớp "${created.name}" thành công! Mã lớp: ${created.code}`, 'success');
    setQuickCreateClassOpen(false);
    setQClassName('');
    setQClassDesc('');
    refreshAllData();
  };

  // Quick Join Class
  const handleJoinClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQJoinError('');
    if (!currentUser || !qJoinCode.trim()) return;

    const res = StorageService.joinClassroomByCode(qJoinCode, currentUser.id);
    if (!res.success || !res.classroom) {
      setQJoinError(res.error || 'Mã lớp không hợp lệ.');
      return;
    }

    showToast(`Tham gia lớp "${res.classroom.name}" thành công!`, 'success');
    setJoinClassOpen(false);
    setQJoinCode('');
    refreshAllData();
    handleSelectClassroom(res.classroom);
  };

  // Quick Create Assignment
  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qAssClassId || !qAssTitle.trim()) {
      showToast('Vui lòng chọn lớp học và điền tiêu đề bài tập.', 'error');
      return;
    }

    const sampleQuizQuestions = [
      {
        id: `q_${Date.now()}_1`,
        questionText: 'Tính đạo hàm của hàm số y = ln(2x + 1):',
        options: [
          'A. y\' = 2/(2x + 1)',
          'B. y\' = 1/(2x + 1)',
          'C. y\' = 2/(2x)',
          'D. y\' = 1/(2x)'
        ],
        correctAnswer: 0,
        explanation: 'Ta có công thức (ln u)\' = u\'/u = (2x+1)\'/(2x+1) = 2/(2x+1).',
        points: 5,
      },
      {
        id: `q_${Date.now()}_2`,
        questionText: 'Cho hàm số y = f(x) có đạo hàm f\'(x) đổi dấu từ dương sang âm khi qua x0. Điểm x0 là:',
        options: [
          'A. Điểm cực tiểu',
          'B. Điểm cực đại',
          'C. Điểm uốn',
          'D. Không phải điểm cực trị'
        ],
        correctAnswer: 1,
        explanation: 'Khi đạo hàm đổi dấu từ dương sang âm, hàm số chuyển từ đồng biến sang nghịch biến, do đó x0 là điểm cực đại.',
        points: 5,
      },
    ];

    StorageService.createAssignment({
      classId: qAssClassId,
      title: qAssTitle.trim(),
      description: 'Bài kiểm tra đánh giá mức độ tiếp thu kiến thức.',
      type: qAssType,
      durationMinutes: qAssType === 'quiz' ? 15 : undefined,
      dueDate: new Date(qAssDueDate).toISOString(),
      totalPoints: 10,
      questions: qAssType === 'quiz' ? sampleQuizQuestions : undefined,
      essayInstructions: qAssType === 'essay' ? 'Trình bày chi tiết các bước tính toán và vẽ đồ thị minh họa.' : undefined,
    });

    showToast('Đã giao bài tập mới thành công!', 'success');
    setQuickCreateAssOpen(false);
    setQAssTitle('');
    refreshAllData();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        allUsers={users}
        unreadCount={unreadCount}
        onOpenFirebaseGuide={() => setFirebaseModalOpen(true)}
      />

      {/* Main Content Area */}
      {!currentUser || activeView === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onNavigateToRoleDemo={handleNavigateToRoleDemo}
        />
      ) : (
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          {/* Sidebar */}
          <Sidebar
            role={currentUser.role}
            activeView={activeView}
            onNavigate={(view) => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            unreadCount={unreadCount}
            onOpenFirebaseGuide={() => setFirebaseModalOpen(true)}
          />

          {/* Viewport content */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {activeView === 'dashboard' && (
              <>
                {currentUser.role === 'teacher' && (
                  <TeacherDashboard
                    teacher={currentUser}
                    classrooms={classrooms}
                    assignments={assignments}
                    submissions={submissions}
                    lessons={lessons}
                    onNavigate={(view, data) => {
                      if (view === 'classroom-detail' && data) {
                        setSelectedClassroom(data);
                      }
                      setActiveView(view);
                    }}
                    onOpenCreateClass={() => setQuickCreateClassOpen(true)}
                    onOpenCreateAssignment={() => setQuickCreateAssOpen(true)}
                    onOpenGrading={(sub, ass) => setGradingContext({ submission: sub, assignment: ass })}
                  />
                )}

                {currentUser.role === 'student' && (
                  <StudentDashboard
                    student={currentUser}
                    classrooms={classrooms}
                    assignments={assignments}
                    submissions={submissions}
                    notifications={notifications}
                    onNavigate={(view, data) => {
                      if (view === 'classroom-detail' && data) {
                        setSelectedClassroom(data);
                      }
                      setActiveView(view);
                    }}
                    onOpenJoinClass={() => setJoinClassOpen(true)}
                    onOpenTakeQuiz={(ass) => setActiveQuizAssignment(ass)}
                    onOpenSubmitEssay={(ass) => setActiveEssayAssignment(ass)}
                  />
                )}

                {currentUser.role === 'admin' && (
                  <AdminDashboard
                    currentUser={currentUser}
                    users={users}
                    classrooms={classrooms}
                    assignments={assignments}
                    submissions={submissions}
                    onOpenFirebaseGuide={() => setFirebaseModalOpen(true)}
                    onRefresh={refreshAllData}
                  />
                )}
              </>
            )}

            {activeView === 'admin' && (
              <AdminDashboard
                currentUser={currentUser}
                users={users}
                classrooms={classrooms}
                assignments={assignments}
                submissions={submissions}
                onOpenFirebaseGuide={() => setFirebaseModalOpen(true)}
                onRefresh={refreshAllData}
              />
            )}

            {activeView === 'classrooms' && (
              <ClassroomsPage
                currentUser={currentUser}
                classrooms={classrooms}
                onSelectClassroom={handleSelectClassroom}
                onRefresh={refreshAllData}
              />
            )}

            {activeView === 'classroom-detail' && selectedClassroom && (
              <ClassroomDetail
                classroom={selectedClassroom}
                currentUser={currentUser}
                onBack={() => setActiveView('classrooms')}
                lessons={lessons.filter((l) => l.classId === selectedClassroom.id)}
                assignments={assignments.filter((a) => a.classId === selectedClassroom.id)}
                submissions={submissions.filter((s) => s.classId === selectedClassroom.id)}
                allUsers={users}
                onOpenTakeQuiz={(ass) => setActiveQuizAssignment(ass)}
                onOpenSubmitEssay={(ass) => setActiveEssayAssignment(ass)}
                onOpenGrading={(sub, ass) => setGradingContext({ submission: sub, assignment: ass })}
                onRefresh={refreshAllData}
              />
            )}

            {activeView === 'lessons' && (
              <LessonsPage
                lessons={lessons}
                classrooms={classrooms}
                currentUser={currentUser}
                onNavigateToClass={handleSelectClassroom}
              />
            )}

            {activeView === 'assignments' && (
              <AssignmentsPage
                assignments={assignments}
                classrooms={classrooms}
                submissions={submissions}
                currentUser={currentUser}
                onOpenTakeQuiz={(ass) => setActiveQuizAssignment(ass)}
                onOpenSubmitEssay={(ass) => setActiveEssayAssignment(ass)}
                onOpenGrading={(sub, ass) => setGradingContext({ submission: sub, assignment: ass })}
              />
            )}

            {activeView === 'gradebook' && (
              <GradebookPage
                currentUser={currentUser}
                submissions={submissions}
                assignments={assignments}
                classrooms={classrooms}
                allUsers={users}
                onOpenGrading={(sub, ass) => setGradingContext({ submission: sub, assignment: ass })}
              />
            )}

            {activeView === 'notifications' && (
              <NotificationsPage
                currentUser={currentUser}
                notifications={notifications}
                onRefresh={refreshAllData}
              />
            )}

            {activeView === 'profile' && (
              <ProfilePage
                currentUser={currentUser}
                onRefresh={refreshAllData}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Modals */}

      {/* 1. Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setActiveView(user.role === 'admin' ? 'admin' : 'dashboard');
          refreshAllData();
        }}
      />

      {/* 2. Firebase Deployment Guide Modal */}
      <FirebaseDeploymentModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
      />

      {/* 3. Quiz Taking Modal */}
      {activeQuizAssignment && currentUser && (
        <QuizTakingModal
          assignment={activeQuizAssignment}
          student={currentUser}
          onClose={() => setActiveQuizAssignment(null)}
          onSubmitted={() => {
            refreshAllData();
          }}
        />
      )}

      {/* 4. Essay Submit Modal */}
      {activeEssayAssignment && currentUser && (
        <EssaySubmitModal
          assignment={activeEssayAssignment}
          student={currentUser}
          onClose={() => setActiveEssayAssignment(null)}
          onSubmitted={() => {
            showToast('Nộp bài tự luận thành công! Chờ giáo viên chấm điểm.', 'success');
            refreshAllData();
          }}
        />
      )}

      {/* 5. Grading Modal */}
      {gradingContext && (
        <GradingModal
          submission={gradingContext.submission}
          assignment={gradingContext.assignment}
          onClose={() => setGradingContext(null)}
          onGraded={() => {
            showToast('Đã lưu điểm và nhận xét thành công!', 'success');
            refreshAllData();
          }}
        />
      )}

      {/* 6. Quick Create Classroom Modal */}
      <Modal
        isOpen={quickCreateClassOpen}
        onClose={() => setQuickCreateClassOpen(false)}
        title="Tạo Lớp Học Trực Tuyến Mới"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateClassSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên lớp học:
            </label>
            <input
              type="text"
              value={qClassName}
              onChange={(e) => setQClassName(e.target.value)}
              placeholder="Ví dụ: Ôn Thi THPT Quốc Gia - Toán 12 Nâng Cao"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Môn học:
            </label>
            <select
              value={qClassSubject}
              onChange={(e) => setQClassSubject(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="Toán học">Toán học</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Tin học">Tin học</option>
              <option value="Vật lý">Vật lý</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả ngắn gọn:
            </label>
            <textarea
              rows={3}
              value={qClassDesc}
              onChange={(e) => setQClassDesc(e.target.value)}
              placeholder="Giới thiệu nội dung trọng tâm của lớp học..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setQuickCreateClassOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Tạo lớp ngay
            </button>
          </div>
        </form>
      </Modal>

      {/* 7. Quick Join Class Modal */}
      <Modal
        isOpen={joinClassOpen}
        onClose={() => setJoinClassOpen(false)}
        title="Tham Gia Lớp Học Bằng Mã"
        maxWidth="md"
      >
        <form onSubmit={handleJoinClassSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhập mã lớp do giáo viên cung cấp (ví dụ: <strong>MAT12A</strong>, <strong>ENG101</strong>, <strong>CS202</strong>).
          </p>

          {qJoinError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {qJoinError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mã lớp học (Class Code):
            </label>
            <input
              type="text"
              value={qJoinCode}
              onChange={(e) => {
                setQJoinCode(e.target.value.toUpperCase());
                setQJoinError('');
              }}
              placeholder="Ví dụ: MAT12A"
              maxLength={10}
              className="w-full text-base font-mono font-bold tracking-widest text-center uppercase p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setJoinClassOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Tham gia ngay
            </button>
          </div>
        </form>
      </Modal>

      {/* 8. Quick Create Assignment Modal */}
      <Modal
        isOpen={quickCreateAssOpen}
        onClose={() => setQuickCreateAssOpen(false)}
        title="Giao Bài Tập / Đề Thi Cho Lớp"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssignmentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chọn lớp học:
            </label>
            <select
              value={qAssClassId}
              onChange={(e) => setQAssClassId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              required
            >
              <option value="">-- Chọn một lớp học --</option>
              {classrooms
                .filter((c) => currentUser && (c.teacherId === currentUser.id || currentUser.role === 'admin'))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề bài kiểm tra:
            </label>
            <input
              type="text"
              value={qAssTitle}
              onChange={(e) => setQAssTitle(e.target.value)}
              placeholder="Ví dụ: Kiểm tra 15 phút chuyên đề hàm số"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loại bài thi:
              </label>
              <select
                value={qAssType}
                onChange={(e) => setQAssType(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="quiz">Trắc nghiệm bấm giờ (Tự động chấm)</option>
                <option value="essay">Bài tập tự luận (Chấm thủ công)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hạn nộp bài:
              </label>
              <input
                type="date"
                value={qAssDueDate}
                onChange={(e) => setQAssDueDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setQuickCreateAssOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Tạo bài tập
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <EduConnectApp />
    </ToastProvider>
  );
}
