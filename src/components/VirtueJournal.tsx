import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  AlertTriangle,
  Download,
  Lightbulb
} from 'lucide-react';

export interface VirtueEntry {
  id: string;
  date: string;
  actionTitle: string;
  description: string;
  virtue: string;
  greekVirtue: string;
  deficiencyAvoided: string;
  excessAvoided: string;
  phronesisRating: number; // 1 to 5
}

const ARISTOTELIAN_VIRTUES = [
  { name: 'Practical Wisdom (Phronesis)', greek: 'Φρόνησις', icon: '🧠', desc: 'Discerning right action in uncertain situations' },
  { name: 'Courage & Fortitude (Andreia)', greek: 'Ἀνδρεία', icon: '🛡️', desc: 'Acting rightly despite fear or opposition' },
  { name: 'Equitable Justice (Epieikeia)', greek: 'Ἐπιείκεια', icon: '⚖️', desc: 'Rectifying rigid rules with human equity' },
  { name: 'Temperance & Self-Mastery (Sophrosyne)', greek: 'Σωφροσύνη', icon: '🌿', desc: 'Balancing appetites and emotional impulses' },
  { name: 'Patience & Gentle Composure (Praotes)', greek: 'Πραότης', icon: '🌊', desc: 'Measured calmness instead of rage or apathy' },
  { name: 'Noble Generosity (Eleutheriotes)', greek: 'Ἐλευθεριότης', icon: '✨', desc: 'Giving and receiving in fitting proportion' },
  { name: 'Truthfulness & Integrity (Aletheia)', greek: 'Ἀλήθεια', icon: '💎', desc: 'Honest presentation without deceit or boastfulness' },
  { name: 'Greatness of Soul (Megalopsychia)', greek: 'Μεγαλοψυχία', icon: '👑', desc: 'Noble ambition dedicated to the collective good' },
];

const INITIAL_ENTRIES: VirtueEntry[] = [
  {
    id: 'entry-1',
    date: 'Today · 08:30 AM',
    actionTitle: 'Advocated for fair allocation during team sprint planning',
    description:
      'A junior colleague was assigned double the architectural workload with zero buffer. I intervened constructively to redistribute tasks according to actual capacity rather than staying silent.',
    virtue: 'Equitable Justice (Epieikeia)',
    greekVirtue: 'Ἐπιείκεια',
    deficiencyAvoided: 'Silent Complacency: Ignoring unfair burdens out of desire to avoid conflict.',
    excessAvoided: 'Hostile Accusation: Aggressively blaming the manager and escalating tension.',
    phronesisRating: 5,
  },
  {
    id: 'entry-2',
    date: 'Yesterday · 04:15 PM',
    actionTitle: 'Paused 10 minutes before replying to an adversarial email',
    description:
      'Received an abrasive message questioning project integrity. Instead of firing back with defensive sarcasm, I stepped away, focused on the underlying operational constraint, and replied with objective facts.',
    virtue: 'Patience & Gentle Composure (Praotes)',
    greekVirtue: 'Πραότης',
    deficiencyAvoided: 'Spiteful Retaliation: Lashing out with sarcastic escalation.',
    excessAvoided: 'Meek Submission: Accepting false accusations without clarifying reality.',
    phronesisRating: 4,
  },
  {
    id: 'entry-3',
    date: '2 Days Ago · 02:00 PM',
    actionTitle: 'Transparently disclosed an early bug before client release',
    description:
      'Discovered an edge-case data inconsistency. Rather than hoping it went unnoticed, I brought it to stakeholders with a verified fix and an updated delivery timeline.',
    virtue: 'Truthfulness & Integrity (Aletheia)',
    greekVirtue: 'Ἀλήθεια',
    deficiencyAvoided: 'Deceptive Concealment: Hiding defects to look competent.',
    excessAvoided: 'Catastrophizing Panic: Causing unwarranted chaos and alarm.',
    phronesisRating: 5,
  },
];

const PROMPTS = [
  'Where did you encounter tension between honesty and kindness today? How did you calibrate them?',
  'Did you resist an impulse toward instant gratification or anger? What was the Golden Mean?',
  'Where did you choose the harder right over the easier wrong today?',
  'How did you exercise equity when rigid rules fell short of human dignity?',
];

