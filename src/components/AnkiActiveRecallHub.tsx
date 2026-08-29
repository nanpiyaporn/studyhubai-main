import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Download, 
  Layers, 
  CheckCircle2, 
  RotateCw, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Repeat, 
  Tag,
  Zap,
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { AnkiCard } from '../types';

interface AnkiActiveRecallHubProps {
  ankiCards: AnkiCard[];
  courseCode?: string;
}

export const AnkiActiveRecallHub: React.FC<AnkiActiveRecallHubProps> = ({
  ankiCards: initialCards,
  courseCode,
}) => {
  const defaultRutgersCards: AnkiCard[] = [
    {
      id: 'anki-1',
      deck: '33:136:386 Operations Management',
      cardType: 'concept',
      front: 'What does a "Shadow Price" (Dual Value) represent in Linear Programming sensitivity analysis?',
      back: 'The change in the optimal objective function value ($Z^*$) per unit increase in the right-hand-side (RHS) of that specific resource constraint, provided the change is within the allowable range of feasibility.',
      latexSnippet: '\\lambda_i = \\frac{\\partial Z^*}{\\partial b_i}',
      tags: ['Sensitivity Analysis', 'Dual Simplex', 'Resource Constraints'],
      easeFactor: 2.5,
      intervalDays: 1,
      dueStatus: 'due_today',
    },
    {
      id: 'anki-2',
      deck: '33:136:386 Operations Management',
      cardType: 'scenario',
      front: 'A company has a carpentry constraint with 240 hours available. In the sensitivity report, the Shadow Price is $16.00 with Allowable Increase of 40 hours. If 20 extra hours are acquired at $10/hour, what is the net gain in profit?',
      back: 'Net Gain = +$120. Explanation: Since +20 hours is within the allowable increase (<= 40), profit increases by 20 * $16 = $320. Subtracting the cost of 20 * $10 = $200 gives net profit increase = $120.',
      latexSnippet: '\\Delta \\text{Net Profit} = 20 \\times (\\$16 - \\$10) = +\\$120',
      tags: ['Problem Solving', 'Sensitivity Report', 'Exam Problem'],
      easeFactor: 2.3,
      intervalDays: 1,
      dueStatus: 'due_today',
    },
    {
      id: 'anki-3',
      deck: '33:136:386 Operations Management',
      cardType: 'formula',
      front: 'State the general algebraic form of a Linear Programming model with $n$ decision variables and $m$ constraints.',
      back: 'Maximize $Z = \\sum_{j=1}^n c_j x_j$ subject to $\\sum_{j=1}^n a_{ij} x_j \\le b_i$ for $i=1,\\dots,m$ and $x_j \\ge 0$ for all $j=1,\\dots,n$.',
      latexSnippet: '\\max Z = \\mathbf{c}^T \\mathbf{x} \\quad \\text{s.t.} \\quad \\mathbf{A}\\mathbf{x} \\le \\mathbf{b}, \\; \\mathbf{x} \\ge \\mathbf{0}',
      tags: ['Linear Programming', 'Matrix Notation', 'Formulas'],
      easeFactor: 2.6,
      intervalDays: 3,
      dueStatus: 'learning',
    },
    {
      id: 'anki-4',
      deck: '33:136:386 Operations Management',
      cardType: 'concept',
      front: 'Why is "Backtracking" prohibited on Dr. Ely\'s online homework exams (HW1-HW4) and what strategy must be used?',
      back: 'Canvas forces sequential question presentation with immediate final answer submission. Strategy: Spend proportionate time on each problem (~20-25 min per question within the 420-min window) and never skip without double-checking calculations.',
      latexSnippet: '\\text{Exam Rule: } 420\\text{ min continuous, } 0\\text{ backtracking}',
      tags: ['Exam Policies', 'Time Management', 'Policy Rules'],
      easeFactor: 2.8,
      intervalDays: 4,
      dueStatus: 'learning',
    },
    {
      id: 'anki-5',
      deck: '33:136:386 Operations Management',
      cardType: 'scenario',
      front: 'When is a constraint considered "Binding" versus "Non-Binding"?',
      back: 'A constraint is BINDING if it holds with equality at the optimal solution (Slack or Surplus = 0, Shadow Price > 0). It is NON-BINDING if Slack/Surplus > 0, which means Shadow Price = $0.00.',
      latexSnippet: '\\text{Binding: } s_i = 0 \\implies \\lambda_i \\ge 0',
      tags: ['Slack and Surplus', 'LP Optimal Vertex'],
      easeFactor: 2.5,
      intervalDays: 1,
      dueStatus: 'due_today',
    },
    {
      id: 'anki-6',
      deck: '33:136:386 Operations Management',
      cardType: 'formula',
      front: 'In Monte Carlo simulation, how is a discrete probability distribution converted into random number intervals?',
      back: 'By calculating Cumulative Probabilities $F(x) = \\sum P(X \\le x)$ and assigning uniform random numbers $r \\in [0, 1)$ corresponding to each cumulative interval range.',
      latexSnippet: 'r \\in [F(x_{k-1}), F(x_k)) \\implies X = x_k',
      tags: ['Monte Carlo', 'Simulation', 'Probability Intervals'],
      easeFactor: 2.4,
      intervalDays: 2,
      dueStatus: 'learning',
    },
  ];

  const [cards, setCards] = useState<AnkiCard[]>(
    initialCards && initialCards.length > 0 ? initialCards : defaultRutgersCards
  );

  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  const currentCard = cards[currentCardIndex] || cards[0];

  const handleGenerateMoreCards = async () => {
    if (!customTopic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/agent/generate-anki-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: courseCode || '33:136:386',
          topic: customTopic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          setCards([...cards, ...data.cards]);
          setCustomTopic('');
        }
      }
    } catch (e) {
      console.error('Anki generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportAnkiFile = () => {
    // Generate standard Anki TSV format (Front \t Back \t Tags)
    const tsvContent = cards
      .map((c) => `${c.front.replace(/\t/g, ' ')}\t${c.back.replace(/\t/g, ' ')} [Formula: ${c.latexSnippet || ''}]\t${c.tags.join(' ')}`)
      .join('\n');

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${courseCode || 'StudyHub'}_Anki_Deck.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyAnkiText = () => {
    const tsvContent = cards
      .map((c) => `${c.front}\t${c.back} [Formula: ${c.latexSnippet || ''}]\t${c.tags.join(' ')}`)
      .join('\n');
    navigator.clipboard.writeText(tsvContent);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
      setStudyMode(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Agent 4: Adaptive Active Recall & Formula Driller
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Anki Flashcard Deck & Spaced Repetition Engine
          </h1>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Ingests lecture formulations and exam scenarios to build <strong className="text-white">Anki-compatible (.apkg / TSV) decks</strong>. Drills quantitative decision variables, dual simplex formulations, shadow price calculations, and testing policies for permanent memory retention.
          </p>
        </div>
      </div>

      {/* Action Bar & Deck Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {courseCode || '33:136:386'} Master Deck
              </span>
              <span className="text-xs font-bold text-slate-500">
                {cards.length} Total Flashcards
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Adaptive Spaced Repetition Arena
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setStudyMode(true);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Flashcard Drill</span>
            </button>

            <button
              onClick={handleExportAnkiFile}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Anki (.txt / .apkg)</span>
            </button>

            <button
              onClick={handleCopyAnkiText}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedExport ? 'Copied!' : 'Copy TSV'}</span>
            </button>
          </div>
        </div>

        {/* Generate Custom Deck with Gemini */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Generate flashcards for a specific topic (e.g. Monte Carlo, Sensitivity, Simplex)..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleGenerateMoreCards}
            disabled={isGenerating || !customTopic.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            <span>{isGenerating ? 'Synthesizing...' : 'Synthesize Anki Cards'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Flip-Card Study Mode */}
      {studyMode ? (
        <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-10 shadow-lg space-y-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              onClick={() => setStudyMode(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Drill Mode
            </button>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Card {currentCardIndex + 1} of {cards.length}
            </span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="min-h-[260px] p-8 rounded-3xl bg-gradient-to-b from-slate-50 to-white border-2 border-dashed border-amber-300/80 flex flex-col justify-between items-center text-center cursor-pointer hover:border-amber-400 transition-all select-none"
          >
            <div className="w-full flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase">
              <span>Type: {currentCard.cardType}</span>
              <span>Click to {isFlipped ? 'Show Front' : 'Flip Answer'}</span>
            </div>

            <div className="my-6 max-w-2xl space-y-4">
              {!isFlipped ? (
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {currentCard.front}
                  </h3>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                    {currentCard.back}
                  </p>
                  {currentCard.latexSnippet && (
                    <div className="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs overflow-x-auto inline-block border border-slate-800">
                      {currentCard.latexSnippet}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {currentCard.tags.map((t, i) => (
                <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Anki SM-2 Spaced Repetition Response Buttons */}
          {isFlipped && (
            <div className="space-y-3 pt-2 animate-in fade-in">
              <span className="block text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rate Knowledge Retention (SM-2 Algorithm):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleRating('again')}
                  className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-extrabold transition-all text-center cursor-pointer"
                >
                  <div>Again</div>
                  <div className="text-[10px] font-medium text-rose-600">&lt; 10 min</div>
                </button>
                <button
                  onClick={() => handleRating('hard')}
                  className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-extrabold transition-all text-center cursor-pointer"
                >
                  <div>Hard</div>
                  <div className="text-[10px] font-medium text-amber-600">1 day</div>
                </button>
                <button
                  onClick={() => handleRating('good')}
                  className="p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-extrabold transition-all text-center cursor-pointer"
                >
                  <div>Good</div>
                  <div className="text-[10px] font-medium text-orange-600">3 days</div>
                </button>
                <button
                  onClick={() => handleRating('easy')}
                  className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-extrabold transition-all text-center cursor-pointer"
                >
                  <div>Easy</div>
                  <div className="text-[10px] font-medium text-emerald-600">7 days</div>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Card Browser Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {card.cardType}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Card #{idx + 1}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {card.front}
                </h4>

                <p className="text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-slate-100 line-clamp-3 leading-relaxed">
                  {card.back}
                </p>

                {card.latexSnippet && (
                  <div className="mt-2 text-[11px] font-mono text-orange-700 bg-orange-50/70 px-2.5 py-1 rounded-md border border-orange-100 truncate">
                    {card.latexSnippet}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                {card.tags.map((t, i) => (
                  <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
