/**
 * Ambient Persian traditional scale synthesizer (Dastgah Homayoun / Isfahan feel)
 * Provides a soothing background music experience when played,
 * with fallback gracefully handling audio element and Web Audio API.
 */
class PersianAmbientSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private notes = [220, 247.5, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25]; // Soft modal frequencies

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public play() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.playNextChime();
  }

  private playNextChime = () => {
    if (!this.isPlaying || !this.ctx) return;

    try {
      const noteFreq = this.notes[Math.floor(Math.random() * this.notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Warm sine/triangle wave blend
      osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);

      // Play soft harmonics
      const delay = Math.random() * 1200 + 800;
      this.timer = window.setTimeout(this.playNextChime, delay);
    } catch {
      // Audio context cleanup
    }
  };

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const persianSynth = new PersianAmbientSynth();
