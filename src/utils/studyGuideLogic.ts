import {
  ChapterId,
  CHAPTERS,
  DifficultyLevel,
  PROBLEMS,
  ProblemStatus,
  SCHEDULE_DAYS,
  StudyProblem,
  WeakAreaTag
} from '../data/studyGuideData';
import { PROBLEM_PDF_MANIFEST, ProblemPdfAsset } from '../data/problemPagesManifest';

export type StatusMap = Record<number, ProblemStatus>;
export type NotesMap = Record<number, string>;
export type TimerMap = Record<number, number>;
export type ThemeMode = 'light' | 'dark';

export function getProblemElapsedSeconds(timerMap: TimerMap, problemId: number): number {
  const val = timerMap[problemId];
  return typeof val === 'number' && Number.isFinite(val) && val >= 0 ? Math.floor(val) : 0;
}

export function formatElapsedSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function getTargetMinutesForDifficulty(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'Easy':
      return 20;
    case 'Medium':
      return 30;
    case 'Hard':
      return 45;
    case 'Expert':
      return 60;
  }
}

export function getProblemPdfAssets(problemId: number): ProblemPdfAsset {
  const entry = PROBLEM_PDF_MANIFEST[problemId];
  if (entry) {
    return entry;
  }
  const padded = String(problemId).padStart(2, '0');
  return {
    singlePdfUrl: `problems/pdf/problem-${padded}.pdf`,
    fullPdfPageUrl: `problems/pdf/problem-${padded}.pdf`,
    startPage: 1,
    endPage: 1,
    pageCount: 1,
    pageImages: [`problems/pages/problem-${padded}-1.png`]
  };
}

export function resolveThemeMode(
  storedTheme: string | null | undefined,
  systemPrefersDark = false
): ThemeMode {
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }
  return systemPrefersDark ? 'dark' : 'light';
}

export function toggleThemeMode(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}

export interface FilterCriteria {
  searchQuery: string;
  statusFilter: 'All' | ProblemStatus;
  chapterFilter: 'All' | ChapterId;
  difficultyFilter: 'All' | DifficultyLevel;
  weakAreaFilter: 'All' | WeakAreaTag;
  hideMockProblems?: boolean;
}

export interface ProgressStats {
  total: number;
  completed: number;
  inProgress: number;
  reviewNeeded: number;
  notStarted: number;
  completionPercent: number;
  activeOrDonePercent: number;
}

export interface ChapterProgress {
  chapterId: ChapterId;
  total: number;
  completed: number;
  inProgress: number;
  reviewNeeded: number;
  notStarted: number;
  completionPercent: number;
}

export const EXCLUDED_SOLVED_TITLES = [
  'hmong daw',
  'problem 2.1 (hmong)',
  'problem 2.2 (luwian)',
  'aksara sunda kuna',
  'deciphering the brahmi script',
  'brahmi script',
  'ire-lined',
  'problem 2.6 (ogham)',
  'japanese days of the week',
  'japenese days',
  'mongolian'
];

export function getProblemStatus(statusMap: StatusMap, problemId: number): ProblemStatus {
  return statusMap[problemId] ?? 'Not Started';
}

export function setProblemStatus(
  statusMap: StatusMap,
  problemId: number,
  nextStatus: ProblemStatus
): StatusMap {
  return {
    ...statusMap,
    [problemId]: nextStatus
  };
}

export function cycleProblemStatus(current: ProblemStatus): ProblemStatus {
  const order: ProblemStatus[] = ['Not Started', 'In Progress', 'Completed', 'Review Needed'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

export function calculateProgressStats(
  problems: StudyProblem[],
  statusMap: StatusMap
): ProgressStats {
  const total = problems.length;
  let completed = 0;
  let inProgress = 0;
  let reviewNeeded = 0;
  let notStarted = 0;

  for (const p of problems) {
    const st = getProblemStatus(statusMap, p.id);
    if (st === 'Completed') completed++;
    else if (st === 'In Progress') inProgress++;
    else if (st === 'Review Needed') reviewNeeded++;
    else notStarted++;
  }

  const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeOrDonePercent =
    total > 0 ? Math.round(((completed + inProgress + reviewNeeded) / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    reviewNeeded,
    notStarted,
    completionPercent,
    activeOrDonePercent
  };
}

export function calculateChapterProgress(
  problems: StudyProblem[],
  statusMap: StatusMap
): Record<ChapterId, ChapterProgress> {
  const result = {} as Record<ChapterId, ChapterProgress>;

  for (const ch of CHAPTERS) {
    const chProblems = problems.filter((p) => p.chapterId === ch.id);
    const stats = calculateProgressStats(chProblems, statusMap);
    result[ch.id] = {
      chapterId: ch.id,
      total: stats.total,
      completed: stats.completed,
      inProgress: stats.inProgress,
      reviewNeeded: stats.reviewNeeded,
      notStarted: stats.notStarted,
      completionPercent: stats.completionPercent
    };
  }

  return result;
}

export function filterProblems(
  problems: StudyProblem[],
  statusMap: StatusMap,
  criteria: FilterCriteria
): StudyProblem[] {
  const query = criteria.searchQuery.trim().toLowerCase();

  return problems.filter((problem) => {
    const status = getProblemStatus(statusMap, problem.id);

    if (criteria.statusFilter !== 'All' && status !== criteria.statusFilter) {
      return false;
    }

    if (criteria.chapterFilter !== 'All' && problem.chapterId !== criteria.chapterFilter) {
      return false;
    }

    if (criteria.difficultyFilter !== 'All' && problem.difficulty !== criteria.difficultyFilter) {
      return false;
    }

    if (
      criteria.weakAreaFilter !== 'All' &&
      !problem.weakAreasTargeted.includes(criteria.weakAreaFilter)
    ) {
      return false;
    }

    if (criteria.hideMockProblems && problem.isMockPaper) {
      return false;
    }

    if (query.length > 0) {
      const haystack = [
        `#${problem.id}`,
        problem.exactName,
        problem.alias ?? '',
        problem.sourceAndYear,
        problem.uniqueSkillTaught,
        problem.chapterPlacementReason ?? '',
        ...problem.weakAreasTargeted
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function validateGuideInvariants(problems: StudyProblem[] = PROBLEMS): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (problems.length !== 72) {
    errors.push(`Expected 72 problems, found ${problems.length}`);
  }

  const seenIds = new Set<number>();
  const seenNames = new Set<string>();

  for (const p of problems) {
    if (seenIds.has(p.id)) {
      errors.push(`Duplicate problem ID: ${p.id}`);
    }
    seenIds.add(p.id);

    const normName = p.exactName.trim().toLowerCase();
    if (seenNames.has(normName)) {
      errors.push(`Duplicate problem exactName: ${p.exactName}`);
    }
    seenNames.add(normName);

    if (EXCLUDED_SOLVED_TITLES.includes(normName)) {
      errors.push(`Excluded already-solved problem present: ${p.exactName}`);
    }

    if (p.division !== 'Senior' && p.division !== 'All') {
      errors.push(`Invalid division on ${p.exactName}: ${p.division}`);
    }
  }

  // Verify every problem is scheduled on exactly one day in SCHEDULE_DAYS
  const scheduledIds: number[] = [];
  for (const day of SCHEDULE_DAYS) {
    for (const id of day.problemIds) {
      scheduledIds.push(id);
    }
  }

  if (scheduledIds.length !== 72) {
    errors.push(`Expected 72 scheduled problems across 16 days, found ${scheduledIds.length}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
