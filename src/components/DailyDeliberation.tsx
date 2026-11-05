import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Quote as QuoteIcon, 
  ExternalLink, 
  RotateCw, 
  BookOpen, 
  Check, 
  Copy, 
  Globe, 
  Search, 
  Volume2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { GroundedQuote } from '../types/deliberation';

export const DailyDeliberation: React.FC = () => {
  const [quoteData, setQuoteData] = useState<GroundedQuote | null>(null);
  const [allQuotes, setAllQuotes] = useState<GroundedQuote[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [showContext, setShowContext] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<string>('grounded');

  // Available deliberation themes
  const THEMES = [
    { label: 'All Themes', value: '' },
    { label: 'Practical Wisdom (Phronesis)', value: 'Practical Wisdom' },
    { label: 'The Golden Mean (Mesotes)', value: 'Golden Mean' },
    { label: 'Human Flourishing (Eudaimonia)', value: 'Flourishing' },
    { label: 'Equitable Justice (Epieikeia)', value: 'Equitable Justice' },
    { label: 'Courage & Andreia', value: 'Courage' },
    { label: 'Noble Friendship (Philia)', value: 'Friendship' },
  ];

  const fetchQuote = async (theme = selectedTheme) => {
    setIsLoading(true);
    try {
      const url = theme
        ? `/api/daily-deliberation?theme=${encodeURIComponent(theme)}`
        : '/api/daily-deliberation';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setQuoteData(json.data);
        setSourceType(json.source || 'grounded');
        if (json.allQuotes && Array.isArray(json.allQuotes)) {
          setAllQuotes(json.allQuotes);
        }
      }
    } catch (err) {
      console.error('Failed to fetch daily deliberation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleSelectTheme = (themeVal: string) => {
    setSelectedTheme(themeVal);
    fetchQuote(themeVal);
  };

  const handleNextQuote = () => {
    if (allQuotes.length > 0) {
      const nextIndex = (currentIndex + 1) % allQuotes.length;
      setCurrentIndex(nextIndex);
      setQuoteData(allQuotes[nextIndex]);
    } else {
      fetchQuote();
    }
  };

  const handleCopyCitation = () => {
    if (!quoteData) return;
    const textToCopy = `"${quoteData.quote}"\n${quoteData.originalGreek}\n— Aristotle, ${quoteData.sourceWork} ${quoteData.bekkerNumber}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  const playHarmonicChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const freqs = [329.63, 440.0, 554.37, 659.25]; // E major celestial chord
      const now = ctx.currentTime;
      
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.08 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + 2.2);
      });
    } catch {
      // Audio fallback
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 text-left">
      <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#0e1224]/90 via-[#0a0d1a]/95 to-[#060812] shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Glowing Top Ambient Line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-amber-500/15 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300">
              <QuoteIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs font-bold text-amber-200 tracking-wider">
                  DAILY ARISTOTELIAN DELIBERATION
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-[9px] font-mono text-sky-300 flex items-center gap-1">
                  <Search className="w-2.5 h-2.5" />
                  GROUNDED CITATIONS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Original ancient Greek text & practical counsel grounded in the Aristotelian corpus
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={playHarmonicChime}
              title="Play Dorian Deliberation Chime"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition-all text-xs flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono hidden md:inline">CHIME</span>
            </button>

            <button
              onClick={handleCopyCitation}
              title="Copy quote and citation"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition-all text-xs flex items-center gap-1 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-mono hidden md:inline">
                {isCopied ? 'COPIED' : 'CITATION'}
              </span>
            </button>

            <button
              onClick={handleNextQuote}
              disabled={isLoading}
              title="Cycle to Next Unique Deliberation"
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/40 hover:bg-amber-500/25 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-[11px]">FETCH NEXT</span>
            </button>
          </div>
        </div>

        {/* Theme Pills */}
        <div className="px-5 py-2.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">FILTER:</span>
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.value;
            return (
              <button
                key={theme.value}
                onClick={() => handleSelectTheme(theme.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {theme.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-amber-300/80 tracking-wider">
                COMMUNING WITH ARISTOTELIAN CANON & GROUNDING WEB SOURCES...
              </p>
            </div>
          ) : quoteData ? (
            <>
              {/* Greek Original Text Banner */}
              <div className="relative p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
                  ORIGINAL ATTIC GREEK · ΑΥΘΕΝΤΙΚΟ ΚΕΙΜΕΝΟ
                </span>
                <p className="font-cinzel text-base sm:text-lg text-amber-100 tracking-wide font-medium leading-relaxed italic">
                  {quoteData.originalGreek}
                </p>
              </div>

              {/* English Translation */}
              <div className="space-y-3">
                <blockquote className="font-serif text-lg sm:text-2xl text-slate-100 leading-relaxed tracking-normal font-light">
                  &ldquo;{quoteData.quote}&rdquo;
                </blockquote>

                {/* Author & Bekker Citation */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="font-cinzel font-bold text-amber-300">ARISTOTLE</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-cinzel text-slate-300 italic">{quoteData.sourceWork}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-amber-400/90 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {quoteData.bekkerNumber}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-mono text-sky-400">
                    Theme: {quoteData.theme}
                  </span>
                </div>
              </div>

              {/* Phronesis Prime Reflection */}
              <div className="p-4 rounded-xl border border-sky-500/25 bg-gradient-to-r from-sky-950/30 via-slate-950 to-slate-950 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-cinzel text-xs font-bold text-sky-300 uppercase tracking-wider">
                    Sovereign Reflection from Phronesis Prime
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {quoteData.phroneticReflection}
                </p>
              </div>

              {/* Expandable Context & Google Search Grounding Section */}
              <div className="space-y-3 pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => setShowContext(!showContext)}
                  className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>PHILOSOPHICAL CONTEXT & GROUNDING EVIDENCE</span>
                  </span>
                  {showContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showContext && (
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block mb-1">
                        HISTORICAL PASSAGE ANALYSIS:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {quoteData.context}
                      </p>
                    </div>

                    {/* Google Search Grounding Citations */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-sky-400 flex items-center gap-1.5 font-bold">
                          <Globe className="w-3 h-3 text-sky-400" />
                          VERIFIED GROUNDING CITATIONS:
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          EXTERNAL ACADEMIC CORPUS
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quoteData.groundingSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-sky-400/50 transition-all flex items-start justify-between gap-2 group/link"
                          >
                            <span className="text-[11px] font-sans text-slate-300 group-hover/link:text-sky-300 line-clamp-1">
                              {source.title}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover/link:text-sky-400 shrink-0 mt-0.5" />
                          </a>
                        ))}
                      </div>

                      {quoteData.searchQueries && quoteData.searchQueries.length > 0 && (
                        <div className="pt-2 text-[10px] font-mono text-slate-500">
                          <span>Grounding Search Queries: </span>
                          <span className="text-slate-400 italic">
                            {quoteData.searchQueries.join(' • ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
