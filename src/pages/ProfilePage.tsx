import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  School,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound
} from 'lucide-react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { useToast } from '../components/Toast';

interface ProfilePageProps {
  currentUser: User;
  onRefresh: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onRefresh,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [school, setSchool] = useState(currentUser.school || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');

  const { showToast } = useToast();

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Họ và tên không được để trống.', 'error');
      return;
    }

    StorageService.updateUserProfile(currentUser.id, {
      name: name.trim(),
      phone: phone.trim(),
      school: school.trim(),
      bio: bio.trim(),
    });

    showToast('Cập nhật hồ sơ cá nhân thành công!', 'success');
    onRefresh();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (newPassword.length < 6) {
      setPassError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    showToast('Đổi mật khẩu thành công!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin tài khoản và bảo mật mật khẩu của bạn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-md"
            />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
              {currentUser.role === 'teacher' && 'Giáo Viên'}
              {currentUser.role === 'student' && 'Học Sinh'}
              {currentUser.role === 'admin' && 'Quản Trị Viên'}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left text-xs text-slate-600 space-y-2">
            <p>
              <strong className="text-slate-800">Trạng thái: </strong>
              <span className="text-emerald-600 font-semibold">Đang hoạt động</span>
            </p>
            <p>
              <strong className="text-slate-800">Tham gia: </strong>
              {new Date(currentUser.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Right Column (2 cols): Edit Info & Change Password */}
        <div className="md:col-span-2 space-y-6">
          {/* General info form */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Thông Tin Tài Khoản</h3>

            <form onSubmit={handleUpdateInfo} className="space-y-4">
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
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email đăng nhập (Cố định):
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại:
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 xxx xxx"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trường học / Đơn vị công tác:
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Ví dụ: THPT Chuyên Hà Nội"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiểu sử / Giới thiệu bản thân:
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kinh nghiệm giảng dạy, mục tiêu học tập..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change password form */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-slate-600" />
              Đổi Mật Khẩu
            </h3>

            {passError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu hiện tại:
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu mới:
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Xác nhận mật khẩu mới:
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
