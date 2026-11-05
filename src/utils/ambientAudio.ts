/**
 * Web Audio API synthesizer for the Phronesis Prime Celestial Soundscape.
 * Generates an ethereal, resonant Greek-Aeolian drone chord (D, A, E, F#, C#)
 * with gentle low-pass filtering and subtle harmonic shimmer.
 */

class SoundscapeManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying: boolean = false;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
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

    // Frequencies: Aeolian/Dorian sacred harmony (D2, A2, D3, F#3, A3, E4)
    const freqs = [73.42, 110.0, 146.83, 185.0, 220.0, 329.63];

    // Clear existing
    this.stopOscillators();

    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle subtle detuning for celestial warm shimmer
      const detune = (idx - 2.5) * 3;
      osc.detune.setValueAtTime(detune, now);

      // Low pass filter to create deep, calming, resonant temple space
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, now);
      filter.Q.setValueAtTime(1.5, now);

      const amp = (0.04 / (idx + 1)) * 1.5;
      gain.gain.setValueAtTime(amp, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.oscillators.push(osc);
    });

    // Smooth fade in
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 2.5);

    this.isPlaying = true;
  }

  private stopOscillators() {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.oscillators = [];
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 1.5);

    setTimeout(() => {
      this.stopOscillators();
      this.isPlaying = false;
    }, 1600);
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const soundscape = new SoundscapeManager();
