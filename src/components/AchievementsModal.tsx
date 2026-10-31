import React from 'react';
import { Achievement } from '../types';
import {
  Award,
  X,
  CheckCircle2,
  Lock,
  Crown,
  Sparkles,
  Trophy,
  Compass,
  BookOpen,
} from 'lucide-react';

interface AchievementsModalProps {
  achievements: Achievement[];
  totalCorrectAnswers: number;
  onClose: () => void;
  onOpenGrand100: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  totalCorrectAnswers,
  onClose,
  onOpenGrand100,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fadeIn selection:bg-cyan-500 selection:text-black">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-yellow-500/40 rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/40">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Hall of Records ({unlockedCount} / {achievements.length} Unlocked)
              </span>
              <h2 className="text-2xl font-bold font-['Cinzel'] text-white">
                Village Deeds & Achievements
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grand 100 Achievement Spotlight Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-yellow-950/50 to-slate-950 border-2 border-amber-500/60 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Crown className="w-8 h-8 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                  Apex Milestone
                </span>
                <h3 className="text-lg font-bold font-['Cinzel'] text-white">
                  Grand Archon of the Crystal Village
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Reach 100 total correct answers across trials and battles to trigger the ultimate prime crystal ascension.
              </p>
              <div className="mt-2 text-xs font-mono text-amber-400 font-bold">
                Current Progress: {totalCorrectAnswers} / 100 Correct Answers
              </div>
            </div>
          </div>

          {totalCorrectAnswers >= 100 && (
            <button
              onClick={onOpenGrand100}
              className="py-2.5 px-6 rounded-xl font-bold font-['Cinzel'] text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-lg shadow-amber-400/30 hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
            >
              Play Final Cinematic
            </button>
          )}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlocked;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'border-amber-500/40 bg-slate-950/80 shadow-md'
                    : 'border-slate-800 bg-slate-950/40 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                    isUnlocked
                      ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold font-['Cinzel'] text-white">
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {ach.description}
                  </p>
                  <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Progress:</span>
                    <span className="text-slate-300 font-bold">
                      {ach.current} / {ach.target}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
