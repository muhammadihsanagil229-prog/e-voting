import {useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  IdCard,
  Lock,
  MessageSquareText,
  MonitorSmartphone,
  ShieldCheck,
  TrendingUp,
  Users,
  Vote,
  X,
  ZoomIn,
} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import {STUDENT_AVATARS} from '../data/electionData';
import type {
  CandidatePair,
  PaslonId,
  VoteCounts,
  VoteReceipt,
} from '../types/election';
import {ResilientImage} from './ResilientImage';

interface HeroSectionProps {
  candidates: CandidatePair[];
  activeNisn: string;
  isVerified: boolean;
  selectedPaslon: PaslonId | null;
  voteCounts: VoteCounts;
  receipts: VoteReceipt[];
  isElectionClosed: boolean;
  onSelectPaslon: (id: PaslonId) => void;
  onNavigateSection: (sectionId: string, focusId?: string) => void;
}

const FEATURE_CARDS = [
  {
    icon: Vote,
    title: '1 Siswa 1 Suara',
    subtitle: 'Hak pilih tunggal terkunci',
    targetSection: 'bilik-suara',
  },
  {
    icon: Lock,
    title: 'Enkripsi Suara',
    subtitle: 'Kerahasiaan pilihan terjaga',
    targetSection: 'bilik-suara',
  },
  {
    icon: TrendingUp,
    title: 'Hasil Real-Time',
    subtitle: 'Rekapitulasi suara langsung',
    targetSection: 'quick-count',
  },
  {
    icon: MonitorSmartphone,
    title: 'Akses Multi-Perangkat',
    subtitle: 'Ponsel, tablet, dan laptop',
    targetSection: 'kandidat',
  },
  {
    icon: IdCard,
    title: 'Validasi Peserta',
    subtitle: 'Cocok dengan daftar pemilih',
    targetSection: 'bilik-suara',
  },
  {
    icon: BadgeCheck,
    title: 'Transparan & Jujur',
    subtitle: 'Diawasi Panitia Pemilihan OSIS',
    targetSection: 'quick-count',
  },
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatVoteTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Baru saja';
  return `${date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })} WIB`;
}

