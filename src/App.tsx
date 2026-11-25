import {useEffect, useState} from 'react';
import {AnimatePresence, motion, MotionConfig} from 'motion/react';
import {CandidateEditorSection} from './components/CandidateEditorSection';
import {CandidateGrid} from './components/CandidateGrid';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {HeroSection} from './components/HeroSection';
import {OpeningScreen} from './components/OpeningScreen';
import {QuickCountSection} from './components/QuickCountSection';
import {VisionMissionDashboard} from './components/VisionMissionDashboard';
import {VotingBooth} from './components/VotingBooth';
import {
  CANDIDATES,
  INITIAL_ACTIVITY_FEED,
  INITIAL_ELECTION_SCHEDULE,
  INITIAL_PORTAL_BRANDING,
  INITIAL_VOTE_COUNTS,
} from './data/electionData';
import type {
  ActivityItem,
  CandidatePair,
  DashboardId,
  ElectionSchedule,
  PaslonId,
  PortalBranding,
  VoteCounts,
  VoteReceipt,
} from './types/election';
import {deleteMediaBlobByUri} from './utils/mediaStorage';

const STORAGE_KEY = 'pilketos_2026_state_v3';
const INTRO_SEEN_KEY = 'pilketos_white_orbital_seen_v1';
const DASHBOARD_ORDER: DashboardId[] = [
  'beranda',
  'kandidat',
  'visi-misi',
  'bilik-suara',
  'quick-count',
  'kelola-paslon',
];
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PersistedState {
  candidates: CandidatePair[];
  schedule: ElectionSchedule;
  branding: PortalBranding;
  voteCounts: VoteCounts;
  usedNisns: string[];
  receiptsByNisn: Record<string, VoteReceipt>;
  activityFeed: ActivityItem[];
  isElectionClosed: boolean;
}

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.voteCounts && parsed.usedNisns && parsed.activityFeed) {
        const storedCandidates =
          Array.isArray(parsed.candidates) &&
          parsed.candidates.length === CANDIDATES.length
            ? parsed.candidates
            : CANDIDATES;
        return {
          candidates: storedCandidates,
          schedule: {
            ...INITIAL_ELECTION_SCHEDULE,
            ...(parsed.schedule ?? {}),
          },
          branding: {
            ...INITIAL_PORTAL_BRANDING,
            ...(parsed.branding ?? {}),
          },
          voteCounts: {...INITIAL_VOTE_COUNTS, ...parsed.voteCounts},
          usedNisns: parsed.usedNisns,
          receiptsByNisn: parsed.receiptsByNisn ?? {},
          activityFeed: parsed.activityFeed,
          isElectionClosed: Boolean(parsed.isElectionClosed),
        };
      }
    }
  } catch {
    // Ignore storage read errors and fall back to defaults
  }
  return {
    candidates: CANDIDATES,
    schedule: INITIAL_ELECTION_SCHEDULE,
    branding: INITIAL_PORTAL_BRANDING,
    voteCounts: INITIAL_VOTE_COUNTS,
    usedNisns: [],
    receiptsByNisn: {},
    activityFeed: INITIAL_ACTIVITY_FEED,
    isElectionClosed: false,
  };
}

function generateReceiptCode(): string {
  const num = Math.floor(10000 + Math.random() * 89999);
  return `PKT-REC-${num}`;
}

