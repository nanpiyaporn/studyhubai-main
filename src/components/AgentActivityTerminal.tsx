import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  X, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Code2, 
  Copy, 
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AgentActionStep } from '../types';

interface AgentActivityTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AgentActionStep[];
}

export const AgentActivityTerminal: React.FC<AgentActivityTerminalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedPayloadId, setCopiedPayloadId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedPayloadId(id);
    setTimeout(() => setCopiedPayloadId(null), 2000);
  };

  return (
    <div id="agent-activity-drawer" className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-950 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <TerminalIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Agent Execution & Telemetry Trace
            </h3>
            <p className="text-[11px] text-slate-400">Gemini 2.5 GenAI SDK Multi-Step Function Dispatch</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Logs Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
        
        {/* System telemetry metadata */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-400">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-orange-400" /> Runtime Environment</span>
            <span className="text-emerald-400">Cloud Run Sandboxed</span>
          </div>
          <div>Core Model: <span className="text-orange-300 font-bold">gemini-3.7-flash (Google GenAI SDK)</span></div>
          <div>Security: <span className="text-slate-300">Server-Side Private API Proxy (/api/agent/*)</span></div>
          <div>OAuth Permissions: <span className="text-slate-300">Calendar (v3), Tasks (v1), Gmail (v1)</span></div>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <TerminalIcon className="w-8 h-8 mx-auto opacity-40" />
            <p>No agent actions recorded yet.</p>
            <p className="text-[10px]">Run the Taskmaster workflow to stream live execution steps.</p>
          </div>
        ) : (
          logs.map((log, idx) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id || idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{log.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <p><span className="text-orange-400 font-semibold">Tool Invoked:</span> <code className="text-orange-200">{log.tool}</code></p>
                  <p><span className="text-slate-400">Reasoning:</span> {log.reasoning}</p>
                  {log.outputSummary && (
                    <p><span className="text-emerald-400">Result:</span> {log.outputSummary}</p>
                  )}
                </div>

                {log.dataPayload && (
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <span>{isExpanded ? 'Hide Payload' : 'Inspect Structured Payload'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 relative p-3 rounded-lg bg-black/80 border border-slate-800 text-[10px] text-emerald-300 overflow-x-auto max-h-48">
                        <button
                          onClick={() => handleCopy(log.id, log.dataPayload)}
                          className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white bg-slate-800 rounded"
                        >
                          {copiedPayloadId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <pre>{JSON.stringify(log.dataPayload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

      </div>

    </div>
  );
};
