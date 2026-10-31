/**
 * Procedural Web Audio API sound synthesis system for The Crystal Village.
 * Ensures zero-dependency, low-latency, and cross-platform audio.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch {
      // Audio not permitted yet or not supported
    }
  }

  public resume() {
    try {
      if (!this.ctx) {
        this.init();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Audio resume safely ignored in sandboxed iframe
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  public setBgmVolume(val: number) {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(Math.max(0, Math.min(1, val * 0.4)), this.ctx.currentTime);
    }
  }

  public setSfxVolume(val: number) {
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // --- Sound Effects ---

  public playFootstep() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90 + Math.random() * 25, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  public playCrystalChime() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    const frequencies = [880, 1108.73, 1318.51, 1760]; // A major 7th shimmer
    frequencies.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.04 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + i * 0.04);
      osc.stop(this.ctx.currentTime + i * 0.04 + 0.65);
    });
  }

  public playDialogueBlip(pitchOffset: number = 0) {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 380 + pitchOffset;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.15, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  public playAttackSpell() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    // Sweeping beam of light sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.3);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2400, this.ctx.currentTime + 0.3);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public playImpactSuccess() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    // Resonant crystal explosion
    const freqs = [330, 495, 660, 990];
    freqs.forEach((f) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 0.6, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    });
  }

  public playShieldDefend() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    // Low metallic thud + deflection
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [
      { f: 523.25, t: 0.0, d: 0.15 }, // C5
      { f: 659.25, t: 0.15, d: 0.15 }, // E5
      { f: 783.99, t: 0.3, d: 0.15 }, // G5
      { f: 1046.5, t: 0.45, d: 0.6 }, // C6
    ];

    notes.forEach((n) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + n.t);
      osc.stop(this.ctx.currentTime + n.t + n.d + 0.05);
    });
  }

  public playDefeat() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [
      { f: 392.0, t: 0.0, d: 0.3 }, // G4
      { f: 369.99, t: 0.25, d: 0.3 }, // F#4
      { f: 329.63, t: 0.5, d: 0.5 }, // E4
      { f: 293.66, t: 0.75, d: 0.8 }, // D4
    ];

    notes.forEach((n) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime + n.t);

      osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.t + n.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + n.t);
      osc.stop(this.ctx.currentTime + n.t + n.d + 0.1);
    });
  }

  public playLevelVictory() {
    this.playVictoryFanfare();
  }

  public playBattleEncounter() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx || !this.sfxGain) return;

    // Dramatic brass/horn encounter chord
    const freqs = [196.0, 246.94, 293.66, 392.0];
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5 + idx * 0.1);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6 + idx * 0.1);
    });
  }

  // --- Ambient Village BGM Drone ---

  public startAtmosphericBgm() {
    if (this.isBgmPlaying) return;
    this.resume();
    if (!this.ctx || !this.bgmGain) return;

    this.stopAtmosphericBgm();
    this.isBgmPlaying = true;

    // Harmonic minor ambient chord drone (C - Eb - G - Bb with subtle LFO shimmer)
    const baseFreqs = [130.81, 155.56, 196.0, 233.08]; // C3, Eb3, G3, Bb3
    
    baseFreqs.forEach((freq) => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle slow frequency vibrato for mystical feel
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15 + Math.random() * 0.1, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start();
      this.ambientOscillators.push(osc, lfo);
    });
  }

  public stopAtmosphericBgm() {
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.ambientOscillators = [];
    this.isBgmPlaying = false;
  }
}

export const soundEngine = new SoundEngine();
