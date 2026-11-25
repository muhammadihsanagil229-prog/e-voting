import {useState} from 'react';
import {
  CheckCircle2,
  KeyRound,
  Lock,
  PieChart,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import {motion} from 'motion/react';
import type {ActivityItem, CandidatePair, VoteCounts} from '../types/election';

interface QuickCountSectionProps {
  candidates: CandidatePair[];
  voteCounts: VoteCounts;
  activityFeed: ActivityItem[];
  isElectionClosed: boolean;
  onToggleElectionClosed: () => void;
  onResetElection: () => void;
}

const COMMITTEE_ACCESS_CODE = 'PPO2026';
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function QuickCountSection({
  candidates,
  voteCounts,
  activityFeed,
  isElectionClosed,
  onToggleElectionClosed,
  onResetElection,
}: QuickCountSectionProps) {
  const [committeeCode, setCommitteeCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const totalVotes =
    voteCounts['01'] +
    voteCounts['02'] +
    voteCounts['03'] +
    (voteCounts['04'] ?? 0);

  function handleUnlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (committeeCode.trim().toUpperCase() !== COMMITTEE_ACCESS_CODE) {
      setCodeError('Kode akses panitia tidak sesuai. Gunakan kode resmi PPO.');
      return;
    }
    setCodeError(null);
    setResetMessage(null);
    setCommitteeCode('');
    onToggleElectionClosed();
  }

  function handleConfirmReset() {
    onResetElection();
    setConfirmResetOpen(false);
    setCodeError(null);
    setCommitteeCode('');
    setResetMessage(
      'Pemilihan suara berhasil diulang. Seluruh suara dan daftar pemilih telah dikembalikan ke 0.'
    );
  }

  return (
    <section id="quick-count" className="py-section lg:py-section-lg bg-surface flex-1">
      <div className="max-w-[1200px] mx-auto px-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
          <div className="flex flex-col gap-xs max-w-prose">
            <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-on-surface text-balance">
              Live Quick Count
            </h2>
            <p className="text-body-lg text-muted text-pretty">
              Rekapitulasi perolehan suara per pasangan calon hanya dibuka oleh Panitia Pemilihan OSIS (PPO) setelah pemungutan suara berakhir.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-sm shrink-0 self-start md:self-auto">
            <div className="inline-flex items-center gap-sm bg-surface-subtle border border-border-hairline rounded-full px-3 py-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isElectionClosed ? 'bg-success' : 'bg-primary'
                }`}
                aria-hidden="true"
              />
              <span className="text-label-sm text-on-surface tabular-nums whitespace-nowrap">
                {isElectionClosed
                  ? 'Dibuka Panitia • Hasil Akhir Resmi'
                  : 'Terkunci • Menunggu Pemilihan Selesai'}
              </span>
            </div>

            {isElectionClosed && (
              <button
                type="button"
                onClick={onToggleElectionClosed}
                className="inline-flex items-center gap-1.5 rounded px-4 py-2 text-label-sm bg-surface border border-border-input text-on-surface hover:bg-surface-subtle transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kunci Kembali &amp; Buka Pemilihan</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setResetMessage(null);
                setConfirmResetOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 rounded px-4 py-2 text-label-sm bg-surface border border-error/40 text-error hover:bg-error/5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ulangi Pemilihan</span>
            </button>
          </div>
        </div>

        {confirmResetOpen && (
          <div className="mb-lg rounded-md border border-error/35 bg-error/5 p-md lg:p-lg flex flex-col sm:flex-row sm:items-center justify-between gap-md">
            <div className="flex items-start gap-sm">
              <ShieldAlert
                className="w-5 h-5 text-error shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-label-lg text-on-surface">
                  Konfirmasi Ulangi Pemilihan Suara
                </span>
                <p className="text-body-md text-muted">
                  Tindakan ini akan menghapus {totalVotes.toLocaleString('id-ID')} suara masuk serta riwayat pemilih sehingga pemilihan dimulai ulang dari 0.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-sm shrink-0">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="inline-flex items-center justify-center rounded border border-border-input bg-surface hover:bg-surface-subtle px-4 py-2 text-label-sm text-on-surface transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="inline-flex items-center justify-center gap-1.5 rounded bg-error hover:bg-error/90 px-4 py-2 text-label-sm text-on-error transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ya, Ulangi dari 0</span>
              </button>
            </div>
          </div>
        )}

        {resetMessage && (
          <div className="mb-lg rounded-md border border-success/35 bg-success/10 px-md py-3 flex items-center justify-between gap-sm text-body-md text-on-surface">
            <div className="flex items-center gap-sm">
              <CheckCircle2
                className="w-4 h-4 text-success shrink-0"
                aria-hidden="true"
              />
              <span>{resetMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setResetMessage(null)}
              className="text-label-sm text-muted hover:text-on-surface cursor-pointer whitespace-nowrap"
            >
              Tutup
            </button>
          </div>
        )}

        {!isElectionClosed ? (
          <motion.div
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.35, ease: EASE_OUT_EXPO}}
            className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-stretch"
          >
            {/* Committee Gate Card */}
            <div className="lg:col-span-7 bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col justify-between gap-lg">
              <div className="flex items-start gap-md">
                <div className="w-12 h-12 rounded-md bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-xs">
                  <h3 className="font-headline text-title-lg text-on-surface">
                    Perolehan Suara Per Paslon Terkunci
                  </h3>
                  <p className="text-body-md text-muted text-pretty">
                    Untuk menjaga asas bebas dan rahasia selama proses pemungutan suara, rincian perolehan suara seluruh pasangan calon tetap bernilai 0 dan hanya dapat dibuka oleh Panitia (PPO) setelah pemilihan selesai.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleUnlockSubmit}
                className="rounded-md bg-surface-canvas border border-border-hairline p-md lg:p-lg flex flex-col gap-md"
              >
                <div className="flex flex-col gap-xs">
                  <label
                    htmlFor="committee-code"
                    className="text-label-sm text-on-surface flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span>Kode Akses Panitia (PPO)</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-sm">
                    <input
                      id="committee-code"
                      type="password"
                      value={committeeCode}
                      onChange={(e) => {
                        setCommitteeCode(e.target.value);
                        if (codeError) setCodeError(null);
                      }}
                      placeholder="Masukkan kode akses panitia"
                      className="flex-1 rounded border border-border-input bg-surface px-3 py-2.5 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-sm bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-2.5 font-body text-label-lg shadow-[0_0_0_1px_#1D4ED8,0_4px_12px_rgba(29,78,216,0.18)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <CheckCircle2 className="w-[18px] h-[18px]" aria-hidden="true" />
                      <span>Akhiri Pemilihan &amp; Buka Hasil</span>
                    </button>
                  </div>
                  <span className="text-label-sm text-muted">
                    Khusus Panitia PPO setelah pemungutan suara selesai (Kode: PPO2026)
                  </span>
                </div>

                {codeError && (
                  <div className="flex items-center gap-xs text-body-md text-error font-medium">
                    <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{codeError}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Zeroed Summary Sidebar */}
            <div className="lg:col-span-5 flex flex-col gap-lg">
              <div className="bg-surface border border-border-hairline rounded-md p-lg shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex items-center justify-between gap-md">
                <div className="flex flex-col gap-xs">
                  <span className="text-label-sm text-muted uppercase">
                    Total Partisipasi Pemilih
                  </span>
                  <span className="font-headline text-headline-lg-mobile lg:text-headline-lg text-primary tabular-nums">
                    0 Siswa
                  </span>
                  <span className="text-body-md text-muted">
                    Jumlah voting dan total siswa ditetapkan setelah pemilihan ditutup oleh panitia
                  </span>
                </div>
                <div className="w-14 h-14 rounded-md bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                  <PieChart className="w-7 h-7" aria-hidden="true" />
                </div>
              </div>

              <div className="flex-1 bg-surface border border-border-hairline rounded-md p-lg shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-sm justify-center">
                <h3 className="text-title-md text-on-surface">
                  Status Kotak Suara Digital
                </h3>
                <p className="text-body-md text-muted text-pretty">
                  Setiap suara dari Bilik Suara Digital disimpan secara terenkripsi. Hasil per paslon akan dihitung dan ditampilkan setelah panitia membuka panel ini.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.35, ease: EASE_OUT_EXPO}}
            className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-stretch"
          >
            {/* Left: Horizontal Progress Bar Breakdown */}
            <div className="lg:col-span-7 bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col justify-between gap-lg">
              <h3 className="font-headline text-title-lg text-on-surface">
                Perolehan Suara Per Paslon
              </h3>

              <div className="flex flex-col gap-lg">
                {candidates.map((cand, idx) => {
                  const count = voteCounts[cand.id] ?? 0;
                  const pct =
                    totalVotes > 0
                      ? ((count / totalVotes) * 100).toFixed(1)
                      : '0.0';
                  const barClass =
                    idx === 0
                      ? 'bg-primary'
                      : idx === 1
                        ? 'bg-primary/70'
                        : idx === 2
                          ? 'bg-primary/45'
                          : 'bg-primary/25';

                  return (
                    <div key={cand.id} className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between gap-sm">
                        <span className="text-title-md text-on-surface">
                          {cand.id} — {cand.title}
                        </span>
                        <span
                          className={`text-label-lg tabular-nums shrink-0 ${
                            idx === 0 ? 'text-primary' : 'text-on-surface'
                          }`}
                        >
                          {count.toLocaleString('id-ID')} suara ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-surface-subtle rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-[width] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${barClass}`}
                          style={{width: `${pct}%`}}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-body-md text-muted pt-md border-t border-border-hairline">
                Hasil akhir resmi telah dihitung dari seluruh surat suara terenkripsi dan diaudit oleh Panitia Pemilihan OSIS.
              </p>
            </div>

            {/* Right: Turnout Card + Anonymized Activity Feed */}
            <div className="lg:col-span-5 flex flex-col gap-lg">
              <div className="bg-surface border border-border-hairline rounded-md p-lg shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex items-center justify-between gap-md">
                <div className="flex flex-col gap-xs">
                  <span className="text-label-sm text-muted uppercase">
                    Total Partisipasi Pemilih
                  </span>
                  <span className="font-headline text-headline-lg-mobile lg:text-headline-lg text-primary tabular-nums">
                    {totalVotes.toLocaleString('id-ID')} Siswa
                  </span>
                  <span className="text-body-md text-muted">
                    Total {totalVotes.toLocaleString('id-ID')} suara sah telah dihitung
                  </span>
                </div>
                <div className="w-14 h-14 rounded-md bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                  <PieChart className="w-7 h-7" aria-hidden="true" />
                </div>
              </div>

              <div className="flex-1 bg-surface border border-border-hairline rounded-md p-lg shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-md">
                <h3 className="text-title-md text-on-surface">
                  Aktivitas Masuk Teranonimkan
                </h3>
                <ul className="flex flex-col divide-y divide-border-hairline">
                  {activityFeed.length === 0 ? (
                    <li className="py-2.5 text-body-md text-muted">
                      Belum ada suara masuk.
                    </li>
                  ) : (
                    activityFeed.slice(0, 4).map((item) => (
                      <li
                        key={item.id}
                        className="py-2.5 flex items-center justify-between gap-sm"
                      >
                        <div className="flex items-center gap-sm min-w-0">
                          <span
                            className="w-2 h-2 rounded-full bg-success shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-body-md text-on-surface truncate">
                            Pemilih {item.className}
                          </span>
                        </div>
                        <span className="text-label-sm text-muted tabular-nums shrink-0">
                          {item.timeAgo}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
