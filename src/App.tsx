import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookOpen,
  RotateCcw,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Moon,
  Sun
} from 'lucide-react';
import {
  ChapterId,
  CHAPTERS,
  DifficultyLevel,
  PROBLEMS,
  ProblemStatus,
  StudyProblem,
  WeakAreaTag
} from './data/studyGuideData';
import {
  calculateChapterProgress,
  calculateProgressStats,
  filterProblems,
  getProblemStatus,
  NotesMap,
  resolveThemeMode,
  setProblemStatus,
  StatusMap,
  ThemeMode,
  toggleThemeMode
} from './utils/studyGuideLogic';
import { ProblemRow } from './components/ProblemRow';
import { ProblemDetailDrawer } from './components/ProblemDetailDrawer';
import { ScheduleView } from './components/ScheduleView';
import { CorpusReferenceView } from './components/CorpusReferenceView';

const STORAGE_STATUS_KEY = 'plo_senior_64_guide_status_v1';
const STORAGE_NOTES_KEY = 'plo_senior_64_guide_notes_v1';
const STORAGE_THEME_KEY = 'plo_senior_64_guide_theme_v1';
const YELLOW_BOOK_PDF_URL =
  'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf';

const WEAK_AREAS: WeakAreaTag[] = [
  'Morphosyntactic Alignment',
  'Pronoun Hierarchy',
  'Evidentiality',
  'Infixes & Transfixes',
  'Alienable vs. Inalienable Possession',
  'TAM (Tense, Aspect, Mood)'
];

