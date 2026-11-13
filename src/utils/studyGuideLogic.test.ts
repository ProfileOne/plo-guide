import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CHAPTERS, PROBLEMS, SCHEDULE_DAYS } from '../data/studyGuideData';
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

test('Yellow Book chapter sections, 16-day schedule readings, and PLO 2026 labels match official pages', () => {
  for (const ch of CHAPTERS) {
    for (const sec of ch.theorySections) {
      assert.equal(sec.pages.includes('[PDF p'), true, `Expected PDF page citation in ${sec.pages}`);
    }
  }

  for (const day of SCHEDULE_DAYS) {
    if (day.day >= 1 && day.day <= 12) {
      assert.equal(
        day.theoryReading.includes('[PDF pp.'),
        true,
        `Day ${day.day} theoryReading should include [PDF pp. ...]`
      );
    }
  }

  const day14 = SCHEDULE_DAYS.find((d) => d.day === 14);
  assert.equal(day14?.focusTitle.includes('PLO 2026'), true);
  assert.deepEqual(day14?.problemIds, [65, 68, 42]);
  for (const id of [65, 68, 42]) {
    const p = PROBLEMS.find((prob) => prob.id === id);
    assert.equal(p?.sourceAndYear.includes('PLO 2026'), true);
  }
});

test('validateGuideInvariants confirms 72 problems, zero Junior-only, and zero excluded solved problems', () => {
  const check = validateGuideInvariants(PROBLEMS);
  assert.equal(check.valid, true, `Validation failed: ${check.errors.join('; ')}`);
  assert.equal(PROBLEMS.length, 72);
});

test('CHAPTERS and PROBLEMS are ordered sequentially #01 to #72 in linguistic progression (Ch 2 -> Ch 4 -> Ch 5 -> Ch 6 -> Ch 7 -> Ch 9 -> Ch 8)', () => {
  const chapterOrder = CHAPTERS.map((ch) => ch.id);
  assert.deepEqual(chapterOrder, ['ch2', 'ch4', 'ch5', 'ch6', 'ch7', 'ch9', 'ch8']);
  for (let i = 0; i < CHAPTERS.length; i++) {
    assert.equal(CHAPTERS[i].priorityRank, i + 1);
    assert.equal(CHAPTERS[i].prerequisiteNote.length > 10, true);
  }

  // Verify problem #1 is the first problem in Chapter 2 (Writing Systems) and IDs run 1..72 sequentially across chapters
  assert.equal(PROBLEMS[0].id, 1);
  assert.equal(PROBLEMS[0].chapterId, 'ch2');
  assert.equal(PROBLEMS[0].exactName, 'Problem 3: Tenji Braille');

  let lastChapterRank = 0;
  for (let i = 0; i < PROBLEMS.length; i++) {
    assert.equal(PROBLEMS[i].id, i + 1);
    const chRank = chapterOrder.indexOf(PROBLEMS[i].chapterId);
    assert.equal(chRank >= lastChapterRank, true, `Problem #${PROBLEMS[i].id} out of chapter order`);
    lastChapterRank = chRank;
  }
});

test('getProblemPdfAssets provides synchronized standalone single-problem PDF and page images on disk for all 72 problems', () => {
  for (const problem of PROBLEMS) {
    const assets = getProblemPdfAssets(problem.id);
    const padded = String(problem.id).padStart(2, '0');
    assert.equal(assets.singlePdfUrl, `problems/pdf/problem-${padded}.pdf`);
    assert.equal(assets.pageImages.length, assets.pageCount);
    assert.equal(assets.pageImages[0], `problems/pages/problem-${padded}-1.png`);
    assert.equal(assets.fullPdfPageUrl.includes('#page='), true);
    assert.equal(
      problem.pdfUrl.split('#')[0],
      assets.fullPdfPageUrl.split('#')[0],
      `Problem #${padded} (${problem.exactName}) pdfUrl (${problem.pdfUrl}) does not match manifest fullPdfPageUrl (${assets.fullPdfPageUrl})`
    );

    const pdfDiskPath = path.join(process.cwd(), 'public', assets.singlePdfUrl);
    assert.equal(fs.existsSync(pdfDiskPath), true, `Missing standalone PDF on disk: ${pdfDiskPath}`);
    assert.equal(fs.statSync(pdfDiskPath).size > 500, true, `Empty standalone PDF on disk: ${pdfDiskPath}`);

    for (const imgRelPath of assets.pageImages) {
      const imgDiskPath = path.join(process.cwd(), 'public', imgRelPath);
      assert.equal(fs.existsSync(imgDiskPath), true, `Missing page image on disk: ${imgDiskPath}`);
      assert.equal(fs.statSync(imgDiskPath).size > 1000, true, `Empty page image on disk: ${imgDiskPath}`);
    }
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
    51: 'Completed',
    52: 'Completed',
    53: 'In Progress',
    22: 'Review Needed'
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
    22: 'In Progress',
    45: 'Review Needed'
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
