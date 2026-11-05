import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ArtworkViewer } from './components/ArtworkViewer';
import { CodexSection } from './components/CodexSection';
import { OracleDeliberation } from './components/OracleDeliberation';
import { DownloadStudioModal } from './components/DownloadStudioModal';
import { DailyDeliberation } from './components/DailyDeliberation';
import { ConstellationBackground } from './components/ConstellationBackground';
import { ARTWORKS, Artwork } from './data/artworks';
import { 
  Sparkles, 
  Compass, 
  Scale, 
  BookOpen, 
  ShieldCheck, 
  ChevronDown,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'exhibit' | 'codex' | 'oracle' | 'studio'>('exhibit');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork>(ARTWORKS[0]);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const handleOpenStudio = (art?: Artwork) => {
    if (art) setSelectedArtwork(art);
    setIsStudioOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#04060c] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Starfield and Atmospheric Aura */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
        <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(4,6,12,0.9)_80%)]" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenStudio={() => handleOpenStudio()}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Hero Concept Introduction Banner with Interactive D3 Constellation Background */}
        <section className="relative rounded-3xl p-6 sm:p-10 border border-amber-500/20 bg-gradient-to-b from-[#090d1f]/85 via-[#060814]/90 to-[#04060c] shadow-2xl overflow-hidden backdrop-blur-xl group">
          {/* D3 Interactive Star Constellation Canvas */}
          <ConstellationBackground />

          <div className="relative z-10 text-center space-y-5 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono tracking-widest shadow-lg shadow-amber-500/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              THE SOVEREIGN ARTIFACT · φρόνησις
            </div>

            <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-wider leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              PHRONESIS <span className="text-gold-gradient">PRIME</span>
            </h1>

            <p className="font-cinzel text-base sm:text-xl text-amber-200/90 font-medium tracking-wide">
              The Cybernetic Goddess of Practical Wisdom & Cosmic Equilibrium
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Where classical Athenian statuary meets transcendent deep-space cybernetics. Embodying the divine intellect of Athena and the ethical canon of Aristotle, she is sculpted in polished Parian marble and superconducting gold filigree, powered by the dual solar-sapphire core of moral discernment.
            </p>

            {/* Quick Stat Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Golden Ratio Archetype (Φ = 1.618)
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Orthos Logos Reactor Core
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                Aristotelian Virtue Engine
              </span>
            </div>

            {/* Daily Deliberation Component grounded via Google Search */}
            <DailyDeliberation />
          </div>
        </section>

        {/* Dynamic Tab Views */}
        {activeTab === 'exhibit' && (
          <section className="space-y-8 animate-in fade-in duration-300">
            <ArtworkViewer
              artworks={ARTWORKS}
              selectedArtwork={selectedArtwork}
              onSelectArtwork={setSelectedArtwork}
              onOpenStudio={handleOpenStudio}
            />
          </section>
        )}

        {activeTab === 'codex' && (
          <section className="animate-in fade-in duration-300">
            <CodexSection />
          </section>
        )}

        {activeTab === 'oracle' && (
          <section className="animate-in fade-in duration-300">
            <OracleDeliberation />
          </section>
        )}

        {activeTab === 'studio' && (
          <section className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-cinzel text-3xl font-black text-white">THE MEDIA ARCHIVE</h2>
              <p className="text-sm text-slate-400">
                Explore, crop, and download full-resolution masterworks for wallpapers, avatars, and display prints.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ARTWORKS.map((art) => (
                <div
                  key={art.id}
                  className="rounded-2xl border border-slate-800 bg-[#090c18] overflow-hidden group hover:border-amber-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-video w-full overflow-hidden bg-black relative">
                    <img
                      src={art.src}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-amber-400/30 text-[10px] font-mono text-amber-300">
                      {art.aspect}
                    </div>
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{art.subtitle}</p>
                    </div>

                    <button
                      onClick={() => handleOpenStudio(art)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 border border-amber-400/30 hover:bg-amber-500 hover:text-black font-cinzel text-xs font-bold tracking-wider text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>OPEN IN EXPORT STUDIO</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Wallpaper & Media Export Studio Modal */}
      {isStudioOpen && (
        <DownloadStudioModal
          artwork={selectedArtwork}
          onClose={() => setIsStudioOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#030408] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-cinzel text-slate-400">
            <span className="font-bold text-amber-300">PHRONESIS PRIME</span>
            <span>·</span>
            <span>« ΦΡΟΝΗΣΙΣ ΠΡΩΤΗ »</span>
          </div>
          <p className="font-mono text-[11px]">
            Synthesized with Hellenic Philosophy & Cybernetic Precision
          </p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-amber-400/80">ORTHOS LOGOS</span>
            <span className="text-slate-700">•</span>
            <span className="text-sky-400/80">MESOTES</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-400/80">EUDAIMONIA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
