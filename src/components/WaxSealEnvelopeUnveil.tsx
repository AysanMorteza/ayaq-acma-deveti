import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Mail } from 'lucide-react';
import { INVITATION_DETAILS } from '../data/invitationData';
import { globalAudio } from '../utils/audioPlayer';
import goldWaxSealImg from '../assets/images/gold_wax_seal_1787529093798.jpg';
import banquetBgImg from '../assets/images/bright_banquet_bg_1787529071986.jpg';

interface WaxSealEnvelopeUnveilProps {
  onUnveil: () => void;
}

export const WaxSealEnvelopeUnveil: React.FC<WaxSealEnvelopeUnveilProps> = ({ onUnveil }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isCardRising, setIsCardRising] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parallax tilt effect on mouse / touch moves
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isOpening) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isOpening || !e.touches[0]) return;
      const touch = e.touches[0];
      const { innerWidth, innerHeight } = window;
      const x = (touch.clientX / innerWidth - 0.5) * 15;
      const y = (touch.clientY / innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpening]);

  // Ambient Golden Stardust Particles on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: -(Math.random() * 0.5 + 0.2),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = Math.max(0.1, p.opacity + Math.sin(p.angle) * 0.25);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.2);
        gradient.addColorStop(0, `rgba(255, 248, 220, ${currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(224, 180, 60, ${currentOpacity * 0.85})`);
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Web Audio API: Clean, tactile wax break and bell chime
  const playRealisticOpenSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const t0 = ctx.currentTime;

      // 1. Wax snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(3000, t0);
      snapOsc.frequency.exponentialRampToValueAtTime(400, t0 + 0.08);

      snapGain.gain.setValueAtTime(0.5, t0);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(t0);
      snapOsc.stop(t0 + 0.1);

      // 2. Paper slide swoosh
      const swooshDuration = 0.4;
      const bufferSize = Math.floor(ctx.sampleRate * swooshDuration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + 0.04 * white) / 1.04;
        const progress = i / bufferSize;
        const env = Math.sin(progress * Math.PI) * (1 - progress * 0.4);
        data[i] = lastVal * env * 3.2;
      }

      const swooshSource = ctx.createBufferSource();
      swooshSource.buffer = buffer;

      const swooshFilter = ctx.createBiquadFilter();
      swooshFilter.type = 'lowpass';
      swooshFilter.frequency.setValueAtTime(1400, t0 + 0.05);
      swooshFilter.frequency.exponentialRampToValueAtTime(2600, t0 + 0.18);
      swooshFilter.frequency.exponentialRampToValueAtTime(600, t0 + swooshDuration);

      const swooshGain = ctx.createGain();
      swooshGain.gain.setValueAtTime(0.001, t0 + 0.05);
      swooshGain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.14);
      swooshGain.gain.exponentialRampToValueAtTime(0.001, t0 + swooshDuration + 0.05);

      swooshSource.connect(swooshFilter);
      swooshFilter.connect(swooshGain);
      swooshGain.connect(ctx.destination);
      swooshSource.start(t0 + 0.05);

      // 3. Gentle harmonic bell chime
      const bellFreqs = [1046.5, 1318.5, 1567.98];
      bellFreqs.forEach((freq, idx) => {
        const bellOsc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(freq, t0 + 0.1 + idx * 0.06);

        bellGain.gain.setValueAtTime(0.0001, t0 + 0.1 + idx * 0.06);
        bellGain.gain.exponentialRampToValueAtTime(0.06, t0 + 0.1 + idx * 0.06 + 0.02);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1 + idx * 0.06 + 0.7);

        bellOsc.connect(bellGain);
        bellGain.connect(ctx.destination);
        bellOsc.start(t0 + 0.1 + idx * 0.06);
        bellOsc.stop(t0 + 0.1 + idx * 0.06 + 0.75);
      });
    } catch {
      // Audio fallback
    }
  }, []);

  const handleOpenEnvelope = () => {
    if (isOpening) return;

    setIsOpening(true);
    playRealisticOpenSound();
    
    // Explicit direct audio playback within user click event thread
    try {
      globalAudio.play();
    } catch (e) {
      console.warn('Direct audio play call:', e);
    }
    
    onUnveil();

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FFF8DC', '#FFD700', '#F39C12', '#FFFFFF', '#D4AF37'],
        shapes: ['circle', 'square'],
        scalar: 1.1,
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsCardRising(true);
    }, 250);

    setTimeout(() => {
      setIsCompleted(true);
    }, 1400);
  };

  if (isCompleted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden transition-all duration-700 ${
        isOpening && isCardRising ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 🌸 Warm & Bright Luxury Banquet Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105 pointer-events-none"
        style={{
          backgroundImage: `url(${banquetBgImg})`,
          filter: 'brightness(1.02) contrast(1.03) saturate(1.05)'
        }}
      />

      {/* Gentle Warm Champagne Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, rgba(255, 250, 240, 0.35) 0%, rgba(250, 240, 220, 0.65) 50%, rgba(210, 180, 130, 0.85) 100%)'
        }}
      />

      {/* ✨ Floating Golden Particle Sparkle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* ✉️ Main 3D Floating Parchment Envelope & Emerging Card */}
      <div
        className="relative z-20 flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full"
        style={{
          perspective: '1200px',
        }}
      >
        
        {/* Envelope & Card Group Container matching exact screenshot */}
        <div
          className="relative w-80 sm:w-96 flex flex-col items-center justify-center transition-all duration-500 ease-out"
          style={{
            transform: isOpening
              ? 'translateY(-15px) scale(1.03)'
              : `rotate(-4deg) rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)`,
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 20px 30px rgba(110, 80, 30, 0.35)) drop-shadow(0 0 35px rgba(230, 195, 100, 0.35))'
          }}
        >

          {/* 📜 1. PEEKING ROYAL INVITATION CARD (Visible above envelope exactly as in screenshot) */}
          <div
            className="w-72 sm:w-80 h-56 sm:h-64 rounded-t-3xl border-t-2 border-x-2 border-[#DFCFB0] px-5 pt-5 pb-2 flex flex-col items-center text-center transition-all duration-700 ease-out overflow-hidden shadow-md"
            style={{
              background: 'linear-gradient(175deg, #FFFFFF 0%, #FAF6EE 50%, #F5ECDA 100%)',
              transform: isCardRising
                ? 'translateY(-80px) scale(1.05)'
                : 'translateY(25px)',
              zIndex: 10,
            }}
          >
            {/* Top-Right Gold Foil Botanical Sprig */}
            <div className="absolute top-2 right-3 w-14 h-14 sm:w-16 sm:h-16 pointer-events-none opacity-85">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <path d="M75 5 C 55 6, 25 22, 16 50" stroke="url(#goldSprigR)" strokeWidth="2" strokeLinecap="round" />
                <path d="M75 5 C 58 22, 50 42, 52 68" stroke="url(#goldSprigR)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M62 16 Q 76 10 78 24 Q 65 28 62 16 Z" fill="url(#goldSprigR)" />
                <path d="M46 26 Q 60 20 58 35 Q 46 32 46 26 Z" fill="url(#goldSprigR)" />
                <circle cx="74" cy="6" r="2.2" fill="#E5BA5A" />
                <circle cx="46" cy="26" r="1.8" fill="#E5BA5A" />
                <defs>
                  <linearGradient id="goldSprigR" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF4D0" />
                    <stop offset="0.3" stopColor="#E5BA5A" />
                    <stop offset="0.7" stopColor="#A87A1E" />
                    <stop offset="1" stopColor="#754F08" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Top-Left Gold Foil Botanical Sprig */}
            <div className="absolute top-2 left-3 w-14 h-14 sm:w-16 sm:h-16 pointer-events-none opacity-85 transform -scale-x-100">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <path d="M75 5 C 55 6, 25 22, 16 50" stroke="url(#goldSprigL)" strokeWidth="2" strokeLinecap="round" />
                <path d="M75 5 C 58 22, 50 42, 52 68" stroke="url(#goldSprigL)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M62 16 Q 76 10 78 24 Q 65 28 62 16 Z" fill="url(#goldSprigL)" />
                <path d="M46 26 Q 60 20 58 35 Q 46 32 46 26 Z" fill="url(#goldSprigL)" />
                <circle cx="74" cy="6" r="2.2" fill="#E5BA5A" />
                <circle cx="46" cy="26" r="1.8" fill="#E5BA5A" />
                <defs>
                  <linearGradient id="goldSprigL" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF4D0" />
                    <stop offset="0.3" stopColor="#E5BA5A" />
                    <stop offset="0.7" stopColor="#A87A1E" />
                    <stop offset="1" stopColor="#754F08" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Persian Calligraphy: « آیسان و مرتضی » */}
            <div className="pt-2 pb-1 flex flex-col items-center justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold font-calligraphy tracking-wide gold-text-foil drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]">
                {INVITATION_DETAILS.bride} <span className="text-[#C59A27] font-normal text-2xl sm:text-3xl px-1">و</span> {INVITATION_DETAILS.groom}
              </h2>

              {/* Event Title Pill Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF2DE] to-[#FFFDF9] border border-[#D4AF37]/60 shadow-[0_2px_8px_rgba(212,175,55,0.2)]">
                <Sparkles className="w-3 h-3 text-[#B8860B]" />
                <span className="text-xs sm:text-[13px] font-bold text-[#7A510A] font-naskh tracking-normal">
                  {INVITATION_DETAILS.title}
                </span>
                <Sparkles className="w-3 h-3 text-[#B8860B]" />
              </div>
            </div>
          </div>

          {/* ✉️ 2. ENVELOPE FRONT BODY WITH CENTER CIRCULAR GLOW & WAX SEAL */}
          <div 
            className="relative w-80 sm:w-96 h-52 sm:h-56 -mt-10 rounded-2xl overflow-visible shadow-2xl"
            style={{
              zIndex: 20,
              background: 'linear-gradient(145deg, #FAF4E6 0%, #EDE1C8 60%, #DFCDB0 100%)',
              border: '1px solid #DFCFB0',
              boxShadow: '0 15px 35px rgba(110, 80, 30, 0.3), inset 0 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            {/* Envelope Diagonal Lines/Folds Texture */}
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            >
              {/* Left fold triangle */}
              <div
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-white/30 via-transparent to-black/5"
                style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
              />
              {/* Right fold triangle */}
              <div
                className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-bl from-white/30 via-transparent to-black/5"
                style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
              />
              {/* Bottom fold triangle */}
              <div
                className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white/40 via-transparent to-transparent"
                style={{ clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)' }}
              />
            </div>

            {/* ⚜️ CENTER CIRCULAR WHITE BACKDROP PLATE & GOLD WAX SEAL (Matching screenshot) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              {/* White/Cream Circular Glow Plate */}
              <div 
                className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(250,245,235,0.85) 65%, rgba(240,230,210,0) 100%)',
                  filter: 'drop-shadow(0 4px 12px rgba(180, 140, 60, 0.25))'
                }}
              >
                {/* Gold Wax Seal Button */}
                <button
                  id="wax-seal-button"
                  type="button"
                  onClick={handleOpenEnvelope}
                  disabled={isOpening}
                  aria-label="گشودن پاکت دعوتنامه با لمس مهر و موم طلاکوب"
                  className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-95 hover:scale-105"
                >
                  {/* Subtle Gold Ambient Halo */}
                  <div 
                    className="absolute inset-[-6px] rounded-full bg-[#E5BA5A]/45 blur-md group-hover:bg-[#FFDF78]/70 transition-all duration-300 animate-pulse"
                    style={{ animationDuration: '2.5s' }}
                  />

                  {/* Wax Seal Image with 3D Bevel */}
                  <div 
                    className="relative w-full h-full rounded-full overflow-hidden transition-transform duration-500 group-hover:rotate-6"
                    style={{
                      boxShadow: `
                        0 8px 20px rgba(110, 75, 15, 0.4),
                        0 0 25px rgba(230, 185, 75, 0.6),
                        inset 0 2px 4px rgba(255, 255, 255, 0.9),
                        inset 0 -3px 6px rgba(160, 110, 20, 0.4)
                      `
                    }}
                  >
                    <img
                      src={goldWaxSealImg}
                      alt="مهر و موم طلاکوب آیسان و مرتضی"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />

                    {/* Glint on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />
                  </div>

                  {/* Pill Tag Below Seal: « ✨ لمس کنید » (Exactly as in screenshot) */}
                  <span className="absolute -bottom-2.5 inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold bg-[#FAF2DE]/95 text-[#6D4C13] px-3 py-0.5 rounded-full font-serif shadow-md border border-[#D4AF37] group-hover:border-[#B8860B] group-hover:bg-[#FFF9EB] whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-[#B8860B]" />
                    لمس کنید
                  </span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ✉️ 3. Bottom Pill Instruction Bar (Matching screenshot) */}
        {!isOpening && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white/75 backdrop-blur-md border border-[#D4AF37]/50 shadow-sm text-xs sm:text-sm font-serif font-bold text-[#5A3F0E]">
              <span>برای گشودن دعوتنامه، روی مهر طلاکوب لمس فرمایید</span>
              <Mail className="w-4 h-4 text-[#B8860B]" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
