import React from 'react';
import { BookOpen, CheckCircle2, Clock, AlertTriangle, Circle, FileText } from 'lucide-react';
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
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
}[] = [
  {
    value: 'Not Started',
    label: 'Not Started',
    shortLabel: 'Unstarted',
    icon: Circle,
    activeClass: 'bg-slate-800 dark:bg-neutral-700 text-white dark:text-[var(--dm-heading)] shadow-xs'
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    shortLabel: 'In Progress',
    icon: Clock,
    activeClass: 'bg-amber-600 dark:bg-neutral-600 text-white dark:text-[var(--dm-heading)] shadow-xs'
  },
  {
    value: 'Completed',
    label: 'Completed',
    shortLabel: 'Completed',
    icon: CheckCircle2,
    activeClass: 'bg-emerald-600 dark:bg-[#3a362e] text-white dark:text-[var(--dm-accent)] shadow-xs'
  },
  {
    value: 'Review Needed',
    label: 'Review Needed',
    shortLabel: 'Review Needed',
    icon: AlertTriangle,
    activeClass: 'bg-rose-600 dark:bg-[#3d2b2b] text-white dark:text-[#e2b4b4] shadow-xs'
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

  const difficultyColor =
    problem.difficulty === 'Easy'
      ? 'text-emerald-700 dark:text-[var(--dm-body)]'
      : problem.difficulty === 'Medium'
      ? 'text-amber-700 dark:text-[var(--dm-accent)]'
      : problem.difficulty === 'Hard'
      ? 'text-rose-700 dark:text-[var(--dm-heading)]'
      : 'text-purple-800 dark:text-[var(--dm-heading)] font-semibold';

  const rowBg =
    status === 'Completed'
      ? 'bg-emerald-50/30 hover:bg-emerald-50/60 dark:bg-[#181714] dark:hover:bg-[#1f1d19]'
      : status === 'Review Needed'
      ? 'bg-rose-50/30 hover:bg-rose-50/60 dark:bg-[#191414] dark:hover:bg-[#211a1a]'
      : status === 'In Progress'
      ? 'bg-amber-50/30 hover:bg-amber-50/60 dark:bg-[#171614] dark:hover:bg-[#1e1d1a]'
      : 'bg-white hover:bg-slate-50/80 dark:bg-[#141414] dark:hover:bg-[#1b1b1b]';

  return (
    <div
      className={`group px-5 py-4 border-b border-slate-200/80 dark:border-neutral-800 last:border-b-0 ${rowBg}`}
      data-testid={`problem-row-${problem.id}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Left: Number, Title, Unboxed Metadata, and Linguistic Takeaway */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <span className="font-mono tabular-nums text-xs font-semibold text-slate-400 dark:text-[var(--dm-muted)] pt-1 w-7 shrink-0">
            #{String(problem.id).padStart(2, '0')}
          </span>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <button
                type="button"
                onClick={() => onOpenDetail(problem)}
                className="text-left text-base font-semibold text-slate-900 dark:text-[var(--dm-heading)] hover:text-indigo-700 dark:hover:text-[var(--dm-accent)] focus-visible:outline-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-[var(--dm-accent)] rounded-xs cursor-pointer"
              >
                {problem.exactName}
              </button>
              {problem.alias && (
                <span className="text-xs text-slate-500 dark:text-[var(--dm-muted)]">
                  ({problem.alias})
                </span>
              )}
            </div>

            {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-[var(--dm-muted)]">
              <span className="font-medium text-slate-700 dark:text-[var(--dm-body)]">{problem.sourceAndYear}</span>
              <span aria-hidden="true">·</span>
              <span>
                Division: <strong className="font-medium text-slate-700 dark:text-[var(--dm-body)]">{problem.division}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Difficulty: <strong className={`font-medium ${difficultyColor}`}>{problem.difficulty}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-600 dark:text-[var(--dm-body)]">
                Day {problem.scheduledDay}
                {problem.isMockPaper ? ` (${problem.mockPaperName})` : ''}
              </span>
              {problem.weakAreasTargeted.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-700 dark:text-[var(--dm-accent)] font-medium">
                    Targets: {problem.weakAreasTargeted.join(', ')}
                  </span>
                </>
              )}
            </div>

            {/* Unique linguistic concept taught */}
            <p className="text-sm text-slate-700 dark:text-[var(--dm-body)] leading-relaxed max-w-4xl">
              <span className="font-semibold text-slate-900 dark:text-[var(--dm-accent)]">Teaches: </span>
              {problem.uniqueSkillTaught}
            </p>

            {/* Single-chapter placement explanation when bridging two chapters */}
            {problem.chapterPlacementReason && (
              <p className="text-xs text-slate-500 dark:text-[var(--dm-muted)] italic">
                <span className="not-italic font-medium text-slate-600 dark:text-[var(--dm-body)]">Chapter Rationale: </span>
                {problem.chapterPlacementReason}
              </p>
            )}

            {/* Personal note preview if present */}
            {hasNote && (
              <div className="pt-1 text-xs text-slate-600 dark:text-[var(--dm-body)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-[var(--dm-accent)] shrink-0" />
                <span className="truncate max-w-2xl font-medium text-slate-700 dark:text-[var(--dm-heading)]">
                  Note: {noteText}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Segmented Status Control & Detail/PDF Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 lg:pt-0.5 pl-10 lg:pl-0">
          <div
            role="group"
            aria-label={`Status for ${problem.exactName}`}
            className="inline-flex items-center p-1 bg-slate-100 dark:bg-neutral-800/90 rounded-lg border border-slate-200/80 dark:border-neutral-700"
          >
            {STATUS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onStatusChange(problem.id, opt.value)}
                  aria-pressed={isSelected}
                  aria-label={`Mark ${problem.exactName} as ${opt.label}`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? opt.activeClass
                      : 'text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-white/60 dark:hover:bg-neutral-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{opt.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onOpenDetail(problem)}
            aria-label={`Open PDF and notes for ${problem.exactName}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-[var(--dm-body)] bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-700 hover:text-slate-900 dark:hover:text-[var(--dm-heading)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-[var(--dm-accent)]" />
            <span>{hasNote ? 'Edit Note & PDF' : 'Notes & PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