export const VirtueJournal: React.FC = () => {
  // Local state with localStorage persistence
  const [entries, setEntries] = useState<VirtueEntry[]>(() => {
    try {
      const saved = localStorage.getItem('phronesis_virtue_journal');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_ENTRIES;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  // Form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVirtueObj, setSelectedVirtueObj] = useState(ARISTOTELIAN_VIRTUES[0]);
  const [deficiency, setDeficiency] = useState('');
  const [excess, setExcess] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    try {
      localStorage.setItem('phronesis_virtue_journal', JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newEntry: VirtueEntry = {
      id: 'virtue-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      actionTitle: title.trim(),
      description: description.trim(),
      virtue: selectedVirtueObj.name,
      greekVirtue: selectedVirtueObj.greek,
      deficiencyAvoided: deficiency.trim() || 'Passive withdrawal or cowardice',
      excessAvoided: excess.trim() || 'Reckless overreach or dogmatic aggression',
      phronesisRating: rating,
    };

    setEntries([newEntry, ...entries]);
    // Reset form
    setTitle('');
    setDescription('');
    setDeficiency('');
    setExcess('');
    setRating(5);
    setIsFormOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  // Calculate Phronesis Development Metrics
  const totalScore = entries.reduce((acc, curr) => acc + curr.phronesisRating, 0);
  const averageRating = entries.length > 0 ? (totalScore / entries.length).toFixed(1) : '0';

  const getRank = (count: number) => {
    if (count >= 15) return { title: 'Phronetic Archon (Φρόνιμος)', level: 'Tier IV · Master Sage', color: 'text-amber-300 border-amber-400' };
    if (count >= 8) return { title: 'Athenian Practitioner', level: 'Tier III · Advanced', color: 'text-sky-300 border-sky-400' };
    if (count >= 3) return { title: 'Virtue Apprentice', level: 'Tier II · Developing', color: 'text-emerald-300 border-emerald-400' };
    return { title: 'Initiate of the Agora', level: 'Tier I · Novice', color: 'text-slate-300 border-slate-400' };
  };

  const rank = getRank(entries.length);

  const filteredEntries = selectedFilter === 'All'
    ? entries
    : entries.filter((e) => e.virtue.includes(selectedFilter));

  const cyclePrompt = () => {
    setActivePromptIndex((prev) => (prev + 1) % PROMPTS.length);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300 text-left">
      {/* Journal Overview & Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Current Rank */}
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#0c1022] to-[#070914] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 shadow-lg shadow-amber-500/10">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              PHRONESIS ATTAINMENT
            </span>
            <h4 className="font-cinzel text-base font-bold text-white line-clamp-1">
              {rank.title}
            </h4>
            <span className="text-xs font-mono text-amber-400/90">{rank.level}</span>
          </div>
        </div>

        {/* Metric 2: Actions Logged */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#080b18] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              ACTIONS RECORDED
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-cinzel text-2xl font-black text-white">{entries.length}</span>
              <span className="text-xs text-slate-400 font-mono">Habituated Deeds</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">« Ἡ δ’ ἠθικὴ ἐξ ἔθους » (Virtue from habit)</p>
          </div>
        </div>

        {/* Metric 3: Golden Mean Precision */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#080b18] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              AVERAGE EQUILIBRIUM
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-cinzel text-2xl font-black text-emerald-300">{averageRating}</span>
              <span className="text-xs text-slate-400 font-mono">/ 5.0 (Mesotes)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Balance between extremes</p>
          </div>
        </div>
      </div>

      {/* Philosophical Contemplation Prompt Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/25 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
              DAILY CONTEMPLATION PROMPT · ΣΤΟΧΑΣΜΟΣ
            </span>
            <p className="text-xs sm:text-sm text-slate-200 italic mt-0.5">
              &ldquo;{PROMPTS[activePromptIndex]}&rdquo;
            </p>
          </div>
        </div>
        <button
          onClick={cyclePrompt}
          className="px-3 py-1.5 rounded-lg border border-amber-400/30 hover:bg-amber-500/20 text-[11px] font-mono text-amber-300 transition-colors shrink-0 cursor-pointer"
        >
          CYCLE PROMPT
        </button>
      </div>

      {/* Control Bar: Add Entry + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>RECORD VIRTUE ACTION</span>
          </button>
        </div>

        {/* Filter by Virtue */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">FILTER:</span>
          {['All', 'Justice', 'Courage', 'Temperance', 'Patience', 'Integrity'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === f
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* New Action Form Modal / Drawer */}
      {isFormOpen && (
        <form
          onSubmit={handleAddEntry}
          className="p-6 sm:p-7 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#0e1222] to-[#070914] shadow-2xl space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                INSCRIBE PRACTICAL VIRTUE DEED
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Examine your deliberate choice between deficiency and excess
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
            >
              CANCEL
            </button>
          </div>

          {/* Action Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">
              1. What concrete action or decision did you make today?
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Navigated a client disagreement with measured transparency"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/60 font-sans"
            />
          </div>

          {/* Description & Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">
              2. Describe the context & deliberation:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was at stake? How did you apply practical reason (phronesis) instead of reacting on impulse?"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/60 font-sans"
            />
          </div>

          {/* Virtue Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 block">
              3. Primary Aristotelian Virtue Cultivated:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {ARISTOTELIAN_VIRTUES.map((v) => {
                const isSelected = selectedVirtueObj.name === v.name;
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVirtueObj(v)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span>{v.icon}</span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">{v.greek}</span>
                    </div>
                    <p className="text-xs font-cinzel font-bold line-clamp-1">{v.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{v.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Golden Mean Analysis: Deficiency vs Excess Avoided */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/15">
              <label className="text-xs font-mono text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Deficiency Avoided (Under-reach / Inaction)
              </label>
              <input
                type="text"
                value={deficiency}
                onChange={(e) => setDeficiency(e.target.value)}
                placeholder="e.g. Silence, cynical avoidance, apathy"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-400/50"
              />
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl border border-orange-500/20 bg-orange-950/15">
              <label className="text-xs font-mono text-orange-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Excess Avoided (Over-reach / Fanaticism)
              </label>
              <input
                type="text"
                value={excess}
                onChange={(e) => setExcess(e.target.value)}
                placeholder="e.g. Dogmatic anger, impulsive escalation"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50"
              />
            </div>
          </div>

          {/* Phronesis Rating Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">4. Moral Equilibrium / Golden Mean Rating:</span>
              <span className="text-amber-300 font-bold">{rating} / 5 Stars (Mesotes)</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>COMMIT TO CODEX</span>
            </button>
          </div>
        </form>
      )}

      {/* Logged Entries Timeline List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800/80 bg-slate-950/40 space-y-3">
            <BookMarked className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="font-cinzel text-base text-slate-300">No Deeds Recorded Under This Filter</h4>
            <p className="text-xs text-slate-500 font-mono">
              Record your actions or select &lsquo;All&rsquo; to review your habituated virtues.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-slate-800/80 bg-[#080b18]/90 hover:border-amber-500/30 transition-all p-5 sm:p-6 space-y-4 shadow-lg group/entry"
            >
              {/* Entry Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-400/30 text-amber-300">
                    {entry.virtue}
                  </span>
                  <span className="text-sky-300 font-cinzel text-xs font-bold">{entry.greekVirtue}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    {entry.date}
                  </span>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-1 hover:text-rose-400 text-slate-600 transition-colors cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Title & Description */}
              <div className="space-y-1.5">
                <h4 className="font-cinzel text-base sm:text-lg font-bold text-white group-hover/entry:text-amber-200 transition-colors">
                  {entry.actionTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {entry.description}
                </p>
              </div>

              {/* Golden Mean Analysis Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl border border-rose-500/15 bg-rose-950/10 space-y-1">
                  <span className="text-[10px] font-mono text-rose-300 font-bold block">
                    DEFICIENCY AVOIDED:
                  </span>
                  <p className="text-xs text-rose-200/80 leading-relaxed">
                    {entry.deficiencyAvoided}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-orange-500/15 bg-orange-950/10 space-y-1">
                  <span className="text-[10px] font-mono text-orange-300 font-bold block">
                    EXCESS AVOIDED:
                  </span>
                  <p className="text-xs text-orange-200/80 leading-relaxed">
                    {entry.excessAvoided}
                  </p>
                </div>
              </div>

              {/* Equilibrium Rating Stars */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/60">
                <span className="text-[11px]">CALIBRATED HARMONY:</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`text-sm ${idx < entry.phronesisRating ? 'text-amber-400' : 'text-slate-700'}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1.5 text-slate-300 text-[11px] font-bold">
                    {entry.phronesisRating}/5
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
