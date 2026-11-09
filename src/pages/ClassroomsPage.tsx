import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Users,
  Search,
  BookOpen,
  Calendar,
  Copy,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { User, Classroom } from '../types';
import { Modal } from '../components/Modal';
import { StorageService } from '../services/storage';
import { useToast } from '../components/Toast';

interface ClassroomsPageProps {
  currentUser: User;
  classrooms: Classroom[];
  onSelectClassroom: (classroom: Classroom) => void;
  onRefresh: () => void;
}

export const ClassroomsPage: React.FC<ClassroomsPageProps> = ({
  currentUser,
  classrooms,
  onSelectClassroom,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Tất cả');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Form states for create class
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('Toán học');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassSchedule, setNewClassSchedule] = useState('');

  // Form state for join class
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã lớp: ${code}`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassDesc.trim()) {
      showToast('Vui lòng nhập tên lớp và mô tả.', 'error');
      return;
    }

    const created = StorageService.createClassroom({
      name: newClassName.trim(),
      subject: newClassSubject,
      description: newClassDesc.trim(),
      schedule: newClassSchedule.trim() || 'Thứ 2, 4, 6 (19:30 - 21:00)',
      teacher: currentUser,
    });

    showToast(`Tạo lớp "${created.name}" thành công! Mã lớp: ${created.code}`, 'success');
    setShowCreateModal(false);
    setNewClassName('');
    setNewClassDesc('');
    setNewClassSchedule('');
    onRefresh();
  };

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    if (!joinCode.trim()) {
      setJoinError('Vui lòng nhập mã lớp học.');
      return;
    }

    const res = StorageService.joinClassroomByCode(joinCode, currentUser.id);
    if (!res.success || !res.classroom) {
      setJoinError(res.error || 'Mã lớp không hợp lệ.');
      return;
    }

    showToast(`Tham gia lớp "${res.classroom.name}" thành công!`, 'success');
    setShowJoinModal(false);
    setJoinCode('');
    onRefresh();
    onSelectClassroom(res.classroom);
  };

  const subjects = ['Tất cả', 'Toán học', 'Tiếng Anh', 'Tin học', 'Vật lý'];

  // Filter logic
  const filteredClasses = classrooms.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'Tất cả' || c.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {currentUser.role === 'teacher' ? 'Quản Lý Lớp Học' : 'Khám Phá & Tham Gia Lớp Học'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser.role === 'teacher'
              ? 'Tạo lớp mới, quản lý thành viên và cấp mã lớp cho học sinh'
              : 'Danh sách các lớp học trực tuyến và tham gia bằng mã lớp'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUser.role === 'student' && (
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Vào lớp bằng mã</span>
            </button>
          )}

          {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo lớp học mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên môn, mã lớp, giáo viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubjectFilter(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                subjectFilter === sub
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Classrooms Grid */}
      {filteredClasses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Không tìm thấy lớp học phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1">
            Hãy thử tìm kiếm với từ khóa khác hoặc tạo lớp học mới.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const isEnrolled = cls.studentIds.includes(currentUser.id);
            const isOwner = cls.teacherId === currentUser.id;

            return (
              <div
                key={cls.id}
                onClick={() => onSelectClassroom(cls)}
                className="group cursor-pointer rounded-2xl border border-slate-200 overflow-hidden hover:border-sky-300 hover:shadow-lg transition-all bg-white flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={cls.coverImage}
                    alt={cls.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Class code badge with 1-click copy */}
                  <div
                    onClick={(e) => handleCopyCode(cls.code, e)}
                    className="absolute top-3 right-3 bg-slate-900/90 hover:bg-sky-600 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Bấm để sao chép mã lớp"
                  >
                    <span>{cls.code}</span>
                    {copiedCode === cls.code ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-300" />
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded text-white">
                      {cls.subject}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                      {cls.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <img
                        src={cls.teacherAvatar}
                        alt={cls.teacherName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-700">{cls.teacherName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {cls.studentIds.length} học sinh
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 truncate max-w-[140px]">
                        <Calendar className="w-3 h-3" />
                        {cls.schedule}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {isOwner ? (
                      <span className="text-sky-700 font-semibold bg-sky-50 px-2.5 py-0.5 rounded">
                        Lớp của bạn (Giáo viên)
                      </span>
                    ) : isEnrolled ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded">
                        Đã tham gia
                      </span>
                    ) : (
                      <span className="text-slate-400">Chưa tham gia</span>
                    )}

                    <span className="text-sky-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Vào lớp <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Classroom */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo Lớp Học Trực Tuyến Mới"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên lớp học:
            </label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Ví dụ: Ôn Thi THPT Quốc Gia - Toán 12 Nâng Cao"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn học:
              </label>
              <select
                value={newClassSubject}
                onChange={(e) => setNewClassSubject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Toán học">Toán học</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Tin học">Tin học</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Ngữ văn">Ngữ văn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lịch học dự kiến:
              </label>
              <input
                type="text"
                value={newClassSchedule}
                onChange={(e) => setNewClassSchedule(e.target.value)}
                placeholder="Ví dụ: Thứ 2, 4, 6 (19h30)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả nội dung lớp học:
            </label>
            <textarea
              rows={3}
              value={newClassDesc}
              onChange={(e) => setNewClassDesc(e.target.value)}
              placeholder="Giới thiệu mục tiêu khóa học, đề cương và đối tượng học sinh..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Tạo lớp học
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Join Class by Code */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Tham Gia Lớp Học Bằng Mã Lớp"
        maxWidth="md"
      >
        <form onSubmit={handleJoinClass} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhập mã lớp 6 ký tự do giáo viên cung cấp (Ví dụ: <strong>MAT12A</strong>, <strong>ENG101</strong>) để gia nhập vào lớp ngay.
          </p>

          {joinError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {joinError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mã lớp học (Class Code):
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                setJoinError('');
              }}
              placeholder="Ví dụ: MAT12A"
              maxLength={10}
              className="w-full text-base font-mono font-bold tracking-widest text-center uppercase p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowJoinModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Xác nhận tham gia
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
