import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  BookOpen,
  FileCheck2,
  Lock,
  Unlock,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Code2,
  RefreshCw
} from 'lucide-react';
import { User, Classroom, Assignment, Submission, SystemStats } from '../types';
import { StorageService } from '../services/storage';
import { useToast } from '../components/Toast';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  classrooms: Classroom[];
  assignments: Assignment[];
  submissions: Submission[];
  onOpenFirebaseGuide: () => void;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  classrooms,
  assignments,
  submissions,
  onOpenFirebaseGuide,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'teacher' | 'student'>('all');
  const [selectedTab, setSelectedTab] = useState<'users' | 'classes' | 'system'>('users');

  const { showToast } = useToast();
  const stats: SystemStats = StorageService.getSystemStats();

  const handleToggleLock = (userId: string, currentStatus: string) => {
    if (userId === currentUser.id) {
      showToast('Không thể tự khóa tài khoản quản trị viên hiện tại.', 'error');
      return;
    }
    StorageService.toggleUserStatus(userId);
    showToast(
      `Đã ${currentStatus === 'active' ? 'khóa' : 'mở khóa'} tài khoản thành công!`,
      'success'
    );
    onRefresh();
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      showToast('Không thể xóa tài khoản quản trị viên đang đăng nhập.', 'error');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này khỏi hệ thống?')) {
      StorageService.deleteUser(userId);
      showToast('Đã xóa người dùng thành công!', 'success');
      onRefresh();
    }
  };

  const handleResetSystem = () => {
    if (window.confirm('Đặt lại toàn bộ dữ liệu mẫu (Reset Data)? Tất cả dữ liệu sẽ trở về trạng thái khởi tạo.')) {
      StorageService.resetAll();
      showToast('Hệ thống đã được đặt lại về dữ liệu mẫu ban đầu!', 'success');
      onRefresh();
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Trung Tâm Điều Hành Quản Trị Viên (Admin Console)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Quản Lý & Vận Hành Hệ Thống EduConnect
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Giám sát tài khoản, phân quyền, kiểm soát nội dung và tích hợp hạ tầng Firebase.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFirebaseGuide}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <Code2 className="w-4 h-4" />
            <span>Cấu hình Firebase</span>
          </button>
          <button
            onClick={handleResetSystem}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            title="Đặt lại dữ liệu mẫu"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Đặt lại Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Tổng Người Dùng
          </p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.totalUsers}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats.totalTeachers} Giáo viên · {stats.totalStudents} Học sinh
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Tổng Số Lớp Học
          </p>
          <p className="text-2xl font-bold text-sky-600 font-mono tabular-nums">
            {stats.totalClasses}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Lớp học đang giảng dạy</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Đề Thi & Bài Tập
          </p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.totalAssignments}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Trắc nghiệm và tự luận</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Lượt Bài Đã Nộp
          </p>
          <p className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {stats.totalSubmissions}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Đã chấm và chờ chấm</p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-fit">
        <button
          onClick={() => setSelectedTab('users')}
          className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Quản Lý Tài Khoản ({users.length})
        </button>
        <button
          onClick={() => setSelectedTab('classes')}
          className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'classes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Quản Lý Lớp Học ({classrooms.length})
        </button>
        <button
          onClick={() => setSelectedTab('system')}
          className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'system' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hạ Tầng & Trạng Thái
        </button>
      </div>

      {/* Tab 1: User Management */}
      {selectedTab === 'users' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  roleFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tất cả ({users.length})
              </button>
              <button
                onClick={() => setRoleFilter('teacher')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  roleFilter === 'teacher' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Giáo viên ({users.filter((u) => u.role === 'teacher').length})
              </button>
              <button
                onClick={() => setRoleFilter('student')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  roleFilter === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Học sinh ({users.filter((u) => u.role === 'student').length})
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Trường / Đơn vị</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          u.role === 'teacher'
                            ? 'bg-sky-50 text-sky-700'
                            : u.role === 'student'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {u.role === 'teacher' ? 'Giáo viên' : u.role === 'student' ? 'Học sinh' : 'Admin'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">
                      {u.school || '—'}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          u.status === 'active' ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {u.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đang hoạt động
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                            Đã khóa
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleLock(u.id, u.status)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.status === 'active'
                              ? 'border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {u.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Classrooms Management */}
      {selectedTab === 'classes' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Danh Sách Tất Cả Lớp Học Trong Hệ Thống ({classrooms.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classrooms.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                      {cls.subject}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{cls.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {cls.code}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{cls.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>GV: {cls.teacherName}</span>
                  <span className="font-semibold">{cls.studentIds.length} học sinh</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: System Health */}
      {selectedTab === 'system' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Trạng Thái Hệ Thống & Bảo Mật
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống đang chạy trên nền tảng lưu trữ Reactive Local Storage với kiến trúc sẵn sàng tích hợp Firebase Firestore.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500">Trạng thái máy chủ:</span>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ổn định (Healthy)
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500">Thời gian phản hồi:</span>
              <p className="text-sm font-bold text-slate-900 font-mono">18ms</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500">Phân quyền (RBAC):</span>
              <p className="text-sm font-bold text-indigo-600">Bật (Active)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-indigo-900">
                Tài Liệu Kết Nối Firebase & Firestore Rules
              </h4>
              <p className="text-xs text-indigo-700">
                Xem toàn bộ hướng dẫn cấu hình, rules và code TypeScript chuẩn.
              </p>
            </div>
            <button
              onClick={onOpenFirebaseGuide}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Mở hướng dẫn →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
