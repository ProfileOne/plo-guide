import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Timer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ProblemStatus, StudyProblem } from '../data/studyGuideData';
import { formatElapsedSeconds, getProblemPdfAssets } from '../utils/studyGuideLogic';

interface ProblemRowProps {
  problem: StudyProblem;
  status: ProblemStatus;
  noteText: string;
  elapsedSeconds?: number;
  forceExpanded?: boolean;
  onStatusChange: (problemId: number, status: ProblemStatus) => void;
  onOpenDetail: (problem: StudyProblem, initialMode?: 'sheet' | 'pdf') => void;
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
  elapsedSeconds = 0,
  forceExpanded = false,
  onStatusChange,
  onOpenDetail
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showDetails = forceExpanded || isExpanded;
  const hasNote = noteText.trim().length > 0;
  const pdfAssets = getProblemPdfAssets(problem.id);

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
      className={`group px-4 sm:px-5 py-2.5 ${rowBg}`}
      data-testid={`problem-row-${problem.id}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        {/* Left: Compact #ID + Problem Name + Minimal Meta + Click-for-More Toggle */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0 flex-1">
          <span className="font-mono tabular-nums text-xs text-slate-400 dark:text-[var(--dm-muted)] w-6 shrink-0">
            #{String(problem.id).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={() => onOpenDetail(problem, 'sheet')}
            className="text-left text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)] hover:text-slate-600 dark:hover:text-[var(--dm-accent)] focus-visible:outline-1 focus-visible:outline-slate-500 dark:focus-visible:outline-[var(--dm-accent)] rounded-xs cursor-pointer truncate max-w-full"
          >
            {problem.exactName}
          </button>

          <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-[var(--dm-muted)] whitespace-nowrap">
            D{problem.scheduledDay} · {problem.difficulty}
          </span>

          {elapsedSeconds > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-mono tabular-nums text-slate-600 dark:text-[var(--dm-accent)] font-medium"
              title="Logged solve time"
            >
              <Timer className="w-3 h-3 shrink-0" />
              <span>{formatElapsedSeconds(elapsedSeconds)}</span>
            </span>
          )}

          {hasNote && (
            <span
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-[var(--dm-accent)]"
              title="Has saved note"
            >
              <FileText className="w-3 h-3 shrink-0" />
            </span>
          )}

          <button
            type="button"
            data-testid={`toggle-more-${problem.id}`}
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={showDetails}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] font-medium text-slate-400 dark:text-[var(--dm-muted)] hover:text-slate-800 dark:hover:text-[var(--dm-heading)] hover:bg-slate-100 dark:hover:bg-neutral-800/80 rounded cursor-pointer"
          >
            <span>{showDetails ? 'Less' : 'More'}</span>
            {showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Right Controls: Status pills + Instant "Open Problem" viewer button + Interactive PDF button */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 pl-8 lg:pl-0">
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
            onClick={() => onOpenDetail(problem, 'sheet')}
            aria-label={`Open problem sheet for ${problem.exactName}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:text-[var(--dm-heading)] bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200/80 dark:hover:bg-neutral-700 border border-slate-300/80 dark:border-neutral-700 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-slate-600 dark:text-[var(--dm-accent)] shrink-0" />
            <span>Open Problem</span>
          </button>

          <button
            type="button"
            data-testid={`open-pdf-row-${problem.id}`}
            onClick={() => onOpenDetail(problem, 'pdf')}
            aria-label={`Open interactive PDF for ${problem.exactName}`}
            title={`Open interactive ${pdfAssets.pageCount}-page problem PDF`}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono tabular-nums text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] border border-slate-200/80 dark:border-neutral-800 rounded-md hover:bg-slate-100/70 dark:hover:bg-neutral-800/70 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-slate-500 dark:text-[var(--dm-accent)] shrink-0" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Expandable Details (Hidden by default to keep the eye calm; revealed when clicking "More") */}
      {showDetails && (
        <div
          data-testid={`problem-details-${problem.id}`}
          className="mt-2 pl-8 pr-2 py-2 border-l-2 border-slate-200 dark:border-neutral-800 space-y-1 text-xs text-slate-600 dark:text-[var(--dm-body)]"
        >
          <p className="leading-relaxed max-w-4xl">
            <span className="font-semibold text-slate-800 dark:text-[var(--dm-accent)]">Teaches: </span>
            {problem.uniqueSkillTaught}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-[var(--dm-muted)]">
            <span>
              <strong className="text-slate-700 dark:text-[var(--dm-body)]">Source:</strong> {problem.sourceAndYear}
            </span>
            <span aria-hidden="true">·</span>
            <span>Division: {problem.division}</span>
            {problem.isMockPaper && problem.mockPaperName && (
              <>
                <span aria-hidden="true">·</span>
                <span>{problem.mockPaperName}</span>
              </>
            )}
            {problem.alias && (
              <>
                <span aria-hidden="true">·</span>
                <span>Alias: {problem.alias}</span>
              </>
            )}
          </div>

          {problem.chapterPlacementReason && (
            <p className="text-[11px] text-slate-400 dark:text-[var(--dm-muted)] italic">
              <span className="not-italic font-medium text-slate-600 dark:text-[var(--dm-body)]">Chapter Rationale: </span>
              {problem.chapterPlacementReason}
            </p>
          )}

          {problem.weakAreasTargeted.length > 0 && (
            <p className="text-[11px] text-slate-600 dark:text-[var(--dm-accent)] font-medium">
              Targets: {problem.weakAreasTargeted.join(' · ')}
            </p>
          )}

          {hasNote && (
            <p className="text-[11px] text-slate-700 dark:text-[var(--dm-heading)] font-medium pt-0.5">
              Saved Note: {noteText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
