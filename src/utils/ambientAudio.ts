/**
 * Web Audio API synthesizer for the Phronesis Prime Temple Chime Soundscape.
 * Generates:
 * 1. A deep, warm low-frequency resonant drone (54Hz, 108Hz, 216Hz sacred temple frequencies).
 * 2. Periodic generative low-frequency "Temple Chime" strikes with authentic metallic inharmonic partials
 *    (mimicking bronze temple singing bowls and Delphic sanctuary bells) with long exponential decays.
 * 3. Soft harmonic sub-bass warmth with smooth linear gain transitions.
 */

type SoundscapeListener = (isPlaying: boolean) => void;

class TempleSoundscapeManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private chimeGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private chimeTimer: ReturnType<typeof setTimeout> | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<SoundscapeListener> = new Set();

  public subscribe(listener: SoundscapeListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isPlaying));
  }

  public init() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master output bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Sub-bus for ambient drone
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    // Sub-bus for temple chime strikes
    this.chimeGain = this.ctx.createGain();
    this.chimeGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.chimeGain.connect(this.masterGain);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopOscillators();

    const now = this.ctx.currentTime;

    // 1. Warm Low-Frequency Resonant Temple Drone (54Hz sub-bass, 108Hz Delphic fundamental, 216Hz, 324Hz)
    const droneFreqs = [54.0, 108.0, 162.0, 216.0];

    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.droneGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle warm organic detune
      const detune = (idx - 1.5) * 2.2;
      osc.detune.setValueAtTime(detune, now);

      // Deep low-pass filter to keep it warm, grounding, and atmospheric
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280 + idx * 45, now);
      filter.Q.setValueAtTime(2.0, now);

      const amp = (0.07 / (idx + 1)) * 1.2;
      gain.gain.setValueAtTime(amp, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);

      osc.start();
      this.droneOscillators.push(osc);
    });

    // 2. Initial Temple Chime strike, followed by periodic strikes
    this.triggerTempleChime(now + 0.3);
    this.scheduleNextChime();

    // Smooth master fade in
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 2.5);

    this.isPlaying = true;
    this.notify();
  }

  /**
   * Generates a rich, resonant low-frequency bronze temple chime.
   * Utilizes an authentic inharmonic acoustic bell formula:
   * Fundamental f0, along with non-integer overtones (2.0f0, 2.76f0, 5.4f0, 8.9f0)
   * with individual exponential decays mimicking ancient Tibetan & Greek temple bowls.
   */
  public triggerTempleChime(startTime?: number) {
    if (!this.ctx || !this.chimeGain || !this.isPlaying) return;

    const t = startTime ?? this.ctx.currentTime;
    // Ancient Delphic temple chime base pitch: 108Hz or 144Hz or 216Hz
    const pitches = [108.0, 144.0, 216.0];
    const baseFreq = pitches[Math.floor(Math.random() * pitches.length)];

    // Inharmonic bell partials and relative amplitudes
    const partials = [
      { mult: 1.0, amp: 0.14, decay: 7.5 },  // Prime fundamental
      { mult: 2.0, amp: 0.08, decay: 5.5 },  // Octave
      { mult: 2.76, amp: 0.05, decay: 4.2 }, // Minor third overtone
      { mult: 5.4, amp: 0.03, decay: 3.0 },  // High shimmer
    ];

    partials.forEach(({ mult, amp, decay }) => {
      if (!this.ctx || !this.chimeGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * mult, t);

      // Low-pass to keep chime velvety and deep
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      // Instant strike attack, long serene exponential decay
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(amp, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.chimeGain);

      osc.start(t);
      osc.stop(t + decay + 0.2);
    });
  }

  /**
   * Schedules gentle, sporadic temple chimes every 7 to 14 seconds.
   */
  private scheduleNextChime() {
    if (this.chimeTimer) clearTimeout(this.chimeTimer);
    if (!this.isPlaying) return;

    const intervalMs = Math.floor(Math.random() * 6000) + 8000; // 8 - 14 seconds
    this.chimeTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.triggerTempleChime();
        this.scheduleNextChime();
      }
    }, intervalMs);
  }

  private stopOscillators() {
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.droneOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.droneOscillators = [];
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 1.2);

    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    setTimeout(() => {
      this.stopOscillators();
      this.isPlaying = false;
      this.notify();
    }, 1300);
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const soundscape = new TempleSoundscapeManager();
