import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Mail, 
  Brain, 
  ArrowRight, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  Layers, 
  Send, 
  ShieldAlert, 
  Mic, 
  DollarSign, 
  Database,
  UploadCloud,
  FileUp,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRESET_COURSES, PresetCourse } from '../services/mockData';
import { WorkflowResult, StudyBlock, GoogleTaskItem, EmailDraft, UserSession } from '../types';
import { GoogleWorkspaceService } from '../services/googleWorkspace';
import { ActiveTabType } from './Header';
import { 
  SavedUserOrder, 
  saveUserOrderToFirestore, 
  fetchUserOrdersFromFirestore, 
  deleteUserOrderFromFirestore, 
  updateUserOrderInFirestore 
} from '../services/orderService';
import { SavedOrdersSection } from './SavedOrdersSection';

interface TaskmasterWorkflowProps {
  session: UserSession | null;
  workflowResult: WorkflowResult | null;
  onWorkflowComplete: (result: WorkflowResult) => void;
  onNavigateTab: (tab: ActiveTabType) => void;
}

export const TaskmasterWorkflow: React.FC<TaskmasterWorkflowProps> = ({
  session,
  workflowResult,
  onWorkflowComplete,
  onNavigateTab,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetCourse>(PRESET_COURSES[0]);
  const [syllabusInput, setSyllabusInput] = useState<string>(PRESET_COURSES[0].syllabus);
  const [courseCode, setCourseCode] = useState<string>(PRESET_COURSES[0].code);
  const [courseName, setCourseName] = useState<string>(PRESET_COURSES[0].name);
  const [instructor, setInstructor] = useState<string>(PRESET_COURSES[0].instructor);
  const [instructorEmail, setInstructorEmail] = useState<string>(PRESET_COURSES[0].instructorEmail);
  const [studyHours, setStudyHours] = useState<number>(PRESET_COURSES[0].studyHours || 14);

  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [syncingGcal, setSyncingGcal] = useState(false);
  const [syncingTasks, setSyncingTasks] = useState(false);
  const [syncingGmail, setSyncingGmail] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // File Upload State
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Firebase Orders State
  const [savedOrders, setSavedOrders] = useState<SavedUserOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState<string | undefined>(workflowResult?.id);

  // Load orders from Firebase on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const orders = await fetchUserOrdersFromFirestore();
      setSavedOrders(orders);
    } catch (e) {
      console.warn('Could not load orders from Firestore:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const steps = [
    { title: 'Agent 1: Schedule & 420-Min Rule Injector', desc: 'Reserving uninterrupted 7-hour test blocks and tentative weeks' },
    { title: 'Agent 2: Textbook & Open-Access Procurement', desc: 'Crawling OpenStax, Internet Archive, campus reserves & eBay/Amazon' },
    { title: 'Agent 3: Quantitative Audio-to-LaTeX Transcriber', desc: 'Synthesizing Decision Variables, Objective Functions & Constraints' },
    { title: 'Agent 4: Adaptive Active Recall & Anki Driller', desc: 'Generating exportable Anki flashcard decks (.apkg / TSV)' },
    { title: 'Agent 5: Policy Guardian & Google Workspace Dispatcher', desc: 'Auditing Canvas forum rules and drafting Calendar/Tasks/Gmail syncs' },
  ];

  const handleSelectPreset = (preset: PresetCourse) => {
    setSelectedPreset(preset);
    setSyllabusInput(preset.syllabus);
    setCourseCode(preset.code);
    setCourseName(preset.name);
    setInstructor(preset.instructor);
    setInstructorEmail(preset.instructorEmail);
    setStudyHours(preset.studyHours);
    setUploadedFileName(null);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingFile(true);
    setUploadedFileName(file.name);
    setNotification(null);

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        setSyllabusInput(text);
        setNotification({ message: `Successfully loaded ${file.name}!`, type: 'success' });
      } else {
        // PDF or binary document: Convert to Base64 and send to server AI extractor
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64String = (reader.result as string).split(',')[1];
            const res = await fetch('/api/agent/extract-pdf-syllabus', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileBase64: base64String,
                mimeType: file.type || 'application/pdf',
                fileName: file.name,
              }),
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || 'Failed to extract text from PDF');
            }

            const data = await res.json();
            if (data.extractedText) {
              setSyllabusInput(data.extractedText);
            }
            if (data.courseCode) setCourseCode(data.courseCode);
            if (data.courseName) setCourseName(data.courseName);
            if (data.instructor) setInstructor(data.instructor);
            if (data.instructorEmail) setInstructorEmail(data.instructorEmail);
            if (data.studyHours) setStudyHours(Number(data.studyHours) || 14);

            setNotification({
              message: `Extracted syllabus from "${file.name}"! AI filled course code and details.`,
              type: 'success',
            });
          } catch (apiErr: any) {
            setNotification({
              message: `Could not parse PDF automatically (${apiErr.message}). You can also copy & paste the text directly.`,
              type: 'error',
            });
          } finally {
            setIsUploadingFile(false);
          }
        };
        reader.readAsDataURL(file);
        return; // Early return because reader is async
      }
    } catch (err: any) {
      setNotification({ message: `Error reading file: ${err.message}`, type: 'error' });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRunAgentWorkflow = async () => {
    if (!syllabusInput.trim()) {
      setNotification({ message: 'Please provide course syllabus or assignment details.', type: 'error' });
      return;
    }

    setIsRunning(true);
    setActiveStepIndex(0);
    setNotification(null);

    // Progressive step animation
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const response = await fetch('/api/agent/run-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusText: syllabusInput,
          courseCode,
          courseName,
          instructor,
          instructorEmail,
          studyHoursPerWeek: studyHours,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || 'Agent workflow execution failed');
      }

      const data: WorkflowResult = await response.json();
      clearInterval(interval);
      setActiveStepIndex(steps.length);
      onWorkflowComplete(data);
      setActiveOrderId(data.id);

      // Save output to Firebase Firestore
      try {
        const savedOrder = await saveUserOrderToFirestore(data, session?.email);
        setSavedOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)]);
      } catch (firestoreErr) {
        console.warn('Could not auto-save order to Firestore:', firestoreErr);
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      setNotification({
        message: `Taskmaster Multi-Agent Engine successfully orchestrated academic plan for ${data.courseCode} and saved to Firebase!`,
        type: 'success',
      });
    } catch (error: any) {
      clearInterval(interval);
      console.error('Agent Pipeline Error:', error);
      setNotification({
        message: error.message || 'Workflow execution error. Please try again.',
        type: 'error',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Select a previous order from Firebase
  const handleSelectPreviousOrder = (order: SavedUserOrder) => {
    setActiveOrderId(order.id);
    onWorkflowComplete(order.result);
    setCourseCode(order.result.courseCode || order.courseCode);
    setCourseName(order.result.courseName || order.courseName);
    setInstructor(order.result.instructor || order.instructor);
    setNotification({
      message: `Loaded previous order "${order.courseName}" from Firebase Firestore!`,
      type: 'success',
    });
  };

  // Delete an order from Firebase
  const handleDeleteOrder = async (orderId: string) => {
    await deleteUserOrderFromFirestore(orderId);
    setSavedOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (activeOrderId === orderId) {
      setActiveOrderId(undefined);
    }
    setNotification({
      message: 'Plan successfully deleted from Firebase Firestore.',
      type: 'success',
    });
  };

  // Edit notes or title in Firebase
  const handleUpdateOrderNotes = async (orderId: string, notes: string, updatedCourseName?: string) => {
    await updateUserOrderInFirestore(orderId, {
      notes,
      ...(updatedCourseName ? { courseName: updatedCourseName } : {})
    });
    setSavedOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              notes,
              ...(updatedCourseName ? { courseName: updatedCourseName } : {}),
            }
          : o
      )
    );
    setNotification({
      message: 'Order updated in Firebase Firestore!',
      type: 'success',
    });
  };

  // 1-Click Sync All Study Blocks to Google Calendar
  const handleSyncAllToCalendar = async () => {
    if (!workflowResult || !session?.accessToken) return;
    setSyncingGcal(true);
    try {
      let count = 0;
      for (const block of workflowResult.studyBlocks) {
        await GoogleWorkspaceService.createCalendarEvent(session.accessToken, block);
        block.syncedToGoogleCalendar = true;
        count++;
      }
      setNotification({
        message: `Successfully synchronized ${count} study blocks to Google Calendar!`,
        type: 'success',
      });
    } catch (e) {
      setNotification({ message: 'Failed to sync with Google Calendar', type: 'error' });
    } finally {
      setSyncingGcal(false);
    }
  };

  // 1-Click Sync All Tasks to Google Tasks
  const handleSyncAllToTasks = async () => {
    if (!workflowResult || !session?.accessToken) return;
    setSyncingTasks(true);
    try {
      let count = 0;
      for (const task of workflowResult.tasks) {
        await GoogleWorkspaceService.createGoogleTask(session.accessToken, task);
        task.syncedToGoogleTasks = true;
        count++;
      }
      setNotification({
        message: `Successfully synchronized ${count} actionable tasks to Google Tasks!`,
        type: 'success',
      });
    } catch (e) {
      setNotification({ message: 'Failed to sync with Google Tasks', type: 'error' });
    } finally {
      setSyncingTasks(false);
    }
  };

  // 1-Click Create Gmail Drafts
  const handleSyncAllToGmail = async () => {
    if (!workflowResult || !session?.accessToken) return;
    setSyncingGmail(true);
    try {
      let count = 0;
      for (const draft of workflowResult.emailDrafts) {
        await GoogleWorkspaceService.createGmailDraft(session.accessToken, draft);
        draft.status = 'synced_to_gmail';
        count++;
      }
      setNotification({
        message: `Successfully created ${count} academic email drafts in Gmail!`,
        type: 'success',
      });
    } catch (e) {
      setNotification({ message: 'Failed to create Gmail drafts', type: 'error' });
    } finally {
      setSyncingGmail(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-950 via-orange-950 to-amber-950 border border-orange-800/60 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" /> All Things Agentic Hackathon: Academic Execution
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            The Autonomous Multi-Agent Academic Taskmaster
          </h1>
          <p className="text-sm sm:text-base text-orange-100/85 leading-relaxed">
            Drop in syllabi and lecture audio. Four specialized agents coordinate to reserve <strong className="text-white">420-minute uninterrupted test blocks</strong>, hunt <strong className="text-white">zero-cost open access textbooks</strong>, transcribe spoken math into <strong className="text-white">LaTeX formulations</strong>, and build <strong className="text-white">Anki spaced repetition decks</strong> with Google Workspace & Firebase Firestore sync.
          </p>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3 text-sm font-medium">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs font-semibold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* TOP SECTION: Academic Agent Action Selector ("How can I help you today?") */}
      <div className="rounded-3xl bg-gradient-to-br from-orange-950 via-amber-950 to-stone-950 border border-orange-700/60 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-800/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Academic Agent Action Selector
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-orange-50">
              How can I help you today?
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-orange-200/80 font-medium">
            Choose a direct agent tool or launch the complete multi-agent pipeline
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Full Summary & Orchestrator */}
          <button
            id="btn-choice-full-orchestrator"
            onClick={handleRunAgentWorkflow}
            disabled={isRunning}
            className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] text-white text-left font-semibold shadow-lg shadow-orange-950/50 border border-orange-400/40 transition-all flex flex-col justify-between space-y-3 cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-100 bg-black/25 px-2.5 py-1 rounded-md">
                1. Master Plan
              </span>
              {isRunning ? (
                <RotateCw className="w-5 h-5 text-orange-100 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white text-white group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>
            <div>
              <div className="text-sm font-black text-white">Full Syllabus & Orchestrator</div>
              <div className="text-xs text-orange-100/85 mt-1 font-normal leading-tight">
                Run all 4 academic agents and synthesize complete study roadmap
              </div>
            </div>
          </button>

          {/* 2. Flashcard Building (Anki) */}
          <button
            id="btn-choice-flashcards"
            onClick={() => onNavigateTab('anki')}
            className="p-4 rounded-2xl bg-orange-900/40 hover:bg-orange-800/60 active:scale-[0.98] text-left border border-orange-700/50 hover:border-orange-500/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/40">
                2. Active Recall
              </span>
              <Brain className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-100">Flashcard Building (Anki)</div>
              <div className="text-xs text-orange-200/70 mt-1 leading-tight">
                Drill SM-2 spaced repetition decks and export .apkg / TSV
              </div>
            </div>
          </button>

          {/* 3. Summarize Lecture (Voice-to-Text / LaTeX) */}
          <button
            id="btn-choice-voice-latex"
            onClick={() => onNavigateTab('audio_latex')}
            className="p-4 rounded-2xl bg-orange-900/40 hover:bg-orange-800/60 active:scale-[0.98] text-left border border-orange-700/50 hover:border-orange-500/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-300 bg-orange-950/80 px-2.5 py-1 rounded-md border border-orange-800/40">
                3. Voice Math
              </span>
              <Mic className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-100">Summarize Lecture (Voice-to-Text)</div>
              <div className="text-xs text-orange-200/70 mt-1 leading-tight">
                Synthesize spoken math into LaTeX decision models ($\max Z$)
              </div>
            </div>
          </button>

          {/* 4. Set Scheduled Time into Calendar */}
          <button
            id="btn-choice-calendar-rules"
            onClick={() => onNavigateTab('schedule_rules')}
            className="p-4 rounded-2xl bg-orange-900/40 hover:bg-orange-800/60 active:scale-[0.98] text-left border border-orange-700/50 hover:border-orange-500/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/40">
                4. Schedule Time
              </span>
              <Calendar className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-100">Set Schedule in Calendar</div>
              <div className="text-xs text-orange-200/70 mt-1 leading-tight">
                Reserve 420-min continuous exam blocks & manage conflict reshuffling
              </div>
            </div>
          </button>

          {/* 5. Textbook Procurement */}
          <button
            id="btn-choice-textbook"
            onClick={() => onNavigateTab('textbook')}
            className="p-4 rounded-2xl bg-orange-900/40 hover:bg-orange-800/60 active:scale-[0.98] text-left border border-orange-700/50 hover:border-orange-500/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/40">
                5. Textbooks
              </span>
              <BookOpen className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-100">Textbook Procurement ($0.00)</div>
              <div className="text-xs text-orange-200/70 mt-1 leading-tight">
                Scrape open access, library reserves, and lowest cost deals
              </div>
            </div>
          </button>

          {/* 6. Research Literature & BibTeX */}
          <button
            id="btn-choice-research"
            onClick={() => onNavigateTab('research')}
            className="p-4 rounded-2xl bg-orange-900/40 hover:bg-orange-800/60 active:scale-[0.98] text-left border border-orange-700/50 hover:border-orange-500/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/40">
                6. Research
              </span>
              <FileText className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-100">Research Literature & BibTeX</div>
              <div className="text-xs text-orange-200/70 mt-1 leading-tight">
                Extract paper quotes and generate publication-ready BibTeX
              </div>
            </div>
          </button>

          {/* 7. Workflow & Multi-Agent Architecture Map */}
          <button
            id="btn-choice-architecture"
            onClick={() => onNavigateTab('architecture')}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 hover:from-slate-800 hover:to-orange-900 active:scale-[0.98] text-left border border-orange-500/50 hover:border-orange-400 transition-all flex flex-col justify-between space-y-3 cursor-pointer group sm:col-span-2 lg:col-span-3 shadow-md"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-300 bg-orange-500/20 px-2.5 py-1 rounded-md border border-orange-500/40 flex items-center gap-1">
                <Layers className="w-3 h-3 text-orange-400" /> Full System Blueprint
              </span>
              <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  System Architecture & Multi-Agent Workflow Map
                </div>
                <div className="text-xs text-orange-200/80 mt-0.5 leading-tight">
                  Visual node-flow showing all 4 Agents (Policy Guardian, $0 Textbooks, Audio-to-LaTeX, Anki SM-2), external Tools (Calendar, Tasks, Gmail, Firestore), and function pipelines
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-bold text-white shrink-0 self-start sm:self-center">
                Explore Blueprint →
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* NEXT SECTION: USER ORDERS OUTPUT LINKED TO FIREBASE (Delete, Edit, Click previous orders) */}
      <SavedOrdersSection
        orders={savedOrders}
        isLoading={isLoadingOrders}
        activeOrderId={activeOrderId}
        onSelectOrder={handleSelectPreviousOrder}
        onDeleteOrder={handleDeleteOrder}
        onUpdateOrderNotes={handleUpdateOrderNotes}
        onNavigateTab={onNavigateTab}
      />

      {/* SECTION: Syllabus Material & Preset Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset Switcher & Intensity (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-600" />
                Select Sample Syllabus
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">1-Click Test</span>
            </div>

            <div className="space-y-2">
              {PRESET_COURSES.map((preset) => (
                <button
                  key={preset.code}
                  id={`btn-preset-${preset.code.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedPreset.code === preset.code
                      ? 'bg-orange-50/80 border-orange-300 text-orange-950 ring-1 ring-orange-400/30'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-orange-700 bg-white px-2 py-0.5 rounded-md border border-orange-200/60">
                      {preset.code}
                    </span>
                    <span className="text-[11px] text-slate-500">{preset.studyHours}h/wk</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 line-clamp-1">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Target Study Intensity</h3>
            
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                <span>Weekly Commitment</span>
                <span className="font-bold text-orange-600">{studyHours} Hours / Week</span>
              </div>
              <input
                id="input-study-hours"
                type="range"
                min="4"
                max="25"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Light (4h)</span>
                <span>Standard (12h)</span>
                <span>Intensive (25h)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Course Code</label>
                <input
                  id="input-course-code"
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  placeholder="33:136:386"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Instructor</label>
                <input
                  id="input-instructor-name"
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  placeholder="Dr. Romulo N. Ely"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Syllabus Ingestion & Live Runner (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Syllabus / Assignment Raw Material</h2>
                <p className="text-xs text-slate-500">Drop a PDF or paste text (supports 420-min test windows & policies)</p>
              </div>
              <div className="flex items-center gap-2">
                {uploadedFileName && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-600" />
                    {uploadedFileName}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">{syllabusInput.length} chars</span>
              </div>
            </div>

            {/* Drag and Drop PDF / Text Ingestion Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-3.5 transition-all text-center ${
                isDragging
                  ? 'border-orange-500 bg-orange-50/60'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="p-2 bg-orange-100/70 text-orange-600 rounded-lg">
                  {isUploadingFile ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <UploadCloud className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-800">
                    {isUploadingFile ? 'Extracting syllabus via Gemini 3.7...' : 'Upload Syllabus Document (.PDF, .TXT, .MD)'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Drag and drop your syllabus file here, or browse from your computer
                  </p>
                </div>
                <label
                  htmlFor="file-upload-syllabus"
                  className="sm:ml-auto px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <FileUp className="w-3.5 h-3.5 text-orange-600" />
                  <span>Choose File</span>
                  <input
                    id="file-upload-syllabus"
                    type="file"
                    accept=".pdf,.txt,.md,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <textarea
              id="input-syllabus-text"
              rows={8}
              value={syllabusInput}
              onChange={(e) => setSyllabusInput(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-mono leading-relaxed text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500 resize-y"
              placeholder="Paste course syllabus or assignment rubric here, or upload a PDF above..."
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSyllabusInput('');
                  setCourseCode('');
                  setCourseName('');
                  setInstructor('');
                  setUploadedFileName(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
              >
                Clear text
              </button>

              <button
                onClick={handleRunAgentWorkflow}
                disabled={isRunning || isUploadingFile}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-orange-950/20 cursor-pointer disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Processing Multi-Agent Analysis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesize Academic Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Running State Step-by-Step Telemetry */}
          {isRunning && (
            <div className="bg-white rounded-2xl border border-orange-200 p-6 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-orange-950 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-orange-600 animate-spin" />
                  Multi-Agent Pipeline Executing
                </h4>
                <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                  Step {Math.min(activeStepIndex + 1, steps.length)} of {steps.length}
                </span>
              </div>

              <div className="space-y-3">
                {steps.map((step, idx) => {
                  const isCurrent = activeStepIndex === idx;
                  const isDone = activeStepIndex > idx;
                  return (
                    <div
                      key={step.title}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-orange-50/80 border border-orange-300 ring-1 ring-orange-400/20'
                          : isDone
                          ? 'bg-slate-50 border border-slate-100 opacity-70'
                          : 'opacity-40'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{step.title}</p>
                        <p className="text-[11px] text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Generated Workflow Execution Results */}
      {workflowResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Header Card for the Analyzed Course */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                    {workflowResult.courseCode}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    420-Min Test Clock Active
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Instructor: {workflowResult.instructor}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {workflowResult.courseName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                  {workflowResult.syllabusSummary}
                </p>
              </div>

              {/* Workspace Bulk Sync Actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  id="btn-sync-all-gcal"
                  onClick={handleSyncAllToCalendar}
                  disabled={syncingGcal}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>{syncingGcal ? 'Syncing...' : 'Sync Calendar'}</span>
                </button>

                <button
                  id="btn-sync-all-tasks"
                  onClick={handleSyncAllToTasks}
                  disabled={syncingTasks}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{syncingTasks ? 'Syncing...' : 'Sync Tasks'}</span>
                </button>

                <button
                  id="btn-sync-all-gmail"
                  onClick={handleSyncAllToGmail}
                  disabled={syncingGmail}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>{syncingGmail ? 'Drafting...' : 'Queue Gmail'}</span>
                </button>
              </div>
            </div>

            {/* Core Competencies & Themes */}
            <div className="pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Operations Management Competencies Extracted
              </h3>
              <div className="flex flex-wrap gap-2">
                {workflowResult.keyThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Exam Window Block</span>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">420 min</div>
              <p className="text-[11px] text-slate-500 mt-1">Continuous 7-hour timer enforced</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Textbook Outlay</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">$0.00</div>
              <p className="text-[11px] text-slate-500 mt-1">OpenStax + University loan matched</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">LaTeX Formulations</span>
                <Layers className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {workflowResult.quantitativeFormulations.length} Models
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Decision variables & constraints</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Recall Deck</span>
                <Brain className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {workflowResult.ankiCards.length} Flashcards
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Ready for export (.apkg/TSV)</p>
            </div>

          </div>

          {/* Assessment Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Grading & Assessment Milestones</h3>
                <p className="text-xs text-slate-500">Decomposed into synchronized study blocks with tentative weeks</p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {workflowResult.assessments.length} Key Deliverables
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflowResult.assessments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-orange-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                        {item.type} {item.tentativeWeek ? `(${item.tentativeWeek})` : ''}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {item.weight}% Weight
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-orange-500" /> {item.durationMinutes ? `${item.durationMinutes}m test` : `~${item.estimatedHours}h prep`}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      item.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Dispatcher Hub (Calendar, Tasks, Gmail, Research) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Calendar Card */}
            <div 
              onClick={() => onNavigateTab('calendar')}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Google Calendar Blocks</h4>
                <p className="text-xs text-slate-500">
                  {workflowResult.studyBlocks.length} spaced repetition sessions and 7-hour exam windows scheduled.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-orange-600 pt-2 border-t border-slate-100">
                <span>View & Dispatch Calendar</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Tasks Card */}
            <div 
              onClick={() => onNavigateTab('tasks')}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Google Tasks Board</h4>
                <p className="text-xs text-slate-500">
                  {workflowResult.tasks.length} actionable micro-tasks and problem set checkpoints decomposed.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-2 border-t border-slate-100">
                <span>Open Tasks Board</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Gmail Card */}
            <div 
              onClick={() => onNavigateTab('gmail')}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Gmail Academic Drafter</h4>
                <p className="text-xs text-slate-500">
                  {workflowResult.emailDrafts.length} proactive email drafts ready for professor office hours & Canvas posts.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-amber-600 pt-2 border-t border-slate-100">
                <span>Inspect Gmail Drafts</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Research Card */}
            <div 
              onClick={() => onNavigateTab('research')}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Research Literature Scraper</h4>
                <p className="text-xs text-slate-500">
                  Academic paper quotes, peer-reviewed sources, and BibTeX citations ready for writeups.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-orange-600 pt-2 border-t border-slate-100">
                <span>Scrape Literature</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
