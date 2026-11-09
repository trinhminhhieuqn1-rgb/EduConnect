import React from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Clock,
  Calendar,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { User, Classroom, Assignment, Submission, NotificationItem } from '../types';

interface StudentDashboardProps {
  student: User;
  classrooms: Classroom[];
  assignments: Assignment[];
  submissions: Submission[];
  notifications: NotificationItem[];
  onNavigate: (view: string, data?: any) => void;
  onOpenJoinClass: () => void;
  onOpenTakeQuiz: (assignment: Assignment) => void;
  onOpenSubmitEssay: (assignment: Assignment) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  classrooms,
  assignments,
  submissions,
  notifications,
  onNavigate,
  onOpenJoinClass,
  onOpenTakeQuiz,
  onOpenSubmitEssay,
}) => {
  // My classes
  const myClasses = classrooms.filter((c) => c.studentIds.includes(student.id));
  const myClassIds = myClasses.map((c) => c.id);

  // My assignments
  const myAssignments = assignments.filter((a) => myClassIds.includes(a.classId));
  const mySubmissions = submissions.filter((s) => s.studentId === student.id);
  const submittedAssignmentIds = new Set(mySubmissions.map((s) => s.assignmentId));

  // Pending assignments (not submitted yet)
  const pendingAssignments = myAssignments.filter((a) => !submittedAssignmentIds.has(a.id));

  // Upcoming assignments (next 7 days)
  const now = new Date().getTime();
  const upcomingAssignments = pendingAssignments.filter((a) => {
    const dueTime = new Date(a.dueDate).getTime();
    return dueTime > now && dueTime - now <= 7 * 24 * 60 * 60 * 1000;
  });

  // Calculate GPA
  const gradedSubmissions = mySubmissions.filter((s) => s.score !== undefined);
  const gpa =
    gradedSubmissions.length > 0
      ? (
          gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) /
          gradedSubmissions.length
        ).toFixed(1)
      : '9.0';

  // Completion rate
  const completionRate =
    myAssignments.length > 0
      ? Math.round((submittedAssignmentIds.size / myAssignments.length) * 100)
      : 100;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <span>Không gian học tập cá nhân</span>
            <span>·</span>
            <span>{student.school || 'EduConnect'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Xin chào, {student.name}!
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bạn có {pendingAssignments.length} bài tập cần hoàn thành. Hãy duy trì nhịp độ học tập nhé!
          </p>
        </div>

        <button
          onClick={onOpenJoinClass}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tham gia lớp bằng mã</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Lớp đã tham gia</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {myClasses.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Lớp học trực tuyến</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Bài tập cần làm</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
            {pendingAssignments.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Chưa nộp</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Điểm trung bình</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
              {gpa}
            </p>
            <span className="text-xs text-slate-400 font-semibold">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Học lực Giỏi</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Tiến độ bài học</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {completionRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Tỷ lệ hoàn thành bài tập</p>
        </div>
      </div>

      {/* Main Grid: Pending Tasks vs Class Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Pending Assignments with Direct Action */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Bài Tập Cần Hoàn Thành ({pendingAssignments.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Làm bài trực tuyến hoặc nộp bài tập tự luận trước thời hạn
              </p>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
            >
              Xem tất cả
            </button>
          </div>

          {pendingAssignments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Tuyệt vời! Bạn đã hoàn thành hết bài tập</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Hãy xem lại bài giảng để củng cố kiến thức nhé.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAssignments.map((ass) => {
                const cls = classrooms.find((c) => c.id === ass.classId);
                const isQuiz = ass.type === 'quiz';

                return (
                  <div
                    key={ass.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isQuiz
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {isQuiz ? 'Trắc nghiệm tính giờ' : 'Tự luận'}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-semibold text-slate-600">
                          Lớp {cls?.code || ''}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{ass.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hạn nộp: {new Date(ass.dueDate).toLocaleDateString('vi-VN')}</span>
                        {isQuiz && <span>· Thời gian: {ass.durationMinutes} phút</span>}
                      </p>
                    </div>

                    <button
                      onClick={() => (isQuiz ? onOpenTakeQuiz(ass) : onOpenSubmitEssay(ass))}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
                    >
                      {isQuiz ? 'Làm bài thi ngay' : 'Nộp bài tự luận'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right (1 col): Schedule & Announcements */}
        <div className="space-y-6">
          {/* Class Schedule */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-600" />
                Lịch Học Trong Tuần
              </h3>
            </div>

            <div className="space-y-3">
              {myClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{cls.name}</span>
                    <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {cls.code}
                    </span>
                  </div>
                  <p className="text-xs text-sky-700 font-medium">{cls.schedule}</p>
                  <p className="text-[11px] text-slate-400">GV: {cls.teacherName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Kết Quả Gần Đây</h3>
              <button
                onClick={() => onNavigate('gradebook')}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
              >
                Học bạ
              </button>
            </div>

            {mySubmissions.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có kết quả bài làm nào.</p>
            ) : (
              <div className="space-y-2.5">
                {mySubmissions.slice(0, 3).map((sub) => {
                  const ass = assignments.find((a) => a.id === sub.assignmentId);
                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                          {ass?.title || 'Bài tập'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        {sub.score !== undefined ? (
                          <span className="text-sm font-bold text-emerald-600 font-mono">
                            {sub.score}/10đ
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                            Chờ chấm
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Enrolled Classrooms Grid */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Lớp Học Của Tôi ({myClasses.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn lớp học để vào xem bài giảng và tải tài liệu
            </p>
          </div>
          <button
            onClick={() => onNavigate('classrooms')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Tất cả lớp học <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myClasses.map((cls) => (
            <div
              key={cls.id}
              onClick={() => onNavigate('classroom-detail', cls)}
              className="group cursor-pointer rounded-xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all bg-white flex flex-col"
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={cls.coverImage}
                  alt={cls.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                  {cls.code}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {cls.subject}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {cls.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cls.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>GV: {cls.teacherName}</span>
                  <span className="font-semibold text-slate-700">Vào học →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
