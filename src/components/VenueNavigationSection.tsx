import React from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Compass, 
  ShieldCheck, 
  CloudMoon, 
  Moon, 
  Thermometer, 
  Wind, 
  Crown, 
  Sparkles, 
  Building2 
} from 'lucide-react';
import { INVITATION_DETAILS } from '../data/invitationData';
import shalizHallImg from '../assets/images/shaliz_hall_clean_1787695329102.jpg';

export const VenueNavigationSection: React.FC = () => {
  const { address, googleMapsLink, neshanLink, baladLink, parking, dressCode } = INVITATION_DETAILS.venue;

  return (
    <section id="venue-section" className="relative my-14 w-full px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FFFDF9] px-4 py-1 text-xs text-[#8A6412] shadow-sm">
            <Compass className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>آدرس دقیق و مسیریابی هوشمند</span>
            <Compass className="h-3.5 w-3.5 text-[#B8860B]" />
          </div>
          <h2 className="mt-3 font-calligraphy text-2xl sm:text-3xl font-bold tracking-tight text-[#2E2415]">
            محل برگزاری ضیافت شام و مراسم پاگشایی
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-28 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
        </div>

        {/* Main Venue Card in Pearl Ivory & Royal Gold */}
        <div className="overflow-hidden rounded-3xl border-2 border-[#D4AF37]/70 bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#FAF4E6] p-5 sm:p-8 shadow-[0_15px_40px_rgba(212,175,55,0.18)] relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE899]/30 rounded-full blur-3xl pointer-events-none" />

          {/* 👑 Shaliz Hall Hero Showcase Banner */}
          <div className="relative mb-7 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_10px_30px_rgba(0,0,0,0.15)] group">
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-stone-900">
              <img
                src={shalizHallImg}
                alt="تالار و رستوران پذیرایی شالیز"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140F06]/90 via-[#140F06]/40 to-transparent" />
            </div>

            {/* Floating Venue Badge Overlay on Image */}
            <div className="absolute bottom-3 right-3 left-3 sm:bottom-4 sm:right-4 sm:left-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-right">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-stone-950 text-[11px] font-bold shadow-md mb-1.5 backdrop-blur-md">
                  <Crown className="w-3.5 h-3.5 fill-stone-950" />
                  <span>میزبان ضیافت شام وصال</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-md font-serif">
                  تالار و رستوران شالیز
                </h3>
              </div>

              <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>سالن اختصاصی پذیرایی و شام</span>
              </div>
            </div>
          </div>

          {/* Address & Venue Details */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#F0E4C8] text-[#8A6412] shrink-0 shadow-md">
              <MapPin className="h-7 w-7 animate-bounce text-[#946914]" />
            </div>
            <div className="flex-1 text-right w-full">
              {/* Highlighted Venue Title */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-black text-[#5C3F0C] tracking-tight">
                    تالار شالیز
                  </span>
                  <span className="rounded-full border border-[#D4AF37] bg-[#FFF8E7] px-3 py-0.5 text-xs text-[#8A6412] font-bold shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B8860B]" />
                    <span>محل برگزاری شام</span>
                  </span>
                </div>
              </div>

              {/* Exact Address Highlight Box */}
              <div className="mt-3 p-4 rounded-2xl border-2 border-[#D4AF37]/40 bg-[#FFFDF8] shadow-sm">
                <div className="text-xs text-[#8A6412] font-bold mb-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#B8860B]" />
                  <span>نشانی دقیق تالار:</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-[#2D2314] font-bold">
                  {address}
                </p>
                <div className="mt-2 text-xs text-[#8A6412] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#B8860B] shrink-0" />
                  <span>بین ابوذر و نظمیه، پلاک ۴۸ (تالار شالیز)</span>
                </div>
              </div>
              
              {/* Extra Venue Features (Parking, Dress Code) */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-xl border border-[#D4AF37]/40 bg-[#FFFFFF] px-3 py-1.5 text-[#5A4521] font-semibold flex items-center gap-1 shadow-sm">
                  🚗 <span>{parking}</span>
                </span>
                <span className="rounded-xl border border-[#D4AF37]/40 bg-[#FFFFFF] px-3 py-1.5 text-[#5A4521] font-semibold flex items-center gap-1 shadow-sm">
                  👔 <span>پوشش: {dressCode}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Date & Time Recap in Pearl Ivory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 rounded-2xl border border-[#D4AF37]/40 bg-[#FFFDF9] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FAF5EA] border border-[#D4AF37]/50 text-[#8A6412]">
                <Calendar className="h-5 w-5 text-[#B8860B]" />
              </div>
              <div className="text-right">
                <span className="text-xs text-[#7A643B] font-medium block">تاریخ مراسم:</span>
                <span className="text-sm font-bold text-[#352814]">{INVITATION_DETAILS.eventDatePersian}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FAF5EA] border border-[#D4AF37]/50 text-[#8A6412]">
                <Clock className="h-5 w-5 text-[#B8860B]" />
              </div>
              <div className="text-right">
                <span className="text-xs text-[#7A643B] font-medium block">ساعت شروع ضیافت:</span>
                <span className="text-sm font-bold text-[#352814]">{INVITATION_DETAILS.eventTime}</span>
              </div>
            </div>
          </div>

          {/* 1-Click Navigation Buttons Grid with exact user links */}
          <div>
            <h4 className="text-xs font-bold text-[#8A6412] mb-3 text-right flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-[#B8860B]" />
              <span>مسیریابی مستقیم با ۱ کلیک به تالار شالیز در اپلیکیشن‌های نقشه:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* Google Maps (Exact User Link) */}
              <a
                id="google-maps-nav-btn"
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-blue-400/50 bg-[#FFFFFF] hover:border-blue-500 hover:bg-blue-50/50 transition-all group shadow-sm text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-300 text-blue-600 font-bold text-lg">
                    G
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#2A2318] block">گوگل مپ</span>
                    <span className="text-[10px] text-blue-600 font-medium">Google Maps</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-blue-500 group-hover:translate-x-[-2px] transition-transform" />
              </a>

              {/* Neshan (Exact User Link) */}
              <a
                id="neshan-nav-btn"
                href={neshanLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-emerald-400/50 bg-[#FFFFFF] hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group shadow-sm text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-600 font-bold text-lg">
                    ن
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#2A2318] block">مسیریاب نشان</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Neshan App</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-emerald-500 group-hover:translate-x-[-2px] transition-transform" />
              </a>

              {/* Balad (Exact User Link) */}
              <a
                id="balad-nav-btn"
                href={baladLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-rose-400/50 bg-[#FFFFFF] hover:border-rose-500 hover:bg-rose-50/50 transition-all group shadow-sm text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 border border-rose-300 text-rose-600 font-bold text-lg">
                    ب
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#2A2318] block">مسیریاب بلد</span>
                    <span className="text-[10px] text-rose-600 font-medium">Balad App</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-rose-500 group-hover:translate-x-[-2px] transition-transform" />
              </a>
            </div>
          </div>

          {/* Evening Atmospheric & Weather Comfort Card */}
          <div className="mt-6 pt-5 border-t border-[#D4AF37]/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-[#FFFDF8] border border-[#D4AF37]/40 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-right">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37] bg-[#FAF5EA] text-[#8A6412] shrink-0">
                  <CloudMoon className="h-6 w-6 text-[#B8860B]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8A6412]">
                    <Moon className="h-3.5 w-3.5" />
                    <span>وضعیت آب‌وهوای تبریز (شب مراسم در تالار شالیز)</span>
                  </div>
                  <p className="text-xs text-[#594626] font-medium mt-0.5">
                    {INVITATION_DETAILS.weather.condition}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-[#FFFFFF] border border-[#D4AF37]/30 px-3 py-1.5 shadow-sm">
                  <Thermometer className="h-4 w-4 text-[#B8860B]" />
                  <div className="text-right">
                    <span className="text-[10px] text-[#7A643B] block">دمای تقریبی</span>
                    <span className="text-xs font-bold text-[#352814]">{INVITATION_DETAILS.weather.temperature}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[#FFFFFF] border border-[#D4AF37]/30 px-3 py-1.5 shadow-sm">
                  <Wind className="h-4 w-4 text-sky-600" />
                  <div className="text-right">
                    <span className="text-[10px] text-[#7A643B] block">نسیم شبانه</span>
                    <span className="text-xs font-bold text-[#352814]">{INVITATION_DETAILS.weather.nightForecast}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
