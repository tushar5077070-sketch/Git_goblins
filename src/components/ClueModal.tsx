import React from 'react';
import { Clue } from '../types';
import { BookOpen, X, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ClueModalProps {
  clue: Clue;
  onClose: () => void;
}

export const ClueModal: React.FC<ClueModalProps> = ({ clue, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-lg w-full bg-slate-900 border-2 border-amber-500/60 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Ancient Village Inscription
              </span>
              <h3 className="text-xl font-bold font-['Cinzel'] text-white">
                {clue.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inscription Body */}
        <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-5 mb-6 relative">
          <div className="text-slate-200 text-base md:text-lg leading-relaxed font-serif italic border-l-2 border-amber-400/60 pl-4 py-1">
            {clue.text}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-amber-300/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Recorded into your Village Codex</span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => {
            soundEngine.playFootstep();
            onClose();
          }}
          className="w-full py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
        >
          Close Inscription [ESC]
        </button>
      </div>
    </div>
  );
};
