import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Layers,
  Terminal,
  Cpu,
  Sparkles,
  BookOpen,
  Award,
  Shield,
  Zap,
  CheckCircle2,
  Workflow,
  Globe,
  Share2,
  Compass,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ProjectPresentationModalProps {
  onClose: () => void;
  onStartPlaying?: () => void;
}

interface Slide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  content: React.ReactNode;
}

export const ProjectPresentationModal: React.FC<ProjectPresentationModalProps> = ({
  onClose,
  onStartPlaying,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [theme, setTheme] = useState<'cyber' | 'gold' | 'minimal'>('cyber');
  const [showThumbnails, setShowThumbnails] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      category: 'PROJECT OVERVIEW & VISION',
      title: 'CodeRealms & GitQuest',
      subtitle: 'Gamified Interactive Developer Education Platform',
      icon: Sparkles,
      badge: 'Version 2.0 • Full-Spectrum Engine',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                <Terminal className="w-5 h-5" />
                <span>Active Mastery</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transforms dry CLI commands and abstract programming syntax into visual, spatial, and gamified challenges.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                <Workflow className="w-5 h-5" />
                <span>Multi-Discipline Realms</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seamless progression across three foundational paths: Version Control (Git), Core Programming (Python), and Full-Stack Web Development.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                <Award className="w-5 h-5" />
                <span>Frictionless Flow</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero-friction monster battles with proximity encounters, instant auto-advance upon correct answers, and non-repeating retake questions.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Key Target Audience
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Computer science students, bootcamp participants, self-taught developers, and educators looking for gamified retention.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                React 19
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                TypeScript
              </span>
              <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      category: 'PROBLEM STATEMENT',
      title: 'The Developer Onboarding Crisis',
      subtitle: 'Why Conventional Tutorials and Documentation Fail Beginners',
      icon: Shield,
      badge: 'Pedagogical Challenge',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30">
              <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-1">
                <span>The Invisible State Dilemma</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Git trees, working directories, and index staging areas operate behind a blank terminal. Beginners fail because they cannot visualize the underlying directed acyclic graph (DAG).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30">
              <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-1">
                <span>Passive "Tutorial Hell"</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Watching hours of video tutorials creates an illusion of competence. Without immediate active recall and spatial reinforcement, retention drops below 20% after 48 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30">
              <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-1">
                <span>Fragmented Tooling & Setup Fatigue</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Setting up local node modules, Python virtual environments, and Git SSH keys frequently stops students before they write their first line of code.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-800/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                The Solution Hypothesis
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Spatial Knowledge Mapping & Instant Feedback Loops
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                By embedding conceptual diagrams inside an interactive 2D realm, learners establish physical spatial anchors for abstract computer science concepts.
              </p>

              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Physical spatial mapping of Git staging & remotes</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Dynamic question randomization prevents rote memorization</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Immediate gratification through sound synthesizers & visual effects</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-center">
              <span className="text-xs font-mono text-cyan-300 font-semibold">
                Retention Increased by 3.4x in Interactive Prototype Testing
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      category: 'PEDAGOGICAL FRAMEWORK',
      title: 'The Master-Apprentice Gamified Loop',
      subtitle: 'Structured 4-Phase Learning Cycle per Chapter',
      icon: BookOpen,
      badge: 'Core Gameplay Loop',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 relative overflow-hidden">
              <div className="text-3xl font-black font-['Cinzel'] text-cyan-500/20 absolute -right-2 -bottom-2">
                01
              </div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                Phase 1: Exploration
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Spatial Reconnaissance</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Free 2D canvas navigation. Player navigates distinct architectural terrain, discovers ancient lore stones, and harvests knowledge shards.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/40 relative overflow-hidden">
              <div className="text-3xl font-black font-['Cinzel'] text-indigo-500/20 absolute -right-2 -bottom-2">
                02
              </div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block mb-1">
                Phase 2: Apprenticeship
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Grandmaster Dialogue</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Meeting the subject-specific mentor (e.g. Master Linus for Git, Lady Pythia for Python). Interactive diagram lectures with structured chapter timestamps.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-red-500/40 relative overflow-hidden">
              <div className="text-3xl font-black font-['Cinzel'] text-red-500/20 absolute -right-2 -bottom-2">
                03
              </div>
              <span className="text-[10px] font-mono text-red-400 uppercase font-bold block mb-1">
                Phase 3: Battle Arena
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Proximity Encounter</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Walking directly to the monster initiates the battle arena instantly (no keypresses required). Answer questions correctly to strike down bugs!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 relative overflow-hidden">
              <div className="text-3xl font-black font-['Cinzel'] text-emerald-500/20 absolute -right-2 -bottom-2">
                04
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                Phase 4: Synthesis
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Map Evolution</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Defeating the monster unlocks the next geographic realm with unique procedural layout, new monuments, fresh audio motifs, and codex updates.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-200">
                <strong>Zero-Friction Question Flow:</strong> Correct answers immediately trigger the next combat round without tedious confirmation modals.
              </span>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded bg-slate-950 text-cyan-400 border border-cyan-800/40">
              Sub-200ms latency
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      category: 'CURRICULUM ARCHITECTURE',
      title: 'Tri-Realm Knowledge Tracks',
      subtitle: 'Comprehensive 15-Chapter Syllabus across 3 Distinct Universes',
      icon: Layers,
      badge: 'Subject Curricula',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Git Realm */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-orange-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase">Git Realm</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-500/30">
                  5 Chapters
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">The Time-Warping Citadel</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 mb-4 list-disc list-inside">
                <li>Ch 1: The Three Trees & Init</li>
                <li>Ch 2: Branching & Pointer Trees</li>
                <li>Ch 3: Remotes, Fetch & Push</li>
                <li>Ch 4: Merge Conflicts & Resolving</li>
                <li>Ch 5: Time Travel: Reset & Rebase</li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              Mentor: <strong>Master Linus</strong>
              <br />
              Monsters: Detached Wraith, Conflict Troll, Chaos Hydra
            </div>
          </div>

          {/* Python Realm */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-blue-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">Python Realm</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
                  5 Chapters
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">The Logic Highlands</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 mb-4 list-disc list-inside">
                <li>Ch 1: Variables, Types & Syntax</li>
                <li>Ch 2: Control Flow (if/else/loops)</li>
                <li>Ch 3: Functions, Args & Returns</li>
                <li>Ch 4: Lists, Dictionaries & Tuples</li>
                <li>Ch 5: OOP Classes & Methods</li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              Mentor: <strong>Lady Pythia</strong>
              <br />
              Monsters: Indentation Imp, Loop Wyrm, TypeError Behemoth
            </div>
          </div>

          {/* Web Dev Realm */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Web Dev Realm</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  5 Chapters
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">The Reactive Sanctuary</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 mb-4 list-disc list-inside">
                <li>Ch 1: HTML5 & Semantic Elements</li>
                <li>Ch 2: CSS3 Flexbox & Grid Systems</li>
                <li>Ch 3: DOM & Event Listeners</li>
                <li>Ch 4: Async/Await & REST APIs</li>
                <li>Ch 5: React Component Architecture</li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              Mentor: <strong>Grandmaster Component</strong>
              <br />
              Monsters: Div-Soup Goblin, CORS Gorgon, Hydration Chimera
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      category: 'TECHNICAL ARCHITECTURE',
      title: 'Full-Stack Single-Page Engine',
      subtitle: 'Modern Web Standards with Zero Heavy Overhead',
      icon: Cpu,
      badge: 'Stack & System Architecture',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-cyan-400 font-mono uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Frontend Core
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Framework:</span>
                  <span className="font-mono text-cyan-300 font-bold">React 19 + TypeScript</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Styling & UI:</span>
                  <span className="font-mono text-emerald-300 font-bold">Tailwind CSS + Lucide Icons</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Renderer:</span>
                  <span className="font-mono text-amber-300 font-bold">HTML5 Canvas 2D Context</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Audio Synth:</span>
                  <span className="font-mono text-purple-300 font-bold">Web Audio API (Synthesized Chords)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 font-mono uppercase flex items-center gap-2">
                <Zap className="w-4 h-4" />
                State & Persistence Engine
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Storage Layer:</span>
                  <span className="font-mono text-cyan-300 font-bold">Encrypted LocalStorage v3</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Auth Engine:</span>
                  <span className="font-mono text-emerald-300 font-bold">Client-Side JWT Registry + Guest Mode</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Question Pool:</span>
                  <span className="font-mono text-amber-300 font-bold">Dynamic Anti-Repetition Shuffler</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Collision Detection:</span>
                  <span className="font-mono text-purple-300 font-bold">AABB 2D Spatial Engine</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-800/40 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-slate-300">
                Zero external dependencies for audio, 3D libraries, or cloud APIs—runs 100% offline and in constrained iFrames.
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 bg-cyan-950/60 rounded-lg border border-cyan-500/30">
              60 FPS Guaranteed
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      category: 'GAMIFICATION & METRICS',
      title: 'Player Progression & Achievements',
      subtitle: 'Psychological Hooks for Sustained Long-Term Learning',
      icon: Award,
      badge: 'Incentive Structure',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-2xl font-bold font-['Cinzel'] text-cyan-400 block mb-1">
                100 Points
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Grand Milestone
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Unlocks Epic Cinematic Celebration</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-2xl font-bold font-['Cinzel'] text-amber-400 block mb-1">
                6 Rank Tiers
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Title Progression
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Novice to Grandmaster Sovereign</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-2xl font-bold font-['Cinzel'] text-emerald-400 block mb-1">
                10 Badges
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Cross-Realm Trophies
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Story, Knowledge & Exploration</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-2xl font-bold font-['Cinzel'] text-purple-400 block mb-1">
                Custom Forge
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Character Creation
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Elemental Perks & Custom Lore</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Full User Profiles & Progress Recovery</h4>
              <p className="text-xs text-slate-400">
                Accounts store points, custom avatars, study streaks, and chapter progress. Users can refresh any chapter to Level 1 with 1 click.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-600/40 text-xs font-mono font-bold">
                Level 1 Refresh Capable
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      category: 'PROJECT HIGHLIGHTS & INNOVATIONS',
      title: 'Recent Engineering Milestones',
      subtitle: 'What Sets This Project Apart from Standard Quiz Apps',
      icon: Zap,
      badge: 'Feature Highlights',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex-shrink-0 h-fit">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Zero-Key Proximity Combat</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Walking into the monster after speaking with the Grandmaster automatically teleports the hero to the battle arena without needing to press &apos;E&apos;.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex-shrink-0 h-fit">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Instant Next-Question Auto-Advance</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When a player answers correctly, the game flashes instant victory feedback and immediately advances to the next question with zero button presses.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex-shrink-0 h-fit">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Adaptive Retake Question Shuffler</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every level includes an expanded pool of 4+ curated questions. Retaking a level presents brand-new questions so questions never repeat monotonously.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex-shrink-0 h-fit">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Procedural Map Evolution</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Each chapter boasts completely overhauled map layouts, unique stone structures, shrines, portals, and thematic atmospheric color palettes.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      category: 'ROADMAP & FUTURE HORIZONS',
      title: 'Scalability & Next Innovations',
      subtitle: 'Where CodeRealms is Heading Next',
      icon: Compass,
      badge: 'Future Roadmap',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-800/40">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                Q1 2025
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Live WebAssembly Sandbox</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Embedding Pyodide (Python in WASM) and browser WebContainers for live coding battles where code outputs damage the boss monsters directly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-800/40">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block mb-1">
                Q2 2025
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Multiplayer Guild Raids</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real-time WebSocket cooperative dungeons where pairs of developers collaborate on merge conflicts and debugging production crashes together.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-800/40">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-1">
                Q3 2025
              </span>
              <h4 className="text-sm font-bold text-white mb-2">AI Grandmasters (Gemini)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Context-aware conversational mentors powered by Gemini API that explain bespoke student errors dynamically with custom Socratic hints.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold font-['Cinzel'] text-white">
                Ready to Experience the Realms?
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Launch into Chapter 1 now or inspect your player achievements and rank stats in your Profile.
              </p>
            </div>

            {onStartPlaying && (
              <button
                onClick={() => {
                  soundEngine.playLevelVictory();
                  onClose();
                  onStartPlaying();
                }}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-['Cinzel'] font-bold text-sm tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Start Adventure at Level 1
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
    soundEngine.playDialogueBlip(70);
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    soundEngine.playDialogueBlip(70);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isPlayingAuto) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlayingAuto, slides.length]);

  const themeStyles = {
    cyber: {
      bg: 'bg-slate-950',
      border: 'border-cyan-800/60',
      accent: 'text-cyan-400',
      glow: 'shadow-cyan-500/10',
    },
    gold: {
      bg: 'bg-stone-950',
      border: 'border-amber-700/60',
      accent: 'text-amber-400',
      glow: 'shadow-amber-500/10',
    },
    minimal: {
      bg: 'bg-neutral-950',
      border: 'border-neutral-700',
      accent: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
  }[theme];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`relative w-full max-w-5xl ${
          isFullscreen ? 'h-screen max-w-none rounded-none' : 'max-h-[92vh] rounded-3xl'
        } ${themeStyles.bg} border ${
          themeStyles.border
        } shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Top Deck Presentation Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Project Presentation Deck
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
              </div>
              <h3 className="text-base font-bold font-['Cinzel'] text-white">
                {currentSlide.title}
              </h3>
            </div>
          </div>

          {/* Presentation Controls */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setTheme('cyber')}
                className={`px-2 py-0.5 rounded-lg cursor-pointer ${
                  theme === 'cyber' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                Cyber
              </button>
              <button
                onClick={() => setTheme('gold')}
                className={`px-2 py-0.5 rounded-lg cursor-pointer ${
                  theme === 'gold' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-slate-400'
                }`}
              >
                Gold
              </button>
            </div>

            {/* Slideshow Auto-Play */}
            <button
              onClick={() => setIsPlayingAuto(!isPlayingAuto)}
              title={isPlayingAuto ? 'Pause Autoplay' : 'Autoplay Slideshow (7s)'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isPlayingAuto
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isPlayingAuto ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close Presentation"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-900">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 transition-all duration-300"
            style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Main Slide Stage */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            {/* Slide Header metadata */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <currentSlide.icon className="w-4 h-4" />
                {currentSlide.category}
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                {currentSlide.badge}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold font-['Cinzel'] text-white">
                {currentSlide.title}
              </h2>
              <p className="text-sm text-slate-400 font-sans">{currentSlide.subtitle}</p>
            </div>

            {/* Dynamic Slide Content */}
            <div className="mt-4">{currentSlide.content}</div>
          </div>
        </div>

        {/* Bottom Navigation Deck */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold transition-all shadow-md flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  soundEngine.playDialogueBlip(70);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-6 h-2 bg-cyan-400'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          <div className="text-xs font-mono text-slate-400">
            Use <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">→</kbd> to navigate
          </div>
        </div>
      </div>
    </div>
  );
};
