import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Circle,
  Save,
  ZoomIn,
  ZoomOut,
  FileText,
  Image as ImageIcon,
  Play,
  Pause,
  RotateCcw,
  Timer
} from 'lucide-react';
import { CHAPTERS, ProblemStatus, StudyProblem } from '../data/studyGuideData';
import {
  formatElapsedSeconds,
  getProblemPdfAssets,
  getTargetMinutesForDifficulty
} from '../utils/studyGuideLogic';

interface ProblemDetailDrawerProps {
  problem: StudyProblem | null;
  status: ProblemStatus;
  noteText: string;
  elapsedSeconds: number;
  onClose: () => void;
  onStatusChange: (problemId: number, status: ProblemStatus) => void;
  onSaveNote: (problemId: number, note: string) => void;
  onUpdateTimer: (problemId: number, nextSeconds: number) => void;
}

const STATUS_BUTTONS: {
  value: ProblemStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
}[] = [
  {
    value: 'Not Started',
    label: 'Not Started',
    icon: Circle,
    activeClass: 'bg-slate-800 dark:bg-neutral-700 text-white dark:text-[var(--dm-heading)]'
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    icon: Clock,
    activeClass: 'bg-amber-600 dark:bg-neutral-600 text-white dark:text-[var(--dm-heading)]'
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: CheckCircle2,
    activeClass: 'bg-emerald-600 dark:bg-[#3a362e] text-white dark:text-[var(--dm-accent)]'
  },
  {
    value: 'Review Needed',
    label: 'Review Needed',
    icon: AlertTriangle,
    activeClass: 'bg-rose-600 dark:bg-[#3d2b2b] text-white dark:text-[#e2b4b4]'
  }
];

