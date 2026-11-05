import React, { useState } from 'react';
import { 
  Scale, 
  Sparkles, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Compass, 
  RotateCcw,
  Quote
} from 'lucide-react';
import { DILEMMA_PRESETS, DilemmaPreset } from '../data/artworks';

export const OracleDeliberation: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<DilemmaPreset>(DILEMMA_PRESETS[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [activeResult, setActiveResult] = useState<DilemmaPreset | null>(DILEMMA_PRESETS[0]);

  const handleSelectPreset = (preset: DilemmaPreset) => {
    setSelectedPreset(preset);
    setActiveResult(preset);
    setCustomQuery('');
  };

  const handleConsult = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customQuery.trim() && !selectedPreset) return;

    setIsDeliberating(true);
    setActiveResult(null);

    setTimeout(() => {
      if (customQuery.trim()) {
        // Generate a synthesized Aristotelian phronetic verdict for the custom query
        const synthesized: DilemmaPreset = {
          id: 'custom-' + Date.now(),
          category: 'Custom Deliberation',
          title: customQuery.slice(0, 75) + (customQuery.length > 75 ? '...' : ''),
          context: customQuery,
          deficiency:
            'Apathy & Evasion: Refusing responsibility, succumbing to cynical inaction or paralysis by analysis.',
          goldenMean:
            'Phronetic Equilibrium: Discerning the precise balance between courage and prudence, aligning action with human dignity and long-term eudaimonia.',
          excess:
            'Dogmatic Absolutism: Blind zealotry, forcing extreme ideological solutions without regard for context, nuance, or collateral damage.',
          verdict:
            `Phronesis Prime decrees: True wisdom resides neither in passive retreat nor aggressive zeal. Examine the particular nature of this dilemma: virtue requires acting with courage where justice demands it, tempered by mercy and empirical prudence. Seek not merely to solve the immediate discomfort, but to cultivate enduring moral integrity for all conscious beings involved.`,
          practicalDecree:
            '1. Distinguish between immutable ethical boundaries and flexible tactical adaptations.\n2. Involve those most affected by the outcome in the deliberative circle.\n3. Measure the consequence not by immediate acclaim, but by five-decade societal flourishing.',
          greekQuote: '«Τὸ γὰρ εὖ πράττειν καὶ τὸ καλῶς ζῆν ἐν τῷ κατ’ ἀρετὴν βίῳ ἐστίν.»',
          quoteTranslation: 'For acting well and living nobly consists in a life lived according to virtue.',
        };
        setActiveResult(synthesized);
      } else {
        setActiveResult(selectedPreset);
      }
      setIsDeliberating(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 py-4">
      {/* Oracle Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono">
          <Scale className="w-3.5 h-3.5" />
          THE ORACLE OF PHRONESIS PRIME
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          CONSULT THE <span className="text-sapphire-gradient">COSMIC SOVEREIGN</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Pose your complex moral, strategic, or existential quandaries. The Goddess of Practical Reason dissects the extremes of Deficiency and Excess to reveal the Golden Mean of virtuous action.
        </p>
      </div>

      {/* Preset Conundrums */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            CANONICAL PARADOXES & DILEMMAS
          </span>
          <span className="text-xs font-mono text-amber-400">SELECT TO DELIBERATE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DILEMMA_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id && !customQuery;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/15'
                    : 'border-slate-800 bg-[#090c17] hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-sky-400 block mb-1">
                  {preset.category}
                </span>
                <h4 className="font-cinzel text-sm font-bold text-slate-100 line-clamp-2">
                  {preset.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Query Input */}
      <form onSubmit={handleConsult} className="relative rounded-2xl border border-amber-500/30 bg-[#080b16] p-4 sm:p-6 space-y-4">
        <label className="block text-xs font-mono text-amber-300 tracking-wider">
          OR INSCRIBE YOUR OWN DILEMMA FOR DELIBERATION:
        </label>
        <div className="relative">
          <textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="e.g. A team lead discovers a security vulnerability right before product launch. Delaying ruins the startup; shipping risks user data. How does Phronesis resolve this?"
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-all font-sans"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            Calibrated on Aristotelian Virtue Ethics (Nicomachean Canon)
          </span>

          <button
            type="submit"
            disabled={isDeliberating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-amber-500 hover:from-sky-400 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isDeliberating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>WEIGHING CELESTIAL EQUILIBRIA...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>CONSULT PHRONESIS PRIME</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Deliberation Chamber Output */}
      {activeResult && !isDeliberating && (
        <div className="rounded-2xl border border-sky-500/30 bg-[#090d1c] p-6 sm:p-8 space-y-8 animate-in fade-in duration-500 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-500/15 border border-sky-400/40 text-sky-300">
                SOVEREIGN DELIBERATION RECORD
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                {activeResult.title}
              </h3>
            </div>
            <div className="text-xs font-mono text-amber-300">
              STATUS: HARMONIZED
            </div>
          </div>

          {/* Context */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-xs font-mono text-slate-500 mb-1">THE CONTEXTUAL GROUNDING:</p>
            <p className="text-xs sm:text-sm text-slate-300 italic">{activeResult.context}</p>
          </div>

          {/* The Golden Mean Spectrum Diagram */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              THE SPECTRUM OF EQUILIBRIUM
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Deficiency */}
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  DEFICIENCY (UNDER-REACH)
                </div>
                <p className="text-xs text-rose-200/80 leading-relaxed">
                  {activeResult.deficiency}
                </p>
              </div>

              {/* The Golden Mean */}
              <div className="p-4 rounded-xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-500/15 to-transparent space-y-2 relative shadow-lg shadow-amber-500/10">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  THE GOLDEN MEAN (VIRTUE)
                </div>
                <p className="text-xs text-amber-100 font-medium leading-relaxed">
                  {activeResult.goldenMean}
                </p>
              </div>

              {/* Excess */}
              <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-950/20 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-mono font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  EXCESS (OVER-REACH)
                </div>
                <p className="text-xs text-orange-200/80 leading-relaxed">
                  {activeResult.excess}
                </p>
              </div>
            </div>
          </div>

          {/* Sovereign Verdict */}
          <div className="p-6 rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-[#0d1222] to-slate-950 space-y-3">
            <h4 className="font-cinzel text-base font-bold text-amber-200 flex items-center gap-2">
              <Quote className="w-4 h-4 text-amber-400" />
              THE VERDICT OF PHRONESIS PRIME
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-serif text-base sm:text-lg">
              {activeResult.verdict}
            </p>
          </div>

          {/* Practical Action Steps */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              PRACTICAL DIRECTIVES FOR ACTION
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre-line leading-relaxed">
              {activeResult.practicalDecree}
            </div>
          </div>

          {/* Classical Maxim */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-1">
            <p className="font-cinzel text-sm sm:text-base text-amber-300 tracking-wider">
              {activeResult.greekQuote}
            </p>
            <p className="text-xs text-slate-400 italic">
              {activeResult.quoteTranslation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
