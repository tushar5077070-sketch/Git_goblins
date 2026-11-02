import React from 'react';
import { LevelData, SubjectId } from '../types';
import { getSubjectLevels } from '../data/subjects';
import { MapPin, Lock, CheckCircle2, ArrowRight, X, Sparkles, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface LevelMapModalProps {
  currentLevelId: number;
  subjectId: SubjectId;
  unlockedLevelIds: number[];
  completedLevelIds: number[];
  onSelectLevel: (levelId: number) => void;
  onRefreshChaptersToLevel1?: () => void;
  onClose: () => void;
}

export const LevelMapModal: React.FC<LevelMapModalProps> = ({
  currentLevelId,
  subjectId,
  unlockedLevelIds,
  completedLevelIds,
  onSelectLevel,
  onRefreshChaptersToLevel1,
  onClose,
}) => {
  const levels = getSubjectLevels(subjectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fadeIn selection:bg-cyan-500 selection:text-black">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-cyan-800/60 rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Cartography • {subjectId.toUpperCase()} Realm
              </span>
              <h2 className="text-2xl font-bold font-['Cinzel'] text-white">
                District Progression Map
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshChaptersToLevel1 && (
              <button
                onClick={() => {
                  onRefreshChaptersToLevel1();
                  onClose();
                }}
                title="Restart this realm from Chapter 1"
                className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Refresh & Start Level 1</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Levels Grid / Path */}
        <div className="space-y-4 flex-1">
          {levels.map((level) => {
            const isUnlocked = unlockedLevelIds.includes(level.id);
            const isCompleted = completedLevelIds.includes(level.id);
            const isCurrent = currentLevelId === level.id;

            return (
              <div
                key={level.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'border-cyan-400 bg-slate-950/90 ring-1 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
                    : isUnlocked
                    ? 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950/80'
                    : 'border-slate-900 bg-slate-950/30 opacity-50'
                }`}
              >
                {/* Level Overview */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl border flex items-center justify-center font-['Cinzel'] font-bold text-lg flex-shrink-0"
                    style={{
                      borderColor: isUnlocked ? level.master.themeColor : '#334155',
                      color: isUnlocked ? level.master.themeColor : '#64748b',
                      backgroundColor: '#020617',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : isUnlocked ? (
                      level.id
                    ) : (
                      <Lock className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold font-['Cinzel'] text-white">
                        {level.name}: {level.locationName}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                          Current Location
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Mentor: <strong className="text-cyan-300">{level.master.name}</strong> • Monster: <strong className="text-red-400">{level.monster.name}</strong> • Topic: <span className="text-slate-200">{level.videoLesson.title}</span>
                    </p>
                  </div>
                </div>

                {/* Travel Action */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playCrystalChime();
                        onSelectLevel(level.id);
                        onClose();
                      }}
                      className={`w-full md:w-auto py-2.5 px-5 rounded-xl font-bold font-['Cinzel'] text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                        isCurrent
                          ? 'bg-slate-800 text-cyan-300 border border-cyan-800'
                          : 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow-md'
                      }`}
                    >
                      <span>{isCurrent ? 'Resume Exploration' : 'Travel Here'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked (Complete Chapter {level.id - 1})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
