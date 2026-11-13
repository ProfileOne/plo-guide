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
    shortLabel: 'Todo',
    activeClass: 'bg-slate-900 dark:bg-neutral-700 text-white dark:text-[var(--dm-heading)] font-medium'
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    shortLabel: 'Doing',
    activeClass: 'bg-amber-600 dark:bg-neutral-600 text-white dark:text-[var(--dm-heading)] font-medium'
  },
  {
    value: 'Completed',
    label: 'Completed',
    shortLabel: 'Done',
    activeClass: 'bg-emerald-600 dark:bg-[#3a362e] text-white dark:text-[var(--dm-accent)] font-medium'
  },
  {
    value: 'Review Needed',
    label: 'Review Needed',
    shortLabel: 'Review',
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
      ? 'bg-emerald-50/15 hover:bg-emerald-50/30 dark:bg-[#151412] dark:hover:bg-[#1a1916]'
      : status === 'Review Needed'
      ? 'bg-rose-50/15 hover:bg-rose-50/30 dark:bg-[#161212] dark:hover:bg-[#1c1616]'
      : status === 'In Progress'
      ? 'bg-amber-50/15 hover:bg-amber-50/30 dark:bg-[#151412] dark:hover:bg-[#1a1916]'
      : 'bg-white hover:bg-slate-50/50 dark:bg-[#121212] dark:hover:bg-[#161616]';

  return (
    <div
      className={`group px-4 py-2 transition-colors duration-150 ${rowBg}`}
      data-testid={`problem-row-${problem.id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left: #ID + Problem Name + Minimal Meta + More Toggle */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 flex-1">
          <span className="font-mono tabular-nums text-xs text-slate-400 dark:text-[var(--dm-muted)] w-6 shrink-0">
            #{String(problem.id).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={() => onOpenDetail(problem, 'sheet')}
            className="text-left text-[13px] sm:text-sm font-medium text-slate-900 dark:text-[var(--dm-heading)] hover:text-slate-600 dark:hover:text-[var(--dm-accent)] focus-visible:outline-1 focus-visible:outline-slate-500 dark:focus-visible:outline-[var(--dm-accent)] rounded-xs cursor-pointer truncate max-w-full"
          >
            {problem.exactName}
          </button>

          <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-[var(--dm-muted)] whitespace-nowrap">
            D{problem.scheduledDay} · {problem.difficulty}
          </span>

          {elapsedSeconds > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-mono tabular-nums text-slate-500 dark:text-[var(--dm-accent)]"
              title="Logged solve time"
            >
              <Timer className="w-3 h-3 shrink-0" />
              <span>{formatElapsedSeconds(elapsedSeconds)}</span>
            </span>
          )}

          {hasNote && (
            <span
              className="inline-flex items-center text-[11px] text-slate-400 dark:text-[var(--dm-accent)]"
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
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] text-slate-400 dark:text-[var(--dm-muted)] hover:text-slate-800 dark:hover:text-[var(--dm-heading)] rounded cursor-pointer"
          >
            <span>{showDetails ? 'Less' : 'More'}</span>
            {showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Right Controls: Quiet Status Switcher + Sheet & PDF Triggers */}
        <div className="flex items-center gap-1.5 shrink-0 pl-8 sm:pl-0">
          <div
            role="group"
            aria-label={`Status for ${problem.exactName}`}
            className={`inline-flex items-center p-0.5 rounded transition-opacity duration-150 ${
              status === 'Not Started'
                ? 'opacity-55 group-hover:opacity-100 focus-within:opacity-100'
                : 'opacity-100'
            }`}
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
                  className={`px-1.5 py-0.5 text-[11px] rounded-xs whitespace-nowrap shrink-0 cursor-pointer ${
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

          <span className="text-slate-200 dark:text-neutral-800 select-none" aria-hidden="true">|</span>

          <button
            type="button"
            onClick={() => onOpenDetail(problem, 'sheet')}
            aria-label={`Open problem sheet for ${problem.exactName}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-[var(--dm-heading)] hover:bg-slate-100 dark:hover:bg-neutral-800 rounded whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-slate-400 dark:text-[var(--dm-accent)] shrink-0" />
            <span>Sheet</span>
          </button>

          <button
            type="button"
            data-testid={`open-pdf-row-${problem.id}`}
            onClick={() => onOpenDetail(problem, 'pdf')}
            aria-label={`Open interactive PDF for ${problem.exactName}`}
            title={`Open interactive ${pdfAssets.pageCount}-page problem PDF`}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono tabular-nums text-slate-500 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-100 dark:hover:bg-neutral-800 rounded whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-slate-400 dark:text-[var(--dm-accent)] shrink-0" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Expandable Details (Hidden by default; revealed when clicking "More") */}
      {showDetails && (
        <div
          data-testid={`problem-details-${problem.id}`}
          className="mt-2 pt-2 pl-8 pr-2 border-t border-slate-100 dark:border-neutral-800/70 space-y-1 text-xs text-slate-600 dark:text-[var(--dm-body)]"
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
            <p className="text-[11px] text-slate-400 dark:text-[var(--dm-muted)]">
              <span className="font-medium text-slate-600 dark:text-[var(--dm-body)]">Chapter Rationale: </span>
              {problem.chapterPlacementReason}
            </p>
          )}

          {problem.weakAreasTargeted.length > 0 && (
            <p className="text-[11px] text-slate-600 dark:text-[var(--dm-accent)]">
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
