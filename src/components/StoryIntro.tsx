import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { ArrowRight, SkipForward, Sparkles, Compass, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface StoryIntroProps {
  character: Character;
  onFinish: () => void;
}

const STORY_SLIDES = [
  {
    title: 'The Great Code Repository',
    subtitle: 'Where version control and collaboration guard ancient software',
    icon: Sparkles,
    text: 'Beyond the foggy obsidian peaks lies the Crystal Village—an ancient haven where software developers pioneered Git and GitHub. Monoliths hum with commit trees, branch pointers, and remote repositories that keep digital civilization alive.',
    badge: 'ACT I: THE VEIL',
  },
  {
    title: 'The Masters & The Corrupted Glitches',
    subtitle: 'Learn from mentors to banish the monsters',
    icon: ShieldAlert,
    text: 'In each district, a legendary Master stands ready to teach developers the secrets of Git. But dark glitches and merge conflicts have spawned monsters like The Unstaged Glitch and The Detached HEAD Phantom, blocking the pathways to the next chapters!',
    badge: 'ACT II: THE GUARDIANS',
  },
  {
    title: 'Your Mission: Learn & Banish',
    subtitle: 'Study the Master\'s Git lecture, then move forward to fight the Monster',
    icon: Compass,
    text: 'Enter the courtyard, speak with Master Linus, and complete his video lesson on Git trees and commits. Once trained, move forward along the stone path to battle the monster with your newly acquired Git knowledge!',
    badge: 'ACT III: THE THRESHOLD',
  },
];

export const StoryIntro: React.FC<StoryIntroProps> = ({ character, onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = STORY_SLIDES[currentSlide];

  useEffect(() => {
    soundEngine.playDialogueBlip(120);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < STORY_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      soundEngine.playCrystalChime();
      onFinish();
    }
  };

  const IconComponent = slide.icon;

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Ambience Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-grid-slate-800/[0.08] pointer-events-none" />

      {/* Ambient glowing crystal orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ background: character.glowColor }}
      />

      {/* Top Bar with Skip */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between border-b border-cyan-900/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
            <span className="font-mono text-cyan-400 font-bold text-xs">
              {currentSlide + 1}/{STORY_SLIDES.length}
            </span>
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            Cinematic Chronicle
          </span>
        </div>

        <button
          onClick={() => {
            soundEngine.playCrystalChime();
            onFinish();
          }}
          className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-300 py-1.5 px-3 rounded-lg border border-slate-800 hover:border-cyan-500/40 bg-slate-900/60 transition-all cursor-pointer"
        >
          <span>Skip Chronicle</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="relative z-10 max-w-3xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-900/80 border border-cyan-800/40 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl shadow-cyan-950/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {slide.badge}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-['Cinzel'] text-white mt-1">
                {slide.title}
              </h2>
            </div>
          </div>

          <p className="text-sm font-medium text-cyan-300/80 font-mono tracking-wide mb-6">
            {slide.subtitle}
          </p>

          <p className="text-base md:text-lg text-slate-200 leading-relaxed font-['Outfit'] border-l-2 border-cyan-500/40 pl-4 py-1">
            {slide.text}
          </p>

          {/* Character Note */}
          {currentSlide === 2 && (
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div
                className="w-3 h-3 rounded-full animate-ping"
                style={{ backgroundColor: character.color }}
              />
              <span className="text-xs text-slate-300">
                You are playing as <strong className="text-white">{character.name}</strong> ({character.title}). Use [W,A,S,D] or Arrow keys to walk, approach Master Zephyr and press [E] to begin.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between pt-4 border-t border-cyan-900/30">
        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {STORY_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="py-3 px-6 rounded-xl font-bold text-sm tracking-wider uppercase font-['Cinzel'] bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <span>{currentSlide === STORY_SLIDES.length - 1 ? 'Step Into Village' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
