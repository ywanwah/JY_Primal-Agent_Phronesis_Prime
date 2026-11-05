import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, Sparkles, Disc } from 'lucide-react';
import { soundscape } from '../utils/ambientAudio';

export const FooterAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(soundscape.getStatus());

  useEffect(() => {
    return soundscape.subscribe((active) => {
      setIsPlaying(active);
    });
  }, []);

  const handleToggle = () => {
    soundscape.toggle();
  };

  const handleStrikeChime = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying) {
      soundscape.play();
    } else {
      soundscape.triggerTempleChime();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary Mute/Unmute Toggle Button */}
      <button
        onClick={handleToggle}
        className={`group relative px-4 py-2 rounded-xl border text-xs font-mono tracking-wider flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
          isPlaying
            ? 'bg-gradient-to-r from-amber-500/15 via-sky-500/15 to-amber-500/10 border-amber-400/50 text-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
        }`}
        title={isPlaying ? 'Mute Low-Frequency Temple Chimes' : 'Unmute Low-Frequency Temple Chimes'}
      >
        {/* Pulsing Aura if active */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-xl bg-amber-400/10 animate-pulse pointer-events-none" />
        )}

        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          )}
        </div>

        <div className="text-left flex flex-col">
          <span className="font-cinzel text-[11px] font-bold text-slate-100 group-hover:text-amber-200">
            {isPlaying ? 'TEMPLE CHIMES ACTIVE' : 'TEMPLE CHIMES MUTED'}
          </span>
          <span className="text-[9px] text-slate-400">
            {isPlaying ? '54Hz Sub-Drone · 108Hz Chimes' : 'Click to Unmute Atmosphere'}
          </span>
        </div>

        {/* Animated Sound Frequency Equalizer Bars */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3.5 pl-1.5 border-l border-amber-500/30">
            <span className="w-0.5 h-2 bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-3.5 bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-1.5 bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 h-3 bg-sky-400 animate-bounce" style={{ animationDelay: '450ms' }} />
          </div>
        )}
      </button>

      {/* Manual Temple Bell Strike trigger button */}
      <button
        onClick={handleStrikeChime}
        className="px-2.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 text-slate-400 hover:text-amber-300 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
        title="Strike Delphic Temple Singing Bowl"
      >
        <Bell className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[10px] font-mono hidden sm:inline">STRIKE BELL</span>
      </button>
    </div>
  );
};
