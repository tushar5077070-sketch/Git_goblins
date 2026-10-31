import React, { useState, useEffect, useRef } from 'react';
import { VideoLesson, Master, LevelData } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Swords,
  BookOpen,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface VideoLessonModalProps {
  lesson: VideoLesson;
  master: Master;
  level: LevelData;
  onCompleteLesson: () => void;
  onReturnToVillage: () => void;
}

export const VideoLessonModal: React.FC<VideoLessonModalProps> = ({
  lesson,
  master,
  level,
  onCompleteLesson,
  onReturnToVillage,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const totalDuration = lesson.durationSeconds;

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * speed;
          if (next >= totalDuration) {
            setHasCompleted(true);
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, totalDuration]);

  useEffect(() => {
    const chapters = lesson.chapters;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].time) {
        if (i !== activeChapterIndex) {
          setActiveChapterIndex(i);
          soundEngine.playDialogueBlip(i * 30);
        }
        break;
      }
    }
  }, [currentTime, lesson.chapters, activeChapterIndex]);

  // Render the Dynamic Animated Git & GitHub Simulations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Blackboard / Dark Tech Terminal Canvas Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#020617');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Terminal Grid guidelines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Simulation Based on Diagram Type (Git, Python, Web Dev)
      if (lesson.diagramType === 'git_trees') {
        renderGitTreesDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'git_branching') {
        renderGitBranchingDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'git_remotes') {
        renderGitRemotesDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'git_merge_conflicts') {
        renderGitMergeDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'git_time_travel') {
        renderGitTimeTravelDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'py_basics') {
        renderPyBasicsDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'py_control') {
        renderPyControlDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'py_functions') {
        renderPyFunctionsDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'py_collections') {
        renderPyCollectionsDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'py_classes') {
        renderPyClassesDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'web_html') {
        renderWebHtmlDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'web_css') {
        renderWebCssDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'web_js') {
        renderWebJsDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'web_apis') {
        renderWebApisDiagram(ctx, w, h, currentTime);
      } else if (lesson.diagramType === 'web_react') {
        renderWebReactDiagram(ctx, w, h, currentTime);
      }

      // Watermark HUD
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.font = '11px monospace';
      ctx.fillText(`${master.gitDiscipline.toUpperCase()}: CHAPTER ${level.id}`, 20, 30);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${lesson.title}`, 20, 48);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [lesson.diagramType, currentTime, level.id, lesson.title, master.gitDiscipline]);

  // Diagram 1: The Three Trees of Git (Working Dir -> Staging -> Repo)
  const renderGitTreesDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const colW = (w - 80) / 3;
    const stages = [
      { name: '1. Working Directory', desc: 'Untracked / Modified Files', color: '#f59e0b', cmd: 'git add <file> →' },
      { name: '2. Staging Area (Index)', desc: 'Curated Snapshot Queue', color: '#06b6d4', cmd: 'git commit -m "..." →' },
      { name: '3. Git Repository (.git)', desc: 'Permanent Snapshot Commits', color: '#10b981', cmd: 'Immutable History' },
    ];

    stages.forEach((s, idx) => {
      const bx = 25 + idx * (colW + 15);
      const by = 80;
      const bh = h - 140;

      // Box surface
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, colW, bh);
      ctx.fillRect(bx, by, colW, bh);

      // Header
      ctx.fillStyle = s.color;
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.fillText(s.name, bx + 12, by + 28);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(s.desc, bx + 12, by + 46);

      // Internal items animation
      if (idx === 0) {
        // Files on disk (e.g. index.ts, app.css)
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(bx + 20, by + 75, colW - 40, 26);
        ctx.fillRect(bx + 20, by + 115, colW - 40, 26);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('📄 app.ts [Modified]', bx + 28, by + 92);
        ctx.fillText('📄 styles.css [Untracked]', bx + 28, by + 132);
      } else if (idx === 1) {
        // Staged files ready for snapshot
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(bx + 20, by + 75, colW - 40, 32);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('📦 STAGED: app.ts', bx + 28, by + 95);
        ctx.fillStyle = '#06b6d4';
        ctx.font = '10px monospace';
        ctx.fillText('Ready for commit snapshot', bx + 28, by + 135);
      } else if (idx === 2) {
        // Commit chain nodes
        for (let c = 0; c < 3; c++) {
          const cy = by + 85 + c * 42;
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(bx + 40, cy, 14, 0, Math.PI * 2);
          ctx.fill();
          if (c < 2) {
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bx + 40, cy + 14);
            ctx.lineTo(bx + 40, cy + 28);
            ctx.stroke();
          }
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`C${c + 1}: [commit-${c * 4 + 1}]`, bx + 65, cy + 4);
        }
      }

      // Connecting Arrow to next stage
      if (idx < 2) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(s.cmd, bx + colW - 10, by + bh + 25);
      }
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('`git init` activates the repository • `git add` stages • `git commit` preserves history', 40, h - 20);
  };

  // Diagram 2: Git Branching & HEAD Pointer
  const renderGitBranchingDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w * 0.15;
    const cy = h * 0.45;

    // Main Branch Line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(w * 0.85, cy);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Branch: main', w * 0.86, cy + 5);

    // Commit Nodes on Main
    const mainCommits = [
      { x: cx + 60, name: 'C1' },
      { x: cx + 180, name: 'C2' },
      { x: cx + 300, name: 'C3 (Split)' },
      { x: cx + 460, name: 'C4' },
    ];

    mainCommits.forEach((c) => {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(c.x, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(c.name, c.x - 8, cy + 4);
    });

    // Feature Branch splitting off from C3
    const splitX = cx + 300;
    const featY = cy + 90;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(splitX, cy);
    ctx.lineTo(splitX + 60, featY);
    ctx.lineTo(w * 0.78, featY);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Branch: feature-login', w * 0.79, featY + 5);

    // Feature branch commits
    const featCommits = [
      { x: splitX + 110, name: 'F1' },
      { x: splitX + 220, name: 'F2' },
    ];

    featCommits.forEach((fc) => {
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(fc.x, featY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(fc.name, fc.x - 8, featY + 4);
    });

    // Animated HEAD Pointer pointing to currently checked-out branch
    const headX = splitX + 220;
    const headY = featY + 40 + Math.sin(t * 4) * 5;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(headX, headY - 12);
    ctx.lineTo(headX + 8, headY);
    ctx.lineTo(headX - 8, headY);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 12px monospace';
    ctx.fillText('HEAD → feature-login', headX - 55, headY + 18);

    // Rule Banner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('`git switch -c feature-login` creates branch pointer and switches HEAD without copying files', 40, h - 20);
  };

  // Diagram 3: Local Git vs GitHub Remote Cloud (Push, Pull, Clone)
  const renderGitRemotesDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const boxW = 280;
    const boxH = 220;

    // Local Box (Left)
    const localX = 50;
    const localY = 80;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(localX, localY, boxW, boxH);
    ctx.fillRect(localX, localY, boxW, boxH);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.fillText('💻 Local Machine (.git)', localX + 20, localY + 30);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Your private commit history', localX + 20, localY + 52);

    // Local commits
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(localX + 45 + i * 65, localY + 110, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`L${i + 1}`, localX + 38 + i * 65, localY + 114);
    }

    // Remote GitHub Cloud Box (Right)
    const remoteX = w - boxW - 50;
    const remoteY = 80;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(remoteX, remoteY, boxW, boxH);
    ctx.fillRect(remoteX, remoteY, boxW, boxH);

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.fillText('☁️ GitHub Cloud (origin)', remoteX + 20, remoteY + 30);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Central team repository host', remoteX + 20, remoteY + 52);

    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(remoteX + 45 + i * 65, remoteY + 110, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`R${i + 1}`, remoteX + 38 + i * 65, remoteY + 114);
    }

    // Push Arrow (Top)
    const arrowY1 = localY + 80;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(localX + boxW + 15, arrowY1);
    ctx.lineTo(remoteX - 15, arrowY1);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('git push -u origin main ➔', localX + boxW + 40, arrowY1 - 10);

    // Pull Arrow (Bottom)
    const arrowY2 = localY + 160;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(remoteX - 15, arrowY2);
    ctx.lineTo(localX + boxW + 15, arrowY2);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('⬅ git pull (Fetch & Merge)', localX + boxW + 40, arrowY2 + 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('If push fails with non-fast-forward: run `git pull` first to synchronize upstream changes!', 40, h - 20);
  };

  // Diagram 4: Merge Conflicts & Conflict Markers
  const renderGitMergeDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w * 0.5;
    const cy = h * 0.5;

    // Code Editor Window showing conflict markers
    const edW = 560;
    const edH = 240;
    const edX = cx - edW / 2;
    const edY = 70;

    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(edX, edY, edW, edH);
    ctx.fillRect(edX, edY, edW, edH);

    // Editor top bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(edX, edY, edW, 30);
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('⚠️ MERGE CONFLICT in src/auth.ts', edX + 15, edY + 20);

    // Conflict Markers lines
    ctx.font = '12px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('<<<<<<< HEAD (Current local branch: main)', edX + 20, edY + 60);

    ctx.fillStyle = '#67e8f9';
    ctx.fillText('  const sessionTimeout = 3600; // 1 hour token', edX + 20, edY + 85);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('======= (Conflict Divider)', edX + 20, edY + 115);

    ctx.fillStyle = '#f43f5e';
    ctx.fillText('  const sessionTimeout = 7200; // 2 hour token (feature-auth)', edX + 20, edY + 140);

    ctx.fillStyle = '#f43f5e';
    ctx.fillText('>>>>>>> feature-auth (Incoming branch)', edX + 20, edY + 165);

    // Resolution note
    ctx.fillStyle = '#22c55e';
    ctx.fillText('✔ Resolution: choose correct code, delete all <<< === >>> markers, run `git add` & `git commit`', edX + 20, edY + 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('GitHub Pull Requests facilitate team code review before merging into production main.', 40, h - 20);
  };

  // Diagram 5: Time Travel: Log, Stash, Reset vs Revert
  const renderGitTimeTravelDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const colW = (w - 70) / 2;

    // Left Panel: git revert (Safe)
    const p1X = 25;
    const pY = 80;
    const pH = 230;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(p1X, pY, colW, pH);
    ctx.fillRect(p1X, pY, colW, pH);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.fillText('✔ git revert <hash> (SAFE FOR TEAMS)', p1X + 15, pY + 30);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Creates a NEW commit that undoes the bad commit', p1X + 15, pY + 52);

    // Commits chain showing revert
    const commits = ['C1 (Init)', 'C2 (Buggy!)', 'C3 (Revert C2!)'];
    commits.forEach((cm, i) => {
      const cy = pY + 85 + i * 45;
      ctx.fillStyle = i === 1 ? '#ef4444' : i === 2 ? '#22c55e' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(p1X + 45, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(cm, p1X + 75, cy + 4);
    });

    // Right Panel: git stash & git reset
    const p2X = p1X + colW + 20;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(p2X, pY, colW, pH);
    ctx.fillRect(p2X, pY, colW, pH);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.fillText('📦 git stash (TEMPORARY SHELF)', p2X + 15, pY + 30);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Temporarily shelves dirty WIP code to switch branches', p2X + 15, pY + 52);

    ctx.fillStyle = '#fde68a';
    ctx.fillRect(p2X + 25, pY + 80, colW - 50, 40);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('Stash Stack: [WIP uncommitted edits]', p2X + 35, pY + 105);

    ctx.fillStyle = '#facc15';
    ctx.font = '11px monospace';
    ctx.fillText('`git stash pop` restores edits back to working tree', p2X + 25, pY + 150);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('⚠️ `git reset --hard` erases local commits (avoid on shared branches!)', p2X + 25, pY + 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('`git log --oneline` inspects history • `git stash` shelves work • `git revert` safely rolls back', 40, h - 20);
  };

  // Python Diagram 1: Variables, Dynamic Typing & Memory Pointers
  const renderPyBasicsDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Left: Variable Tags / Stack Names
    const varX = 40;
    const vars = [
      { name: 'hero_name', val: '"Guido"', type: 'str', color: '#38bdf8' },
      { name: 'level', val: '42', type: 'int', color: '#f59e0b' },
      { name: 'ratio', val: '3.14', type: 'float', color: '#10b981' },
      { name: 'is_active', val: 'True', type: 'bool', color: '#ec4899' },
    ];

    // Left Column Header
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('VARIABLE LABELS (Names)', varX, 90);

    // Right Column: Memory Objects (Heap)
    const memX = w - 380;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('OBJECTS IN HEAP MEMORY', memX, 90);

    vars.forEach((v, i) => {
      const y = 110 + i * 55;
      // Variable tag
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(varX, y, 160, 40);
      ctx.fillRect(varX, y, 160, 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(v.name, varX + 12, y + 25);

      // Memory Object Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = v.color;
      ctx.strokeRect(memX, y, 320, 40);
      ctx.fillRect(memX, y, 320, 40);

      ctx.fillStyle = v.color;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(v.val, memX + 15, y + 25);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`type: <class '${v.type}'>`, memX + 160, y + 25);

      // Animated pointer arrow connecting variable to heap object
      const pulse = Math.sin(t * 3 + i) * 4;
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(varX + 160, y + 20);
      ctx.lineTo(memX - 10 + pulse, y + 20);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.moveTo(memX - 10 + pulse, y + 16);
      ctx.lineTo(memX - 2 + pulse, y + 20);
      ctx.lineTo(memX - 10 + pulse, y + 24);
      ctx.closePath();
      ctx.fill();
    });

    // Console output box at bottom
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('PYTHON INTERACTIVE REPL:', 55, h - 110);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px monospace';
    ctx.fillText('>>> print(f"{hero_name} reached level {level}!")', 55, h - 90);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('Guido reached level 42!', 55, h - 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Variables are references to memory objects. `type()` checks data type dynamically at runtime.', 40, h - 20);
  };

  // Python Diagram 2: Control Flow & Indentation
  const renderPyControlDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w * 0.32;
    // Diamond Decision Node
    const dy = 110;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, dy - 25);
    ctx.lineTo(cx + 100, dy);
    ctx.lineTo(cx, dy + 25);
    ctx.lineTo(cx - 100, dy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('if health > 0:', cx - 45, dy + 4);

    // Branch True (Right)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx + 100, dy);
    ctx.lineTo(cx + 180, dy);
    ctx.lineTo(cx + 180, dy + 60);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('True (4 spaces)', cx + 110, dy - 8);

    ctx.fillStyle = 'rgba(22, 101, 52, 0.5)';
    ctx.strokeStyle = '#22c55e';
    ctx.fillRect(cx + 120, dy + 60, 120, 36);
    ctx.strokeRect(cx + 120, dy + 60, 120, 36);
    ctx.fillStyle = '#86efac';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('hero.attack()', cx + 130, dy + 83);

    // Branch False (Down)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 100, dy);
    ctx.lineTo(cx - 160, dy);
    ctx.lineTo(cx - 160, dy + 60);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('False (else:)', cx - 155, dy - 8);

    ctx.fillStyle = 'rgba(127, 29, 29, 0.5)';
    ctx.strokeStyle = '#ef4444';
    ctx.fillRect(cx - 220, dy + 60, 120, 36);
    ctx.strokeRect(cx - 220, dy + 60, 120, 36);
    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('game_over()', cx - 210, dy + 83);

    // Right Side: Loop Engine
    const loopX = w * 0.72;
    const loopY = 150;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(loopX - 110, 80, 220, 170);
    ctx.fillRect(loopX - 110, 80, 220, 170);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('LOOP ENGINE', loopX - 50, 105);

    // Cycling Loop Ring
    const angle = (t * 2) % (Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(loopX, loopY + 20, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(loopX, loopY + 20, 38, angle, angle + 1.2);
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('for item in inventory:', loopX - 85, loopY + 75);

    // Bottom Indentation Rules
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px monospace';
    ctx.fillText('for i in range(3):', 60, h - 105);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('    # EXACTLY 4 SPACES INDENTATION (No brackets)', 60, h - 85);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('    print(f"Step {i}")', 60, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Python enforces indentation (PEP 8 recommends 4 spaces) to define execution blocks.', 40, h - 20);
  };

  // Python Diagram 3: Functions, Parameters & Scope Sandbox
  const renderPyFunctionsDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const boxW = 500;
    const boxH = 220;
    const bx = (w - boxW) / 2;
    const by = 80;

    // Outer Function Sandbox
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(bx, by, boxW, boxH);
    ctx.fillRect(bx, by, boxW, boxH);

    // Function Signature Header
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('def calculate_spell_dmg(power, multiplier=1.5):', bx + 20, by + 30);

    // Inputs (Left Port)
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('INPUT PARAMETERS ➔', bx + 20, by + 65);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('power = 100, multiplier = 1.5 (default)', bx + 20, by + 85);

    // Local Scope Sandbox
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx + 20, by + 105, boxW - 40, 60);
    ctx.fillRect(bx + 20, by + 105, boxW - 40, 60);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px monospace';
    ctx.fillText('total = power * multiplier   # Local variable created in scope', bx + 35, by + 130);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('return total                 # Sends value back to caller', bx + 35, by + 150);

    // Return arrow pointing outside
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx + boxW - 80, by + 145);
    ctx.lineTo(bx + boxW + 40, by + 145);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('RETURNS 150', bx + boxW - 60, by + 195);

    // Scope rule callout
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('⚠️ SCOPE LAW: Variables created inside a function are LOCAL.', 60, h - 100);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Accessing `total` outside the function raises `NameError: name \'total\' is not defined`.', 60, h - 80);
    ctx.fillStyle = '#a5b4fc';
    ctx.fillText('Use default parameters (`multiplier=1.5`) to provide optional values.', 60, h - 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('`def` declares functions, parameters pass data, and `return` delivers output.', 40, h - 20);
  };

  // Python Diagram 4: Collections (List, Dict, Tuple, Set)
  const renderPyCollectionsDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cardW = (w - 100) / 4;
    const cy = 80;
    const ch = 200;

    const collections = [
      {
        title: 'List [ ]',
        tag: 'MUTABLE & ORDERED',
        color: '#38bdf8',
        example: 'items = [10, 20, 30]',
        access: 'items[0] -> 10',
        method: 'items.append(40)',
      },
      {
        title: 'Tuple ( )',
        tag: 'IMMUTABLE LOCKED',
        color: '#f59e0b',
        example: 'pos = (120, 85)',
        access: 'pos[0] -> 120',
        method: '🔒 Cannot modify!',
      },
      {
        title: 'Dict { }',
        tag: 'KEY-VALUE LOOKUP',
        color: '#10b981',
        example: 'hero = {"hp": 100}',
        access: 'hero["hp"] -> 100',
        method: 'hero.get("mp", 0)',
      },
      {
        title: 'Set { }',
        tag: 'UNIQUE NO DUPLICATES',
        color: '#a855f7',
        example: 's = {1, 2, 2, 3}',
        access: 'Result: {1, 2, 3}',
        method: 's.add(4) • Fast O(1)',
      },
    ];

    collections.forEach((col, i) => {
      const cx = 35 + i * (cardW + 10);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = col.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, cy, cardW, ch);
      ctx.fillRect(cx, cy, cardW, ch);

      ctx.fillStyle = col.color;
      ctx.font = 'bold 15px Cinzel, serif';
      ctx.fillText(col.title, cx + 15, cy + 30);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(col.tag, cx + 15, cy + 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(col.example, cx + 12, cy + 85);

      ctx.fillStyle = '#67e8f9';
      ctx.fillText(col.access, cx + 12, cy + 120);

      ctx.fillStyle = '#fde68a';
      ctx.fillText(col.method, cx + 12, cy + 155);
    });

    // Comparison summary bar
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('BEST PRACTICES FOR PYTHON COLLECTIONS:', 55, h - 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('• Use `dict.get(key, default)` to avoid crashing on KeyError.', 55, h - 85);
    ctx.fillText('• Use Lists when order matters; Sets when checking membership or uniqueness; Tuples for fixed records.', 55, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Python data structures: Lists are mutable arrays, Dicts are hash-maps, Tuples are immutable.', 40, h - 20);
  };

  // Python Diagram 5: OOP Classes, Instances & Inheritance
  const renderPyClassesDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const boxW = 340;
    const boxH = 200;

    // Class Blueprint (Left)
    const bx = 45;
    const by = 80;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(bx, by, boxW, boxH);
    ctx.fillRect(bx, by, boxW, boxH);

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('class Monster:  # BLUEPRINT', bx + 15, by + 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('  def __init__(self, name, hp):', bx + 15, by + 60);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('    self.name = name', bx + 25, by + 85);
    ctx.fillText('    self.hp = hp', bx + 25, by + 105);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('  def take_damage(self, dmg):', bx + 15, by + 140);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('    self.hp -= dmg', bx + 25, by + 165);

    // Instances spawned on the right
    const instX = bx + boxW + 80;
    const instY1 = by + 20;
    const instY2 = by + 115;

    // Instantiation arrow
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx + boxW + 10, by + 70);
    ctx.lineTo(instX - 15, instY1 + 25);
    ctx.moveTo(bx + boxW + 10, by + 130);
    ctx.lineTo(instX - 15, instY2 + 25);
    ctx.stroke();

    // Instance 1
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(instX, instY1, 260, 60);
    ctx.fillRect(instX, instY1, 260, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('m1 = Monster("Drake", 100)', instX + 15, instY1 + 25);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('m1.name -> "Drake", m1.hp -> 100', instX + 15, instY1 + 45);

    // Instance 2
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#a855f7';
    ctx.strokeRect(instX, instY2, 260, 60);
    ctx.fillRect(instX, instY2, 260, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('m2 = Monster("Golem", 250)', instX + 15, instY2 + 25);
    ctx.fillStyle = '#c084fc';
    ctx.fillText('m2.name -> "Golem", m2.hp -> 250', instX + 15, instY2 + 45);

    // Rule Banner
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('OBJECT ORIENTED FOUNDATIONS:', 55, h - 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('• `__init__` is the constructor invoked automatically when a new instance is created.', 55, h - 85);
    ctx.fillText('• `self` is an explicit reference to the current instance whose method is being called.', 55, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Classes are blueprints; `__init__` initializes instance state; `self` binds attributes to each object.', 40, h - 20);
  };

  // Web Dev Diagram 1: Semantic HTML5 Structure
  const renderWebHtmlDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const pageW = 480;
    const pageH = 220;
    const px = (w - pageW) / 2;
    const py = 75;

    // Browser Window Container
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, pageW, pageH);
    ctx.fillRect(px, py, pageW, pageH);

    // Browser top bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px, py, pageW, 26);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('🌐 https://crystal-village.dev/adventure', px + 25, py + 17);

    // <header> + <nav>
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.fillRect(px + 15, py + 36, pageW - 30, 32);
    ctx.strokeRect(px + 15, py + 36, pageW - 30, 32);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('<header>  •  <nav> [ Home | Codex | Inventory ] </nav>', px + 30, py + 57);

    // <main> section
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10b981';
    ctx.fillRect(px + 15, py + 78, pageW - 30, 95);
    ctx.strokeRect(px + 15, py + 78, pageW - 30, 95);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('<main>  -- Unique central document content', px + 30, py + 98);

    // Inner <article>
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.strokeStyle = '#f59e0b';
    ctx.fillRect(px + 30, py + 110, pageW - 60, 50);
    ctx.strokeRect(px + 30, py + 110, pageW - 60, 50);
    ctx.fillStyle = '#fde68a';
    ctx.fillText('<article>  <h1>The Ancient Shrines</h1>  <p>...</p>', px + 45, py + 135);

    // <footer>
    ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.strokeStyle = '#64748b';
    ctx.fillRect(px + 15, py + 180, pageW - 30, 28);
    ctx.strokeRect(px + 15, py + 180, pageW - 30, 28);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('<footer>  © 2026 Crystal Village  </footer>', px + 30, py + 198);

    // Accessibility notes
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('SEMANTIC HTML5 ACCESSIBILITY & SEO:', 55, h - 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('• Use `<main>` exactly once per page to hold the primary view content.', 55, h - 85);
    ctx.fillText('• Always provide informative `alt="..."` descriptions on `<img>` tags for assistive screen readers.', 55, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Semantic tags communicate structure to search engines and screen readers instead of empty <div> tags.', 40, h - 20);
  };

  // Web Dev Diagram 2: CSS Box Model & Flexbox
  const renderWebCssDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w * 0.35;
    const cy = 180;

    // Margin Box
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.fillRect(cx - 160, cy - 100, 320, 200);
    ctx.strokeRect(cx - 160, cy - 100, 320, 200);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('Margin (Outer Spacing)', cx - 150, cy - 80);

    // Border Box
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.strokeStyle = '#06b6d4';
    ctx.fillRect(cx - 120, cy - 70, 240, 140);
    ctx.strokeRect(cx - 120, cy - 70, 240, 140);
    ctx.fillStyle = '#22d3ee';
    ctx.fillText('Border', cx - 110, cy - 50);

    // Padding Box
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.strokeStyle = '#10b981';
    ctx.fillRect(cx - 85, cy - 45, 170, 90);
    ctx.strokeRect(cx - 85, cy - 45, 170, 90);
    ctx.fillStyle = '#34d399';
    ctx.fillText('Padding (Inner Spacing)', cx - 75, cy - 25);

    // Content Box
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx - 45, cy - 10, 90, 45);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('Content', cx - 25, cy + 15);

    // Flexbox Visualizer (Right)
    const fx = w * 0.72;
    const fy = 90;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(fx - 110, fy, 220, 180);
    ctx.fillRect(fx - 110, fy, 220, 180);

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('FLEXBOX CONTAINER', fx - 70, fy + 25);

    // Flex Items
    const items = ['Item 1', 'Item 2', 'Item 3'];
    items.forEach((it, idx) => {
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(fx - 90 + idx * 65, fy + 65, 50, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(it, fx - 85 + idx * 65, fy + 92);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('justify-content: space-between', fx - 95, fy + 135);
    ctx.fillText('align-items: center', fx - 95, fy + 155);

    // Footer summary
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('CSS LAYOUT ESSENTIALS:', 55, h - 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('• `box-sizing: border-box` makes width include padding & border to prevent unexpected overflow.', 55, h - 85);
    ctx.fillText('• Flexbox distributes items along main axis (`justify-content`) and cross axis (`align-items`).', 55, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('The Box Model (Margin, Border, Padding, Content) controls spacing; `border-box` simplifies sizing.', 40, h - 20);
  };

  // Web Dev Diagram 3: DOM Tree & Event Listeners
  const renderWebJsDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w * 0.35;
    // DOM Tree nodes
    const rootX = cx;
    const rootY = 95;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(rootX, rootY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('document', rootX - 25, rootY + 4);

    // Children
    const c1X = cx - 90;
    const c2X = cx + 90;
    const childY = rootY + 70;

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rootX, rootY + 16);
    ctx.lineTo(c1X, childY - 16);
    ctx.moveTo(rootX, rootY + 16);
    ctx.lineTo(c2X, childY - 16);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(c1X, childY, 15, 0, Math.PI * 2);
    ctx.arc(c2X, childY, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('<body>', c1X - 16, childY + 3);
    ctx.fillText('<head>', c2X - 16, childY + 3);

    // Target Button Element with Event Listener
    const btnX = c1X;
    const btnY = childY + 70;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(c1X, childY + 15);
    ctx.lineTo(btnX, btnY - 15);
    ctx.stroke();

    // Pulsing Click ripple
    const ripple = (t * 4) % 20;
    ctx.strokeStyle = `rgba(236, 72, 153, ${1 - ripple / 20})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(btnX, btnY, 15 + ripple, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(btnX, btnY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('<button>', btnX - 22, btnY + 3);

    // Code interaction panel (Right)
    const rx = w * 0.68;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.strokeRect(rx - 130, 85, 260, 175);
    ctx.fillRect(rx - 130, 85, 260, 175);

    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('JAVASCRIPT EVENT LISTENER', rx - 105, 110);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('// 1. Select the DOM node', rx - 110, 135);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('const btn = document.querySelector("#play");', rx - 110, 155);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('// 2. Attach click event callback', rx - 110, 185);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('btn.addEventListener("click", () => {', rx - 110, 205);
    ctx.fillText('    castCrystalMagic();', rx - 90, 225);
    ctx.fillText('});', rx - 110, 245);

    // Bottom banner
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('DOM QUERY & EVENT PROPAGATION:', 55, h - 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('• `document.querySelector()` retrieves elements using CSS selector syntax.', 55, h - 85);
    ctx.fillText('• `addEventListener()` listens for events (click, keydown, submit) without overwriting existing handlers.', 55, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('JavaScript connects interactivity to HTML by selecting DOM nodes and reacting to events.', 40, h - 20);
  };

  // Web Dev Diagram 4: Asynchronous JavaScript (Promises & Fetch)
  const renderWebApisDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const lx = 60;
    const rx = w - 240;
    const cy = 130;

    // Client Browser Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(lx, cy - 50, 160, 130);
    ctx.fillRect(lx, cy - 50, 160, 130);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('CLIENT BROWSER', lx + 15, cy - 25);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('fetch("/api/data")', lx + 15, cy + 5);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('await response.json()', lx + 15, cy + 30);

    // Cloud Server Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(rx, cy - 50, 160, 130);
    ctx.fillRect(rx, cy - 50, 160, 130);

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('API BACKEND', rx + 25, cy - 25);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('HTTP 200 OK', rx + 25, cy + 5);
    ctx.fillStyle = '#fde68a';
    ctx.fillText('JSON: { "ok": true }', rx + 15, cy + 30);

    // Animated Request Packet
    const p1 = (t * 80) % (rx - (lx + 160));
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx + 160, cy - 10);
    ctx.lineTo(rx, cy - 10);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(lx + 160 + p1 - 10, cy - 18, 20, 16);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('REQ', lx + 160 + p1 - 8, cy - 6);

    // Animated Response Packet
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx, cy + 40);
    ctx.lineTo(lx + 160, cy + 40);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.fillRect(rx - p1 - 10, cy + 32, 20, 16);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('RES', rx - p1 - 8, cy + 44);

    // Promise Lifecycle Box
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('PROMISE LIFECYCLE: PENDING ➔ RESOLVED OR REJECTED', 55, h - 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('• `async / await` allows asynchronous code to read linearly without callback hell.', 55, h - 85);
    ctx.fillText('• Always wrap async operations in `try { ... } catch (err) { ... }` to safely handle network failures.', 55, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('`fetch()` initiates network requests; `async/await` pauses until Promises resolve cleanly.', 40, h - 20);
  };

  // Web Dev Diagram 5: Modern Frontend & React Component Architecture
  const renderWebReactDiagram = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const rootX = w * 0.5;
    const rootY = 90;

    // Parent <App />
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(rootX - 110, rootY - 20, 220, 48);
    ctx.fillRect(rootX - 110, rootY - 20, 220, 48);

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('<VillageGame /> (Parent)', rootX - 90, rootY + 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('useState: [level, setLevel]', rootX - 90, rootY + 20);

    // Children Components
    const c1X = rootX - 180;
    const c2X = rootX + 180;
    const cy = rootY + 95;

    // Connecting Props arrows
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rootX - 40, rootY + 28);
    ctx.lineTo(c1X + 40, cy - 20);
    ctx.moveTo(rootX + 40, rootY + 28);
    ctx.lineTo(c2X - 40, cy - 20);
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = '9px monospace';
    ctx.fillText('props: { hero }', rootX - 150, rootY + 60);
    ctx.fillText('props: { onBattle }', rootX + 60, rootY + 60);

    // Child 1: <HeroCard />
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(c1X - 90, cy - 20, 180, 50);
    ctx.fillRect(c1X - 90, cy - 20, 180, 50);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('<HeroProfile />', c1X - 75, cy + 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9px monospace';
    ctx.fillText('Renders avatar & stats', c1X - 75, cy + 20);

    // Child 2: <BattleArena />
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#10b981';
    ctx.strokeRect(c2X - 90, cy - 20, 180, 50);
    ctx.fillRect(c2X - 90, cy - 20, 180, 50);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('<BattleArena />', c2X - 75, cy + 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9px monospace';
    ctx.fillText('Triggers victory callbacks', c2X - 75, cy + 20);

    // Bottom Rules
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.fillRect(40, h - 130, w - 80, 80);
    ctx.strokeRect(40, h - 130, w - 80, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('REACT STATE & COMPONENT LIFECYCLE:', 55, h - 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('• Data flows downwards via props; events flow upwards via callback functions.', 55, h - 85);
    ctx.fillText('• When component state changes, React recalculates the Virtual DOM diff to update the real browser DOM.', 55, h - 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('Components encapsulate UI and logic. Updating state triggers automatic re-renders.', 40, h - 20);
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl overflow-y-auto selection:bg-cyan-500 selection:text-black"
    >
      <div className="relative max-w-5xl w-full bg-slate-900 border border-cyan-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
                {master.gitDiscipline} Lecture with {master.name} • Chapter {level.id}
              </span>
              <h2 className="text-lg md:text-xl font-bold font-['Cinzel'] text-white">
                {lesson.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReturnToVillage}
              className="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Exit to Village
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full aspect-video bg-black overflow-hidden group">
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full object-contain block"
          />

          {/* Video Control Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col gap-2">
            <div className="relative w-full flex items-center">
              <input
                type="range"
                min={0}
                max={totalDuration}
                step={0.1}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between text-slate-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleTogglePlay}
                  className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-transform active:scale-90 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={handleReplay}
                  title="Replay from start"
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono text-slate-300">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSpeed(speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 cursor-pointer"
                >
                  {speed}x
                </button>

                <button
                  onClick={handleToggleFullscreen}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Key Concepts & Complete Lecture Action */}
        <div className="p-6 bg-slate-950/70 border-t border-slate-800 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              <span>Core {master.gitDiscipline} Principles Needed for Upcoming Monster Encounter</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {lesson.keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-72 flex-shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Lecture Status
              </span>
              <div className="flex items-center gap-2 text-sm">
                {hasCompleted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {master.gitDiscipline} Mastery Achieved
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono text-xs">
                    Watch lecture to complete training
                  </span>
                )}
              </div>
            </div>

            {/* Completing lecture returns player to map so they can walk forward to the Monster! */}
            <button
              onClick={() => {
                soundEngine.playCrystalChime();
                onCompleteLesson();
              }}
              disabled={!hasCompleted}
              className={`w-full mt-4 py-3.5 px-4 rounded-xl font-bold font-['Cinzel'] text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Complete Lecture & Advance Forward</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
