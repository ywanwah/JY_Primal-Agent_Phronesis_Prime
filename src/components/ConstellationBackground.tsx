import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Sparkles, Compass } from 'lucide-react';

interface StarNode extends d3.SimulationNodeDatum {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  greekRune?: string;
}

export const ConstellationBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [constellationCount, setConstellationCount] = useState<number>(0);
  const [interactiveMode, setInteractiveMode] = useState<'graviton' | 'stellar'>('graviton');

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinate tracking
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isActive: false,
      radius: 170,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Waves from clicks
    interface ResonanceWave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    }
    const waves: ResonanceWave[] = [];

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      waves.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 5,
        maxRadius: 220,
        alpha: 0.8,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    // D3 scales for color and aesthetics
    const greekRunes = ['Φ', 'Ψ', 'Ω', 'Σ', 'Δ', 'Θ', 'Λ', 'Π'];
    const starCount = Math.min(Math.floor((width * height) / 8500), 110);
    setConstellationCount(starCount);

    const colorPalette = [
      { color: '#FCD34D', glow: 'rgba(251, 191, 36, 0.6)' }, // Imperial Gold
      { color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.6)' }, // Sapphire Cyan
      { color: '#E0E7FF', glow: 'rgba(224, 231, 255, 0.5)' }, // Starlit White
      { color: '#C084FC', glow: 'rgba(192, 132, 252, 0.5)' }, // Celestial Violet
    ];

    // Generate stars using D3 random generators
    const randomX = d3.randomUniform(20, width - 20);
    const randomY = d3.randomUniform(20, height - 20);
    const randomSpeed = d3.randomNormal(0, 0.35);

    const stars: StarNode[] = d3.range(starCount).map((i) => {
      const paletteChoice = colorPalette[i % colorPalette.length];
      const hasRune = i < greekRunes.length * 2 && i % 4 === 0;
      return {
        id: i,
        x: randomX(),
        y: randomY(),
        vx: randomSpeed(),
        vy: randomSpeed(),
        radius: Math.random() * 2 + 1.2,
        color: paletteChoice.color,
        glowColor: paletteChoice.glow,
        baseAlpha: Math.random() * 0.5 + 0.35,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        greekRune: hasRune ? greekRunes[Math.floor(i / 4) % greekRunes.length] : undefined,
      };
    });

    // D3 distance and connection threshold
    const maxLinkDistance = 120;
    let time = 0;

    // Render loop
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // Update and draw ripple resonance waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += 3.5;
        wave.alpha *= 0.95;

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${wave.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        if (wave.alpha < 0.02 || wave.radius > wave.maxRadius) {
          waves.splice(i, 1);
        }
      }

      // Update star physics
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        // Bounce off walls softly
        if (star.x < 10) {
          star.x = 10;
          star.vx *= -1;
        } else if (star.x > width - 10) {
          star.x = width - 10;
          star.vx *= -1;
        }
        if (star.y < 10) {
          star.y = 10;
          star.vy *= -1;
        } else if (star.y > height - 10) {
          star.y = height - 10;
          star.vy *= -1;
        }

        // Mouse interaction: gravitate or deflect
        if (mouse.isActive) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 1) {
            const force = (1 - dist / mouse.radius) * 0.8;
            // Subtle orbital swirl
            const angle = Math.atan2(dy, dx);
            star.x += Math.cos(angle) * force * 1.5;
            star.y += Math.sin(angle) * force * 1.5;
          }
        }
      });

      // Draw constellation links between nearby stars
      ctx.lineWidth = 0.75;
      for (let i = 0; i < stars.length; i++) {
        const starA = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const starB = stars[j];
          const dx = starA.x - starB.x;
          const dy = starA.y - starB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxLinkDistance * maxLinkDistance) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxLinkDistance) * 0.28;

            ctx.beginPath();
            ctx.moveTo(starA.x, starA.y);
            ctx.lineTo(starB.x, starB.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw cursor constellation webs if mouse is active
      if (mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        // Find 5 closest stars to cursor using distance sorting
        const closestStars = [...stars]
          .map((s) => ({
            star: s,
            dist: Math.hypot(s.x - mouse.x, s.y - mouse.y),
          }))
          .filter((item) => item.dist < mouse.radius)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 6);

        // Draw glowing golden filaments to cursor
        closestStars.forEach(({ star, dist }) => {
          const proximityAlpha = Math.max(0, 1 - dist / mouse.radius);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(star.x, star.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${proximityAlpha * 0.75})`;
          ctx.lineWidth = 1.2;
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();
        });

        // Draw cursor central halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FCD34D';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 16 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Draw stars and Greek glyphs
      stars.forEach((star) => {
        const pulse = Math.sin(time * 2 + star.pulsePhase);
        const currentRadius = star.radius + pulse * 0.5;
        const currentAlpha = Math.min(1, Math.max(0.2, star.baseAlpha + pulse * 0.2));

        // Check distance to mouse to brighten nearby stars
        let mouseBoost = 0;
        if (mouse.isActive) {
          const distToMouse = Math.hypot(star.x - mouse.x, star.y - mouse.y);
          if (distToMouse < mouse.radius) {
            mouseBoost = (1 - distToMouse / mouse.radius) * 0.6;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentRadius + mouseBoost * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.min(1, currentAlpha + mouseBoost);
        ctx.shadowColor = star.glowColor;
        ctx.shadowBlur = 8 + mouseBoost * 10;
        ctx.fill();

        // Draw Greek Runes for sacred anchor nodes
        if (star.greekRune) {
          ctx.font = '10px "Cinzel", serif';
          ctx.fillStyle = mouseBoost > 0.2 ? '#FDE047' : 'rgba(212, 175, 55, 0.65)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(star.greekRune, star.x, star.y - (currentRadius + 3));
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto overflow-hidden z-0"
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85"
      />

      {/* Cybernetic telemetry indicator badge in the corner of the hero canvas */}
      <div className="absolute bottom-3 right-4 pointer-events-none hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/60 border border-amber-500/20 text-[10px] font-mono text-amber-300/80 backdrop-blur-sm">
        <Sparkles className="w-3 h-3 text-sky-400 animate-spin" />
        <span>D3 CONSTELLATION MESH: {constellationCount} STARS ACTIVE · INTERACTIVE</span>
      </div>
    </div>
  );
};
