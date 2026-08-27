import React, { useState } from 'react';
import { LuxuryPetalDustCanvas } from './components/LuxuryPetalDustCanvas';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { WaxSealEnvelopeUnveil } from './components/WaxSealEnvelopeUnveil';
import { HeroSection } from './components/HeroSection';
import { OurStorySection } from './components/OurStorySection';
import { VenueNavigationSection } from './components/VenueNavigationSection';
import { GuestbookWishes } from './components/GuestbookWishes';
import { BottomNavigationMenu } from './components/BottomNavigationMenu';
import { FooterSection } from './components/FooterSection';

export default function App() {
  const [hasUnveiled, setHasUnveiled] = useState<boolean>(false);
  const [startAudioTrigger, setStartAudioTrigger] = useState<boolean>(false);

  const handleEnvelopeUnveil = () => {
    setHasUnveiled(true);
    setStartAudioTrigger(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#262118] font-persian selection:bg-[#D4AF37] selection:text-[#262118] relative overflow-hidden">
      {/* ✨ Luxury Floating Petals & Gold Stardust System */}
      <LuxuryPetalDustCanvas />

      {/* 🎵 Floating Music Player with 3 Studio Tracks */}
      <FloatingMusicPlayer autoPlayTrigger={startAudioTrigger} />

      {/* 🥂 Interactive 3D Realistic Wax Seal & Envelope Unveil */}
      {!hasUnveiled && (
        <WaxSealEnvelopeUnveil onUnveil={handleEnvelopeUnveil} />
      )}

      {/* Main Luxury Invitation Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-20 transition-opacity duration-700">
        {/* 💎 Hero Section + ⏳ Countdown Timer */}
        <HeroSection />

        {/* 📖 Our Story Section (داستان ما - Polaroids & Poetic Story) */}
        <OurStorySection />

        {/* 📍 Venue + 🗺️ 1-Click Navigation + ☀️ Weather */}
        <VenueNavigationSection />

        {/* ✍️ Public Guestbook & Wishes Wall (کامنت‌ها و تبریک‌های مهمانان) */}
        <GuestbookWishes />
      </main>

      {/* Luxury Footer */}
      <FooterSection />

      {/* 🧭 Sticky Luxury Bottom Navigation Bar */}
      <BottomNavigationMenu />
    </div>
  );
}

