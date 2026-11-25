import {useEffect, useState} from 'react';
import {
  CheckCircle2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import {motion} from 'motion/react';
import type {CandidatePair, PaslonId} from '../types/election';
import {ResilientImage} from './ResilientImage';

interface CandidateEditorSectionProps {
  candidates: CandidatePair[];
  onSaveCandidate: (updated: CandidatePair) => void;
  onResetCandidate: (id: PaslonId) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CandidateEditorSection({
  candidates,
  onSaveCandidate,
  onResetCandidate,
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
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setTitle(activeCandidate.title);
    setShortName(activeCandidate.shortName);
    setClasses(activeCandidate.classes);
    setTagline(activeCandidate.tagline);
    setSummary(activeCandidate.summary);
    setVision(activeCandidate.vision);
    setMissions(activeCandidate.missions);
    setImageUrl(activeCandidate.imageUrl);
    setErrorMsg(null);
  }, [activeCandidate]);

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

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setFeedback(null);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanShort =
      shortName.trim() || cleanTitle.split(/\s+/)[0] || activeCandidate.shortName;
    const cleanVision = vision.trim();
    const cleanMissions = missions.map((m) => m.trim()).filter(Boolean);

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
    });
    setFeedback(
      `Data ${activeCandidate.badge} berhasil disimpan dan diperbarui di seluruh dashboard.`
    );
  }

  function handleReset() {
    onResetCandidate(activeCandidate.id);
    setErrorMsg(null);
    setFeedback(`Data ${activeCandidate.badge} dikembalikan ke pengaturan awal.`);
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
              Edit nama pasangan calon, jurusan, visi utama, dan misi program kerja. Perubahan langsung tersinkron ke seluruh dashboard pemilihan.
            </p>
          </div>
          <span className="text-label-sm text-muted shrink-0">
            Dashboard Panitia OSIS
          </span>
        </div>

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
            {/* Left: Photo Preview & Identity Fields */}
            <div className="lg:col-span-5 flex flex-col gap-md">
              <div className="overflow-hidden rounded border border-border-hairline bg-surface-canvas">
                <ResilientImage
                  src={imageUrl}
                  alt={`Pratinjau ${title}`}
                  fallbackLabel={title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <label className="inline-flex items-center justify-center gap-sm rounded border border-border-input bg-surface hover:bg-surface-subtle px-md py-2 text-label-sm text-on-surface cursor-pointer transition-colors w-full">
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Ganti Foto Paslon</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>

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
      </div>
    </section>
  );
}
