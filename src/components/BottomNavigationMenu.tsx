import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  MapPin, 
  MessageSquareHeart,
  ChevronUp,
  Compass,
  ArrowUp
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

export const BottomNavigationMenu: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero-section");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    {
      id: "hero-section",
      label: "آغاز کارت",
      shortLabel: "کارت",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: "story-section",
      label: "داستان ما",
      shortLabel: "داستان",
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: "venue-section",
      label: "مسیریابی و آدرس",
      shortLabel: "آدرس",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "wishes-guestbook",
      label: "دفترچه تبریک",
      shortLabel: "تبریک و شادباش",
      icon: <MessageSquareHeart className="w-4 h-4" />,
    },
  ];

  // Always keep bottom menu visible & detect current active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Close expanded drawer on scroll to keep view clean
      if (isExpanded) {
        setIsExpanded(false);
      }

      // If near the top, highlight hero
      if (scrollY < 100) {
        setActiveSection("hero-section");
        return;
      }

      // If near the very bottom, activate guestbook or rsvp
      if (scrollY + windowHeight >= docHeight - 120) {
        const wishesElem = document.getElementById("wishes-guestbook");
        if (wishesElem) {
          setActiveSection("wishes-guestbook");
          return;
        }
      }

      // Check sections from top to bottom
      const scrollPosition = scrollY + windowHeight * 0.38;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top - 60) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close expanded drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Smoothly auto-glide the horizontal scroll bar to keep the active section centered
  useEffect(() => {
    if (navContainerRef.current) {
      const container = navContainerRef.current;
      const activeBtn = container.querySelector(`[data-nav-id="${activeSection}"]`) as HTMLElement | null;
      if (activeBtn) {
        // Center the active button within the scrollable container smoothly
        const containerWidth = container.clientWidth;
        const btnLeft = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        const targetScroll = btnLeft - (containerWidth / 2) + (btnWidth / 2);

        container.scrollTo({
          left: targetScroll,
          behavior: "smooth"
        });
      }
    }
  }, [activeSection]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -25;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      setIsExpanded(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-5 inset-x-0 z-40 flex justify-center px-2 sm:px-4 pointer-events-none">
      <motion.div
        ref={menuRef}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="pointer-events-auto relative max-w-xl w-full"
      >
        {/* Expanded Desktop & Mobile Full Grid Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="mb-2.5 p-3.5 sm:p-4 rounded-3xl bg-[#1A1612]/95 border border-[#D4AF37]/50 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header with Title and Scroll to Top */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-800/80 px-1">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  دسترسی سریع به بخش‌های دعوت‌نامه
                </span>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="text-[11px] text-stone-400 hover:text-amber-300 flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-800/70 hover:bg-stone-800 transition cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3 text-amber-400" />
                  <span>بالای صفحه</span>
                </button>
              </div>

              {/* Grid of All Sections */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
                        isActive
                          ? "bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-stone-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                          : "bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-amber-200 border border-stone-700/60"
                      }`}
                    >
                      <div className={`mb-1 ${isActive ? "text-stone-950" : "text-amber-400"}`}>
                        {item.icon}
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium line-clamp-1">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Quick Bar (Pill Shape) */}
        <div className="bg-[#181410]/95 border border-[#D4AF37]/50 backdrop-blur-2xl rounded-full p-1.5 sm:p-2 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center justify-between gap-1.5 sm:gap-2 ring-1 ring-[#D4AF37]/20">
          {/* Scrollable quick tabs (Auto Glides) */}
          <div 
            ref={navContainerRef}
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 px-1 py-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  data-nav-id={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 select-none active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-stone-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.45)] ring-1 ring-amber-300 scale-102"
                      : "text-stone-300 hover:text-amber-300 hover:bg-stone-800/80"
                  }`}
                >
                  <span className={isActive ? "text-stone-950" : "text-amber-400"}>
                    {item.icon}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium">{item.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle All Grid Menu Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer select-none active:scale-95 ${
              isExpanded
                ? "bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 shadow-md ring-1 ring-amber-400"
                : "bg-stone-800/90 text-amber-300 border border-amber-500/40 hover:bg-stone-800 hover:text-amber-200"
            }`}
            title="نمایش تمام بخش‌ها"
          >
            <ChevronUp
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180 text-stone-950" : "text-amber-400"
              }`}
            />
            <span className="text-[11px] sm:text-xs">فهرست</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
