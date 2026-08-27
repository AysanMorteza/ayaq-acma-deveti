import { MenuItem, TimelineItem, GalleryPhoto } from '../types';
import childhoodImg from '../assets/images/childhood_real.jpg';
import weddingImg from '../assets/images/wedding_real.jpg';

export const INVITATION_DETAILS = {
  title: "دعوتنامه مراسم پاگشایی",
  subtitle: "پیوند عشق و شادباش نوپیوندان",
  groom: "مرتضی",
  bride: "آیسان",
  eventDatePersian: "یکشنبه ۸ شهریور ۱۴۰۵",
  eventDateSolar: "1405/06/08",
  eventDayOfWeek: "یکشنبه",
  eventTime: "ساعت ۲۰:۰۰",
  // Target date for countdown (formatted ISO) - 1405/06/08 corresponds to August 30, 2026 20:00 Tabriz time (+03:30)
  targetDateISO: "2026-08-30T20:00:00+03:30",
  venue: {
    name: "تالار شالیز",
    fullName: "تالار و رستوران پذیرایی شالیز",
    neighborhood: "بلوار آزادی",
    address: "تبریز، بلوار آزادی، بین ابوذر و نظمیه، پلاک ۴۸",
    lat: 38.0645,
    lng: 46.2995,
    googleMapsLink: "https://maps.app.goo.gl/Z5wKGmcvLY3PSAEJA?g_st=ac",
    neshanLink: "https://nshn.ir/98rbA9kUYCVaRY",
    baladLink: "https://balad.ir/p/6SI1XcVgYRNx7s",
    parking: "دارای پارکینگ اختصاصی و امن تالار برای مهمانان گرامی",
    dressCode: "رسمی و مجلسی (Formal & Evening Attire)"
  },
  weather: {
    city: "تبریز (تالار شالیز - بلوار آزادی)",
    temperature: "۲۳°C",
    condition: "هوای صاف، خنک و دلپذیر شبانگاهی",
    nightForecast: "نسیم آرام شبانه، دمای مطبوع ۱۹ درجه سانتی‌گراد",
    icon: "MoonStar"
  },
  audio: {
    src: "/audio/track1_uzun_darah.mp3",
    title: "اوزون دره",
    artist: ""
  }
};

export const OUR_STORY_DATA = {
  title: "داستان ما",
  subtitle: "از خنده‌های معصومانهٔ دیروز تا سوگند عشق ابدی امروز",
  quote: "« سال‌ها گذشت و سرنوشت، زیباترین نقشش را برای پیوند دل‌هایمان رقم زد »",
  description: "قصه‌ای که از روزگار شیرین و بی‌پروای کودکی آغاز شد، با گذشت سال‌ها ریشه دواند و امروز در شکوه وصال، دست در دست هم آغازی نو را جشن می‌گیریم.",
  timeline: [
    {
      id: "childhood",
      era: "دوران کودکی",
      title: "روزهای شیرین کودکی",
      dateLabel: "خاطرات به یادماندنی",
      description: "نگاه‌های معصومانه، خنده‌های بی‌ریا کنار شمع‌های کیک تولد؛ جایی که بذر خاطرات مشترکمان در خاک مهر کاشته شد.",
      image: childhoodImg,
      badge: "🌱 آغاز همراهی",
      tag: "خاطره کودکی"
    },
    {
      id: "wedding",
      era: "پیوند و وصال",
      title: "پیوند دل‌ها",
      dateLabel: "هم‌عهدی و همراهی",
      description: "دست در دست هم با قلبی سرشار از امید و عشق، با جامهٔ سپید و فاخر وصال، در آستانهٔ ساختن روشن‌ترین فردای مشترکمان.",
      image: weddingImg,
      badge: "💍 وصال و هم‌عهدی",
      tag: "آغاز زندگی مشترک"
    }
  ]
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "g1",
    title: "حلقه مهر و پیمان ابدی",
    subtitle: "یادگار روز عقد و پیوند دل‌ها",
    url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
    alt: "حلقه‌های نامزدی و گل‌آرایی",
    caption: "آغاز سفری سرشار از عشق، با پیمانی استوار و جاودانه"
  },
  {
    id: "g2",
    title: "شکوه گل‌آرایی شب وصال",
    subtitle: "هارمونی رزهای سفید و ارکیده",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    alt: "دکوراسیون و گل‌آرایی رویایی",
    caption: "طراحی فضایی مجلل و به یادماندنی برای پذیرایی از سروران گرامی"
  },
  {
    id: "g3",
    title: "ضیافت شاهانه و نورپردازی لوکس",
    subtitle: "میزبانی در شأن مهمانان عزیز",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    alt: "چیدمان سالن و میزهای تشریفاتی",
    caption: "پذیرایی اصیل و لحظاتی سرشار از سرور و صمیمیت خانوادگی"
  },
  {
    id: "g4",
    title: "عطر خوش شیرینی و باقلوا",
    subtitle: "شیرینی‌کام مهمانان ارجمند",
    url: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1200&auto=format&fit=crop",
    alt: "کیک و دسرهای تشریفاتی",
    caption: "طعم خوشبخت‌ترین لحظه‌ها در کنار عزیزترین‌ها"
  }
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "step-1",
    time: "۲۰:۰۰",
    title: "ورود مهمانان و استقبال شاهانه",
    description: "خوش‌آمدگویی گرم به سروران ارجمند در محل مراسم (تبریز، بلوار آزادی) با شربت‌های سنتی زعفرانی، بهارنارنج و گلاب ناب",
    iconName: "Sparkles",
    highlight: false
  },
  {
    id: "step-2",
    time: "۲۱:۰۰",
    title: "سرو پیش‌غذا و رولت سبزی تبریزی",
    description: "پذیرایی با سوپ مخصوص داغ، رولت سبزی معطر خانگی و سالاد فصل مخصوص همراه نوای دلنشین موسیقی اصیل",
    iconName: "Soup",
    highlight: false
  },
  {
    id: "step-3",
    time: "۲۱:۳۰",
    title: "سرو شام شاهانه پاگشایی",
    description: "چلوکوبیده اعلا زعفرانی تبریز، طبخ شده با گوشت تازه گوسفندی، کره محلی و برنج درجه یک طارم معطر",
    iconName: "UtensilsCrossed",
    highlight: true
  },
  {
    id: "step-4",
    time: "۲۲:۴۵",
    title: "چای دبش، دسر باقلوا و یادبود",
    description: "سرو چای تازه‌دم لاهیجان در استکان‌های شاه‌عباسی، باقلوای گردویی تبریز و ثبت عکس‌های یادگاری با آیسان و مرتضی",
    iconName: "HeartHandshake",
    highlight: false
  }
];

