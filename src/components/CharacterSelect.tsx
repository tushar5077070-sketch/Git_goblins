import React, { useRef, useEffect, useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { Character, CharacterId } from '../types';
import { Sparkles, Shield, Clock, ArrowRight, Volume2, VolumeX, RotateCcw, Plus, Trash2, Wand2, FileText, User as UserIcon } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { CharacterCreatorModal } from './CharacterCreatorModal';
import { useAuth } from '../context/AuthContext';

interface CharacterSelectProps {
  selectedId: CharacterId | null;
  customCharacters: Character[];
  onSelect: (id: CharacterId) => void;
  onCreateCharacter: (char: Omit<Character, 'id' | 'isCustom'>) => void;
  onDeleteCharacter: (id: string) => void;
  onProceedToSubjects: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  hasExistingSave: boolean;
  onOpenProfile?: () => void;
  onOpenPPT?: () => void;
  onOpenAuth?: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  selectedId,
  customCharacters,
  onSelect,
  onCreateCharacter,
  onDeleteCharacter,
  onProceedToSubjects,
  soundEnabled,
  onToggleSound,
  onReset,
  hasExistingSave,
  onOpenProfile,
  onOpenPPT,
  onOpenAuth,
}) => {
  const [showCreator, setShowCreator] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Combine default and custom characters
  const allCharacters = [...CHARACTERS, ...customCharacters];
  const activeId = selectedId || (allCharacters[0]?.id ?? 'lyra');
  const selectedChar = allCharacters.find((c) => c.id === activeId) || allCharacters[0];

  return (
    <div className="relative min-h-full w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Animated Atmosphere */}
      <BackgroundAtmosphere />

      {/* Top Header / Bar */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between border-b border-cyan-900/30 bg-slate-950/70 backdrop-blur-md gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider font-['Cinzel'] bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-200">
              THE CRYSTAL VILLAGE
            </h1>
            <p className="text-xs text-cyan-400/80 tracking-widest font-mono uppercase">
              Educational Adventure Multiverse Lobby
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* PPT Presentation Deck Button */}
          {onOpenPPT && (
            <button
              onClick={onOpenPPT}
              title="Open Project Presentation Deck (PPT)"
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-950 to-indigo-950 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Project PPT</span>
            </button>
          )}

          {/* User Profile / Login */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              title="Player Profile & Accounts"
              className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-cyan-400" />
              <span>{user?.name || (isAuthenticated ? 'Profile' : 'Login / Sign Up')}</span>
            </button>
          )}

          {hasExistingSave && (
            <button
              onClick={() => {
                if (window.confirm('Reset all saved progress and achievements?')) {
                  onReset();
                }
              }}
              title="Reset Saved Game"
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2 rounded-lg bg-slate-900/80 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-950/50 hover:text-cyan-200 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex flex-col justify-center">
        {/* Title & Lore Pitch */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2 tracking-wide font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>HERO SELECTION & CREATION LOBBY</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-['Cinzel'] text-white drop-shadow-md">
            Choose or Forge Your Hero
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1 font-['Outfit']">
            Select a developer or create your own custom avatar. Then embark into your chosen programming chronicle: Python, Web Development, or Git & GitHub!
          </p>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {allCharacters.map((char) => {
            const isSelected = activeId === char.id;
            return (
              <div
                key={char.id}
                onClick={() => onSelect(char.id)}
                className={`group relative rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between p-5 bg-gradient-to-b ${char.accentBg} ${
                  isSelected
                    ? 'border-white shadow-2xl scale-[1.02] ring-2 ring-cyan-400/50'
                    : 'border-slate-800/80 hover:border-slate-600 hover:bg-slate-900/60'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 30px ${char.glowColor}` : undefined,
                }}
              >
                {/* Top Badge: Element & Custom Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border"
                    style={{
                      borderColor: char.color,
                      color: char.color,
                      backgroundColor: `${char.color}15`,
                    }}
                  >
                    {char.element} Affinity
                  </span>

                  <div className="flex items-center gap-1.5">
                    {char.isCustom && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 font-mono text-[9px] uppercase font-bold">
                        Custom
                      </span>
                    )}
                    {char.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete custom hero "${char.name}"?`)) {
                            onDeleteCharacter(char.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                        title="Delete Hero"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Character Preview Canvas */}
                <div className="h-40 w-full relative flex items-center justify-center my-2">
                  <CharacterPreviewCanvas character={char} isSelected={isSelected} />
                </div>

                {/* Info Text */}
                <div className="space-y-1.5 text-center mt-2">
                  <h3 className="text-xl font-bold font-['Cinzel'] tracking-wide text-white group-hover:text-cyan-200 transition-colors">
                    {char.name}
                  </h3>
                  <p
                    className="text-xs font-mono font-semibold"
                    style={{ color: char.secondaryColor }}
                  >
                    {char.title}
                  </p>
                  <p className="text-xs text-slate-300 font-serif italic line-clamp-2 px-1">
                    {char.quote}
                  </p>
                </div>

                {/* Trait Badge */}
                <div className="mt-3 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-['Outfit'] text-slate-300">
                  <span className="font-semibold" style={{ color: char.color }}>
                    Specialty:
                  </span>{' '}
                  {char.perk}
                </div>

                {/* Quick Start Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(char.id);
                    onProceedToSubjects();
                  }}
                  className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold font-['Cinzel'] text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 shadow-cyan-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>Select & Choose Subject</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Create Custom Hero Card */}
          <div
            onClick={() => setShowCreator(true)}
            className="group relative rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 bg-slate-950/40 hover:bg-slate-900/40 text-center min-h-[360px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel'] text-white group-hover:text-cyan-300 transition-colors">
              Create Custom Hero
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs font-['Outfit']">
              Forge your own developer avatar with custom name, elemental discipline, colors, and traits.
            </p>
            <span className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              Open Hero Forge
            </span>
          </div>
        </div>

        {/* Bottom Hero Confirmation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-cyan-800/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full animate-ping"
              style={{ backgroundColor: selectedChar.color }}
            />
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Chosen Champion
              </span>
              <span className="font-['Cinzel'] font-bold text-white text-base">
                {selectedChar.name} — {selectedChar.title}
              </span>
            </div>
          </div>

          <button
            onClick={onProceedToSubjects}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold font-['Cinzel'] text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span>Choose Subject Chronicle (Python, Web Dev, Git)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 px-6 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        The Crystal Village • Story-Driven Educational RPG Adventure
      </footer>

      {/* Character Creator Modal */}
      {showCreator && (
        <CharacterCreatorModal
          onSave={onCreateCharacter}
          onClose={() => setShowCreator(false)}
        />
      )}
    </div>
  );
};

// 2D Canvas Character Preview with Idle Walking / Elemental Float Animation
const CharacterPreviewCanvas: React.FC<{ character: Character; isSelected: boolean }> = ({
  character,
  isSelected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const render = () => {
      time += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 15;

      ctx.clearRect(0, 0, w, h);

      // Radial elemental aura
      const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, isSelected ? 65 : 45);
      aura.addColorStop(0, `${character.color}${isSelected ? '88' : '44'}`);
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, isSelected ? 65 : 45, 0, Math.PI * 2);
      ctx.fill();

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 24, 20, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floating / Breathing Animation
      const floatY = Math.sin(time * 3) * (isSelected ? 5 : 2.5);

      // Body Robe / Armor
      ctx.fillStyle = character.color;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy + 20);
      ctx.lineTo(cx + 15, cy + 20);
      ctx.lineTo(cx + 10, cy - 12 + floatY);
      ctx.lineTo(cx - 10, cy - 12 + floatY);
      ctx.closePath();
      ctx.fill();

      // Character Accent Trim / Sash
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 11, cy + 3 + floatY, 22, 4);

      // Character Head
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy - 18 + floatY, 13, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Eyes
      ctx.fillStyle = character.secondaryColor;
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 18 + floatY, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 4, cy - 18 + floatY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Spark Particles
      for (let i = 0; i < 3; i++) {
        const angle = time * 2 + (i * Math.PI * 2) / 3;
        const radius = isSelected ? 34 : 26;
        const ox = cx + Math.cos(angle) * radius;
        const oy = cy + Math.sin(angle) * (radius * 0.45) + floatY;

        ctx.fillStyle = character.secondaryColor;
        ctx.beginPath();
        ctx.arc(ox, oy, isSelected ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [character, isSelected]);

  return <canvas ref={canvasRef} width={180} height={160} className="block mx-auto" />;
};

// Atmospheric background particles & mist
const BackgroundAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.5 ? 190 : 215,
    }));

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};
