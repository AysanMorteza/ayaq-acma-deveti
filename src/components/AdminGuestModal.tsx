import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  getDocs 
} from "firebase/firestore";
import { db } from "../firebase";
import { RsvpSubmission } from "../types";
import { 
  X, 
  Lock, 
  Users, 
  UserCheck, 
  UserX, 
  Download, 
  Trash2, 
  Search, 
  Sparkles,
  Phone,
  MessageSquareHeart,
  KeyRound,
  ShieldAlert,
  Calendar
} from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGuestModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState("");
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "attending" | "declined">("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Exclusive secure secret password set by the host
  const SECRET_ADMIN_PASS = "Araz_King1383";

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const parseDocs = (docs: any[]): RsvpSubmission[] => {
      return docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<RsvpSubmission, "id">),
        }))
        .sort((a, b) => {
          const timeA = typeof a.createdAt === "number" ? a.createdAt : 0;
          const timeB = typeof b.createdAt === "number" ? b.createdAt : 0;
          return timeB - timeA;
        });
    };

    // Immediate fetch
    getDocs(collection(db, "rsvps"))
      .then((snapshot) => {
        if (!isMounted) return;
        setSubmissions(parseDocs(snapshot.docs));
      })
      .catch((err) => console.warn("Admin getDocs warning:", err));

    // Listen in real-time
    let unsubscribe: () => void = () => {};
    try {
      const q = query(collection(db, "rsvps"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!isMounted) return;
          setSubmissions(parseDocs(snapshot.docs));
        },
        (error) => {
          console.warn("Admin onSnapshot error, falling back:", error);
          try {
            unsubscribe = onSnapshot(collection(db, "rsvps"), (snap) => {
              if (!isMounted) return;
              setSubmissions(parseDocs(snap.docs));
            });
          } catch (e) {
            console.error("Admin listener failure:", e);
          }
        }
      );
    } catch (err) {
      try {
        unsubscribe = onSnapshot(collection(db, "rsvps"), (snap) => {
          if (!isMounted) return;
          setSubmissions(parseDocs(snap.docs));
        });
      } catch (e) {
        console.error("Admin listener catch failure:", e);
      }
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === SECRET_ADMIN_PASS) {
      setIsAuthenticated(true);
      setPassError("");
    } else {
      setPassError("رمز عبور وارد شده صحیح نمی‌باشد.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`آیا از حذف رکورد مهمان «${name}» اطمینان دارید؟`)) {
      return;
    }
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, "rsvps", id));
    } catch {
      alert("خطا در حذف رکورد.");
    } finally {
      setIsDeleting(null);
    }
  };

  const exportToCsv = () => {
    if (submissions.length === 0) return;

    const headers = ["نام و نام خانوادگی", "وضعیت حضور", "تعداد نفرات", "شماره تماس", "ملاحظات پذیرایی", "متن پیام تبریک", "تاریخ ثبت"];
    
    const rows = submissions.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      s.attendance === "attending" ? "حضور دارند" : "عذرخواهی / عدم حضور",
      s.attendance === "attending" ? s.guestsCount : 0,
      `"${s.phoneNumber || "-"}"`,
      `"${(s.dietaryOrNote || "-").replace(/"/g, '""')}"`,
      `"${(s.message || "-").replace(/"/g, '""')}"`,
      `"${s.formattedDate || new Date(s.createdAt).toLocaleString("fa-IR")}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `لیست_مهمانان_پاگشایی_آیسان_مرتضی_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const totalAttendingGuests = submissions
    .filter((s) => s.attendance === "attending")
    .reduce((sum, s) => sum + (s.guestsCount || 1), 0);

  const totalAttendingResponses = submissions.filter((s) => s.attendance === "attending").length;
  const totalDeclinedResponses = submissions.filter((s) => s.attendance === "declined").length;

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.phoneNumber && s.phoneNumber.includes(searchTerm)) ||
      (s.message && s.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === "attending") return matchesSearch && s.attendance === "attending";
    if (filterType === "declined") return matchesSearch && s.attendance === "declined";
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>پنل مدیریت اختصاصی میزبانان</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            مدیریت مهمانان و آمار اعلام حضور
          </h2>
        </div>

        {!isAuthenticated ? (
          /* Login Form */
          <div className="my-auto py-8 max-w-sm mx-auto text-center w-full">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-100 mb-1">ورود به بخش مدیریت</h3>
            <p className="text-xs text-stone-400 mb-6">
              جهت مشاهده و مدیریت آمار مهمانان، رمز عبور اختصاصی را وارد فرمایید
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="رمز عبور..."
                autoFocus
                className="w-full text-center tracking-widest text-lg bg-stone-800 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-stone-100 outline-none transition"
              />

              {passError && (
                <div className="text-rose-400 text-xs flex items-center justify-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{passError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold text-sm shadow-lg hover:from-amber-400 hover:to-amber-300 transition"
              >
                تایید و ورود
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-stone-800/80 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">{totalAttendingGuests}</div>
                  <div className="text-xs text-stone-400">کل مهمانان حاضر (نفرات)</div>
                </div>
              </div>

              <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-300">{totalAttendingResponses}</div>
                  <div className="text-xs text-stone-400">فرم‌های تایید حضور</div>
                </div>
              </div>

              <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <UserX className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-rose-300">{totalDeclinedResponses}</div>
                  <div className="text-xs text-stone-400">عذرخواهی / عدم حضور</div>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="جستجو بر اساس نام یا شماره..."
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-stone-100 outline-none"
                  />
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                </div>

                {/* Filter buttons */}
                <div className="flex items-center bg-stone-800 rounded-xl p-1 border border-stone-700 text-xs">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      filterType === "all" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    همه ({submissions.length})
                  </button>
                  <button
                    onClick={() => setFilterType("attending")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      filterType === "attending" ? "bg-emerald-500 text-stone-950 font-bold" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    حاضرین ({totalAttendingResponses})
                  </button>
                  <button
                    onClick={() => setFilterType("declined")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      filterType === "declined" ? "bg-rose-500 text-stone-950 font-bold" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    عدم حضور ({totalDeclinedResponses})
                  </button>
                </div>
              </div>

              {/* Export to Excel */}
              <button
                onClick={exportToCsv}
                disabled={submissions.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs sm:text-sm font-bold transition shadow-md disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                <span>دانلود خروجی اکسل (CSV)</span>
              </button>
            </div>

            {/* Submissions List Table */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {filteredSubmissions.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-sm">
                  {submissions.length === 0
                    ? "هنوز هیچ پاسخی از سوی مهمانان ثبت نگردیده است."
                    : "موردی با مشخصات جستجو شده یافت نشد."}
                </div>
              ) : (
                filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-stone-800/60 hover:bg-stone-800 border border-stone-700/70 hover:border-amber-500/30 rounded-2xl p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-amber-200 text-base">{sub.name}</span>
                        
                        {sub.attendance === "attending" ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            {sub.guestsCount} نفر همراه
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-1">
                            <UserX className="w-3 h-3" />
                            عدم حضور
                          </span>
                        )}

                        {sub.phoneNumber && (
                          <span className="text-xs text-stone-400 flex items-center gap-1 font-mono" dir="ltr">
                            <Phone className="w-3 h-3 text-stone-500" />
                            {sub.phoneNumber}
                          </span>
                        )}
                      </div>

                      {sub.dietaryOrNote && (
                        <div className="text-xs text-amber-300/90 bg-amber-500/10 px-2 py-1 rounded-lg inline-block">
                          ملاحظات: {sub.dietaryOrNote}
                        </div>
                      )}

                      {sub.message && (
                        <div className="text-xs text-stone-300 italic flex items-start gap-1 pt-1">
                          <MessageSquareHeart className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                          <span>«{sub.message}»</span>
                        </div>
                      )}

                      <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-1">
                        <Calendar className="w-3 h-3" />
                        <span>ثبت شده در: {sub.formattedDate || new Date(sub.createdAt).toLocaleString("fa-IR")}</span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => sub.id && handleDelete(sub.id, sub.name)}
                      disabled={isDeleting === sub.id}
                      className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 transition shrink-0"
                      title="حذف رکورد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
