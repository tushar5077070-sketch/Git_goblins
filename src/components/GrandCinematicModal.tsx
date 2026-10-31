import React, { useEffect, useRef } from 'react';
import { Character } from '../types';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, Trophy, X, ArrowRight } from 'lucide-react';

interface GrandCinematicModalProps {
  character: Character;
  totalCorrectAnswers: number;
  onClose: () => void;
}

export const GrandCinematicModal: React.FC<GrandCinematicModalProps> = ({
  character,
  totalCorrectAnswers,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    soundEngine.playVictoryFanfare();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#ffffff'],
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const render = () => {
      time += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Celestial Galaxy Vortex
      for (let i = 0; i < 5; i++) {
        const ringR = 80 + i * 40;
        ctx.strokeStyle = `hsla(${(time * 40 + i * 60) % 360}, 80%, 65%, 0.4)`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, ringR, ringR * 0.45, time * 0.5 + i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Prime Crystal Center Core
      const pulse = Math.sin(time * 3) * 12 + 45;
      const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, pulse * 2);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, '#38bdf8');
      coreGrad.addColorStop(0.7, '#818cf8');
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Huge Crystal Diamond
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 80);
      ctx.lineTo(cx + 45, cy);
      ctx.lineTo(cx, cy + 80);
      ctx.lineTo(cx - 45, cy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Light Beams radiating to skies
      for (let b = 0; b < 12; b++) {
        const angle = (b * Math.PI * 2) / 12 + time * 0.4;
        ctx.strokeStyle = `hsla(${(b * 30 + time * 50) % 360}, 90%, 70%, 0.3)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * w, cy + Math.sin(angle) * h);
        ctx.stroke();
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn selection:bg-cyan-500 selection:text-black">
      <div className="relative max-w-3xl w-full bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl p-6 md:p-10 text-center overflow-hidden flex flex-col items-center">
        {/* Animated Background Canvas */}
        <canvas
          ref={canvasRef}
          width={700}
          height={320}
          className="w-full h-56 object-cover rounded-2xl mb-6 border border-amber-500/30 shadow-inner"
        />

        {/* Badge & Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-mono font-bold mb-3 tracking-widest uppercase">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>LEGENDARY REVELATION • 100 ANSWERS REACHED</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold font-['Cinzel'] text-white drop-shadow-lg">
          The Awakening of Lumina
        </h1>

        <p className="text-sm md:text-base text-cyan-200 mt-2 max-w-xl font-['Outfit'] leading-relaxed">
          Through steadfast discipline across optics, ecology, thermodynamics, celestial mechanics, and spacetime, you have solved 100 ancient enigmas. The Prime Crystal radiates across the valley—the Crystal Village is forever restored!
        </p>

        {/* Champion Citation */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 max-w-md w-full text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Bestowed Title
          </span>
          <span className="text-lg md:text-xl font-bold font-['Cinzel'] bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200">
            Grand Archon {character.name} of Lumina
          </span>
          <span className="text-xs font-mono text-emerald-400 block mt-1">
            Achievement Unlocked: [Grand Archon of the Crystal Village]
          </span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="mt-8 py-3.5 px-8 rounded-xl font-bold font-['Cinzel'] text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          Return to the Village
        </button>
      </div>
    </div>
  );
};
