import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw
} from 'lucide-react';
import { Assignment, User, Question } from '../types';
import { StorageService } from '../services/storage';

interface QuizTakingModalProps {
  assignment: Assignment;
  student: User;
  onClose: () => void;
  onSubmitted: () => void;
}

export const QuizTakingModal: React.FC<QuizTakingModalProps> = ({
  assignment,
  student,
  onClose,
  onSubmitted,
}) => {
  const questions: Question[] = assignment.questions || [];
  const durationSeconds = (assignment.durationMinutes || 15) * 60;

  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const startTimeRef = useRef(Date.now());

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    setShowConfirmSubmit(false);
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    const submission = StorageService.submitQuiz({
      assignmentId: assignment.id,
      classId: assignment.classId,
      student,
      answers: selectedAnswers,
      timeSpentSeconds: timeSpent,
    });

    setFinalScore(submission.score ?? 0);
    setIsSubmitted(true);

    if ((submission.score ?? 0) >= 7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    onSubmitted();
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 truncate max-w-md">
              {assignment.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Học sinh: {student.name}</span>
              <span>·</span>
              <span>{questions.length} câu hỏi</span>
              <span>·</span>
              <span>Điểm tối đa: {assignment.totalPoints}đ</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold tabular-nums ${
                  timeLeft <= 120
                    ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                    : timeLeft <= 300
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            {isSubmitted ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Đóng kết quả
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
              >
                Nộp bài ({answeredCount}/{questions.length})
              </button>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question area (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">
                    Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                  </span>
                  <span>({currentQ?.points || 2} điểm)</span>
                </div>

                <div className="text-base font-semibold text-slate-900 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                  {currentQ?.questionText}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ?.options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(currentQ.id, idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-sky-50/80 border-sky-500 text-sky-950 ring-1 ring-sky-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Prev / Next buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu trước</span>
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                    >
                      <span>Câu tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
                    >
                      <span>Hoàn thành bài thi</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question navigation grid (1 col) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mục lục câu hỏi
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-lg text-xs font-bold transition-all ${
                          isCurrent
                            ? 'ring-2 ring-sky-500 bg-sky-600 text-white'
                            : isAnswered
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-sky-600 shrink-0" />
                    <span>Đang làm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-sky-100 border border-sky-300 shrink-0" />
                    <span>Đã chọn ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-white border border-slate-200 shrink-0" />
                    <span>Chưa làm ({questions.length - answeredCount})</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Score header banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200/80 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white shadow-md flex items-center justify-center text-sky-600 mb-3">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Kết Quả Bài Kiểm Tra
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Bài thi của bạn đã được hệ thống tự động chấm điểm và lưu vào học bạ.
                </p>

                <div className="mt-4 inline-flex items-baseline gap-2 bg-white px-6 py-2.5 rounded-xl border border-sky-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Điểm số:
                  </span>
                  <span className="text-3xl font-extrabold text-sky-600 font-mono tabular-nums">
                    {finalScore}
                  </span>
                  <span className="text-sm font-bold text-slate-400">/ 10</span>
                </div>
              </div>

              {/* Review detailed answers */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Xem lại chi tiết bài làm & Lời giải
                </h4>

                {questions.map((q, idx) => {
                  const studentAns = selectedAnswers[q.id];
                  const isCorrect = studentAns === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            Câu {idx + 1}
                          </span>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Chính xác (+{q.points}đ)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                              <XCircle className="w-4 h-4 text-rose-600" />
                              Chưa chính xác (0đ)
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 mb-3">
                        {q.questionText}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isPicked = studentAns === oIdx;
                          const isRight = q.correctAnswer === oIdx;

                          let itemStyle = 'bg-white border-slate-200 text-slate-700';
                          if (isRight) {
                            itemStyle = 'bg-emerald-100/70 border-emerald-400 text-emerald-900 font-semibold';
                          } else if (isPicked && !isRight) {
                            itemStyle = 'bg-rose-100/70 border-rose-300 text-rose-900 line-through';
                          }

                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg border flex items-center justify-between ${itemStyle}`}
                            >
                              <span>{opt}</span>
                              {isRight && <span className="text-[11px] font-bold text-emerald-700 ml-2">(Đáp án đúng)</span>}
                              {isPicked && !isRight && <span className="text-[11px] font-bold text-rose-700 ml-2">(Bạn chọn)</span>}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
                          <span className="font-bold text-slate-800">Giải thích: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Xác nhận nộp bài kiểm tra?
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bạn đã trả lời{' '}
                  <strong className="text-slate-900">
                    {answeredCount}/{questions.length}
                  </strong>{' '}
                  câu hỏi. Thời gian còn lại là{' '}
                  <strong className="text-slate-900">{formatTime(timeLeft)}</strong>.
                  Sau khi nộp, bạn không thể sửa đổi câu trả lời.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Tiếp tục làm bài
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 shadow-xs"
                >
                  Nộp bài ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
