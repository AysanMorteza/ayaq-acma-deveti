import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Disc3, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  ChevronDown, 
  ChevronUp, 
  X, 
  SlidersHorizontal,
  Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AUDIO_PLAYLIST, globalAudio } from '../utils/audioPlayer';

interface FloatingMusicPlayerProps {
  autoPlayTrigger?: boolean;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({ autoPlayTrigger }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(globalAudio.getTrackIndex());
  const [isPlaying, setIsPlaying] = useState<boolean>(globalAudio.isPlaying);
  const [isLoading, setIsLoading] = useState<boolean>(globalAudio.isLoading);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showTrackList, setShowTrackList] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(globalAudio.currentTime);
  const [duration, setDuration] = useState<number>(globalAudio.duration);

  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Synchronize state with GlobalAudioManager
  useEffect(() => {
    const unsubscribe = globalAudio.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrackIndex(state.currentTrackIdx);
      setDuration(state.duration);
      setCurrentTime(state.currentTime);
      setIsLoading(state.isLoading);
    });
    return () => unsubscribe();
  }, []);

  // When autoPlayTrigger changes (e.g. envelope is opened)
  useEffect(() => {
    if (autoPlayTrigger) {
      globalAudio.play();
    }
  }, [autoPlayTrigger]);

  const currentTrack = AUDIO_PLAYLIST[currentTrackIndex] || AUDIO_PLAYLIST[0];

  // Helper to format seconds as MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Main Play / Pause toggle
  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    globalAudio.togglePlay();
  }, []);

  // Select track from playlist
  const selectTrack = useCallback((idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowTrackList(false);
    globalAudio.setTrack(idx);
  }, []);

  // Next Track
  const nextTrack = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    globalAudio.nextTrack();
  }, []);

  // Prev Track
  const prevTrack = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    globalAudio.prevTrack();
  }, []);

  // Mute / Unmute
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    globalAudio.setMuted(nextMuted);
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Toggle Loop
  const toggleLoop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLoop = !isLooping;
    globalAudio.setLoop(nextLoop);
    setIsLooping(nextLoop);
  }, [isLooping]);

  // Handle Seek in progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(e.target.value);
    globalAudio.seek(seekTime);
  };

  // Close expanded card on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerContainerRef.current && !playerContainerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowTrackList(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  return (
    <>
      {/* 🎵 Compact & Expandable Floating Music Controller */}
      <div 
        ref={playerContainerRef}
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-40 select-none font-persian"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* 🪙 Ultra-Compact Round Gold Disc Button */
            <motion.div
              key="compact-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className={`relative group flex items-center gap-1.5 p-1 sm:p-1.5 pr-2.5 rounded-full border-2 border-[#D4AF37] bg-[#FFFDF9]/95 text-[#3D3019] shadow-[0_6px_25px_rgba(212,175,55,0.38)] backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-[#B8860B] ring-2 ring-[#D4AF37]/20`}
                title="مشاهده و تنظیمات پخش موسیقی"
                aria-label="تنظیمات موسیقی"
              >
                {/* Visual Audio Waveform Equalizer */}
                <div className="flex items-end gap-0.5 h-3.5 px-0.5" title={isPlaying ? "موسیقی در حال پخش است" : "موسیقی متوقف است"}>
                  <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-300 ${isPlaying ? 'animate-[bounce_0.8s_infinite_100ms] h-2.5' : 'h-1 opacity-60'}`} />
                  <span className={`w-0.5 bg-[#B8860B] rounded-full transition-all duration-300 ${isPlaying ? 'animate-[bounce_0.8s_infinite_300ms] h-3.5' : 'h-1.5 opacity-60'}`} />
                  <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-300 ${isPlaying ? 'animate-[bounce_0.8s_infinite_200ms] h-2' : 'h-1 opacity-60'}`} />
                </div>

                {/* Spinning Gold Disc Icon */}
                <div className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white shadow-md transition-all ${
                  isPlaying
                    ? 'bg-gradient-to-tr from-[#A67C1E] via-[#D4AF37] to-[#F3D77B]'
                    : 'bg-gradient-to-tr from-[#684C12] via-[#9B7423] to-[#C9A23E]'
                }`}>
                  <Disc3 className={`h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#2D220E] ${isPlaying ? 'animate-[spin_3.5s_linear_infinite]' : ''}`} />
                  
                  {/* Subtle Settings Cog/Sliders hint badge */}
                  <span className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1612] border border-[#D4AF37] text-[#D4AF37] shadow-sm">
                    <SlidersHorizontal className="w-2.5 h-2.5" />
                  </span>
                </div>
              </button>
            </motion.div>
          ) : (
            /* 💎 Expanded Luxury Floating Controller Modal/Card */
            <motion.div
              key="expanded-card"
              initial={{ scale: 0.9, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -10 }}
              transition={{ duration: 0.22, type: 'spring', damping: 25 }}
              className="w-76 sm:w-84 rounded-3xl border-2 border-[#D4AF37] bg-[#FFFDF9]/98 p-3.5 sm:p-4 text-[#3D3019] shadow-[0_15px_45px_rgba(212,175,55,0.4)] backdrop-blur-xl ring-2 ring-[#D4AF37]/30"
            >
              {/* Header: Title, Track List toggle & Close Button */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2.5 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#A67C1E] to-[#F3D77B] flex items-center justify-center text-stone-900 shadow-sm">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#6D4C13]">تنظیمات نوای دلنشین</span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Playlist Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowTrackList(!showTrackList)}
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      showTrackList 
                        ? 'bg-[#D4AF37] text-stone-950 border-[#D4AF37] font-bold shadow-sm'
                        : 'border-[#D4AF37]/50 text-[#8A6412] hover:bg-[#FAF2DF]'
                    }`}
                  >
                    <span>لیست آهنگ‌ها</span>
                    {showTrackList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {/* Collapse / Close Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setShowTrackList(false);
                    }}
                    className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition cursor-pointer"
                    title="کوچک کردن"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="mb-3 text-right">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-bold text-[#553B0E] truncate">
                    {currentTrack.title}
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 flex-shrink-0">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mb-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="نوار پیشرفت آهنگ"
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
              </div>

              {/* Main Playback Controls */}
              <div className="flex items-center justify-between pt-1">
                {/* Loop Mode */}
                <button
                  type="button"
                  onClick={toggleLoop}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    isLooping ? 'bg-[#D4AF37] text-stone-950 font-bold shadow-sm' : 'text-stone-500 hover:text-[#6D4C13]'
                  }`}
                  title={isLooping ? "تکرار آهنگ فعال است" : "تکرار آهنگ"}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Center Controls (Prev, Play/Pause, Next) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevTrack}
                    className="p-1.5 rounded-full text-[#6D4C13] hover:bg-[#FAF2DF] transition cursor-pointer"
                    title="آهنگ قبلی"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#A67C1E] via-[#D4AF37] to-[#F3D77B] text-stone-950 shadow-md transition-all active:scale-95 cursor-pointer hover:shadow-lg"
                    title={isPlaying ? "توقف" : "پخش"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-stone-950" />
                    ) : (
                      <Play className="w-5 h-5 fill-stone-950 translate-x-[-1px]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={nextTrack}
                    className="p-1.5 rounded-full text-[#6D4C13] hover:bg-[#FAF2DF] transition cursor-pointer"
                    title="آهنگ بعدی"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Mute Toggle */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-full text-stone-600 hover:text-[#6D4C13] transition cursor-pointer"
                  title={isMuted ? "وصل صدا" : "قطع صدا"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-[#8A6412]" />}
                </button>
              </div>

              {/* Dropdown Playlist Selection */}
              <AnimatePresence>
                {showTrackList && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-2.5 border-t border-[#D4AF37]/30 overflow-hidden"
                  >
                    <div className="text-[11px] font-bold text-[#8A6412] mb-1.5 text-right">
                      انتخاب موسیقی دلخواه:
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar pr-0.5">
                      {AUDIO_PLAYLIST.map((track, idx) => {
                        const isCurrent = idx === currentTrackIndex;
                        return (
                          <button
                            key={track.id}
                            type="button"
                            onClick={(e) => selectTrack(idx, e)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-right ${
                              isCurrent
                                ? 'bg-gradient-to-r from-[#D4AF37]/25 to-amber-100/60 text-[#553B0E] font-bold border border-[#D4AF37]/50'
                                : 'hover:bg-[#FAF2DF] text-stone-700'
                            }`}
                          >
                            <span className="truncate">{track.title}</span>
                            {isCurrent && isPlaying && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 mr-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
