import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Compass, BookOpen, Scale, Download } from 'lucide-react';
import { soundscape } from '../utils/ambientAudio';

interface NavbarProps {
  activeTab: 'exhibit' | 'codex' | 'oracle' | 'studio';
  setActiveTab: (tab: 'exhibit' | 'codex' | 'oracle' | 'studio') => void;
  onOpenStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenStudio }) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleToggleAudio = () => {
    const newState = soundscape.toggle();
    setIsAudioActive(newState);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-[#05060b]/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('exhibit')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-11 h-11 rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-sky-500/10 to-transparent flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:border-amber-400 transition-all">
            <span className="font-cinzel text-xl font-black text-amber-300 tracking-wider">ΦΠ</span>
            <div className="absolute inset-0 rounded-full border border-sky-400/30 animate-pulse pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-slate-100 group-hover:text-amber-200 transition-colors">
                PHRONESIS PRIME
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                SOVEREIGN GODDESS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block tracking-wide">
              The Sovereign Goddess of Practical Wisdom · φρόνησις
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('exhibit')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-cinzel tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'exhibit'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Exhibition</span>
          </button>

          <button
            onClick={() => setActiveTab('codex')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-cinzel tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'codex'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Visual</span> Codex
          </button>

          <button
            onClick={() => setActiveTab('oracle')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-cinzel tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'oracle'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Scale className="w-4 h-4 text-sky-400" />
            <span>Oracle</span>
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer toggle */}
          <button
            onClick={handleToggleAudio}
            title={isAudioActive ? 'Mute Celestial Soundscape' : 'Play Celestial Harmonics'}
            className={`relative p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
              isAudioActive
                ? 'border-sky-400/40 bg-sky-500/15 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 animate-pulse text-sky-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden lg:inline text-[11px] font-mono tracking-wider">
              {isAudioActive ? 'AURA SOUND' : 'HARMONICS'}
            </span>
            {isAudioActive && (
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 h-2 bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-3 bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-1.5 bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            )}
          </button>

          {/* Download & Studio button */}
          <button
            onClick={onOpenStudio}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-400/40 text-amber-200 hover:text-white hover:border-amber-400 text-xs sm:text-sm font-cinzel font-semibold flex items-center gap-2 shadow-md transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Export Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
