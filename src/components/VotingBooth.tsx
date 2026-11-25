import {useEffect, useRef, useState} from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Copy,
  RotateCcw,
  ShieldCheck,
  Vote,
} from 'lucide-react';
import {motion} from 'motion/react';
import {CLASS_GROUPS} from '../data/electionData';
import type {CandidatePair, PaslonId, VoteReceipt} from '../types/election';

interface VotingBoothProps {
  candidates: CandidatePair[];
  activeNisn: string;
  onNisnChange: (nisn: string) => void;
  activeClass: string;
  onClassChange: (className: string) => void;
  selectedPaslon: PaslonId | null;
  onSelectPaslon: (id: PaslonId) => void;
  usedNisns: string[];
  currentReceipt: VoteReceipt | null;
  isElectionClosed: boolean;
  onSubmitVote: (nisn: string, className: string, paslonId: PaslonId) => void;
  onSwitchVoter: (nextNisn: string) => void;
}

export function VotingBooth({
  candidates,
  activeNisn,
  onNisnChange,
  activeClass,
  onClassChange,
  selectedPaslon,
  onSelectPaslon,
  usedNisns,
  currentReceipt,
  isElectionClosed,
  onSubmitVote,
  onSwitchVoter,
}: VotingBoothProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number>(4);
  const onSwitchVoterRef = useRef(onSwitchVoter);
  onSwitchVoterRef.current = onSwitchVoter;

  const receiptCode = currentReceipt?.receiptCode ?? null;

  useEffect(() => {
    if (!receiptCode) {
      setCountdown(4);
      return;
    }

    setCountdown(4);
    const intervalId = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [receiptCode]);

  useEffect(() => {
    if (receiptCode && countdown === 0) {
      setErrorMsg(null);
      onSwitchVoterRef.current('');
    }
  }, [receiptCode, countdown]);

  const trimmedName = activeNisn.trim();
  const normalizedKey = trimmedName.toLowerCase();
  const isNameValid = trimmedName.length >= 2;
  const alreadyVoted = isNameValid && usedNisns.includes(normalizedKey);
  const hasVotedWithActiveNisn =
    isElectionClosed || currentReceipt !== null || alreadyVoted;

  function handleVoteClick() {
    if (hasVotedWithActiveNisn) return;

    if (!isNameValid) {
      setErrorMsg('Masukkan nama peserta yang valid sebelum mengirim suara.');
      return;
    }

    if (!selectedPaslon) {
      setErrorMsg('Pilih salah satu pasangan calon sebelum mengirim suara.');
      return;
    }

    setErrorMsg(null);
    onSubmitVote(trimmedName, activeClass, selectedPaslon);
  }

  function handleCopyReceipt() {
    if (!currentReceipt) return;
    navigator.clipboard?.writeText(currentReceipt.receiptCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleDemoSwitch() {
    setErrorMsg(null);
    onSwitchVoter('');
  }

  return (
    <section
      id="bilik-suara"
      className="py-section lg:py-section-lg border-b border-border-hairline bg-surface-canvas flex-1"
    >
      <div className="max-w-[1200px] mx-auto px-lg">
        <div className="flex flex-col items-center text-center gap-xs mb-xl max-w-prose mx-auto">
          <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-on-surface text-balance">
            Bilik Suara Digital
          </h2>
          <p className="text-body-lg text-muted text-pretty">
            Pilih pasangan calon Ketua dan Wakil OSIS pilihan Anda secara langsung dan rahasia.
          </p>
        </div>

        <motion.div
          initial={{opacity: 0, y: 14}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.36, ease: [0.16, 1, 0.3, 1]}}
          className="w-full max-w-3xl mx-auto bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-hairline pb-md gap-md">
            <div>
              <h3 className="font-headline text-title-lg text-on-surface">
                Pilih Pasangan Calon
              </h3>
              <p className="text-body-md text-muted">
                Klik salah satu kartu kandidat untuk menandai surat suara
              </p>
            </div>
            <span className="text-label-sm text-muted shrink-0">1 Pilihan</span>
          </div>

          {/* Voter Identity Verification Strip */}
          <div className="rounded-md bg-surface-canvas border border-border-hairline p-md flex flex-col sm:flex-row sm:items-end justify-between gap-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md flex-1">
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="voter-name"
                  className="text-label-sm text-on-surface"
                >
                  Nama Peserta
                </label>
                <input
                  id="voter-name"
                  type="text"
                  maxLength={80}
                  value={activeNisn}
                  disabled={hasVotedWithActiveNisn}
                  onChange={(e) => {
                    onNisnChange(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-surface-subtle disabled:text-muted"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="voter-class"
                  className="text-label-sm text-on-surface"
                >
                  Kelas Pemilih
                </label>
                <select
                  id="voter-class"
                  value={activeClass}
                  disabled={hasVotedWithActiveNisn}
                  onChange={(e) => onClassChange(e.target.value)}
                  className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-surface-subtle disabled:text-muted"
                >
                  {CLASS_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-xs shrink-0 pb-1">
              <ShieldCheck
                className={`w-4 h-4 ${
                  isNameValid && !alreadyVoted
                    ? 'text-success'
                    : 'text-muted'
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-label-sm ${
                  isNameValid && !alreadyVoted
                    ? 'text-success'
                    : 'text-muted'
                }`}
              >
                {alreadyVoted
                  ? 'Sudah Memilih'
                  : isNameValid
                    ? 'Peserta Valid'
                    : 'Isi Nama Peserta'}
              </span>
            </div>
          </div>

          {/* Radio Ballot Options */}
          <div
            role="radiogroup"
            aria-label="Pilihan Pasangan Calon Ketua OSIS"
            className="flex flex-col gap-md"
          >
            {candidates.map((candidate) => {
              const isSelected = selectedPaslon === candidate.id;
              return (
                <label
                  key={candidate.id}
                  className={`rounded-md p-md flex items-center justify-between gap-md transition-[background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    hasVotedWithActiveNisn
                      ? 'cursor-not-allowed opacity-85'
                      : 'cursor-pointer'
                  } ${
                    isSelected
                      ? 'bg-primary-tint border-2 border-primary'
                      : 'bg-surface border border-border-hairline hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center gap-md min-w-0">
                    <input
                      type="radio"
                      name="paslon"
                      value={candidate.id}
                      checked={isSelected}
                      disabled={hasVotedWithActiveNisn}
                      onChange={() => {
                        if (hasVotedWithActiveNisn) return;
                        onSelectPaslon(candidate.id);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="sr-only"
                    />
                    <span className="w-10 h-10 rounded bg-primary-tint text-on-primary-tint font-headline text-title-md flex items-center justify-center shrink-0 tabular-nums">
                      {candidate.id}
                    </span>
                    <div className="min-w-0">
                      <p className="text-title-md text-on-surface truncate">
                        {candidate.title}
                      </p>
                      <p className="text-body-md text-muted truncate">
                        {candidate.tagline}
                      </p>
                    </div>
                  </div>
                  {isSelected ? (
                    <CheckCircle2
                      className="w-6 h-6 text-primary shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="w-6 h-6 text-border-input shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </label>
              );
            })}
          </div>

          {/* Confirmation Action */}
          <div className="pt-sm flex flex-col sm:flex-row sm:items-center justify-between gap-md border-t border-border-hairline">
            <p
              className={`text-body-md text-pretty ${
                errorMsg ? 'text-error font-medium' : 'text-muted'
              }`}
            >
              {errorMsg
                ? errorMsg
                : isElectionClosed
                  ? 'Pemilihan telah berakhir. Lihat hasil akhir di bagian Live Quick Count.'
                  : hasVotedWithActiveNisn
                    ? 'Suara Anda telah terkunci dan tercatat.'
                    : 'Periksa pilihan Anda sebelum mengirim suara.'}
            </p>

            <button
              type="button"
              disabled={hasVotedWithActiveNisn}
              onClick={handleVoteClick}
              className="inline-flex items-center justify-center gap-sm bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-3 font-body text-label-lg shadow-[0_0_0_1px_#1D4ED8,0_4px_12px_rgba(29,78,216,0.18)] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Vote className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>Kirim Suara Resmi</span>
            </button>
          </div>

          {/* Vote Receipt */}
          {currentReceipt && (
            <div className="rounded-md bg-success/10 border border-success/30 p-md flex flex-col sm:flex-row sm:items-center justify-between gap-md">
              <div className="flex items-start gap-sm">
                <CheckCircle2
                  className="w-[22px] h-[22px] text-success shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-title-md text-on-surface">
                    Suara Anda Berhasil Dicatat
                  </p>
                  <p className="text-body-md text-muted tabular-nums">
                    Kode Resi Enkripsi: {currentReceipt.receiptCode} • Pilihan Anda untuk Paslon {currentReceipt.paslonId} ({currentReceipt.className}) telah tercatat.
                  </p>
                  <p className="text-label-sm text-success mt-1 tabular-nums">
                    Otomatis refresh untuk pemilih berikutnya dalam {countdown} detik...
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-sm shrink-0">
                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="inline-flex items-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-3 py-1.5 text-label-sm text-on-surface transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Salin Resi</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDemoSwitch}
                  className="inline-flex items-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-3 py-1.5 text-label-sm text-primary transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pemilih Baru</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
