import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character, Monster, LevelData, Question } from '../types';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Shield,
  Swords,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface BattleArenaProps {
  character: Character;
  monster: Monster;
  level: LevelData;
  totalCorrectAnswers: number;
  onRecordAnswer: (correct: boolean, isLevelBattle: boolean) => void;
  onWinLevel: () => void;
  onRestartLevel: () => void;
  onReviewLesson: () => void;
}

// Randomly permute options so correct answer position changes on each retry
function prepareQuestion(q: Question): Question {
  const originalCorrect = q.options[q.correctIndex];
  const indices = [0, 1, 2, 3].slice(0, q.options.length);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledOptions = indices.map((idx) => q.options[idx]);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrect);
  return {
    ...q,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
  };
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  character,
  monster,
  level,
  totalCorrectAnswers,
  onRecordAnswer,
  onWinLevel,
  onRestartLevel,
  onReviewLesson,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track asked question IDs and immediate previous attempt to guarantee non-repeating retakes
  const askedQuestionIdsRef = useRef<string[]>([]);
  const previousAttemptQuestionIdsRef = useRef<string[]>([]);

  // Function to pick 2 unasked questions from this topic's pool
  const pickBattleQuestions = useCallback(
    (excludeIds: string[] = []): Question[] => {
      const pool = level.questions;
      const mustExclude = new Set([...excludeIds, ...previousAttemptQuestionIdsRef.current]);

      // Priority 1: Questions not asked yet in this session, and NOT in immediate previous attempt
      let candidates = pool.filter(
        (q) => !askedQuestionIdsRef.current.includes(q.id) && !mustExclude.has(q.id)
      );

      // Priority 2: If pool of unasked questions has run low, cycle the pool while STILL strictly excluding immediate previous attempt
      if (candidates.length < 2) {
        askedQuestionIdsRef.current = [];
        candidates = pool.filter((q) => !mustExclude.has(q.id));
      }

      // Priority 3: Fallback only if pool has fewer than 2 questions total
      if (candidates.length < 2) {
        candidates = pool.filter((q) => !excludeIds.includes(q.id));
        if (candidates.length < 2) {
          candidates = [...pool];
        }
      }

      // Randomize selection from eligible unasked questions
      const shuffled = [...candidates].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 2);

      // Remember these questions as the previous attempt so retake never repeats them
      previousAttemptQuestionIdsRef.current = selected.map((q) => q.id);
      selected.forEach((q) => {
        if (!askedQuestionIdsRef.current.includes(q.id)) {
          askedQuestionIdsRef.current.push(q.id);
        }
      });

      return selected.map(prepareQuestion);
    },
    [level.questions]
  );

  const [battleQuestions, setBattleQuestions] = useState<Question[]>(() =>
    pickBattleQuestions()
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);

  const [battleCorrectCount, setBattleCorrectCount] = useState(0);
  const [battleStage, setBattleStage] = useState<
    'question' | 'victory_cinematic' | 'defeat_gameover'
  >('question');
  const [screenShake, setScreenShake] = useState(false);

  // Current active challenge question
  const currentQuestion: Question =
    battleQuestions[questionIndex] || battleQuestions[0];

  // Refresh questions whenever level changes
  useEffect(() => {
    askedQuestionIdsRef.current = [];
    const fresh = pickBattleQuestions();
    setBattleQuestions(fresh);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsEvaluating(false);
    setFeedback(null);
    setBattleCorrectCount(0);
    setBattleStage('question');
  }, [level.id, pickBattleQuestions]);

  // Battle Animation Canvas
  const animRef = useRef<{
    projectile: {
      x: number;
      y: number;
      active: boolean;
      targetX: number;
      targetY: number;
    } | null;
    impactParticles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
    }[];
    monsterShieldActive: boolean;
    monsterDissolving: boolean;
    monsterDissolveAlpha: number;
  }>({
    projectile: null,
    impactParticles: [],
    monsterShieldActive: false,
    monsterDissolving: false,
    monsterDissolveAlpha: 1.0,
  });

  // Retake attack with completely fresh unrepeated questions
  const handleRetakeBattle = useCallback(() => {
    soundEngine.playFootstep();
    const currentIds = battleQuestions.map((q) => q.id);
    const freshQuestions = pickBattleQuestions(currentIds);

    setBattleQuestions(freshQuestions);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsEvaluating(false);
    setFeedback(null);
    setBattleCorrectCount(0);
    setBattleStage('question');

    animRef.current.monsterDissolving = false;
    animRef.current.monsterDissolveAlpha = 1.0;
    animRef.current.monsterShieldActive = false;
    animRef.current.projectile = null;
    animRef.current.impactParticles = [];
  }, [battleQuestions, pickBattleQuestions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const render = () => {
      time += 0.04;

      // Adaptively scale canvas width to match parent container for crisp fullscreen visuals
      if (canvas.parentElement) {
        const parentW = canvas.parentElement.clientWidth;
        if (canvas.width !== parentW) {
          canvas.width = parentW;
        }
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Arena Floor & Arcane Battle Ground
      const arenaGrad = ctx.createRadialGradient(
        w / 2,
        h * 0.7,
        50,
        w / 2,
        h * 0.7,
        w * 0.6
      );
      arenaGrad.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      arenaGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = arenaGrad;
      ctx.fillRect(0, 0, w, h);

      // Corrupted Battle Ring
      ctx.strokeStyle = `${monster.themeColor}55`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.75, w * 0.42, 70, 0, 0, Math.PI * 2);
      ctx.stroke();

      // --- PLAYER SPRITE (Left Side) ---
      const playerX = w * 0.22;
      const playerY = h * 0.7;
      const pBreathe = Math.sin(time * 3) * 3;

      ctx.fillStyle = character.glowColor;
      ctx.beginPath();
      ctx.arc(playerX, playerY - 30, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = character.color;
      ctx.beginPath();
      ctx.moveTo(playerX - 22, playerY + 20);
      ctx.lineTo(playerX + 22, playerY + 20);
      ctx.lineTo(playerX + 14, playerY - 35 + pBreathe);
      ctx.lineTo(playerX - 14, playerY - 35 + pBreathe);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(playerX, playerY - 48 + pBreathe, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = character.secondaryColor;
      ctx.beginPath();
      ctx.arc(playerX + 6, playerY - 48 + pBreathe, 3, 0, Math.PI * 2);
      ctx.fill();

      // --- MONSTER SPRITE (Right Side) ---
      const monsterX = w * 0.78;
      const monsterY = h * 0.68;
      const mFloat = Math.sin(time * 3.5) * 6;

      const anim = animRef.current;

      if (!anim.monsterDissolving || anim.monsterDissolveAlpha > 0.05) {
        ctx.save();
        if (anim.monsterDissolving) {
          ctx.globalAlpha = anim.monsterDissolveAlpha;
          anim.monsterDissolveAlpha -= 0.01;
        }

        // Monster Menacing Red/Purple Glitch Aura
        const mAura = ctx.createRadialGradient(
          monsterX,
          monsterY - 30,
          10,
          monsterX,
          monsterY - 30,
          75
        );
        mAura.addColorStop(0, `${monster.themeColor}99`);
        mAura.addColorStop(1, 'transparent');
        ctx.fillStyle = mAura;
        ctx.beginPath();
        ctx.arc(monsterX, monsterY - 30, 80, 0, Math.PI * 2);
        ctx.fill();

        // Monster Shield / Glitch Wall (If Defending)
        if (anim.monsterShieldActive) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 6;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(
            monsterX - 15,
            monsterY - 35,
            65,
            Math.PI * 0.5,
            Math.PI * 1.5
          );
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Monster Spiky Demonic Body
        ctx.fillStyle = '#450a0a';
        ctx.strokeStyle = monster.themeColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(monsterX - 32, monsterY + 28);
        ctx.lineTo(monsterX - 40, monsterY + 8 + mFloat);
        ctx.lineTo(monsterX - 25, monsterY - 18 + mFloat);
        ctx.lineTo(monsterX - 36, monsterY - 45 + mFloat);
        ctx.lineTo(monsterX, monsterY - 65 + mFloat);
        ctx.lineTo(monsterX + 36, monsterY - 45 + mFloat);
        ctx.lineTo(monsterX + 25, monsterY - 18 + mFloat);
        ctx.lineTo(monsterX + 40, monsterY + 8 + mFloat);
        ctx.lineTo(monsterX + 32, monsterY + 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Monster Glowing Angry Eyes
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(monsterX - 12, monsterY - 36 + mFloat, 4.5, 0, Math.PI * 2);
        ctx.arc(monsterX + 12, monsterY - 36 + mFloat, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Glitch Particles orbiting monster
        for (let i = 0; i < 4; i++) {
          const gAngle = time * 3 + (i * Math.PI) / 2;
          const gx = monsterX + Math.cos(gAngle) * 55;
          const gy = monsterY + Math.sin(gAngle) * 35 + mFloat;
          ctx.fillStyle = monster.themeColor;
          ctx.fillRect(gx - 4, gy - 4, 8, 8);
        }

        ctx.restore();
      }

      // --- PROJECTILE ANIMATION (Player Attack Spell) ---
      if (anim.projectile && anim.projectile.active) {
        const proj = anim.projectile;
        const dx = proj.targetX - proj.x;
        const dy = proj.targetY - proj.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 22) {
          proj.active = false;
          // Spawn impact explosion
          for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            anim.impactParticles.push({
              x: proj.targetX,
              y: proj.targetY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: Math.random() > 0.5 ? character.color : '#38bdf8',
              life: 1.0,
            });
          }
        } else {
          proj.x += (dx / dist) * 24;
          proj.y += (dy / dist) * 24;

          ctx.fillStyle = character.color;
          ctx.shadowColor = character.secondaryColor;
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // --- IMPACT PARTICLES ---
      for (let i = anim.impactParticles.length - 1; i >= 0; i--) {
        const p = anim.impactParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;

        if (p.life <= 0) {
          anim.impactParticles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [character, monster]);

  // Handle Answer Selection
  const handleSelectOption = (index: number) => {
    if (isEvaluating || feedback !== null) return;
    setSelectedOption(index);
    setIsEvaluating(true);

    const isCorrect = index === currentQuestion.correctIndex;
    onRecordAnswer(isCorrect, true);

    const canvas = canvasRef.current;
    const w = canvas?.width || 800;
    const h = canvas?.height || 360;

    if (isCorrect) {
      soundEngine.playAttackSpell();
      animRef.current.projectile = {
        x: w * 0.25,
        y: h * 0.65,
        active: true,
        targetX: w * 0.78,
        targetY: h * 0.65,
      };

      // Rapid impact and INSTANT question switch
      setTimeout(() => {
        soundEngine.playImpactSuccess();
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 300);

        const newCorrectCount = battleCorrectCount + 1;
        setBattleCorrectCount(newCorrectCount);

        if (questionIndex === 0) {
          // INSTANT POP: Directly shift to Question 2 automatically
          setQuestionIndex(1);
          setSelectedOption(null);
          setFeedback(null);
          setIsEvaluating(false);
        } else {
          // Question 2 was also answered correctly -> 2/2 Complete Victory!
          soundEngine.playVictoryFanfare();
          animRef.current.monsterDissolving = true;
          setBattleStage('victory_cinematic');
          setIsEvaluating(false);
          confetti({
            particleCount: 130,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#10b981', '#facc15', '#a855f7'],
          });
        }
      }, 300);
    } else {
      soundEngine.playAttackSpell();
      animRef.current.projectile = {
        x: w * 0.25,
        y: h * 0.65,
        active: true,
        targetX: w * 0.72,
        targetY: h * 0.65,
      };

      setTimeout(() => {
        soundEngine.playShieldDefend();
        animRef.current.monsterShieldActive = true;
        setTimeout(() => {
          animRef.current.monsterShieldActive = false;
        }, 600);

        setFeedback({
          correct: false,
          explanation: currentQuestion.explanation,
        });
        setIsEvaluating(false);
      }, 350);
    }
  };

  const handleProceedAfterQuestion = () => {
    soundEngine.playDefeat();
    setBattleStage('defeat_gameover');
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-6 bg-slate-950 overflow-y-auto selection:bg-cyan-500 selection:text-black ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Top Combat HUD */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800/50">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400">
                {level.master.gitDiscipline} Combat • Chapter {level.id}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 hidden sm:inline">
                Dynamic Topic Pool
              </span>
            </div>
            <h3 className="text-base font-bold font-['Cinzel'] text-white">
              {character.name} vs {monster.name}
            </h3>
          </div>
        </div>

        {/* Battle Score Tracker & Retake Question Shuffler */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Quick Retake / Fresh Question Button */}
          <button
            onClick={handleRetakeBattle}
            title="Retake attack with fresh, unrepeated questions on this topic"
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Change Questions</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Accuracy (Req: 2/2)
            </span>
            <div className="flex items-center gap-1.5 justify-end">
              <span
                className={`w-3 h-3 rounded-full border ${
                  questionIndex > 0 || feedback !== null
                    ? battleCorrectCount >= 1
                      ? 'bg-emerald-400 border-emerald-300'
                      : 'bg-red-500 border-red-400'
                    : 'bg-slate-700 border-slate-600'
                }`}
              />
              <span
                className={`w-3 h-3 rounded-full border ${
                  questionIndex === 1 && feedback !== null
                    ? battleCorrectCount === 2
                      ? 'bg-emerald-400 border-emerald-300'
                      : 'bg-red-500 border-red-400'
                    : 'bg-slate-700 border-slate-600'
                }`}
              />
              <span className="text-sm font-mono font-bold text-white ml-2">
                {battleCorrectCount} / 2
              </span>
            </div>
          </div>

          <div className="border-l border-slate-800 pl-4 text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Knowledge Score
            </span>
            <span className="text-sm font-mono font-bold text-cyan-300">
              {totalCorrectAnswers} Correct
            </span>
          </div>
        </div>
      </div>

      {/* Arena Canvas */}
      <div className="relative max-w-5xl w-full mx-auto my-3 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex-shrink-0">
        <canvas
          ref={canvasRef}
          width={900}
          height={260}
          className="w-full h-48 md:h-64 block object-cover"
        />

        {/* Monster Status overlay */}
        <div className="absolute top-3 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-red-800 backdrop-blur-sm text-xs font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-ping bg-red-500" />
          <span className="text-red-300">{monster.name}: Glitch Active</span>
        </div>
      </div>

      {/* Bottom Area: Question Card or Victory/Defeat */}
      <div className="max-w-5xl w-full mx-auto">
        {battleStage === 'victory_cinematic' ? (
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-10 h-10 animate-spin" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-['Cinzel'] text-white">
              Monster Banished! The path to the next mystery is now open.
            </h2>
            <p className="text-sm md:text-base text-emerald-200 max-w-2xl mx-auto font-['Outfit']">
              {monster.defeatQuote} Your precise answers neutralized the
              corrupted entity and unsealed the path!
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={onWinLevel}
                className="py-4 px-8 rounded-xl font-bold font-['Cinzel'] text-base uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 hover:from-emerald-300 hover:to-indigo-400 text-slate-950 shadow-xl shadow-cyan-500/40 flex items-center gap-3 cursor-pointer transform hover:scale-105 active:scale-95"
              >
                <span>Claim Victory & Continue Adventure</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : battleStage === 'defeat_gameover' ? (
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-red-500/80 shadow-2xl shadow-red-500/20 text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-red-950 text-red-400 border border-red-500/40">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Cinzel'] text-white">
              Glitch Overwhelms You: {monster.name} Resists
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              You scored{' '}
              <strong className="text-amber-400">
                {battleCorrectCount} of 2
              </strong>{' '}
              required correct answers. Both questions must be answered correctly
              to eliminate the glitch and unseal the path! Retake the attack to
              face fresh questions on this topic.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRetakeBattle}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold font-['Cinzel'] text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-red-400 via-rose-400 to-amber-400 hover:from-red-300 hover:to-amber-300 shadow-xl shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Attack (New Questions)</span>
              </button>

              <button
                onClick={onReviewLesson}
                className="w-full sm:w-auto py-3 px-6 rounded-xl font-mono text-xs uppercase tracking-wider text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Master's Lesson</span>
              </button>

              <button
                onClick={() => {
                  handleRetakeBattle();
                  onRestartLevel();
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-xl font-mono text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Return to Village</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 md:p-6 rounded-2xl bg-slate-900/90 border border-cyan-900/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Challenge Question {questionIndex + 1} of 2
                </span>
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                  • Non-repeating retake pool
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Target: {monster.name}
              </span>
            </div>

            <h4 className="text-base md:text-lg font-semibold text-white font-['Outfit'] leading-snug">
              {currentQuestion.question}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                let btnStyle =
                  'border-slate-800 bg-slate-950/70 hover:border-cyan-500/60 hover:bg-slate-900 text-slate-200';

                if (feedback !== null) {
                  if (isCorrect) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/40';
                  } else if (isSelected) {
                    btnStyle =
                      'border-red-500 bg-red-950/60 text-red-200 ring-2 ring-red-500/40';
                  } else {
                    btnStyle =
                      'opacity-40 border-slate-800 bg-slate-950 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isEvaluating || feedback !== null}
                    className={`p-4 rounded-xl border text-left text-xs md:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {feedback !== null && (
              <div
                className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn ${
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
                  <div className="space-y-0.5">
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider"
                      style={{
                        color: feedback.correct ? '#34d399' : '#fbbf24',
                      }}
                    >
                      {feedback.correct
                        ? 'Spell Strikes Monster!'
                        : 'Monster Deflects Strike!'}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-['Outfit']">
                      {feedback.explanation}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceedAfterQuestion}
                  className="w-full md:w-auto flex-shrink-0 py-2.5 px-6 rounded-xl font-bold font-['Cinzel'] text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
                >
                  <span>Acknowledge Mistake</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
