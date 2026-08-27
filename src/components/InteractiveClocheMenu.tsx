import React, { useState } from 'react';
import { Utensils, Sparkles, ChefHat, Flame, Coffee } from 'lucide-react';
import { MENU_DETAILS } from '../data/invitationData';

export const InteractiveClocheMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(1); // Default to Main Dish

  const selectedMenu = MENU_DETAILS[activeCategory];

  return (
    <section id="menu-section" className="relative my-12 sm:my-16 w-full px-3 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FFFDF9] px-4 py-1.5 text-xs text-[#8A6412] shadow-sm font-bold">
            <ChefHat className="h-4 w-4 text-[#B8860B]" />
            <span>پذیرایی و ضیافت شام پاگشایی</span>
            <ChefHat className="h-4 w-4 text-[#B8860B]" />
          </div>
          <h2 className="mt-3 font-calligraphy text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2314]">
            منوی تشریفاتی شام
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6E5936] font-medium max-w-md mx-auto">
            تدارک ویژه با اصیل‌ترین طعم‌ها و مرغوب‌ترین مواد اولیه آذربایجان
          </p>
          <div className="mx-auto mt-3 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
        </div>

        {/* Menu Container Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#F8F2E4] p-5 sm:p-8 shadow-[0_15px_40px_rgba(212,175,55,0.14)]">
          {/* Subtle Golden Glow Accent */}
          <div className="absolute top-0 right-1/4 h-32 w-64 bg-[#FFE899]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-b border-[#D4AF37]/30 pb-5">
            {MENU_DETAILS.map((cat, idx) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => setActiveCategory(idx)}
                className={`flex items-center gap-2 rounded-2xl px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === idx
                    ? 'border-2 border-[#B8860B] bg-gradient-to-r from-[#FFFDF9] to-[#FAF4E6] text-[#7A5310] shadow-[0_4px_15px_rgba(212,175,55,0.25)] scale-102'
                    : 'border border-[#D4AF37]/35 bg-white/80 text-[#6B5733] hover:text-[#8A6412] hover:border-[#D4AF37] hover:bg-white'
                }`}
              >
                {idx === 0 && <Utensils className="h-4 w-4 text-[#B8860B]" />}
                {idx === 1 && <Flame className="h-4 w-4 text-[#B8860B]" />}
                {idx === 2 && <Coffee className="h-4 w-4 text-[#B8860B]" />}
                <span>{cat.persianCategory}</span>
              </button>
            ))}
          </div>

          {/* Food Items Display */}
          <div className="mt-6 space-y-4">
            <div className="text-right px-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A6412] bg-[#FAF0D9] px-3 py-1 rounded-full border border-[#D4AF37]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                {selectedMenu.description}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {selectedMenu.items.map((item, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col sm:flex-row gap-4 overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#FFFFFF] p-4 transition-all duration-300 hover:border-[#B8860B] hover:shadow-[0_8px_25px_rgba(212,175,55,0.18)]"
                >
                  {/* Food Thumbnail with Badge */}
                  <div className="relative h-36 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-[#FAF6EE]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.badge && (
                      <span className="absolute bottom-1.5 right-1.5 rounded-md bg-[#3D3019]/90 px-2 py-0.5 text-[10px] font-bold text-[#FFF2A3] backdrop-blur-sm shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Food Description */}
                  <div className="flex flex-1 flex-col justify-center text-right">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#352814] group-hover:text-[#8A6412] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#6B5733] font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
