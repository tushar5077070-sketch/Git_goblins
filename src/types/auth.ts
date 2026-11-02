import { SubjectId } from '../types';

export type RankTier = 'Novice' | 'Apprentice' | 'Scholar' | 'Adept' | 'Master' | 'Grandmaster';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string; // Avatar identifier or emoji/icon
  title: string;
  bio: string;
  joinedAt: string;
  rankTier: RankTier;
  isGuest?: boolean;
}

export interface UserStats {
  totalPoints: number;
  correctAnswers: number;
  streakDays: number;
  levelsCompleted: number;
  cluesDiscovered: number;
  shardsCollected: number;
  realmStatus: Record<
    SubjectId,
    {
      name: string;
      completed: number;
      total: number;
      progressPercent: number;
      currentChapterName: string;
    }
  >;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password?: string,
    avatar?: string,
    bio?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  demoLogin: () => void;
}
