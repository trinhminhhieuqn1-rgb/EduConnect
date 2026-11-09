import React, { useState } from 'react';
import {
  GraduationCap,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  BookOpen,
  Bell,
  Code2,
  Menu,
  X
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  allUsers: User[];
  unreadCount: number;
  onOpenFirebaseGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchUser,
  activeView,
  onNavigate,
  allUsers,
  unreadCount,
  onOpenFirebaseGuide,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMobileNav = (view: string) => {
    onNavigate(view);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-600/20 group-hover:bg-sky-700 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
            EduConnect
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {!currentUser ? (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'landing' ? 'text-sky-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Trang chủ
              </button>
              <a
                href="#features"
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Tính năng
              </a>
              <a
                href="#roles"
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Dành cho ai
              </a>
              <a
                href="#testimonials"
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Đánh giá
              </a>
              <button
                onClick={onOpenFirebaseGuide}
                className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-500"
              >
                <Code2 className="w-4 h-4" />
                <span>Kiến trúc Backend</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'dashboard' ? 'text-sky-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => onNavigate('classrooms')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'classrooms' || activeView === 'classroom-detail' ? 'text-sky-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Lớp học
              </button>
              <button
                onClick={() => onNavigate('lessons')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'lessons' ? 'text-sky-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Bài giảng
              </button>
              <button
                onClick={() => onNavigate('assignments')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'assignments' ? 'text-sky-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Bài tập & Đề thi
              </button>
              <button
                onClick={() => onNavigate('gradebook')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'gradebook' ? 'text-sky-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Bảng điểm
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1 primary action or User profile control */}
        <div className="flex items-center gap-3 shrink-0">
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors whitespace-nowrap shrink-0"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs shadow-sky-600/20 whitespace-nowrap shrink-0"
              >
                Đăng ký miễn phí
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Notifications shortcut */}
              <button
                onClick={() => onNavigate('notifications')}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Thông báo"
                aria-label="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {/* Fast Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-none mt-1 capitalize font-medium">
                      {currentUser.role === 'teacher' ? 'Giáo viên' : currentUser.role === 'student' ? 'Học sinh' : 'Quản trị viên'}
                    </p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {currentUser.role === 'teacher' && 'Giáo viên hướng dẫn'}
                        {currentUser.role === 'student' && 'Học sinh'}
                        {currentUser.role === 'admin' && 'Quản trị viên hệ thống'}
                      </div>
                    </div>

                    <div className="px-2 py-1.5">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2.5"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Hồ sơ cá nhân</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50 rounded-lg flex items-center gap-2.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span>Bảng điều khiển Admin</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenFirebaseGuide();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2.5"
                      >
                        <Code2 className="w-4 h-4 text-slate-400" />
                        <span>Tài liệu kết nối Firebase</span>
                      </button>
                    </div>

                    {/* Quick Demo Switcher Section */}
                    <div className="px-3 py-1.5 border-t border-slate-100">
                      <p className="text-[10px] uppercase font-semibold text-slate-400 px-1 mb-1">
                        Chuyển nhanh tài khoản mẫu:
                      </p>
                      <div className="space-y-1">
                        {allUsers.slice(0, 4).map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSwitchUser(u.id);
                              setShowUserMenu(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between transition-colors ${
                              currentUser.id === u.id ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                              {u.role === 'teacher' ? 'GV' : u.role === 'student' ? 'HS' : 'Admin'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 px-2">
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Menu"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {!currentUser && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {currentUser ? (
            <div className="space-y-1">
              <button
                onClick={() => handleMobileNav('dashboard')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === 'dashboard' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => handleMobileNav('classrooms')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === 'classrooms' || activeView === 'classroom-detail' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Lớp học
              </button>
              <button
                onClick={() => handleMobileNav('lessons')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === 'lessons' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Bài giảng & Tài liệu
              </button>
              <button
                onClick={() => handleMobileNav('assignments')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === 'assignments' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Bài tập & Đề thi
              </button>
              <button
                onClick={() => handleMobileNav('gradebook')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === 'gradebook' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Bảng điểm
              </button>
              <button
                onClick={() => handleMobileNav('notifications')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  activeView === 'notifications' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Thông báo</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleMobileNav('profile')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === 'profile' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Hồ sơ cá nhân
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleMobileNav('admin')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50"
                >
                  Bảng điều khiển Admin
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => handleMobileNav('landing')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-sky-600 hover:bg-sky-50"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600"
              >
                Đăng ký tài khoản
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
