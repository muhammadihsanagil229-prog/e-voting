import {useEffect, useState} from 'react';
import {
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  KeyRound,
  Lock,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  Sparkles,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import {motion} from 'motion/react';
import type {
  CandidatePair,
  ElectionSchedule,
  PaslonId,
  PortalBranding,
} from '../types/election';
import {
  deleteMediaBlobByUri,
  formatDurationLabel,
  readVideoDurationSeconds,
  saveMediaBlob,
  useResolvedMediaUrl,
} from '../utils/mediaStorage';
import {CandidateMedia} from './CandidateMedia';

interface CandidateEditorSectionProps {
  candidates: CandidatePair[];
  schedule: ElectionSchedule;
  branding: PortalBranding;
  onSaveCandidate: (updated: CandidatePair) => void;
  onResetCandidate: (id: PaslonId) => void;
  onSaveSchedule: (updated: ElectionSchedule) => void;
  onResetSchedule: () => void;
  onSaveBranding: (updated: PortalBranding) => void;
  onResetBranding: () => void;
}

const COMMITTEE_ACCESS_CODE = 'PPO2026';
const MAX_VIDEO_DURATION_SECONDS = 600; // 10 menit
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CandidateEditorSection({
  candidates,
  schedule,
  branding,
  onSaveCandidate,
  onResetCandidate,
  onSaveSchedule,
  onResetSchedule,
  onSaveBranding,
  onResetBranding,
}: CandidateEditorSectionProps) {
  const [selectedId, setSelectedId] = useState<PaslonId>('01');
  const activeCandidate =
    candidates.find((c) => c.id === selectedId) ?? candidates[0];

  const [title, setTitle] = useState(activeCandidate.title);
  const [shortName, setShortName] = useState(activeCandidate.shortName);
  const [classes, setClasses] = useState(activeCandidate.classes);
  const [tagline, setTagline] = useState(activeCandidate.tagline);
  const [summary, setSummary] = useState(activeCandidate.summary);
  const [vision, setVision] = useState(activeCandidate.vision);
  const [missions, setMissions] = useState<string[]>(activeCandidate.missions);
  const [imageUrl, setImageUrl] = useState(activeCandidate.imageUrl);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(
    activeCandidate.mediaType ?? 'image'
  );
  const [videoUrl, setVideoUrl] = useState(activeCandidate.videoUrl ?? '');
  const [videoDurationSec, setVideoDurationSec] = useState<number | undefined>(
    activeCandidate.videoDurationSec
  );
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState<string | null>(null);

  const [scheduleTitle, setScheduleTitle] = useState(schedule.title);
  const [scheduleDate, setScheduleDate] = useState(schedule.dateLabel);
  const [scheduleTime, setScheduleTime] = useState(schedule.timeLabel);
  const [scheduleNote, setScheduleNote] = useState(schedule.note);
  const [scheduleFeedback, setScheduleFeedback] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [schoolLogoUrl, setSchoolLogoUrl] = useState(branding.schoolLogoUrl);
  const [osisLogoUrl, setOsisLogoUrl] = useState(branding.osisLogoUrl);
  const [portalTitle, setPortalTitle] = useState(branding.portalTitle);
  const [schoolName, setSchoolName] = useState(branding.schoolName);
  const [brandingFeedback, setBrandingFeedback] = useState<string | null>(null);
  const [brandingError, setBrandingError] = useState<string | null>(null);

  const previewSchoolLogo = useResolvedMediaUrl(schoolLogoUrl);
  const previewOsisLogo = useResolvedMediaUrl(osisLogoUrl);

  useEffect(() => {
    setTitle(activeCandidate.title);
    setShortName(activeCandidate.shortName);
    setClasses(activeCandidate.classes);
    setTagline(activeCandidate.tagline);
    setSummary(activeCandidate.summary);
    setVision(activeCandidate.vision);
    setMissions(activeCandidate.missions);
    setImageUrl(activeCandidate.imageUrl);
    setMediaType(activeCandidate.mediaType ?? 'image');
    setVideoUrl(activeCandidate.videoUrl ?? '');
    setVideoDurationSec(activeCandidate.videoDurationSec);
    setVideoError(null);
    setErrorMsg(null);
  }, [activeCandidate]);

  useEffect(() => {
    setScheduleTitle(schedule.title);
    setScheduleDate(schedule.dateLabel);
    setScheduleTime(schedule.timeLabel);
    setScheduleNote(schedule.note);
    setScheduleError(null);
  }, [schedule]);

  useEffect(() => {
    setSchoolLogoUrl(branding.schoolLogoUrl);
    setOsisLogoUrl(branding.osisLogoUrl);
    setPortalTitle(branding.portalTitle);
    setSchoolName(branding.schoolName);
    setBrandingError(null);
  }, [branding]);

  function handleMissionChange(index: number, value: string) {
    setMissions((prev) => prev.map((m, i) => (i === index ? value : m)));
    if (feedback) setFeedback(null);
  }

  function handleAddMission() {
    setMissions((prev) => [...prev, '']);
    if (feedback) setFeedback(null);
  }

  function handleRemoveMission(index: number) {
    if (missions.length <= 1) return;
    setMissions((prev) => prev.filter((_, i) => i !== index));
    if (feedback) setFeedback(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uri = await saveMediaBlob(
        `paslon-image-${activeCandidate.id}-${Date.now()}`,
        file
      );
      if (imageUrl !== activeCandidate.imageUrl) {
        await deleteMediaBlobByUri(imageUrl);
      }
      setImageUrl(uri);
      setMediaType('image');
      setFeedback(null);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          setMediaType('image');
          setFeedback(null);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoError(null);
    setUploadingVideo(true);

    try {
      const duration = await readVideoDurationSeconds(file);
      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        setVideoError(
          `Durasi video (${formatDurationLabel(duration)}) melebihi batas maksimal 10 menit (10:00). Pilih video yang lebih singkat.`
        );
        return;
      }

      const uri = await saveMediaBlob(
        `paslon-video-${activeCandidate.id}-${Date.now()}`,
        file
      );
      if (videoUrl && videoUrl !== activeCandidate.videoUrl) {
        await deleteMediaBlobByUri(videoUrl);
      }
      setVideoUrl(uri);
      setVideoDurationSec(duration);
      setMediaType('video');
      setFeedback(null);
    } catch (err) {
      setVideoError(
        err instanceof Error
          ? err.message
          : 'Gagal memproses file video. Pastikan format MP4/WebM didukung.'
      );
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  }

  async function handleRemoveVideo() {
    if (videoUrl && videoUrl !== activeCandidate.videoUrl) {
      await deleteMediaBlobByUri(videoUrl);
    }
    setVideoUrl('');
    setVideoDurationSec(undefined);
    setMediaType('image');
    setVideoError(null);
    setFeedback(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanShort =
      shortName.trim() || cleanTitle.split(/\s+/)[0] || activeCandidate.shortName;
    const cleanVision = vision.trim();
    const cleanMissions = missions.map((m) => m.trim()).filter(Boolean);
    const cleanVideoUrl = videoUrl.trim();

    if (cleanTitle.length < 2) {
      setErrorMsg('Nama pasangan calon wajib diisi.');
      return;
    }
    if (cleanVision.length < 5) {
      setErrorMsg('Visi utama wajib diisi.');
      return;
    }
    if (cleanMissions.length === 0) {
      setErrorMsg('Minimal harus ada 1 misi program kerja.');
      return;
    }
    if (mediaType === 'video' && !cleanVideoUrl) {
      setErrorMsg('Upload video atau isi URL video terlebih dahulu sebelum menyimpan mode video.');
      return;
    }

    setErrorMsg(null);
    onSaveCandidate({
      ...activeCandidate,
      title: cleanTitle,
      shortName: cleanShort,
      classes: classes.trim() || activeCandidate.classes,
      tagline: tagline.trim() || activeCandidate.tagline,
      summary: summary.trim() || cleanVision,
      vision: cleanVision,
      missions: cleanMissions,
      imageUrl: imageUrl.trim() || activeCandidate.imageUrl,
      imageAlt: `Pasangan Calon ${activeCandidate.id} ${cleanTitle}`,
      mediaType: cleanVideoUrl ? mediaType : 'image',
      videoUrl: cleanVideoUrl || undefined,
      videoDurationSec: cleanVideoUrl ? videoDurationSec : undefined,
    });
    setFeedback(
      `Data ${activeCandidate.badge} berhasil disimpan dan diperbarui di seluruh dashboard.`
    );
  }

  function handleReset() {
    onResetCandidate(activeCandidate.id);
    setErrorMsg(null);
    setVideoError(null);
    setFeedback(`Data ${activeCandidate.badge} dikembalikan ke pengaturan awal.`);
  }

  function handleSaveScheduleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanTitle = scheduleTitle.trim();
    const cleanDate = scheduleDate.trim();
    const cleanTime = scheduleTime.trim();
    const cleanNote = scheduleNote.trim();

    if (cleanTitle.length < 2 || cleanDate.length < 2 || cleanTime.length < 2) {
      setScheduleError('Judul, tanggal, dan jam pemungutan suara wajib diisi.');
      return;
    }

    setScheduleError(null);
    onSaveSchedule({
      title: cleanTitle,
      dateLabel: cleanDate,
      timeLabel: cleanTime,
      note: cleanNote || schedule.note,
    });
    setScheduleFeedback(
      'Jadwal pemungutan suara berhasil disimpan dan langsung diperbarui di footer.'
    );
  }

  function handleResetScheduleClick() {
    onResetSchedule();
    setScheduleError(null);
    setScheduleFeedback('Jadwal pemungutan suara dikembalikan ke pengaturan awal.');
  }

  async function handleLogoUpload(
    target: 'school' | 'osis',
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBrandingError(null);
    try {
      const uri = await saveMediaBlob(
        `brand-${target}-logo-${Date.now()}`,
        file
      );
      if (target === 'school') {
        if (schoolLogoUrl !== branding.schoolLogoUrl) {
          await deleteMediaBlobByUri(schoolLogoUrl);
        }
        setSchoolLogoUrl(uri);
      } else {
        if (osisLogoUrl !== branding.osisLogoUrl) {
          await deleteMediaBlobByUri(osisLogoUrl);
        }
        setOsisLogoUrl(uri);
      }
      setBrandingFeedback(null);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (target === 'school') setSchoolLogoUrl(reader.result);
          else setOsisLogoUrl(reader.result);
          setBrandingFeedback(null);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  function handleSaveBrandingSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPortalTitle = portalTitle.trim();
    const cleanSchoolName = schoolName.trim();

    if (cleanPortalTitle.length < 2 || cleanSchoolName.length < 2) {
      setBrandingError('Judul portal dan nama sekolah wajib diisi.');
      return;
    }

    setBrandingError(null);
    onSaveBranding({
      schoolLogoUrl: schoolLogoUrl.trim() || branding.schoolLogoUrl,
      osisLogoUrl: osisLogoUrl.trim() || branding.osisLogoUrl,
      portalTitle: cleanPortalTitle,
      schoolName: cleanSchoolName,
    });
    setBrandingFeedback(
      'Logo dan identitas portal berhasil diperbarui di seluruh website.'
    );
  }

  function handleResetBrandingClick() {
    onResetBranding();
    setBrandingError(null);
    setBrandingFeedback('Logo dan identitas portal dikembalikan ke pengaturan awal.');
  }

  function handleUnlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (accessCode.trim().toUpperCase() !== COMMITTEE_ACCESS_CODE) {
      setAccessError(
        'Kode akses panitia tidak sesuai. Gunakan kode resmi PPO.'
      );
      return;
    }
    setAccessError(null);
    setAccessCode('');
    setIsUnlocked(true);
  }

  return (
    <section
      id="kelola-paslon"
      className="py-section lg:py-section-lg border-t border-border-hairline bg-surface-canvas flex-1"
    >
      <div className="max-w-[1200px] mx-auto px-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
          <div className="flex flex-col gap-xs max-w-prose">
            <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-on-surface text-balance">
              Kelola Paslon &amp; Visi Misi
            </h2>
            <p className="text-body-lg text-muted text-pretty">
              Edit nama pasangan calon, jurusan, visi utama, misi program kerja, dan jadwal pemilihan. Perubahan langsung tersinkron ke seluruh dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-sm shrink-0 self-start md:self-auto">
            <div className="inline-flex items-center gap-sm bg-surface border border-border-hairline rounded-full px-3 py-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isUnlocked ? 'bg-success' : 'bg-primary'
                }`}
                aria-hidden="true"
              />
              <span className="text-label-sm text-on-surface whitespace-nowrap">
                {isUnlocked
                  ? 'Terbuka • Dashboard Panitia OSIS'
                  : 'Terkunci • Akses Khusus Panitia'}
              </span>
            </div>

            {isUnlocked && (
              <button
                type="button"
                onClick={() => {
                  setIsUnlocked(false);
                  setAccessCode('');
                  setAccessError(null);
                }}
                className="inline-flex items-center gap-1.5 rounded px-4 py-2 text-label-sm bg-surface border border-border-input text-on-surface hover:bg-surface-subtle transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kunci Kembali</span>
              </button>
            )}
          </div>
        </div>

        {!isUnlocked ? (
          <motion.div
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.35, ease: EASE_OUT_EXPO}}
            className="max-w-2xl mx-auto bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-lg"
          >
            <div className="flex items-start gap-md">
              <div className="w-12 h-12 rounded-md bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-xs">
                <h3 className="font-headline text-title-lg text-on-surface">
                  Dashboard Kelola Paslon Terkunci
                </h3>
                <p className="text-body-md text-muted text-pretty">
                  Untuk menjaga integritas data pasangan calon serta jadwal resmi pemungutan suara, pengaturan hanya dapat diakses oleh Panitia Pemilihan OSIS (PPO) menggunakan kata sandi akses.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleUnlockSubmit}
              className="rounded-md bg-surface-canvas border border-border-hairline p-md lg:p-lg flex flex-col gap-md"
            >
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="editor-committee-code"
                  className="text-label-sm text-on-surface flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span>Kode Akses Panitia (PPO)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-sm">
                  <input
                    id="editor-committee-code"
                    type="password"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (accessError) setAccessError(null);
                    }}
                    placeholder="Masukkan kata sandi akses panitia"
                    className="flex-1 rounded border border-border-input bg-surface px-3 py-2.5 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-sm bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-2.5 font-body text-label-lg shadow-[0_0_0_1px_#1D4ED8,0_4px_12px_rgba(29,78,216,0.18)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <CheckCircle2 className="w-[18px] h-[18px]" aria-hidden="true" />
                    <span>Buka Kelola Paslon</span>
                  </button>
                </div>
                <span className="text-label-sm text-muted">
                  Khusus Panitia PPO SMKS BM AL IKHLAS (Kode: PPO2026)
                </span>
              </div>

              {accessError && (
                <div className="flex items-center gap-xs text-body-md text-error font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{accessError}</span>
                </div>
              )}
            </form>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.36, ease: EASE_OUT_EXPO}}
              className="bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-lg"
            >
          {/* Paslon Selector Tabs */}
          <div
            role="tablist"
            aria-label="Pilih Paslon untuk Diedit"
            className="grid grid-cols-2 sm:grid-cols-4 gap-xs p-1 bg-surface-subtle rounded-md border border-border-hairline"
          >
            {candidates.map((cand) => {
              const isActive = cand.id === activeCandidate.id;
              return (
                <button
                  key={cand.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSelectedId(cand.id);
                    setFeedback(null);
                  }}
                  className={`px-3 py-2 rounded text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? 'bg-surface text-primary shadow-sm border border-border-hairline'
                      : 'text-muted hover:text-on-surface'
                  }`}
                >
                  <span className="block text-label-sm tabular-nums">
                    {cand.badge}
                  </span>
                  <span className="block text-label-lg truncate">
                    {cand.shortName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Left: Photo/Video Preview & Identity Fields */}
            <div className="lg:col-span-5 flex flex-col gap-md">
              <div className="overflow-hidden rounded border border-border-hairline bg-surface-canvas">
                <CandidateMedia
                  imageUrl={imageUrl}
                  imageAlt={`Pratinjau ${title}`}
                  fallbackLabel={title}
                  mediaType={mediaType}
                  videoUrl={videoUrl || undefined}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {/* Media Mode Switcher: Foto vs Video (Max 10 Menit) */}
              <div className="rounded border border-border-hairline bg-surface-canvas p-sm flex flex-col gap-sm">
                <div className="flex items-center justify-between gap-sm">
                  <span className="text-label-sm text-on-surface">
                    Media Tampilan Kandidat
                  </span>
                  {videoDurationSec && videoUrl && (
                    <span className="text-label-sm text-primary tabular-nums">
                      Durasi: {formatDurationLabel(videoDurationSec)} / 10:00
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-xs p-1 bg-surface rounded border border-border-hairline">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('image');
                      if (feedback) setFeedback(null);
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-label-sm transition-colors cursor-pointer ${
                      mediaType === 'image'
                        ? 'bg-primary text-on-primary'
                        : 'text-muted hover:text-on-surface'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('video');
                      if (feedback) setFeedback(null);
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-label-sm transition-colors cursor-pointer ${
                      mediaType === 'video'
                        ? 'bg-primary text-on-primary'
                        : 'text-muted hover:text-on-surface'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Video (Maks. 10m)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
                  <label className="inline-flex items-center justify-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-3 py-2 text-label-sm text-on-surface cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Ganti Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>

                  <label className="inline-flex items-center justify-center gap-1.5 rounded border border-primary/35 bg-primary-tint hover:bg-primary/15 px-3 py-2 text-label-sm text-primary cursor-pointer transition-colors">
                    <Video className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>
                      {uploadingVideo ? 'Memeriksa...' : 'Upload Video'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      disabled={uploadingVideo}
                      onChange={handleVideoUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                {mediaType === 'video' && (
                  <div className="flex flex-col gap-xs pt-xs border-t border-border-hairline">
                    <label
                      htmlFor="edit-paslon-video-url"
                      className="text-label-sm text-muted"
                    >
                      Atau tempel URL Video langsung (MP4 / WebM)
                    </label>
                    <div className="flex items-center gap-xs">
                      <input
                        id="edit-paslon-video-url"
                        type="url"
                        value={videoUrl.startsWith('idb:') ? '' : videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value);
                          setVideoDurationSec(undefined);
                          setVideoError(null);
                          if (feedback) setFeedback(null);
                        }}
                        placeholder={
                          videoUrl.startsWith('idb:')
                            ? 'Video tersimpan dari perangkat (maks. 10 menit)'
                            : 'https://.../video-kampanye.mp4'
                        }
                        className="flex-1 rounded border border-border-input bg-surface px-2.5 py-1.5 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      {videoUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          aria-label="Hapus video paslon"
                          className="inline-flex items-center justify-center px-2.5 py-1.5 rounded border border-border-hairline text-error hover:bg-error/5 text-label-sm cursor-pointer shrink-0"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {videoError && (
                  <p className="text-label-sm text-error font-medium">
                    {videoError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="edit-paslon-title"
                  className="text-label-sm text-on-surface"
                >
                  Nama Pasangan Calon
                </label>
                <input
                  id="edit-paslon-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (feedback) setFeedback(null);
                  }}
                  placeholder="Contoh: Raka Pratama & Nadia Kusuma"
                  className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label
                    htmlFor="edit-paslon-short"
                    className="text-label-sm text-on-surface"
                  >
                    Nama Panggilan (Preview)
                  </label>
                  <input
                    id="edit-paslon-short"
                    type="text"
                    maxLength={20}
                    value={shortName}
                    onChange={(e) => {
                      setShortName(e.target.value);
                      if (feedback) setFeedback(null);
                    }}
                    placeholder="Contoh: Raka"
                    className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label
                    htmlFor="edit-paslon-classes"
                    className="text-label-sm text-on-surface"
                  >
                    Kelas &amp; Jurusan
                  </label>
                  <input
                    id="edit-paslon-classes"
                    type="text"
                    value={classes}
                    onChange={(e) => {
                      setClasses(e.target.value);
                      if (feedback) setFeedback(null);
                    }}
                    placeholder="Contoh: XI TJKT & XI MPLB"
                    className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Right: Tagline, Summary, Vision & Mission List */}
            <div className="lg:col-span-7 flex flex-col gap-md justify-between">
              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-xs">
                  <label
                    htmlFor="edit-paslon-tagline"
                    className="text-label-sm text-on-surface"
                  >
                    Slogan di Bilik Suara
                  </label>
                  <input
                    id="edit-paslon-tagline"
                    type="text"
                    value={tagline}
                    onChange={(e) => {
                      setTagline(e.target.value);
                      if (feedback) setFeedback(null);
                    }}
                    placeholder="Slogan singkat pasangan calon"
                    className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label
                    htmlFor="edit-paslon-summary"
                    className="text-label-sm text-on-surface"
                  >
                    Ringkasan Kartu Kandidat
                  </label>
                  <textarea
                    id="edit-paslon-summary"
                    rows={2}
                    value={summary}
                    onChange={(e) => {
                      setSummary(e.target.value);
                      if (feedback) setFeedback(null);
                    }}
                    className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label
                    htmlFor="edit-paslon-vision"
                    className="text-label-sm text-on-surface"
                  >
                    Visi Utama
                  </label>
                  <textarea
                    id="edit-paslon-vision"
                    rows={3}
                    value={vision}
                    onChange={(e) => {
                      setVision(e.target.value);
                      if (feedback) setFeedback(null);
                    }}
                    className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <div className="flex items-center justify-between gap-sm">
                    <span className="text-label-sm text-on-surface">
                      Misi Program Kerja
                    </span>
                    <button
                      type="button"
                      onClick={handleAddMission}
                      className="inline-flex items-center gap-1 text-label-sm text-primary hover:text-primary-hover cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Tambah Misi</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-sm">
                    {missions.map((mission, idx) => (
                      <div key={idx} className="flex items-center gap-sm">
                        <span className="text-label-sm text-muted tabular-nums w-5 shrink-0">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={mission}
                          aria-label={`Misi ${idx + 1}`}
                          onChange={(e) =>
                            handleMissionChange(idx, e.target.value)
                          }
                          placeholder={`Masukkan poin misi ke-${idx + 1}`}
                          className="flex-1 rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          aria-label={`Hapus misi ${idx + 1}`}
                          disabled={missions.length <= 1}
                          onClick={() => handleRemoveMission(idx)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded border border-border-hairline text-muted hover:text-error hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Save Controls */}
              <div className="pt-md border-t border-border-hairline flex flex-col gap-md">
                {errorMsg && (
                  <p className="text-body-md text-error font-medium">
                    {errorMsg}
                  </p>
                )}

                {feedback && (
                  <div className="rounded bg-success/10 border border-success/30 px-md py-sm flex items-center gap-sm text-body-md text-on-surface">
                    <CheckCircle2
                      className="w-4 h-4 text-success shrink-0"
                      aria-hidden="true"
                    />
                    <span>{feedback}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-sm">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-4 py-2.5 text-label-lg text-on-surface transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Reset {activeCandidate.badge}</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-sm bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-2.5 text-label-lg shadow-[0_0_0_1px_#1D4ED8,0_4px_12px_rgba(29,78,216,0.18)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <Save className="w-4 h-4" aria-hidden="true" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Editable Election Schedule Card (Footer Column 3) */}
        <motion.div
          initial={{opacity: 0, y: 14}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.36, delay: 0.06, ease: EASE_OUT_EXPO}}
          className="mt-xl bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-lg"
        >
          <div className="flex items-start gap-sm border-b border-border-hairline pb-md">
            <div className="w-10 h-10 rounded bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-headline text-title-lg text-on-surface">
                Edit Jadwal Pemungutan Suara
              </h3>
              <p className="text-body-md text-muted">
                Perubahan teks jadwal, tanggal, jam pelaksanaan, dan catatan akan langsung tampil pada bagian bawah (footer) website.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveScheduleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-md"
          >
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="edit-schedule-title"
                className="text-label-sm text-on-surface"
              >
                Judul Jadwal
              </label>
              <input
                id="edit-schedule-title"
                type="text"
                value={scheduleTitle}
                onChange={(e) => {
                  setScheduleTitle(e.target.value);
                  if (scheduleFeedback) setScheduleFeedback(null);
                }}
                placeholder="Contoh: Jadwal Pemungutan Suara"
                className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="edit-schedule-date"
                className="text-label-sm text-on-surface"
              >
                Hari &amp; Tanggal
              </label>
              <input
                id="edit-schedule-date"
                type="text"
                value={scheduleDate}
                onChange={(e) => {
                  setScheduleDate(e.target.value);
                  if (scheduleFeedback) setScheduleFeedback(null);
                }}
                placeholder="Contoh: Rabu, 25 November 2026"
                className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="edit-schedule-time"
                className="text-label-sm text-on-surface"
              >
                Waktu Pemungutan Suara
              </label>
              <input
                id="edit-schedule-time"
                type="text"
                value={scheduleTime}
                onChange={(e) => {
                  setScheduleTime(e.target.value);
                  if (scheduleFeedback) setScheduleFeedback(null);
                }}
                placeholder="Contoh: Pukul 07.30 – 14.00 WIB"
                className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="edit-schedule-note"
                className="text-label-sm text-on-surface"
              >
                Catatan Jadwal
              </label>
              <input
                id="edit-schedule-note"
                type="text"
                value={scheduleNote}
                onChange={(e) => {
                  setScheduleNote(e.target.value);
                  if (scheduleFeedback) setScheduleFeedback(null);
                }}
                placeholder="Contoh: Bilik suara ditutup otomatis tepat pukul 14.00 WIB."
                className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="md:col-span-2 pt-md border-t border-border-hairline flex flex-col gap-md">
              {scheduleError && (
                <p className="text-body-md text-error font-medium">
                  {scheduleError}
                </p>
              )}

              {scheduleFeedback && (
                <div className="rounded bg-success/10 border border-success/30 px-md py-sm flex items-center gap-sm text-body-md text-on-surface">
                  <CheckCircle2
                    className="w-4 h-4 text-success shrink-0"
                    aria-hidden="true"
                  />
                  <span>{scheduleFeedback}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-sm">
                <button
                  type="button"
                  onClick={handleResetScheduleClick}
                  className="inline-flex items-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-4 py-2.5 text-label-lg text-on-surface transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset Jadwal</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-sm bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-2.5 text-label-lg shadow-[0_0_0_1px_#1D4ED8,0_4px_12px_rgba(29,78,216,0.18)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>Simpan Jadwal</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Editable Logo & Portal Identity Card */}
        <motion.div
          initial={{opacity: 0, y: 14}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.36, delay: 0.1, ease: EASE_OUT_EXPO}}
          className="mt-xl bg-surface border border-border-hairline rounded-md p-lg lg:p-xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] flex flex-col gap-lg"
        >
          <div className="flex items-start gap-sm border-b border-border-hairline pb-md">
            <div className="w-10 h-10 rounded bg-primary-tint text-on-primary-tint flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-headline text-title-lg text-on-surface">
                Edit Logo &amp; Identitas Portal
              </h3>
              <p className="text-body-md text-muted">
                Ganti logo sekolah, logo OSIS, serta teks identitas yang tampil di header navigasi dan halaman pembuka.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveBrandingSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-lg"
          >
            {/* School Logo Upload */}
            <div className="rounded border border-border-hairline bg-surface-canvas p-md flex items-center justify-between gap-md">
              <div className="flex items-center gap-md min-w-0">
                <div className="w-14 h-14 rounded bg-surface border border-border-hairline p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={previewSchoolLogo ?? schoolLogoUrl}
                    alt="Pratinjau Logo Sekolah"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-label-lg text-on-surface">Logo Sekolah</p>
                  <p className="text-label-sm text-muted truncate">
                    Tampil di sisi kiri header portal
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-3 py-2 text-label-sm text-on-surface cursor-pointer transition-colors shrink-0">
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Ganti Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload('school', e)}
                  className="sr-only"
                />
              </label>
            </div>

            {/* OSIS Logo Upload */}
            <div className="rounded border border-border-hairline bg-surface-canvas p-md flex items-center justify-between gap-md">
              <div className="flex items-center gap-md min-w-0">
                <div className="w-14 h-14 rounded bg-surface border border-border-hairline p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={previewOsisLogo ?? osisLogoUrl}
                    alt="Pratinjau Logo OSIS"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-label-lg text-on-surface">Logo OSIS</p>
                  <p className="text-label-sm text-muted truncate">
                    Tampil di header &amp; intro portal
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-3 py-2 text-label-sm text-on-surface cursor-pointer transition-colors shrink-0">
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Ganti Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload('osis', e)}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Portal Title Input */}
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="edit-branding-portal-title"
                className="text-label-sm text-on-surface"
              >
                Judul Portal (Header)
              </label>
              <input
                id="edit-branding-portal-title"
                type="text"
                value={portalTitle}
                onChange={(e) => {
                  setPortalTitle(e.target.value);
                  if (brandingFeedback) setBrandingFeedback(null);
                }}
                placeholder="Contoh: PILKETOS OSIS"
                className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* School Name Input */}
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="edit-branding-school-name"
                className="text-label-sm text-on-surface"
              >
                Nama Sekolah
              </label>
              <input
                id="edit-branding-school-name"
                type="text"
                value={schoolName}
                onChange={(e) => {
                  setSchoolName(e.target.value);
                  if (brandingFeedback) setBrandingFeedback(null);
                }}
                placeholder="Contoh: SMKS BM AL IKHLAS"
                className="w-full rounded border border-border-input bg-surface px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="md:col-span-2 pt-md border-t border-border-hairline flex flex-col gap-md">
              {brandingError && (
                <p className="text-body-md text-error font-medium">
                  {brandingError}
                </p>
              )}

              {brandingFeedback && (
                <div className="rounded bg-success/10 border border-success/30 px-md py-sm flex items-center gap-sm text-body-md text-on-surface">
                  <CheckCircle2
                    className="w-4 h-4 text-success shrink-0"
                    aria-hidden="true"
                  />
                  <span>{brandingFeedback}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-sm">
                <button
                  type="button"
                  onClick={handleResetBrandingClick}
                  className="inline-flex items-center gap-1.5 rounded border border-border-input bg-surface hover:bg-surface-subtle px-4 py-2.5 text-label-lg text-on-surface transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset Logo</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-sm bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-2.5 text-label-lg shadow-[0_0_0_1px_#1D4ED8,0_4px_12px_rgba(29,78,216,0.18)] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>Simpan Logo &amp; Identitas</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
