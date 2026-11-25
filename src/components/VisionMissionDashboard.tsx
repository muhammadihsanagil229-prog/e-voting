import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  ListChecks,
  Vote,
} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import type {CandidatePair, PaslonId} from '../types/election';
import {ResilientImage} from './ResilientImage';

interface VisionMissionDashboardProps {
  candidates: CandidatePair[];
  activePaslonId: PaslonId;
  onSelectCandidateTab: (id: PaslonId) => void;
  onBackToCandidates: () => void;
  onVoteForCandidate: (id: PaslonId) => void;
  isElectionClosed: boolean;
  hasVoted: boolean;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function VisionMissionDashboard({
  candidates,
  activePaslonId,
  onSelectCandidateTab,
  onBackToCandidates,
  onVoteForCandidate,
  isElectionClosed,
  hasVoted,
}: VisionMissionDashboardProps) {
  const currentIndex = Math.max(
    0,
    candidates.findIndex((c) => c.id === activePaslonId)
  );
  const candidate = candidates[currentIndex] ?? candidates[0];
  if (!candidate) return null;

  const prevCandidate =
    candidates[(currentIndex - 1 + candidates.length) % candidates.length];
  const nextCandidate = candidates[(currentIndex + 1) % candidates.length];

  return (
    <section
      id="visi-misi"
      className="py-section lg:py-section-lg border-b border-border-hairline bg-surface-canvas flex-1"
    >
      <div className="max-w-[1200px] mx-auto px-lg flex flex-col gap-xl">
        {/* Top bar: Back button + Candidate Switcher */}
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.32, ease: EASE_OUT_EXPO}}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-md pb-lg border-b border-border-hairline"
        >
          <div className="flex flex-col gap-xs">
            <button
              type="button"
              onClick={onBackToCandidates}
              className="self-start inline-flex items-center gap-xs text-label-md text-muted hover:text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Kembali ke Daftar Kandidat</span>
            </button>
            <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-on-surface text-balance">
              Dashboard Visi &amp; Misi Lengkap
            </h2>
            <p className="text-body-md text-muted">
              Telaah visi utama dan program kerja terperinci setiap pasangan calon Ketua &amp; Wakil OSIS SMKS BM AL IKHLAS.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Pilih Pasangan Calon"
            className="flex flex-wrap items-center gap-xs bg-surface border border-border-hairline rounded-md p-1.5 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.05)]"
          >
            {candidates.map((cand) => {
              const isSelected = cand.id === candidate.id;
              return (
                <button
                  key={cand.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectCandidateTab(cand.id)}
                  className={`inline-flex items-center gap-xs rounded px-3.5 py-2 text-label-md transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-muted hover:text-on-surface hover:bg-surface-subtle'
                  }`}
                >
                  <span className="tabular-nums font-semibold">
                    Paslon {cand.id}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Detail Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={candidate.id}
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.28, ease: EASE_OUT_EXPO}}
            className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start"
          >
            {/* Left Column: Candidate Identity Card */}
            <aside className="lg:col-span-4 bg-surface border border-border-hairline rounded-md p-lg shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-md">
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

              <div className="flex flex-col gap-xs">
                <span className="text-label-sm text-primary font-semibold uppercase tracking-wide">
                  {candidate.tagline}
                </span>
                <h3 className="font-headline text-headline-md text-on-surface">
                  {candidate.title}
                </h3>
                <p className="text-label-md text-muted">{candidate.classes}</p>
              </div>

              <div className="pt-md border-t border-border-hairline flex flex-col gap-xs">
                <span className="text-label-sm text-muted font-medium">
                  Ringkasan Gagasan
                </span>
                <p className="text-body-md text-on-surface text-pretty">
                  {candidate.summary}
                </p>
              </div>

              <div className="pt-md border-t border-border-hairline flex flex-col gap-sm">
                <button
                  type="button"
                  onClick={() => onVoteForCandidate(candidate.id)}
                  className="w-full inline-flex items-center justify-center gap-xs bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-3 font-body text-label-lg transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
                >
                  {hasVoted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>Lihat Bukti Pilih di Bilik Suara</span>
                    </>
                  ) : isElectionClosed ? (
                    <>
                      <Vote className="w-4 h-4" aria-hidden="true" />
                      <span>Ke Bilik Suara</span>
                    </>
                  ) : (
                    <>
                      <Vote className="w-4 h-4" aria-hidden="true" />
                      <span>Pilih Paslon {candidate.id} di Bilik Suara</span>
                    </>
                  )}
                </button>
              </div>
            </aside>

            {/* Right Column: Complete Vision & Missions */}
            <div className="lg:col-span-8 flex flex-col gap-lg">
              {/* Visi Card */}
              <div className="bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-md">
                <div className="flex items-center gap-sm pb-sm border-b border-border-hairline">
                  <div className="w-9 h-9 rounded bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-label-sm text-muted block">
                      Arah &amp; Cita-Cita Organisasi
                    </span>
                    <h3 className="font-headline text-title-lg text-on-surface">
                      Visi Utama {candidate.badge}
                    </h3>
                  </div>
                </div>

                <blockquote className="bg-surface-canvas border-l-4 border-primary rounded-r p-lg text-body-lg text-on-surface leading-relaxed text-pretty">
                  “{candidate.vision}”
                </blockquote>
              </div>

              {/* Misi Card */}
              <div className="bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-md">
                <div className="flex items-center justify-between gap-md pb-sm border-b border-border-hairline">
                  <div className="flex items-center gap-sm">
                    <div className="w-9 h-9 rounded bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                      <ListChecks className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-label-sm text-muted block">
                        Rencana Aksi Nyata
                      </span>
                      <h3 className="font-headline text-title-lg text-on-surface">
                        Misi &amp; Program Kerja Lengkap
                      </h3>
                    </div>
                  </div>
                  <span className="text-label-sm text-muted tabular-nums shrink-0">
                    {candidate.missions.length} Poin Misi
                  </span>
                </div>

                <ol className="flex flex-col gap-md">
                  {candidate.missions.map((mission, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-md bg-surface-canvas border border-border-hairline rounded p-md"
                    >
                      <span className="w-8 h-8 rounded bg-primary text-on-primary font-headline text-label-md tabular-nums flex items-center justify-center shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-body-md text-on-surface leading-relaxed text-pretty">
                        {mission}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Prev / Next Paslon Navigation Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-sm pt-xs">
                <button
                  type="button"
                  onClick={() => onSelectCandidateTab(prevCandidate.id)}
                  className="inline-flex items-center justify-center sm:justify-start gap-xs bg-surface hover:bg-surface-subtle text-on-surface border border-border-hairline rounded px-md py-2.5 text-label-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    Sebelumnya: Paslon {prevCandidate.id} ({prevCandidate.shortName})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectCandidateTab(nextCandidate.id)}
                  className="inline-flex items-center justify-center sm:justify-end gap-xs bg-surface hover:bg-surface-subtle text-on-surface border border-border-hairline rounded px-md py-2.5 text-label-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>
                    Berikutnya: Paslon {nextCandidate.id} ({nextCandidate.shortName})
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
