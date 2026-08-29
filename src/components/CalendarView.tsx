import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { StudyBlock, UserSession } from '../types';
import { GoogleWorkspaceService } from '../services/googleWorkspace';

interface CalendarViewProps {
  studyBlocks: StudyBlock[];
  session: UserSession | null;
  onUpdateBlock: (updatedBlock: StudyBlock) => void;
  courseCode?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  studyBlocks,
  session,
  onUpdateBlock,
  courseCode,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const techniques = ['all', 'Active Recall', 'Spaced Repetition', 'Practice Problems', 'Deep Work', 'Syllabus Review'];

  const filteredBlocks = studyBlocks.filter((b) => {
    if (selectedTechnique !== 'all' && b.technique !== selectedTechnique) return false;
    return true;
  });

  const handleSyncBlock = async (block: StudyBlock) => {
    if (!session?.accessToken) return;
    setSyncingId(block.id);
    setFeedback(null);
    try {
      const res = await GoogleWorkspaceService.createCalendarEvent(session.accessToken, block);
      if (res.success) {
        onUpdateBlock({
          ...block,
          syncedToGoogleCalendar: true,
          gcalEventId: res.eventId,
        });
        setFeedback(`"${block.title}" successfully dispatched to Google Calendar!`);
      }
    } catch (e) {
      console.error(e);
      setFeedback('Failed to sync event to Google Calendar');
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60">
              Google Calendar Dispatcher
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Spaced Repetition Study Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            AI-orchestrated study blocks positioned at optimal cognitive intervals ahead of course milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
          >
            <span>Open Google Calendar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 pl-1">
          <Filter className="w-3.5 h-3.5" /> Filter by Strategy:
        </span>
        {techniques.map((tech) => (
          <button
            key={tech}
            onClick={() => setSelectedTechnique(tech)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              selectedTechnique === tech
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {tech === 'all' ? 'All Strategies' : tech}
          </button>
        ))}
      </div>

      {/* Study Blocks List / Schedule Grid */}
      {filteredBlocks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No study blocks planned yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Run the Taskmaster Agent from the main tab with your course syllabus to generate your spaced schedule.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlocks.map((block) => (
            <div
              key={block.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                block.syncedToGoogleCalendar
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-orange-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                    {block.courseCode}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {block.technique}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{block.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">Topic: {block.topic}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-orange-500" /> {block.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-500" /> {block.startTime} - {block.endTime}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {block.syncedToGoogleCalendar ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Check className="w-3.5 h-3.5" /> Synced to Google Calendar
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Not synced yet</span>
                  )}

                  <button
                    id={`btn-sync-block-${block.id}`}
                    onClick={() => handleSyncBlock(block)}
                    disabled={syncingId === block.id || block.syncedToGoogleCalendar}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      block.syncedToGoogleCalendar
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-95 text-white shadow-xs'
                    }`}
                  >
                    {syncingId === block.id ? 'Syncing...' : block.syncedToGoogleCalendar ? 'Synced' : 'Push to Calendar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
