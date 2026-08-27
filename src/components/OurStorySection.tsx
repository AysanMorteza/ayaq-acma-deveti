import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Clock, 
  Heart, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { OUR_STORY_DATA } from '../data/invitationData';

export const OurStorySection: React.FC = () => {
  // Slider position (0 to 100) - 100 = 100% Childhood, 0 = 100% Wedding, 50 = Center Split
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [autoDirection, setAutoDirection] = useState<'right' | 'left'>('right');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const childhoodData = OUR_STORY_DATA.timeline[0];
  const weddingData = OUR_STORY_DATA.timeline[1];

  // Drag & Touch logic for the slider
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!isDragging && !isPlayingAuto) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, isPlayingAuto, handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Auto-tour animation (smooth time-travel sweep)
  useEffect(() => {
    if (!isPlayingAuto) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let speed = 0.45;
    const step = () => {
      setSliderPos(prev => {
        let next = autoDirection === 'right' ? prev + speed : prev - speed;
        if (next >= 95) {
          setAutoDirection('left');
          next = 95;
        } else if (next <= 5) {
          setAutoDirection('right');
          next = 5;
        }
        return next;
      });
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlayingAuto, autoDirection]);

  return (
    <section id="story-section" className="relative my-16 w-full px-3 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Main Luxury Parchment Container */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#D4AF37]/60 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#F5EBD7] p-5 sm:p-10 shadow-[0_15px_45px_rgba(212,175,55,0.18)]">
          
          {/* Subtle Golden Botanical Sprigs */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-20 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#B8860B]">
              <path
                d="M180 20 C 140 30, 110 70, 100 120 C 95 140, 90 170, 70 190"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M140 40 Q 160 20 180 25 Q 165 50 140 40 Z" fill="currentColor" opacity="0.6" />
              <path d="M120 70 Q 150 60 160 80 Q 130 90 120 70 Z" fill="currentColor" opacity="0.6" />
              <path d="M105 110 Q 135 110 140 130 Q 115 135 105 110 Z" fill="currentColor" opacity="0.6" />
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-20 pointer-events-none transform -scale-x-100">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#B8860B]">
              <path
                d="M180 20 C 140 30, 110 70, 100 120 C 95 140, 90 170, 70 190"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M140 40 Q 160 20 180 25 Q 165 50 140 40 Z" fill="currentColor" opacity="0.6" />
              <path d="M120 70 Q 150 60 160 80 Q 130 90 120 70 Z" fill="currentColor" opacity="0.6" />
              <path d="M105 110 Q 135 110 140 130 Q 115 135 105 110 Z" fill="currentColor" opacity="0.6" />
            </svg>
          </div>

          {/* Section Header */}
          <div className="text-center relative z-10 mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-10 sm:w-14 h-6 text-[#B8860B]" viewBox="0 0 60 24" fill="none">
                <path
                  d="M50 12 C 40 4, 30 8, 20 12 C 10 16, 0 12, 0 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="12" r="2.5" fill="currentColor" />
                <path d="M35 7 Q 45 4 48 10 Q 40 12 35 7 Z" fill="currentColor" opacity="0.7" />
                <path d="M35 17 Q 45 20 48 14 Q 40 12 35 17 Z" fill="currentColor" opacity="0.7" />
              </svg>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#7A5410] tracking-tight">
                {OUR_STORY_DATA.title}
              </h2>

              <svg className="w-10 sm:w-14 h-6 text-[#B8860B] transform -scale-x-100" viewBox="0 0 60 24" fill="none">
                <path
                  d="M50 12 C 40 4, 30 8, 20 12 C 10 16, 0 12, 0 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="12" r="2.5" fill="currentColor" />
                <path d="M35 7 Q 45 4 48 10 Q 40 12 35 7 Z" fill="currentColor" opacity="0.7" />
                <path d="M35 17 Q 45 20 48 14 Q 40 12 35 17 Z" fill="currentColor" opacity="0.7" />
              </svg>
            </div>

            <p className="text-sm sm:text-base text-[#8A6412] font-medium font-serif mt-1">
              {OUR_STORY_DATA.subtitle}
            </p>

            {/* Romantic Quote Pill */}
            <div className="mt-3 inline-block px-5 py-1.5 rounded-2xl bg-[#FFFBF0] border border-[#D4AF37]/50 shadow-sm max-w-2xl">
              <p className="text-xs sm:text-sm text-[#5A431E] font-serif italic font-semibold">
                {OUR_STORY_DATA.quote}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🌟 THE STREAMLINED INTERACTIVE SPLIT SLIDER */}
          {/* ========================================================================= */}
          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Control Bar: Era Buttons + Auto Play + Reset */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 px-1 sm:px-2">
              {/* Left Era Label (Childhood) */}
              <button 
                onClick={() => { setSliderPos(100); setIsPlayingAuto(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-serif transition-all duration-300 ${
                  sliderPos > 65 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md ring-2 ring-amber-400/70 scale-105' 
                    : 'bg-amber-100/90 text-amber-900 hover:bg-amber-200 border border-amber-300/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{childhoodData.era}</span>
              </button>

              {/* Center Controls: Play / Pause Auto & Reset to Center */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-serif transition-all shadow-sm ${
                    isPlayingAuto 
                      ? 'bg-rose-600 text-white animate-pulse shadow-md' 
                      : 'bg-[#FFFDF7] text-[#7A5410] border border-[#D4AF37] hover:bg-[#FAF2DE]'
                  }`}
                >
                  {isPlayingAuto ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>توقف گذر زمان</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                      <span>پخش خودکار</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => { setSliderPos(50); setIsPlayingAuto(false); }}
                  className="p-2 rounded-xl bg-[#FFFDF7] border border-[#D4AF37]/50 text-[#7A5410] hover:bg-[#FAF2DE] transition-colors"
                  title="مرکز (۵۰٪ مقایسه)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Right Era Label (Wedding) */}
              <button 
                onClick={() => { setSliderPos(0); setIsPlayingAuto(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-serif transition-all duration-300 ${
                  sliderPos < 35 
                    ? 'bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-md ring-2 ring-rose-400/70 scale-105' 
                    : 'bg-rose-100/90 text-rose-900 hover:bg-rose-200 border border-rose-300/60'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{weddingData.era}</span>
              </button>
            </div>

            {/* 🖼️ The Main Interactive Split-Screen Stage */}
            <div 
              ref={containerRef}
              onMouseDown={(e) => { setIsDragging(true); setIsPlayingAuto(false); handleMove(e.clientX); }}
              onTouchStart={(e) => { setIsDragging(true); setIsPlayingAuto(false); if (e.touches[0]) handleMove(e.touches[0].clientX); }}
              className="relative aspect-[4/5] sm:aspect-[16/11] w-full select-none overflow-hidden rounded-3xl border-4 border-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.3)] bg-neutral-900 cursor-ew-resize group"
            >
              {/* 1. Base Layer (Wedding / Right Era / Today) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={weddingData.image}
                  alt={weddingData.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/wedding.jpg')) {
                      target.src = '/wedding.jpg';
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* 2. Top Layer (Childhood / Left Era / Yesterday) with dynamic clip-path */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)` }}
              >
                <img
                  src={childhoodData.image}
                  alt={childhoodData.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/childhood.jpg')) {
                      target.src = '/childhood.jpg';
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* 3. Golden Divider Line & Central Interactive Handle */}
              <div 
                className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-[#FFF5C0] via-[#D4AF37] to-[#B8860B] shadow-[0_0_15px_rgba(212,175,55,0.9)]"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              >
                {/* Ornate Gold Medallion Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-tr from-[#7A5410] via-[#D4AF37] to-[#FFF5C0] p-1 shadow-[0_0_25px_rgba(212,175,55,0.95)] flex items-center justify-center transition-transform group-hover:scale-110">
                  <div className="w-full h-full rounded-full bg-[#3D2806] flex items-center justify-center text-[#FFF5C0] border border-[#F5E6A3]">
                    <div className="flex items-center gap-0.5">
                      <ChevronLeft className="w-4 h-4 animate-pulse text-amber-300" />
                      <ChevronRight className="w-4 h-4 animate-pulse text-rose-300" />
                    </div>
                  </div>
                </div>

                {/* Top and Bottom Jewels */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FFF5C0] border border-[#7A5410] shadow-md" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FFF5C0] border border-[#7A5410] shadow-md" />
              </div>

              {/* Drag Hint at Bottom Center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/70 text-white text-xs font-serif font-bold shadow-lg flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>انگشت خود را به چپ و راست بکشید</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