type ActiveTab = 'guide' | 'schedule' | 'reference';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('guide');

  // Persistent theme mode ('light' | 'dark')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      const prefersDark =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved = resolveThemeMode(saved, prefersDark);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', resolved === 'dark');
      }
      return resolved;
    } catch {
      return 'light';
    }
  });

  // Persistent status map
  const [statusMap, setStatusMap] = useState<StatusMap>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_STATUS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Persistent personal notes map
  const [notesMap, setNotesMap] = useState<NotesMap>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_NOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProblemStatus>('All');
  const [chapterFilter, setChapterFilter] = useState<'All' | ChapterId>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | DifficultyLevel>('All');
  const [weakAreaFilter, setWeakAreaFilter] = useState<'All' | WeakAreaTag>('All');
  const [hideMockProblems, setHideMockProblems] = useState(false);

  // Expanded theory panels per chapter
  const [expandedTheory, setExpandedTheory] = useState<Record<string, boolean>>({
    ch9: true,
    ch6: true
  });

  // Active drawer problem
  const [selectedProblem, setSelectedProblem] = useState<StudyProblem | null>(null);

  // Inline confirmation for reset
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // Ignore storage quota errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATUS_KEY, JSON.stringify(statusMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [statusMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notesMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [notesMap]);

  const handleToggleTheme = () => {
    setTheme((prev) => toggleThemeMode(prev));
  };

  const handleStatusChange = (problemId: number, nextStatus: ProblemStatus) => {
    setStatusMap((prev) => setProblemStatus(prev, problemId, nextStatus));
  };

  const handleSaveNote = (problemId: number, note: string) => {
    setNotesMap((prev) => ({
      ...prev,
      [problemId]: note
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setChapterFilter('All');
    setDifficultyFilter('All');
    setWeakAreaFilter('All');
    setHideMockProblems(false);
  };

  const handleExportProgress = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      targetExam: 'PLO Senior Round 1 (29 Nov 2026)',
      stats: calculateProgressStats(PROBLEMS, statusMap),
      problems: PROBLEMS.map((p) => ({
        id: p.id,
        exactName: p.exactName,
        chapterNumber: p.chapterNumber,
        scheduledDay: p.scheduledDay,
        status: getProblemStatus(statusMap, p.id),
        note: notesMap[p.id] ?? ''
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plo-senior-64-study-guide-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.problems)) {
          const nextStatuses: StatusMap = {};
          const nextNotes: NotesMap = {};
          for (const item of parsed.problems) {
            if (typeof item.id === 'number' && item.status) {
              nextStatuses[item.id] = item.status;
            }
            if (typeof item.id === 'number' && typeof item.note === 'string') {
              nextNotes[item.id] = item.note;
            }
          }
          setStatusMap(nextStatuses);
          setNotesMap(nextNotes);
        }
      } catch {
        // Ignore invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const overallStats = useMemo(
    () => calculateProgressStats(PROBLEMS, statusMap),
    [statusMap]
  );

  const chapterProgressMap = useMemo(
    () => calculateChapterProgress(PROBLEMS, statusMap),
    [statusMap]
  );

  const filteredProblems = useMemo(
    () =>
      filterProblems(PROBLEMS, statusMap, {
        searchQuery,
        statusFilter,
        chapterFilter,
        difficultyFilter,
        weakAreaFilter,
        hideMockProblems
      }),
    [
      statusMap,
      searchQuery,
      statusFilter,
      chapterFilter,
      difficultyFilter,
      weakAreaFilter,
      hideMockProblems
    ]
  );

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    chapterFilter !== 'All' ||
    difficultyFilter !== 'All' ||
    weakAreaFilter !== 'All' ||
    hideMockProblems;

  const toggleTheory = (chId: string) => {
    setExpandedTheory((prev) => ({
      ...prev,
      [chId]: !prev[chId]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-neutral-100 transition-colors duration-150">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('guide');
          }}
          className="text-base font-bold tracking-tight text-slate-900 dark:text-neutral-100 whitespace-nowrap shrink-0 font-display"
        >
          PLO Senior Prep · 64-Problem Guide
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary views"
          className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-neutral-400 overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'guide'
                ? 'border-indigo-600 dark:border-neutral-100 text-slate-900 dark:text-neutral-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
          >
            64-Problem Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'schedule'
                ? 'border-indigo-600 dark:border-neutral-100 text-slate-900 dark:text-neutral-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
          >
            16-Day Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reference')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'reference'
                ? 'border-indigo-600 dark:border-neutral-100 text-slate-900 dark:text-neutral-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
          >
            Pattern Landscape & Flags
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportProgress}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white dark:text-neutral-950 bg-slate-900 dark:bg-neutral-100 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Study Log</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Top Interactive KPI Progress Bar */}
        <section
          aria-label="Study guide progress summary"
          className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-neutral-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight">
                Panini Linguistics Olympiad (Senior Round 1) — 64-Problem Study Guide
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 mt-0.5">
                Curated from 209 Senior/All problems across 11 files · Ordered by Yellow Book Chapter yield · Zero pure Junior or previously solved problems
              </p>
            </div>

            {/* Right: Overall Progress Bar + Theme Mode Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="w-full sm:w-64 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="font-semibold text-slate-700 dark:text-neutral-300">
                    Overall Completion
                  </span>
                  <span className="font-bold text-slate-900 dark:text-neutral-100" data-testid="overall-completion-label">
                    {overallStats.completed} / {overallStats.total} ({overallStats.completionPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-600 transition-all duration-200"
                    style={{ width: `${(overallStats.completed / 64) * 100}%` }}
                    title={`Completed: ${overallStats.completed}`}
                  />
                  <div
                    className="bg-amber-500 transition-all duration-200"
                    style={{ width: `${(overallStats.inProgress / 64) * 100}%` }}
                    title={`In Progress: ${overallStats.inProgress}`}
                  />
                  <div
                    className="bg-rose-500 transition-all duration-200"
                    style={{ width: `${(overallStats.reviewNeeded / 64) * 100}%` }}
                    title={`Review Needed: ${overallStats.reviewNeeded}`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-200/70 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4-Column Interactive Status Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Completed' ? 'All' : 'Completed');
              }}
              className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                statusFilter === 'Completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500'
                  : 'bg-slate-50/70 dark:bg-neutral-950/60 border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-neutral-300">
                <span>Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-neutral-100 font-mono tabular-nums mt-1"
                data-testid="count-completed"
              >
                {overallStats.completed}
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Click to filter Completed
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'In Progress' ? 'All' : 'In Progress');
              }}
              className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                statusFilter === 'In Progress'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-600 dark:border-amber-500'
                  : 'bg-slate-50/70 dark:bg-neutral-950/60 border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-neutral-300">
                <span>In Progress</span>
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-neutral-100 font-mono tabular-nums mt-1"
                data-testid="count-in-progress"
              >
                {overallStats.inProgress}
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Click to filter In Progress
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Review Needed' ? 'All' : 'Review Needed');
              }}
              className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                statusFilter === 'Review Needed'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-600 dark:border-rose-500'
                  : 'bg-slate-50/70 dark:bg-neutral-950/60 border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-neutral-300">
                <span>Review Needed</span>
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-neutral-100 font-mono tabular-nums mt-1"
                data-testid="count-review-needed"
              >
                {overallStats.reviewNeeded}
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Queued for Day 13 Redo
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Not Started' ? 'All' : 'Not Started');
              }}
              className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                statusFilter === 'Not Started'
                  ? 'bg-slate-200/70 dark:bg-neutral-800 border-slate-700 dark:border-neutral-500'
                  : 'bg-slate-50/70 dark:bg-neutral-950/60 border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-neutral-300">
                <span>Remaining (Unstarted)</span>
                <BookOpen className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-neutral-100 font-mono tabular-nums mt-1"
                data-testid="count-not-started"
              >
                {overallStats.notStarted}
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Out of 64 selected problems
              </div>
            </button>
          </div>
        </section>

        {/* View Switcher Content */}
        {activeTab === 'schedule' ? (
          <ScheduleView
            statusMap={statusMap}
            onStatusChange={handleStatusChange}
            onOpenDetail={setSelectedProblem}
          />
        ) : activeTab === 'reference' ? (
          <CorpusReferenceView />
        ) : (
          /* Main 64-Problem Study Guide Workspace (Sidebar + Main List) */
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Sidebar: Yellow Book Chapters & Weak-Area Filters */}
            <aside className="w-full lg:w-72 shrink-0 space-y-5">
              {/* Chapter Navigation */}
              <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-neutral-100">
                    Yellow Book Chapters (By Yield)
                  </h2>
                  {chapterFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setChapterFilter('All')}
                      className="text-xs text-indigo-600 dark:text-neutral-200 hover:underline cursor-pointer"
                    >
                      Show All
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setChapterFilter('All')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      chapterFilter === 'All'
                        ? 'bg-slate-900 dark:bg-neutral-800 text-white'
                        : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800/70'
                    }`}
                  >
                    <span>All 7 Included Chapters</span>
                    <span className="font-mono tabular-nums">
                      {overallStats.completed}/64
                    </span>
                  </button>

                  {CHAPTERS.map((ch) => {
                    const prog = chapterProgressMap[ch.id];
                    const isSelected = chapterFilter === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() =>
                          setChapterFilter(isSelected ? 'All' : ch.id)
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 dark:bg-neutral-100 text-white dark:text-neutral-950 font-semibold'
                            : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800/70'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {ch.priorityRank}. {ch.shortTitle}
                        </span>
                        <span
                          className={`font-mono tabular-nums shrink-0 ${
                            isSelected ? 'text-indigo-100 dark:text-neutral-700' : 'text-slate-500 dark:text-neutral-400'
                          }`}
                        >
                          {prog.completed}/{prog.total}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Weak Areas Filter */}
              <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-neutral-100">
                    Focus on Your Weak Areas
                  </h2>
                  {weakAreaFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setWeakAreaFilter('All')}
                      className="text-xs text-indigo-600 dark:text-neutral-200 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {WEAK_AREAS.map((area) => {
                    const areaProblems = PROBLEMS.filter((p) =>
                      p.weakAreasTargeted.includes(area)
                    );
                    const doneCount = areaProblems.filter(
                      (p) => getProblemStatus(statusMap, p.id) === 'Completed'
                    ).length;
                    const active = weakAreaFilter === area;

                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() =>
                          setWeakAreaFilter(active ? 'All' : area)
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer text-left ${
                          active
                            ? 'bg-indigo-600 dark:bg-neutral-100 text-white dark:text-neutral-950 font-semibold'
                            : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800/70'
                        }`}
                      >
                        <span className="truncate pr-2">{area}</span>
                        <span
                          className={`font-mono tabular-nums shrink-0 ${
                            active ? 'text-indigo-100 dark:text-neutral-700' : 'text-slate-500 dark:text-neutral-400'
                          }`}
                        >
                          {doneCount}/{areaProblems.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Yellow Book Reference & Progress Reset */}
              <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-neutral-100">
                  Yellow Book Training Guide
                </h2>
                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                  Read the assigned theory sections before starting each chapter and check the Glossary (pp. 425–437) for formal rule terminology.
                </p>
                <a
                  href={YELLOW_BOOK_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-neutral-100 bg-indigo-50 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <span>Open Yellow Book PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 space-y-2">
                  <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-neutral-200 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                    <span>Import Study Log (JSON)</span>
                    <input
                      type="file"
                      accept="application/json"
                      onChange={handleImportProgress}
                      className="sr-only"
                    />
                  </label>

                  {!confirmingReset ? (
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(true)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Statuses</span>
                    </button>
                  ) : (
                    <div className="space-y-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-800">
                      <p className="text-xs text-rose-800 dark:text-rose-200 font-medium">
                        Reset all 64 problem statuses to Not Started?
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusMap({});
                            setConfirmingReset(false);
                          }}
                          className="flex-1 px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 rounded hover:bg-rose-700 cursor-pointer"
                        >
                          Confirm Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingReset(false)}
                          className="flex-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded hover:bg-slate-50 dark:hover:bg-neutral-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Column: Filter Bar + Chapter Problem Tables */}
            <main className="flex-1 min-w-0 w-full space-y-6">
              {/* Search & Filter Toolbar */}
              <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search problems by name, language, year, or linguistic skill"
                      placeholder="Search 64 problems by language, source, or concept (e.g., 'ergativity', 'overcounting', 'Wiradjuri')..."
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-neutral-400"
                    />
                  </div>

                  {/* Difficulty Select */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor="difficulty-select" className="text-xs font-medium text-slate-600 dark:text-neutral-300 whitespace-nowrap">
                      Difficulty:
                    </label>
                    <select
                      id="difficulty-select"
                      value={difficultyFilter}
                      onChange={(e) =>
                        setDifficultyFilter(e.target.value as 'All' | DifficultyLevel)
                      }
                      className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-800 dark:text-neutral-200 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-neutral-400"
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                {/* Status Filter Segmented Bar + Mock Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-neutral-800">
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-800/90 rounded-lg">
                    {(['All', 'In Progress', 'Completed', 'Review Needed', 'Not Started'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            statusFilter === st
                              ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 shadow-xs font-semibold'
                              : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {st === 'All' ? 'All Statuses' : st}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-neutral-300">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hideMockProblems}
                        onChange={(e) => setHideMockProblems(e.target.checked)}
                        className="rounded border-slate-300 dark:border-neutral-700 text-indigo-600 dark:text-neutral-200 focus:ring-indigo-600 dark:focus:ring-neutral-400"
                      />
                      <span>Hide 13 Mock Exam Problems (Days 14–16)</span>
                    </label>

                    <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-neutral-200" data-testid="visible-problem-count">
                      Showing {filteredProblems.length} of 64
                    </span>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-indigo-600 dark:text-neutral-200 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Empty Filter State */}
              {filteredProblems.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-12 text-center space-y-3">
                  <Filter className="w-8 h-8 text-slate-400 dark:text-neutral-500 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-neutral-100">
                    No problems match your current filters
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-neutral-300 max-w-md mx-auto">
                    Try clearing your search query or switching the status/chapter filter back to "All".
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white dark:text-neutral-950 bg-indigo-600 dark:bg-neutral-100 rounded-lg hover:bg-indigo-700 dark:hover:bg-white transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                /* Chapter Sections (Priority 1 to Priority 7) */
                <div className="space-y-6">
                  {CHAPTERS.map((chapter) => {
                    const chProblems = filteredProblems.filter(
                      (p) => p.chapterId === chapter.id
                    );
                    if (chProblems.length === 0) return null;

                    const chProg = chapterProgressMap[chapter.id];
                    const isTheoryOpen = Boolean(expandedTheory[chapter.id]);

                    return (
                      <section
                        key={chapter.id}
                        aria-labelledby={`heading-${chapter.id}`}
                        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden"
                      >
                        {/* Chapter Header */}
                        <div className="p-5 bg-slate-50 dark:bg-neutral-950/60 border-b border-slate-200 dark:border-neutral-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="text-xs font-mono tabular-nums text-indigo-700 dark:text-neutral-300 font-semibold">
                                Priority {chapter.priorityRank} of 7 · Corpus Share: {chapter.shareOfCorpus}
                              </div>
                              <h2
                                id={`heading-${chapter.id}`}
                                className="text-lg font-bold text-slate-900 dark:text-neutral-100 mt-0.5"
                              >
                                {chapter.title} ({chapter.problemCount} Problems)
                              </h2>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-mono tabular-nums text-slate-700 dark:text-neutral-300">
                                Completed: <strong>{chProg.completed}/{chProg.total}</strong> ({chProg.completionPercent}%)
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleTheory(chapter.id)}
                                aria-expanded={isTheoryOpen}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-neutral-300" />
                                <span>Theory to Read First</span>
                                {isTheoryOpen ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
                            <strong className="text-slate-800 dark:text-neutral-100">Why included: </strong>
                            {chapter.whyIncluded}
                          </p>

                          {/* Collapsible Theory Prerequisite Panel */}
                          {isTheoryOpen && (
                            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {chapter.theorySections.map((sec) => (
                                <div
                                  key={sec.sectionCode}
                                  className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-slate-200/80 dark:border-neutral-800 space-y-1"
                                >
                                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                                    <span className="font-bold text-indigo-700 dark:text-neutral-100">
                                      Yellow Book §{sec.sectionCode}: {sec.title}
                                    </span>
                                    <span className="text-slate-500 dark:text-neutral-400 shrink-0 ml-2">
                                      {sec.pages}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                                    {sec.keyTakeaway}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Ordered Problems List (Easier to Harder) */}
                        <div className="divide-y divide-slate-200/80 dark:divide-neutral-800">
                          {chProblems.map((problem) => (
                            <ProblemRow
                              key={problem.id}
                              problem={problem}
                              status={getProblemStatus(statusMap, problem.id)}
                              noteText={notesMap[problem.id] ?? ''}
                              onStatusChange={handleStatusChange}
                              onOpenDetail={setSelectedProblem}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-4 px-6 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              PLO Round 1 Senior Division · 64-Problem Study Guide
            </span>
            <span aria-hidden="true">·</span>
            <a
              href="https://dakshwadekar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              dakshwadekar.com
            </a>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-600 dark:text-neutral-400">plo.dakshwadekar.com</span>
          </div>
          <span className="font-mono tabular-nums">
            Progress auto-saved locally · 16-Day Schedule (13 Nov – 28 Nov 2026)
          </span>
        </div>
      </footer>

      {/* Slide-Over Detail & PDF Drawer */}
      <ProblemDetailDrawer
        problem={selectedProblem}
        status={
          selectedProblem
            ? getProblemStatus(statusMap, selectedProblem.id)
            : 'Not Started'
        }
        noteText={selectedProblem ? notesMap[selectedProblem.id] ?? '' : ''}
        onClose={() => setSelectedProblem(null)}
        onStatusChange={handleStatusChange}
        onSaveNote={handleSaveNote}
      />
    </div>
  );
}
