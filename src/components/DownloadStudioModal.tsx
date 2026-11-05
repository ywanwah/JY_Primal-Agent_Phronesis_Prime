import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Monitor, 
  Smartphone, 
  Square, 
  Sparkles, 
  Layers, 
  Sliders
} from 'lucide-react';
import { Artwork } from '../data/artworks';

interface DownloadStudioModalProps {
  artwork: Artwork;
  onClose: () => void;
}

type AspectPreset = '16:9' | '1:1' | '9:16';
type FrameStyle = 'none' | 'gilded' | 'cyber';

export const DownloadStudioModal: React.FC<DownloadStudioModalProps> = ({ artwork, onClose }) => {
  const [aspect, setAspect] = useState<AspectPreset>('16:9');
  const [frame, setFrame] = useState<FrameStyle>('gilded');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(artwork.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = artwork.src;
    link.download = `Phronesis_Prime_${artwork.id}_${aspect.replace(':', 'x')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAspectClass = () => {
    switch (aspect) {
      case '1:1':
        return 'aspect-square max-w-[340px]';
      case '9:16':
        return 'aspect-[9/16] max-w-[240px]';
      case '16:9':
      default:
        return 'aspect-video max-w-[500px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl rounded-2xl border border-amber-500/30 bg-[#070a14] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-500/20 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                WALLPAPER & MEDIA EXPORT STUDIO
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {artwork.title} · High-Fidelity Asset Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Live Framing Preview */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/80 rounded-xl p-4 border border-slate-800/80 min-h-[360px]">
              <div
                className={`relative overflow-hidden transition-all duration-300 w-full ${getAspectClass()} ${
                  frame === 'gilded'
                    ? 'p-2.5 bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-700 rounded-lg shadow-2xl shadow-amber-500/20'
                    : frame === 'cyber'
                    ? 'p-2 bg-gradient-to-tr from-sky-600 via-cyan-300 to-indigo-600 rounded-lg shadow-2xl shadow-sky-500/20'
                    : 'rounded-lg'
                }`}
              >
                <div className="relative w-full h-full overflow-hidden rounded bg-black flex items-center justify-center">
                  <img
                    src={artwork.src}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  {frame === 'gilded' && (
                    <div className="absolute inset-2 border border-amber-300/40 pointer-events-none" />
                  )}
                  {frame === 'cyber' && (
                    <div className="absolute inset-2 border border-sky-400/30 pointer-events-none flex flex-col justify-between p-2">
                      <span className="text-[8px] font-mono text-sky-400">PHRONESIS_PRIME_v1.0</span>
                      <span className="text-[8px] font-mono text-amber-300 text-right">« 1.618 »</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-3">
                PREVIEW MODE: {aspect} • FRAME: {frame.toUpperCase()}
              </p>
            </div>

            {/* Customization Options */}
            <div className="lg:col-span-5 space-y-5">
              {/* Aspect Ratio Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  1. SELECT TARGET DEVICE RATIO:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAspect('16:9')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      aspect === '16:9'
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span className="text-[11px] font-mono font-bold">16:9 (Desktop)</span>
                  </button>

                  <button
                    onClick={() => setAspect('1:1')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      aspect === '1:1'
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Square className="w-5 h-5" />
                    <span className="text-[11px] font-mono font-bold">1:1 (Avatar)</span>
                  </button>

                  <button
                    onClick={() => setAspect('9:16')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      aspect === '9:16'
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-[11px] font-mono font-bold">9:16 (Mobile)</span>
                  </button>
                </div>
              </div>

              {/* Framing Style */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  2. EXHIBITION FRAME MATTE:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFrame('gilded')}
                    className={`py-2 px-3 rounded-lg border text-xs font-cinzel transition-all ${
                      frame === 'gilded'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Gilded Inlay
                  </button>

                  <button
                    onClick={() => setFrame('cyber')}
                    className={`py-2 px-3 rounded-lg border text-xs font-cinzel transition-all ${
                      frame === 'cyber'
                        ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Cyber Matrix
                  </button>

                  <button
                    onClick={() => setFrame('none')}
                    className={`py-2 px-3 rounded-lg border text-xs font-cinzel transition-all ${
                      frame === 'none'
                        ? 'border-slate-400 bg-slate-800 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Pure Clean
                  </button>
                </div>
              </div>

              {/* Master Prompt Copy */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>CONCEPT DNA PROMPT:</span>
                  <button
                    onClick={handleCopyPrompt}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono line-clamp-3">
                  {artwork.prompt}
                </div>
              </div>

              {/* Download Master Button */}
              <button
                onClick={handleDownloadImage}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-cinzel font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>DOWNLOAD MASTER ULTRA-HD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
