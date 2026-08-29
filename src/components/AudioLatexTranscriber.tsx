import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Code, 
  FileText, 
  Layers, 
  RotateCw, 
  Play, 
  Square,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { QuantitativeLectureSection } from '../types';

interface AudioLatexTranscriberProps {
  formulations: QuantitativeLectureSection[];
  courseCode?: string;
}

export const AudioLatexTranscriber: React.FC<AudioLatexTranscriberProps> = ({
  formulations: initialFormulations,
  courseCode,
}) => {
  const [formulations, setFormulations] = useState<QuantitativeLectureSection[]>(
    initialFormulations && initialFormulations.length > 0
      ? initialFormulations
      : [
          {
            id: 'lp-form-1',
            timestamp: 'Lecture 2 (00:14:32 - 00:22:15)',
            topic: 'Linear Programming: Beaver Creek Pottery Production Model',
            spokenSnippet:
              'In this Beaver Creek pottery problem, let x1 be bowls produced per day, x2 be mugs. Total profit is 40 dollars per bowl and 50 dollars per mug. We want to maximize Z = 40x1 + 50x2. Our labor constraint allows up to 40 hours where each bowl takes 1 hour and each mug takes 2 hours. Clay supply is 120 pounds with 4 pounds per bowl and 3 pounds per mug. Both x1 and x2 must be non-negative.',
            latexFormulation: `\\begin{aligned}
\\text{Maximize } Z &= 40x_1 + 50x_2 \\quad (\\text{Total Profit in } \\$) \\\\[6pt]
\\text{Subject to:} \\\\[4pt]
1x_1 + 2x_2 &\\le 40 \\quad (\\text{Labor constraint in hours}) \\\\
4x_1 + 3x_2 &\\le 120 \\quad (\\text{Clay constraint in lbs}) \\\\
x_1, x_2 &\\ge 0 \\quad (\\text{Non-negativity condition})
\\end{aligned}`,
            decisionVariables: [
              { name: 'x_1', description: 'Number of bowls produced per day' },
              { name: 'x_2', description: 'Number of mugs produced per day' },
            ],
            objectiveFunction: '\\max Z = 40x_1 + 50x_2',
            constraints: [
              '1x_1 + 2x_2 \\le 40 \\text{ (Labor hours)}',
              '4x_1 + 3x_2 \\le 120 \\text{ (Clay supply)}',
              'x_1 \\ge 0, x_2 \\ge 0 \\text{ (Non-negativity)}',
            ],
            notes:
              'Optimal basic feasible solution vertex at (x1=24 bowls, x2=8 mugs), yielding maximum profit Z = $1,360/day.',
          },
          {
            id: 'lp-form-2',
            timestamp: 'Lecture 3 (00:31:05 - 00:39:40)',
            topic: 'Sensitivity Analysis & Dual Shadow Price Formulations',
            spokenSnippet:
              'Notice that for the labor constraint, increasing available hours from 40 to 41 increases total profit by 16 dollars. That means the shadow price lambda 1 is 16 dollars per hour of additional labor, valid within the sensitivity range 30 to 60 hours.',
            latexFormulation: `\\begin{aligned}
\\lambda_{\\text{labor}} &= \\frac{\\partial Z^*}{\\partial b_1} = \\$16.00 / \\text{hour} \\\\[6pt]
\\text{Allowable Increase} &= +20\\text{ hours} \\quad (\\text{Up to } b_1 = 60) \\\\
\\text{Allowable Decrease} &= -10\\text{ hours} \\quad (\\text{Down to } b_1 = 30) \\\\[6pt]
\\text{Reduced Cost } c_j - z_j &= 0 \\quad (\\text{for basic variables } x_1, x_2)
\\end{aligned}`,
            decisionVariables: [
              { name: '\\lambda_1', description: 'Dual shadow price for labor capacity resource b_1' },
              { name: '\\lambda_2', description: 'Dual shadow price for clay material resource b_2' },
            ],
            objectiveFunction: '\\min W = 40\\lambda_1 + 120\\lambda_2',
            constraints: [
              '1\\lambda_1 + 4\\lambda_2 \\ge 40 \\text{ (Bowl dual constraint)}',
              '2\\lambda_1 + 3\\lambda_2 \\ge 50 \\text{ (Mug dual constraint)}',
              '\\lambda_1, \\lambda_2 \\ge 0',
            ],
            notes:
              'Shadow prices reflect the marginal economic value of relaxing binding resource constraints.',
          },
        ]
  );

  const [spokenInput, setSpokenInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const samplePresets = [
    {
      label: 'Linear Programming: Desk & Chair Assembly',
      topic: 'LP Maximization: Furniture Production',
      text: 'Let x1 be standard desks and x2 be executive desks. Total profit is 40 dollars for standard and 50 dollars for executive. Carpentry limit is 240 hours where x1 takes 4 hours and x2 takes 3 hours. Finishing takes 2 hours for standard and 1 hour for executive with 100 hours available. Formulate the LP model.',
    },
    {
      label: 'Diet Problem: Cost Minimization',
      topic: 'LP Minimization: Nutrition Blending',
      text: 'We want to minimize total food cost where food 1 costs 38 cents and food 2 costs 42 cents per ounce. Vitamin A requirement is at least 24 units, Vitamin C at least 16 units. Food 1 has 2 units of A and 2 units of C. Food 2 has 3 units of A and 1 unit of C. Find the minimum cost diet.',
    },
    {
      label: 'Monte Carlo Simulation: Demand Uncertainty',
      topic: 'Stochastic Simulation: Lead Time Modeling',
      text: 'In Monte Carlo simulation of lead times, let random variable r be distributed uniformly between 0 and 1. If r is less than 0.3, lead time is 1 day. If between 0.3 and 0.8, lead time is 2 days. Otherwise 3 days.',
    },
  ];

  const handleTranscribe = async (customText?: string, customTopic?: string) => {
    const textToProcess = customText || spokenInput;
    const topicToProcess = customTopic || topicInput || 'Quantitative Operations Modeling';

    if (!textToProcess.trim()) return;

    setIsTranscribing(true);
    try {
      const res = await fetch('/api/agent/transcribe-audio-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenTranscript: textToProcess,
          lectureTopic: topicToProcess,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newSection: QuantitativeLectureSection = {
          id: 'lp-' + Date.now(),
          timestamp: `Live Agent Session (${new Date().toLocaleTimeString()})`,
          topic: data.topic || topicToProcess,
          spokenSnippet: textToProcess,
          latexFormulation: data.latexFormulation || '\\begin{aligned}\\max Z = \\dots\\end{aligned}',
          decisionVariables: data.decisionVariables || [],
          objectiveFunction: data.objectiveFunction || '',
          constraints: data.constraints || [],
          notes: data.solutionSummary || data.markdownSummary || 'Formulation processed by Gemini Agent.',
        };
        setFormulations([newSection, ...formulations]);
        setSpokenInput('');
        setTopicInput('');
      }
    } catch (e) {
      console.error('Transcription error:', e);
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = (latex: string, id: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSpokenInput('Listening... (e.g. Spoken lecture formulation)');
      setTimeout(() => {
        setIsRecording(false);
        setSpokenInput(
          'Let x1 be units of Product A and x2 be units of Product B. Each unit of A yields 30 dollars profit and each unit of B yields 45 dollars. Milling constraint: 3x1 + 2x2 <= 120 hours. Assembly constraint: 1x1 + 2x2 <= 80 hours. Both non-negative.'
        );
        setTopicInput('Linear Programming Optimization: Product Mix');
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-orange-950 to-amber-950 rounded-3xl p-6 sm:p-8 text-white border border-orange-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Agent 3: Quantitative Audio-to-LaTeX Transcriber
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Spoken Lecture to Structured LaTeX Formulator
          </h1>
          <p className="text-sm text-orange-100/90 leading-relaxed">
            Record lecture audio or paste spoken transcripts. The agent isolates <strong className="text-white">Decision Variables</strong>, <strong className="text-white">Objective Functions ($\max Z / \min Z$)</strong>, <strong className="text-white">Inequality Constraints</strong>, and synthesizes publication-grade <strong className="text-white">LaTeX mathematical models</strong> with 1-click clipboard export.
          </p>
        </div>
      </div>

      {/* Audio Ingestion & Live Speech Terminal */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Spoken Audio / Math Lecture Ingestion
            </h2>
            <p className="text-xs text-slate-500">Record spoken equations, drop audio recordings, or load lecture clips</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
              }`}
            >
              {isRecording ? <Square className="w-3.5 h-3.5 fill-white" /> : <Mic className="w-3.5 h-3.5 text-orange-600" />}
              <span>{isRecording ? 'Recording Spoken Math...' : 'Voice Dictate Formula'}</span>
            </button>
          </div>
        </div>

        {/* Preset Clips */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Try 1-Click Operations Management Spoken Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSpokenInput(preset.text);
                  setTopicInput(preset.topic);
                  handleTranscribe(preset.text, preset.topic);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:border-orange-200 border border-slate-200 text-slate-700 font-medium transition-all text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Box */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Spoken Lecture Audio Transcript</label>
              <textarea
                rows={3}
                value={spokenInput}
                onChange={(e) => setSpokenInput(e.target.value)}
                placeholder="e.g. In this linear programming problem, let x1 be bowls and x2 be mugs..."
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-mono"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Lecture Topic / Model Name</label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. Sensitivity & Shadow Price"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={() => handleTranscribe()}
                disabled={isTranscribing || !spokenInput.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isTranscribing ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isTranscribing ? 'Synthesizing LaTeX...' : 'Synthesize LaTeX Model'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Formulations List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-orange-600" />
            Transcribed LaTeX Formulations & Decision Models ({formulations.length})
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Export ready for Overleaf / Canvas
          </span>
        </div>

        <div className="space-y-6">
          {formulations.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200/60">
                    {form.timestamp}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1.5">{form.topic}</h4>
                </div>

                <button
                  onClick={() => copyToClipboard(form.latexFormulation, form.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedId === form.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-300" />}
                  <span>{copiedId === form.id ? 'Copied LaTeX!' : 'Copy LaTeX Code'}</span>
                </button>
              </div>

              {/* Spoken Snippet */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic flex items-start gap-2.5">
                <Volume2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>"{form.spokenSnippet}"</span>
              </div>

              {/* Deconstructed Decision Variables & Constraints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-2">
                  <h5 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                    Decision Variables
                  </h5>
                  <div className="space-y-1.5">
                    {form.decisionVariables.map((v, i) => (
                      <div key={i} className="text-xs text-orange-900 flex items-baseline gap-2">
                        <code className="font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-orange-200 text-orange-700">
                          {v.name}
                        </code>
                        <span>{v.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Objective & Constraints
                  </h5>
                  <div className="text-xs space-y-1">
                    <p className="font-mono text-slate-900 font-bold bg-white p-1.5 rounded-md border border-slate-200">
                      {form.objectiveFunction}
                    </p>
                    <div className="space-y-1 pt-1">
                      {form.constraints.map((c, i) => (
                        <div key={i} className="font-mono text-[11px] text-slate-600 bg-white/70 px-2 py-0.5 rounded-sm">
                          • {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* LaTeX Code Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>LaTeX Formulation Output:</span>
                  <span className="font-mono text-[11px] text-slate-400">amsmath / aligned format</span>
                </div>
                <pre className="p-4 rounded-2xl bg-stone-950 text-orange-200 font-mono text-xs overflow-x-auto leading-relaxed border border-orange-950">
                  {form.latexFormulation}
                </pre>
              </div>

              {/* Solution Summary / Notes */}
              {form.notes && (
                <div className="text-xs text-slate-600 bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-xl">
                  <strong className="text-emerald-900 font-bold">Solution Note: </strong>
                  {form.notes}
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
