import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Sparkles, 
  Crown, 
  ChevronDown, 
  MapPin, 
  Compass, 
  MessageSquareHeart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INVITATION_DETAILS } from '../data/invitationData';

export const HeroSection: React.FC = () => {
  const [showFloatingCue, setShowFloatingCue] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setShowFloatingCue(false);
      } else {
        setShowFloatingCue(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const targetDate = new Date(INVITATION_DETAILS.targetDateISO).getTime();

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -25;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const toPersianNum = (num: number) => {
    return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  };

  return (
    <section id="hero-section" className="relative pt-12 pb-14 px-4 text-center overflow-hidden">
      {/* Radiant Background Warm Gold Sunburst */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none opacity-40 -z-10 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FFE899]/60 via-[#E6CA65]/30 to-transparent blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Top Greeting Badge in Royal Gold & Pearl */}
        <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#FFFDF8] border border-[#D4AF37]/60 shadow-[0_2px_10px_rgba(212,175,55,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
          <span className="text-xs font-bold text-[#8A6412] tracking-wide">
            بنام پیوند دهنده دل‌ها
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
        </div>

        {/* Formal Event Title with authentic Persian display typography */}
        <div className="my-3 sm:my-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal font-lalezar text-[#382613] select-none tracking-normal leading-tight">
            {INVITATION_DETAILS.title}
          </h1>
        </div>

        {/* Honored Couple Names with Shimmering Gold & Beating Heart */}
        <div className="my-6 relative inline-block">
          {/* Subtle Golden Glow aura */}
          <div className="absolute -inset-3 bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent blur-lg pointer-events-none" />
          
          <div className="relative flex items-center justify-center gap-3 sm:gap-4">
            <span className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#B8860B]" />
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black gold-shimmer-text drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)] font-serif select-none">
                {INVITATION_DETAILS.bride}
              </span>
              <div className="animate-authentic-heartbeat flex items-center justify-center">
                <Heart className="w-7 h-7 sm:w-9 sm:h-9 text-rose-500 fill-rose-500/80 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              </div>
              <span className="text-3xl sm:text-5xl md:text-6xl font-black gold-shimmer-text drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)] font-serif select-none">
                {INVITATION_DETAILS.groom}
              </span>
            </div>
            <span className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#B8860B]" />
          </div>
        </div>

        {/* Persian Welcome & Heartfelt Invitation Card in Luxury Cream */}
        <div className="my-6 px-6 py-5 rounded-2xl bg-gradient-to-b from-[#FFFFFF] via-[#FDFAF3] to-[#F7EFE1] border border-[#D4AF37]/50 max-w-lg mx-auto shadow-[0_10px_30px_rgba(212,175,55,0.14)] relative overflow-hidden">
          {/* Subtle gold corner accents */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/40 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/40 rounded-bl-xl pointer-events-none" />
          
          <p className="text-base sm:text-lg text-[#2D2314] leading-relaxed font-serif font-medium">
            <span className="block font-bold text-[#8A6412] text-lg sm:text-xl mb-2">
              « بعضی شب‌ها برای جشن گرفتن نیستند؛ برای ساختن خاطره‌اند. »
            </span>
            <span className="block text-sm sm:text-base text-[#5A4521] leading-relaxed">
              این دعوت، دعوت به یک شام ساده نیست؛<br />
              دعوت به ساختن یک خاطره مشترک است.
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#946914] mt-3 px-3 py-1 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>منتظر حضور گرمتان هستیم</span>
            </span>
          </p>
        </div>

        {/* Date & Time Key Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-6">
          <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#D4AF37]/50 px-4 py-2.5 rounded-xl text-sm font-bold text-[#3D3019] shadow-sm">
            <Calendar className="w-4 h-4 text-[#B8860B]" />
            <span>{INVITATION_DETAILS.eventDatePersian}</span>
          </div>

          <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#D4AF37]/50 px-4 py-2.5 rounded-xl text-sm font-bold text-[#3D3019] shadow-sm">
            <Clock className="w-4 h-4 text-[#B8860B]" />
            <span>{INVITATION_DETAILS.eventTime}</span>
          </div>
        </div>

        {/* Dynamic Countdown Timer Section in Pearl & Royal Gold */}
        <div className="mt-8 pt-6 border-t border-[#D4AF37]/30 max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8A6412] mb-4 flex items-center justify-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>{timeLeft.isExpired ? 'مراسم آغاز گردیده است' : 'شمارش معکوس تا لحظه وصال و آغاز ضیافت شام'}</span>
            <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
          </p>

          {!timeLeft.isExpired ? (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto" dir="ltr">
              {/* Seconds */}
              <div className="bg-gradient-to-b from-[#FFFFFF] to-[#FAF3E3] border border-[#D4AF37]/60 rounded-2xl p-2.5 sm:p-3 shadow-[0_4px_15px_rgba(212,175,55,0.15)] flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-[#946914] font-serif">
                  {toPersianNum(timeLeft.seconds)}
                </span>
                <span className="text-[10px] sm:text-xs text-[#7A643B] font-bold mt-0.5">ثانیه</span>
              </div>

              {/* Minutes */}
              <div className="bg-gradient-to-b from-[#FFFFFF] to-[#FAF3E3] border border-[#D4AF37]/60 rounded-2xl p-2.5 sm:p-3 shadow-[0_4px_15px_rgba(212,175,55,0.15)] flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-[#946914] font-serif">
                  {toPersianNum(timeLeft.minutes)}
                </span>
                <span className="text-[10px] sm:text-xs text-[#7A643B] font-bold mt-0.5">دقیقه</span>
              </div>

              {/* Hours */}
              <div className="bg-gradient-to-b from-[#FFFFFF] to-[#FAF3E3] border border-[#D4AF37]/60 rounded-2xl p-2.5 sm:p-3 shadow-[0_4px_15px_rgba(212,175,55,0.15)] flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-[#946914] font-serif">
                  {toPersianNum(timeLeft.hours)}
                </span>
                <span className="text-[10px] sm:text-xs text-[#7A643B] font-bold mt-0.5">ساعت</span>
              </div>

              {/* Days */}
              <div className="bg-gradient-to-b from-[#FFFFFF] to-[#FAF3E3] border border-[#D4AF37]/60 rounded-2xl p-2.5 sm:p-3 shadow-[0_4px_15px_rgba(212,175,55,0.15)] flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-[#946914] font-serif">
                  {toPersianNum(timeLeft.days)}
                </span>
                <span className="text-[10px] sm:text-xs text-[#7A643B] font-bold mt-0.5">روز</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D4AF37] text-center font-bold text-[#8A6412]">
              خوش آمدید! در کمال سرور و شادمانی در کنار هم هستیم.
            </div>
          )}

          {/* 🌟 Quick Jump Shortcut Chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSection('story-section')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#D4AF37]/60 text-xs font-bold text-[#8A6412] hover:bg-[#FAF4E4] hover:border-[#D4AF37] transition shadow-sm cursor-pointer select-none active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>داستان ما</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('venue-section')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#D4AF37]/60 text-xs font-bold text-[#8A6412] hover:bg-[#FAF4E4] hover:border-[#D4AF37] transition shadow-sm cursor-pointer select-none active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>آدرس و مسیریابی تالار</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('wishes-guestbook')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#D4AF37]/60 text-xs font-bold text-[#8A6412] hover:bg-[#FAF4E4] hover:border-[#D4AF37] transition shadow-sm cursor-pointer select-none active:scale-95"
            >
              <MessageSquareHeart className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>دفترچه تبریک</span>
            </button>
          </div>

          {/* ✨ Pulsing & Bouncing Golden Scroll Guide Pill */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => scrollToSection('story-section')}
              className="group flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-gradient-to-b from-[#FFFFFF] via-[#FDFAF3] to-[#F5EAD4] border border-[#D4AF37]/70 shadow-[0_6px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.35)] transition-all cursor-pointer select-none active:scale-95"
            >
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8A6412]">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B] animate-pulse" />
                <span>برای مشاهده ادامه دعوت‌نامه و جزئیات به پایین بکشید</span>
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B] animate-pulse" />
              </div>
              <span className="text-[11px] text-[#9E7728] font-medium">
                (داستان ما، لوکیشن تالار شالیز، منو و تبریک مهمانان)
              </span>
              <div className="mt-1 animate-bounce text-[#B8860B] flex items-center justify-center w-6 h-6 rounded-full bg-[#FAF0D6] border border-[#D4AF37]/50 shadow-inner">
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 Floating Bottom Micro-Cue (Fades out softly after scrolling) */}
      <AnimatePresence>
        {showFloatingCue && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-16 sm:bottom-20 inset-x-0 z-30 flex justify-center pointer-events-none px-4"
          >
            <button
              type="button"
              onClick={() => scrollToSection('story-section')}
              className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#181410]/95 border border-[#D4AF37] text-amber-300 text-xs font-bold shadow-[0_8px_25px_rgba(0,0,0,0.65)] backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 transition-all animate-bounce"
            >
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span>ادامه دعوت‌نامه و جزئیات مراسم ↓</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
