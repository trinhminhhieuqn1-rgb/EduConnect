import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Shield,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { User, UserRole } from '../types';
import { useToast } from '../components/Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const res = StorageService.login(email);
        if (!res.success || !res.user) {
          setError(res.error || 'Đăng nhập không thành công.');
          setLoading(false);
          return;
        }
        showToast(`Đăng nhập thành công! Chào mừng ${res.user.name}`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = StorageService.register({
          name,
          email,
          role,
          school,
        });
        if (!res.success || !res.user) {
          setError(res.error || 'Đăng ký không thành công.');
          setLoading(false);
          return;
        }
        showToast(`Tạo tài khoản thành công! Chào mừng ${res.user.name}`, 'success');
        onAuthSuccess(res.user);
        onClose();
      }
      setLoading(false);
    }, 300);
  };

  const handleQuickDemoLogin = (demoEmail: string) => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = StorageService.login(demoEmail);
      if (res.success && res.user) {
        showToast(`Đăng nhập nhanh thành công: ${res.user.name} (${res.user.role})`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Không thể đăng nhập tài khoản mẫu.');
      }
      setLoading(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="w-10 h-10 mx-auto rounded-xl bg-sky-600 flex items-center justify-center text-white mb-2 shadow-xs shadow-sky-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {mode === 'login' ? 'Đăng Nhập EduConnect' : 'Tạo Tài Khoản Mới'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'login'
              ? 'Truy cập không gian học tập và giảng dạy trực tuyến'
              : 'Tham gia cộng đồng giáo viên và học sinh EduConnect'}
          </p>

          {/* Mode switch tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bạn tham gia với vai trò nào?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        role === 'student'
                          ? 'border-sky-500 bg-sky-50/60 text-sky-900 ring-1 ring-sky-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold leading-none">Học sinh</p>
                        <p className="text-[10px] text-slate-500 mt-1">Làm bài, vào lớp</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        role === 'teacher'
                          ? 'border-sky-500 bg-sky-50/60 text-sky-900 ring-1 ring-sky-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold leading-none">Giáo viên</p>
                        <p className="text-[10px] text-slate-500 mt-1">Dạy & Chấm điểm</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên:
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trường học / Đơn vị:
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Ví dụ: THPT Chuyên Hà Nội"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs shadow-sky-600/20 disabled:opacity-50"
            >
              {loading
                ? 'Đang xử lý...'
                : mode === 'login'
                ? 'Đăng nhập vào tài khoản'
                : 'Hoàn tất đăng ký'}
            </button>
          </form>

          {/* Quick Demo 1-Click Login Box */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Đăng nhập nhanh bằng tài khoản mẫu:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('thay.tuan@educonnect.vn')}
                className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold text-center border border-sky-200/60 transition-colors"
              >
                Giáo viên
                <span className="block text-[10px] font-normal text-sky-600 truncate">Thầy Tuấn</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('hocsinh.hieu@educonnect.vn')}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold text-center border border-emerald-200/60 transition-colors"
              >
                Học sinh
                <span className="block text-[10px] font-normal text-emerald-600 truncate">Minh Hiếu</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@educonnect.vn')}
                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-semibold text-center border border-indigo-200/60 transition-colors"
              >
                Quản trị viên
                <span className="block text-[10px] font-normal text-indigo-600 truncate">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
