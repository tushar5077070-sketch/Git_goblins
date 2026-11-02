import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { CHARACTERS } from './data/characters';
import { getSubjectLevels } from './data/subjects';
import { Character, Clue } from './types';

// Components
import { CharacterSelect } from './components/CharacterSelect';
import { SubjectSelect } from './components/SubjectSelect';
import { StoryIntro } from './components/StoryIntro';
import { VillageCanvas } from './components/VillageCanvas';
import { HUD } from './components/HUD';
import { DialogueModal } from './components/DialogueModal';
import { VideoLessonModal } from './components/VideoLessonModal';
import { BattleArena } from './components/BattleArena';
import { ClueModal } from './components/ClueModal';
import { LevelMapModal } from './components/LevelMapModal';
import { TrialsArenaModal } from './components/TrialsArenaModal';
import { AchievementsModal } from './components/AchievementsModal';
import { CodexModal } from './components/CodexModal';
import { GrandCinematicModal } from './components/GrandCinematicModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const {
    state,
    selectCharacter,
    createCustomCharacter,
    deleteCustomCharacter,
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
    refreshChaptersToLevel1,
    setScreen,
    discoverClue,
    collectShard,
    toggleSound,
    mark100CinematicSeen,
    resetAllProgress,
  } = useGameState();

  const [activeClue, setActiveClue] = useState<Clue | null>(null);

  const [showMap, setShowMap] = useState(false);
  const [showTrials, setShowTrials] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [showGrand100, setShowGrand100] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'signup'>('login');

  // Active hero and active level based on active subject
  const allCharacters = [...CHARACTERS, ...state.customCharacters];
  const currentCharacter: Character =
    allCharacters.find((c) => c.id === state.selectedCharacterId) || allCharacters[0];

  const subjectLevels = getSubjectLevels(state.selectedSubjectId);
  const currentLevel =
    subjectLevels.find((l) => l.id === state.currentLevelId) || subjectLevels[0];

  const hasLearnedCurrentLesson = state.learnedLessonLevelIds.includes(currentLevel.id);

  // Auto-trigger 100 cinematic when reaching 100
  React.useEffect(() => {
    if (state.totalCorrectAnswers >= 100 && !state.hasSeen100Cinematic) {
      setShowGrand100(true);
      mark100CinematicSeen();
    }
  }, [state.totalCorrectAnswers, state.hasSeen100Cinematic, mark100CinematicSeen]);

  const handleInspectClue = (clue: Clue) => {
    setActiveClue(clue);
    discoverClue(clue.id);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-['Outfit'] select-none">
      {/* 1. Character Selection & Creation Lobby */}
      {state.screen === 'character_select' && (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          <CharacterSelect
            selectedId={state.selectedCharacterId}
            customCharacters={state.customCharacters}
            onSelect={selectCharacter}
            onCreateCharacter={createCustomCharacter}
            onDeleteCharacter={deleteCustomCharacter}
            onProceedToSubjects={() => setScreen('subject_select')}
            soundEnabled={state.soundEnabled}
            onToggleSound={toggleSound}
            onReset={resetAllProgress}
            hasExistingSave={state.completedLevelIds.length > 0 || state.totalCorrectAnswers > 0}
            onOpenProfile={() => setShowProfile(true)}
            onOpenAuth={() => {
              setAuthDefaultTab('login');
              setShowAuth(true);
            }}
          />
        </div>
      )}

      {/* 2. Subject Selection Screen (Python, Web Dev, Git) */}
      {state.screen === 'subject_select' && (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          <SubjectSelect
            character={currentCharacter}
            selectedSubjectId={state.selectedSubjectId}
            subjectProgress={state.subjectProgress}
            onSelectSubject={(id) => {
              selectSubject(id);
            }}
            onBackToLobby={() => setScreen('character_select')}
            soundEnabled={state.soundEnabled}
            onToggleSound={toggleSound}
            onOpenProfile={() => setShowProfile(true)}
          />
        </div>
      )}

      {/* 3. Story Introduction Cinematic Sequence */}
      {state.screen === 'story_intro' && (
        <StoryIntro
          character={currentCharacter}
          onFinish={finishStoryIntro}
        />
      )}

      {/* 4. Village Free Exploration View */}
      {(state.screen === 'exploration' ||
        state.screen === 'dialogue' ||
        state.screen === 'video_lesson' ||
        state.screen === 'battle' ||
        state.screen === 'level_complete' ||
        state.screen === 'level_map') && (
        <div className="relative w-full h-full">
          {/* Main 2D Canvas Exploration Engine */}
          <VillageCanvas
            character={currentCharacter}
            level={currentLevel}
            hasLearnedLesson={hasLearnedCurrentLesson}
            collectedClues={state.collectedClues}
            collectedShards={state.collectedShards}
            onInteractMaster={openDialogue}
            onInteractMonster={startMonsterBattle}
            onInspectClue={handleInspectClue}
            onCollectShard={collectShard}
          />

          {/* HUD Overlay */}
          <HUD
            character={currentCharacter}
            level={currentLevel}
            subjectId={state.selectedSubjectId}
            totalCorrectAnswers={state.totalCorrectAnswers}
            shardsCount={state.collectedShards.length}
            cluesCount={state.collectedClues.length}
            soundEnabled={state.soundEnabled}
            onToggleSound={toggleSound}
            onOpenMap={() => setShowMap(true)}
            onOpenTrials={() => setShowTrials(true)}
            onOpenAchievements={() => setShowAchievements(true)}
            onOpenCodex={() => setShowCodex(true)}
            onOpenProfile={() => setShowProfile(true)}
            onRefreshChaptersToLevel1={() => refreshChaptersToLevel1(state.selectedSubjectId)}
            onSwitchCharacter={() => setScreen('character_select')}
            onSwitchSubject={() => setScreen('subject_select')}
          />

          {/* Master Mentor Dialogue Modal */}
          {state.screen === 'dialogue' && (
            <DialogueModal
              master={currentLevel.master}
              level={currentLevel}
              hasLearnedLesson={hasLearnedCurrentLesson}
              onProceedToLesson={startVideoLesson}
              onClose={() => setScreen('exploration')}
            />
          )}

          {/* Video Lesson Modal */}
          {state.screen === 'video_lesson' && (
            <VideoLessonModal
              lesson={currentLevel.videoLesson}
              master={currentLevel.master}
              level={currentLevel}
              onCompleteLesson={() => completeVideoLesson(currentLevel.id)}
              onReturnToVillage={() => setScreen('exploration')}
            />
          )}

          {/* Knowledge-Based Monster Battle Arena */}
          {state.screen === 'battle' && (
            <BattleArena
              character={currentCharacter}
              monster={currentLevel.monster}
              level={currentLevel}
              totalCorrectAnswers={state.totalCorrectAnswers}
              onRecordAnswer={recordQuestionAnswer}
              onWinLevel={() => {
                completeCurrentLevel();
                advanceToNextLevel();
              }}
              onRestartLevel={restartCurrentLevel}
              onReviewLesson={startVideoLesson}
            />
          )}
        </div>
      )}

      {/* Clue Inscription Modal */}
      {activeClue && (
        <ClueModal
          clue={activeClue}
          onClose={() => setActiveClue(null)}
        />
      )}

      {/* Level Selection / World Map Modal */}
      {(showMap || state.screen === 'level_map') && (
        <LevelMapModal
          currentLevelId={state.currentLevelId}
          subjectId={state.selectedSubjectId}
          unlockedLevelIds={state.unlockedLevelIds}
          completedLevelIds={state.completedLevelIds}
          onSelectLevel={(id) => {
            goToLevel(id);
            setShowMap(false);
            setScreen('exploration');
          }}
          onRefreshChaptersToLevel1={() => {
            refreshChaptersToLevel1(state.selectedSubjectId);
            setShowMap(false);
            setScreen('exploration');
          }}
          onClose={() => {
            setShowMap(false);
            if (state.screen === 'level_map') {
              setScreen('exploration');
            }
          }}
        />
      )}

      {/* Hall of Knowledge Trials Arena Modal */}
      {showTrials && (
        <TrialsArenaModal
          totalCorrectAnswers={state.totalCorrectAnswers}
          onRecordAnswer={recordQuestionAnswer}
          onClose={() => setShowTrials(false)}
          onOpenGrand100={() => {
            setShowTrials(false);
            setShowGrand100(true);
          }}
        />
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          achievements={state.achievements}
          totalCorrectAnswers={state.totalCorrectAnswers}
          onClose={() => setShowAchievements(false)}
          onOpenGrand100={() => {
            setShowAchievements(false);
            setShowGrand100(true);
          }}
        />
      )}

      {/* Codex Modal */}
      {showCodex && (
        <CodexModal
          collectedClues={state.collectedClues}
          onClose={() => setShowCodex(false)}
        />
      )}

      {/* Grand 100 Correct Milestone Cinematic Modal */}
      {showGrand100 && (
        <GrandCinematicModal
          character={currentCharacter}
          totalCorrectAnswers={state.totalCorrectAnswers}
          onClose={() => setShowGrand100(false)}
        />
      )}

      {/* User Account & Achievements Profile Modal */}
      {showProfile && (
        <ProfileModal
          gameState={state}
          onClose={() => setShowProfile(false)}
          onRefreshChaptersToLevel1={(subjectId) => {
            refreshChaptersToLevel1(subjectId);
            setScreen('exploration');
          }}
          onOpenAchievements={() => {
            setShowProfile(false);
            setShowAchievements(true);
          }}
          onOpenAuth={() => {
            setShowProfile(false);
            setAuthDefaultTab('login');
            setShowAuth(true);
          }}
        />
      )}

      {/* Sign In & Sign Up Authentication Modal */}
      {showAuth && (
        <AuthModal
          defaultTab={authDefaultTab}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
