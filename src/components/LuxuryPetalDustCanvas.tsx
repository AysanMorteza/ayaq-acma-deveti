import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  flipAngle: number;
  flipSpeed: number;
  opacity: number;
  petalType: number; // slight variation in petal curves
  swayAmplitude: number;
  swayFrequency: number;
  swayOffset: number;
}

interface GoldDust {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  twinklePhase: number;
  twinkleSpeed: number;
  maxOpacity: number;
  hue: number;
  hasSparks: boolean;
}

export const LuxuryPetalDustCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: -100, y: -100, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse / Touch wind interaction
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
      }
    };
    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Responsive particle count
    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 18 : 34;
    const dustCount = isMobile ? 40 : 75;

    // Initialize Petals (White & Pale Champagne Rose Petals)
    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.2,
        size: Math.random() * 8 + (isMobile ? 9 : 12),
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: Math.random() * 0.7 + 0.5, // gentle falling drift
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        tiltAngle: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.02 + 0.008,
        flipAngle: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.015 + 0.006,
        opacity: Math.random() * 0.35 + 0.55,
        petalType: Math.floor(Math.random() * 3),
        swayAmplitude: Math.random() * 1.5 + 0.8,
        swayFrequency: Math.random() * 0.015 + 0.008,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    // Initialize Shimmering Gold Stardust
    const dusts: GoldDust[] = [];
    for (let i = 0; i < dustCount; i++) {
      dusts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.35 - 0.08, // floating slowly upwards like sparkling dust
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        maxOpacity: Math.random() * 0.5 + 0.35,
        hue: Math.random() > 0.4 ? 43 : 48,
        hasSparks: Math.random() > 0.65 // occasional 4-pointed sparkle
      });
    }

    let time = 0;

    // Helper: Draw 3D realistic rose petal
    const drawPetal = (p: Petal) => {
      ctx.save();

      // Calculate 3D transformation projections
      const tilt = Math.sin(p.tiltAngle);
      const flip = Math.cos(p.flipAngle);
      
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(1, Math.abs(tilt) * 0.8 + 0.2); // 3D pitch
      ctx.scale(Math.abs(flip) * 0.85 + 0.15, 1); // 3D roll

      const w = p.size;
      const h = p.size * 1.35;

      // Soft petal cast drop shadow
      ctx.shadowColor = 'rgba(180, 150, 100, 0.12)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      // Petal organic outline
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      // Top heart-shaped curve of petal
      ctx.bezierCurveTo(w * 0.65, -h * 0.55, w * 0.85, 0, 0, h * 0.5);
      ctx.bezierCurveTo(-w * 0.85, 0, -w * 0.65, -h * 0.55, 0, -h * 0.5);
      ctx.closePath();

      // Deluxe ivory-cream gradient with subtle golden blush vein
      const grad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
      grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
      grad.addColorStop(0.35, `rgba(254, 250, 242, ${p.opacity * 0.95})`);
      grad.addColorStop(0.7, `rgba(247, 238, 222, ${p.opacity * 0.9})`);
      grad.addColorStop(1, `rgba(238, 220, 192, ${p.opacity * 0.85})`);

      ctx.fillStyle = grad;
      ctx.fill();

      // Delicate silk petal contour line
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = `rgba(212, 175, 55, ${p.opacity * 0.25})`;
      ctx.stroke();

      // Center translucent spine/vein
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.35);
      ctx.quadraticCurveTo(w * 0.08, 0, 0, h * 0.35);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(212, 175, 55, ${p.opacity * 0.2})`;
      ctx.stroke();

      ctx.restore();
    };

    // Helper: Draw sparkling gold star/bokeh dust
    const drawDust = (d: GoldDust) => {
      const currentOpacity = Math.max(0.05, Math.min(1, (Math.sin(d.twinklePhase) * 0.5 + 0.5) * d.maxOpacity));

      ctx.save();
      ctx.translate(d.x, d.y);

      // Radial Gold Aura
      const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, d.size * 3.2);
      radGrad.addColorStop(0, `hsla(${d.hue}, 95%, 65%, ${currentOpacity})`);
      radGrad.addColorStop(0.4, `hsla(${d.hue}, 90%, 55%, ${currentOpacity * 0.45})`);
      radGrad.addColorStop(1, `hsla(${d.hue}, 85%, 50%, 0)`);

      ctx.beginPath();
      ctx.arc(0, 0, d.size * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = radGrad;
      ctx.fill();

      // Solid Shimmering Core
      ctx.beginPath();
      ctx.arc(0, 0, d.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 248, 220, ${currentOpacity * 0.95})`;
      ctx.fill();

      // Occasional 4-Point Twinkle Star
      if (d.hasSparks && currentOpacity > 0.4) {
        const spikeLen = d.size * 3.5 * (currentOpacity / d.maxOpacity);
        ctx.beginPath();
        ctx.moveTo(-spikeLen, 0);
        ctx.lineTo(spikeLen, 0);
        ctx.moveTo(0, -spikeLen);
        ctx.lineTo(0, spikeLen);
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = `rgba(255, 235, 170, ${currentOpacity * 0.8})`;
        ctx.stroke();
      }

      ctx.restore();
    };

    // Main 60FPS Render Loop
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Update & Draw Gold Stardust
      for (let i = 0; i < dusts.length; i++) {
        const d = dusts[i];
        d.x += d.speedX + Math.sin(time * 0.01 + i) * 0.2;
        d.y += d.speedY;
        d.twinklePhase += d.twinkleSpeed;

        // Wrap around boundaries
        if (d.y < -15) d.y = height + 15;
        if (d.x < -15) d.x = width + 15;
        if (d.x > width + 15) d.x = -15;

        drawDust(d);
      }

      // 2. Update & Draw Floating Rose Petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Harmonic lateral swaying with natural wind gusts
        const windSway = Math.sin(time * p.swayFrequency + p.swayOffset) * p.swayAmplitude;
        p.x += p.speedX + windSway * 0.65;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.tiltAngle += p.tiltSpeed;
        p.flipAngle += p.flipSpeed;

        // Interactive mouse wind repulsion
        if (mousePos.current.active) {
          const dx = p.x - mousePos.current.x;
          const dy = p.y - mousePos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (1 - dist / 140) * 2.2;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            p.rotationSpeed += 0.01;
          }
        }

        // Wrap around when falling past bottom screen
        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
          p.tiltAngle = Math.random() * Math.PI;
          p.flipAngle = Math.random() * Math.PI;
        }
        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled]);

  return (
    <>
      {/* Background Canvas for Petals & Gold Dust */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-700"
          aria-hidden="true"
        />
      )}

      {/* Floating Petal Effect Toggle Pill */}
      <button
        onClick={() => setIsEnabled((prev) => !prev)}
        title={isEnabled ? 'توقف بارش گلبرگ‌ها' : 'فعال‌سازی بارش گلبرگ‌ها'}
        className="fixed bottom-20 left-4 z-40 flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FFFDF8]/90 px-3 py-1.5 text-xs font-semibold text-[#8A6412] shadow-[0_4px_16px_rgba(212,175,55,0.2)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37] hover:bg-white active:scale-95 sm:bottom-6 sm:left-6"
      >
        <Sparkles className={`h-3.5 w-3.5 text-[#D4AF37] ${isEnabled ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        <span className="hidden sm:inline font-persian">
          {isEnabled ? 'بارش گلبرگ: فعال' : 'بارش گلبرگ: خاموش'}
        </span>
      </button>
    </>
  );
};
