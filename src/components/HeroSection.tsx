import {
  ArrowRight,
  BadgeCheck,
  IdCard,
  Lock,
  MonitorSmartphone,
  ShieldCheck,
  TrendingUp,
  Vote,
} from 'lucide-react';
import {motion} from 'motion/react';
import {STUDENT_AVATARS} from '../data/electionData';
import type {CandidatePair, PaslonId, VoteCounts} from '../types/election';
import {ResilientImage} from './ResilientImage';

interface HeroSectionProps {
  candidates: CandidatePair[];
  activeNisn: string;
  isVerified: boolean;
  selectedPaslon: PaslonId | null;
  voteCounts: VoteCounts;
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

export function HeroSection({
  candidates,
  activeNisn,
  isVerified,
  selectedPaslon,
  voteCounts,
  isElectionClosed,
  onSelectPaslon,
  onNavigateSection,
}: HeroSectionProps) {
  const totalVotes =
    voteCounts['01'] +
    voteCounts['02'] +
    voteCounts['03'] +
    (voteCounts['04'] ?? 0);
  const displayedTotalVotes = isElectionClosed ? totalVotes : 0;
  const previewSelected: PaslonId = selectedPaslon ?? '01';

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
                {/* Card 1: Voter Verification (Interactive -> Bilik Suara) */}
                <motion.button
                  type="button"
                  onClick={() => onNavigateSection('bilik-suara', 'voter-name')}
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
                        {activeNisn.trim() || 'Nama Peserta'}
                      </p>
                      <p className="text-label-sm text-muted truncate">
                        {isVerified ? 'Status Pemilih Aktif' : 'Menunggu Verifikasi'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-label-sm px-2.5 py-1 rounded-full shrink-0 ${
                      isVerified
                        ? 'text-on-success bg-success'
                        : 'text-on-surface-subtle bg-surface-subtle'
                    }`}
                  >
                    {isVerified ? 'Terverifikasi' : 'Belum Aktif'}
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
      </div>
    </section>
  );
}
