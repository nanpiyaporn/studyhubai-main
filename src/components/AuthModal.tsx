import React, { useState } from 'react';
import { Sparkles, Shield, Lock, CheckCircle2, ArrowRight, KeyRound, Globe } from 'lucide-react';
import { GoogleWorkspaceService } from '../services/googleWorkspace';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const token = await GoogleWorkspaceService.requestAccessToken();
      const profile = await GoogleWorkspaceService.fetchUserProfile(token);

      const session: UserSession = {
        id: 'usr_' + Date.now(),
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        accessToken: token,
        isAuthenticated: true,
        provider: 'google',
        workspaceConnected: {
          calendar: true,
          tasks: true,
          gmail: true,
        },
      };

      onLoginSuccess(session);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError(err.message || 'Authentication was cancelled or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = (presetName: string, presetEmail: string, avatarUrl: string) => {
    const demoToken = 'mock_gauth_' + Math.random().toString(36).substring(2);
    const session: UserSession = {
      id: 'demo_' + Date.now(),
      name: presetName,
      email: presetEmail,
      picture: avatarUrl,
      accessToken: demoToken,
      isAuthenticated: true,
      provider: 'google',
      workspaceConnected: {
        calendar: true,
        tasks: true,
        gmail: true,
      },
    };
    onLoginSuccess(session);
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-stone-950 via-orange-950 to-amber-950 p-8 text-white text-center relative overflow-hidden border-b border-orange-800/60">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-orange-400/30 shadow-inner mb-4">
            <Sparkles className="w-7 h-7 text-orange-400" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Welcome to StudyHub<span className="text-orange-400">.ai</span>
          </h2>
          <p className="text-sm text-orange-100/80 max-w-sm mx-auto leading-relaxed">
            Autonomous academic taskmaster agent powered by Gemini 3 & Google Workspace APIs.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5" /> Authentication First Security Protocol
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Google Workspace Permissions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Google Calendar</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Google Tasks</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Gmail Comms</span>
              </div>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {authError}
            </div>
          )}

          {/* Primary Google Login Button */}
          <button
            id="btn-google-login"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            {isLoading ? 'Connecting to Google...' : 'Sign In with Google Account'}
          </button>

          {/* Quick Demo Student Sign In */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-center text-slate-500 mb-3 font-medium">
              Quick Test / Hackathon Judge Evaluation:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-demo-student"
                onClick={() => handleDemoSignIn('Alex Student', 'dngooddeals@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')}
                className="px-3 py-2 rounded-xl bg-orange-50/80 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Alex (CS Student)</span>
                <ArrowRight className="w-3 h-3 text-orange-600" />
              </button>

              <button
                id="btn-demo-grad"
                onClick={() => handleDemoSignIn('Sarah Jenkins', 'sjenkins.research@univ.edu', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Sarah (Bio Grad)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Security & GitHub Safe Protocol Footnote */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5 text-[11px] text-slate-500">
            <Lock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-700">GitHub Safe Protocol Active:</strong> Secrets are isolated on the server (<code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">process.env.GEMINI_API_KEY</code>). Client tokens are scoped strictly to academic calendar, task, and email automation.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
