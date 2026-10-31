import React, { useState } from 'react';
import { Question } from '../types';
import { KNOWLEDGE_TRIALS_BANK } from '../data/levelData';
import { Swords, X, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Trophy } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TrialsArenaModalProps {
  totalCorrectAnswers: number;
  onRecordAnswer: (correct: boolean, isLevelBattle: boolean) => void;
  onClose: () => void;
  onOpenGrand100: () => void;
}

export const TrialsArenaModal: React.FC<TrialsArenaModalProps> = ({
  totalCorrectAnswers,
  onRecordAnswer,
  onClose,
  onOpenGrand100,
}) => {
  const [trialIndex, setTrialIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);

  const question: Question = KNOWLEDGE_TRIALS_BANK[trialIndex % KNOWLEDGE_TRIALS_BANK.length];

  const handleSelectOption = (idx: number) => {
    if (feedback !== null) return;
    setSelectedOption(idx);

    const isCorrect = idx === question.correctIndex;
    onRecordAnswer(isCorrect, false);

    if (isCorrect) {
      soundEngine.playImpactSuccess();
      setFeedback({ correct: true, explanation: question.explanation });
      if (totalCorrectAnswers + 1 >= 100) {
        setTimeout(() => onOpenGrand100(), 1200);
      }
    } else {
      soundEngine.playShieldDefend();
      setFeedback({ correct: false, explanation: question.explanation });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    setTrialIndex((prev) => prev + 1);
    soundEngine.playFootstep();
  };

  const progressTo100 = Math.min(100, totalCorrectAnswers);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fadeIn selection:bg-cyan-500 selection:text-black">
      <div className="relative max-w-3xl w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Git & GitHub Mastery Trials • Practice Bank
              </span>
              <h2 className="text-2xl font-bold font-['Cinzel'] text-white">
                Hall of Git Trials
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

        {/* 100-Answer Progress Milestone Meter */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-800/60 mb-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-cyan-300 flex items-center gap-1.5 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Target: 100 Knowledge Answers Milestone</span>
            </span>
            <span className="text-white font-bold">
              {totalCorrectAnswers} / 100 ({progressTo100}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 rounded-full transition-all duration-500 shadow-md shadow-cyan-400/50"
              style={{ width: `${progressTo100}%` }}
            />
          </div>

          {totalCorrectAnswers >= 100 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-mono font-bold">
                ★ 100 Answers Achieved! Grand Archon title unlocked!
              </span>
              <button
                onClick={onOpenGrand100}
                className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors"
              >
                Watch 100 Cinematic
              </button>
            </div>
          )}
        </div>

        {/* Active Question Box */}
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span>Trial Question #{trialIndex + 1}</span>
              <span className="text-cyan-400">Scientific Foundation</span>
            </div>

            <h3 className="text-lg md:text-xl font-bold font-['Outfit'] text-white leading-relaxed mb-6">
              {question.question}
            </h3>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {question.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === question.correctIndex;
                let btnStyle = 'border-slate-800 bg-slate-900/80 hover:border-cyan-500 hover:bg-slate-900 text-slate-200';

                if (feedback !== null) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200';
                  } else if (isSelected) {
                    btnStyle = 'border-red-500 bg-red-950/60 text-red-200';
                  } else {
                    btnStyle = 'opacity-40 border-slate-800 bg-slate-900 text-slate-500';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    disabled={feedback !== null}
                    className={`p-4 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="pt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Button */}
          {feedback !== null && (
            <div
              className={`p-4 rounded-xl border mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                feedback.correct
                  ? 'border-emerald-500/50 bg-emerald-950/40'
                  : 'border-amber-500/50 bg-amber-950/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedback.correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider block"
                    style={{ color: feedback.correct ? '#34d399' : '#fbbf24' }}
                  >
                    {feedback.correct ? '+1 To Global Score!' : 'Incorrect Concept'}
                  </span>
                  <p className="text-xs text-slate-200 font-['Outfit'] mt-0.5">
                    {feedback.explanation}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full md:w-auto flex-shrink-0 py-2.5 px-6 rounded-xl font-bold font-['Cinzel'] text-xs uppercase tracking-wider bg-white hover:bg-slate-200 text-slate-950 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>Next Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
