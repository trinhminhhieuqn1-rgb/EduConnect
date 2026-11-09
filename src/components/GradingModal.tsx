import React, { useState } from 'react';
import { CheckCircle2, User, FileText, AlertCircle } from 'lucide-react';
import { Submission, Assignment } from '../types';
import { StorageService } from '../services/storage';

interface GradingModalProps {
  submission: Submission;
  assignment: Assignment;
  onClose: () => void;
  onGraded: () => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  submission,
  assignment,
  onClose,
  onGraded,
}) => {
  const [score, setScore] = useState<string>(
    submission.score !== undefined ? submission.score.toString() : ''
  );
  const [feedback, setFeedback] = useState<string>(
    submission.feedback || 'Bài làm đạt yêu cầu, cần chú ý thêm phần lập luận.'
  );
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericScore = parseFloat(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      setError('Điểm số phải là một số từ 0 đến 10.');
      return;
    }

    if (!feedback.trim()) {
      setError('Vui lòng nhập nhận xét của giáo viên.');
      return;
    }

    StorageService.gradeSubmission(submission.id, numericScore, feedback.trim());
    onGraded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Chấm Điểm & Nhận Xét Bài Làm
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Học sinh: {submission.studentName} · {assignment.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
          >
            Đóng
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submission content view */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Nội dung bài làm của học sinh:
            </label>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {submission.essayContent || (submission.type === 'quiz' ? 'Bài làm trắc nghiệm đã được ghi nhận.' : 'Không có văn bản.')}
            </div>
            {submission.essayAttachmentUrl && (
              <p className="text-xs text-sky-600 font-medium">
                Tệp đính kèm: {submission.essayAttachmentUrl.replace('#uploaded-', '')}
              </p>
            )}
          </div>

          {/* Grade inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Điểm số (Thang điểm 10):
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={score}
                  onChange={(e) => {
                    setScore(e.target.value);
                    setError('');
                  }}
                  placeholder="Ví dụ: 8.5"
                  className="w-full text-sm font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                  / 10
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trạng thái:
              </label>
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đang chấm bài trực tiếp</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nhận xét chi tiết của giáo viên:
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setError('');
              }}
              placeholder="Nhập lời khen, điểm cần cải thiện cho học sinh..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed resize-y"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Lưu điểm & Gửi nhận xét
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
