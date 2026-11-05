import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  Info, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  Share2,
  Crosshair,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Artwork, Hotspot } from '../data/artworks';

interface ArtworkViewerProps {
  artworks: Artwork[];
  selectedArtwork: Artwork;
  onSelectArtwork: (art: Artwork) => void;
  onOpenStudio: (art: Artwork) => void;
}

type FilterMode = 'default' | 'auric' | 'obsidian' | 'marble' | 'hud';

export const ArtworkViewer: React.FC<ArtworkViewerProps> = ({
  artworks,
  selectedArtwork,
  onSelectArtwork,
  onOpenStudio,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterMode>('default');
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false);
  
  // Pan and Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when switching artwork
  useEffect(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setSelectedHotspot(null);
  }, [selectedArtwork]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.4, 3.2));
  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.4, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(selectedArtwork.prompt);
    setIsCopiedPrompt(true);
    setTimeout(() => setIsCopiedPrompt(false), 2400);
  };

  const getFilterStyle = (): React.CSSProperties => {
    switch (activeFilter) {
      case 'auric':
        return { filter: 'contrast(1.1) saturate(1.3) sepia(0.18)' };
      case 'obsidian':
        return { filter: 'contrast(1.22) saturate(1.15) brightness(0.92) hue-rotate(15deg)' };
      case 'marble':
        return { filter: 'grayscale(0.85) contrast(1.18) brightness(1.04)' };
      case 'hud':
        return { filter: 'contrast(1.12) saturate(1.1)' };
      default:
        return {};
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Artwork Perspective Selector Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {artworks.map((art) => {
          const isSelected = art.id === selectedArtwork.id;
          return (
            <div
              key={art.id}
              onClick={() => onSelectArtwork(art)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(212,175,55,0.25)] ring-1 ring-amber-400'
                  : 'border-slate-800 bg-[#090c16] hover:border-slate-600 hover:bg-slate-900/50'
              }`}
            >
              <div className="aspect-video w-full overflow-hidden bg-black/60 relative">
                <img
                  src={art.src}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                  {art.category}
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-black font-mono font-bold text-[10px]">
                    <Check className="w-3 h-3" /> ACTIVE
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{art.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Exhibition Stage */}
      <div className="relative rounded-2xl border border-amber-500/25 bg-[#080a14] shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-4 py-3 border-b border-amber-500/15 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-cinzel text-xs font-semibold text-amber-200 tracking-wider">
              {selectedArtwork.title.toUpperCase()}
            </span>
            <span className="text-slate-500 text-xs">|</span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              {selectedArtwork.dimensions}
            </span>
          </div>

          {/* Viewer Controls */}
          <div className="flex items-center gap-2">
            {/* Filter Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-lg p-0.5 text-xs">
              <span className="px-2 text-[10px] text-slate-400 font-mono hidden md:inline">FILTER:</span>
              {(['default', 'auric', 'obsidian', 'marble', 'hud'] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveFilter(mode)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase transition-all ${
                    activeFilter === mode
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Hotspots toggle (if available) */}
            {selectedArtwork.hotspots && selectedArtwork.hotspots.length > 0 && (
              <button
                onClick={() => setShowHotspots(!showHotspots)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                  showHotspots
                    ? 'border-sky-400/50 bg-sky-500/15 text-sky-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Anatomical Hotspots"
              >
                <Crosshair className="w-4 h-4" />
                <span className="text-[11px] font-mono hidden sm:inline">
                  {showHotspots ? 'HOTSPOTS ON' : 'HOTSPOTS OFF'}
                </span>
              </button>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/60 rounded-lg p-0.5">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-40"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-1 text-[11px] font-mono text-amber-300 min-w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.2}
                className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-40"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 text-amber-400 hover:text-amber-200 border-l border-slate-700/60"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cinema Fullscreen Mode */}
            <button
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-amber-300 hover:border-amber-400/40 transition-all"
              title={isCinemaMode ? 'Exit Cinema Mode' : 'Enter Cinema Mode'}
            >
              {isCinemaMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full overflow-hidden bg-black flex items-center justify-center transition-all ${
            isCinemaMode ? 'h-[85vh]' : 'h-[520px] sm:h-[640px]'
          } ${zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        >
          {/* Subtle Ambient Radial Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* HUD Overlay if HUD filter active */}
          {activeFilter === 'hud' && (
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start text-sky-400/70 font-mono text-[10px]">
                <div>
                  <p>SYS::ARCHON_TITAN_ONLINE</p>
                  <p>COGNITIVE_ALIGNMENT: 1.618 (GOLDEN RATIO)</p>
                  <p>RESOLVER: ARISTOTELIAN_LOGOS_v9</p>
                </div>
                <div className="text-right">
                  <p>COSMIC_COORD: 37°58&apos;N 23°43&apos;E [CELESTIAL AGORA]</p>
                  <p>TELEMETRY_SAMPLE: NOMINAL</p>
                  <p>CORE_STATE: STABLE_VIRTUE</p>
                </div>
              </div>
              <div className="w-full flex justify-between items-end text-amber-400/70 font-mono text-[10px]">
                <div>« ΦΡΟΝΗΣΙΣ ΠΡΩΤΗ »</div>
                <div>SEC_LEVEL: TRANSCENDENT</div>
              </div>
              {/* Reticle in center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border border-sky-400/20 rounded-full flex items-center justify-center">
                  <div className="w-24 h-24 border border-dashed border-amber-400/30 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Primary Image Container with Zoom & Pan transform */}
          <div
            className="relative transition-transform duration-75 select-none"
            style={{
              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={selectedArtwork.src}
              alt={selectedArtwork.title}
              draggable={false}
              style={getFilterStyle()}
              className="max-h-[82vh] max-w-full object-contain pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
            />

            {/* Interactive Hotspots Layer */}
            {showHotspots &&
              zoomLevel === 1 &&
              selectedArtwork.hotspots?.map((spot) => (
                <button
                  key={spot.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot(spot);
                  }}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/spot z-30 focus:outline-none cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing Aura Rings */}
                    <span className="absolute w-8 h-8 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                    <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-sky-300 border-2 border-white shadow-[0_0_15px_rgba(234,179,8,0.8)] flex items-center justify-center group-hover/spot:scale-125 transition-transform">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 hidden group-hover/spot:flex flex-col items-center pointer-events-none z-40 whitespace-nowrap">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-amber-400/40 text-left shadow-xl backdrop-blur-md">
                      <p className="text-[11px] font-cinzel font-bold text-amber-300">{spot.title}</p>
                      <p className="text-[10px] text-sky-300 font-mono">{spot.greekTerm}</p>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {/* Pan Navigation helper indicator when zoomed */}
          {zoomLevel > 1 && (
            <div className="absolute bottom-4 left-4 z-30 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-amber-400/30 text-[11px] font-mono text-amber-200 backdrop-blur-md flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>DRAG TO PAN ACROSS 4K CANVAS</span>
            </div>
          )}
        </div>

        {/* Selected Hotspot Detail Drawer */}
        {selectedHotspot && (
          <div className="border-t border-amber-500/20 bg-gradient-to-r from-slate-950 via-[#0b0e1b] to-slate-950 p-6 animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/15 border border-amber-500/40 text-amber-300">
                    ANATOMICAL ARCHETYPE
                  </span>
                  <span className="text-sky-300 font-cinzel text-sm">{selectedHotspot.greekTerm}</span>
                </div>
                <h4 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  {selectedHotspot.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedHotspot.deepDescription}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-amber-300/90">
                  <span className="text-slate-500 font-normal">Virtue Alignment:</span>
                  <span className="font-bold">{selectedHotspot.virtueCorrelation}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedHotspot(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 hover:border-amber-400/50 bg-slate-900/80 text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                Close Hotspot
              </button>
            </div>
          </div>
        )}

        {/* Bottom Information Bar */}
        <div className="px-6 py-5 border-t border-slate-800/80 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>{selectedArtwork.category}</span>
              <span>•</span>
              <span>{selectedArtwork.yearCreated}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedArtwork.philosophicalThesis}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleCopyPrompt}
              className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:border-slate-500 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all"
              title="Copy the master concept prompt"
            >
              {isCopiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedPrompt ? 'PROMPT COPIED' : 'COPY PROMPT'}</span>
            </button>

            <button
              onClick={() => onOpenStudio(selectedArtwork)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT STUDIO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Palette & Philosophical Composition Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Chromatics */}
        <div className="rounded-xl border border-slate-800 bg-[#090c17]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-cinzel text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              CHROMATIC SIGNATURE
            </h4>
            <span className="text-[11px] font-mono text-slate-500">HELLENIC CYBERNETICS</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {selectedArtwork.colorPalette.map((color) => (
              <div key={color.hex} className="group relative">
                <div
                  className="h-12 w-full rounded-lg border border-white/10 shadow-inner group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="mt-1 text-center">
                  <p className="text-[10px] font-mono text-slate-400 truncate">{color.name}</p>
                  <p className="text-[9px] font-mono text-slate-600">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conceptual Design Blueprint */}
        <div className="rounded-xl border border-slate-800 bg-[#090c17]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-cinzel text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              ORIGIN SYNTHESIS & METRICS
            </h4>
            <span className="text-[11px] font-mono text-amber-400/80">PRIME ARCHETYPE</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">PRIMARY MATERIAL</span>
              <span className="font-cinzel text-slate-200">Parian Marble Nano-Composite</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">CORE ENERGY</span>
              <span className="font-cinzel text-slate-200">Orthos Logos (Right Reason)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">HARMONIC RATIO</span>
              <span className="font-cinzel text-slate-200">Golden Mean (Φ = 1.618033)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block">PRIMARY FUNCTION</span>
              <span className="font-cinzel text-slate-200">Deliberative Virtue Execution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