export default function App() {
  const [persisted, setPersisted] = useState<PersistedState>(() =>
    loadInitialState()
  );
  const [activeNisn, setActiveNisn] = useState<string>('');
  const [activeClass, setActiveClass] = useState<string>('Kelas X TJKT');
  const [selectedPaslon, setSelectedPaslon] = useState<PaslonId | null>(null);
  const [visionPaslonId, setVisionPaslonId] = useState<PaslonId>('01');
  const [showOpening, setShowOpening] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(INTRO_SEEN_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [activeDashboard, setActiveDashboard] =
    useState<DashboardId>('beranda');
  const [slideDirection, setSlideDirection] = useState<number>(1);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage write errors
    }
  }, [persisted]);

  function navigateToDashboard(sectionId: string, focusId?: string) {
    const targetDashboard: DashboardId = DASHBOARD_ORDER.includes(
      sectionId as DashboardId
    )
      ? (sectionId as DashboardId)
      : 'beranda';

    const currentIdx = DASHBOARD_ORDER.indexOf(activeDashboard);
    const nextIdx = DASHBOARD_ORDER.indexOf(targetDashboard);
    setSlideDirection(nextIdx >= currentIdx ? 1 : -1);
    setActiveDashboard(targetDashboard);

    window.scrollTo({top: 0, behavior: 'smooth'});

    if (focusId) {
      window.setTimeout(() => {
        const el = document.getElementById(focusId);
        if (el && 'focus' in el) {
          (el as HTMLElement).focus({preventScroll: true});
        }
      }, 280);
    }
  }

  const normalizedVoterKey = activeNisn.trim().toLowerCase();
  const currentReceipt =
    persisted.receiptsByNisn[normalizedVoterKey] ?? null;
  const isHeroVerified =
    activeNisn.trim().length >= 2 &&
    !persisted.usedNisns.includes(normalizedVoterKey);

  function handleSubmitVote(
    voterName: string,
    className: string,
    paslonId: PaslonId
  ) {
    const key = voterName.trim().toLowerCase();
    if (persisted.usedNisns.includes(key)) return;

    const receipt: VoteReceipt = {
      receiptCode: generateReceiptCode(),
      nisn: voterName,
      className,
      paslonId,
      castAt: new Date().toISOString(),
    };

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      className,
      timeAgo: 'Baru saja',
      timestamp: Date.now(),
    };

    setPersisted((prev) => ({
      ...prev,
      voteCounts: {
        ...prev.voteCounts,
        [paslonId]: prev.voteCounts[paslonId] + 1,
      },
      usedNisns: [...prev.usedNisns, key],
      receiptsByNisn: {
        ...prev.receiptsByNisn,
        [key]: receipt,
      },
      activityFeed: [newActivity, ...prev.activityFeed].slice(0, 10),
    }));
  }

  function handleSwitchVoter(nextVoter: string) {
    setActiveNisn(nextVoter);
    setSelectedPaslon(null);
  }

  function handleToggleElectionClosed() {
    setPersisted((prev) => ({
      ...prev,
      isElectionClosed: !prev.isElectionClosed,
    }));
  }

  function handleResetElection() {
    setSelectedPaslon(null);
    setPersisted((prev) => ({
      ...prev,
      voteCounts: {...INITIAL_VOTE_COUNTS},
      usedNisns: [],
      receiptsByNisn: {},
      activityFeed: [],
      isElectionClosed: false,
    }));
  }

  function handleSaveCandidate(updated: CandidatePair) {
    setPersisted((prev) => ({
      ...prev,
      candidates: prev.candidates.map((cand) =>
        cand.id === updated.id ? updated : cand
      ),
    }));
  }

  function handleResetCandidate(id: PaslonId) {
    const original = CANDIDATES.find((c) => c.id === id);
    if (!original) return;
    const current = persisted.candidates.find((c) => c.id === id);
    if (current?.videoUrl) {
      void deleteMediaBlobByUri(current.videoUrl);
    }
    if (current?.imageUrl && current.imageUrl !== original.imageUrl) {
      void deleteMediaBlobByUri(current.imageUrl);
    }
    setPersisted((prev) => ({
      ...prev,
      candidates: prev.candidates.map((cand) =>
        cand.id === id ? original : cand
      ),
    }));
  }

  function handleSaveSchedule(updated: ElectionSchedule) {
    setPersisted((prev) => ({
      ...prev,
      schedule: updated,
    }));
  }

  function handleResetSchedule() {
    setPersisted((prev) => ({
      ...prev,
      schedule: INITIAL_ELECTION_SCHEDULE,
    }));
  }

  function handleSaveBranding(updated: PortalBranding) {
    setPersisted((prev) => ({
      ...prev,
      branding: updated,
    }));
  }

  function handleResetBranding() {
    void deleteMediaBlobByUri(persisted.branding.schoolLogoUrl);
    void deleteMediaBlobByUri(persisted.branding.osisLogoUrl);
    setPersisted((prev) => ({
      ...prev,
      branding: INITIAL_PORTAL_BRANDING,
    }));
  }

  function handleEnterFromOpening(target: DashboardId = 'beranda') {
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Ignore storage write errors
    }
    setActiveDashboard(target);
    setSlideDirection(1);
    setShowOpening(false);
    window.scrollTo({top: 0, behavior: 'auto'});
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {showOpening ? (
          <OpeningScreen
            key="opening"
            branding={persisted.branding}
            onEnterPortal={(target) => handleEnterFromOpening(target)}
          />
        ) : (
          <motion.div
            key="portal"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.35, ease: EASE_OUT_EXPO}}
            className="min-h-screen flex flex-col bg-surface-canvas text-on-surface font-body antialiased"
          >
        <Header
          activeSection={activeDashboard}
          branding={persisted.branding}
          onNavigateSection={(id) => navigateToDashboard(id)}
        />

        <main className="flex-1 flex flex-col overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeDashboard}
              initial={{opacity: 0, x: slideDirection * 24}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: slideDirection * -24}}
              transition={{duration: 0.24, ease: EASE_OUT_EXPO}}
              className="flex-1 flex flex-col"
            >
              {activeDashboard === 'beranda' && (
                <HeroSection
                  candidates={persisted.candidates}
                  activeNisn={activeNisn}
                  isVerified={isHeroVerified || currentReceipt !== null}
                  selectedPaslon={currentReceipt?.paslonId ?? selectedPaslon}
                  voteCounts={persisted.voteCounts}
                  receipts={Object.values(persisted.receiptsByNisn)}
                  isElectionClosed={persisted.isElectionClosed}
                  onSelectPaslon={(id) => {
                    if (!persisted.isElectionClosed && !currentReceipt) {
                      setSelectedPaslon(id);
                    }
                  }}
                  onNavigateSection={(id, focusId) =>
                    navigateToDashboard(id, focusId)
                  }
                />
              )}

              {activeDashboard === 'kandidat' && (
                <CandidateGrid
                  candidates={persisted.candidates}
                  onOpenVision={(cand) => {
                    setVisionPaslonId(cand.id);
                    navigateToDashboard('visi-misi');
                  }}
                />
              )}

              {activeDashboard === 'visi-misi' && (
                <VisionMissionDashboard
                  candidates={persisted.candidates}
                  activePaslonId={visionPaslonId}
                  onSelectCandidateTab={setVisionPaslonId}
                  onBackToCandidates={() => navigateToDashboard('kandidat')}
                  onVoteForCandidate={(id) => {
                    if (!persisted.isElectionClosed && !currentReceipt) {
                      setSelectedPaslon(id);
                    }
                    navigateToDashboard('bilik-suara');
                  }}
                  isElectionClosed={persisted.isElectionClosed}
                  hasVoted={currentReceipt !== null}
                />
              )}

              {activeDashboard === 'bilik-suara' && (
                <VotingBooth
                  candidates={persisted.candidates}
                  activeNisn={activeNisn}
                  onNisnChange={setActiveNisn}
                  activeClass={activeClass}
                  onClassChange={setActiveClass}
                  selectedPaslon={currentReceipt?.paslonId ?? selectedPaslon}
                  onSelectPaslon={setSelectedPaslon}
                  usedNisns={persisted.usedNisns}
                  currentReceipt={currentReceipt}
                  isElectionClosed={persisted.isElectionClosed}
                  onSubmitVote={handleSubmitVote}
                  onSwitchVoter={handleSwitchVoter}
                />
              )}

              {activeDashboard === 'quick-count' && (
                <QuickCountSection
                  candidates={persisted.candidates}
                  voteCounts={persisted.voteCounts}
                  activityFeed={persisted.activityFeed}
                  isElectionClosed={persisted.isElectionClosed}
                  onToggleElectionClosed={handleToggleElectionClosed}
                  onResetElection={handleResetElection}
                />
              )}

              {activeDashboard === 'kelola-paslon' && (
                <CandidateEditorSection
                  candidates={persisted.candidates}
                  schedule={persisted.schedule}
                  branding={persisted.branding}
                  onSaveCandidate={handleSaveCandidate}
                  onResetCandidate={handleResetCandidate}
                  onSaveSchedule={handleSaveSchedule}
                  onResetSchedule={handleResetSchedule}
                  onSaveBranding={handleSaveBranding}
                  onResetBranding={handleResetBranding}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

            <Footer
              schedule={persisted.schedule}
              onNavigateSection={(id) => navigateToDashboard(id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
