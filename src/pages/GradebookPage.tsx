import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Submission, Assignment, Classroom, User } from '../types';

interface GradebookPageProps {
  currentUser: User;
  submissions: Submission[];
  assignments: Assignment[];
  classrooms: Classroom[];
  allUsers: User[];
  onOpenGrading: (submission: Submission, assignment: Assignment) => void;
}

export const GradebookPage: React.FC<GradebookPageProps> = ({
  currentUser,
  submissions,
  assignments,
  classrooms,
  allUsers,
  onOpenGrading,
}) => {
  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // For Student
  const studentSubs = submissions.filter((s) => s.studentId === currentUser.id);
  const gradedStudentSubs = studentSubs.filter((s) => s.score !== undefined);

  // Student progression chart data
  const studentChartData = gradedStudentSubs.map((s, idx) => {
    const ass = assignments.find((a) => a.id === s.assignmentId);
    return {
      index: idx + 1,
      title: ass?.title ? ass.title.substring(0, 15) + '...' : `Bài ${idx + 1}`,
      score: s.score || 0,
    };
  });

  // Calculate Student GPA
  const gpa =
    gradedStudentSubs.length > 0
      ? (
          gradedStudentSubs.reduce((acc, s) => acc + (s.score || 0), 0) /
          gradedStudentSubs.length
        ).toFixed(1)
      : '9.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isTeacher ? 'Sổ Điểm & Quản Lý Kết Quả' : 'Học Bạ & Kết Quả Học Tập Cá Nhân'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher
              ? 'Theo dõi toàn bộ bài làm của học sinh, chấm điểm và gửi lời nhận xét'
              : 'Theo dõi tiến độ điểm số, GPA và nhận xét của giáo viên cho từng bài thi'}
          </p>
        </div>

        {!isTeacher && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <Award className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700">Điểm Trung Bình (GPA):</span>
              <p className="text-base font-bold text-emerald-800 font-mono leading-none">
                {gpa} / 10đ
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Student Chart (if student has grades) */}
      {!isTeacher && studentChartData.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Biểu Đồ Tiến Trình Điểm Số Qua Các Bài Thi
            </h3>
            <span className="text-xs text-slate-400">Thang điểm 10</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="title" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} điểm`, 'Điểm số']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#FFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Submissions Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {isTeacher ? 'Danh Sách Toàn Bộ Bài Nộp Của Học Sinh' : 'Chi Tiết Điểm Từng Bài Thi'}
          </h3>
          <span className="text-xs text-slate-500">
            {isTeacher ? `${submissions.length} bài nộp` : `${studentSubs.length} bài nộp`}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Bài kiểm tra / Bài tập</th>
                {isTeacher && <th className="px-4 py-3">Học sinh</th>}
                <th className="px-4 py-3">Lớp học</th>
                <th className="px-4 py-3">Ngày nộp</th>
                <th className="px-4 py-3">Hình thức</th>
                <th className="px-4 py-3">Điểm số</th>
                <th className="px-4 py-3">Nhận xét của giáo viên</th>
                {isTeacher && <th className="px-4 py-3 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(isTeacher ? submissions : studentSubs).map((sub) => {
                const ass = assignments.find((a) => a.id === sub.assignmentId);
                const cls = classrooms.find((c) => c.id === sub.classId);

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                        {ass?.title || 'Bài tập'}
                      </span>
                    </td>

                    {isTeacher && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={sub.studentAvatar}
                            alt={sub.studentName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-800">{sub.studentName}</span>
                        </div>
                      </td>
                    )}

                    <td className="px-4 py-3 text-slate-600">
                      <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {cls?.code}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          sub.type === 'quiz'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {sub.type === 'quiz' ? 'Trắc nghiệm' : 'Tự luận'}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      {sub.score !== undefined ? (
                        <span className="text-sm font-bold text-emerald-600">
                          {sub.score} / 10đ
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          Chờ chấm
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate italic">
                      {sub.feedback || '—'}
                    </td>

                    {isTeacher && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => ass && onOpenGrading(sub, ass)}
                          className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs transition-colors"
                        >
                          {sub.status === 'graded' ? 'Sửa điểm' : 'Chấm điểm'}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
