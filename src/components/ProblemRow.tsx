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
    activeClass: 'bg-slate-800 text-white shadow-xs'
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    shortLabel: 'In Progress',
    icon: Clock,
    activeClass: 'bg-amber-600 text-white shadow-xs'
  },
  {
    value: 'Completed',
    label: 'Completed',
    shortLabel: 'Completed',
    icon: CheckCircle2,
    activeClass: 'bg-emerald-600 text-white shadow-xs'
  },
  {
    value: 'Review Needed',
    label: 'Review Needed',
    shortLabel: 'Review Needed',
    icon: AlertTriangle,
    activeClass: 'bg-rose-600 text-white shadow-xs'
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
      ? 'text-emerald-700'
      : problem.difficulty === 'Medium'
      ? 'text-amber-700'
      : problem.difficulty === 'Hard'
      ? 'text-rose-700'
      : 'text-purple-800 font-semibold';

  const rowBg =
    status === 'Completed'
      ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
      : status === 'Review Needed'
      ? 'bg-rose-50/30 hover:bg-rose-50/60'
      : status === 'In Progress'
      ? 'bg-amber-50/30 hover:bg-amber-50/60'
      : 'bg-white hover:bg-slate-50/80';

  return (
    <div
      className={`group transition-colors duration-150 px-5 py-4 border-b border-slate-200/80 last:border-b-0 ${rowBg}`}
      data-testid={`problem-row-${problem.id}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Left: Number, Title, Unboxed Metadata, and Linguistic Takeaway */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <span className="font-mono tabular-nums text-xs font-semibold text-slate-400 pt-1 w-7 shrink-0">
            #{String(problem.id).padStart(2, '0')}
          </span>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <button
                type="button"
                onClick={() => onOpenDetail(problem)}
                className="text-left text-base font-semibold text-slate-900 hover:text-indigo-700 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 rounded-xs"
              >
                {problem.exactName}
              </button>
              {problem.alias && (
                <span className="text-xs text-slate-500">
                  ({problem.alias})
                </span>
              )}
            </div>

            {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{problem.sourceAndYear}</span>
              <span aria-hidden="true">·</span>
              <span>Division: <strong className="font-medium text-slate-700">{problem.division}</strong></span>
              <span aria-hidden="true">·</span>
              <span>
                Difficulty: <strong className={`font-medium ${difficultyColor}`}>{problem.difficulty}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-600">
                Day {problem.scheduledDay}
                {problem.isMockPaper ? ` (${problem.mockPaperName})` : ''}
              </span>
              {problem.weakAreasTargeted.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-700 font-medium">
                    Targets: {problem.weakAreasTargeted.join(', ')}
                  </span>
                </>
              )}
            </div>

            {/* Unique linguistic concept taught */}
            <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
              <span className="font-medium text-slate-900">Teaches: </span>
              {problem.uniqueSkillTaught}
            </p>

            {/* Single-chapter placement explanation when bridging two chapters */}
            {problem.chapterPlacementReason && (
              <p className="text-xs text-slate-500 italic">
                Chapter Rationale: {problem.chapterPlacementReason}
              </p>
            )}

            {/* Personal note preview if present */}
            {hasNote && (
              <div className="pt-1 text-xs text-slate-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate max-w-2xl font-medium text-slate-700">
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
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80"
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
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? opt.activeClass
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>{hasNote ? 'Edit Note & PDF' : 'Notes & PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
