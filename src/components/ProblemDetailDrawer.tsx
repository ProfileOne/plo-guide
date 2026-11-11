import React, { useState, useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Clock, AlertTriangle, Circle, Save } from 'lucide-react';
import { CHAPTERS, ProblemStatus, StudyProblem } from '../data/studyGuideData';

interface ProblemDetailDrawerProps {
  problem: StudyProblem | null;
  status: ProblemStatus;
  noteText: string;
  onClose: () => void;
  onStatusChange: (problemId: number, status: ProblemStatus) => void;
  onSaveNote: (problemId: number, note: string) => void;
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
  onClose,
  onStatusChange,
  onSaveNote
}) => {
  const [draftNote, setDraftNote] = useState(noteText);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setDraftNote(noteText);
    setSavedNotice(false);
  }, [problem, noteText]);

  if (!problem) return null;

  const chapter = CHAPTERS.find((c) => c.id === problem.chapterId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(problem.id, draftNote);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 dark:bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-problem-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#141414] h-full shadow-xl border-l border-slate-200 dark:border-neutral-800 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 dark:text-[var(--dm-accent)] font-mono tabular-nums font-medium">
              Problem #{String(problem.id).padStart(2, '0')} · {chapter?.shortTitle} · Day {problem.scheduledDay}
            </div>
            <h2
              id="drawer-problem-title"
              className="text-lg font-bold text-slate-900 dark:text-[var(--dm-heading)] truncate"
            >
              {problem.exactName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close problem details"
            className="p-2 text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-200/60 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-[var(--dm-body)]">
              Current Study Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUS_BUTTONS.map((btn) => {
                const Icon = btn.icon;
                const active = status === btn.value;
                return (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => onStatusChange(problem.id, btn.value)}
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

          {/* Metadata & Core Takeaway */}
          <div className="p-4 bg-slate-50 dark:bg-[#101010] rounded-xl border border-slate-200/80 dark:border-neutral-800 space-y-3">
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
              <div className="text-xs text-indigo-700 dark:text-[var(--dm-accent)] font-medium border-t border-slate-200 dark:border-neutral-800 pt-2">
                Targeted Weak Areas: {problem.weakAreasTargeted.join(' · ')}
              </div>
            )}
          </div>

          {/* Personal Linguistic Notes & Rule Formulation */}
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
              rows={5}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Write your morpheme segmentation, alignment table, phonological rule ordering, or mistakes to remember for Round 1..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-[var(--dm-heading)] bg-white dark:bg-[#0e0e0e] border border-slate-300 dark:border-neutral-700 rounded-lg placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-[var(--dm-accent)] focus:border-transparent"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white dark:text-[var(--dm-heading)] bg-indigo-600 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-indigo-200 dark:text-[var(--dm-accent)]" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          {/* Direct Source PDF Access */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
                  Attached Source Booklet ({problem.pdfLabel})
                </h3>
                <p className="text-xs text-slate-500 dark:text-[var(--dm-muted)]">
                  Verify the exact problem statement directly in the attached PDF file.
                </p>
              </div>
              <a
                href={problem.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-[var(--dm-body)] bg-indigo-50 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-neutral-700 whitespace-nowrap shrink-0"
              >
                <span>Open Full PDF</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-[var(--dm-accent)]" />
              </a>
            </div>

            <div className="w-full h-72 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden bg-slate-100 dark:bg-[#0e0e0e]">
              <iframe
                src={problem.pdfUrl}
                title={`PDF preview for ${problem.exactName}`}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
