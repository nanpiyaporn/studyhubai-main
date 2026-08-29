import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileCode, 
  Lock, 
  ExternalLink,
  Download
} from 'lucide-react';
import { NEXTJS_EXPORT_FILES } from '../services/nextJsProjectGenerator';

interface NextJsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextJsExportModal: React.FC<NextJsExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'env' | 'gitignore' | 'nextAuth' | 'agentRoute' | 'middleware'
  >('env');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const filesMap = {
    env: { title: '.env.example', content: NEXTJS_EXPORT_FILES.envExample, lang: 'bash' },
    gitignore: { title: '.gitignore', content: NEXTJS_EXPORT_FILES.gitignore, lang: 'gitignore' },
    nextAuth: { title: 'app/api/auth/[...nextauth]/route.ts', content: NEXTJS_EXPORT_FILES.nextAuthRoute, lang: 'typescript' },
    agentRoute: { title: 'app/api/agent/run-pipeline/route.ts', content: NEXTJS_EXPORT_FILES.agentRoute, lang: 'typescript' },
    middleware: { title: 'middleware.ts', content: NEXTJS_EXPORT_FILES.middleware, lang: 'typescript' },
  };

  const currentFile = filesMap[activeTab];

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedTab(activeTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div id="nextjs-export-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Next.js (App Router) & NextAuth.js Production Codebase
              </h2>
              <p className="text-xs text-slate-400">
                GitHub-ready zero-leak configuration with Google OAuth & Gemini 3 API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>GitHub Safe Protocols Enforced:</strong> All sensitive keys reside strictly server-side in <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-950">.env.local</code> and protected via <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-950">.gitignore</code>.
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          {(Object.keys(filesMap) as Array<keyof typeof filesMap>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all shrink-0 border-t border-x ${
                activeTab === key
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              {filesMap[key].title}
            </button>
          ))}
        </div>

        {/* Code Content Body */}
        <div className="flex-1 p-6 bg-slate-950 text-slate-100 overflow-y-auto font-mono text-xs relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span>File: <strong className="text-white">{currentFile.title}</strong></span>
            <button
              onClick={handleCopyCurrent}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="overflow-x-auto leading-relaxed text-slate-200">
            <code>{currentFile.content}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Ready to deploy to Cloud Run, Vercel, or push directly to GitHub</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
