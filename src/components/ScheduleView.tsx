import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertTriangle, Circle, BookOpen } from 'lucide-react';
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
  onOpenDetail: (problem: StudyProblem) => void;
}

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
    activeClass: 'bg-slate-800 text-white'
  },
  {
    value: 'In Progress',
    shortLabel: 'In Progress',
    icon: Clock,
    activeClass: 'bg-amber-600 text-white'
  },
  {
    value: 'Completed',
    shortLabel: 'Completed',
    icon: CheckCircle2,
    activeClass: 'bg-emerald-600 text-white'
  },
  {
    value: 'Review Needed',
    shortLabel: 'Review Needed',
    icon: AlertTriangle,
    activeClass: 'bg-rose-600 text-white'
  }
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  statusMap,
  onStatusChange,
  onOpenDetail
}) => {
  const reviewProblems = PROBLEMS.filter(
    (p) => getProblemStatus(statusMap, p.id) === 'Review Needed'
  );

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">
            16-Day Intensive Study Plan (13 Nov – 28 Nov 2026 · 4 Hours/Day)
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl">
            Ordered from highest-yield Round 1 chapters first (Ch 9 → Ch 6 → Ch 7 → Ch 5 → Ch 8 → Ch 4 → Ch 2). The 13 problems belonging to PLO 2022, PLO 2023 Senior, and PLO 2024 Senior are reserved unseen for Days 14–16 Timed Mock Exams.
          </p>
        </div>
        <div className="text-right font-mono tabular-nums text-xs text-slate-600 shrink-0">
          <div>Total Prep Budget: <strong>64 Hours</strong></div>
          <div>Exam Target: <strong>Sun, 29 Nov 2026</strong></div>
        </div>
      </div>

      {/* Day Cards Grid */}
      <div className="space-y-4">
        {SCHEDULE_DAYS.map((dayItem) => {
          const dayProblems =
            dayItem.day === 13
              ? reviewProblems
              : dayItem.problemIds
                  .map((id) => PROBLEMS.find((p) => p.id === id))
                  .filter((p): p is StudyProblem => Boolean(p));

          const dayStats = calculateProgressStats(dayProblems, statusMap);

          return (
            <section
              key={dayItem.day}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              {/* Day Header */}
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-semibold text-slate-900">Day {dayItem.day}</span>
                    <span aria-hidden="true">·</span>
                    <span>{dayItem.dateLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{dayItem.timeBreakdown}</span>
                    {dayItem.isMockExamDay && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-700 font-semibold">Timed Full Mock Exam</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {dayItem.focusTitle}
                  </h3>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">Theory Prerequisite: </strong>
                    {dayItem.theoryReading}
                  </p>
                </div>

                {dayProblems.length > 0 && (
                  <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-slate-600 shrink-0">
                    <span>
                      Completed: <strong>{dayStats.completed}/{dayStats.total}</strong> ({dayStats.completionPercent}%)
                    </span>
                    {dayStats.reviewNeeded > 0 && (
                      <span className="text-rose-700 font-semibold">
                        · {dayStats.reviewNeeded} Review Needed
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Day Problems List */}
              {dayProblems.length > 0 ? (
                <div className="divide-y divide-slate-200/80">
                  {dayProblems.map((prob) => {
                    const st = getProblemStatus(statusMap, prob.id);
                    return (
                      <div
                        key={prob.id}
                        className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="font-mono tabular-nums text-xs text-slate-400">
                              #{String(prob.id).padStart(2, '0')}
                            </span>
                            <button
                              type="button"
                              onClick={() => onOpenDetail(prob)}
                              className="text-sm font-semibold text-slate-900 hover:text-indigo-700 text-left cursor-pointer"
                            >
                              {prob.exactName}
                            </button>
                            <span className="text-xs text-slate-500">
                              · Ch {prob.chapterNumber} · {prob.difficulty} · {prob.sourceAndYear}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                            {prob.uniqueSkillTaught}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            role="group"
                            aria-label={`Day ${dayItem.day} status for ${prob.exactName}`}
                            className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200"
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
                                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                                    active
                                      ? btn.activeClass
                                      : 'text-slate-600 hover:text-slate-900'
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
                            onClick={() => onOpenDetail(prob)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 cursor-pointer"
                            aria-label={`Open PDF and notes for ${prob.exactName}`}
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-4 text-xs text-slate-600">
                  {dayItem.day === 13
                    ? 'No problems are currently marked "Review Needed". Any problem you mark as "Review Needed" during Days 1–12 will automatically appear here for your Day 13 consolidation redo!'
                    : 'No problems assigned.'}
                </div>
              )}

              {dayItem.mockNote && (
                <div className="px-5 py-2.5 bg-slate-50/50 border-t border-slate-200/70 text-xs text-slate-500 italic">
                  {dayItem.mockNote}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
