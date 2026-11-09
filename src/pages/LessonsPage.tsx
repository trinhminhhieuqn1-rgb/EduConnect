import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Video,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Lesson, Classroom, User } from '../types';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

interface LessonsPageProps {
  lessons: Lesson[];
  classrooms: Classroom[];
  currentUser: User;
  onNavigateToClass: (cls: Classroom) => void;
}

export const LessonsPage: React.FC<LessonsPageProps> = ({
  lessons,
  classrooms,
  currentUser,
  onNavigateToClass,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Tất cả');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { showToast } = useToast();
  const subjects = ['Tất cả', 'Toán học', 'Tiếng Anh', 'Tin học'];

  const filteredLessons = lessons.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'Tất cả' || l.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Kho Bài Giảng & Tài Liệu Học Tập
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem nội dung bài học, video tương tác và tải giáo trình đề cương ôn tập
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm bài giảng theo chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubjectFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                subjectFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map((l) => {
          const cls = classrooms.find((c) => c.id === l.classId);

          return (
            <div
              key={l.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {l.subject}
                  </span>
                  <span className="text-slate-400">
                    {new Date(l.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{l.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {l.description}
                </p>

                {cls && (
                  <p className="text-[11px] text-slate-400">
                    Thuộc lớp: <span className="text-slate-700 font-medium">{cls.name}</span>
                  </p>
                )}
              </div>

              {/* Attachments & Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{l.attachments?.length || 0} tệp tài liệu</span>
                </div>

                <button
                  onClick={() => setSelectedLesson(l)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>Học bài</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Reader Modal */}
      {selectedLesson && (
        <Modal
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          title={selectedLesson.title}
          maxWidth="3xl"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {selectedLesson.subject}
              </span>
              <span>·</span>
              <span>Ngày đăng: {new Date(selectedLesson.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>

            {selectedLesson.videoUrl && (
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Video bài giảng đa phương tiện</p>
                    <p className="text-[11px] text-slate-300">Xem video bài giảng trực tuyến chất lượng cao</p>
                  </div>
                </div>
                <a
                  href={selectedLesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Mở video</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="p-5 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
              {selectedLesson.content}
            </div>

            {selectedLesson.attachments && selectedLesson.attachments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800">Tải tài liệu đính kèm:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedLesson.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="text-xs font-medium text-slate-800 truncate">
                          {att.name}
                        </span>
                      </div>
                      <button
                        onClick={() => showToast(`Đang tải tệp: ${att.name}`, 'info')}
                        className="p-1 text-slate-400 hover:text-sky-600"
                        title="Tải về"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Đóng bài học
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
