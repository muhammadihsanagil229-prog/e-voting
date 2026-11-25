import {useEffect} from 'react';
import {X} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import type {CandidatePair, PaslonId} from '../types/election';

interface VisionModalProps {
  candidate: CandidatePair | null;
  onClose: () => void;
  onSelectForVoting: (id: PaslonId) => void;
  onNavigateSection: (sectionId: string) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function VisionModal({
  candidate,
  onClose,
  onSelectForVoting,
  onNavigateSection,
}: VisionModalProps) {
  useEffect(() => {
    if (!candidate) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidate, onClose]);

  return (
    <AnimatePresence>
      {candidate && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 bg-on-surface/50 flex items-center justify-center p-md"
        >
          <motion.div
            initial={{opacity: 0, y: 16, scale: 0.97}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 12, scale: 0.98}}
            transition={{duration: 0.24, ease: EASE_OUT_EXPO}}
            className="bg-surface border border-border-hairline rounded-md max-w-lg w-full p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.16)] flex flex-col gap-md"
          >
            <div className="flex items-start justify-between gap-md border-b border-border-hairline pb-md">
              <div>
                <span className="inline-flex items-center rounded-full bg-primary-tint text-on-primary-tint px-3 py-0.5 text-label-sm mb-xs">
                  {candidate.badge}
                </span>
                <h3
                  id="modal-title"
                  className="font-headline text-headline-md text-on-surface"
                >
                  {candidate.title}
                </h3>
                <p className="text-label-sm text-muted mt-0.5">
                  {candidate.classes}
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup dialog"
                onClick={onClose}
                className="inline-flex items-center justify-center w-10 h-10 bg-surface hover:bg-surface-subtle text-on-surface border border-border-hairline rounded transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-md">
              <div>
                <h4 className="text-label-lg text-primary mb-xs">Visi Utama</h4>
                <p className="text-body-md text-on-surface text-pretty">
                  {candidate.vision}
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-primary mb-xs">
                  Misi Program Kerja
                </h4>
                <ul className="list-disc pl-5 flex flex-col gap-xs text-body-md text-muted">
                  {candidate.missions.map((mission, idx) => (
                    <li key={idx}>{mission}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-md border-t border-border-hairline flex justify-end">
              <a
                href="#bilik-suara"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectForVoting(candidate.id);
                  onClose();
                  onNavigateSection('bilik-suara');
                }}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-2.5 font-body text-label-lg transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Pilih di Bilik Suara
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
