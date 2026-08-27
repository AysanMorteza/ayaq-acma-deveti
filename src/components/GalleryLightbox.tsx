import React, { useState, useEffect, useCallback } from 'react';
import { Camera, X, ChevronRight, ChevronLeft, Maximize2, Sparkles } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/invitationData';
import { GalleryPhoto } from '../types';

export const GalleryLightbox: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const nextPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => ((prev! + 1) % GALLERY_PHOTOS.length));
    }
  }, [selectedPhotoIndex]);

  const prevPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => ((prev! - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length));
    }
  }, [selectedPhotoIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') nextPhoto();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, closeLightbox, nextPhoto, prevPhoto]);

  const activePhoto: GalleryPhoto | null = selectedPhotoIndex !== null ? GALLERY_PHOTOS[selectedPhotoIndex] : null;

  return (
    <section id="gallery-section" className="relative my-14 w-full px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FFFDF9] px-4 py-1 text-xs text-[#8A6412] shadow-sm">
            <Camera className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>آلبوم یادگاری و لحظات رویایی</span>
            <Camera className="h-3.5 w-3.5 text-[#B8860B]" />
          </div>
          <h2 className="mt-3 font-calligraphy text-2xl sm:text-3xl font-bold tracking-tight text-[#2E2415]">
            گالری تصاویر و شکوه مراسم
          </h2>
          <p className="mt-1 text-sm text-[#6E5936] font-medium">
            برای مشاهده با کیفیت بالا در حالت تمام‌صفحه روی هر تصویر کلیک نمایید
          </p>
          <div className="mx-auto mt-2 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY_PHOTOS.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-[#D4AF37]/40 bg-[#FFFFFF] shadow-[0_4px_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)]"
            >
              {/* Image Container with aspect ratio */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#FAF6EE]">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2112]/90 via-[#2B2112]/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Quick Zoom Icon */}
              <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FFFDF8]/90 text-[#8A6412] opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-md">
                <Maximize2 className="h-4 w-4" />
              </div>

              {/* Caption Content */}
              <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                <h3 className="font-serif text-sm font-bold text-[#FFF3B3] group-hover:text-[#FFFFFF]">
                  {photo.title}
                </h3>
                <p className="mt-0.5 text-xs text-[#EBD9A7] line-clamp-1">
                  {photo.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhotoIndex !== null && activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="مشاهده تصویر در سایز بزرگ"
        >
          {/* Modal Container */}
          <div
            className="relative flex flex-col items-center max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex w-full items-center justify-between pb-3 text-[#FFF3B3]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FFE27A]" />
                <span className="text-sm font-bold">
                  تصویر {selectedPhotoIndex + 1} از {GALLERY_PHOTOS.length}
                </span>
              </div>

              <button
                onClick={closeLightbox}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37] bg-[#3D3019]/90 text-[#FFF3B3] hover:bg-[#8A6412] transition-colors cursor-pointer"
                aria-label="بستن گالری"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Image with Gold Frame */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.4)] bg-[#1A140B] w-full max-h-[70vh] flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.alt}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37] bg-[#3D3019]/80 text-[#FFF3B3] hover:bg-[#8A6412] transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
                aria-label="تصویر قبلی"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37] bg-[#3D3019]/80 text-[#FFF3B3] hover:bg-[#8A6412] transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
                aria-label="تصویر بعدی"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Image Details Caption */}
            <div className="mt-4 w-full rounded-2xl border border-[#D4AF37]/60 bg-[#FFFDF9] p-4 text-center shadow-lg">
              <h4 className="font-serif text-base font-bold text-[#352814]">
                {activePhoto.title}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-[#6B5733] font-medium">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
