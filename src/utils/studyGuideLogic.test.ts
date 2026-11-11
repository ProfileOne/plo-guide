import test from 'node:test';
import assert from 'node:assert/strict';
import { PROBLEMS } from '../data/studyGuideData';
import {
  calculateChapterProgress,
  calculateProgressStats,
  cycleProblemStatus,
  filterProblems,
  formatElapsedSeconds,
  getProblemElapsedSeconds,
  getProblemPdfAssets,
  getProblemStatus,
  getTargetMinutesForDifficulty,
  resolveThemeMode,
  setProblemStatus,
  StatusMap,
  toggleThemeMode,
  validateGuideInvariants
} from './studyGuideLogic';

test('formatElapsedSeconds, getTargetMinutesForDifficulty, and getProblemElapsedSeconds format and compute timer state', () => {
  assert.equal(formatElapsedSeconds(0), '00:00');
  assert.equal(formatElapsedSeconds(65), '01:05');
  assert.equal(formatElapsedSeconds(1799), '29:59');
  assert.equal(formatElapsedSeconds(3661), '1:01:01');

  assert.equal(getTargetMinutesForDifficulty('Easy'), 20);
  assert.equal(getTargetMinutesForDifficulty('Medium'), 30);
  assert.equal(getTargetMinutesForDifficulty('Hard'), 45);
  assert.equal(getTargetMinutesForDifficulty('Expert'), 60);

  assert.equal(getProblemElapsedSeconds({}, 1), 0);
  assert.equal(getProblemElapsedSeconds({ 1: 425 }, 1), 425);
});

test('validateGuideInvariants confirms 72 problems, zero Junior-only, and zero excluded solved problems', () => {
  const check = validateGuideInvariants(PROBLEMS);
  assert.equal(check.valid, true, `Validation failed: ${check.errors.join('; ')}`);
  assert.equal(PROBLEMS.length, 72);
});

test('getProblemPdfAssets provides standalone single-problem PDF and page images for all 72 problems', () => {
  for (const problem of PROBLEMS) {
    const assets = getProblemPdfAssets(problem.id);
    const padded = String(problem.id).padStart(2, '0');
    assert.equal(assets.singlePdfUrl, `problems/pdf/problem-${padded}.pdf`);
    assert.equal(assets.pageImages.length >= 1, true);
    assert.equal(assets.pageImages[0], `problems/pages/problem-${padded}-1.png`);
    assert.equal(assets.fullPdfPageUrl.includes('#page='), true);
  }
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
  assert.equal(stats.total, 72);
  assert.equal(stats.completed, 2);
  assert.equal(stats.inProgress, 1);
  assert.equal(stats.reviewNeeded, 1);
  assert.equal(stats.notStarted, 68);
  assert.equal(stats.completionPercent, Math.round((2 / 72) * 100));

  const chProgress = calculateChapterProgress(PROBLEMS, statusMap);
  assert.equal(chProgress.ch9.total, 13);
  assert.equal(chProgress.ch9.completed, 2);
  assert.equal(chProgress.ch9.inProgress, 1);
  assert.equal(chProgress.ch6.total, 15);
  assert.equal(chProgress.ch6.reviewNeeded, 1);
});

test('filterProblems filters by status, chapter, difficulty, weak area, and search query', () => {
  const statusMap: StatusMap = {
    1: 'Completed',
    14: 'In Progress',
    37: 'Review Needed'
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

test('resolveThemeMode and toggleThemeMode handle stored and system dark mode preferences', () => {
  assert.equal(resolveThemeMode('dark', false), 'dark');
  assert.equal(resolveThemeMode('light', true), 'light');
  assert.equal(resolveThemeMode(null, true), 'dark');
  assert.equal(resolveThemeMode(undefined, false), 'light');
  assert.equal(toggleThemeMode('light'), 'dark');
  assert.equal(toggleThemeMode('dark'), 'light');
});
