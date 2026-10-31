import React, { useState, useEffect } from 'react';
import { Character, LevelData } from '../types';
import {
  Sparkles,
  Map,
  BookOpen,
  Award,
  Swords,
  Volume2,
  VolumeX,
  Compass,
  Gem,
  Menu,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface HUDProps {
  character: Character;
  level: LevelData;
  subjectId: 'git' | 'python' | 'webdev';
  totalCorrectAnswers: number;
  shardsCount: number;
  cluesCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMap: () => void;
  onOpenTrials: () => void;
  onOpenAchievements: () => void;
  onOpenCodex: () => void;
  onSwitchCharacter: () => void;
  onSwitchSubject: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  character,
  level,
  subjectId,
  totalCorrectAnswers,
  shardsCount,
  cluesCount,
  soundEnabled,
  onToggleSound,
  onOpenMap,
  onOpenTrials,
  onOpenAchievements,
  onOpenCodex,
  onSwitchCharacter,
  onSwitchSubject,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' ? !!document.fullscreenElement : false
  );

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const target = document.getElementById('crystal-app-root') || document.documentElement;
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(() => {
          document.documentElement.requestFullscreen().catch(() => {});
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="absolute top-0 inset-x-0 z-30 pointer-events-none p-3 md:p-5 flex items-start justify-between">
      {/* Player Status Card (Top-Left) */}
      <div className="pointer-events-auto flex items-center gap-3 bg-slate-950/85 border border-cyan-800/40 rounded-2xl p-2.5 md:p-3 shadow-xl backdrop-blur-md">
        {/* Character Avatar Indicator */}
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center p-1 border shadow-md relative overflow-hidden"
          style={{ backgroundColor: '#020617', borderColor: character.color }}
        >
          <div
            className="w-full h-full rounded-lg flex items-center justify-center"
            style={{ backgroundColor: character.glowColor }}
          >
            <span className="text-sm md:text-base font-bold font-['Cinzel'] text-white">
              {character.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Identity & Level Info */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base font-bold font-['Cinzel'] text-white leading-tight">
              {character.name}
            </span>
            <span
              className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border"
              style={{ color: character.secondaryColor, borderColor: `${character.color}66` }}
            >
              {character.element}
            </span>
          </div>
          <p className="text-xs text-cyan-300 font-mono flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>{level.locationName}</span>
          </p>
        </div>
      </div>

      {/* Center Score & Shards Tracker */}
      <div className="pointer-events-auto hidden sm:flex items-center gap-3 bg-slate-950/85 border border-cyan-800/40 rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md">
        {/* Knowledge Score Counter */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block leading-none">
              Knowledge Score
            </span>
            <span className="text-sm font-mono font-bold text-white">
              {totalCorrectAnswers} <span className="text-[10px] text-cyan-400">/ 100</span>
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-800" />

        {/* Shards Collected */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block leading-none">
              Shards
            </span>
            <span className="text-sm font-mono font-bold text-amber-300">
              {shardsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Top-Right Menu & Navigation Buttons */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Switch Subject Realm */}
        <button
          onClick={onSwitchSubject}
          title="Switch Educational Realm (Python, Web Dev, Git)"
          className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 hover:bg-amber-950/60 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline capitalize font-bold">{subjectId} Realm</span>
        </button>

        <button
          onClick={onOpenTrials}
          title="Hall of Knowledge Trials"
          className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-800/50 text-cyan-300 hover:bg-cyan-950 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <Swords className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Trials Arena</span>
        </button>

        <button
          onClick={onOpenMap}
          title="World Map / Level Selector"
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <Map className="w-4 h-4 text-sky-400" />
          <span className="hidden md:inline">Map</span>
        </button>

        <button
          onClick={onOpenCodex}
          title="Lore Codex & Inscriptions"
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenAchievements}
          title="Achievements & 100 Correct Milestone"
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md cursor-pointer relative"
        >
          <Award className="w-4 h-4 text-yellow-400" />
          {totalCorrectAnswers >= 100 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          )}
        </button>

        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute' : 'Unmute'}
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Switch to Full Screen (Edge-to-Edge)'}
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-all shadow-md cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onSwitchCharacter}
          title="Character Selection"
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-md cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
