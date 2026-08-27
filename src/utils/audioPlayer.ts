// Ultra-Reliable Audio Engine with Guaranteed Playback and Bundled Assets
import track1 from '../assets/audio/track1_uzun_darah.mp3';
import track2 from '../assets/audio/track2_zaferaani.mp3';
import track3 from '../assets/audio/track3_raghse_aroos_damad.mp3';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
}

export const AUDIO_PLAYLIST: AudioTrack[] = [
  {
    id: "track-1-uzun-darah",
    title: "اوزون دره (Uzun Darah)",
    artist: "موسیقی اصیل آذربایجانی",
    src: track1
  },
  {
    id: "track-2-zaferaani",
    title: "زعفرانی (Zaferaani)",
    artist: "موسیقی شاد و خاطره‌انگیز",
    src: track2
  },
  {
    id: "track-3-raghse-aroos-damad",
    title: "نوای اصیل آذربایجان (بیکلام)",
    artist: "موسیقی بیکلام آذربایجانی",
    src: track3
  }
];

class AudioPlaybackManager {
  private static instance: AudioPlaybackManager;
  private audio: HTMLAudioElement | null = null;
  private currentTrackIdx: number = 0;
  private currentLoadedSrc: string | null = null;
  private listeners: Set<(state: { isPlaying: boolean; currentTrackIdx: number; duration: number; currentTime: number; isLoading: boolean }) => void> = new Set();
  
  public isPlaying: boolean = false;
  public isLoading: boolean = false;
  public duration: number = 0;
  public currentTime: number = 0;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
      
      // Auto-unlock on ANY user gesture across window
      const unlockGesture = () => {
        if (this.audio) {
          if (this.isPlaying && this.audio.paused) {
            this.audio.play().catch(() => {});
          }
        }
      };
      window.addEventListener('click', unlockGesture, { passive: true });
      window.addEventListener('touchstart', unlockGesture, { passive: true });
      window.addEventListener('keydown', unlockGesture, { passive: true });
    }
  }

  public static getInstance(): AudioPlaybackManager {
    if (!AudioPlaybackManager.instance) {
      AudioPlaybackManager.instance = new AudioPlaybackManager();
    }
    return AudioPlaybackManager.instance;
  }

  private initAudio(): HTMLAudioElement {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.setAttribute('playsinline', 'true');
      this.audio.setAttribute('webkit-playsinline', 'true');
      
      const initialTrack = AUDIO_PLAYLIST[this.currentTrackIdx];
      this.audio.src = initialTrack.src;
      this.currentLoadedSrc = initialTrack.src;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isLoading = false;
        this.notify();
      });

      this.audio.addEventListener('playing', () => {
        this.isPlaying = true;
        this.isLoading = false;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio) {
          this.currentTime = this.audio.currentTime || 0;
          this.duration = this.audio.duration || 0;
          this.notify();
        }
      });

      this.audio.addEventListener('loadedmetadata', () => {
        if (this.audio) {
          this.duration = this.audio.duration || 0;
          this.notify();
        }
      });

      this.audio.addEventListener('waiting', () => {
        this.isLoading = true;
        this.notify();
      });

      this.audio.addEventListener('canplay', () => {
        this.isLoading = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        this.nextTrack();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Audio element error:', e);
        this.isLoading = false;
        this.notify();
      });
    }
    return this.audio!;
  }

  public play() {
    const audio = this.initAudio();
    if (!audio) return;

    this.isPlaying = true;
    this.isLoading = true;
    this.notify();

    const currentTrack = AUDIO_PLAYLIST[this.currentTrackIdx];
    const targetSrc = currentTrack.src;
    
    if (this.currentLoadedSrc !== targetSrc) {
      audio.src = targetSrc;
      this.currentLoadedSrc = targetSrc;
      audio.load();
    }

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          this.isPlaying = true;
          this.isLoading = false;
          this.notify();
        })
        .catch((err) => {
          console.warn('Audio play request waiting for user gesture:', err);
          this.isLoading = false;
          this.notify();
        });
    }
  }

  public pause() {
    const audio = this.initAudio();
    if (audio) {
      audio.pause();
    }
    this.isPlaying = false;
    this.isLoading = false;
    this.notify();
  }

  public togglePlay() {
    const audio = this.initAudio();
    if (audio && !audio.paused) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setTrack(index: number) {
    if (index < 0 || index >= AUDIO_PLAYLIST.length) return;
    this.currentTrackIdx = index;
    const audio = this.initAudio();
    if (audio) {
      const targetSrc = AUDIO_PLAYLIST[this.currentTrackIdx].src;
      audio.src = targetSrc;
      this.currentLoadedSrc = targetSrc;
      audio.load();
      this.play();
    }
  }

  public nextTrack() {
    const nextIdx = (this.currentTrackIdx + 1) % AUDIO_PLAYLIST.length;
    this.setTrack(nextIdx);
  }

  public prevTrack() {
    const prevIdx = (this.currentTrackIdx - 1 + AUDIO_PLAYLIST.length) % AUDIO_PLAYLIST.length;
    this.setTrack(prevIdx);
  }

  public seek(seconds: number) {
    const audio = this.initAudio();
    if (audio && !isNaN(seconds)) {
      audio.currentTime = seconds;
      this.currentTime = seconds;
      this.notify();
    }
  }

  public setVolume(vol: number) {
    const audio = this.initAudio();
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, vol));
    }
  }

  public setMuted(muted: boolean) {
    const audio = this.initAudio();
    if (audio) {
      audio.muted = muted;
    }
  }

  public setLoop(loop: boolean) {
    const audio = this.initAudio();
    if (audio) {
      audio.loop = loop;
    }
  }

  public getTrackIndex(): number {
    return this.currentTrackIdx;
  }

  public getCurrentTrack(): AudioTrack {
    return AUDIO_PLAYLIST[this.currentTrackIdx] || AUDIO_PLAYLIST[0];
  }

  public subscribe(listener: (state: { isPlaying: boolean; currentTrackIdx: number; duration: number; currentTime: number; isLoading: boolean }) => void) {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isPlaying,
      currentTrackIdx: this.currentTrackIdx,
      duration: this.duration,
      currentTime: this.currentTime,
      isLoading: this.isLoading
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = {
      isPlaying: this.isPlaying,
      currentTrackIdx: this.currentTrackIdx,
      duration: this.duration,
      currentTime: this.currentTime,
      isLoading: this.isLoading
    };
    this.listeners.forEach((fn) => fn(state));
  }
}

export const globalAudio = AudioPlaybackManager.getInstance();
