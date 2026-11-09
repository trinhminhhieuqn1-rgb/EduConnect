import React, { useState } from 'react';
import { Copy, Check, Shield, Server, Terminal, ExternalLink } from 'lucide-react';
import { FIREBASE_DEPLOYMENT_GUIDE } from '../services/firebaseConfigDoc';
import { Modal } from './Modal';
import { useToast } from './Toast';

interface FirebaseDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseDeploymentModal: React.FC<FirebaseDeploymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'rules' | 'env' | 'code'>('steps');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Đã sao chép vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hướng Dẫn Tích Hợp Firebase & Triển Khai Production"
      maxWidth="3xl"
    >
      <div className="space-y-5">
        <p className="text-xs text-slate-600 leading-relaxed">
          {FIREBASE_DEPLOYMENT_GUIDE.overview}
        </p>

        {/* Tab buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'steps' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5 Bước Cài Đặt
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rules' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Firestore Rules
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'env' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Biến Môi Trường (.env)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mã Khởi Tạo SDK
          </button>
        </div>

        {/* Tab 1: Steps */}
        {activeTab === 'steps' && (
          <div className="space-y-3">
            {FIREBASE_DEPLOYMENT_GUIDE.steps.map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {st.step}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">{st.detail}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Quy tắc bảo mật phân quyền Role-Based Access Control (RBAC):
              </span>
              <button
                onClick={() => handleCopy(FIREBASE_DEPLOYMENT_GUIDE.rules, 'rules')}
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                {copiedKey === 'rules' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'rules' ? 'Đã sao chép' : 'Sao chép rules'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">
              <code>{FIREBASE_DEPLOYMENT_GUIDE.rules}</code>
            </pre>
          </div>
        )}

        {/* Tab 3: Env */}
        {activeTab === 'env' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Mẫu cấu hình môi trường Vite (.env):
              </span>
              <button
                onClick={() => handleCopy(FIREBASE_DEPLOYMENT_GUIDE.envTemplate, 'env')}
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                {copiedKey === 'env' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'env' ? 'Đã sao chép' : 'Sao chép .env'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
              <code>{FIREBASE_DEPLOYMENT_GUIDE.envTemplate}</code>
            </pre>
          </div>
        )}

        {/* Tab 4: Code */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Code khởi tạo Firebase SDK Client (src/services/firebase.ts):
              </span>
              <button
                onClick={() => handleCopy(FIREBASE_DEPLOYMENT_GUIDE.initCode, 'code')}
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                {copiedKey === 'code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'code' ? 'Đã sao chép' : 'Sao chép code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
              <code>{FIREBASE_DEPLOYMENT_GUIDE.initCode}</code>
            </pre>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};
