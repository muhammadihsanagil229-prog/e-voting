import {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  Lock,
  ShieldCheck,
  Users,
  Vote,
} from 'lucide-react';
import {motion} from 'motion/react';
import type {DashboardId} from '../types/election';
import {
  type OrbitalStateRef,
  WhiteLiquidOrbital3D,
} from './WhiteLiquidOrbital3D';

interface OpeningScreenProps {
  onEnterPortal: (target?: DashboardId) => void;
}

const HEADLINE_WORDS = ['Suara', 'Anda,', 'Masa', 'Depan', 'OSIS', 'Kita'];

const CIRCUIT_TRACES = [
  {
    id: 'tl',
    d: 'M 120 44 L 250 44 L 302 98 L 415 98',
    delay: 0.4,
    duration: 2.5,
  },
  {
    id: 'ml',
    d: 'M 68 128 L 415 128',
    delay: 0.85,
    duration: 2.2,
  },
  {
    id: 'bl',
    d: 'M 132 212 L 260 212 L 316 154 L 415 154',
    delay: 1.25,
    duration: 2.6,
  },
  {
    id: 'tr',
    d: 'M 800 44 L 670 44 L 618 98 L 505 98',
    delay: 0.55,
    duration: 2.4,
  },
  {
    id: 'mr',
    d: 'M 852 128 L 505 128',
    delay: 1.05,
    duration: 2.1,
  },
  {
    id: 'br',
    d: 'M 788 212 L 660 212 L 604 154 L 505 154',
    delay: 0.25,
    duration: 2.7,
  },
  {
    id: 'b-center',
    d: 'M 460 258 L 460 170',
    delay: 0.7,
    duration: 1.9,
  },
];

const LEFT_NODES = [
  {
    id: 'kandidat' as DashboardId,
    label: '4 Paslon',
    icon: Users,
    posClass: 'left-[8%] top-[6%]',
  },
  {
    id: 'visi-misi' as DashboardId,
    label: 'Visi & Misi',
    icon: BookOpen,
    posClass: 'left-[2%] top-[39%]',
  },
  {
    id: 'bilik-suara' as DashboardId,
    label: 'Enkripsi',
    icon: Lock,
    posClass: 'left-[9%] top-[71%]',
  },
];

const RIGHT_NODES = [
  {
    id: 'bilik-suara' as DashboardId,
    label: 'Bilik Suara',
    icon: Vote,
    posClass: 'right-[8%] top-[6%]',
  },
  {
    id: 'quick-count' as DashboardId,
    label: 'Quick Count',
    icon: BarChart3,
    posClass: 'right-[2%] top-[39%]',
  },
  {
    id: 'kelola-paslon' as DashboardId,
    label: 'Panitia',
    icon: ShieldCheck,
    posClass: 'right-[9%] top-[71%]',
  },
];

