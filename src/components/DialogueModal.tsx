import React, { useState, useEffect } from 'react';
import { Master, LevelData } from '../types';
import { Sparkles, ArrowRight, BookOpen, GitBranch, Play } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DialogueModalProps {
  master: Master;
  level: LevelData;
  hasLearnedLesson: boolean;
  onProceedToLesson: () => void;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  master,
  level,
  hasLearnedLesson,
  onProceedToLesson,
  onClose,
}) => {
  // Combine greeting dialogue into one complete cohesive briefing
  const fullText = hasLearnedLesson
    ? master.postLessonAdvice
    : Array.isArray(master.greetingDialogue)
    ? master.greetingDialogue.join(' ')
    : master.greetingDialogue;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Fast typewriter effect that player can instantly reveal or bypass
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;

    const timer = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(charIndex));
        if (charIndex % 4 === 0) {
          soundEngine.playDialogueBlip(charIndex * 4);
        }
        charIndex += 2; // Faster text appearance
      } else {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 12);

    return () => clearInterval(timer);
  }, [fullText, hasLearnedLesson]);

  // Keyboard shortcut: pressing Enter, Space, or E immediately starts lecture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'e') {
        e.preventDefault();
        soundEngine.playCrystalChime();
        onProceedToLesson();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onProceedToLesson, onClose]);

  const handleStartLecture = () => {
    soundEngine.playCrystalChime();
    onProceedToLesson();
  };

  const handleInstantReveal = () => {
    setDisplayedText(fullText);
    setIsTyping(false);
  };

  const subjectDisciplineLabel = (() => {
    const disc = master.gitDiscipline.toLowerCase();
    if (disc.includes('python')) return 'Python Master';
    if (disc.includes('html') || disc.includes('css') || disc.includes('web') || disc.includes('dom') || disc.includes('react')) {
      return 'Web Dev Master';
    }
    return 'Git Master';
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative max-w-3xl w-full bg-slate-900 border-2 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ borderColor: master.themeColor }}
      >
        {/* Glow Header Accent */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(to right, ${master.themeColor}, #0284c7, ${master.themeColor})` }}
        />

        {/* Content Area */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          {/* Master Portrait Frame */}
          <div className="flex-shrink-0 flex flex-col items-center mx-auto md:mx-0">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl p-1 shadow-xl relative overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: '#020617', border: `2px solid ${master.themeColor}` }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${master.themeColor} 0%, transparent 70%)` }}
              />
              <div className="flex flex-col items-center justify-center">
                <GitBranch className="w-12 h-12 animate-pulse mb-1" style={{ color: master.themeColor }} />
                <span className="text-[10px] font-mono tracking-wider text-slate-300 font-bold text-center px-1">
                  {master.gitDiscipline}
                </span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block">
                {subjectDisciplineLabel}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Chapter {level.id}
              </span>
            </div>
          </div>

          {/* Dialogue Body */}
          <div className="flex-1 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-baseline justify-between border-b border-slate-800 pb-2 mb-3">
                <h3 className="text-2xl font-bold font-['Cinzel'] text-white">
                  {master.name}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  {master.title}
                </span>
              </div>

              <p className="text-xs text-slate-400 italic mb-3 font-serif">
                {master.quote}
              </p>

              {/* Message Box */}
              <div
                onClick={isTyping ? handleInstantReveal : undefined}
                className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 min-h-[110px] relative cursor-pointer hover:border-slate-700 transition-colors"
                title={isTyping ? 'Click to show all text' : undefined}
              >
                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-['Outfit']">
                  {displayedText}
                  {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
                </p>
                {isTyping && (
                  <span className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500">
                    Click to reveal instantly
                  </span>
                )}
              </div>
            </div>

            {/* Actions Bar - Immediate 1-Click Launch */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-xs font-mono text-cyan-300">
                  {hasLearnedLesson ? 'Lesson Mastered • Ready for Battle' : `Topic: ${level.videoLesson.title}`}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Return to Village
                </button>

                <button
                  onClick={handleStartLecture}
                  className="px-6 py-2.5 rounded-xl font-bold font-['Cinzel'] text-sm tracking-wider uppercase text-slate-950 shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: master.themeColor,
                    boxShadow: `0 10px 25px -5px ${master.themeColor}55`,
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{hasLearnedLesson ? 'Review Lecture' : 'Begin Lecture [Enter]'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
