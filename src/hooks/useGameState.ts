import { useState, useEffect, useCallback } from 'react';
import { GameState, CharacterId, Achievement, SubjectId, Character } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/levelData';
import { getSubjectLevels } from '../data/subjects';
import { soundEngine } from '../utils/audio';

const STORAGE_KEY = 'the_crystal_village_savedata_multiverse_v3';

const DEFAULT_SUBJECT_PROGRESS = {
  git: {
    currentLevelId: 1,
    unlockedLevelIds: [1],
    completedLevelIds: [] as number[],
    learnedLessonLevelIds: [] as number[],
  },
  python: {
    currentLevelId: 1,
    unlockedLevelIds: [1],
    completedLevelIds: [] as number[],
    learnedLessonLevelIds: [] as number[],
  },
  webdev: {
    currentLevelId: 1,
    unlockedLevelIds: [1],
    completedLevelIds: [] as number[],
    learnedLessonLevelIds: [] as number[],
  },
};

const getInitialState = (): GameState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const selectedSub: SubjectId = parsed.selectedSubjectId || 'git';
      const subProg = parsed.subjectProgress || DEFAULT_SUBJECT_PROGRESS;
      const activeProg = subProg[selectedSub] || DEFAULT_SUBJECT_PROGRESS[selectedSub];

      return {
        hasStarted: parsed.hasStarted || false,
        selectedCharacterId: parsed.selectedCharacterId || null,
        selectedSubjectId: selectedSub,
        customCharacters: parsed.customCharacters || [],
        introCompleted: parsed.introCompleted || false,
        currentLevelId: activeProg.currentLevelId || 1,
        unlockedLevelIds: activeProg.unlockedLevelIds || [1],
        completedLevelIds: activeProg.completedLevelIds || [],
        learnedLessonLevelIds: activeProg.learnedLessonLevelIds || [],
        subjectProgress: subProg,
        totalCorrectAnswers: parsed.totalCorrectAnswers || 0,
        currentLevelCorrectAnswers: 0,
        collectedClues: parsed.collectedClues || [],
        collectedShards: parsed.collectedShards || [],
        soundEnabled: parsed.soundEnabled ?? true,
        bgmVolume: parsed.bgmVolume ?? 0.8,
        sfxVolume: parsed.sfxVolume ?? 0.8,
        achievements: parsed.achievements || INITIAL_ACHIEVEMENTS,
        hasSeen100Cinematic: parsed.hasSeen100Cinematic || false,
        screen: parsed.selectedCharacterId ? (parsed.introCompleted ? 'exploration' : 'story_intro') : 'character_select',
      };
    }
  } catch {
    // ignore parse error
  }

  return {
    hasStarted: false,
    selectedCharacterId: null,
    selectedSubjectId: 'git',
    customCharacters: [],
    introCompleted: false,
    currentLevelId: 1,
    unlockedLevelIds: [1],
    completedLevelIds: [],
    learnedLessonLevelIds: [],
    subjectProgress: DEFAULT_SUBJECT_PROGRESS,
    totalCorrectAnswers: 0,
    currentLevelCorrectAnswers: 0,
    collectedClues: [],
    collectedShards: [],
    soundEnabled: true,
    bgmVolume: 0.8,
    sfxVolume: 0.8,
    achievements: INITIAL_ACHIEVEMENTS,
    hasSeen100Cinematic: false,
    screen: 'character_select',
  };
};

