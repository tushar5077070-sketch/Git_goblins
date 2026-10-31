import React from 'react';
import { LevelData } from '../types';
import { LEVELS } from '../data/levelData';
import { BookOpen, X, Sparkles, Lock } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CodexModalProps {
  collectedClues: string[];
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ collectedClues, onClose }) => {
  // Aggregate all clues
  const allClues = LEVELS.flatMap((lvl) =>
    lvl.clues.map((c) => ({ ...c, chapter: lvl.id, location: lvl.locationName }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fadeIn selection:bg-cyan-500 selection:text-black">
      <div className="relative max-w-3xl w-full bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Village Chronicles ({collectedClues.length} / {allClues.length} Discovered)
              </span>
              <h2 className="text-2xl font-bold font-['Cinzel'] text-white">
                Archivist's Field Codex
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

        {/* Clues List */}
        <div className="space-y-4 flex-1">
          {allClues.map((c) => {
            const isFound = collectedClues.includes(c.id);

            return (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isFound
                    ? 'border-amber-500/40 bg-slate-950/70 shadow-md'
                    : 'border-slate-800/80 bg-slate-950/30 opacity-40'
                }`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Ch. {c.chapter} • {c.location}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    {isFound ? 'Deciphered' : 'Undiscovered'}
                  </span>
                </div>

                {isFound ? (
                  <>
                    <h4 className="text-base font-bold font-['Cinzel'] text-white mb-2">
                      {c.title}
                    </h4>
                    <p className="text-sm text-slate-300 italic font-serif leading-relaxed border-l-2 border-amber-400/50 pl-3">
                      {c.text}
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 py-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Search the stone ruins and tablets in Chapter {c.chapter} to unlock this inscription.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
