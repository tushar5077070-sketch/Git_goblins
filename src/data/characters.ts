import { Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'lyra',
    name: 'Lyra',
    title: 'The Crystal Weaver',
    element: 'Light',
    color: '#06b6d4', // cyan-500
    secondaryColor: '#67e8f9',
    accentBg: 'from-cyan-900/40 via-sky-950/60 to-slate-950',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    quote: '“Every crystal reflects truth, if you know where the light begins.”',
    description: 'A nimble scholar from the Prism Spire who weaves radiant photons into diagnostic threads and defensive shields.',
    lore: 'Trained in the ancient Academy of Optics, Lyra ventured into the abandoned village when the great crystalline aurora began fading. Her prism-focus staff allows her to analyze subtle electromagnetic patterns in the village stones.',
    perk: 'Prism Sense: Increased movement agility & shimmering light trail.',
    speed: 3.4,
  },
  {
    id: 'kael',
    name: 'Kael',
    title: 'The Chrono-Scholar',
    element: 'Time',
    color: '#f59e0b', // amber-500
    secondaryColor: '#fde68a',
    accentBg: 'from-amber-950/40 via-yellow-950/60 to-slate-950',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    quote: '“History is a crystal lattice; time simply pulses through its nodes.”',
    description: 'An archivist armed with temporal astrolabes and celestial scrolls, skilled in uncovering hidden centuries of lore.',
    lore: 'Kael dedicated his youth to translating the forgotten manuscripts of the First Builders. When the temporal rifts in the Crystal Village stabilized into localized trials, he arrived to document the Masters\' ancient knowledge before it dissolves forever.',
    perk: 'Temporal Focus: Enhanced visual clue detection radius & golden glow.',
    speed: 3.1,
  },
  {
    id: 'jax',
    name: 'Jax',
    title: 'The Runeguard',
    element: 'Earth',
    color: '#10b981', // emerald-500
    secondaryColor: '#6ee7b7',
    accentBg: 'from-emerald-950/40 via-teal-950/60 to-slate-950',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    quote: '“Stand firm as deep bedrock, and the storm shall break upon you.”',
    description: 'A resolute sentinel encased in rune-carved jade armor, channeling the tectonic frequencies of subterranean strata.',
    lore: 'Hailing from the subterranean Deep Hollows, Jax was chosen by the Elder Council to safeguard the frontier. His heavy crystalline gauntlets resonate with the vibration of raw quartz, making him impervious to fear and cognitive illusions.',
    perk: 'Tectonic Ward: Sturdy stance, crystal shockwave aura & steady stride.',
    speed: 3.0,
  },
];
