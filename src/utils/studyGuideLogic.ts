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

export type StatusMap = Record<number, ProblemStatus>;
export type NotesMap = Record<number, string>;

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

  if (problems.length !== 64) {
    errors.push(`Expected 64 problems, found ${problems.length}`);
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

  if (scheduledIds.length !== 64) {
    errors.push(`Expected 64 scheduled problems across 16 days, found ${scheduledIds.length}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
