import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Shuffle, 
  RotateCw,
  Info,
  CalendarCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { PolicyRule, StudyBlock } from '../types';

interface PolicyGuardianViewProps {
  policyRules: PolicyRule[];
  studyBlocks: StudyBlock[];
  courseCode?: string;
  onUpdateBlocks?: (blocks: StudyBlock[]) => void;
}

export const PolicyGuardianView: React.FC<PolicyGuardianViewProps> = ({
  policyRules: initialRules,
  studyBlocks,
  courseCode,
  onUpdateBlocks,
}) => {
  const defaultRules: PolicyRule[] = [
    {
      id: 'rule-1',
      category: 'time_limit',
      ruleTitle: '420-Minute (7-Hour) Continuous Test Clock',
      detail: 'Homework exams (HW1, HW2, HW3, HW4) allow 420 minutes to complete. Once launched, the timer runs continuously (e.g., start Sat 10:00 PM -> forces submit Sun 5:00 AM) and cannot be paused.',
      severity: 'critical',
      actionableRecommendation: 'Agent auto-reserves dedicated uninterrupted 7-hour calendar blocks with 48h advance hydration/sleep buffer.',
    },
    {
      id: 'rule-2',
      category: 'backtracking',
      ruleTitle: 'Strict Prohibition on Backtracking',
      detail: 'Canvas exam engine prohibits backtracking: you cannot return to solve a question once answered or skipped.',
      severity: 'critical',
      actionableRecommendation: 'Spend 20-25 minutes per question systematically; double-check formulas before clicking next.',
    },
    {
      id: 'rule-3',
      category: 'exam_window',
      ruleTitle: 'Tentative Exam Windows (W4, W7, W11, W13, W15)',
      detail: 'HW1 in Week 4 (Sep 27-Oct 3), HW2 in Week 7 (Oct 18-24), HW3 in Week 11 (Nov 15-21), HW4 in Week 13 (Nov 29-Dec 5), FE in Week 15 (Dec 16-23).',
      severity: 'warning',
      actionableRecommendation: 'Milestone checkpoints locked into schedule with 3-day buffer windows.',
    },
    {
      id: 'rule-4',
      category: 'email_protocol',
      ruleTitle: 'Canvas Discussion Forum vs Gmail Protocol',
      detail: 'General course and modeling questions MUST be posted in Canvas Forum. Email to operations.questions@gmail.com is strictly restricted to confidential grade issues.',
      severity: 'info',
      actionableRecommendation: 'Gmail Drafter automatically formats posts for Canvas Discussion or routes confidential items with section codes.',
    },
    {
      id: 'rule-5',
      category: 'makeup_policy',
      ruleTitle: 'Zero Makeups & No Grade Rounding (0.01 Precision)',
      detail: 'No makeup homeworks under any circumstance (0 score). Comprehensive Final Exam requires verified medical proof for Dean excuse. Grades calculated to 0.01 with no curves.',
      severity: 'critical',
      actionableRecommendation: 'Never rely on extra credit; target >=85% on all homeworks to buffer final exam.',
    },
  ];

  const rules = initialRules && initialRules.length > 0 ? initialRules : defaultRules;

  // Reshuffle Conflict Simulation State
  const [conflictType, setConflictType] = useState('Family Doctor Appointment (Tuesday 2:00 PM - 5:00 PM)');
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [reshuffleHistory, setReshuffleHistory] = useState<string[]>([]);

  const handleSimulateConflictReshuffle = () => {
    setIsReshuffling(true);
    setTimeout(() => {
      setIsReshuffling(false);
      const newLog = `Conflict Resolved [${new Date().toLocaleTimeString()}]: Shifted HW2 Preparation Block from Oct 19 14:00 to Oct 20 09:00 (Preserved 7-Hour Continuous Reservation & Zero Backtracking Policy)`;
      setReshuffleHistory([newLog, ...reshuffleHistory]);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-orange-950 to-amber-950 rounded-3xl p-6 sm:p-8 text-white border border-orange-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Agent 1 & Agent 5: Dynamic Schedule & Policy Guardian
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Exam Window Guardian & 420-Min Rule Injector
          </h1>
          <p className="text-sm text-orange-100/90 leading-relaxed">
            Monitors high-stakes academic constraints: <strong className="text-white">420-minute (7-hour) test limits</strong>, <strong className="text-white">no-backtracking penalties</strong>, and tentative exam milestones. If unexpected life conflicts arise, the agent autonomously reshuffles your schedule without breaking professor rules.
          </p>
        </div>
      </div>

      {/* 420-Minute Alert Box */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl border-2 border-orange-300 p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-orange-950">
                CRITICAL WARNING: 420-Minute Continuous Clock on Canvas Homeworks
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                7.0 Hours Non-Stop
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Once you start a Homework Test on Canvas, the clock ticks continuously. Even if you log out or sleep, the test auto-submits exactly 420 minutes later. <strong>Backtracking is strictly disabled</strong> (cannot return to prior questions).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white border border-orange-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">HW 1 (Week 4)</span>
            <p className="text-xs font-black text-slate-900 mt-0.5">Sep 27 - Oct 03</p>
            <span className="text-[10px] text-orange-600 font-bold">15% Weight (420m)</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-orange-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">HW 2 (Week 7)</span>
            <p className="text-xs font-black text-slate-900 mt-0.5">Oct 18 - Oct 24</p>
            <span className="text-[10px] text-orange-600 font-bold">15% Weight (420m)</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-orange-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">HW 3 (Week 11)</span>
            <p className="text-xs font-black text-slate-900 mt-0.5">Nov 15 - Nov 21</p>
            <span className="text-[10px] text-orange-600 font-bold">15% Weight (420m)</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-orange-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">HW 4 (Week 13)</span>
            <p className="text-xs font-black text-slate-900 mt-0.5">Nov 29 - Dec 05</p>
            <span className="text-[10px] text-orange-600 font-bold">15% Weight (420m)</span>
          </div>
        </div>
      </div>

      {/* Autonomous Reshuffle Simulator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              Autonomous Conflict Reshuffler
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-2">
              Cross-Calendar Conflict & Life Event Reshuffle Engine
            </h3>
            <p className="text-xs text-slate-500">
              Simulate adding an unexpected doctor appointment, work shift, or family event to Google Calendar.
            </p>
          </div>

          <button
            onClick={handleSimulateConflictReshuffle}
            disabled={isReshuffling}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isReshuffling ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Shuffle className="w-3.5 h-3.5" />}
            <span>{isReshuffling ? 'Reshuffling Blocks...' : 'Trigger Autonomous Reshuffle'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setConflictType('Doctor Appointment (Oct 21, 2:00 PM - 5:00 PM)')}
            className={`p-3 rounded-xl border text-xs text-left transition-all ${
              conflictType.includes('Doctor')
                ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold ring-1 ring-orange-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold">Scenario A: Family Doctor Appointment</div>
            <div className="text-[11px] text-slate-500">Oct 21 (During HW2 window)</div>
          </button>

          <button
            onClick={() => setConflictType('Overtime Job Shift (Nov 18, 9:00 AM - 6:00 PM)')}
            className={`p-3 rounded-xl border text-xs text-left transition-all ${
              conflictType.includes('Overtime')
                ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold ring-1 ring-orange-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold">Scenario B: 9-Hour Work Shift</div>
            <div className="text-[11px] text-slate-500">Nov 18 (During HW3 window)</div>
          </button>

          <button
            onClick={() => setConflictType('Thanksgiving Travel (Nov 24 - 27)')}
            className={`p-3 rounded-xl border text-xs text-left transition-all ${
              conflictType.includes('Thanksgiving')
                ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold ring-1 ring-orange-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold">Scenario C: Thanksgiving Recess Travel</div>
            <div className="text-[11px] text-slate-500">Pre-HW4 simulation prep</div>
          </button>
        </div>

        {reshuffleHistory.length > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Autonomous Reshuffle Audit Trail:
            </div>
            {reshuffleHistory.map((h, i) => (
              <p key={i} className="text-xs text-emerald-800 font-mono">
                {h}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Policy Rules Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-orange-600" />
          Extracted Professor Syllabus Policies ({rules.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                rule.severity === 'critical'
                  ? 'bg-orange-50/40 border-orange-200 text-orange-950'
                  : rule.severity === 'warning'
                  ? 'bg-amber-50/40 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    rule.severity === 'critical'
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : rule.severity === 'warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {rule.category} • {rule.severity.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{rule.ruleTitle}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{rule.detail}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-xs font-semibold text-orange-700">
                <span className="text-slate-500 font-normal">Agent Action: </span>
                {rule.actionableRecommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