export function HeroSection({
  candidates,
  activeNisn,
  isVerified,
  selectedPaslon,
  voteCounts,
  receipts,
  isElectionClosed,
  onSelectPaslon,
  onNavigateSection,
}: HeroSectionProps) {
  const [highlightLiveTable, setHighlightLiveTable] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const liveTableRef = useRef<HTMLDivElement>(null);

  const sortedVoters = useMemo(
    () =>
      [...receipts].sort(
        (a, b) => new Date(b.castAt).getTime() - new Date(a.castAt).getTime()
      ),
    [receipts]
  );

  useEffect(() => {
    if (!isZoomOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen]);

  const latestVoter = sortedVoters[0] ?? null;

  const totalVotes =
    voteCounts['01'] +
    voteCounts['02'] +
    voteCounts['03'] +
    (voteCounts['04'] ?? 0);
  const displayedTotalVotes = isElectionClosed ? totalVotes : 0;
  const previewSelected: PaslonId = selectedPaslon ?? '01';

  function handleScrollToLiveTable() {
    liveTableRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    setHighlightLiveTable(true);
    window.setTimeout(() => setHighlightLiveTable(false), 1400);
  }

  return (
    <section
      id="beranda"
      className="py-section lg:py-section-lg border-b border-border-hairline bg-surface-canvas overflow-hidden flex-1"
    >
      <div className="max-w-[1200px] mx-auto px-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-xl items-center">
          {/* Left Column */}
          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.45, ease: EASE_OUT_EXPO}}
            className="lg:col-span-4 flex flex-col items-start gap-lg"
          >
            <h1 className="font-headline text-display-lg-mobile lg:text-display-lg uppercase text-on-surface text-balance">
              SUARA ANDA
              <br />
              MASA DEPAN
              <br />
              OSIS KITA
            </h1>

            <p className="text-body-lg text-muted text-pretty max-w-prose">
              Portal demokrasi digital resmi SMKS BM AL IKHLAS untuk pemilihan Ketua dan Wakil Ketua OSIS periode 2026/2027 secara langsung, jujur, dan terenkripsi.
            </p>

            {/* Avatar Stack Badge */}
            <motion.button
              type="button"
              onClick={() => onNavigateSection('quick-count')}
              whileHover={{y: -2}}
              whileTap={{scale: 0.98}}
              transition={{duration: 0.2, ease: EASE_OUT_EXPO}}
              className="inline-flex items-center gap-sm bg-surface border border-border-hairline hover:border-primary/40 rounded-full py-1.5 pl-1.5 pr-4 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex -space-x-2">
                {STUDENT_AVATARS.map((avatar, index) => (
                  <ResilientImage
                    key={index}
                    src={avatar.src}
                    alt={avatar.alt}
                    fallbackLabel={avatar.initials}
                    isAvatar
                    className="w-7 h-7 rounded-full object-cover border-2 border-surface"
                  />
                ))}
              </div>
              <span className="text-label-sm text-on-surface tabular-nums">
                {isElectionClosed
                  ? `${totalVotes.toLocaleString('id-ID')} Siswa Memilih`
                  : '0 Siswa • Ditentukan di Akhir'}
              </span>
            </motion.button>

            {/* Primary CTA */}
            <motion.a
              href="#bilik-suara"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection('bilik-suara', 'voter-name');
              }}
              whileHover={{y: -2}}
              whileTap={{scale: 0.97}}
              transition={{duration: 0.2, ease: EASE_OUT_EXPO}}
              className="inline-flex items-center justify-center gap-sm bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-3 font-body text-label-lg shadow-[0_0_0_1px_#1D4ED8,0_4px_12px_rgba(29,78,216,0.18)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <span>Mulai Memilih</span>
              <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
            </motion.a>
          </motion.div>

          {/* Center Column: Laptop Mockup + Staggered UI Preview Cards */}
          <motion.div
            initial={{opacity: 0, y: 22}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.08, ease: EASE_OUT_EXPO}}
            className="lg:col-span-5 flex flex-col gap-md"
          >
            <div className="bg-surface border border-border-hairline rounded-md p-md shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-md">
              {/* Top Bezel */}
              <div className="flex items-center justify-between border-b border-border-hairline pb-sm gap-sm">
                <div className="flex items-center gap-xs shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-border-input" aria-hidden="true" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border-input" aria-hidden="true" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border-input" aria-hidden="true" />
                </div>
                <span className="text-label-sm text-muted bg-surface-subtle px-3 py-0.5 rounded-full truncate">
                  pilketos.smksbmalikhlas.sch.id
                </span>
                <Lock className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
              </div>

              {/* Staggered Preview Cards */}
              <div className="flex flex-col gap-sm">
                {/* Card 1: Live Voter Check-in Preview (Interactive -> Live Chat Tabel Pemilih) */}
                <motion.button
                  type="button"
                  onClick={handleScrollToLiveTable}
                  initial={{opacity: 0, x: -16}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.45, delay: 0.16, ease: EASE_OUT_EXPO}}
                  whileHover={{y: -2}}
                  whileTap={{scale: 0.99}}
                  className="self-start w-full sm:w-[88%] bg-surface border border-border-hairline hover:border-primary/40 rounded-md p-md shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex items-center justify-between gap-sm text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-center gap-sm min-w-0">
                    <div className="w-9 h-9 rounded bg-success/10 text-success flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-label-lg text-on-surface truncate">
                        {latestVoter ? latestVoter.nisn : 'Live Pemilih Masuk'}
                      </p>
                      <p className="text-label-sm text-muted truncate">
                        {latestVoter
                          ? `${latestVoter.className} • Baru memilih`
                          : 'Menunggu pemilih pertama'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-label-sm px-2.5 py-1 rounded-full shrink-0 tabular-nums ${
                      sortedVoters.length > 0
                        ? 'text-on-success bg-success'
                        : 'text-on-surface-subtle bg-surface-subtle'
                    }`}
                  >
                    {sortedVoters.length > 0
                      ? `${sortedVoters.length} Memilih`
                      : 'Live Chat'}
                  </span>
                </motion.button>

                {/* Card 2: Candidate Ballot Preview (Interactive Paslon Buttons) */}
                <motion.div
                  initial={{opacity: 0, x: 16}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.45, delay: 0.24, ease: EASE_OUT_EXPO}}
                  className="self-end w-full sm:w-[90%] bg-surface border border-border-hairline rounded-md p-md shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-sm"
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onNavigateSection('bilik-suara')}
                      className="text-label-sm text-primary hover:underline uppercase cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      Surat Suara Digital
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateSection('kandidat')}
                      className="text-label-sm text-muted hover:text-primary tabular-nums cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {candidates.length} Paslon
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-xs">
                    {candidates.map((cand) => {
                      const active = previewSelected === cand.id;
                      return (
                        <motion.button
                          key={cand.id}
                          type="button"
                          onClick={() => {
                            if (!isElectionClosed) {
                              onSelectPaslon(cand.id);
                            }
                            onNavigateSection('bilik-suara');
                          }}
                          whileHover={{y: -2}}
                          whileTap={{scale: 0.96}}
                          transition={{duration: 0.16, ease: EASE_OUT_EXPO}}
                          className={`rounded p-sm flex flex-col items-center gap-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            active
                              ? 'border-2 border-primary bg-primary-tint'
                              : 'border border-border-hairline bg-surface-canvas hover:bg-surface-subtle'
                          }`}
                        >
                          <span
                            className={`text-label-sm tabular-nums ${
                              active ? 'text-on-primary-tint' : 'text-muted'
                            }`}
                          >
                            {cand.id}
                          </span>
                          <span
                            className={`text-label-sm ${
                              active ? 'text-on-surface' : 'text-muted'
                            }`}
                          >
                            {cand.shortName}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Card 3: Live Quick Count Preview (Interactive -> Quick Count) */}
                <motion.button
                  type="button"
                  onClick={() => onNavigateSection('quick-count')}
                  initial={{opacity: 0, x: -16}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.45, delay: 0.32, ease: EASE_OUT_EXPO}}
                  whileHover={{y: -2}}
                  whileTap={{scale: 0.99}}
                  className="self-start w-full sm:w-[88%] bg-surface border border-border-hairline hover:border-primary/40 rounded-md p-md shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-sm text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-label-lg text-on-surface">
                      Live Quick Count
                    </span>
                    <span className="text-label-sm text-muted tabular-nums">
                      {isElectionClosed
                        ? `${displayedTotalVotes.toLocaleString('id-ID')} Suara`
                        : '0 Suara • Dibuka Panitia'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-xs w-full">
                    {candidates.map((cand, idx) => {
                      const count = voteCounts[cand.id] ?? 0;
                      const pct =
                        isElectionClosed && totalVotes > 0
                          ? ((count / totalVotes) * 100).toFixed(1)
                          : '0.0';
                      const barOpacity =
                        idx === 0
                          ? 'bg-primary'
                          : idx === 1
                            ? 'bg-primary/70'
                            : idx === 2
                              ? 'bg-primary/45'
                              : 'bg-primary/25';
                      return (
                        <div key={cand.id} className="flex items-center gap-sm">
                          <span
                            className={`text-label-sm w-8 tabular-nums ${
                              idx === 0 ? 'text-on-surface' : 'text-muted'
                            }`}
                          >
                            {cand.id}
                          </span>
                          <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-[width] duration-300 ${barOpacity}`}
                              style={{width: `${pct}%`}}
                            />
                          </div>
                          <span
                            className={`text-label-sm w-11 text-right tabular-nums ${
                              idx === 0 ? 'text-on-surface' : 'text-muted'
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Laptop Base Lip */}
            <div className="mx-auto w-2/3 h-2 bg-border-input rounded-b-md" aria-hidden="true" />
          </motion.div>

          {/* Right Column: 6 Compact Feature Cards */}
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-sm">
            {FEATURE_CARDS.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.button
                  key={feat.title}
                  type="button"
                  onClick={() => onNavigateSection(feat.targetSection)}
                  initial={{opacity: 0, x: 18}}
                  animate={{opacity: 1, x: 0}}
                  transition={{
                    duration: 0.4,
                    delay: 0.14 + idx * 0.05,
                    ease: EASE_OUT_EXPO,
                  }}
                  whileHover={{x: -2}}
                  whileTap={{scale: 0.99}}
                  className="bg-surface border border-border-hairline hover:border-primary/40 rounded-md p-3 flex items-center gap-sm shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="w-9 h-9 rounded bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-label-lg text-on-surface truncate">
                      {feat.title}
                    </p>
                    <p className="text-label-sm text-muted truncate">
                      {feat.subtitle}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Live Chat Style Table of Voters Who Have Voted */}
        <motion.div
          ref={liveTableRef}
          id="live-voter-table"
          initial={{opacity: 0, y: 18}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.45, delay: 0.2, ease: EASE_OUT_EXPO}}
          className={`mt-xl bg-surface border rounded-md shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] overflow-hidden transition-all duration-300 ${
            highlightLiveTable
              ? 'border-primary ring-2 ring-primary/25'
              : 'border-border-hairline'
          }`}
        >
          {/* Live Chat Header */}
          <div className="px-lg py-md border-b border-border-hairline bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-md">
            <div className="flex items-start sm:items-center gap-sm">
              <div className="w-10 h-10 rounded-md bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                <MessageSquareText className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-sm flex-wrap">
                  <h2 className="font-headline text-title-lg text-on-surface">
                    Daftar Pemilih Sudah Memilih
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/30 px-2.5 py-0.5 text-label-sm text-success">
                    <span
                      className="w-2 h-2 rounded-full bg-success animate-pulse"
                      aria-hidden="true"
                    />
                    <span>Live</span>
                  </span>
                </div>
                <p className="text-body-md text-muted">
                  Pantauan langsung siswa dan guru yang sudah menggunakan hak suara (pilihan kandidat tetap rahasia).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-sm shrink-0">
              <div className="inline-flex items-center gap-1.5 rounded bg-surface-subtle border border-border-hairline px-3 py-1.5 text-label-sm text-on-surface tabular-nums whitespace-nowrap">
                <Users className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>{sortedVoters.length.toLocaleString('id-ID')} Pemilih</span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                aria-label="Perbesar tampilan daftar pemilih sudah memilih"
                className="inline-flex items-center gap-1.5 rounded bg-primary-tint hover:bg-primary/15 border border-primary/25 px-3 py-1.5 text-label-sm text-primary transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ZoomIn className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Zoom</span>
              </button>
            </div>
          </div>

          {/* Table Column Header */}
          <div className="hidden md:grid grid-cols-12 gap-md px-lg py-2.5 bg-surface-canvas border-b border-border-hairline text-label-sm text-muted uppercase">
            <div className="col-span-4">Pemilih</div>
            <div className="col-span-2">Kelas / Status</div>
            <div className="col-span-4">Aktivitas Live</div>
            <div className="col-span-2 text-right">Waktu</div>
          </div>

          {/* Scrollable Live Chat Stream Rows */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-border-hairline bg-surface-canvas/40">
            {sortedVoters.length === 0 ? (
              <div className="px-lg py-xl flex flex-col items-center justify-center text-center gap-xs">
                <MessageSquareText
                  className="w-8 h-8 text-muted/60"
                  aria-hidden="true"
                />
                <p className="text-label-lg text-on-surface">
                  Belum ada siswa atau guru yang memilih
                </p>
                <p className="text-body-md text-muted max-w-[46ch] mx-auto text-center leading-relaxed text-balance">
                  Pemilih yang selesai memberikan suara di Bilik Suara Digital akan tampil otomatis secara real-time di daftar ini.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {sortedVoters.map((voter, idx) => (
                  <motion.div
                    key={voter.receiptCode}
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.24, ease: EASE_OUT_EXPO}}
                    className="px-lg py-3 grid grid-cols-1 md:grid-cols-12 gap-sm md:gap-md items-start md:items-center hover:bg-surface transition-colors"
                  >
                    {/* Voter Avatar + Name */}
                    <div className="md:col-span-4 flex items-center gap-sm min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary-tint text-on-primary-tint font-headline text-label-sm flex items-center justify-center shrink-0">
                        {getInitials(voter.nisn)}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <div className="flex items-center gap-xs">
                          <span className="text-label-lg text-on-surface truncate">
                            {voter.nisn}
                          </span>
                          {idx === 0 && (
                            <span className="rounded bg-primary-tint text-primary px-1.5 py-0.5 text-[11px] font-medium shrink-0">
                              Terbaru
                            </span>
                          )}
                        </div>
                        <span className="text-label-sm text-muted tabular-nums">
                          {voter.receiptCode}
                        </span>
                      </div>
                    </div>

                    {/* Class / Role */}
                    <div className="md:col-span-2 flex items-center">
                      <span className="inline-flex items-center rounded bg-surface border border-border-hairline px-2.5 py-0.5 text-label-sm text-on-surface">
                        {voter.className}
                      </span>
                    </div>

                    {/* Live Chat Message Bubble */}
                    <div className="md:col-span-4 flex items-center">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-surface border border-border-hairline px-3 py-1.5 text-body-md text-on-surface shadow-xs">
                        <CheckCircle2
                          className="w-4 h-4 text-success shrink-0"
                          aria-hidden="true"
                        />
                        <span>Sudah menggunakan hak suara</span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="md:col-span-2 flex md:justify-end items-center">
                      <span className="text-label-sm text-muted tabular-nums">
                        {formatVoteTime(voter.castAt)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Zoom Overlay Modal: Large Live Voter Attendance View (No Candidate Selection Exposed) */}
        <AnimatePresence>
          {isZoomOpen && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.2}}
              className="fixed inset-0 z-50 bg-surface flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="zoom-voter-modal-title"
            >
              <motion.div
                initial={{opacity: 0, scale: 0.98}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.98}}
                transition={{duration: 0.24, ease: EASE_OUT_EXPO}}
                className="w-full h-full bg-surface flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-lg py-md border-b border-border-hairline bg-surface flex items-center justify-between gap-md shrink-0">
                  <div className="flex items-center gap-sm min-w-0">
                    <div className="w-11 h-11 rounded-md bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                      <ZoomIn className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-sm flex-wrap">
                        <h3
                          id="zoom-voter-modal-title"
                          className="font-headline text-title-lg sm:text-headline-md text-on-surface"
                        >
                          Pemilih yang Sudah Menggunakan Hak Suara
                        </h3>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/30 px-2.5 py-0.5 text-label-sm text-success">
                          <span
                            className="w-2 h-2 rounded-full bg-success animate-pulse"
                            aria-hidden="true"
                          />
                          <span>Live</span>
                        </span>
                      </div>
                      <p className="text-body-md text-muted">
                        Tampilan layar penuh peserta yang telah memilih — pilihan pasangan calon tetap dirahasiakan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-sm shrink-0">
                    <div className="hidden sm:inline-flex items-center gap-1.5 rounded bg-surface-subtle border border-border-hairline px-3 py-1.5 text-label-sm text-on-surface tabular-nums">
                      <Users className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span>{sortedVoters.length.toLocaleString('id-ID')} Pemilih</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsZoomOpen(false)}
                      aria-label="Tutup tampilan zoom"
                      className="inline-flex items-center justify-center w-9 h-9 rounded border border-border-input bg-surface hover:bg-surface-subtle text-on-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Zoomed Table Column Headers */}
                <div className="hidden md:grid grid-cols-12 gap-md px-lg py-3 bg-surface-canvas border-b border-border-hairline text-label-sm text-muted uppercase shrink-0">
                  <div className="col-span-1">No</div>
                  <div className="col-span-4">Nama Pemilih</div>
                  <div className="col-span-3">Kelas / Jabatan</div>
                  <div className="col-span-2">Status Suara</div>
                  <div className="col-span-2 text-right">Waktu</div>
                </div>

                {/* Zoomed Scrollable List */}
                <div className="flex-1 overflow-y-auto divide-y divide-border-hairline bg-surface-canvas/40">
                  {sortedVoters.length === 0 ? (
                    <div className="px-lg py-section flex flex-col items-center justify-center text-center gap-sm">
                      <MessageSquareText
                        className="w-10 h-10 text-muted/60"
                        aria-hidden="true"
                      />
                      <p className="text-title-md text-on-surface">
                        Belum ada peserta yang memilih
                      </p>
                      <p className="text-body-md text-muted max-w-[46ch] mx-auto leading-relaxed text-balance">
                        Daftar nama dan kelas peserta yang telah memilih akan tampil besar di layar ini tanpa memperlihatkan paslon yang dipilih.
                      </p>
                    </div>
                  ) : (
                    sortedVoters.map((voter, idx) => (
                      <div
                        key={voter.receiptCode}
                        className="px-lg py-md grid grid-cols-1 md:grid-cols-12 gap-sm md:gap-md items-start md:items-center hover:bg-surface transition-colors"
                      >
                        <div className="hidden md:flex md:col-span-1 text-label-lg text-muted tabular-nums">
                          {idx + 1}.
                        </div>

                        <div className="md:col-span-4 flex items-center gap-md min-w-0">
                          <div className="w-11 h-11 rounded-full bg-primary-tint text-on-primary-tint font-headline text-label-lg flex items-center justify-center shrink-0">
                            {getInitials(voter.nisn)}
                          </div>
                          <div className="min-w-0 flex flex-col">
                            <div className="flex items-center gap-xs">
                              <span className="font-headline text-title-md text-on-surface truncate">
                                {voter.nisn}
                              </span>
                              {idx === 0 && (
                                <span className="rounded bg-primary-tint text-primary px-2 py-0.5 text-label-sm shrink-0">
                                  Terbaru
                                </span>
                              )}
                            </div>
                            <span className="text-label-sm text-muted tabular-nums">
                              Kode: {voter.receiptCode}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-3 flex items-center">
                          <span className="inline-flex items-center rounded bg-surface border border-border-hairline px-3 py-1 text-label-lg text-on-surface">
                            {voter.className}
                          </span>
                        </div>

                        <div className="md:col-span-2 flex items-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/30 px-3 py-1 text-label-sm text-success">
                            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>Sudah Memilih</span>
                          </span>
                        </div>

                        <div className="md:col-span-2 flex md:justify-end items-center">
                          <span className="text-label-lg text-muted tabular-nums">
                            {formatVoteTime(voter.castAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
