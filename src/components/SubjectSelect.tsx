import React from 'react';
import { SubjectId, Character } from '../types';
import { SUBJECTS, SubjectInfo } from '../data/subjects';
import { Sparkles, ArrowRight, User, Volume2, VolumeX, Shield, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SubjectSelectProps {
  character: Character;
  selectedSubjectId: SubjectId;
  subjectProgress: Record<
    SubjectId,
    {
      currentLevelId: number;
      unlockedLevelIds: number[];
      completedLevelIds: number[];
    }
  >;
  onSelectSubject: (id: SubjectId) => void;
  onBackToLobby: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  character,
  selectedSubjectId,
  subjectProgress,
  onSelectSubject,
  onBackToLobby,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="relative min-h-full w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-cyan-900/30 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLobby}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>← Hero Lobby</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: character.color }}
            />
            <span className="font-['Cinzel'] font-bold text-xs text-white">
              {character.name}
            </span>
            <span className="text-[10px] text-slate-400">({character.title})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className="p-2 rounded-lg bg-slate-900/80 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-950/50 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Main Realm Portals */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col justify-center">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2 tracking-wide font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>STEP 2: CHOOSE YOUR EDUCATIONAL CHRONICLE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-['Cinzel'] text-white drop-shadow-md">
            The Realms of Knowledge
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1 font-['Outfit']">
            Select a subject story to begin. Each realm features distinct mentors, unique village maps, educational video lessons, and Glitch Monsters testing your knowledge.
          </p>
        </div>

        {/* 3 Realm Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SUBJECTS.map((sub: SubjectInfo) => {
            const prog = subjectProgress[sub.id] || {
              currentLevelId: 1,
              unlockedLevelIds: [1],
              completedLevelIds: [],
            };
            const isCompletedAll = prog.completedLevelIds.length >= 5;

            return (
              <div
                key={sub.id}
                className={`group relative rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 bg-gradient-to-b ${sub.accentBg} ${sub.cardBorder} hover:shadow-2xl hover:scale-[1.02]`}
                style={{
                  boxShadow: `0 0 35px ${sub.glowColor}25`,
                }}
              >
                {/* Glow pill badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border"
                    style={{
                      borderColor: `${sub.themeColor}60`,
                      backgroundColor: `${sub.themeColor}20`,
                      color: sub.themeColor,
                    }}
                  >
                    {sub.name} Realm
                  </span>

                  {isCompletedAll ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 font-mono text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mastered
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-slate-400">
                      Chapter {prog.currentLevelId} / 5
                    </span>
                  )}
                </div>

                {/* Realm Info */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold font-['Cinzel'] text-white group-hover:text-cyan-200 transition-colors">
                    {sub.realmName}
                  </h3>
                  <p
                    className="text-xs font-mono font-semibold"
                    style={{ color: sub.secondaryColor }}
                  >
                    {sub.tagline}
                  </p>
                  <p className="text-xs text-slate-300 font-['Outfit'] leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                {/* Key Personnel */}
                <div className="my-5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mentor:</span>
                    <span className="font-bold text-white">{sub.grandmaster}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nemesis:</span>
                    <span className="font-bold text-red-400">{sub.archMonster}</span>
                  </div>
                </div>

                {/* Topics Pills */}
                <div className="mb-6 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Curriculum Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enter Realm Button */}
                <button
                  onClick={() => {
                    soundEngine.playLevelVictory();
                    onSelectSubject(sub.id);
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl font-bold font-['Cinzel'] text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-xl group-hover:scale-105"
                  style={{
                    backgroundColor: sub.themeColor,
                    color: '#020617',
                    boxShadow: `0 0 20px ${sub.themeColor}50`,
                  }}
                >
                  <span>Enter {sub.name} Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 px-6 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        The Crystal Village • Switch subjects anytime from the in-game HUD Map without losing progress.
      </footer>
    </div>
  );
};
