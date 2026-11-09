import React, { useState } from 'react';
import { FileText, UploadCloud, AlertCircle } from 'lucide-react';
import { Assignment, User } from '../types';
import { StorageService } from '../services/storage';

interface EssaySubmitModalProps {
  assignment: Assignment;
  student: User;
  onClose: () => void;
  onSubmitted: () => void;
}

export const EssaySubmitModal: React.FC<EssaySubmitModalProps> = ({
  assignment,
  student,
  onClose,
  onSubmitted,
}) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !fileName) {
      setError('Vui lòng nhập nội dung bài giải hoặc chọn file đính kèm.');
      return;
    }

    setIsSubmitting(true);
    StorageService.submitEssay({
      assignmentId: assignment.id,
      classId: assignment.classId,
      student,
      content: content.trim(),
      attachmentUrl: fileName ? `#uploaded-${fileName}` : undefined,
    });

    setIsSubmitting(false);
    onSubmitted();
    onClose();
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Nộp Bài Tập Tự Luận
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{assignment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
          >
            Đóng
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {assignment.essayInstructions && (
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-sky-950 whitespace-pre-line leading-relaxed">
              <strong className="block font-semibold mb-1 text-sky-900">
                Đề bài & Yêu cầu:
              </strong>
              {assignment.essayInstructions}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nội dung bài giải / Lời giải chi tiết:
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
              }}
              placeholder="Nhập lời giải bài tập của bạn vào đây..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono leading-relaxed resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Đính kèm file bài làm (Ảnh chụp vở, File Word, PDF):
            </label>
            <label className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-sky-50/30 transition-all text-center">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-medium text-slate-700">
                {fileName ? fileName : 'Bấm vào đây để tải lên tệp tin bài làm'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Hỗ trợ PDF, DOCX, PNG, JPG (tối đa 25MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleSimulateUpload}
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Xác nhận nộp bài
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
