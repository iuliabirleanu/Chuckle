// Synthesized Audio & Haptic Effects using Web Audio API

class SoundFX {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Check if audio preference was stored
    const saved = localStorage.getItem('chuckle_sound_enabled');
    if (saved !== null) {
      this.soundEnabled = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('chuckle_sound_enabled', String(this.soundEnabled));
    if (this.soundEnabled) {
      this.playTap();
    }
    return this.soundEnabled;
  }

  /**
   * Tactile haptic vibration for Android & supported mobile devices
   */
  public triggerHaptic(pattern: number | number[] = 15) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe ignore
      }
    }
  }

  /**
   * Playful "pop" button press sound
   */
  public playTap() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio context might be restricted before first gesture
    }
  }

  /**
   * Joyful chime / rimshot chord when joke or punchline is presented
   */
  public playReveal() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major arpeggio

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const start = now + idx * 0.045;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Snickering comic rimshot (two snare taps + high hat)
   */
  public playRimshot() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Two short tom hits
      [0, 0.1].forEach((delay) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now + delay);
        osc.frequency.exponentialRampToValueAtTime(60, now + delay + 0.08);

        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.09);
      });

      // Crash / cymbal splash
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.25, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(5000, now + 0.22);

      const cymbalGain = this.ctx.createGain();
      cymbalGain.gain.setValueAtTime(0.1, now + 0.22);
      cymbalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      whiteNoise.connect(filter);
      filter.connect(cymbalGain);
      cymbalGain.connect(this.ctx.destination);

      whiteNoise.start(now + 0.22);
      whiteNoise.stop(now + 0.45);
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundFX();
