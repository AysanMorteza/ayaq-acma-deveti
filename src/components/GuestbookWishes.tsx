import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  increment 
} from "firebase/firestore";
import { db } from "../firebase";
import { RsvpSubmission } from "../types";
import { 
  MessageSquareHeart, 
  Heart, 
  Send, 
  Sparkles, 
  Quote, 
  Feather, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Trash2, 
  ShieldCheck, 
  LogOut, 
  X, 
  AlertCircle, 
  Shield,
  Pin,
  PinOff,
  Award,
  Filter,
  Flame,
  Star
} from "lucide-react";
import confetti from "canvas-confetti";

export const GuestbookWishes: React.FC = () => {
  const [messages, setMessages] = useState<RsvpSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local cache of message IDs liked by THIS visitor
  const [guestLikedMap, setGuestLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("wedding_guest_liked_ids");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Quick comment form state
  const [authorName, setAuthorName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [customRelation, setCustomRelation] = useState("");
  const [wishText, setWishText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 🛡️ Admin Management State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("guestbook_admin_unlocked") === "true";
  });
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [adminError, setAdminError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // View Filter: all | pinned | most_liked
  const [viewFilter, setViewFilter] = useState<"all" | "pinned" | "most_liked">("all");

  // Target Passcode requested by user
  const TARGET_PASSCODE = "Araz_King1383";

  // Listen to Firestore real-time updates
  useEffect(() => {
    const q = query(collection(db, "rsvps"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: RsvpSubmission[] = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<RsvpSubmission, "id">),
          }))
          .filter((item) => item.message && item.message.trim().length > 0);

        setMessages(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading wishes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save guest liked IDs to localStorage
  const saveGuestLikes = (newMap: Record<string, boolean>) => {
    setGuestLikedMap(newMap);
    try {
      localStorage.setItem("wedding_guest_liked_ids", JSON.stringify(newMap));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  };

  // ❤️ Like Handler (Persistent in Firestore with 1-like-per-guest constraint & unlimited for Admin)
  const handleLike = async (id?: string) => {
    if (!id) return;

    // ADMIN MODE: Unlimited likes recorded directly to Firestore
    if (isAdmin) {
      try {
        await updateDoc(doc(db, "rsvps", id), {
          likes: increment(1),
        });
        
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ["#FFD700", "#FF4500", "#FF1493"],
        });
      } catch (err) {
        console.error("Error updating like count by admin:", err);
      }
      return;
    }

    // REGULAR GUEST MODE: 1-like-per-guest (toggleable)
    const isAlreadyLiked = !!guestLikedMap[id];

    if (isAlreadyLiked) {
      // Toggle Unlike (decrement)
      try {
        await updateDoc(doc(db, "rsvps", id), {
          likes: increment(-1),
        });
        const updated = { ...guestLikedMap };
        delete updated[id];
        saveGuestLikes(updated);
      } catch (err) {
        console.error("Error toggling like:", err);
      }
    } else {
      // Like (increment)
      try {
        await updateDoc(doc(db, "rsvps", id), {
          likes: increment(1),
        });
        const updated = { ...guestLikedMap, [id]: true };
        saveGuestLikes(updated);

        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
          colors: ["#E11D48", "#FB7185", "#FBBF24"],
        });
      } catch (err) {
        console.error("Error saving like:", err);
      }
    }
  };

  // 📌 Toggle Pin Wish (Admin Only)
  const handleTogglePin = async (id: string, currentStatus?: boolean) => {
    if (!isAdmin) return;
    try {
      setActionInProgressId(id);
      const newStatus = !currentStatus;
      await updateDoc(doc(db, "rsvps", id), {
        isPinned: newStatus,
        pinnedAt: newStatus ? Date.now() : null,
      });
    } catch (err) {
      console.error("Error toggling pin status:", err);
      alert("خطا در تغییر وضعیت پین پیام.");
    } finally {
      setActionInProgressId(null);
    }
  };

  // ⭐ Toggle Host Selection / Heart (Admin Only)
  const handleToggleHostChoice = async (id: string, currentStatus?: boolean) => {
    if (!isAdmin) return;
    try {
      setActionInProgressId(id);
      await updateDoc(doc(db, "rsvps", id), {
        hostLiked: !currentStatus,
      });
    } catch (err) {
      console.error("Error toggling host choice:", err);
    } finally {
      setActionInProgressId(null);
    }
  };

  // 🛡️ Admin login handler
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = adminPassword.trim();
    if (entered === TARGET_PASSCODE) {
      setIsAdmin(true);
      localStorage.setItem("guestbook_admin_unlocked", "true");
      setShowAdminModal(false);
      setAdminPassword("");
      setAdminError(null);
    } else {
      setAdminError("رمز عبور مدیریت نادرست است. لطفاً رمز صحیح را وارد کنید.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("guestbook_admin_unlocked");
  };

  // 🗑️ Delete message as admin
  const handleDeleteMessage = async (id: string, name: string) => {
    if (!window.confirm(`آیا از حذف پیام تبریک "${name}" اطمینان دارید؟ این پیام برای همیشه حذف خواهد شد.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "rsvps", id));
      setDeletingId(null);
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("خطا در حذف پیام از سرور.");
      setDeletingId(null);
    }
  };

  // Submit new wish
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !wishText.trim()) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(now);

      const finalRelation = relationship === "سایر" 
        ? (customRelation.trim() || "مهمان گرامی")
        : (relationship.trim() || "مهمان گرامی");

      await addDoc(collection(db, "rsvps"), {
        name: authorName.trim(),
        relationship: finalRelation,
        message: wishText.trim(),
        attendance: "attending",
        guestsCount: 1,
        likes: 0,
        isPinned: false,
        createdAt: Date.now(),
        formattedDate,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#D4AF37", "#F3E5AB", "#FF6B81"],
      });

      setAuthorName("");
      setRelationship("");
      setCustomRelation("");
      setWishText("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
      setShowQuickForm(false);
    } catch {
      alert("خطا در ارسال پیام. لطفاً دوباره تلاش نمایید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort & Filter Messages:
  // 1. Pinned items ALWAYS appear on top (sorted by pinnedAt desc)
  // 2. Non-pinned items appear below (sorted by createdAt desc or likes)
  const sortedAndFilteredMessages = useMemo(() => {
    let list = [...messages];

    // Separate pinned and unpinned
    const pinnedList = list
      .filter((m) => !!m.isPinned)
      .sort((a, b) => (b.pinnedAt || b.createdAt || 0) - (a.pinnedAt || a.createdAt || 0));

    let unpinnedList = list.filter((m) => !m.isPinned);

    if (viewFilter === "pinned") {
      return pinnedList;
    }

    if (viewFilter === "most_liked") {
      pinnedList.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      unpinnedList.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // standard view: unpinned sorted by createdAt desc
      unpinnedList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return [...pinnedList, ...unpinnedList];
  }, [messages, viewFilter]);

  const pinnedCount = messages.filter((m) => m.isPinned).length;

  return (
    <section id="wishes-guestbook" className="relative py-16 px-4 max-w-5xl mx-auto z-20">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-amber-300/10 to-transparent blur-3xl pointer-events-none rounded-3xl" />

      <div className="relative bg-gradient-to-b from-[#1C1814]/95 via-[#231E18]/90 to-[#1C1814]/95 border border-amber-500/30 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* 🛡️ Admin Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4 mb-6">
          <div className="flex items-center gap-2 text-amber-300/80 text-xs sm:text-sm">
            <MessageSquareHeart className="w-4 h-4 text-amber-400" />
            <span>دفترچه تبریک آنلاین مهمانان ({messages.length} پیام ثبت شده)</span>
            {pinnedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/40">
                <Pin className="w-3 h-3 text-amber-400" />
                {pinnedCount} تبریک پین‌شده
              </span>
            )}
          </div>

          <div>
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-amber-500/20 border border-amber-400/50 px-3.5 py-1.5 rounded-full text-xs text-amber-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">پنل مدیریت میزبان فعال است</span>
                <span className="text-stone-400 text-[10px]">| (پین، حذف و لایک نامحدود)</span>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="mr-2 text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold text-[11px] cursor-pointer bg-stone-900/60 px-2 py-0.5 rounded-md transition"
                  title="خروج از حالت مدیریت"
                >
                  <LogOut className="w-3 h-3" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAdminError(null);
                  setShowAdminModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-800/90 hover:bg-stone-800 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>ورود مدیریت</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400" />
            <MessageSquareHeart className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mb-2">
            دفترچه تبریک و شادباش مهمانان
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            پیام‌های پرمهر و دعای خیر شما عزیزان که به یادگار در قلب ما و این صفحه ثبت می‌گردد.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowQuickForm(!showQuickForm)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              <span>{showQuickForm ? "بستن فرم ارسال تبریک" : "ارسال پیام تبریک و یادداشت"}</span>
            </button>

            {/* Filter Pills */}
            <div className="flex items-center bg-stone-900/80 border border-stone-700/80 rounded-full p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewFilter("all")}
                className={`px-3 py-1 rounded-full transition font-medium ${
                  viewFilter === "all"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                همه ({messages.length})
              </button>
              {pinnedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setViewFilter("pinned")}
                  className={`px-3 py-1 rounded-full transition flex items-center gap-1 font-medium ${
                    viewFilter === "pinned"
                      ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                      : "text-amber-300/80 hover:text-amber-200"
                  }`}
                >
                  <Pin className="w-3 h-3" />
                  <span>منتخب ({pinnedCount})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewFilter("most_liked")}
                className={`px-3 py-1 rounded-full transition flex items-center gap-1 font-medium ${
                  viewFilter === "most_liked"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Flame className="w-3 h-3 text-rose-400" />
                <span>محبوب‌ترین‌ها</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Wish Input Form */}
        <AnimatePresence>
          {showQuickForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <form
                onSubmit={handleQuickSubmit}
                className="bg-stone-900/90 border border-amber-500/40 rounded-2xl p-5 sm:p-7 max-w-xl mx-auto space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold border-b border-stone-800 pb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>ثبت پیام تبریک جدید برای آیسان و مرتضی</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-amber-200 mb-1">
                      نام و نام خانوادگی شما <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="مثال: سارا و نوید"
                      className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-amber-200 mb-1">
                      نسبت با عروس و داماد
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-stone-100 outline-none cursor-pointer"
                    >
                      <option value="">انتخاب کنید (اختیاری)</option>
                      <option value="خانواده و بستگان عروس">خانواده و بستگان عروس</option>
                      <option value="خانواده و بستگان داماد">خانواده و بستگان داماد</option>
                      <option value="دوستان صمیمی عروس">دوستان صمیمی عروس</option>
                      <option value="دوستان صمیمی داماد">دوستان صمیمی داماد</option>
                      <option value="همکاران و آشنایان">همکاران و آشنایان</option>
                      <option value="سایر">سایر (نوشتن دستی...)</option>
                    </select>
                  </div>
                </div>

                {relationship === "سایر" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <label className="block text-xs text-amber-200 mb-1">
                      نسبت خود را بنویسید:
                    </label>
                    <input
                      type="text"
                      value={customRelation}
                      onChange={(e) => setCustomRelation(e.target.value)}
                      placeholder="مثال: دایی عروس / هم‌دانشگاهی داماد"
                      className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2 text-sm text-stone-100 placeholder-stone-500 outline-none"
                    />
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs text-amber-200 mb-1">
                    متن تبریک و آرزوی قلبی <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="پیام یا شعر زیبای شما برای عروس و داماد..."
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickForm(false)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md hover:from-amber-400 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>ارسال در دفترچه</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm text-center flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>پیام تبریک زیبای شما با موفقیت ثبت شد و در دفترچه قرار گرفت!</span>
          </motion.div>
        )}

        {/* Wishes List Cards */}
        {loading ? (
          <div className="py-16 text-center text-amber-400/70 text-sm flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>در حال بارگذاری پیام‌های پرمهر مهمانان...</span>
          </div>
        ) : sortedAndFilteredMessages.length === 0 ? (
          <div className="py-14 px-4 text-center rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Quote className="w-6 h-6" />
            </div>
            <p className="text-stone-300 text-sm font-medium mb-1">
              {viewFilter === "pinned" ? "هیچ تبریکی هنوز سنجاق (پین) نشده است." : "هنوز پیامی ثبت نشده است."}
            </p>
            <p className="text-stone-500 text-xs">
              اولین نفری باشید که برای آیسان و مرتضی پیام تبریک و شادباش ارسال می‌کند!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {sortedAndFilteredMessages.map((item, index) => {
              const currentLikes = item.likes || 0;
              const isLikedByMe = !!item.id && !!guestLikedMap[item.id];
              const isDeletingThis = deletingId === item.id;
              const isBusyThis = actionInProgressId === item.id;
              const isPinned = !!item.isPinned;
              const isHostFavorite = !!item.hostLiked;

              return (
                <motion.div
                  key={item.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className={`group relative rounded-2xl p-5 sm:p-6 shadow-lg transition-all duration-300 flex flex-col justify-between ${
                    isPinned
                      ? "bg-gradient-to-br from-[#2D2316] via-[#241D17] to-[#1C1814] border-2 border-amber-400 shadow-amber-500/10"
                      : "bg-gradient-to-br from-stone-900/90 via-[#241F1A] to-stone-900/90 border border-amber-500/25 hover:border-amber-400/50"
                  }`}
                >
                  {/* Pinned / Host Badge Header */}
                  {(isPinned || isHostFavorite) && (
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/20">
                      {isPinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500/25 to-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm">
                          <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>تبریک ویژه و سنجاق‌شده</span>
                        </span>
                      )}

                      {isHostFavorite && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40">
                          <Star className="w-3 h-3 text-rose-400 fill-rose-400" />
                          <span>منتخب عروس و داماد</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Top Author and Admin Controls */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center shadow-inner ${
                        isPinned 
                          ? "bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-950" 
                          : "bg-gradient-to-tr from-amber-500/30 to-amber-300/20 border border-amber-400/40 text-amber-300"
                      }`}>
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-amber-200 text-sm sm:text-base">
                            {item.name}
                          </h4>
                          {item.relationship && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 border border-amber-400/30 text-amber-300">
                              {item.relationship}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{item.formattedDate || "مهمان گرامی"}</span>
                        </div>
                      </div>
                    </div>

                    {!isAdmin && (
                      <Quote className="w-6 h-6 text-amber-400/30 group-hover:text-amber-400/60 transition" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="my-3 text-stone-200 text-sm leading-relaxed whitespace-pre-line font-normal italic">
                    «{item.message}»
                  </div>

                  {/* 🛡️ Dedicated Admin Action Toolbar on each card */}
                  {isAdmin && item.id && (
                    <div className="my-2.5 p-2.5 rounded-xl bg-stone-950/80 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Pin / Unpin Button */}
                        <button
                          type="button"
                          onClick={() => handleTogglePin(item.id!, isPinned)}
                          disabled={isBusyThis}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            isPinned
                              ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
                              : "bg-stone-800 text-amber-300 border border-amber-500/40 hover:bg-stone-700"
                          }`}
                          title={isPinned ? "برداشتن از سنجاق بالای صفحه" : "سنجاق و پین کردن به بالای صفحه"}
                        >
                          {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                          <span>{isPinned ? "برداشتن پین" : "سنجاق به بالا"}</span>
                        </button>

                        {/* Host Favorite Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleHostChoice(item.id!, isHostFavorite)}
                          disabled={isBusyThis}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                            isHostFavorite
                              ? "bg-rose-500/30 border border-rose-400 text-rose-200"
                              : "bg-stone-800 text-stone-300 hover:text-rose-300 border border-stone-700"
                          }`}
                          title="نشان پسند ویژه میزبان"
                        >
                          <Star className={`w-3.5 h-3.5 ${isHostFavorite ? "fill-rose-400 text-rose-400" : ""}`} />
                          <span>{isHostFavorite ? "منتخب میزبان" : "نشان منتخب"}</span>
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(item.id!, item.name)}
                        disabled={isDeletingThis}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/50 text-rose-300 hover:text-white transition cursor-pointer text-xs font-bold"
                        title="حذف دائمی پیام"
                      >
                        {isDeletingThis ? (
                          <div className="w-3 h-3 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>حذف</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Bottom Bar with Heart Like Button */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-amber-500/70 font-medium">
                      دفترچه یادبود پاگشایی
                    </span>

                    <button
                      type="button"
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition active:scale-95 cursor-pointer ${
                        isAdmin
                          ? "bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-amber-400/50 text-amber-200 hover:border-amber-300"
                          : isLikedByMe
                            ? "bg-rose-500/20 border-rose-500/60 text-rose-300"
                            : "bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-rose-400 border-stone-700/60 hover:border-rose-500/40"
                      }`}
                      title={
                        isAdmin 
                          ? "ثبت لایک توسط مدیریت (نامحدود و ذخیره آنی در سرور)"
                          : isLikedByMe 
                            ? "شما این پیام را پسندیده‌اید (کلیک مجدد برای لغو)" 
                            : "پسندیدن این پیام تبریک"
                      }
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform ${
                          isAdmin
                            ? "fill-amber-400 text-amber-400 scale-110"
                            : isLikedByMe || currentLikes > 0
                              ? "fill-rose-500 text-rose-500 scale-110"
                              : "text-stone-400 group-hover:text-rose-400"
                        }`}
                      />
                      <span className="text-[11px] font-mono font-bold">
                        {currentLikes > 0 ? currentLikes : (isAdmin ? "+ لایک مدیریت" : "محبت")}
                      </span>
                      {isAdmin && (
                        <span className="text-[9px] text-amber-400 font-bold bg-stone-900 px-1.5 py-0.2 rounded-full">
                          +1
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔐 Admin Password Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl border-2 border-amber-500/50 bg-[#1C1814] p-6 shadow-2xl text-right relative"
            >
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5 text-amber-400">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40">
                  <Shield className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-amber-200">ورود به پنل مدیریت دفترچه</h4>
                </div>
              </div>

              {adminError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1.5">
                    رمز عبور اختصاصی:
                  </label>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="رمز عبور را وارد کنید..."
                    className="w-full rounded-xl border border-amber-500/40 bg-stone-900 px-4 py-2.5 text-center text-sm font-mono tracking-widest text-amber-100 placeholder:text-stone-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 py-2.5 text-xs font-bold text-stone-950 shadow-md transition cursor-pointer"
                  >
                    تأیید و ورود
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-700 text-xs font-semibold text-stone-300 hover:bg-stone-800 transition cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
