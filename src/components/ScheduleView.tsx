import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Circle,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  PROBLEMS,
  ProblemStatus,
  SCHEDULE_DAYS,
  StudyProblem
} from '../data/studyGuideData';
import {
  calculateProgressStats,
  getProblemStatus,
  StatusMap
} from '../utils/studyGuideLogic';

interface ScheduleViewProps {
  statusMap: StatusMap;
  onStatusChange: (problemId: number, status: ProblemStatus) => void;
  onOpenDetail: (problem: StudyProblem, initialMode?: 'sheet' | 'pdf') => void;
  onOpenBookletModal: (title: string, pdfUrl: string, initialPage: number, subtitle?: string) => void;
}

const YELLOW_BOOK_URL = 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf';

const DAY_PDF_TARGET: Record<number, { title: string; pdfUrl: string; page: number }> = {
  1: { title: 'Yellow Book — Ch 2: Writing Systems (§2.1–2.11)', pdfUrl: YELLOW_BOOK_URL, page: 35 },
  2: { title: 'Yellow Book — Ch 4: Phonology (§4.1–4.6)', pdfUrl: YELLOW_BOOK_URL, page: 115 },
  3: { title: 'Yellow Book — Ch 5: Noun & Noun Phrase (§5.1–5.8)', pdfUrl: YELLOW_BOOK_URL, page: 169 },
  4: { title: 'Yellow Book — Ch 5 Practice & Solutions (§5.9–5.10)', pdfUrl: YELLOW_BOOK_URL, page: 204 },
  5: { title: 'Yellow Book — Ch 6: Verb & Verb Phrase (§6.1–6.6)', pdfUrl: YELLOW_BOOK_URL, page: 223 },
  6: { title: 'Yellow Book — Ch 6: Verb Hierarchy & Semantics (§6.7–6.8)', pdfUrl: YELLOW_BOOK_URL, page: 247 },
  7: { title: 'Yellow Book — Ch 6 Practice & Solutions (§6.9–6.10)', pdfUrl: YELLOW_BOOK_URL, page: 257 },
  8: { title: 'Yellow Book — Ch 7: Syntax & Alignment (§7.1–7.5)', pdfUrl: YELLOW_BOOK_URL, page: 281 },
  9: { title: 'Yellow Book — Ch 7 Practice & Solutions (§7.4–7.7)', pdfUrl: YELLOW_BOOK_URL, page: 293 },
  10: { title: 'Yellow Book — Ch 9: Number Systems (§9.1–9.5)', pdfUrl: YELLOW_BOOK_URL, page: 345 },
  11: { title: 'Yellow Book — Ch 9 Practice & Solutions (§9.6–9.7)', pdfUrl: YELLOW_BOOK_URL, page: 377 },
  12: { title: 'Yellow Book — Ch 8: Semantics & Kinship (§8.1–8.3)', pdfUrl: YELLOW_BOOK_URL, page: 323 },
  14: { title: 'PLO 2026 Senior & Junior (Mock Paper 1)', pdfUrl: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf', page: 1 },
  15: { title: 'PLO 2023 Senior (Mock Paper 2)', pdfUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf', page: 1 },
  16: { title: 'PLO 2024 Senior (Mock Paper 3)', pdfUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf', page: 1 }
};

const NEXT_STATUS_BUTTONS: {
  value: ProblemStatus;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
}[] = [
  {
    value: 'Not Started',
    shortLabel: 'Unstarted',
    icon: Circle,
    activeClass: 'bg-slate-800 dark:bg-neutral-700 text-white dark:text-[var(--dm-heading)]'
  },
  {
    value: 'In Progress',
    shortLabel: 'In Progress',
    icon: Clock,
    activeClass: 'bg-amber-600 dark:bg-neutral-600 text-white dark:text-[var(--dm-heading)]'
  },
  {
    value: 'Completed',
    shortLabel: 'Completed',
    icon: CheckCircle2,
    activeClass: 'bg-emerald-600 dark:bg-[#3a362e] text-white dark:text-[var(--dm-accent)]'
  },
  {
    value: 'Review Needed',
    shortLabel: 'Review Needed',
    icon: AlertTriangle,
    activeClass: 'bg-rose-600 dark:bg-[#3d2b2b] text-white dark:text-[#e2b4b4]'
  }
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  statusMap,
  onStatusChange,
  onOpenDetail,
  onOpenBookletModal
}) => {
  const [showPlanNote, setShowPlanNote] = useState(false);
  const [expandedProbIds, setExpandedProbIds] = useState<Record<number, boolean>>({});

  const toggleProbMore = (id: number) => {
    setExpandedProbIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const reviewProblems = PROBLEMS.filter(
    (p) => getProblemStatus(statusMap, p.id) === 'Review Needed'
  );

  return (
    <div className="space-y-4">
      {/* Minimal Intro Bar */}
      <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl px-5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
              16-Day Study Plan (13–28 Nov 2026)
            </h2>
            <button
              type="button"
              onClick={() => setShowPlanNote((v) => !v)}
              aria-expanded={showPlanNote}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] bg-slate-100 dark:bg-neutral-800/80 rounded cursor-pointer"
            >
              <span>{showPlanNote ? 'Hide Info' : 'More Info'}</span>
              {showPlanNote ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="font-mono tabular-nums text-xs text-slate-500 dark:text-[var(--dm-muted)]">
            <span>4h/day · 64h total · Target: </span>
            <strong className="text-slate-800 dark:text-[var(--dm-accent)]">Sun, 29 Nov 2026</strong>
          </div>
        </div>

        {showPlanNote && (
          <p className="mt-2 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">
            Ordered in Linguistic Progression (Ch 2 Writing Systems → Ch 4 Phonology → Ch 5 Noun &amp; NP → Ch 6 Verb &amp; VP → Ch 7 Syntax → Ch 9 Number Systems → Ch 8 Semantics). The 13 problems belonging to PLO 2026 Senior &amp; Junior, PLO 2023 Senior, and PLO 2024 Senior are reserved unseen for Days 14–16 Timed Mock Exams.
          </p>
        )}
      </div>

      {/* Day Cards Grid */}
      <div className="space-y-3">
        {SCHEDULE_DAYS.map((dayItem) => {
          const dayProblems =
            dayItem.day === 13
              ? reviewProblems
              : dayItem.problemIds
                  .map((id) => PROBLEMS.find((p) => p.id === id))
                  .filter((p): p is StudyProblem => Boolean(p));

          const dayStats = calculateProgressStats(dayProblems, statusMap);
          const pdfTarget = DAY_PDF_TARGET[dayItem.day];

          return (
            <section
              key={dayItem.day}
              className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden"
            >
              {/* Minimal Day Header */}
              <div className="px-5 py-3 bg-slate-50/80 dark:bg-[#101010] border-b border-slate-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-[var(--dm-accent)] shrink-0" />
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-[var(--dm-accent)]">
                      Day {dayItem.day} ({dayItem.dateLabel})
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-[var(--dm-heading)]">
                      · {dayItem.focusTitle}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-[var(--dm-body)]">
                    <span>
                      <strong className="text-slate-700 dark:text-[var(--dm-heading)]">Theory: </strong>
                      {dayItem.theoryReading}
                    </span>
                    <span className="text-slate-400 dark:text-[var(--dm-muted)] font-mono">
                      ({dayItem.timeBreakdown})
                    </span>
                    {pdfTarget && (
                      <button
                        type="button"
                        data-testid={`day-${dayItem.day}-theory-pdf-btn`}
                        onClick={() =>
                          onOpenBookletModal(
                            pdfTarget.title,
                            pdfTarget.pdfUrl,
                            pdfTarget.page,
                            dayItem.theoryReading
                          )
                        }
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700 dark:text-[var(--dm-accent)] bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer"
                      >
                        <FileText className="w-3 h-3 shrink-0" />
                        <span>
                          {dayItem.day >= 14 ? 'Open Mock Booklet PDF' : `Open Yellow Book (PDF p. ${pdfTarget.page})`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {dayProblems.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-slate-500 dark:text-[var(--dm-muted)] shrink-0">
                    <span>
                      <strong className="text-slate-800 dark:text-[var(--dm-heading)]">{dayStats.completed}/{dayStats.total}</strong> ({dayStats.completionPercent}%)
                    </span>
                    {dayStats.reviewNeeded > 0 && (
                      <span className="text-rose-700 dark:text-[var(--dm-accent)] font-semibold">
                        · {dayStats.reviewNeeded} Review
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Day Problems List (Compact 1-Line Rows with Click-to-Expand "More") */}
              {dayProblems.length > 0 ? (
                <div className="divide-y divide-slate-200/70 dark:divide-neutral-800/80">
                  {dayProblems.map((prob) => {
                    const st = getProblemStatus(statusMap, prob.id);
                    const isMoreOpen = Boolean(expandedProbIds[prob.id]);
                    return (
                      <div
                        key={prob.id}
                        className="px-5 py-2.5 hover:bg-slate-50/70 dark:hover:bg-neutral-800/60"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
                            <span className="font-mono tabular-nums text-xs text-slate-400 dark:text-[var(--dm-muted)] w-6">
                              #{String(prob.id).padStart(2, '0')}
                            </span>
                            <button
                              type="button"
                              onClick={() => onOpenDetail(prob, 'sheet')}
                              className="text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)] hover:text-indigo-700 dark:hover:text-[var(--dm-accent)] text-left cursor-pointer"
                            >
                              {prob.exactName}
                            </button>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-[var(--dm-muted)]">
                              Ch {prob.chapterNumber} · {prob.difficulty}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleProbMore(prob.id)}
                              aria-expanded={isMoreOpen}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] font-medium text-slate-400 dark:text-[var(--dm-muted)] hover:text-slate-800 dark:hover:text-[var(--dm-heading)] hover:bg-slate-100 dark:hover:bg-neutral-800 rounded cursor-pointer"
                            >
                              <span>{isMoreOpen ? 'Less' : 'More'}</span>
                              {isMoreOpen ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <div
                              role="group"
                              aria-label={`Day ${dayItem.day} status for ${prob.exactName}`}
                              className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700"
                            >
                              {NEXT_STATUS_BUTTONS.map((btn) => {
                                const Icon = btn.icon;
                                const active = st === btn.value;
                                return (
                                  <button
                                    key={btn.value}
                                    type="button"
                                    onClick={() => onStatusChange(prob.id, btn.value)}
                                    aria-pressed={active}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md cursor-pointer whitespace-nowrap ${
                                      active
                                        ? btn.activeClass
                                        : 'text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)]'
                                    }`}
                                  >
                                    <Icon className="w-3 h-3 shrink-0" />
                                    <span>{btn.shortLabel}</span>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenDetail(prob, 'sheet')}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:text-[var(--dm-heading)] border border-slate-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 cursor-pointer whitespace-nowrap"
                              aria-label={`Open problem sheet for ${prob.exactName}`}
                            >
                              <BookOpen className="w-3 h-3 text-slate-600 dark:text-[var(--dm-accent)]" />
                              <span>Open Problem</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onOpenDetail(prob, 'pdf')}
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] border border-slate-200 dark:border-neutral-700 rounded-lg bg-slate-50 dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer whitespace-nowrap"
                              aria-label={`Open interactive PDF for ${prob.exactName}`}
                            >
                              <FileText className="w-3 h-3 text-slate-500 dark:text-[var(--dm-accent)]" />
                              <span>PDF</span>
                            </button>
                          </div>
                        </div>

                        {isMoreOpen && (
                          <div className="mt-2 pl-8 pr-2 py-1.5 border-l-2 border-slate-200 dark:border-neutral-800 space-y-1 text-xs text-slate-600 dark:text-[var(--dm-body)]">
                            <p>
                              <strong className="text-slate-800 dark:text-[var(--dm-accent)]">Teaches: </strong>
                              {prob.uniqueSkillTaught}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-[var(--dm-muted)]">
                              <strong className="text-slate-700 dark:text-[var(--dm-body)]">Source: </strong>
                              {prob.sourceAndYear} · Division: {prob.division}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-3 text-xs text-slate-500 dark:text-[var(--dm-body)]">
                  {dayItem.day === 13
                    ? 'No problems currently marked "Review Needed". Flag any problem during Days 1–12 to queue it here for Day 13.'
                    : 'No problems assigned.'}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
