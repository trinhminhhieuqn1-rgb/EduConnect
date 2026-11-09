import React from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  BarChart,
  Clock,
  Award
} from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  onNavigateToRoleDemo: (role: 'teacher' | 'student' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onNavigateToRoleDemo,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-sky-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/70 text-sky-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Nền tảng giáo dục thông minh thế hệ mới</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Kết Nối Giảng Dạy & <br />
                <span className="text-sky-600">Học Tập Trực Tuyến</span> Đột Phá
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                EduConnect là giải pháp toàn diện giúp giáo viên quản lý lớp học số, đăng bài giảng tương tác, tổ chức thi trắc nghiệm bấm giờ tự động và theo dõi tiến độ của từng học sinh theo thời gian thực.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Bắt đầu trải nghiệm ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
                >
                  Đăng nhập hệ thống
                </button>
              </div>

              {/* Fast 1-click test triggers */}
              <div className="pt-4 border-t border-slate-200/70">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Dùng thử ngay các giao diện phân quyền:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onNavigateToRoleDemo('teacher')}
                    className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Xem Dashboard Giáo Viên</span>
                  </button>

                  <button
                    onClick={() => onNavigateToRoleDemo('student')}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Xem Dashboard Học Sinh</span>
                  </button>

                  <button
                    onClick={() => onNavigateToRoleDemo('admin')}
                    className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Xem Quản Trị Viên (Admin)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-Fidelity Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white group">
                <img
                  src="/src/assets/images/hero_educonnect_platform_1794199363201.jpg"
                  alt="Không gian học tập số EduConnect"
                  className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 bg-sky-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
                    Số hóa lớp học
                  </span>
                  <h3 className="text-lg font-bold mt-1">Lớp Học Tương Tác 4.0</h3>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Tối ưu hóa trải nghiệm học tập từ xa và trên lớp học thông minh.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section className="py-10 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-extrabold text-sky-600 font-mono tabular-nums">
                12,500+
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Học sinh đang theo học
              </p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                850+
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Giáo viên & Giảng viên
              </p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-extrabold text-sky-600 font-mono tabular-nums">
                3,400+
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Bài giảng & Đề kiểm tra
              </p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
                99.8%
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Mức độ hài lòng của trường học
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Teachers and Students */}
      <section id="roles" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Được Thiết Kế Chuyên Biệt Cho Từng Đối Tượng
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Mọi tính năng đều hướng tới trải nghiệm giảng dạy trực quan của thầy cô và sự tiến bộ từng ngày của học sinh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teacher Box */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Dành Cho Giáo Viên & Giảng Viên
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Giải phóng thầy cô khỏi công việc chấm bài thủ công để tập trung vào chất lượng giảng dạy.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Tạo và quản lý lớp học dễ dàng:</strong> Cấp mã lớp 6 ký tự để học sinh tham gia nhanh trong 3 giây.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Đăng bài giảng đa phương tiện:</strong> Đính kèm tài liệu PDF, hình ảnh, tài liệu đọc và video minh họa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Giao bài tập & Đề thi trắc nghiệm:</strong> Hệ thống tự động chấm điểm bài trắc nghiệm với giải thích chi tiết.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Chấm bài tự luận và nhận xét:</strong> Phản hồi điểm số và lời nhận xét trực tiếp đến từng học trò.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Bảng điểm trực quan:</strong> Biểu đồ phân bổ điểm số và tỷ lệ hoàn thành theo thời gian thực.</span>
              </li>
            </ul>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateToRoleDemo('teacher')}
                className="w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs rounded-xl transition-colors text-center"
              >
                Trải nghiệm giao diện Giáo viên →
              </button>
            </div>
          </div>

          {/* Student Box */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Dành Cho Học Sinh & Học Viên
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Môi trường học tập chủ động, nắm bắt lịch học, làm bài tập và nhận kết quả tức thì.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tham gia lớp bằng mã:</strong> Không cần thao tác phức tạp, chỉ cần nhập mã lớp của thầy cô là vào học ngay.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Kho bài giảng & tài liệu ôn thi:</strong> Xem bài học, xem video hướng dẫn và tải đề cương PDF về máy.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Làm bài kiểm tra trắc nghiệm bấm giờ:</strong> Trải nghiệm phòng thi thực tế với đồng hồ đếm ngược chính xác.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Xem kết quả ngay & Lời giải chi tiết:</strong> Nắm rõ câu đúng, câu sai và lời giải thích giúp củng cố kiến thức.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Nhận thông báo điểm và bài tập:</strong> Không bao giờ bỏ lỡ hạn nộp bài hay bài giảng mới từ thầy cô.</span>
              </li>
            </ul>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateToRoleDemo('student')}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl transition-colors text-center"
              >
                Trải nghiệm giao diện Học sinh →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section id="features" className="py-16 bg-slate-100/60 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Khám phá lớp học tiêu biểu
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Các Khóa Học & Chuyên Đề Đang Mở
              </h2>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Xem tất cả lớp học <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all">
              <img
                src="/src/assets/images/course_math_science_1794199364346.jpg"
                alt="Toán Học 12"
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Toán học</span>
                  <span>·</span>
                  <span>Mã: MAT12A</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Toán Học 12 - Chuyên Đề Hàm Số & Oxyz
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  Ôn luyện chuyên sâu kiến thức lớp 12, giải nhanh trắc nghiệm đồ thị hàm số và hình học không gian.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Thầy Nguyễn Minh Tuấn</span>
                  <span className="font-semibold text-slate-800">45 học sinh</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all">
              <img
                src="/src/assets/images/course_literature_languages_1794199364597.jpg"
                alt="Tiếng Anh THPT"
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Tiếng Anh</span>
                  <span>·</span>
                  <span>Mã: ENG101</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Tiếng Anh THPT - Luyện Thi IELTS & Tốt Nghiệp
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  Nâng cao vốn từ vựng học thuật, ngữ pháp cốt lõi và kỹ năng Reading - Listening đạt chuẩn điểm cao.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Cô Lê Mai Hương</span>
                  <span className="font-semibold text-slate-800">38 học sinh</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all">
              <img
                src="/src/assets/images/course_computer_science_1794199363990.jpg"
                alt="Tin học & Lập trình"
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Tin học</span>
                  <span>·</span>
                  <span>Mã: CS202</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Lập Trình Web & Tư Duy Thuật Toán
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  Nhập môn thuật toán, cấu trúc dữ liệu và phát triển ứng dụng thực tế dành cho học sinh THPT.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Thầy Nguyễn Minh Tuấn</span>
                  <span className="font-semibold text-slate-800">29 học sinh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Giáo Viên & Học Sinh Chia Sẻ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Những trải nghiệm thực tế sau khi ứng dụng EduConnect vào giảng dạy và học tập.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
              "Tính năng chấm bài trắc nghiệm tự động có đồng hồ đếm ngược và bảng giải thích giúp tôi tiết kiệm hơn 80% thời gian chấm thi mỗi tuần. Học sinh rất hào hứng khi biết kết quả ngay lập tức."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Thầy Tuấn"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Thầy Nguyễn Minh Tuấn</p>
                <p className="text-[11px] text-slate-500">Giáo viên Toán - THPT Chuyên Hà Nội - Amsterdam</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
              "Giao diện EduConnect cực kỳ dễ dùng, không hề rối mắt. Em có thể theo dõi hạn nộp bài trên điện thoại và làm bài kiểm tra ôn tập bất cứ lúc nào."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                alt="Học sinh Hiếu"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Trịnh Minh Hiếu</p>
                <p className="text-[11px] text-slate-500">Học sinh Lớp 12 - THPT Chuyên</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
              "Việc đính kèm tài liệu PDF và video giảng dạy theo từng bài học rất khoa học. Học sinh có thể ôn lại bài dễ dàng trước các kỳ thi học kỳ."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80"
                alt="Cô Hương"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Cô Lê Mai Hương</p>
                <p className="text-[11px] text-slate-500">Giảng viên Tiếng Anh - THPT Chu Văn An</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Sẵn Sàng Nâng Tầm Lớp Học Trực Tuyến Của Bạn?
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
            Khởi tạo lớp học số trong 1 phút, kết nối học sinh và quản lý bài giảng chuyên nghiệp hoàn toàn miễn phí.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Đăng ký tài khoản ngay
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="px-6 py-3 bg-sky-700/60 hover:bg-sky-700 text-white border border-white/20 font-semibold text-xs rounded-xl transition-colors"
            >
              Đăng nhập hệ thống
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <GraduationCap className="w-5 h-5 text-sky-400" />
              <span>EduConnect</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nền tảng kết nối dạy và học trực tuyến hiện đại dành cho giáo viên, học sinh và trường học.
            </p>
            <p className="text-[11px] text-slate-500">
              © 2026 EduConnect Platform. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Tính Năng Chính</h4>
            <ul className="space-y-2">
              <li>Quản lý lớp học & Mã lớp</li>
              <li>Bài giảng & Đính kèm tài liệu PDF</li>
              <li>Kiểm tra trắc nghiệm bấm giờ</li>
              <li>Tự động chấm điểm & Bảng điểm</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Vai Trò Người Dùng</h4>
            <ul className="space-y-2">
              <li>Khu vực Giáo viên (Teacher)</li>
              <li>Khu vực Học sinh (Student)</li>
              <li>Khu vực Quản trị (Admin)</li>
              <li>Phân quyền Role-Based Access</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Hỗ Trợ & Kỹ Thuật</h4>
            <ul className="space-y-2">
              <li>Hỗ trợ trực tuyến: hotro@educonnect.vn</li>
              <li>Tổng đài: 1900 6868 (8:00 - 21:00)</li>
              <li>Kiến trúc Firebase & Cloud Firestore</li>
              <li>Hạ tầng bảo mật chuẩn giáo dục</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
