import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Assignment, Classroom, User, Submission } from '../types';
import { Modal } from '../components/Modal';

interface AssignmentsPageProps {
  assignments: Assignment[];
  classrooms: Classroom[];
  submissions: Submission[];
  currentUser: User;
  onOpenTakeQuiz: (assignment: Assignment) => void;
  onOpenSubmitEssay: (assignment: Assignment) => void;
  onOpenGrading: (submission: Submission, assignment: Assignment) => void;
}

export const AssignmentsPage: React.FC<AssignmentsPageProps> = ({
  assignments,
  classrooms,
  submissions,
  currentUser,
  onOpenTakeQuiz,
  onOpenSubmitEssay,
  onOpenGrading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);

  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const mySub = submissions.find(
      (s) => s.assignmentId === a.id && s.studentId === currentUser.id
    );

    let matchesStatus = true;
    if (!isTeacher) {
      if (statusFilter === 'pending') matchesStatus = !mySub;
      if (statusFilter === 'submitted') matchesStatus = !!mySub && mySub.status === 'pending';
      if (statusFilter === 'graded') matchesStatus = !!mySub && mySub.status === 'graded';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isTeacher ? 'Quản Lý Bài Tập & Đề Thi' : 'Bài Tập & Đề Kiểm Tra Trực Tuyến'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher
              ? 'Theo dõi lượt nộp bài của học sinh và thực hiện chấm điểm trực tiếp'
              : 'Làm bài kiểm tra trắc nghiệm bấm giờ hoặc nộp bài tập tự luận'}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {!isTeacher && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Chưa làm
            </button>
            <button
              onClick={() => setStatusFilter('submitted')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                statusFilter === 'submitted' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Chờ chấm
            </button>
            <button
              onClick={() => setStatusFilter('graded')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                statusFilter === 'graded' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Đã có điểm
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredAssignments.map((ass) => {
          const cls = classrooms.find((c) => c.id === ass.classId);
          const isQuiz = ass.type === 'quiz';
          const mySub = submissions.find(
            (s) => s.assignmentId === ass.id && s.studentId === currentUser.id
          );
          const allSubs = submissions.filter((s) => s.assignmentId === ass.id);
          const pendingCount = allSubs.filter((s) => s.status === 'pending').length;

          return (
            <div
              key={ass.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isQuiz ? 'bg-sky-50 text-sky-700' : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {isQuiz ? 'Trắc nghiệm tự động chấm' : 'Bài tập tự luận'}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-700">{cls?.name}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{ass.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-1">{ass.description}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Hạn nộp: {new Date(ass.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                  {isQuiz && <span>· Thời gian: {ass.durationMinutes} phút</span>}
                  <span>· Thang điểm 10</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {isTeacher ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 block">
                        Đã nộp: {allSubs.length} học sinh
                      </span>
                      {pendingCount > 0 ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {pendingCount} bài chờ chấm
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Đã chấm xong
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setViewingAssignment(ass)}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                    >
                      Xem bài nộp & chấm
                    </button>
                  </div>
                ) : mySub ? (
                  <div className="text-right">
                    {mySub.score !== undefined ? (
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 font-mono">
                          <Award className="w-4 h-4" />
                          <span>{mySub.score}/10 điểm</span>
                        </div>
                        {mySub.feedback && (
                          <p className="text-[11px] text-slate-500 italic max-w-xs truncate">
                            "{mySub.feedback}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                        Đã nộp bài · Chờ chấm
                      </span>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => (isQuiz ? onOpenTakeQuiz(ass) : onOpenSubmitEssay(ass))}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    {isQuiz ? 'Làm bài thi ngay' : 'Nộp bài tự luận'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submissions Modal for Teacher */}
      {viewingAssignment && (
        <Modal
          isOpen={!!viewingAssignment}
          onClose={() => setViewingAssignment(null)}
          title={`Bài Nộp Của Học Sinh - ${viewingAssignment.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {submissions.filter((s) => s.assignmentId === viewingAssignment.id).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có học sinh nào nộp bài cho đề kiểm tra này.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {submissions
                  .filter((s) => s.assignmentId === viewingAssignment.id)
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
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-mono">
                            {sub.score}/10đ
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            Chờ chấm
                          </span>
                        )}

                        <button
                          onClick={() => {
                            onOpenGrading(sub, viewingAssignment);
                            setViewingAssignment(null);
                          }}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                        >
                          {sub.status === 'graded' ? 'Sửa điểm' : 'Chấm điểm ngay'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingAssignment(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
