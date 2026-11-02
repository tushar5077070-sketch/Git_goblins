import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GameState, SubjectId } from '../types';
import {
  X,
  User as UserIcon,
  Award,
  Sparkles,
  Gem,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Mail,
  Shield,
  Edit3,
  LogOut,
  FileText,
  Save,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ProfileModalProps {
  gameState: GameState;
  onClose: () => void;
  onRefreshChaptersToLevel1: (subjectId?: SubjectId) => void;
  onOpenPPT: () => void;
  onOpenAchievements: () => void;
  onOpenAuth: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  gameState,
  onClose,
  onRefreshChaptersToLevel1,
  onOpenPPT,
  onOpenAchievements,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, isGuest, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Explorer');
  const [editTitle, setEditTitle] = useState(user?.title || 'Code Weaver');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || 'lyra');
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);

  // Calculate composite statistics
  const totalAnswers = gameState.totalCorrectAnswers;
  const shardsCount = gameState.collectedShards.length;
  const cluesCount = gameState.collectedClues.length;

  // Points algorithm: (answers * 10) + (shards * 15) + (clues * 25)
  const totalPoints = totalAnswers * 10 + shardsCount * 15 + cluesCount * 25;

  // Rank calculation based on points
  const getRankFromPoints = (pts: number) => {
    if (pts >= 1200) return { title: 'Grandmaster Sovereign', tier: 'Grandmaster', progress: 100, next: 'Max Rank' };
    if (pts >= 800) return { title: 'Master Architect', tier: 'Master', progress: Math.min(100, Math.round(((pts - 800) / 400) * 100)), next: '1200 pts for Grandmaster' };
    if (pts >= 450) return { title: 'Adept Programmer', tier: 'Adept', progress: Math.min(100, Math.round(((pts - 450) / 350) * 100)), next: '800 pts for Master' };
    if (pts >= 200) return { title: 'Scholar of Syntax', tier: 'Scholar', progress: Math.min(100, Math.round(((pts - 200) / 250) * 100)), next: '450 pts for Adept' };
    if (pts >= 80) return { title: 'Apprentice Adventurer', tier: 'Apprentice', progress: Math.min(100, Math.round(((pts - 80) / 120) * 100)), next: '200 pts for Scholar' };
    return { title: 'Novice Wanderer', tier: 'Novice', progress: Math.min(100, Math.round((pts / 80) * 100)), next: '80 pts for Apprentice' };
  };

  const rankInfo = getRankFromPoints(totalPoints);

  // Subject completion stats
  const realms: { id: SubjectId; name: string; color: string; bg: string }[] = [
    { id: 'git', name: 'Git Time Citadel', color: '#f97316', bg: 'bg-orange-950/40' },
    { id: 'python', name: 'Python Highlands', color: '#38bdf8', bg: 'bg-sky-950/40' },
    { id: 'webdev', name: 'Web Dev Sanctuary', color: '#06b6d4', bg: 'bg-cyan-950/40' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || 'Explorer',
      title: editTitle.trim() || 'Code Weaver',
      bio: editBio.trim(),
      avatar: editAvatar,
    });
    setIsEditing(false);
    soundEngine.playLevelVictory();
  };

  const handleConfirmRefresh = () => {
    onRefreshChaptersToLevel1(gameState.selectedSubjectId);
    setShowRefreshConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn selection:bg-cyan-500 selection:text-black">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Profile Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                Account & Player Dossier
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
                Adventurer Profile
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* User Bio & Avatar Banner Card */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-4">
              {/* Avatar circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-1 flex-shrink-0 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center font-['Cinzel'] font-black text-2xl text-cyan-300">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
              </div>

              {/* Name & Titles */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold font-['Cinzel'] text-white">
                    {user?.name || 'Guest Explorer'}
                  </h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold uppercase">
                    {rankInfo.tier}
                  </span>
                  {isGuest && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Guest Mode
                    </span>
                  )}
                </div>

                <p className="text-xs text-cyan-400 font-mono">
                  {user?.title || rankInfo.title}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user?.email || 'guest@coderealms.local'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Joined {user?.joinedAt || 'Recently'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    soundEngine.playShieldDefend();
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-red-400 hover:text-white hover:bg-red-950/60 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Inline Edit Form */}
          {isEditing && (
            <form
              onSubmit={handleSaveProfile}
              className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-fadeIn"
            >
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                Edit Profile Dossier
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Hero Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Custom Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Bio / Adventure Philosophy</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2 px-4 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Account Points & Rank Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Points */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-cyan-400 mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Total Points</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white block">
                  {totalPoints}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  Points from combat & shards
                </span>
              </div>
            </div>

            {/* Knowledge Score */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Correct Answers</span>
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-emerald-300 block">
                  {totalAnswers} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {Math.round((totalAnswers / 100) * 100)}% Milestone Complete
                </span>
              </div>
            </div>

            {/* Shards */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Shards Harvested</span>
                <Gem className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-amber-300 block">
                  {shardsCount}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  +{shardsCount * 15} Bonus Points
                </span>
              </div>
            </div>

            {/* Inscriptions / Clues */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-purple-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-purple-400 mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Codex Clues</span>
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-purple-300 block">
                  {cluesCount}
                </span>
                <span className="text-[10px] text-purple-400 font-mono">
                  +{cluesCount * 25} Lore Points
                </span>
              </div>
            </div>
          </div>

          {/* Rank Tier Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                Rank Progression: <strong className="text-cyan-300">{rankInfo.title}</strong>
              </span>
              <span className="text-slate-400">{rankInfo.next}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${rankInfo.progress}%` }}
              />
            </div>
          </div>

          {/* Subject Realms Completion Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold font-['Cinzel'] text-white">
                Educational Realms Mastery
              </h4>
              <span className="text-xs font-mono text-slate-400">
                Active: <span className="text-cyan-400 capitalize">{gameState.selectedSubjectId}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {realms.map((realm) => {
                const prog = gameState.subjectProgress[realm.id];
                const completed = prog?.completedLevelIds.length || 0;
                const percent = Math.round((completed / 5) * 100);

                return (
                  <div
                    key={realm.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      gameState.selectedSubjectId === realm.id
                        ? 'border-cyan-500 bg-slate-950/90 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-white">
                        {realm.name}
                      </span>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                        style={{ color: realm.color, backgroundColor: `${realm.color}1a` }}
                      >
                        {completed}/5 Cleared
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden mb-2">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: realm.color }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{percent}% Completed</span>
                      {completed === 5 ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mastered
                        </span>
                      ) : (
                        <span>Chapter {prog?.currentLevelId || 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refresh Chapters / Start Level 1 & Utilities Action Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-indigo-950/40 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white font-['Cinzel']">
                  Chapter Refresh & Level 1 Reset
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                Restart your active realm from Level 1 to re-experience the story or practice monster battles.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {showRefreshConfirm ? (
                <div className="flex items-center gap-2 w-full sm:w-auto animate-fadeIn">
                  <button
                    onClick={handleConfirmRefresh}
                    className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono uppercase transition-colors cursor-pointer"
                  >
                    Confirm Start Level 1
                  </button>
                  <button
                    onClick={() => setShowRefreshConfirm(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowRefreshConfirm(true)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh Chapters (Start Level 1)</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Quick Links: Project PPT & Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenPPT();
              }}
              className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    View Project Presentation Deck (PPT)
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Comprehensive 8-slide architecture, pedagogy & roadmap
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAchievements();
              }}
              className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Badges & Achievements Trophy Case
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    View all 10 unlocked achievements & milestone progress
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
