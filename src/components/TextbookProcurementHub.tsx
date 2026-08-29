import React, { useState } from 'react';
import { 
  BookOpen, 
  ShoppingCart, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Search, 
  Building2, 
  Layers, 
  Tag,
  Clock,
  RotateCw,
  Award
} from 'lucide-react';
import { TextbookInfo, TextbookProcurementOption } from '../types';

interface TextbookProcurementHubProps {
  textbook: TextbookInfo | null;
  options: TextbookProcurementOption[];
  courseCode?: string;
}

export const TextbookProcurementHub: React.FC<TextbookProcurementHubProps> = ({
  textbook,
  options: initialOptions,
  courseCode,
}) => {
  const [customTitle, setCustomTitle] = useState(
    textbook?.title || 'Introduction to Management Science'
  );
  const [customAuthor, setCustomAuthor] = useState(
    textbook?.author || 'Bernard W. Taylor III'
  );
  const [customEdition, setCustomEdition] = useState(
    textbook?.edition || '13th Edition'
  );
  const [options, setOptions] = useState<TextbookProcurementOption[]>(initialOptions || []);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'commercial'>('all');

  const defaultTaylorOptions: TextbookProcurementOption[] = [
    {
      source: 'University Reserve',
      type: 'library_loan',
      price: 0,
      shipping: 0,
      totalCost: 0,
      format: 'Library Hold',
      url: 'https://libraries.rutgers.edu/course-reserves',
      availability: 'In Stock (Alexander, Carr, and Chang Science Libraries)',
      condition: 'Course Reserve (2-Hour Loan / Free Scanning)',
      bestValueBadge: true,
    },
    {
      source: 'Internet Archive',
      type: 'free_open_access',
      price: 0,
      shipping: 0,
      totalCost: 0,
      format: 'PDF',
      url: 'https://archive.org/details/introductiontomanagementscience',
      availability: 'Instant Digital Access',
      condition: '12th/13th Edition Open Digital Lending',
      bestValueBadge: true,
    },
    {
      source: 'OpenStax',
      type: 'free_open_access',
      price: 0,
      shipping: 0,
      totalCost: 0,
      format: 'eTextbook',
      url: 'https://openstax.org/subjects/business',
      availability: 'Open Access Supplementary Materials',
      condition: 'Digital Open License (Creative Commons)',
      bestValueBadge: false,
    },
    {
      source: 'eBay',
      type: 'commercial_purchase',
      price: 18.50,
      shipping: 3.99,
      totalCost: 22.49,
      format: 'Paperback',
      url: 'https://www.ebay.com/sch/i.html?_nkw=Introduction+to+Management+Science+Taylor+13th',
      availability: '3 copies remaining',
      condition: 'Used - Very Good (No highlighting)',
      bestValueBadge: false,
    },
    {
      source: 'AbeBooks',
      type: 'commercial_purchase',
      price: 24.95,
      shipping: 0.00,
      totalCost: 24.95,
      format: 'Hardcover',
      url: 'https://www.abebooks.com/servlet/SearchResults?kn=Introduction+to+Management+Science+Taylor',
      availability: 'Ships within 24 hours',
      condition: 'Used - Good',
      bestValueBadge: false,
    },
    {
      source: 'Amazon',
      type: 'commercial_purchase',
      price: 64.99,
      shipping: 0.00,
      totalCost: 64.99,
      format: 'eTextbook',
      url: 'https://www.amazon.com/s?k=Introduction+to+Management+Science+Bernard+Taylor',
      availability: 'Instant Kindle / Rental',
      condition: 'Digital Rental (120 Days)',
      bestValueBadge: false,
    },
  ];

  const displayOptions = options.length > 0 ? options : defaultTaylorOptions;

  const filteredOptions = displayOptions.filter((opt) => {
    if (activeFilter === 'free') return opt.type === 'free_open_access' || opt.type === 'library_loan';
    if (activeFilter === 'commercial') return opt.type === 'commercial_purchase';
    return true;
  });

  const handleProcureWithAgent = async () => {
    setIsSearching(true);
    try {
      const res = await fetch('/api/agent/procure-textbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customTitle,
          author: customAuthor,
          edition: customEdition,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.options && data.options.length > 0) {
          setOptions(data.options);
        }
      }
    } catch (e) {
      console.error('Procurement error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const lowestPaid = displayOptions
    .filter((o) => o.totalCost > 0)
    .sort((a, b) => a.totalCost - b.totalCost)[0];

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-orange-950 to-amber-950 rounded-3xl p-6 sm:p-8 text-white border border-orange-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Agent 2: Textbook & Open-Access Procurement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Zero-Cost & Lowest-Price Textbook Hunter
          </h1>
          <p className="text-sm text-orange-100/90 leading-relaxed">
            The agent crawls open repositories (<strong className="text-white">OpenStax, Internet Archive</strong>) and campus course reserves (<strong className="text-white">Alexander, Carr, and Chang Science Libraries</strong>) for $0.00 access. If unavailable, it queries online markets (<strong className="text-white">eBay, Amazon, AbeBooks</strong>) to compute total landed cost (Price + Shipping) with 1-click checkout links.
          </p>
        </div>
      </div>

      {/* Target Textbook Summary & Custom Search Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              {courseCode || '33:136:386'} Primary Required Material
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {textbook?.title || customTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              By <span className="font-semibold text-slate-700">{textbook?.author || customAuthor}</span> • {textbook?.edition || customEdition} • {textbook?.publisher || 'Pearson'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
              Free Library Reserves Available
            </span>
            {lowestPaid && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Marketplace Low: ${lowestPaid.totalCost.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Search / Ingestion Controls for Different Textbooks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Book Title / Search Keywords</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Introduction to Management Science"
              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Author</label>
            <input
              type="text"
              value={customAuthor}
              onChange={(e) => setCustomAuthor(e.target.value)}
              placeholder="e.g. Bernard W. Taylor III"
              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleProcureWithAgent}
              disabled={isSearching}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>{isSearching ? 'Scraping...' : 'Scan Open Repos'}</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter Options:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Sources ({displayOptions.length})
          </button>
          <button
            onClick={() => setActiveFilter('free')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'free'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
            }`}
          >
            Free & Open Access ($0.00)
          </button>
          <button
            onClick={() => setActiveFilter('commercial')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'commercial'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
            }`}
          >
            Lowest-Cost Market Buys
          </button>
        </div>

        {/* Procurement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredOptions.map((opt, idx) => {
            const isFree = opt.totalCost === 0;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative ${
                  opt.bestValueBadge
                    ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {opt.bestValueBadge && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                    <Award className="w-3 h-3" /> Best Value
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {opt.source}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {opt.format}
                    </span>
                  </div>

                  <div className="my-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">
                        {isFree ? '$0.00' : `$${opt.totalCost.toFixed(2)}`}
                      </span>
                      {isFree ? (
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                          (Free Loan / Open Access)
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">
                          (${opt.price.toFixed(2)} + ${opt.shipping.toFixed(2)} ship)
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-700 line-clamp-2">
                    {opt.availability}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Condition: {opt.condition}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isFree
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{isFree ? 'Access Free Copy' : '1-Click Lowest Checkout'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Professor Syllabus Note */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <BookOpen className="w-4 h-4 text-amber-700" /> Syllabus Course Material Policy:
          </div>
          <p>
            {textbook?.notes || 'Reserved copies of "Introduction to Management Science" (Bernard W. Taylor III) are available in Alexander, Carr, and Chang Science libraries. Previous editions (11th, 12th) are fully accepted by Dr. Ely.'}
          </p>
        </div>

      </div>

    </div>
  );
};
