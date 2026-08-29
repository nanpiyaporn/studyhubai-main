import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  MessageSquare,
  User,
  Check,
  RefreshCw,
  Plus
} from 'lucide-react';
import { EmailDraft, UserSession } from '../types';
import { GoogleWorkspaceService } from '../services/googleWorkspace';

interface GmailCommsProps {
  drafts: EmailDraft[];
  session: UserSession | null;
  onUpdateDrafts: (drafts: EmailDraft[]) => void;
  courseCode?: string;
  instructor?: string;
  instructorEmail?: string;
}

export const GmailComms: React.FC<GmailCommsProps> = ({
  drafts,
  session,
  onUpdateDrafts,
  courseCode,
  instructor,
  instructorEmail,
}) => {
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(0);
  const [syncing, setSyncing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPurpose, setCustomPurpose] = useState('office_hours');
  const [customDetails, setCustomDetails] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeDraft = drafts[selectedDraftIndex] || null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateDraftInGmail = async (draft: EmailDraft) => {
    if (!session?.accessToken) return;
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await GoogleWorkspaceService.createGmailDraft(session.accessToken, draft);
      if (res.success) {
        const updated = drafts.map((d, i) =>
          i === selectedDraftIndex ? { ...d, status: 'synced_to_gmail' as const } : d
        );
        onUpdateDrafts(updated);
        setFeedback(`Email draft "${draft.subject}" created in your Gmail account!`);
      }
    } catch (e) {
      console.error(e);
      setFeedback('Failed to create draft in Gmail');
    } finally {
      setSyncing(false);
    }
  };

  const handleGenerateCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/agent/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: customPurpose,
          courseInfo: {
            code: courseCode || 'CS 189',
            instructor: instructor || 'Professor',
            instructorEmail: instructorEmail || 'instructor@university.edu',
          },
          customDetails,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();

      const newDraft: EmailDraft = {
        id: 'draft_' + Date.now(),
        recipient: data.recipient || instructorEmail || 'instructor@university.edu',
        subject: data.subject || `Inquiry regarding ${courseCode}`,
        body: data.body || '',
        purpose: customPurpose as any,
        status: 'draft',
        courseCode: courseCode || 'CS 189',
      };

      onUpdateDrafts([newDraft, ...drafts]);
      setSelectedDraftIndex(0);
      setFeedback('New contextual email generated with Gemini 2.5!');
      setCustomDetails('');
    } catch (e) {
      setFeedback('Failed to generate email');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Mail className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60">
              Gmail Academic Communications
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Proactive Email Dispatcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Auto-composed professional inquiries, office hours reservations, and study group coordination.
          </p>
        </div>

        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Open Gmail</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-orange-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Drafts List & Active Email Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Drafts Selector & Composer Trigger (4 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Quick Generator Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              Compose New Custom Email with AI
            </h3>

            <form onSubmit={handleGenerateCustomEmail} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Intent</label>
                <select
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                >
                  <option value="office_hours">Schedule Office Hours Meeting</option>
                  <option value="rubric_clarification">Clarify Grading Rubric / Question</option>
                  <option value="study_group">Invite Peers to Study Group</option>
                  <option value="extension_request">Polite Slip Day / Extension Request</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Specific Context / Talking Points</label>
                <textarea
                  rows={3}
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  placeholder="e.g. Need clarification on Question 3 in Problem Set 2 regarding Support Vector Kernels..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Composing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Generate Email Draft</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Drafts List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available Drafts ({drafts.length})
            </h3>

            {drafts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No drafts created yet.</p>
            ) : (
              <div className="space-y-2">
                {drafts.map((d, idx) => (
                  <button
                    key={d.id || idx}
                    onClick={() => setSelectedDraftIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      selectedDraftIndex === idx
                        ? 'bg-orange-50/90 border-orange-300 text-orange-950 ring-1 ring-orange-400/30'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        {d.purpose.replace('_', ' ')}
                      </span>
                      {d.status === 'synced_to_gmail' && (
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Queued in Gmail
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{d.subject}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">To: {d.recipient}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Draft Preview & Actions (7 cols) */}
        <div className="lg:col-span-7">
          {activeDraft ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/60">
                    {activeDraft.courseCode} Draft
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2">{activeDraft.subject}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(`${activeDraft.subject}\n\n${activeDraft.body}`)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    id="btn-push-gmail-draft"
                    onClick={() => handleCreateDraftInGmail(activeDraft)}
                    disabled={syncing || activeDraft.status === 'synced_to_gmail'}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeDraft.status === 'synced_to_gmail'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-95 text-white shadow-xs'
                    }`}
                  >
                    {syncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : activeDraft.status === 'synced_to_gmail' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Queued in Gmail</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Create Draft in Gmail</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recipient info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <span className="font-semibold text-slate-500">To:</span>
                <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {activeDraft.recipient}
                </span>
              </div>

              {/* Email Body Content */}
              <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200/80 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {activeDraft.body}
              </div>

              <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/60 flex items-start gap-2.5 text-[11px] text-orange-950">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Autonomous Dispatch Guarantee:</strong> When you click "Create Draft in Gmail", StudyHub AI invokes the Gmail API with your verified Google token and leaves the draft in your mailbox ready for one-click review.
                </p>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No draft selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Select a draft from the left column or generate a new one with Gemini.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
