import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RankTier } from '../types/auth';

const STORAGE_KEY_USER = 'coderealms_active_user_v1';
const STORAGE_KEY_REGISTRY = 'coderealms_registered_users_v1';

const DEFAULT_DEMO_USER: User = {
  id: 'usr_demo_77',
  name: 'Alex Vance',
  email: 'alex@coderealms.dev',
  avatar: 'lyra',
  title: 'Code Weaver & Git Adept',
  bio: 'Exploring every realm from Git DAGs to modern React hooks. Lifelong code adventurer.',
  joinedAt: 'October 2024',
  rankTier: 'Scholar',
  isGuest: false,
};

const DEFAULT_GUEST_USER: User = {
  id: 'usr_guest_guest',
  name: 'Guest Explorer',
  email: 'guest@coderealms.local',
  avatar: 'fen',
  title: 'Novice Wanderer',
  bio: 'Unregistered guest exploring the realms of code.',
  joinedAt: 'Today',
  rankTier: 'Novice',
  isGuest: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_DEMO_USER;
  });

  // Save active user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Read registry of users or initialize with demo
  const getUsersRegistry = (): User[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [DEFAULT_DEMO_USER];
  };

  const saveUsersRegistry = (users: User[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(users));
    } catch {
      // ignore
    }
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const registry = getUsersRegistry();
    let found = registry.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      // If user is logging in with a new email, create the account seamlessly
      const fallbackName = trimmedEmail.split('@')[0] || 'Code Explorer';
      found = {
        id: `usr_${Date.now()}`,
        name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
        email: trimmedEmail,
        avatar: 'orion',
        title: 'Apprentice Adventurer',
        bio: 'New coder beginning the quest through Git and Python.',
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        rankTier: 'Apprentice',
        isGuest: false,
      };
      saveUsersRegistry([...registry, found]);
    }

    setUser(found);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password?: string,
    avatar: string = 'lyra',
    bio: string = 'Eager coder traversing the digital realms.'
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: 'Please enter your hero name or handle.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const registry = getUsersRegistry();
    const existing = registry.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      // Account exists, log into it
      setUser(existing);
      return { success: true };
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: trimmedName,
      email: trimmedEmail,
      avatar,
      title: 'Novice Code Seeker',
      bio: bio || 'Newly joined apprentice ready to conquer bug phantoms.',
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rankTier: 'Novice',
      isGuest: false,
    };

    saveUsersRegistry([...registry, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const loginAsGuest = () => {
    setUser(DEFAULT_GUEST_USER);
  };

  const demoLogin = () => {
    setUser(DEFAULT_DEMO_USER);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      // Also update registry
      const registry = getUsersRegistry();
      const updatedRegistry = registry.map((u) => (u.id === updated.id ? updated : u));
      saveUsersRegistry(updatedRegistry);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !user.isGuest,
        isGuest: !!user?.isGuest,
        login,
        signup,
        loginAsGuest,
        logout,
        updateProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
