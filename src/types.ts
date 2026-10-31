export type SubjectId = 'git' | 'python' | 'webdev';

export type CharacterId = string;

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  element: 'Light' | 'Time' | 'Earth' | 'Fire' | 'Storm' | 'Void';
  color: string;
  secondaryColor: string;
  accentBg: string;
  glowColor: string;
  quote: string;
  description: string;
  lore: string;
  perk: string;
  speed: number;
  isCustom?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  overview: string;
  keyPoints: string[];
  diagramType:
    | 'git_trees'
    | 'git_branching'
    | 'git_remotes'
    | 'git_merge_conflicts'
    | 'git_time_travel'
    | 'py_basics'
    | 'py_control'
    | 'py_functions'
    | 'py_collections'
    | 'py_classes'
    | 'web_html'
    | 'web_css'
    | 'web_js'
    | 'web_apis'
    | 'web_react';
  videoUrl?: string;
  chapters: { time: number; title: string; text: string }[];
}

export interface Master {
  id: string;
  name: string;
  title: string;
  gitDiscipline: string; // Subject discipline
  themeColor: string;
  quote: string;
  greetingDialogue: string[];
  postLessonAdvice: string;
  avatarIcon: string;
}

export interface Monster {
  id: string;
  name: string;
  title: string;
  gitFlaw: string; // The bug/flaw/glitch
  themeColor: string;
  quote: string;
  defeatQuote: string;
  glitchType: string;
}

export interface Clue {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string;
  discovered: boolean;
}

export interface CrystalShard {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  value: number;
}

export interface MapStructure {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'house' | 'tree' | 'rock' | 'bridge' | 'pillar' | 'obelisk' | 'chasm' | 'shrine' | 'portal';
  label?: string;
  color?: string;
}

export interface MapPath {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}

export interface LevelData {
  id: number;
  name: string;
  locationName: string;
  description: string;
  mapType:
    | 'courtyard'
    | 'forest_grove'
    | 'cloud_canyon'
    | 'conflict_gorge'
    | 'celestial_nexus'
    | 'py_oasis'
    | 'py_citadel'
    | 'py_forge'
    | 'py_vault'
    | 'py_spire'
    | 'web_haven'
    | 'web_bastion'
    | 'web_amphitheater'
    | 'web_causeway'
    | 'web_sanctum'
    | string;
  theme: {
    primaryColor: string;
    ambientGlow: string;
    fogColor: string;
    floorColor: string;
    stoneColor: string;
  };
  master: Master;
  monster: Monster;
  videoLesson: VideoLesson;
  questions: Question[]; // Dynamic pool of topic questions for monster battles and non-repeating retakes
  clues: Clue[];
  shards: CrystalShard[];
  playerSpawn: { x: number; y: number };
  masterPosition: { x: number; y: number };
  monsterPosition: { x: number; y: number };
  structures: MapStructure[];
  paths: MapPath[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'story' | 'knowledge' | 'exploration' | 'mastery';
  target: number;
  current: number;
  unlocked: boolean;
  isGrand100?: boolean;
}

export interface GameState {
  hasStarted: boolean;
  selectedCharacterId: CharacterId | null;
  selectedSubjectId: SubjectId;
  customCharacters: Character[];
  introCompleted: boolean;
  currentLevelId: number;
  unlockedLevelIds: number[];
  completedLevelIds: number[];
  learnedLessonLevelIds: number[]; // Track levels where player finished the Master's lecture
  subjectProgress: Record<
    SubjectId,
    {
      currentLevelId: number;
      unlockedLevelIds: number[];
      completedLevelIds: number[];
      learnedLessonLevelIds: number[];
    }
  >;
  totalCorrectAnswers: number;
  currentLevelCorrectAnswers: number;
  collectedClues: string[];
  collectedShards: string[];
  soundEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  achievements: Achievement[];
  hasSeen100Cinematic: boolean;
  // Game screen mode
  screen:
    | 'character_select'
    | 'subject_select'
    | 'story_intro'
    | 'exploration'
    | 'dialogue'
    | 'video_lesson'
    | 'battle'
    | 'level_complete'
    | 'game_over'
    | 'level_map'
    | 'trials_arena';
}
