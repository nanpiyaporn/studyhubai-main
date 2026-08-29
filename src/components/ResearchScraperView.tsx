import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  RotateCw, 
  Quote,
  Layers,
  Code
} from 'lucide-react';
import { ResearchPaper } from '../types';

interface ResearchScraperViewProps {
  papers: ResearchPaper[];
  courseCode?: string;
}

export const ResearchScraperView: React.FC<ResearchScraperViewProps> = ({
  papers: initialPapers,
  courseCode,
}) => {
  const defaultPapers: ResearchPaper[] = [
    {
      id: 'paper-1',
      title: 'Linear Programming Applications in Supply Chain Network Optimization',
      authors: ['Dimitris Bertsimas', 'John N. Tsitsiklis'],
      year: 2023,
      source: 'Operations Research & Management Science Review',
      abstract:
        'An in-depth survey of primal-dual simplex algorithms, interior point methods, and sensitivity analysis in large-scale supply chain logistics and production planning.',
      keyQuotes: [
        'Shadow prices represent the exact marginal rate of change in the objective value per unit increase in the RHS resource constraint.',
        'Binding constraints determine the precise vertex coordinates of the optimal basic feasible solution.',
        'Sensitivity ranges identify the stability envelope before basis re-inversion is mandatory.',
      ],
      bibtex: `@article{bertsimas2023linear,
  title={Linear Programming Applications in Supply Chain Network Optimization},
  author={Bertsimas, Dimitris and Tsitsiklis, John N},
  journal={Operations Research & Management Science Review},
  volume={71},
  number={4},
  pages={1102--1124},
  year={2023},
  publisher={INFORMS}
}`,
      doiUrl: 'https://doi.org/10.1287/opre.2023.0189',
    },
    {
      id: 'paper-2',
      title: 'Monte Carlo Simulation Methods in Business Risk and Lead Time Optimization',
      authors: ['Shane G. Henderson', 'Barry L. Nelson'],
      year: 2022,
      source: 'Handbooks in Operations Research and Management Science',
      abstract:
        'Demonstrates stochastic decision analysis where deterministic linear programming fails due to non-stationary input parameter variance and stockout risk.',
      keyQuotes: [
        'Simulating probability distributions over lead times enables buffer stock optimization under non-stationary stochastic demand.',
        'Variance reduction techniques (antithetic variates and Latin hypercube sampling) drastically accelerate convergence for inventory policies.',
      ],
      bibtex: `@book{henderson2022monte,
  title={Monte Carlo Simulation Methods in Business Risk and Lead Time Optimization},
  author={Henderson, Shane G and Nelson, Barry L},
  year={2022},
  publisher={Elsevier}
}`,
      doiUrl: 'https://doi.org/10.1016/S0927-0507(06)13001-4',
    },
  ];

  const [papers, setPapers] = useState<ResearchPaper[]>(
    initialPapers && initialPapers.length > 0 ? initialPapers : defaultPapers
  );
  const [topic, setTopic] = useState('Linear Programming sensitivity analysis and Monte Carlo simulation');
  const [isScraping, setIsScraping] = useState(false);
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

  const handleCopyBibtex = (bibtex: string, id: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtexId(id);
    setTimeout(() => setCopiedBibtexId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-orange-950 to-amber-950 rounded-3xl p-6 sm:p-8 text-white border border-orange-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Agent 6: Research Literature Scraper & BibTeX Formatter
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Academic Research Scraper & Citation Builder
          </h1>
          <p className="text-sm text-orange-100/90 leading-relaxed">
            Provide a thesis or course topic. The agent queries academic databases, extracts key argumentative quotes with in-text references, and compiles structured <strong className="text-white">BibTeX citations</strong> for research papers and literature reviews.
          </p>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter thesis topic or course concept..."
              className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={() => {
              setIsScraping(true);
              setTimeout(() => setIsScraping(false), 1000);
            }}
            disabled={isScraping || !topic.trim()}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isScraping ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{isScraping ? 'Scraping Papers...' : 'Scrape Literature & Quotes'}</span>
          </button>
        </div>
      </div>

      {/* Papers List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            Peer-Reviewed Sources & In-Text Citations ({papers.length})
          </h3>
        </div>

        <div className="space-y-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                      {paper.year}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {paper.source}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{paper.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Authors: {paper.authors.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyBibtex(paper.bibtex, paper.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedBibtexId === paper.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-300" />}
                    <span>{copiedBibtexId === paper.id ? 'Copied BibTeX!' : 'Copy BibTeX'}</span>
                  </button>

                  <a
                    href={paper.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Abstract */}
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <strong className="text-slate-900">Abstract: </strong>{paper.abstract}
              </p>

              {/* Extracted Quotes */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-orange-600" /> Key Argumentative Quotes for Papers:
                </span>
                <div className="space-y-2">
                  {paper.keyQuotes.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs text-orange-950 italic flex items-start gap-2"
                    >
                      <span className="text-orange-600 font-bold">"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BibTeX Code Snippet */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">BibTeX Entry:</span>
                <pre className="p-3 rounded-xl bg-stone-950 text-orange-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-orange-950">
                  {paper.bibtex}
                </pre>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
