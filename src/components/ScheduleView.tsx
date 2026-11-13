import React, { useState } from 'react';
import {
  Calendar,
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
  activeClass: string;
}[] = [
  {
    value: 'Not Started',
    shortLabel: 'Todo',
    activeClass: 'bg-slate-800 dark:bg-neutral-700 text-white dark:text-[var(--dm-heading)]'
  },
  {
    value: 'In Progress',
    shortLabel: 'Doing',
    activeClass: 'bg-amber-600 dark:bg-neutral-600 text-white dark:text-[var(--dm-heading)]'
  },
  {
    value: 'Completed',
    shortLabel: 'Done',
    activeClass: 'bg-emerald-600 dark:bg-[#3a362e] text-white dark:text-[var(--dm-accent)]'
  },
  {
    value: 'Review Needed',
    shortLabel: 'Review',
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
  const [expandAllDayInfo, setExpandAllDayInfo] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({});
  const [expandedDayTheory, setExpandedDayTheory] = useState<Record<number, boolean>>({});
  const [expandedProbIds, setExpandedProbIds] = useState<Record<number, boolean>>({});

  const allDaysCollapsed = SCHEDULE_DAYS.every((d) => Boolean(collapsedDays[d.day]));

  const toggleAllDays = () => {
    if (allDaysCollapsed) {
      setCollapsedDays({});
    } else {
      const next: Record<number, boolean> = {};
      for (const d of SCHEDULE_DAYS) {
        next[d.day] = true;
      }
      setCollapsedDays(next);
    }
  };

  const toggleDayCollapse = (day: number) => {
    setCollapsedDays((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const toggleDayTheory = (day: number) => {
    setExpandedDayTheory((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

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
    <div className="space-y-3">
      {/* Minimal Single-Line Intro & View Controls Bar */}
      <div className="bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
              16-Day Study Plan (13–28 Nov 2026)
            </h2>
            <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-[var(--dm-muted)]">
              4h/day · Target: 29 Nov 2026
            </span>
            <button
              type="button"
              onClick={() => setShowPlanNote((v) => !v)}
              aria-expanded={showPlanNote}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] rounded cursor-pointer"
            >
              <span>{showPlanNote ? 'Less' : 'About'}</span>
              {showPlanNote ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setExpandAllDayInfo((v) => !v)}
              aria-pressed={expandAllDayInfo}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] bg-slate-100/80 dark:bg-neutral-800/80 rounded cursor-pointer"
            >
              <span>{expandAllDayInfo ? 'Minimal View' : 'Expand All Info'}</span>
              {expandAllDayInfo ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleAllDays}
              aria-pressed={allDaysCollapsed}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] bg-slate-100/80 dark:bg-neutral-800/80 rounded cursor-pointer"
            >
              <span>{allDaysCollapsed ? 'Expand All Days' : 'Collapse All Days'}</span>
              {allDaysCollapsed ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {showPlanNote && (
          <p className="mt-2 pt-2 border-t border-slate-100 dark:border-neutral-800/80 text-xs text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">
            Ordered in Linguistic Progression (Ch 2 Writing Systems → Ch 4 Phonology → Ch 5 Noun &amp; NP → Ch 6 Verb &amp; VP → Ch 7 Syntax → Ch 9 Number Systems → Ch 8 Semantics). The 13 problems belonging to PLO 2026 Senior &amp; Junior, PLO 2023 Senior, and PLO 2024 Senior are reserved unseen for Days 14–16 Timed Mock Exams.
          </p>
        )}
      </div>

      {/* Day Cards List */}
      <div className="space-y-2.5">
        {SCHEDULE_DAYS.map((dayItem) => {
          const dayProblems =
            dayItem.day === 13
              ? reviewProblems
              : dayItem.problemIds
                  .map((id) => PROBLEMS.find((p) => p.id === id))
                  .filter((p): p is StudyProblem => Boolean(p));

          const dayStats = calculateProgressStats(dayProblems, statusMap);
          const pdfTarget = DAY_PDF_TARGET[dayItem.day];
          const isDayCollapsed = Boolean(collapsedDays[dayItem.day]);
          const isTheoryOpen = expandAllDayInfo || Boolean(expandedDayTheory[dayItem.day]);

          // Split focusTitle at "—" so the 1-line header stays short and clean, while keeping the full subtitle in Theory & Info
          const [shortFocusTitle, focusTopicsDetail] = dayItem.focusTitle.split(/\s*—\s*/);
          const shortDate = dayItem.dateLabel.replace(/\s+2026$/, '');

          return (
            <section
              key={dayItem.day}
              className="bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg overflow-hidden"
            >
              {/* Ultra-Minimal 1-Line Day Header */}
              <div
                className={`px-4 py-2 bg-slate-50/40 dark:bg-[#0f0f0f] ${
                  !isDayCollapsed ? 'border-b border-slate-100 dark:border-neutral-800/80' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Left: Day + Short Date + Short Focus Title */}
                  <div className="min-w-0 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDayCollapse(dayItem.day)}
                      aria-expanded={!isDayCollapsed}
                      className="inline-flex items-center gap-1.5 text-left cursor-pointer group/day"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[var(--dm-accent)] shrink-0" />
                      <span className="text-xs font-mono font-semibold text-slate-800 dark:text-[var(--dm-accent)]">
                        Day {dayItem.day}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-[var(--dm-muted)]">
                        ({shortDate})
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)] group-hover/day:text-slate-600 dark:group-hover/day:text-[var(--dm-accent)]">
                        · {shortFocusTitle}
                      </span>
                    </button>

                    <span className="text-[11px] font-mono text-slate-400 dark:text-[var(--dm-muted)]">
                      · {dayProblems.length} {dayProblems.length === 1 ? 'Prob' : 'Probs'}
                    </span>
                  </div>

                  {/* Right: Progress + PDF Button + Theory & Info Toggle + Collapse Day Button */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {dayProblems.length > 0 && (
                      <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-[var(--dm-muted)]">
                        <strong className="text-slate-800 dark:text-[var(--dm-heading)]">
                          {dayStats.completed}/{dayStats.total}
                        </strong>{' '}
                        ({dayStats.completionPercent}%)
                        {dayStats.reviewNeeded > 0 && (
                          <span className="text-rose-700 dark:text-[var(--dm-accent)]">
                            {' '}· {dayStats.reviewNeeded} Review
                          </span>
                        )}
                      </span>
                    )}

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
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-slate-600 dark:text-[var(--dm-accent)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-200/60 dark:hover:bg-neutral-800 rounded cursor-pointer whitespace-nowrap"
                      >
                        <FileText className="w-3 h-3 shrink-0" />
                        <span>
                          {dayItem.day >= 14 ? 'Mock PDF' : `Book p. ${pdfTarget.page}`}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleDayTheory(dayItem.day)}
                      aria-expanded={isTheoryOpen}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-200/60 dark:hover:bg-neutral-800 rounded cursor-pointer whitespace-nowrap"
                    >
                      <span>{isTheoryOpen ? 'Hide Reading' : 'Reading & Info'}</span>
                      {isTheoryOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleDayCollapse(dayItem.day)}
                      aria-label={isDayCollapsed ? `Expand Day ${dayItem.day} problems` : `Collapse Day ${dayItem.day} problems`}
                      className="p-1 text-slate-400 dark:text-[var(--dm-muted)] hover:text-slate-800 dark:hover:text-[var(--dm-heading)] rounded cursor-pointer"
                    >
                      {isDayCollapsed ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Day Reading, Full Topics & Time Allocation */}
                {isTheoryOpen && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-neutral-800/70 space-y-1 text-xs text-slate-600 dark:text-[var(--dm-body)]">
                    {focusTopicsDetail && (
                      <p>
                        <strong className="font-medium text-slate-800 dark:text-[var(--dm-heading)]">Focus Topics: </strong>
                        {focusTopicsDetail}
                      </p>
                    )}
                    <p>
                      <strong className="font-medium text-slate-800 dark:text-[var(--dm-heading)]">Reading: </strong>
                      {dayItem.theoryReading}
                      <span className="font-mono text-slate-400 dark:text-[var(--dm-muted)]">
                        {' '}· {dayItem.timeBreakdown} · {dayItem.dateLabel}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Day Problems List (Compact 1-Line Rows with Click-to-Expand "More") */}
              {!isDayCollapsed && (
                dayProblems.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-neutral-800/70">
                    {dayProblems.map((prob) => {
                      const st = getProblemStatus(statusMap, prob.id);
                      const isMoreOpen = expandAllDayInfo || Boolean(expandedProbIds[prob.id]);
                      return (
                        <div
                          key={prob.id}
                          className="group px-4 py-1.5 hover:bg-slate-50/50 dark:hover:bg-[#161616]"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
                              <span className="font-mono tabular-nums text-xs text-slate-400 dark:text-[var(--dm-muted)] w-6">
                                #{String(prob.id).padStart(2, '0')}
                              </span>
                              <button
                                type="button"
                                onClick={() => onOpenDetail(prob, 'sheet')}
                                className="text-[13px] sm:text-sm font-medium text-slate-900 dark:text-[var(--dm-heading)] hover:text-slate-600 dark:hover:text-[var(--dm-accent)] text-left cursor-pointer"
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
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] text-slate-400 dark:text-[var(--dm-muted)] hover:text-slate-800 dark:hover:text-[var(--dm-heading)] rounded cursor-pointer"
                              >
                                <span>{isMoreOpen ? 'Less' : 'More'}</span>
                                {isMoreOpen ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 pl-8 sm:pl-0">
                              <div
                                role="group"
                                aria-label={`Day ${dayItem.day} status for ${prob.exactName}`}
                                className={`inline-flex items-center p-0.5 rounded transition-opacity duration-150 ${
                                  st === 'Not Started'
                                    ? 'opacity-55 group-hover:opacity-100 focus-within:opacity-100'
                                    : 'opacity-100'
                                }`}
                              >
                                {NEXT_STATUS_BUTTONS.map((btn) => {
                                  const active = st === btn.value;
                                  return (
                                    <button
                                      key={btn.value}
                                      type="button"
                                      onClick={() => onStatusChange(prob.id, btn.value)}
                                      aria-pressed={active}
                                      className={`px-1.5 py-0.5 text-[11px] rounded-xs cursor-pointer whitespace-nowrap ${
                                        active
                                          ? btn.activeClass
                                          : 'text-slate-400 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)]'
                                      }`}
                                    >
                                      {btn.shortLabel}
                                    </button>
                                  );
                                })}
                              </div>

                              <span className="text-slate-200 dark:text-neutral-800 select-none" aria-hidden="true">|</span>

                              <button
                                type="button"
                                onClick={() => onOpenDetail(prob, 'sheet')}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-[var(--dm-heading)] hover:bg-slate-100 dark:hover:bg-neutral-800 rounded cursor-pointer whitespace-nowrap"
                                aria-label={`Open problem sheet for ${prob.exactName}`}
                              >
                                <BookOpen className="w-3 h-3 text-slate-400 dark:text-[var(--dm-accent)]" />
                                <span>Sheet</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onOpenDetail(prob, 'pdf')}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-100 dark:hover:bg-neutral-800 rounded cursor-pointer whitespace-nowrap"
                                aria-label={`Open interactive PDF for ${prob.exactName}`}
                              >
                                <FileText className="w-3 h-3 text-slate-400 dark:text-[var(--dm-accent)]" />
                                <span>PDF</span>
                              </button>
                            </div>
                          </div>

                          {isMoreOpen && (
                            <div className="mt-2 pt-2 pl-8 pr-2 border-t border-slate-100 dark:border-neutral-800/70 space-y-1 text-xs text-slate-600 dark:text-[var(--dm-body)]">
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
                  <div className="px-4 py-2 text-xs text-slate-500 dark:text-[var(--dm-body)]">
                    {dayItem.day === 13
                      ? 'No problems currently marked "Review Needed". Flag any problem during Days 1–12 to queue it here for Day 13.'
                      : 'No problems assigned.'}
                  </div>
                )
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
