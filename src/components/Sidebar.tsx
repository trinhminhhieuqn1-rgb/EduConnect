import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileCheck2,
  BarChart3,
  Bell,
  User,
  ShieldAlert,
  Calendar,
  Layers,
  Settings,
  Code
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeView: string;
  onNavigate: (view: string) => void;
  unreadCount: number;
  onOpenFirebaseGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeView,
  onNavigate,
  unreadCount,
  onOpenFirebaseGuide,
}) => {
  const teacherNavItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'classrooms', label: 'Quản lý lớp học', icon: GraduationCap },
    { id: 'lessons', label: 'Bài giảng & Tài liệu', icon: BookOpen },
    { id: 'assignments', label: 'Bài tập & Kiểm tra', icon: FileCheck2 },
    { id: 'gradebook', label: 'Bảng điểm & Chấm bài', icon: BarChart3 },
    { id: 'notifications', label: 'Thông báo', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
  ];

  const studentNavItems = [
    { id: 'dashboard', label: 'Tổng quan học tập', icon: LayoutDashboard },
    { id: 'classrooms', label: 'Lớp học của tôi', icon: GraduationCap },
    { id: 'lessons', label: 'Bài giảng & Tài liệu', icon: BookOpen },
    { id: 'assignments', label: 'Bài tập trực tuyến', icon: FileCheck2 },
    { id: 'gradebook', label: 'Bảng điểm của tôi', icon: BarChart3 },
    { id: 'notifications', label: 'Thông báo', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Bảng điều khiển Admin', icon: ShieldAlert },
    { id: 'dashboard', label: 'Giao diện mẫu', icon: LayoutDashboard },
    { id: 'classrooms', label: 'Tất cả lớp học', icon: GraduationCap },
    { id: 'lessons', label: 'Kho bài giảng', icon: BookOpen },
    { id: 'assignments', label: 'Kho đề thi & bài tập', icon: FileCheck2 },
    { id: 'notifications', label: 'Thông báo hệ thống', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
  ];

  const items = role === 'admin' ? adminNavItems : role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role badge */}
      <div className="p-4 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Khu vực làm việc
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              role === 'teacher' ? 'bg-sky-500' : role === 'student' ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
          />
          <span className="text-sm font-bold text-slate-800">
            {role === 'teacher' && 'Dành cho Giáo Viên'}
            {role === 'student' && 'Dành cho Học Sinh'}
            {role === 'admin' && 'Quản Trị Viên (Admin)'}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="p-3 space-y-1 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (item.id === 'classrooms' && activeView === 'classroom-detail');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shrink-0">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom helper card: Firebase Integration doc */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <p className="text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-sky-600" />
            Backend & Firestore
          </p>
          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
            Xem tài liệu kết nối Firebase Auth, Firestore Rules và hướng dẫn deploy.
          </p>
          <button
            onClick={onOpenFirebaseGuide}
            className="w-full text-center py-1.5 px-2 bg-white hover:bg-slate-100 text-sky-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            Mở hướng dẫn kết nối
          </button>
        </div>
      </div>
    </aside>
  );
};