export function useGameState() {
  const [state, setState] = useState<GameState>(getInitialState);

  // Sync to local storage
  useEffect(() => {
    try {
      const dataToSave = {
        hasStarted: state.hasStarted,
        selectedCharacterId: state.selectedCharacterId,
        selectedSubjectId: state.selectedSubjectId,
        customCharacters: state.customCharacters,
        introCompleted: state.introCompleted,
        currentLevelId: state.currentLevelId,
        unlockedLevelIds: state.unlockedLevelIds,
        completedLevelIds: state.completedLevelIds,
        learnedLessonLevelIds: state.learnedLessonLevelIds,
        subjectProgress: {
          ...state.subjectProgress,
          [state.selectedSubjectId]: {
            currentLevelId: state.currentLevelId,
            unlockedLevelIds: state.unlockedLevelIds,
            completedLevelIds: state.completedLevelIds,
            learnedLessonLevelIds: state.learnedLessonLevelIds,
          },
        },
        totalCorrectAnswers: state.totalCorrectAnswers,
        collectedClues: state.collectedClues,
        collectedShards: state.collectedShards,
        soundEnabled: state.soundEnabled,
        bgmVolume: state.bgmVolume,
        sfxVolume: state.sfxVolume,
        achievements: state.achievements,
        hasSeen100Cinematic: state.hasSeen100Cinematic,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // storage quota or disabled
    }
  }, [state]);

  // Audio settings sync
  useEffect(() => {
    soundEngine.setMuted(!state.soundEnabled);
    soundEngine.setBgmVolume(state.bgmVolume);
    soundEngine.setSfxVolume(state.sfxVolume);
  }, [state.soundEnabled, state.bgmVolume, state.sfxVolume]);

  // Start background ambient music when playing
  useEffect(() => {
    if (state.hasStarted && state.soundEnabled && state.screen === 'exploration') {
      soundEngine.startAtmosphericBgm();
    }
  }, [state.hasStarted, state.soundEnabled, state.screen]);

  // Helper to update achievements
  const checkAchievements = useCallback((
    updatedAnswers: number,
    completedLevels: number[],
    cluesCount: number,
    shardsCount: number
  ) => {
    setState((prev) => {
      const updatedAchievements: Achievement[] = prev.achievements.map((ach) => {
        let current = ach.current;
        let unlocked = ach.unlocked;

        if (ach.id === 'first_step' && prev.selectedCharacterId) {
          current = 1;
          unlocked = true;
        } else if (ach.id === 'first_victory' && completedLevels.includes(1)) {
          current = 1;
          unlocked = true;
        } else if (ach.id === 'grove_master' && completedLevels.includes(2)) {
          current = 1;
          unlocked = true;
        } else if (ach.id === 'vault_conqueror' && completedLevels.includes(3)) {
          current = 1;
          unlocked = true;
        } else if (ach.id === 'astronomer' && completedLevels.includes(4)) {
          current = 1;
          unlocked = true;
        } else if (ach.id === 'nexus_champion' && completedLevels.includes(5)) {
          current = 1;
          unlocked = true;
        } else if (ach.id === 'lore_hunter') {
          current = cluesCount;
          unlocked = cluesCount >= ach.target;
        } else if (ach.id === 'crystal_collector') {
          current = shardsCount;
          unlocked = shardsCount >= ach.target;
        } else if (ach.id === 'scholar_25') {
          current = updatedAnswers;
          unlocked = updatedAnswers >= 25;
        } else if (ach.id === 'scholar_50') {
          current = updatedAnswers;
          unlocked = updatedAnswers >= 50;
        } else if (ach.id === 'grand_archon_100') {
          current = updatedAnswers;
          unlocked = updatedAnswers >= 100;
        }

        return { ...ach, current: Math.min(ach.target, current), unlocked };
      });

      return { ...prev, achievements: updatedAchievements };
    });
  }, []);

  const selectCharacter = useCallback((id: CharacterId) => {
    setState((prev) => ({
      ...prev,
      selectedCharacterId: id,
    }));
    try {
      soundEngine.playCrystalChime();
    } catch {
      // safe
    }
  }, []);

  const createCustomCharacter = useCallback((newChar: Omit<Character, 'id' | 'isCustom'>) => {
    const customId = `custom-${Date.now()}`;
    const fullChar: Character = {
      ...newChar,
      id: customId,
      isCustom: true,
    };
    setState((prev) => ({
      ...prev,
      customCharacters: [...prev.customCharacters, fullChar],
      selectedCharacterId: customId,
    }));
    soundEngine.playLevelVictory();
  }, []);

  const deleteCustomCharacter = useCallback((id: string) => {
    setState((prev) => {
      const updated = prev.customCharacters.filter((c) => c.id !== id);
      return {
        ...prev,
        customCharacters: updated,
        selectedCharacterId: prev.selectedCharacterId === id ? 'lyra' : prev.selectedCharacterId,
      };
    });
  }, []);

  const openSubjectSelect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      screen: 'subject_select',
    }));
    soundEngine.playCrystalChime();
  }, []);

  const selectSubject = useCallback((subjectId: SubjectId) => {
    setState((prev) => {
      // Save progress of current subject
      const updatedSubjectProgress = {
        ...prev.subjectProgress,
        [prev.selectedSubjectId]: {
          currentLevelId: prev.currentLevelId,
          unlockedLevelIds: prev.unlockedLevelIds,
          completedLevelIds: prev.completedLevelIds,
          learnedLessonLevelIds: prev.learnedLessonLevelIds,
        },
      };

      const targetProgress = updatedSubjectProgress[subjectId] || DEFAULT_SUBJECT_PROGRESS[subjectId];

      return {
        ...prev,
        selectedSubjectId: subjectId,
        subjectProgress: updatedSubjectProgress,
        currentLevelId: targetProgress.currentLevelId,
        unlockedLevelIds: targetProgress.unlockedLevelIds,
        completedLevelIds: targetProgress.completedLevelIds,
        learnedLessonLevelIds: targetProgress.learnedLessonLevelIds,
        screen: 'exploration',
      };
    });
    soundEngine.playCrystalChime();
  }, []);

  const startAdventure = useCallback((targetScreen: 'story_intro' | 'level_map' | 'exploration' | 'subject_select' = 'subject_select') => {
    setState((prev) => ({
      ...prev,
      hasStarted: true,
      selectedCharacterId: prev.selectedCharacterId || 'lyra',
      screen: targetScreen,
    }));
    try {
      soundEngine.playCrystalChime();
    } catch {
      // safe
    }
  }, []);

  const openLevelLineup = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasStarted: true,
      selectedCharacterId: prev.selectedCharacterId || 'lyra',
      screen: 'level_map',
    }));
    try {
      soundEngine.playCrystalChime();
    } catch {
      // safe
    }
  }, []);

  const finishStoryIntro = useCallback(() => {
    setState((prev) => ({
      ...prev,
      introCompleted: true,
      screen: 'exploration',
    }));
    try {
      soundEngine.startAtmosphericBgm();
    } catch {
      // safe
    }
  }, []);

  const openDialogue = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'dialogue' }));
    soundEngine.playDialogueBlip(50);
  }, []);

  const startVideoLesson = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'video_lesson' }));
  }, []);

  const completeVideoLesson = useCallback((levelId: number) => {
    setState((prev) => {
      const updatedLearned = prev.learnedLessonLevelIds.includes(levelId)
        ? prev.learnedLessonLevelIds
        : [...prev.learnedLessonLevelIds, levelId];
      return {
        ...prev,
        learnedLessonLevelIds: updatedLearned,
        screen: 'exploration', // Move back to village exploration so player can walk forward to the monster!
      };
    });
    soundEngine.playCrystalChime();
  }, []);

  const startMonsterBattle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      screen: 'battle',
      currentLevelCorrectAnswers: 0,
    }));
    soundEngine.playAttackSpell();
  }, []);

  const recordQuestionAnswer = useCallback((correct: boolean, isLevelBattle: boolean) => {
    setState((prev) => {
      const newTotal = correct ? prev.totalCorrectAnswers + 1 : prev.totalCorrectAnswers;
      const newLevelCorrect = (isLevelBattle && correct) ? prev.currentLevelCorrectAnswers + 1 : prev.currentLevelCorrectAnswers;
      
      // Check achievements with new score
      setTimeout(() => {
        checkAchievements(newTotal, prev.completedLevelIds, prev.collectedClues.length, prev.collectedShards.length);
      }, 0);

      return {
        ...prev,
        totalCorrectAnswers: newTotal,
        currentLevelCorrectAnswers: newLevelCorrect,
      };
    });
  }, [checkAchievements]);

  const completeCurrentLevel = useCallback(() => {
    setState((prev) => {
      const subjectLevels = getSubjectLevels(prev.selectedSubjectId);
      const nextLevelId = prev.currentLevelId + 1;
      const updatedCompleted = prev.completedLevelIds.includes(prev.currentLevelId)
        ? prev.completedLevelIds
        : [...prev.completedLevelIds, prev.currentLevelId];

      const updatedUnlocked = nextLevelId <= subjectLevels.length && !prev.unlockedLevelIds.includes(nextLevelId)
        ? [...prev.unlockedLevelIds, nextLevelId]
        : prev.unlockedLevelIds;

      setTimeout(() => {
        checkAchievements(prev.totalCorrectAnswers, updatedCompleted, prev.collectedClues.length, prev.collectedShards.length);
      }, 0);

      return {
        ...prev,
        completedLevelIds: updatedCompleted,
        unlockedLevelIds: updatedUnlocked,
        screen: 'level_complete',
      };
    });
    soundEngine.playVictoryFanfare();
  }, [checkAchievements]);

  const restartCurrentLevel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentLevelCorrectAnswers: 0,
      screen: 'exploration',
    }));
    soundEngine.startAtmosphericBgm();
  }, []);

  const advanceToNextLevel = useCallback(() => {
    setState((prev) => {
      const subjectLevels = getSubjectLevels(prev.selectedSubjectId);
      const nextLevelId = prev.currentLevelId + 1;
      if (nextLevelId <= subjectLevels.length) {
        return {
          ...prev,
          currentLevelId: nextLevelId,
          currentLevelCorrectAnswers: 0,
          screen: 'exploration',
        };
      }
      return {
        ...prev,
        screen: 'level_map',
      };
    });
    soundEngine.startAtmosphericBgm();
  }, []);

  const goToLevel = useCallback((levelId: number) => {
    setState((prev) => {
      if (!prev.unlockedLevelIds.includes(levelId)) return prev;
      return {
        ...prev,
        currentLevelId: levelId,
        currentLevelCorrectAnswers: 0,
        screen: 'exploration',
      };
    });
    soundEngine.startAtmosphericBgm();
  }, []);

  const setScreen = useCallback((screen: GameState['screen']) => {
    setState((prev) => ({ ...prev, screen }));
    if (screen === 'exploration') {
      soundEngine.startAtmosphericBgm();
    }
  }, []);

  const discoverClue = useCallback((clueId: string) => {
    setState((prev) => {
      if (prev.collectedClues.includes(clueId)) return prev;
      const updated = [...prev.collectedClues, clueId];
      setTimeout(() => {
        checkAchievements(prev.totalCorrectAnswers, prev.completedLevelIds, updated.length, prev.collectedShards.length);
      }, 0);
      return { ...prev, collectedClues: updated };
    });
    soundEngine.playCrystalChime();
  }, [checkAchievements]);

  const collectShard = useCallback((shardId: string) => {
    setState((prev) => {
      if (prev.collectedShards.includes(shardId)) return prev;
      const updated = [...prev.collectedShards, shardId];
      setTimeout(() => {
        checkAchievements(prev.totalCorrectAnswers, prev.completedLevelIds, prev.collectedClues.length, updated.length);
      }, 0);
      return { ...prev, collectedShards: updated };
    });
    soundEngine.playCrystalChime();
  }, [checkAchievements]);

  const toggleSound = useCallback(() => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const mark100CinematicSeen = useCallback(() => {
    setState((prev) => ({ ...prev, hasSeen100Cinematic: true }));
  }, []);

  const resetAllProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState({
      hasStarted: false,
      selectedCharacterId: null,
      selectedSubjectId: 'git',
      customCharacters: [],
      introCompleted: false,
      currentLevelId: 1,
      unlockedLevelIds: [1],
      completedLevelIds: [],
      learnedLessonLevelIds: [],
      subjectProgress: DEFAULT_SUBJECT_PROGRESS,
      totalCorrectAnswers: 0,
      currentLevelCorrectAnswers: 0,
      collectedClues: [],
      collectedShards: [],
      soundEnabled: true,
      bgmVolume: 0.8,
      sfxVolume: 0.8,
      achievements: INITIAL_ACHIEVEMENTS,
      hasSeen100Cinematic: false,
      screen: 'character_select',
    });
  }, []);

  return {
    state,
    selectCharacter,
    createCustomCharacter,
    deleteCustomCharacter,
    openSubjectSelect,
    selectSubject,
    startAdventure,
    openLevelLineup,
    finishStoryIntro,
    openDialogue,
    startVideoLesson,
    completeVideoLesson,
    startMonsterBattle,
    recordQuestionAnswer,
    completeCurrentLevel,
    restartCurrentLevel,
    advanceToNextLevel,
    goToLevel,
    setScreen,
    discoverClue,
    collectShard,
    toggleSound,
    mark100CinematicSeen,
    resetAllProgress,
  };
}
