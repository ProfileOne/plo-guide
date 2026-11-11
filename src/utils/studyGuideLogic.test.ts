import test from 'node:test';
import assert from 'node:assert/strict';
import { PROBLEMS } from '../data/studyGuideData';
import {
  calculateChapterProgress,
  calculateProgressStats,
  cycleProblemStatus,
  filterProblems,
  getProblemStatus,
  setProblemStatus,
  StatusMap,
  validateGuideInvariants
} from './studyGuideLogic';

test('validateGuideInvariants confirms 64 problems, zero Junior-only, and zero excluded solved problems', () => {
  const check = validateGuideInvariants(PROBLEMS);
  assert.equal(check.valid, true, `Validation failed: ${check.errors.join('; ')}`);
  assert.equal(PROBLEMS.length, 64);
});

test('setProblemStatus and cycleProblemStatus transition through In Progress, Completed, and Review Needed', () => {
  let map: StatusMap = {};
  assert.equal(getProblemStatus(map, 1), 'Not Started');

  map = setProblemStatus(map, 1, 'In Progress');
  assert.equal(getProblemStatus(map, 1), 'In Progress');

  map = setProblemStatus(map, 1, 'Completed');
  assert.equal(getProblemStatus(map, 1), 'Completed');

  map = setProblemStatus(map, 1, 'Review Needed');
  assert.equal(getProblemStatus(map, 1), 'Review Needed');

  assert.equal(cycleProblemStatus('Not Started'), 'In Progress');
  assert.equal(cycleProblemStatus('In Progress'), 'Completed');
  assert.equal(cycleProblemStatus('Completed'), 'Review Needed');
  assert.equal(cycleProblemStatus('Review Needed'), 'Not Started');
});

test('calculateProgressStats and calculateChapterProgress compute accurate counts and percentages', () => {
  const statusMap: StatusMap = {
    1: 'Completed',
    2: 'Completed',
    3: 'In Progress',
    14: 'Review Needed'
  };

  const stats = calculateProgressStats(PROBLEMS, statusMap);
  assert.equal(stats.total, 64);
  assert.equal(stats.completed, 2);
  assert.equal(stats.inProgress, 1);
  assert.equal(stats.reviewNeeded, 1);
  assert.equal(stats.notStarted, 60);
  assert.equal(stats.completionPercent, Math.round((2 / 64) * 100));

  const chProgress = calculateChapterProgress(PROBLEMS, statusMap);
  assert.equal(chProgress.ch9.total, 12);
  assert.equal(chProgress.ch9.completed, 2);
  assert.equal(chProgress.ch9.inProgress, 1);
  assert.equal(chProgress.ch6.total, 13);
  assert.equal(chProgress.ch6.reviewNeeded, 1);
});

test('filterProblems filters by status, chapter, difficulty, weak area, and search query', () => {
  const statusMap: StatusMap = {
    1: 'Completed',
    14: 'In Progress',
    34: 'Review Needed'
  };

  const reviewOnly = filterProblems(PROBLEMS, statusMap, {
    searchQuery: '',
    statusFilter: 'Review Needed',
    chapterFilter: 'All',
    difficultyFilter: 'All',
    weakAreaFilter: 'All'
  });
  assert.equal(reviewOnly.length, 1);
  assert.equal(reviewOnly[0].exactName, '4. Wiradjuri');

  const ergativeSearch = filterProblems(PROBLEMS, statusMap, {
    searchQuery: 'split ergativity',
    statusFilter: 'All',
    chapterFilter: 'All',
    difficultyFilter: 'All',
    weakAreaFilter: 'All'
  });
  assert.equal(ergativeSearch.some((p) => p.exactName === '4. Wiradjuri'), true);

  const evidentialWeakArea = filterProblems(PROBLEMS, statusMap, {
    searchQuery: '',
    statusFilter: 'All',
    chapterFilter: 'All',
    difficultyFilter: 'All',
    weakAreaFilter: 'Evidentiality'
  });
  assert.equal(evidentialWeakArea.length, 4);
});