export const MENU_DETAILS: MenuItem[] = [
  {
    category: "appetizers",
    persianCategory: "پیش‌غذاهای اصیل",
    icon: "Utensils",
    description: "آغازین طعم‌های گرم و خوش‌عطر آذربایجان",
    items: [
      {
        title: "سوپ مخصوص تبریزی (داغ و غلیظ)",
        description: "تهیه شده از عصاره مرغ طبیعی، سبزیجات تازه، جو پرک و هویج رنده‌شده با لیموی تازه",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
        badge: "سرو داغ و سنتی"
      },
      {
        title: "رولت سبزی معطر خانگی با گردو و زرشک",
        description: "رول سبزیجات ارگانیک محلی همراه با مغز گردوی تازه و زرشک پفکی اعلا",
        image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=800&auto=format&fit=crop",
        badge: "پیش‌غذای اختصاصی"
      },
      {
        title: "سالاد ویژه و ماست و بورانی سنتی",
        description: "کاهو پیچ تازه، سس دست‌ساز، پنیر پارمسان و ماست چکیده محلی با نعناع کوهی",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
        badge: "تازه و اشتهاآور"
      }
    ]
  },
  {
    category: "main",
    persianCategory: "غذای اصلی تشریفاتی",
    icon: "Crown",
    description: "شاهکار دستپخت سرآشپز با طعم اصیل ایرانی",
    items: [
      {
        title: "چلوکوبیده مخصوص زعفرانی (دو سیخ اعلا)",
        description: "کوبیده سنتی تبریزی تهیه شده از راسته و قلوه‌گاه تازه گوسفندی، پلو زعفرانی با برنج هاشمی و کره محلی سراب",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
        badge: "غذای اصلی ضیافت"
      },
      {
        title: "گوجه کبابی، فلفل تنوری و سماق ناب هریس",
        description: "همراهی سنتی کباب ایرانی با لیمو ترش تازه و ترشیجات اعلای خانگی تبریز",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=800&auto=format&fit=crop",
        badge: "مخلفات اعلا"
      }
    ]
  },
  {
    category: "beverages",
    persianCategory: "نوشیدنی‌ها و دسر",
    icon: "Sparkles",
    description: "شیرین‌کام و خنکای پایان ضیافت",
    items: [
      {
        title: "دوغ محلی نعناعی و نوشیدنی‌های خنک",
        description: "دوغ سنتی پونه‌زده آذربایجان و آبمیوه‌های طبیعی خنک",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
        badge: "سرو در گیلاس کریستال"
      },
      {
        title: "باقلوای گردویی اعلا و چای زعفرانی لاهیجان",
        description: "باقلوای سنتی پرمغز و پسته به همراه چای تازه‌دم در استکان‌های نقره‌فام",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
        badge: "دسر تشریفاتی"
      }
    ]
  }
];
