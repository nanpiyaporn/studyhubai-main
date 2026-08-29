import React, { useState } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  Award, 
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface ActiveRecallArenaProps {
  quizzes: QuizQuestion[];
  courseCode?: string;
}

export const ActiveRecallArena: React.FC<ActiveRecallArenaProps> = ({
  quizzes,
  courseCode,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [aiAssistantQuery, setAiAssistantQuery] = useState('');
  const [aiAssistantReply, setAiAssistantReply] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const currentQuiz = quizzes[currentIndex] || null;

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered

    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));

    if (optIndex === currentQuiz.correctIndex) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }
  };

  const handleAskAssistantForConcept = async () => {
    if (!currentQuiz) return;
    setIsAsking(true);
    setAiAssistantReply(null);
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: aiAssistantQuery || `Can you provide a deep-dive mnemonic explanation for this question: "${currentQuiz.question}"? Topic is ${currentQuiz.topic}.`,
          context: {
            courseCode: courseCode || 'CS 189',
            topic: currentQuiz.topic,
            question: currentQuiz.question,
            explanation: currentQuiz.explanation,
          },
        }),
      });
      const data = await res.json();
      setAiAssistantReply(data.reply);
    } catch (e) {
      setAiAssistantReply('Could not connect to Gemini reasoning engine.');
    } finally {
      setIsAsking(false);
    }
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, chosenIdx]) => {
    const q = quizzes[Number(qIdx)];
    return q && q.correctIndex === chosenIdx ? acc + 1 : acc;
  }, 0);

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Brain className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              Gemini Active Recall Drill
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Concept Verification & Retention
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            High-yield active recall questions synthesized from course themes to test memory retention before exams.
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl flex items-center gap-4 min-w-[200px]">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-900">Drill Score</p>
            <p className="text-lg font-black text-amber-950">
              {score} <span className="text-xs font-normal text-amber-700">/ {quizzes.length} completed</span>
            </p>
          </div>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No active recall drills available yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Run the Taskmaster Agent with a course syllabus to auto-generate diagnostic recall drills.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Question Card (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Question Header & Nav */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                    Question {currentIndex + 1} of {quizzes.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Topic: {currentQuiz.topic}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {quizzes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentIndex === idx
                          ? 'bg-slate-900 text-white'
                          : selectedAnswers[idx] !== undefined
                          ? selectedAnswers[idx] === quizzes[idx].correctIndex
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuiz.question}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3">
                {currentQuiz.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const isAnswered = selectedAnswers[currentIndex] !== undefined;
                  const isCorrect = optIdx === currentQuiz.correctIndex;

                  let btnStyle = 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-400';
                    } else {
                      btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      id={`quiz-opt-${currentIndex}-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm">{option}</span>
                      </div>

                      {isAnswered && (
                        <div className="shrink-0">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {showExplanation[currentIndex] && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Gemini 3.7 Conceptual Explanation:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {currentQuiz.explanation}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  Previous Question
                </button>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(quizzes.length - 1, prev + 1))}
                  disabled={currentIndex === quizzes.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* AI Concept Deep-Dive Assistant (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Need Deeper Clarification?</h4>
                  <p className="text-[11px] text-slate-500">Ask Gemini for a tailored analogy</p>
                </div>
              </div>

              <textarea
                rows={3}
                value={aiAssistantQuery}
                onChange={(e) => setAiAssistantQuery(e.target.value)}
                placeholder="e.g. Explain the intuition behind this with a real-world machine learning analogy..."
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />

              <button
                onClick={handleAskAssistantForConcept}
                disabled={isAsking}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAsking ? 'Thinking with Gemini...' : 'Get AI Concept Breakdown'}
              </button>

              {aiAssistantReply && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-60 overflow-y-auto space-y-2">
                  <p className="font-bold text-indigo-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> StudyHub AI Pedagogical Breakdown:
                  </p>
                  <p className="whitespace-pre-wrap">{aiAssistantReply}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
