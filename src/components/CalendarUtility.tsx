import React, { useState } from 'react';
import { CalendarPlus, Calendar, Download, Check } from 'lucide-react';
import { INVITATION_DETAILS } from '../data/invitationData';

export const CalendarUtility: React.FC = () => {
  const [downloaded, setDownloaded] = useState<boolean>(false);

  // Event times in UTC ISO for calendar links (2026-08-30 20:00 Tabriz time is UTC+3:30 -> 16:30 UTC)
  const startUtc = "20260830T163000Z";
  const endUtc = "20260830T203000Z";
  const title = encodeURIComponent(`مراسم پاگشایی ${INVITATION_DETAILS.bride} و ${INVITATION_DETAILS.groom}`);
  const details = encodeURIComponent(`مراسم رسمی پاگشایی ${INVITATION_DETAILS.bride} و ${INVITATION_DETAILS.groom}\nتاریخ: ${INVITATION_DETAILS.eventDatePersian}\nساعت: ${INVITATION_DETAILS.eventTime}\nمکان: ${INVITATION_DETAILS.venue.address}\nلینک مسیریابی: ${INVITATION_DETAILS.venue.googleMapsLink}`);
  const location = encodeURIComponent(INVITATION_DETAILS.venue.address);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;

  // Download .ics file for Apple Calendar / Outlook / Default system calendar
  const downloadIcsFile = () => {
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pagosha Invitation//Aysan and Morteza//FA
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:pagosha-aysan-morteza-20260830@invitation
DTSTAMP:20260823T000000Z
DTSTART:${startUtc}
DTEND:${endUtc}
SUMMARY:مراسم پاگشایی ${INVITATION_DETAILS.bride} و ${INVITATION_DETAILS.groom}
DESCRIPTION:مراسم رسمی شام و ضیافت پاگشایی ${INVITATION_DETAILS.bride} و ${INVITATION_DETAILS.groom} - ${INVITATION_DETAILS.eventDatePersian} - ${INVITATION_DETAILS.venue.address}
LOCATION:${INVITATION_DETAILS.venue.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pagosha-aysan-morteza.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section id="calendar-section" className="relative my-10 w-full px-4 sm:px-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border-2 border-[#D4AF37]/50 bg-gradient-to-r from-[#FFFFFF] via-[#FDFBF7] to-[#FAF4E6] p-6 sm:p-8 text-center shadow-[0_10px_30px_rgba(212,175,55,0.14)] relative">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#D4AF37] bg-[#FAF5EA] text-[#8A6412] shadow-sm">
          <CalendarPlus className="h-6 w-6 text-[#B8860B]" />
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2E2415]">
          افزودن به تقویم شخصی (یادآوری یکشنبه ۸ شهریور)
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-[#6E5936] font-medium">
          با ۱ کلیک تاریخ مراسم پاگشایی آیسان و مرتضی را به تقویم گوگل، آیفون یا کامپیوتر خود اضافه نمایید
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Google Calendar */}
          <a
            id="google-calendar-add-btn"
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-400/50 bg-[#FFFFFF] px-5 py-3 text-xs sm:text-sm font-bold text-blue-700 hover:bg-blue-50 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>افزودن به تقویم گوگل (Google Calendar)</span>
          </a>

          {/* Apple Calendar / ICS */}
          <button
            id="apple-calendar-ics-btn"
            onClick={downloadIcsFile}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#D4AF37] bg-[#FFFDF9] px-5 py-3 text-xs sm:text-sm font-bold text-[#8A6412] hover:bg-[#FAF4E6] shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">فایل تقویم ذخیره شد!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-[#B8860B]" />
                <span>دانلود تقویم اپل و اوت‌لوک (.ICS)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
