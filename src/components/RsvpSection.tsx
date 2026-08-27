import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Heart, 
  Send, 
  CheckCircle2, 
  Users, 
  Phone, 
  MessageSquareHeart, 
  Sparkles,
  UserCheck,
  UserX,
  ShieldCheck,
  UtensilsCrossed
} from "lucide-react";
import confetti from "canvas-confetti";

export const RsvpSection: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "declined">("attending");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [dietaryOrNote, setDietaryOrNote] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("لطفاً نام و نام خانوادگی خود را وارد فرمایید.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(now);

      const rsvpsRef = collection(db, "rsvps");
      await addDoc(rsvpsRef, {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        attendance,
        guestsCount: attendance === "attending" ? guestsCount : 0,
        dietaryOrNote: dietaryOrNote.trim(),
        message: message.trim(),
        createdAt: Date.now(),
        formattedDate,
      });

      setIsSuccess(true);
      setIsSubmitting(false);

      if (attendance === "attending") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#D4AF37", "#F3E5AB", "#AA7C11", "#FFFFFF"],
        });
      }
    } catch {
      setErrorMessage("خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش نمایید.");
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPhoneNumber("");
    setAttendance("attending");
    setGuestsCount(1);
    setDietaryOrNote("");
    setMessage("");
    setIsSuccess(false);
    setErrorMessage("");
  };

  return (
    <section id="rsvp-section" className="relative py-16 px-4 max-w-4xl mx-auto z-20">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-amber-400/10 to-transparent blur-3xl pointer-events-none rounded-3xl" />

      <div className="relative bg-stone-900/80 border border-amber-500/30 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Top Ornaments */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400" />
          <Heart className="w-5 h-5 text-amber-400 fill-amber-400/30 animate-pulse" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mb-2">
            اعلام حضور در ضیافت پاگشایی
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            حضور گرم و پرمهر شما، زینت‌بخش این جشن و آغاز فصلی نو در زندگی ما خواهد بود. خواهشمندیم با تکمیل فرم زیر ما را در میزبانی هرچه بهتر یاری فرمایید.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 px-4 bg-amber-500/10 border border-amber-400/40 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30 text-stone-950">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-200 mb-2">
                {attendance === "attending"
                  ? "پاسخ و تایید حضور شما با موفقیت ثبت گردید!"
                  : "پیام و عذرخواهی شما با احترام ثبت شد"}
              </h3>
              <p className="text-stone-300 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
                {attendance === "attending"
                  ? `جناب/سرکار ${name} گرامی، بی‌صبرانه مشتاق دیدار روی ماه شما و همراهان محترمتان در این شب خاطره‌انگیز هستیم.`
                  : `جناب/سرکار ${name} عزیز، از ارسال پیام و دعای خیر شما سپاسگزاریم و جای شما در جشن ما سبز خواهد بود.`}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-sm font-medium transition-all"
                >
                  ثبت پاسخ برای مهمان دیگر
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="rsvp-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Attendance Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("attending")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all text-sm sm:text-base font-semibold ${
                    attendance === "attending"
                      ? "bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-600/30 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/10"
                      : "bg-stone-800/50 border-stone-700/60 text-stone-400 hover:border-stone-600"
                  }`}
                >
                  <UserCheck className={`w-5 h-5 ${attendance === "attending" ? "text-amber-400" : "text-stone-400"}`} />
                  <span>با کمال افتخار حضور می‌یابم</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance("declined")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all text-sm sm:text-base font-semibold ${
                    attendance === "declined"
                      ? "bg-gradient-to-r from-stone-700/60 to-stone-800/80 border-amber-400/60 text-amber-200 shadow-md"
                      : "bg-stone-800/50 border-stone-700/60 text-stone-400 hover:border-stone-600"
                  }`}
                >
                  <UserX className={`w-5 h-5 ${attendance === "declined" ? "text-stone-300" : "text-stone-500"}`} />
                  <span>متأسفانه سعادت حضور ندارم</span>
                </button>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-amber-200 mb-1.5">
                    نام و نام خانوادگی شریف <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: مریم کریمی یا خانواده محترم رضایی"
                    className="w-full bg-stone-800/80 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-stone-100 text-sm placeholder-stone-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-amber-200 mb-1.5">
                    شماره تماس (اختیاری)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0912..."
                      className="w-full bg-stone-800/80 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-stone-100 text-sm placeholder-stone-500 outline-none transition text-left"
                    />
                    <Phone className="absolute right-3 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Number of Guests (Only if attending) */}
              {attendance === "attending" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-stone-800/40 border border-stone-700/70 rounded-2xl p-4 sm:p-5">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-200 mb-3">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>تعداد کل نفرات تشریف‌فرما (شامل خودتان)</span>
                    </label>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestsCount(num)}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-base font-bold transition-all flex items-center justify-center ${
                            guestsCount === num
                              ? "bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-md shadow-amber-500/30 scale-105"
                              : "bg-stone-800 text-stone-300 border border-stone-700 hover:border-amber-500/40"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <div className="flex items-center gap-2 mr-auto text-xs text-stone-400">
                        <span>نفر</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-200 mb-1.5">
                      <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                      <span>ملاحظات پذیرایی یا رژیم غذایی ویژه (اختیاری)</span>
                    </label>
                    <input
                      type="text"
                      value={dietaryOrNote}
                      onChange={(e) => setDietaryOrNote(e.target.value)}
                      placeholder="مثال: رژیم گیاه‌خواری، صندلی کودک، ..."
                      className="w-full bg-stone-800/80 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-stone-100 text-sm placeholder-stone-500 outline-none transition"
                    />
                  </div>
                </motion.div>
              )}

              {/* Congratulatory Message */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-200 mb-1.5">
                  <MessageSquareHeart className="w-4 h-4 text-amber-400" />
                  <span>پیام شادباش و تبریک برای آیسان و مرتضی (اختیاری)</span>
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="آرزوی قلبی یا یادداشت صمیمانه شما..."
                  className="w-full bg-stone-800/80 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-stone-100 text-sm placeholder-stone-500 outline-none transition resize-none"
                />
              </div>

              {errorMessage && (
                <div className="text-rose-400 text-xs sm:text-sm text-center bg-rose-950/40 border border-rose-800/60 rounded-xl p-3">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ثبت نهایی و ارسال پاسخ</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer Admin Link */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500/70" />
            ثبت آنی در پایگاه داده ابری
          </span>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-amber-400/80 hover:text-amber-300 underline underline-offset-4 transition flex items-center gap-1"
          >
            ورود میزبانان به پنل مدیریت مهمانان
          </button>
        </div>
      </div>
    </section>
  );
};
