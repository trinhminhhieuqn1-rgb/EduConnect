import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  FileCheck2,
  Award,
  Megaphone,
  Info
} from 'lucide-react';
import { NotificationItem, User, NotificationType } from '../types';
import { StorageService } from '../services/storage';
import { useToast } from '../components/Toast';

interface NotificationsPageProps {
  currentUser: User;
  notifications: NotificationItem[];
  onRefresh: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  currentUser,
  notifications,
  onRefresh,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const { showToast } = useToast();

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    onRefresh();
  };

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead(currentUser.id);
    showToast('Đã đánh dấu tất cả thông báo là đã đọc!', 'success');
    onRefresh();
  };

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'assignment':
        return <FileCheck2 className="w-5 h-5 text-sky-600" />;
      case 'grade':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Trung Tâm Thông Báo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật bài tập mới, phản hồi điểm số và các tin nhắn từ giáo viên
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Đánh dấu tất cả đã đọc</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setFilterType('all')}
          className={`py-1.5 px-3 rounded-lg transition-all ${
            filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('assignment')}
          className={`py-1.5 px-3 rounded-lg transition-all ${
            filterType === 'assignment' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Bài tập
        </button>
        <button
          onClick={() => setFilterType('grade')}
          className={`py-1.5 px-3 rounded-lg transition-all ${
            filterType === 'grade' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Điểm số
        </button>
        <button
          onClick={() => setFilterType('announcement')}
          className={`py-1.5 px-3 rounded-lg transition-all ${
            filterType === 'announcement' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Thông báo lớp
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">Không có thông báo nào</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && handleMarkAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                n.read
                  ? 'bg-white border-slate-200 opacity-80'
                  : 'bg-sky-50/40 border-sky-200 shadow-xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {n.title}
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
