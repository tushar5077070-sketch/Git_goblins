import { SubjectId, LevelData } from '../types';
import { LEVELS as GIT_LEVELS } from './levelData';
import { PYTHON_LEVELS } from './pythonLevels';
import { WEBDEV_LEVELS } from './webdevLevels';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  realmName: string;
  tagline: string;
  description: string;
  themeColor: string;
  secondaryColor: string;
  glowColor: string;
  accentBg: string;
  cardBorder: string;
  icon: string;
  grandmaster: string;
  archMonster: string;
  topics: string[];
}

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'git',
    name: 'Git & GitHub',
    realmName: 'The Crystal Village: Repository Spires',
    tagline: 'Version Control, Branching & Collaborative Timelines',
    description: 'Enter the stone courtyards and branching groves of the Repository Gate. Master commits, branch pointers, remotes, and conflict resolution under Master Linus and Octocat.',
    themeColor: '#06b6d4', // cyan-500
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    accentBg: 'from-cyan-950/60 via-slate-900/80 to-slate-950',
    cardBorder: 'border-cyan-500/50 hover:border-cyan-400',
    icon: 'FolderGit2',
    grandmaster: 'Master Linus & Octocat',
    archMonster: 'The Corrupted History Leviathan',
    topics: ['Three Trees & Snapshots', 'Branches & HEAD', 'Remote Origin & Pull/Push', 'Merge Conflicts & PRs', 'Time Travel & Revert'],
  },
  {
    id: 'python',
    name: 'Python',
    realmName: 'The Serpent Spires: Dynamic Sanctum',
    tagline: 'Readability, Flow Control, Collections & OOP',
    description: 'Venture into the sun-drenched oasis and conditional groves of Python. Master variables, iteration loops, reusable functions, dictionaries, and classes under Grandmaster Guido.',
    themeColor: '#eab308', // gold/yellow
    secondaryColor: '#22c55e',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    accentBg: 'from-amber-950/60 via-slate-900/80 to-slate-950',
    cardBorder: 'border-amber-500/50 hover:border-amber-400',
    icon: 'Code2',
    grandmaster: 'Grandmaster Guido',
    archMonster: 'The GIL Leviathan',
    topics: ['Variables & Dynamic Types', 'if/else & while/for Loops', 'Functions & Variable Scope', 'Lists, Dictionaries & Sets', 'Classes & __init__'],
  },
  {
    id: 'webdev',
    name: 'Web Development',
    realmName: 'The World Wide Archipelago: Frontend Bastion',
    tagline: 'Semantic HTML5, CSS3 Layouts, JS DOM & Modern React',
    description: 'Sail the digital shores of the web. Forge accessible HTML5 structures, responsive Flexbox/Grid layouts, interactive JavaScript DOM events, and modern React component trees.',
    themeColor: '#38bdf8', // sky-400
    secondaryColor: '#a855f7',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    accentBg: 'from-sky-950/60 via-slate-900/80 to-slate-950',
    cardBorder: 'border-sky-500/50 hover:border-sky-400',
    icon: 'Globe',
    grandmaster: 'Grandmaster Tim & Cascade',
    archMonster: 'The Hydration Chimera',
    topics: ['Semantic HTML5 & a11y', 'Box Model & Flexbox', 'JavaScript DOM & Events', 'Promises & Fetch API', 'React Components & Hooks'],
  },
];

export const getSubjectLevels = (subject: SubjectId): LevelData[] => {
  switch (subject) {
    case 'python':
      return PYTHON_LEVELS;
    case 'webdev':
      return WEBDEV_LEVELS;
    case 'git':
    default:
      return GIT_LEVELS;
  }
};