export const ProblemDetailDrawer: React.FC<ProblemDetailDrawerProps> = ({
  problem,
  status,
  noteText,
  elapsedSeconds,
  onClose,
  onStatusChange,
  onSaveNote,
  onUpdateTimer
}) => {
  const [draftNote, setDraftNote] = useState(noteText);
  const [savedNotice, setSavedNotice] = useState(false);
  const [viewerMode, setViewerMode] = useState<'sheet' | 'pdf'>('sheet');
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // When a problem is opened, auto-start the timer unless it is already marked Completed
  useEffect(() => {
    if (!problem) {
      setIsTimerRunning(false);
      return;
    }
    setDraftNote(noteText);
    setSavedNotice(false);
    setViewerMode('sheet');
    setZoomPercent(100);
    setIsTimerRunning(status !== 'Completed');
    // Only trigger when switching to a different problem ID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.id]);

  // Keep draftNote synced if external noteText changes
  useEffect(() => {
    setDraftNote(noteText);
  }, [noteText]);

  // Tick every 1s while timer is running
  useEffect(() => {
    if (!problem || !isTimerRunning) return;
    const problemId = problem.id;
    const interval = window.setInterval(() => {
      onUpdateTimer(problemId, elapsedSeconds + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [problem, isTimerRunning, elapsedSeconds, onUpdateTimer]);

  if (!problem) return null;

  const chapter = CHAPTERS.find((c) => c.id === problem.chapterId);
  const pdfAssets = getProblemPdfAssets(problem.id);
  const targetMinutes = getTargetMinutesForDifficulty(problem.difficulty);
  const targetSeconds = targetMinutes * 60;
  const isOverTarget = elapsedSeconds > targetSeconds;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(problem.id, draftNote);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleStatusSelect = (nextStatus: ProblemStatus) => {
    onStatusChange(problem.id, nextStatus);
    if (nextStatus === 'Completed') {
      setIsTimerRunning(false);
    } else if (nextStatus === 'In Progress' && !isTimerRunning) {
      setIsTimerRunning(true);
    }
  };

  const pageRangeLabel =
    pdfAssets.startPage === pdfAssets.endPage
      ? `p. ${pdfAssets.startPage}`
      : `pp. ${pdfAssets.startPage}–${pdfAssets.endPage}`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-problem-title"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#141414] h-full shadow-2xl border-l border-slate-200 dark:border-neutral-800 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 dark:text-[var(--dm-accent)] font-mono tabular-nums font-medium">
              Problem #{String(problem.id).padStart(2, '0')} · {chapter?.shortTitle} · Day {problem.scheduledDay} · {problem.difficulty}
            </div>
            <h2
              id="drawer-problem-title"
              className="text-lg font-bold text-slate-900 dark:text-[var(--dm-heading)] truncate"
            >
              {problem.exactName}
              {problem.alias ? (
                <span className="ml-2 text-xs font-normal text-slate-500 dark:text-[var(--dm-muted)]">
                  ({problem.alias})
                </span>
              ) : null}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Built-in Problem Solve Timer right in the top bar */}
            <div
              data-testid="problem-solve-timer"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono tabular-nums text-xs ${
                isTimerRunning
                  ? isOverTarget
                    ? 'bg-amber-50 dark:bg-[#241d14] border-amber-300 dark:border-amber-800/70 text-amber-900 dark:text-[var(--dm-accent)]'
                    : 'bg-emerald-50/70 dark:bg-[#19201a] border-emerald-300/80 dark:border-neutral-700 text-slate-900 dark:text-[var(--dm-heading)]'
                  : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-[var(--dm-body)]'
              }`}
            >
              <Timer
                className={`w-3.5 h-3.5 shrink-0 ${
                  isTimerRunning
                    ? 'text-emerald-600 dark:text-[var(--dm-accent)]'
                    : 'text-slate-400 dark:text-[var(--dm-muted)]'
                }`}
              />
              <span
                data-testid="timer-display"
                className="font-bold text-sm tracking-tight min-w-[3.1rem] text-center"
              >
                {formatElapsedSeconds(elapsedSeconds)}
              </span>
              <span
                className="hidden md:inline text-[10px] text-slate-400 dark:text-[var(--dm-muted)] border-l border-slate-200 dark:border-neutral-700 pl-1.5"
                title={`Recommended pace for ${problem.difficulty} problems: ${targetMinutes} minutes`}
              >
                / {targetMinutes}:00
              </span>

              <button
                type="button"
                onClick={() => setIsTimerRunning((r) => !r)}
                aria-label={isTimerRunning ? 'Pause problem timer' : 'Start problem timer'}
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                className="p-1 rounded hover:bg-slate-200/70 dark:hover:bg-neutral-800 text-slate-700 dark:text-[var(--dm-heading)] cursor-pointer"
              >
                {isTimerRunning ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateTimer(problem.id, 0);
                  setIsTimerRunning(true);
                }}
                aria-label="Reset problem timer"
                title="Reset timer to 00:00"
                className="p-1 rounded hover:bg-slate-200/70 dark:hover:bg-neutral-800 text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <a
              href={pdfAssets.singlePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-[var(--dm-heading)] bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 whitespace-nowrap"
            >
              <span>Open Problem Only (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-[var(--dm-accent)]" />
            </a>

            <a
              href={pdfAssets.fullPdfPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-[var(--dm-body)] bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg hover:bg-slate-200/70 dark:hover:bg-neutral-800 whitespace-nowrap"
            >
              <span>Full Booklet ({pageRangeLabel})</span>
              <ExternalLink className="w-3 h-3 text-slate-400 dark:text-[var(--dm-muted)]" />
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close problem details"
              className="p-2 text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-200/60 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. EXACT PROBLEM SHEET VIEWER (Placed first so user immediately sees the problem without searching) */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-[var(--dm-accent)]">
                  Exact Problem Statement
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-[var(--dm-muted)]">
                  ({problem.pdfLabel} · {pageRangeLabel} · {pdfAssets.pageCount}{' '}
                  {pdfAssets.pageCount === 1 ? 'page' : 'pages'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {viewerMode === 'sheet' && (
                  <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-slate-200 dark:border-neutral-700">
                    <button
                      type="button"
                      onClick={() => setZoomPercent((z) => Math.max(100, z - 25))}
                      disabled={zoomPercent <= 100}
                      aria-label="Zoom out problem sheet"
                      className="p-1 text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] disabled:opacity-40 cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1.5 text-[11px] font-mono tabular-nums text-slate-700 dark:text-[var(--dm-heading)]">
                      {zoomPercent}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomPercent((z) => Math.min(175, z + 25))}
                      disabled={zoomPercent >= 175}
                      aria-label="Zoom in problem sheet"
                      className="p-1 text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] disabled:opacity-40 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div
                  role="group"
                  aria-label="Problem viewer mode"
                  className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700"
                >
                  <button
                    type="button"
                    onClick={() => setViewerMode('sheet')}
                    aria-pressed={viewerMode === 'sheet'}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                      viewerMode === 'sheet'
                        ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-[var(--dm-heading)] shadow-2xs'
                        : 'text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Instant Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerMode('pdf')}
                    aria-pressed={viewerMode === 'pdf'}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                      viewerMode === 'pdf'
                        ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-[var(--dm-heading)] shadow-2xs'
                        : 'text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Interactive PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {viewerMode === 'sheet' ? (
              <div
                data-testid="problem-sheet-viewer"
                className="w-full max-h-[580px] overflow-auto rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-100/90 dark:bg-[#0c0c0c] p-3 space-y-4"
              >
                {pdfAssets.pageImages.map((imgUrl, idx) => (
                  <div
                    key={imgUrl}
                    className="mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200/80"
                    style={{ width: `${zoomPercent}%` }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${problem.exactName} — Page ${idx + 1} of ${pdfAssets.pageCount}`}
                      className="w-full h-auto block"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                data-testid="problem-pdf-iframe-container"
                className="w-full h-[580px] rounded-xl border border-slate-200 dark:border-neutral-800 overflow-hidden bg-slate-100 dark:bg-[#0e0e0e]"
              >
                <iframe
                  src={`${pdfAssets.singlePdfUrl}#view=FitH`}
                  title={`Standalone PDF for ${problem.exactName}`}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

          {/* 2. STATUS SELECTOR */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-[var(--dm-body)]">
                Current Study Status
              </label>
              <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-[var(--dm-muted)]">
                Time logged: {formatElapsedSeconds(elapsedSeconds)} (Target: {targetMinutes}m)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUS_BUTTONS.map((btn) => {
                const Icon = btn.icon;
                const active = status === btn.value;
                return (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => handleStatusSelect(btn.value)}
                    aria-pressed={active}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border cursor-pointer whitespace-nowrap ${
                      active
                        ? `${btn.activeClass} border-transparent`
                        : 'bg-white dark:bg-neutral-800 text-slate-700 dark:text-[var(--dm-body)] border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. PERSONAL LINGUISTIC NOTES & RULE FORMULATION */}
          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="problem-note-textarea"
                className="block text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)]"
              >
                Personal Linguistic Rules & Glossing Notes
              </label>
              {savedNotice && (
                <span className="text-xs font-medium text-emerald-700 dark:text-[var(--dm-accent)]">
                  Saved to study log
                </span>
              )}
            </div>
            <textarea
              id="problem-note-textarea"
              rows={4}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Write your morpheme segmentation, alignment table, phonological rule ordering, or mistakes to remember for Round 1..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-[var(--dm-heading)] bg-white dark:bg-[#0e0e0e] border border-slate-300 dark:border-neutral-700 rounded-lg placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-[var(--dm-accent)] focus:border-transparent"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white dark:text-[var(--dm-heading)] bg-slate-900 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg hover:bg-slate-800 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-slate-200 dark:text-[var(--dm-accent)]" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          {/* 4. METADATA & CORE TAKEAWAY */}
          <div className="p-4 bg-slate-50 dark:bg-[#101010] rounded-xl border border-slate-200/80 dark:border-neutral-800 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-[var(--dm-body)]">
              <span><strong className="dark:text-[var(--dm-heading)]">Source:</strong> {problem.sourceAndYear}</span>
              <span aria-hidden="true">·</span>
              <span><strong className="dark:text-[var(--dm-heading)]">Division:</strong> {problem.division}</span>
              <span aria-hidden="true">·</span>
              <span><strong className="dark:text-[var(--dm-heading)]">Difficulty:</strong> {problem.difficulty}</span>
            </div>

            <div className="text-sm text-slate-800 dark:text-[var(--dm-body)] leading-relaxed">
              <strong className="text-slate-900 dark:text-[var(--dm-accent)]">Unique Concept Taught: </strong>
              {problem.uniqueSkillTaught}
            </div>

            {problem.chapterPlacementReason && (
              <div className="text-xs text-slate-600 dark:text-[var(--dm-muted)] italic border-t border-slate-200 dark:border-neutral-800 pt-2">
                <strong className="not-italic dark:text-[var(--dm-body)]">Single-Chapter Assignment Reason:</strong> {problem.chapterPlacementReason}
              </div>
            )}

            {problem.weakAreasTargeted.length > 0 && (
              <div className="text-xs text-slate-700 dark:text-[var(--dm-accent)] font-medium border-t border-slate-200 dark:border-neutral-800 pt-2">
                Targeted Weak Areas: {problem.weakAreasTargeted.join(' · ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
