import React from 'react';
import { Character, LevelData } from '../types';
import { useAuth } from '../context/AuthContext';
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
  FileText,
  User as UserIcon,
  RotateCcw,
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
  onOpenProfile: () => void;
  onOpenPPT: () => void;
  onRefreshChaptersToLevel1: () => void;
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
  onOpenProfile,
  onOpenPPT,
  onRefreshChaptersToLevel1,
  onSwitchCharacter,
  onSwitchSubject,
}) => {
  const { user } = useAuth();

  return (
    <header className="absolute top-0 inset-x-0 z-30 pointer-events-none p-2.5 sm:p-3 md:p-5 flex items-start justify-between gap-2">
      {/* Player & Account Status Card (Top-Left) */}
      <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 bg-slate-950/85 border border-cyan-800/40 rounded-2xl p-2 sm:p-2.5 md:p-3 shadow-xl backdrop-blur-md">
        {/* Character Avatar Indicator */}
        <button
          onClick={onOpenProfile}
          title="Open Player & Account Profile"
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center p-1 border shadow-md relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: '#020617', borderColor: character.color }}
        >
          <div
            className="w-full h-full rounded-lg flex items-center justify-center"
            style={{ backgroundColor: character.glowColor }}
          >
            <span className="text-xs sm:text-sm md:text-base font-bold font-['Cinzel'] text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : character.name.charAt(0)}
            </span>
          </div>
        </button>

        {/* Identity & Level Info */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenProfile}
              className="text-xs sm:text-sm md:text-base font-bold font-['Cinzel'] text-white hover:text-cyan-300 transition-colors cursor-pointer leading-tight text-left"
            >
              {user?.name || character.name}
            </button>
            <span
              className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border"
              style={{ color: character.secondaryColor, borderColor: `${character.color}66` }}
            >
              {character.element}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-cyan-300 font-mono flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[200px]">{level.locationName}</span>
          </p>
        </div>
      </div>

      {/* Center Score & Shards Tracker */}
      <div className="pointer-events-auto hidden md:flex items-center gap-3 bg-slate-950/85 border border-cyan-800/40 rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md">
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
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        {/* Project PPT Deck Button */}
        <button
          onClick={onOpenPPT}
          title="Open Project Presentation Deck (PPT)"
          className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/90 to-indigo-950/90 border border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono font-bold"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="hidden xl:inline">Project Slides (PPT)</span>
        </button>

        {/* Profile Button */}
        <button
          onClick={onOpenProfile}
          title="Account Profile & Achievements"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-cyan-300 hover:bg-slate-800 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <UserIcon className="w-4 h-4 text-cyan-400" />
          <span className="hidden lg:inline">Profile</span>
        </button>

        {/* Start Level 1 Quick Refresh Button */}
        <button
          onClick={onRefreshChaptersToLevel1}
          title="Refresh Chapters (Start Level 1)"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-amber-300 hover:bg-slate-800 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span className="hidden xl:inline">Level 1</span>
        </button>

        {/* Switch Subject Realm */}
        <button
          onClick={onSwitchSubject}
          title="Switch Educational Realm (Python, Web Dev, Git)"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 hover:bg-amber-950/60 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline capitalize font-bold">{subjectId} Realm</span>
        </button>

        <button
          onClick={onOpenTrials}
          title="Hall of Knowledge Trials"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-cyan-800/50 text-cyan-300 hover:bg-cyan-950 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <Swords className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Trials</span>
        </button>

        <button
          onClick={onOpenMap}
          title="World Map / Level Selector"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <Map className="w-4 h-4 text-sky-400" />
          <span className="hidden md:inline">Map</span>
        </button>

        <button
          onClick={onOpenCodex}
          title="Lore Codex & Inscriptions"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenAchievements}
          title="Achievements & 100 Correct Milestone"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md cursor-pointer relative"
        >
          <Award className="w-4 h-4 text-yellow-400" />
          {totalCorrectAnswers >= 100 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          )}
        </button>

        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute' : 'Unmute'}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={onSwitchCharacter}
          title="Character Selection"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-md cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