export function OpeningScreen({onEnterPortal}: OpeningScreenProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const orbitalStateRef = useRef<OrbitalStateRef>({
    progress: 0,
    swirlSpeed: 0.65,
    scale: 0.03,
    rippleProgress: 0,
    opacity: 0,
  });

  const [prefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [introFinished, setIntroFinished] = useState<boolean>(
    prefersReducedMotion
  );
  const [pulsesActive, setPulsesActive] = useState<boolean>(
    prefersReducedMotion
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion) {
      orbitalStateRef.current.opacity = 0;
      setIntroFinished(true);
      setPulsesActive(true);
      return;
    }

    const ctx = gsap.context(() => {
      const orbState = orbitalStateRef.current;
      orbState.scale = 0.03;
      orbState.swirlSpeed = 0.65;
      orbState.rippleProgress = 0;
      orbState.opacity = 0;

      // Initialize SVG line lengths for stroke drawing
      const svgLines = gsap.utils.toArray<SVGPathElement>('.intro-svg-line');
      svgLines.forEach((path) => {
        const len =
          typeof path.getTotalLength === 'function'
            ? path.getTotalLength()
            : 400;
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 0,
        });
      });

      const tl = gsap.timeline({
        defaults: {ease: 'power3.out'},
      });
      timelineRef.current = tl;

      // PHASE 1 — Initial Appearance (0.0s -> 0.85s)
      tl.fromTo(
        '.intro-point-light',
        {scale: 0.1, opacity: 0},
        {scale: 1.25, opacity: 1, duration: 0.45, ease: 'power2.out'},
        0
      )
        .to(
          orbState,
          {
            scale: 0.92,
            opacity: 1,
            swirlSpeed: 0.85,
            duration: 0.75,
            ease: 'power3.out',
          },
          0.12
        )
        .to(
          '.intro-point-light',
          {opacity: 0.25, scale: 2.2, duration: 0.6, ease: 'power2.out'},
          0.45
        );

      // PHASE 2 — White Water Orbital (0.85s -> 2.35s)
      tl.to(
        orbState,
        {
          swirlSpeed: 2.45,
          scale: 1.06,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        0.85
      ).to(
        '.intro-orbital-caption',
        {opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'},
        0.95
      );

      // PHASE 3 — Energy Expansion (2.35s -> 3.15s)
      tl.to(
        '.intro-orbital-caption',
        {opacity: 0, y: -6, duration: 0.28, ease: 'power2.in'},
        2.3
      )
        .to(
          orbState,
          {
            scale: 1.95,
            swirlSpeed: 3.1,
            rippleProgress: 1,
            opacity: 0,
            duration: 0.82,
            ease: 'power2.inOut',
          },
          2.35
        )
        .fromTo(
          '.intro-css-ripple',
          {scale: 0.4, opacity: 0.75},
          {scale: 3.4, opacity: 0, duration: 0.85, ease: 'power2.out'},
          2.4
        )
        .fromTo(
          '.intro-light-wash',
          {opacity: 0},
          {opacity: 0.85, duration: 0.35, ease: 'power1.inOut'},
          2.65
        )
        .to(
          '.intro-light-wash',
          {opacity: 0, duration: 0.45, ease: 'power2.out'},
          3.0
        )
        .to(
          '.intro-orbital-stage',
          {
            opacity: 0,
            duration: 0.32,
            ease: 'power2.out',
            onComplete: () => setIntroFinished(true),
          },
          2.92
        );

      // PHASE 4 & 5 — Element Reveal & Motion (2.98s -> 4.35s)
      tl.addLabel('reveal', 2.98)
        .fromTo(
          '.reveal-frame',
          {opacity: 0, scale: 0.96, y: 18},
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: 'expo.out',
            clearProps: 'transform',
          },
          'reveal'
        )
        .fromTo(
          '.reveal-top-school',
          {opacity: 0, y: -16},
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          'reveal+=0.1'
        )
        .fromTo(
          '.reveal-badge',
          {opacity: 0, scale: 0.9, filter: 'blur(6px)'},
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.48,
            clearProps: 'transform,filter',
          },
          'reveal+=0.18'
        )
        .fromTo(
          '.reveal-word',
          {opacity: 0, y: 20, filter: 'blur(6px)'},
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.52,
            stagger: 0.055,
            ease: 'power3.out',
            clearProps: 'transform,filter',
          },
          'reveal+=0.24'
        )
        .fromTo(
          '.reveal-desc',
          {opacity: 0, y: 14, filter: 'blur(4px)'},
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            clearProps: 'transform,filter',
          },
          'reveal+=0.42'
        )
        .fromTo(
          '.reveal-cta',
          {opacity: 0, y: 18},
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          'reveal+=0.52'
        )
        .fromTo(
          '.reveal-hub',
          {opacity: 0, scale: 0.72, filter: 'blur(4px)'},
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.55,
            ease: 'power3.out',
            clearProps: 'transform,filter',
          },
          'reveal+=0.56'
        )
        .fromTo(
          '.reveal-left-node',
          {opacity: 0, x: -46, scale: 0.9},
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          'reveal+=0.64'
        )
        .fromTo(
          '.reveal-right-node',
          {opacity: 0, x: 46, scale: 0.9},
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          'reveal+=0.64'
        )
        .to(
          '.intro-svg-line',
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
            ease: 'power2.inOut',
          },
          'reveal+=0.76'
        )
        .fromTo(
          '.reveal-mobile-node',
          {opacity: 0, y: 14, scale: 0.92},
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            stagger: 0.05,
            clearProps: 'transform',
          },
          'reveal+=0.66'
        )
        .call(() => setPulsesActive(true), [], 'reveal+=1.15');
    }, root);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  function handleSkipIntro() {
    if (timelineRef.current) {
      timelineRef.current.seek('reveal+=1.35', false);
    }
    orbitalStateRef.current.opacity = 0;
    setIntroFinished(true);
    setPulsesActive(true);
  }

  return (
    <motion.div
      ref={rootRef}
      initial={{opacity: 1}}
      exit={{opacity: 0, scale: 1.015}}
      transition={{duration: 0.38, ease: [0.16, 1, 0.3, 1]}}
      className="fixed inset-0 z-50 bg-surface-canvas text-on-surface overflow-y-auto"
    >
      <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8 relative">
        {/* Clean Off-White Ambient Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(239,246,255,0.7)_52%,#F8FAFC_100%)]"
        />

        {/* PHASE 1–3: 3D White Liquid Orbital Stage */}
        {!introFinished && (
          <div className="intro-orbital-stage fixed inset-0 z-30 flex items-center justify-center pointer-events-auto">
            {/* Initial white pinpoint light */}
            <div
              aria-hidden="true"
              className="intro-point-light absolute w-24 h-24 rounded-full bg-[radial-gradient(circle,#FFFFFF_0%,rgba(255,255,255,0.85)_38%,rgba(219,234,254,0)_75%)] shadow-[0_0_60px_rgba(255,255,255,0.95)] pointer-events-none"
            />

            {/* Three.js 3D Liquid Vortex Sphere */}
            <div className="w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] relative flex items-center justify-center pointer-events-none">
              <WhiteLiquidOrbital3D orbitalStateRef={orbitalStateRef} />
            </div>

            {/* Expanding White Wave Ripple (Phase 3) */}
            <div
              aria-hidden="true"
              className="intro-css-ripple absolute w-48 h-48 rounded-full border-2 border-white shadow-[0_0_50px_rgba(255,255,255,0.9)] pointer-events-none opacity-0"
            />

            {/* Soft White Light Wash Transition */}
            <div
              aria-hidden="true"
              className="intro-light-wash fixed inset-0 bg-white pointer-events-none opacity-0"
            />

            {/* Subtle Orbital Caption */}
            <div className="intro-orbital-caption opacity-0 translate-y-2 absolute bottom-14 sm:bottom-16 flex flex-col items-center gap-1 text-center pointer-events-none">
              <span className="font-headline text-sm sm:text-base font-bold tracking-wide text-on-surface">
                SMKS BM AL IKHLAS
              </span>
              <span className="text-xs font-medium text-muted">
                Portal E-Voting OSIS 2026/2027
              </span>
            </div>

            {/* Skip Intro Button */}
            <button
              type="button"
              onClick={handleSkipIntro}
              className="absolute top-5 right-5 sm:top-7 sm:right-7 inline-flex items-center gap-1.5 rounded-full border border-border-hairline bg-surface/90 hover:bg-surface px-4 py-1.5 text-xs font-semibold text-on-surface shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Skip Intro</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* PHASE 4–6: Landing Showcase Frame */}
        <div
          className={`reveal-frame relative w-full max-w-[1060px] rounded-2xl bg-surface border border-border-hairline shadow-[0_0_85px_rgba(29,78,216,0.14),0_20px_50px_-15px_rgba(15,23,42,0.1)] overflow-hidden ${
            prefersReducedMotion ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Subtle Architectural Grid Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#1D4ED8_1px,transparent_1px),linear-gradient(to_bottom,#1D4ED8_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
          />

          {/* Diagonal Soft Royal Blue Light Streak */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-12 w-[420px] h-[220px] rotate-[-28deg] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-[#1D4ED8]/25 blur-2xl opacity-60"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 right-16 w-[300px] h-[18px] rotate-[-28deg] bg-gradient-to-r from-transparent via-[#60A5FA]/35 to-transparent blur-md opacity-50"
          />

          {/* BAGIAN ATAS: Identitas SMKS BM AL IKHLAS di tengah & diperbesar */}
          <div className="reveal-top-school relative z-10 flex items-center justify-center gap-3 px-6 py-3.5 border-b border-border-hairline bg-surface-subtle/75 text-center">
            <span className="font-headline text-base sm:text-xl font-bold tracking-tight text-primary whitespace-nowrap">
              SMKS BM AL IKHLAS
            </span>
          </div>

          {/* BAGIAN TENGAH: Label, Judul Staggered, Deskripsi & 2 Tombol */}
          <div className="relative z-10 px-6 sm:px-12 pt-8 sm:pt-10 pb-4 flex flex-col items-center text-center">
            <div className="reveal-badge inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-tint px-4 py-1 text-xs font-semibold text-on-primary-tint mb-4 whitespace-nowrap">
              <span>Portal E-Voting Resmi • Periode 2026/2027</span>
            </div>

            <h1 className="font-headline text-[28px] sm:text-[40px] lg:text-[44px] leading-[1.15] font-bold tracking-[-0.02em] text-on-surface text-balance max-w-[780px]">
              {HEADLINE_WORDS.map((word, idx) => (
                <span
                  key={idx}
                  className="reveal-word inline-block mr-[0.26em] last:mr-0"
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="reveal-desc mt-3.5 text-sm sm:text-[15px] leading-[1.65] text-muted max-w-[540px] text-balance">
              Portal demokrasi digital SMKS BM AL IKHLAS untuk memilih pasangan calon Ketua &amp; Wakil OSIS secara langsung, jujur, dan terenkripsi.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <motion.button
                type="button"
                onClick={() => onEnterPortal('beranda')}
                whileHover={{y: -2}}
                whileTap={{scale: 0.97}}
                transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
                className="reveal-cta inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-6 py-2.5 text-sm font-semibold text-on-primary shadow-[0_0_0_1px_#1D4ED8,0_6px_18px_rgba(29,78,216,0.22)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 whitespace-nowrap"
              >
                <span>Masuk ke Beranda</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => onEnterPortal('bilik-suara')}
                whileHover={{y: -2}}
                whileTap={{scale: 0.97}}
                transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
                className="reveal-cta inline-flex items-center justify-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
              >
                <span>Langsung ke Bilik Suara</span>
                <ChevronRight className="w-4 h-4 text-muted" aria-hidden="true" />
              </motion.button>
            </div>
          </div>

          {/* BAGIAN DIAGRAM: Desktop & Tablet Precision Circuit Layout */}
          <div className="relative z-10 hidden sm:block w-full max-w-[920px] mx-auto h-[250px] md:h-[270px] mt-2">
            <svg
              viewBox="0 0 920 260"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id="blue-glow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Bottom Chip Pins */}
              {[436, 448, 460, 472, 484].map((pinX) => (
                <path
                  key={pinX}
                  d={`M ${pinX} 168 L ${pinX} 260`}
                  fill="none"
                  stroke="rgba(29, 78, 216, 0.18)"
                  strokeWidth="1.5"
                  className="intro-svg-line"
                />
              ))}

              {/* Base Circuit Lines (Animated SVG Line Drawing via GSAP) */}
              {CIRCUIT_TRACES.map((trace) => (
                <path
                  key={`base-${trace.id}`}
                  d={trace.d}
                  fill="none"
                  stroke="rgba(29, 78, 216, 0.22)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="intro-svg-line"
                />
              ))}

              {/* Subtle Royal Blue Energy Pulses after settlement */}
              {pulsesActive &&
                !prefersReducedMotion &&
                CIRCUIT_TRACES.map((trace) => (
                  <motion.path
                    key={`pulse-${trace.id}`}
                    d={trace.d}
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#blue-glow)"
                    strokeDasharray="44 380"
                    initial={{strokeDashoffset: 424, opacity: 0}}
                    animate={{strokeDashoffset: -44, opacity: [0, 0.9, 0.9, 0]}}
                    transition={{
                      duration: trace.duration,
                      delay: trace.delay,
                      repeat: Infinity,
                      repeatDelay: 0.75,
                      ease: 'linear',
                    }}
                  />
                ))}
            </svg>

            {/* Sebelah Kiri: 1. 4 Paslon, 2. Visi & Misi, 3. Enkripsi */}
            {LEFT_NODES.map((node) => {
              const Icon = node.icon;
              return (
                <motion.button
                  key={node.label}
                  type="button"
                  onClick={() => onEnterPortal(node.id)}
                  whileHover={{scale: 1.06, borderColor: 'rgba(29,78,216,0.55)'}}
                  whileTap={{scale: 0.96}}
                  transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
                  className={`reveal-left-node absolute ${node.posClass} w-[78px] h-[56px] md:w-[88px] md:h-[62px] rounded-xl bg-surface border border-border-hairline shadow-[0_8px_20px_-6px_rgba(15,23,42,0.1)] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-on-surface leading-none">
                    {node.label}
                  </span>
                </motion.button>
              );
            })}

            {/* Bagian Tengah: Logo & Identitas OSIS 2026 */}
            <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
              <motion.button
                type="button"
                onClick={() => onEnterPortal('beranda')}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.96}}
                transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
                className="reveal-hub w-[100px] h-[90px] md:w-[116px] md:h-[98px] rounded-2xl bg-primary-tint border border-primary/35 shadow-[0_12px_32px_rgba(29,78,216,0.2)] flex flex-col items-center justify-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <img
                  src="/assets/aistudio/logo_osis_karsakala.png"
                  alt="OSIS SMKS BM AL IKHLAS"
                  className="w-10 h-10 md:w-12 md:h-12 object-contain"
                />
                <span className="font-headline text-[11px] font-bold tracking-wider text-primary">
                  OSIS 2026
                </span>
              </motion.button>
            </div>

            {/* Sebelah Kanan: 1. Bilik Suara, 2. Quick Count, 3. Panitia */}
            {RIGHT_NODES.map((node) => {
              const Icon = node.icon;
              return (
                <motion.button
                  key={node.label}
                  type="button"
                  onClick={() => onEnterPortal(node.id)}
                  whileHover={{scale: 1.06, borderColor: 'rgba(29,78,216,0.55)'}}
                  whileTap={{scale: 0.96}}
                  transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
                  className={`reveal-right-node absolute ${node.posClass} w-[78px] h-[56px] md:w-[88px] md:h-[62px] rounded-xl bg-surface border border-border-hairline shadow-[0_8px_20px_-6px_rgba(15,23,42,0.1)] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-on-surface leading-none">
                    {node.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Compact Nodes Grid */}
          <div className="relative z-10 sm:hidden px-5 pt-4 pb-7 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => onEnterPortal('beranda')}
              className="reveal-hub w-20 h-20 rounded-2xl bg-primary-tint border border-primary/35 shadow-[0_10px_25px_rgba(29,78,216,0.18)] flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <img
                src="/assets/aistudio/logo_osis_karsakala.png"
                alt="OSIS SMKS BM AL IKHLAS"
                className="w-10 h-10 object-contain"
              />
              <span className="font-headline text-[10px] font-bold text-primary">
                OSIS 2026
              </span>
            </button>
            <div className="grid grid-cols-3 gap-2 w-full">
              {[...LEFT_NODES, ...RIGHT_NODES].map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.label}
                    type="button"
                    onClick={() => onEnterPortal(node.id)}
                    className="reveal-mobile-node rounded-lg bg-surface border border-border-hairline py-2.5 px-2 flex flex-col items-center gap-1 text-on-surface cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="text-[10px] font-semibold">
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
