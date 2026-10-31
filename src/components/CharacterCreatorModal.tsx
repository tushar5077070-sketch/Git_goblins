import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../types';
import { X, Sparkles, Check, Wand2, Shield, Zap, Flame, Clock, Eye } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CharacterCreatorModalProps {
  onSave: (char: Omit<Character, 'id' | 'isCustom'>) => void;
  onClose: () => void;
}

const ELEMENT_OPTIONS = [
  { element: 'Light' as const, color: '#06b6d4', sec: '#67e8f9', glow: 'rgba(6, 182, 212, 0.45)', bg: 'from-cyan-900/40 via-sky-950/60 to-slate-950', perk: 'Prism Sense: Agility & Shimmering Trail', speed: 3.4 },
  { element: 'Time' as const, color: '#f59e0b', sec: '#fde68a', glow: 'rgba(245, 158, 11, 0.45)', bg: 'from-amber-950/40 via-yellow-950/60 to-slate-950', perk: 'Temporal Focus: Enhanced Inscription Detection', speed: 3.2 },
  { element: 'Earth' as const, color: '#10b981', sec: '#6ee7b7', glow: 'rgba(16, 185, 129, 0.45)', bg: 'from-emerald-950/40 via-teal-950/60 to-slate-950', perk: 'Tectonic Ward: Sturdy Stance & Quartz Shield', speed: 3.1 },
  { element: 'Fire' as const, color: '#f43f5e', sec: '#fda4af', glow: 'rgba(244, 63, 94, 0.45)', bg: 'from-rose-950/40 via-red-950/60 to-slate-950', perk: 'Flame Surge: Swift Dash & Fiery Footsteps', speed: 3.5 },
  { element: 'Storm' as const, color: '#8b5cf6', sec: '#c4b5fd', glow: 'rgba(139, 92, 246, 0.45)', bg: 'from-purple-950/40 via-indigo-950/60 to-slate-950', perk: 'Lightning Focus: High Intuition & Spark Aura', speed: 3.3 },
  { element: 'Void' as const, color: '#ec4899', sec: '#fbcfe8', glow: 'rgba(236, 72, 153, 0.45)', bg: 'from-pink-950/40 via-fuchsia-950/60 to-slate-950', perk: 'Null Phase: Smooth Drift & Ethereal Gown', speed: 3.3 },
];

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [selectedElementIndex, setSelectedElementIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activePreset = ELEMENT_OPTIONS[selectedElementIndex];

  // Animate the hero preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 10;

      ctx.clearRect(0, 0, w, h);

      // Radial elemental aura
      const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, 55);
      aura.addColorStop(0, `${activePreset.color}80`);
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      ctx.fill();

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 24, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      const bob = Math.sin(time * 3) * 3;

      // Body Robe
      ctx.fillStyle = activePreset.color;
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy + 20);
      ctx.lineTo(cx + 14, cy + 20);
      ctx.lineTo(cx + 9, cy - 10 + bob);
      ctx.lineTo(cx - 9, cy - 10 + bob);
      ctx.closePath();
      ctx.fill();

      // Belt
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 10, cy + 4 + bob, 20, 4);

      // Head
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy - 16 + bob, 12, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Eyes
      ctx.fillStyle = activePreset.sec;
      ctx.beginPath();
      ctx.arc(cx - 3.5, cy - 16 + bob, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 3.5, cy - 16 + bob, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Floating Magic Orbs
      for (let i = 0; i < 3; i++) {
        const angle = time * 2 + (i * Math.PI * 2) / 3;
        const ox = cx + Math.cos(angle) * 32;
        const oy = cy + Math.sin(angle) * 16 + bob;
        ctx.fillStyle = activePreset.sec;
        ctx.beginPath();
        ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [activePreset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Valiant Developer';
    const finalTitle = title.trim() || `The ${activePreset.element} Coder`;
    const finalQuote = quote.trim() || '“Code is the architecture of the modern world.”';

    onSave({
      name: finalName,
      title: finalTitle,
      element: activePreset.element,
      color: activePreset.color,
      secondaryColor: activePreset.sec,
      glowColor: activePreset.glow,
      accentBg: activePreset.bg,
      quote: finalQuote,
      description: `A custom hero specializing in ${activePreset.element} elemental engineering.`,
      lore: `Forged in the Crystal Village nexus, ${finalName} embarked on the quest to eliminate software glitches and master computer science.`,
      perk: activePreset.perk,
      speed: activePreset.speed,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn selection:bg-cyan-500 selection:text-black">
      <div className="relative max-w-xl w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Hero Forge
              </span>
              <h3 className="text-xl md:text-2xl font-bold font-['Cinzel'] text-white">
                Create Your Hero
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <canvas ref={canvasRef} width={180} height={120} className="block" />
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider mt-1"
              style={{ color: activePreset.color }}
            >
              {activePreset.element} Affinity
            </span>
          </div>

          {/* Name & Title Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Hero Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex, ByteMage, Kora"
                maxLength={20}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-['Outfit'] text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Hero Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Fullstack Magus"
                maxLength={30}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-['Outfit'] text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Element Selection */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Choose Elemental Discipline
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ELEMENT_OPTIONS.map((opt, idx) => (
                <button
                  type="button"
                  key={opt.element}
                  onClick={() => setSelectedElementIndex(idx)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedElementIndex === idx
                      ? 'border-white bg-slate-800 shadow-lg scale-105'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/40"
                    style={{ backgroundColor: opt.color }}
                  />
                  <span className="text-[10px] font-mono text-slate-300 font-bold">
                    {opt.element}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Perk Preview */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <span className="font-mono text-slate-400 block text-[10px] uppercase mb-0.5">
              Special Trait
            </span>
            <span className="font-['Outfit'] font-semibold text-cyan-300">
              {activePreset.perk}
            </span>
          </div>

          {/* Motto / Quote */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
              Hero Motto (Optional)
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. “Clean code transforms reality.”"
              maxLength={80}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-['Outfit'] text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-bold font-['Cinzel'] text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Forge & Select Hero</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
