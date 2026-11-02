import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  LogIn,
  UserPlus,
  HelpCircle,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const AVATAR_OPTIONS = [
  { id: 'lyra', label: 'Lyra (Light)', iconBg: 'bg-cyan-500', color: '#06b6d4' },
  { id: 'orion', label: 'Orion (Time)', iconBg: 'bg-amber-500', color: '#f59e0b' },
  { id: 'elena', label: 'Elena (Earth)', iconBg: 'bg-emerald-500', color: '#10b981' },
  { id: 'fen', label: 'Fen (Storm)', iconBg: 'bg-purple-500', color: '#a855f7' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, defaultTab = 'login' }) => {
  const { login, signup, demoLogin, loginAsGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('lyra');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        soundEngine.playLevelVictory();
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your email.');
        soundEngine.playShieldDefend();
      }
    } catch {
      setErrorMessage('Unexpected error during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await signup(name, email, password, selectedAvatar, bio);
      if (res.success) {
        soundEngine.playLevelVictory();
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
        soundEngine.playShieldDefend();
      }
    } catch {
      setErrorMessage('Unexpected error during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    demoLogin();
    soundEngine.playCrystalChime();
    onClose();
  };

  const handleGuest = () => {
    loginAsGuest();
    soundEngine.playCrystalChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                CodeRealms Sanctuary
              </span>
              <h2 className="text-xl font-bold font-['Cinzel'] text-white">
                {activeTab === 'login' ? 'Adventurer Login' : 'Guild Registration'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
                soundEngine.playDialogueBlip(70);
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage('');
                soundEngine.playDialogueBlip(70);
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="alex@coderealms.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Passcode / Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-['Cinzel'] font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Enter the Realm'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo & Guest options */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-950/50 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>1-Click Demo Login (Alex Vance)</span>
              </button>

              <button
                type="button"
                onClick={handleGuest}
                className="w-full py-2 px-3 rounded-xl hover:bg-slate-800/60 text-slate-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                Continue as Guest Explorer
              </button>
            </div>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignupSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Explorer / Hero Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Archer, CodeKnight"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Passcode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Choose a secret passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Choose Avatar */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Guild Sigil / Avatar</label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedAvatar === av.id
                        ? 'border-cyan-400 bg-cyan-950/60 ring-1 ring-cyan-400'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs font-['Cinzel']"
                      style={{ backgroundColor: av.color }}
                    >
                      {av.label.charAt(0)}
                    </div>
                    <span className="text-[10px] text-slate-300 truncate w-full text-center">
                      {av.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Personal Lore / Bio</label>
              <input
                type="text"
                placeholder="Aspiring Full-Stack Alchemist..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-['Cinzel'] font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating Hero Profile...' : 'Forge Account & Begin'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
