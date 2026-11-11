import React from 'react';
import { FileText } from 'lucide-react';
import { ProblemStatus, StudyProblem } from '../data/studyGuideData';

interface ProblemRowProps {
  problem: StudyProblem;
  status: ProblemStatus;
  noteText: string;
  onStatusChange: (problemId: number, status: ProblemStatus) => void;
  onOpenDetail: (problem: StudyProblem) => void;
}

const STATUS_OPTIONS: {
  value: ProblemStatus;
  label: string;
  shortLabel: string;
  activeClass: string;
}[] = [
  {
    value: 'Not Started',
    label: 'Not Started',
    shortLabel: 'Unstarted',
    activeClass: 'bg-slate-900 dark:bg-neutral-700 text-white dark:text-[var(--dm-heading)] font-medium'
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    shortLabel: 'In Progress',
    activeClass: 'bg-amber-600 dark:bg-neutral-600 text-white dark:text-[var(--dm-heading)] font-medium'
  },
  {
    value: 'Completed',
    label: 'Completed',
    shortLabel: 'Completed',
    activeClass: 'bg-emerald-600 dark:bg-[#3a362e] text-white dark:text-[var(--dm-accent)] font-medium'
  },
  {
    value: 'Review Needed',
    label: 'Review Needed',
    shortLabel: 'Review Needed',
    activeClass: 'bg-rose-600 dark:bg-[#3d2b2b] text-white dark:text-[#e2b4b4] font-medium'
  }
];

export const ProblemRow: React.FC<ProblemRowProps> = ({
  problem,
  status,
  noteText,
  onStatusChange,
  onOpenDetail
}) => {
  const hasNote = noteText.trim().length > 0;

  const rowBg =
    status === 'Completed'
      ? 'bg-emerald-50/20 hover:bg-emerald-50/40 dark:bg-[#161512] dark:hover:bg-[#1c1b17]'
      : status === 'Review Needed'
      ? 'bg-rose-50/20 hover:bg-rose-50/40 dark:bg-[#171212] dark:hover:bg-[#1e1818]'
      : status === 'In Progress'
      ? 'bg-amber-50/20 hover:bg-amber-50/40 dark:bg-[#151412] dark:hover:bg-[#1b1a17]'
      : 'bg-white hover:bg-slate-50/60 dark:bg-[#131313] dark:hover:bg-[#181818]';

  return (
    <div
      className={`group px-5 py-3.5 ${rowBg}`}
      data-testid={`problem-row-${problem.id}`}
    >
      <div className="flex items-start gap-3">
        <span className="font-mono tabular-nums text-xs text-slate-400 dark:text-[var(--dm-muted)] pt-0.5 w-6 shrink-0">
          #{String(problem.id).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Top Line: Problem Title on Left, Minimal Controls on Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
              <button
                type="button"
                onClick={() => onOpenDetail(problem)}
                className="text-left text-sm sm:text-[15px] font-semibold text-slate-900 dark:text-[var(--dm-heading)] hover:text-slate-600 dark:hover:text-[var(--dm-accent)] focus-visible:outline-1 focus-visible:outline-slate-500 dark:focus-visible:outline-[var(--dm-accent)] rounded-xs cursor-pointer"
              >
                {problem.exactName}
              </button>
              {problem.alias && (
                <span className="text-xs text-slate-400 dark:text-[var(--dm-muted)]">
                  ({problem.alias})
                </span>
              )}
            </div>

            {/* Minimal Right Controls (Text-only status pills + quiet Notes & PDF link) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div
                role="group"
                aria-label={`Status for ${problem.exactName}`}
                className="inline-flex items-center p-0.5 bg-slate-100/80 dark:bg-neutral-800/60 rounded-md"
              >
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onStatusChange(problem.id, opt.value)}
                      aria-pressed={isSelected}
                      aria-label={`Mark ${problem.exactName} as ${opt.label}`}
                      className={`px-2 py-0.5 text-[11px] rounded-xs whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? opt.activeClass
                          : 'text-slate-400 dark:text-[var(--dm-muted)] hover:text-slate-800 dark:hover:text-[var(--dm-body)]'
                      }`}
                    >
                      {opt.shortLabel}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onOpenDetail(problem)}
                aria-label={`Open PDF and notes for ${problem.exactName}`}
                className="px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:text-[var(--dm-accent)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] border border-slate-200/70 dark:border-neutral-800 rounded-md hover:bg-slate-100/60 dark:hover:bg-neutral-800/70 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {hasNote ? 'Edit Note & PDF' : 'Notes & PDF'}
              </button>
            </div>
          </div>

          {/* Core Study Takeaway (Primary readable line) */}
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-[var(--dm-body)] leading-relaxed max-w-4xl">
            <span className="font-medium text-slate-800 dark:text-[var(--dm-accent)]">Teaches: </span>
            {problem.uniqueSkillTaught}
          </p>

          {/* Single-chapter placement explanation when bridging two chapters */}
          {problem.chapterPlacementReason && (
            <p className="text-[11px] text-slate-400 dark:text-[var(--dm-muted)] italic">
              <span className="not-italic font-medium text-slate-500 dark:text-[var(--dm-body)]">Chapter Rationale: </span>
              {problem.chapterPlacementReason}
            </p>
          )}

          {/* Quiet Single-Line Metadata Footer (Never wraps awkwardly) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 dark:text-[var(--dm-muted)] font-mono tabular-nums pt-0.5">
            <span>
              Day {problem.scheduledDay}
              {problem.isMockPaper ? ` (${problem.mockPaperName})` : ''}
            </span>
            <span aria-hidden="true">·</span>
            <span>Difficulty: {problem.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span>Division: {problem.division}</span>
            <span aria-hidden="true">·</span>
            <span className="font-sans">{problem.sourceAndYear}</span>
            {problem.weakAreasTargeted.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-sans text-slate-600 dark:text-[var(--dm-accent)]">
                  Targets: {problem.weakAreasTargeted.join(', ')}
                </span>
              </>
            )}
          </div>

          {/* Personal note preview if present */}
          {hasNote && (
            <div className="pt-0.5 text-xs text-slate-500 dark:text-[var(--dm-body)] flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-slate-400 dark:text-[var(--dm-accent)] shrink-0" />
              <span className="truncate max-w-2xl font-medium text-slate-700 dark:text-[var(--dm-heading)]">
                Note: {noteText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
