import React from 'react';
import { Heart, Sparkles, MapPin, Calendar, Crown } from 'lucide-react';
import { INVITATION_DETAILS } from '../data/invitationData';

export const FooterSection: React.FC = () => {
  return (
    <footer className="relative pt-12 pb-24 px-4 text-center border-t-2 border-[#D4AF37]/40 bg-gradient-to-b from-[#FAF6EE] to-[#F2E8D2]">
      <div className="max-w-xl mx-auto">
        {/* Monogram Seal in Royal Gold with English 'A & M' */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8A6412] via-[#D4AF37] to-[#FFEAA0] flex items-center justify-center mx-auto mb-3 shadow-[0_5px_20px_rgba(212,175,55,0.4)] border-2 border-[#FFF2A3]">
          <span className="text-sm font-black text-[#FFFFFF] font-serif drop-shadow-sm">
            A & M
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#352814] font-serif mb-1">
          {INVITATION_DETAILS.bride} و {INVITATION_DETAILS.groom}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#6B5733] mb-4 leading-relaxed max-w-md mx-auto font-medium">
          با افتخار و شوق فراوان، چشم‌به‌راه قدوم پربرکت و صمیمانه یکایک شما سروران و عزیزان گرامی هستیم.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#8A6412] font-bold mb-6">
          <span>گرمی‌بخش بزم ما باشید</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        <div className="h-[1.5px] w-36 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-4" />

        <p className="text-xs text-[#352814] font-bold">
          مراسم پاگشایی • {INVITATION_DETAILS.eventDatePersian} ساعت ۲۰:۰۰
        </p>
        <p className="text-[11px] text-[#6B5733] mt-1 font-medium">
          تبریز، بلوار آزادی، بین ابوذر و نظمیه، پلاک ۴۸ (تالار پذیرایی شالیز)
        </p>
      </div>
    </footer>
  );
};
