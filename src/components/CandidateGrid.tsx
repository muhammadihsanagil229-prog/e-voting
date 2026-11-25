import {ArrowRight, BookOpen} from 'lucide-react';
import {motion} from 'motion/react';
import type {CandidatePair} from '../types/election';
import {ResilientImage} from './ResilientImage';

interface CandidateGridProps {
  candidates: CandidatePair[];
  onOpenVision: (candidate: CandidatePair) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CandidateGrid({candidates, onOpenVision}: CandidateGridProps) {
  return (
    <section
      id="kandidat"
      className="py-section lg:py-section-lg border-b border-border-hairline bg-surface flex-1"
    >
      <div className="max-w-[1200px] mx-auto px-lg">
        <motion.div
          initial={{opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.35, ease: EASE_OUT_EXPO}}
          className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl"
        >
          <div className="flex flex-col gap-xs max-w-prose">
            <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-on-surface text-balance">
              Profil Pasangan Calon Ketua &amp; Wakil OSIS
            </h2>
            <p className="text-body-lg text-muted text-pretty">
              Pelajari gagasan utama dan program kerja masing-masing pasangan calon sebelum memasuki bilik suara.
            </p>
          </div>
          <span className="text-label-sm text-muted tabular-nums shrink-0">
            Periode Bakti 2026 / 2027
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg items-stretch">
          {candidates.map((candidate, idx) => (
            <motion.article
              key={candidate.id}
              initial={{opacity: 0, y: 16}}
              animate={{opacity: 1, y: 0}}
              transition={{
                duration: 0.36,
                delay: idx * 0.05,
                ease: EASE_OUT_EXPO,
              }}
              whileHover={{y: -3}}
              className="h-full bg-surface border border-border-hairline rounded-md p-lg shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col justify-between gap-md"
            >
              <div className="flex flex-col gap-md">
                <div className="relative overflow-hidden rounded border border-border-hairline bg-surface-canvas">
                  <ResilientImage
                    src={candidate.imageUrl}
                    alt={candidate.imageAlt}
                    fallbackLabel={candidate.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary text-on-primary px-3 py-1 text-label-sm tabular-nums">
                    {candidate.badge}
                  </span>
                </div>

                <header className="flex flex-col gap-xs">
                  <h3 className="font-headline text-title-lg text-on-surface">
                    {candidate.title}
                  </h3>
                  <p className="text-label-sm text-muted">{candidate.classes}</p>
                </header>

                <p className="text-body-md text-muted text-pretty">
                  {candidate.summary}
                </p>
              </div>

              <footer className="pt-md border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => onOpenVision(candidate)}
                  className="w-full inline-flex items-center justify-center gap-xs bg-surface hover:bg-primary-tint hover:text-primary hover:border-primary/40 text-on-surface border border-border-input rounded px-md py-2.5 font-body text-label-lg transition-[background-color,color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Lihat Visi &amp; Misi</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
