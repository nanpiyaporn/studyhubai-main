import React from 'react';
import { UserSession } from '../types';
import { 
  Sparkles, 
  Calendar, 
  CheckSquare, 
  Mail, 
  Terminal, 
  Code2, 
  LogOut, 
  Cpu,
  BookOpen,
  Mic,
  Brain,
  ShieldAlert,
  FileText,
  Layers
} from 'lucide-react';

export type ActiveTabType = 
  | 'workflow' 
  | 'architecture'
  | 'schedule_rules'
  | 'textbook' 
  | 'audio_latex' 
  | 'anki' 
  | 'research'
  | 'calendar' 
  | 'tasks' 
  | 'gmail';

interface HeaderProps {
  session: UserSession | null;
  onSignOut: () => void;
  onOpenExportModal: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  hasWorkflowResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onSignOut,
  onOpenExportModal,
  onToggleTerminal,
  isTerminalOpen,
  activeTab,
  setActiveTab,
  hasWorkflowResult,
}) => {
  return (
    <header id="studyhub-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">StudyHub<span className="text-orange-600">.ai</span></span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/60">
                  <Cpu className="w-3 h-3 text-orange-600" /> Multi-Agent Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Academic Execution Agents</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          {session && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
              <button
                id="nav-tab-workflow"
                onClick={() => setActiveTab('workflow')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'workflow'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Orchestrator
              </button>

              <button
                id="nav-tab-architecture"
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'architecture'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                Workflow Map
              </button>

              <button
                id="nav-tab-schedule-rules"
                onClick={() => setActiveTab('schedule_rules')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'schedule_rules'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                420m & Rules
              </button>

              <button
                id="nav-tab-textbook"
                onClick={() => setActiveTab('textbook')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'textbook'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Textbooks
              </button>

              <button
                id="nav-tab-audio-latex"
                onClick={() => setActiveTab('audio_latex')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'audio_latex'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-orange-600" />
                Audio to LaTeX
              </button>

              <button
                id="nav-tab-anki"
                onClick={() => setActiveTab('anki')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'anki'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-amber-600" />
                Anki Decks
              </button>

              <button
                id="nav-tab-research"
                onClick={() => setActiveTab('research')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'research'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                Research
              </button>

              <button
                id="nav-tab-calendar"
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'calendar'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Calendar
              </button>

              <button
                id="nav-tab-tasks"
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'tasks'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Tasks
              </button>

              <button
                id="nav-tab-gmail"
                onClick={() => setActiveTab('gmail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'gmail'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Gmail
              </button>
            </nav>
          )}

          {/* Right Action Controls & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Terminal Drawer Trigger */}
            <button
              id="btn-toggle-terminal"
              onClick={onToggleTerminal}
              title="View Agent Execution Logs"
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isTerminalOpen
                  ? 'bg-slate-900 text-emerald-400 border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden xl:inline">Agent Trace</span>
            </button>

            {/* Next.js / NextAuth Code Export */}
            <button
              id="btn-open-nextjs-export"
              onClick={onOpenExportModal}
              title="Next.js & NextAuth.js Production Codebase"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Next.js / NextAuth</span> Export
            </button>

            {/* User Profile Pill */}
            {session ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={session.picture}
                  alt={session.name}
                  className="w-8 h-8 rounded-full ring-2 ring-orange-500/20 object-cover"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[110px]">{session.name}</p>
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Google OAuth
                  </p>
                </div>
                <button
                  id="btn-sign-out"
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}

          </div>

        </div>
      </div>
    </header>
  );
};

