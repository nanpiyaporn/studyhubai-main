import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  Calendar, 
  CheckSquare, 
  Mail, 
  BookOpen, 
  Mic, 
  Brain, 
  ShieldAlert, 
  FileText, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  ExternalLink,
  Code,
  Zap,
  Info,
  Download,
  Share2
} from 'lucide-react';

export const WorkflowArchitectureView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('agent-1');
  const [selectedTool, setSelectedTool] = useState<string>('tool-gemini');
  const [activeViewMode, setActiveViewMode] = useState<'diagram' | 'matrix' | 'functions'>('diagram');

  const agents = [
    {
      id: 'agent-1',
      number: '01',
      name: 'Policy Guardian & 420m Window Allocator',
      role: 'Syllabus & Exam Prep Guardian',
      icon: ShieldAlert,
      badgeColor: 'from-rose-500 to-red-600',
      tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
      description: 'Scans syllabi for exam dates, strict "no-backtracking" test rules, grading weights, and automatically schedules 420-minute (7-hour) uninterrupted deep-work prep blocks.',
      inputs: ['Raw Syllabus PDF/Text', 'Course Schedule', 'Exam Policies', 'User Available Hours'],
      outputs: ['420-min Study Blocks', 'Strict Policy Enforcement Rules', 'Exam Risk Mitigation Checklist'],
      toolsUsed: ['Gemini 3.7 Flash', 'Google Calendar API v3', 'Firebase Firestore'],
      promptSnippet: 'Extract all exam policies, no-backtracking rules, and generate dedicated 420-minute uninterrupted preparation windows before each midterm/final...'
    },
    {
      id: 'agent-2',
      number: '02',
      name: 'Zero-Cost Open Access Textbook Hunter',
      role: 'Open Library & OER Specialist',
      icon: BookOpen,
      badgeColor: 'from-emerald-500 to-teal-600',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Cross-references required course readings with OpenStax, CrossRef, and Open Educational Resources (OER) to locate legal $0 free textbooks, preventing expensive book costs.',
      inputs: ['Required Textbook Titles', 'Authors & ISBNs', 'Topic Keywords', 'Publisher Info'],
      outputs: ['Direct PDF Download Links', 'Free Web Reader URLs', 'Estimated Student Cost Savings ($150-$300)'],
      toolsUsed: ['OpenStax Library Index', 'CrossRef Metadata API', 'Gemini 3.7 Flash Matcher'],
      promptSnippet: 'Search zero-cost open access academic databases for equivalent peer-reviewed textbooks and calculate total student financial savings...'
    },
    {
      id: 'agent-3',
      number: '03',
      name: 'Spoken Audio-to-LaTeX Transcriber',
      role: 'Quantitative Voice-to-Math Engine',
      icon: Mic,
      badgeColor: 'from-orange-500 to-amber-600',
      tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
      description: 'Converts spoken physics, calculus, and engineering lecture recordings into precise KaTeX / LaTeX mathematical equations and structured step-by-step proofs.',
      inputs: ['Lecture Audio Recording', 'Professor Spoken Math', 'Class Notes Context'],
      outputs: ['Formatted LaTeX Formulas ($$ ... $$)', 'Conceptual Derivations', 'Formula Cheat Sheets'],
      toolsUsed: ['Gemini 3.7 Multimodal Audio SDK', 'KaTeX Math Typesetting Engine'],
      promptSnippet: 'Transcribe spoken verbal math expressions into formal LaTeX syntax, verifying tensor notation, integral bounds, and physical constants...'
    },
    {
      id: 'agent-4',
      number: '04',
      name: 'Active Recall & Anki SM-2 Deck Builder',
      role: 'Spaced Repetition & Quiz Master',
      icon: Brain,
      badgeColor: 'from-amber-500 to-yellow-600',
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
      description: 'Transforms syllabus learning objectives and lecture notes into optimized Anki flashcards with SM-2 spaced repetition intervals, CSV/TSV exports, and diagnostic test arena.',
      inputs: ['Course Key Topics', 'Definitions & Theorems', 'Historical Exam Questions'],
      outputs: ['Anki Ready Deck (.txt / .tsv)', 'Interactive Multiple-Choice Quizzes', 'SM-2 Memory Retention Schedules'],
      toolsUsed: ['Gemini 3.7 Flash', 'Anki Export Generator (TSV/APKG)', 'Interactive Active Recall Arena'],
      promptSnippet: 'Synthesize syllabus modules into active recall Q&A flashcards formatted for Anki SM-2 spaced repetition import with conceptual explanations...'
    }
  ];

  const tools = [
    {
      id: 'tool-gemini',
      name: 'Google Gemini 3.7 Flash SDK',
      category: 'Core AI Engine',
      icon: Sparkles,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      description: 'Powers multimodal syllabus PDF parsing, audio speech-to-math transcription, and structured JSON generation across all 4 agents with zero latency.',
      endpoint: '@google/genai SDK (models/gemini-3.7-flash)',
      functions: ['generateContent (JSON Schema)', 'multimodal inlineData (PDF / Audio)', 'systemInstruction tuning']
    },
    {
      id: 'tool-calendar',
      name: 'Google Calendar API v3',
      category: 'Google Workspace',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Pushes 420-minute uninterrupted study windows, exam alerts, and deadline reminders directly into the user\'s Google Calendar with color coding.',
      endpoint: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      functions: ['events.insert (420m Blocks)', 'events.patch', 'events.list (Conflict Detection)']
    },
    {
      id: 'tool-tasks',
      name: 'Google Tasks API v1',
      category: 'Google Workspace',
      icon: CheckSquare,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: 'Creates dedicated academic task lists categorized by week, homework deadlines, and reading assignments synced to mobile and desktop.',
      endpoint: 'https://tasks.googleapis.com/tasks/v1/lists',
      functions: ['tasklists.insert (Course Name)', 'tasks.insert (Action Items with Due Dates)']
    },
    {
      id: 'tool-gmail',
      name: 'Google Gmail API v1',
      category: 'Google Workspace',
      icon: Mail,
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Composes polite, professional email drafts to professors for syllabus accommodations, exam conflict inquiries, and office hour requests.',
      endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/drafts',
      functions: ['drafts.create (RFC 2822 Base64 payload)', 'messages.send (Optional direct dispatch)']
    },
    {
      id: 'tool-firestore',
      name: 'Firebase Firestore',
      category: 'Cloud Persistence',
      icon: Database,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      description: 'Stores generated course roadmaps, user saved study orders, flashcard mastery progress, and cross-session academic profile securely.',
      endpoint: 'cloud.firestore / studyhub_orders',
      functions: ['collection("studyhub_orders").addDoc()', 'onSnapshot() real-time listener', 'security rules RBAC']
    },
    {
      id: 'tool-katex',
      name: 'KaTeX & LaTeX Engine',
      category: 'Mathematical Typesetting',
      icon: Code,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description: 'High-performance client-side rendering of complex calculus, linear algebra, physics vectors, and differential equations.',
      endpoint: 'katex / react-katex',
      functions: ['Inline Math ($...$)', 'Display Block Math ($$...$$)', 'Symbolic formatting']
    }
  ];

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0];
  const currentTool = tools.find((t) => t.id === selectedTool) || tools[0];

  return (
    <div id="workflow-architecture-hub" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-orange-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <Layers className="w-3.5 h-3.5" /> Full System Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            StudyHub<span className="text-orange-400">.ai</span> Architecture & Multi-Agent Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Explore how Syllabus documents, Lecture Audio, and Google OAuth credentials flow through 
            <strong className="text-orange-300"> 4 Autonomous Gemini 3.7 Agents</strong> and connect to 
            <strong className="text-amber-300"> Google Workspace APIs & Firebase Firestore</strong>.
          </p>

          {/* View Mode Toggle */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveViewMode('diagram')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeViewMode === 'diagram'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" /> Interactive Visual Diagram
            </button>
            <button
              onClick={() => setActiveViewMode('matrix')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeViewMode === 'matrix'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" /> 4 Agents & Tools Matrix
            </button>
            <button
              onClick={() => setActiveViewMode('functions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeViewMode === 'functions'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" /> Execution Pipeline Sequence
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Interactive Visual Diagram */}
      {activeViewMode === 'diagram' && (
        <div className="space-y-6">
          
          {/* Visual 4-Tier Flow Canvas */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  Autonomous Agent Ingestion to Cloud Workspace Flow
                </h2>
                <p className="text-xs text-slate-500">
                  Step-by-step pipeline connecting raw inputs, AI cognitive agents, external tools, and verified outputs.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Architecture Active
              </div>
            </div>

            {/* 4 Connected Stages */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              
              {/* Stage 1: Ingestion */}
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/80 space-y-4 hover:border-orange-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                      Tier 1: Ingestion
                    </span>
                    <FileText className="w-4 h-4 text-slate-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">User Raw Input</h3>
                  <p className="text-xs text-slate-500 mt-1">Multi-format academic raw data ingestion.</p>

                  <div className="mt-4 space-y-2">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Syllabus PDF / Text
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      Lecture Audio MP3/WAV
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Google OAuth Token
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-orange-600">
                  <span>Extracts & Parses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Stage 2: 4 AI Agents */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-orange-50/50 to-amber-50/40 border-2 border-orange-300 space-y-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-1 rounded-md border border-orange-200">
                      Tier 2: 4 Agents
                    </span>
                    <Cpu className="w-4 h-4 text-orange-600 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <h3 className="text-sm font-extrabold text-orange-950">Gemini 3.7 Orchestrator</h3>
                  <p className="text-xs text-orange-800/80 mt-1">Autonomous multi-agent execution pipeline.</p>

                  <div className="mt-4 space-y-1.5">
                    <button
                      onClick={() => setSelectedAgent('agent-1')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedAgent === 'agent-1'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white/80 hover:bg-white text-slate-800 border border-orange-200/60'
                      }`}
                    >
                      <span className="truncate">1. Policy & 420m Prep</span>
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      onClick={() => setSelectedAgent('agent-2')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedAgent === 'agent-2'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white/80 hover:bg-white text-slate-800 border border-orange-200/60'
                      }`}
                    >
                      <span className="truncate">2. $0 Textbook Hunter</span>
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      onClick={() => setSelectedAgent('agent-3')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedAgent === 'agent-3'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white/80 hover:bg-white text-slate-800 border border-orange-200/60'
                      }`}
                    >
                      <span className="truncate">3. Audio to LaTeX</span>
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      onClick={() => setSelectedAgent('agent-4')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedAgent === 'agent-4'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white/80 hover:bg-white text-slate-800 border border-orange-200/60'
                      }`}
                    >
                      <span className="truncate">4. Anki SM-2 Builder</span>
                      <Brain className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-orange-200 flex items-center justify-between text-[11px] font-bold text-amber-700">
                  <span>Structured Schemas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Stage 3: Tools & Integration */}
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/80 space-y-4 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                      Tier 3: Tools & APIs
                    </span>
                    <Terminal className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">External Integrations</h3>
                  <p className="text-xs text-slate-500 mt-1">Google Workspace & Cloud persistence.</p>

                  <div className="mt-4 space-y-1.5">
                    <button
                      onClick={() => setSelectedTool('tool-calendar')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedTool === 'tool-calendar'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <span className="truncate">Google Calendar v3</span>
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      onClick={() => setSelectedTool('tool-tasks')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedTool === 'tool-tasks'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <span className="truncate">Google Tasks v1</span>
                      <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      onClick={() => setSelectedTool('tool-gmail')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedTool === 'tool-gmail'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <span className="truncate">Google Gmail v1</span>
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      onClick={() => setSelectedTool('tool-firestore')}
                      className={`w-full text-left p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedTool === 'tool-firestore'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <span className="truncate">Firebase Firestore</span>
                      <Database className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-blue-600">
                  <span>API Dispatches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Stage 4: Verified Outputs */}
              <div className="p-5 rounded-2xl bg-emerald-50/40 border-2 border-emerald-300 space-y-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200">
                      Tier 4: Deliverables
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-emerald-950">Student Action Hub</h3>
                  <p className="text-xs text-emerald-800/80 mt-1">Autonomous outputs ready for use.</p>

                  <div className="mt-4 space-y-2">
                    <div className="p-2 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      420m Reserved Study Blocks
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Anki Deck (.tsv / Flashcards)
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      $0 OpenStax Free Textbooks
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      LaTeX Formulas & Gmail Draft
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-200 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                  <span>Ready in Real-Time</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

          {/* Detailed Selected Node Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Agent Deep-Dive Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${currentAgent.badgeColor} text-white flex items-center justify-center shadow-md`}>
                    <currentAgent.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Agent {currentAgent.number} Deep Dive</span>
                    <h3 className="text-sm font-extrabold text-slate-900">{currentAgent.name}</h3>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${currentAgent.tagColor}`}>
                  {currentAgent.role}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {currentAgent.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Input Payload</span>
                  <ul className="space-y-1">
                    {currentAgent.inputs.map((inp, idx) => (
                      <li key={idx} className="text-slate-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {inp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Output Schema</span>
                  <ul className="space-y-1">
                    {currentAgent.outputs.map((out, idx) => (
                      <li key={idx} className="text-slate-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {out}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1">
                <div className="text-orange-400 font-bold flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" /> Prompt Instruction Spec:
                </div>
                <p className="text-slate-400 italic">"{currentAgent.promptSnippet}"</p>
              </div>
            </div>

            {/* Tool / API Deep-Dive Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                    <currentTool.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Integration Tool Spec</span>
                    <h3 className="text-sm font-extrabold text-slate-900">{currentTool.name}</h3>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${currentTool.color}`}>
                  {currentTool.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {currentTool.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Endpoint / SDK Target</span>
                <div className="font-mono text-xs text-slate-800 font-semibold bg-white p-2 rounded-lg border border-slate-200 truncate">
                  {currentTool.endpoint}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Active Handlers & Methods</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentTool.functions.map((fn, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{fn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Mode 2: Matrix of 4 Agents & Tools */}
      {activeViewMode === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">4 Autonomous Academic Agents Matrix</h2>
              <p className="text-xs text-slate-500">Comprehensive breakdown of all agent responsibilities, model configurations, and integration surfaces.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 hover:border-orange-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${agent.badgeColor} text-white flex items-center justify-center shadow-xs`}>
                        <agent.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">AGENT {agent.number}</span>
                        <h3 className="text-xs font-bold text-slate-900">{agent.name}</h3>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${agent.tagColor}`}>
                      {agent.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {agent.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">Tools:</span>
                    {agent.toolsUsed.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tools Ecosystem Grid */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">External APIs & Workspace Integrations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 hover:shadow-xs transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <tool.icon className="w-4 h-4 text-orange-600" />
                        <h4 className="text-xs font-bold text-slate-900">{tool.name}</h4>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tool.color}`}>
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{tool.description}</p>
                    <div className="font-mono text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-md border border-slate-100 truncate">
                      {tool.endpoint}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Mode 3: Execution Pipeline Sequence */}
      {activeViewMode === 'functions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">End-to-End Execution Sequence</h2>
              <p className="text-xs text-slate-500">How the multi-agent taskmaster coordinates in real time to process course syllabi and sync with Google Cloud.</p>
            </div>

            <div className="space-y-4">
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">User Drops Syllabus PDF or Selects Preset</h3>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">Client / Browser</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Browser converts the uploaded syllabus into a secure base64 stream or extracts pure text. Client-side OAuth token (Google Identity Services) is attached.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">POST /api/agent/run-pipeline (Server Proxy)</h3>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">Express Backend</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Node.js backend receives payload securely, protecting the private Gemini API Key. Dispatches structured prompts to <strong>Gemini 3.7 Flash</strong> with JSON Schema enforcement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">4 Autonomous Agents Synthesize Data Simultaneously</h3>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Gemini 3.7 Flash</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Agent 1 calculates 420m test blocks; Agent 2 parses OpenStax books; Agent 3 formulates LaTeX proofs; Agent 4 builds spaced-repetition Anki decks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">1-Click Synchronization to Google Workspace & Firebase</h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Calendar v3 & Tasks v1 & Firestore</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Events are dispatched to user's Google Calendar with 420-minute reservation color tags. Tasks are added to Google Tasks app, drafts saved to Gmail, and session state is saved to Firestore.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
