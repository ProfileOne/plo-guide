import React, { useState, useEffect, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
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
const STORAGE_TINT_KEY = 'plo_senior_64_guide_dm_tint_v1';
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
type DarkTint = 'ivory' | 'rose' | 'sage' | 'platinum';

const TINT_SWATCHES: { id: DarkTint; label: string; color: string }[] = [
  { id: 'ivory', label: 'Warm Ivory white tint', color: '#e5d6bc' },
  { id: 'rose', label: 'Warm Quartz white tint', color: '#dfc3ba' },
  { id: 'sage', label: 'Soft Sage white tint', color: '#bfd1c3' },
  { id: 'platinum', label: 'Cool Platinum white tint', color: '#c8d3e0' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('guide');
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

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

  // Subtle white-tint preset for Dark Mode ('ivory' default)
  const [darkTint, setDarkTint] = useState<DarkTint>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TINT_KEY) as DarkTint | null;
      if (saved === 'ivory' || saved === 'rose' || saved === 'sage' || saved === 'platinum') {
        return saved;
      }
      return 'ivory';
    } catch {
      return 'ivory';
    }
  });

  // Visual ripple wave state for theme switch animation
  const [themeRipple, setThemeRipple] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    targetTheme: ThemeMode;
  } | null>(null);

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
    document.documentElement.setAttribute('data-dm-tint', darkTint);
    try {
      localStorage.setItem(STORAGE_TINT_KEY, darkTint);
    } catch {
      // Ignore storage quota errors
    }
  }, [darkTint]);

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

  const handleToggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = toggleThemeMode(theme);
    const rect = (e.currentTarget || toggleBtnRef.current)?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 120;
    const y = rect ? rect.top + rect.height / 2 : 80;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const root = document.documentElement;
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-r', `${Math.ceil(maxRadius)}px`);

    setThemeRipple({
      id: Date.now(),
      x,
      y,
      size: Math.ceil(maxRadius * 2.1),
      targetTheme: nextTheme
    });

    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };

    if (typeof docWithVT.startViewTransition === 'function') {
      root.classList.add('vt-active');
      const transition = docWithVT.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
        root.classList.toggle('dark', nextTheme === 'dark');
      });
      transition.finished.finally(() => {
        root.classList.remove('vt-active');
      });
    } else {
      setTheme(nextTheme);
    }
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0b0b] text-slate-900 dark:text-[var(--dm-heading)] relative overflow-x-clip">
      {/* Non-blocking Radial Wave Ring during Dark <-> Light Theme Switch */}
      {themeRipple && (
        <div
          key={themeRipple.id}
          aria-hidden="true"
          onAnimationEnd={() => setThemeRipple(null)}
          style={{
            left: `${themeRipple.x}px`,
            top: `${themeRipple.y}px`,
            width: `${themeRipple.size}px`,
            height: `${themeRipple.size}px`
          }}
          className={`pointer-events-none fixed z-50 rounded-full animate-theme-ripple ${
            themeRipple.targetTheme === 'dark'
              ? 'border-2 border-[#d4c3a3]/40 bg-radial from-[#d4c3a3]/15 via-neutral-900/20 to-transparent'
              : 'border-2 border-amber-400/50 bg-radial from-amber-200/25 via-white/30 to-transparent'
          }`}
        />
      )}

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-[#141414] border-b border-slate-200 dark:border-neutral-800">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('guide');
          }}
          className="text-base font-bold tracking-tight text-slate-900 dark:text-[var(--dm-heading)] whitespace-nowrap shrink-0 font-display"
        >
          PLO Senior Prep <span className="text-slate-500 dark:text-[var(--dm-muted)] font-normal">· 64-Problem Guide</span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary views"
          className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-[var(--dm-muted)] overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'guide'
                ? 'border-indigo-600 dark:border-[var(--dm-accent)] text-slate-900 dark:text-[var(--dm-heading)] font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
            }`}
          >
            64-Problem Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'schedule'
                ? 'border-indigo-600 dark:border-[var(--dm-accent)] text-slate-900 dark:text-[var(--dm-heading)] font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
            }`}
          >
            16-Day Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reference')}
            className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'reference'
                ? 'border-indigo-600 dark:border-[var(--dm-accent)] text-slate-900 dark:text-[var(--dm-heading)] font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white dark:text-[var(--dm-heading)] bg-slate-900 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg hover:bg-slate-800 dark:hover:bg-neutral-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-300 dark:text-[var(--dm-accent)]" />
            <span>Export Study Log</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Top Interactive KPI Progress Bar */}
        <section
          aria-label="Study guide progress summary"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl p-5"
        >
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-neutral-800">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[var(--dm-heading)] tracking-tight">
                Panini Linguistics Olympiad (Senior Round 1) — 64-Problem Study Guide
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-[var(--dm-body)] mt-0.5">
                Curated from 209 Senior/All problems across 11 files · Ordered by Yellow Book Chapter yield · Zero pure Junior or previously solved problems
              </p>
            </div>

            {/* Right: Overall Progress Bar + Animated Theme Mode Switch */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="w-full sm:w-52 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="font-semibold text-slate-700 dark:text-[var(--dm-body)]">
                    Overall Completion
                  </span>
                  <span className="font-bold text-slate-900 dark:text-[var(--dm-accent)]" data-testid="overall-completion-label">
                    {overallStats.completed} / {overallStats.total} ({overallStats.completionPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-600 dark:bg-[var(--dm-accent)] transition-all duration-300"
                    style={{ width: `${(overallStats.completed / 64) * 100}%` }}
                    title={`Completed: ${overallStats.completed}`}
                  />
                  <div
                    className="bg-amber-500 dark:bg-neutral-500 transition-all duration-300"
                    style={{ width: `${(overallStats.inProgress / 64) * 100}%` }}
                    title={`In Progress: ${overallStats.inProgress}`}
                  />
                  <div
                    className="bg-rose-500 dark:bg-neutral-600 transition-all duration-300"
                    style={{ width: `${(overallStats.reviewNeeded / 64) * 100}%` }}
                    title={`Review Needed: ${overallStats.reviewNeeded}`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Subtle White-Tint Selector (Only shown in Dark Mode) */}
                {theme === 'dark' && (
                  <div
                    role="group"
                    aria-label="Subtle white tint in dark mode"
                    className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg"
                    title="Adjust subtle white tint"
                  >
                    {TINT_SWATCHES.map((swatch) => {
                      const active = darkTint === swatch.id;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          onClick={() => setDarkTint(swatch.id)}
                          aria-label={swatch.label}
                          aria-pressed={active}
                          style={{ backgroundColor: swatch.color }}
                          className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform duration-200 ${
                            active
                              ? 'scale-115 ring-2 ring-neutral-100 ring-offset-1 ring-offset-neutral-900'
                              : 'opacity-55 hover:opacity-90'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Animated Sliding Pill Theme Switch */}
                <button
                  ref={toggleBtnRef}
                  type="button"
                  onClick={handleToggleTheme}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  className="group inline-flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[var(--dm-heading)] bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-200/70 dark:hover:bg-neutral-700 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {/* Animated Pill Track & Rotating Icon Thumb */}
                  <span className="relative inline-flex items-center w-9 h-5 rounded-full bg-slate-300/80 dark:bg-neutral-950 p-0.5 transition-colors duration-500">
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-white dark:bg-neutral-800 shadow-xs transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    >
                      <Sun
                        className={`w-2.5 h-2.5 text-amber-500 absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                          theme === 'dark'
                            ? 'opacity-0 rotate-180 scale-0'
                            : 'opacity-100 rotate-0 scale-100'
                        }`}
                      />
                      <Moon
                        className={`w-2.5 h-2.5 text-[var(--dm-accent)] absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                          theme === 'dark'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-180 scale-0'
                        }`}
                      />
                    </span>
                  </span>
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
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
              className={`text-left p-3.5 rounded-lg border cursor-pointer ${
                statusFilter === 'Completed'
                  ? 'bg-emerald-50 dark:bg-neutral-800 border-emerald-600 dark:border-[var(--dm-accent)]'
                  : 'bg-slate-50/70 dark:bg-[#111111] border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-[var(--dm-body)]">
                <span>Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[var(--dm-accent)]" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums mt-1"
                data-testid="count-completed"
              >
                {overallStats.completed}
              </div>
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)] mt-0.5">
                Click to filter Completed
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'In Progress' ? 'All' : 'In Progress');
              }}
              className={`text-left p-3.5 rounded-lg border cursor-pointer ${
                statusFilter === 'In Progress'
                  ? 'bg-amber-50 dark:bg-neutral-800 border-amber-600 dark:border-[var(--dm-accent)]'
                  : 'bg-slate-50/70 dark:bg-[#111111] border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-[var(--dm-body)]">
                <span>In Progress</span>
                <Clock className="w-4 h-4 text-amber-600 dark:text-[var(--dm-accent)]" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums mt-1"
                data-testid="count-in-progress"
              >
                {overallStats.inProgress}
              </div>
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)] mt-0.5">
                Click to filter In Progress
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Review Needed' ? 'All' : 'Review Needed');
              }}
              className={`text-left p-3.5 rounded-lg border cursor-pointer ${
                statusFilter === 'Review Needed'
                  ? 'bg-rose-50 dark:bg-neutral-800 border-rose-600 dark:border-[var(--dm-accent)]'
                  : 'bg-slate-50/70 dark:bg-[#111111] border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-[var(--dm-body)]">
                <span>Review Needed</span>
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-[var(--dm-accent)]" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums mt-1"
                data-testid="count-review-needed"
              >
                {overallStats.reviewNeeded}
              </div>
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)] mt-0.5">
                Queued for Day 13 Redo
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Not Started' ? 'All' : 'Not Started');
              }}
              className={`text-left p-3.5 rounded-lg border cursor-pointer ${
                statusFilter === 'Not Started'
                  ? 'bg-slate-200/70 dark:bg-neutral-800 border-slate-700 dark:border-[var(--dm-accent)]'
                  : 'bg-slate-50/70 dark:bg-[#111111] border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-[var(--dm-body)]">
                <span>Remaining (Unstarted)</span>
                <BookOpen className="w-4 h-4 text-slate-500 dark:text-[var(--dm-accent)]" />
              </div>
              <div
                className="text-2xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums mt-1"
                data-testid="count-not-started"
              >
                {overallStats.notStarted}
              </div>
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)] mt-0.5">
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
              <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-[var(--dm-heading)]">
                    Yellow Book Chapters (By Yield)
                  </h2>
                  {chapterFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setChapterFilter('All')}
                      className="text-xs text-indigo-600 dark:text-[var(--dm-accent)] hover:underline cursor-pointer"
                    >
                      Show All
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setChapterFilter('All')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg cursor-pointer ${
                      chapterFilter === 'All'
                        ? 'bg-slate-900 dark:bg-neutral-800 text-white dark:text-[var(--dm-heading)] dark:border dark:border-neutral-700 font-semibold'
                        : 'text-slate-700 dark:text-[var(--dm-body)] hover:bg-slate-100 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>All 7 Included Chapters</span>
                    <span className="font-mono tabular-nums text-slate-300 dark:text-[var(--dm-accent)]">
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
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 dark:bg-neutral-800 text-white dark:text-[var(--dm-heading)] dark:border dark:border-neutral-700 font-semibold'
                            : 'text-slate-700 dark:text-[var(--dm-body)] hover:bg-slate-100 dark:hover:bg-neutral-800/60'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {ch.priorityRank}. {ch.shortTitle}
                        </span>
                        <span
                          className={`font-mono tabular-nums shrink-0 ${
                            isSelected
                              ? 'text-indigo-100 dark:text-[var(--dm-accent)]'
                              : prog.completed > 0
                              ? 'text-emerald-600 dark:text-[var(--dm-accent)]'
                              : 'text-slate-500 dark:text-[var(--dm-muted)]'
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
              <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-[var(--dm-heading)]">
                    Focus on Your Weak Areas
                  </h2>
                  {weakAreaFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setWeakAreaFilter('All')}
                      className="text-xs text-indigo-600 dark:text-[var(--dm-accent)] hover:underline cursor-pointer"
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
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg cursor-pointer text-left ${
                          active
                            ? 'bg-indigo-600 dark:bg-neutral-800 text-white dark:text-[var(--dm-heading)] dark:border dark:border-neutral-700 font-semibold'
                            : 'text-slate-700 dark:text-[var(--dm-body)] hover:bg-slate-100 dark:hover:bg-neutral-800/60'
                        }`}
                      >
                        <span className="truncate pr-2">{area}</span>
                        <span
                          className={`font-mono tabular-nums shrink-0 ${
                            active
                              ? 'text-indigo-100 dark:text-[var(--dm-accent)]'
                              : doneCount > 0
                              ? 'text-emerald-600 dark:text-[var(--dm-accent)]'
                              : 'text-slate-500 dark:text-[var(--dm-muted)]'
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
              <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-[var(--dm-heading)]">
                  Yellow Book Training Guide
                </h2>
                <p className="text-xs text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">
                  Read the assigned theory sections before starting each chapter and check the Glossary (pp. 425–437) for formal rule terminology.
                </p>
                <a
                  href={YELLOW_BOOK_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-[var(--dm-heading)] bg-indigo-50 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-neutral-700"
                >
                  <span>Open Yellow Book PDF</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-[var(--dm-accent)]" />
                </a>

                <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 space-y-2">
                  <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[var(--dm-body)] bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-[var(--dm-muted)]" />
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
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-[var(--dm-muted)] hover:text-rose-700 dark:hover:text-[var(--dm-heading)] hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Statuses</span>
                    </button>
                  ) : (
                    <div className="space-y-2 p-2.5 bg-rose-50 dark:bg-neutral-950 rounded-lg border border-rose-200 dark:border-neutral-700">
                      <p className="text-xs text-rose-800 dark:text-[var(--dm-body)] font-medium">
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
                          className="flex-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-[var(--dm-body)] bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded hover:bg-slate-50 dark:hover:bg-neutral-700 cursor-pointer"
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
              <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 dark:text-[var(--dm-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search problems by name, language, year, or linguistic skill"
                      placeholder="Search 64 problems by language, source, or concept (e.g., 'ergativity', 'overcounting', 'Wiradjuri')..."
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-[var(--dm-heading)] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-[var(--dm-accent)]"
                    />
                  </div>

                  {/* Difficulty Select */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor="difficulty-select" className="text-xs font-medium text-slate-600 dark:text-[var(--dm-body)] whitespace-nowrap">
                      Difficulty:
                    </label>
                    <select
                      id="difficulty-select"
                      value={difficultyFilter}
                      onChange={(e) =>
                        setDifficultyFilter(e.target.value as 'All' | DifficultyLevel)
                      }
                      className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-800 dark:text-[var(--dm-body)] focus:outline-2 focus:outline-indigo-600 dark:focus:outline-[var(--dm-accent)]"
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
                          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                            statusFilter === st
                              ? 'bg-white dark:bg-[#0e0e0e] text-slate-900 dark:text-[var(--dm-heading)] shadow-xs font-semibold'
                              : 'text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)]'
                          }`}
                        >
                          {st === 'All' ? 'All Statuses' : st}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-[var(--dm-body)]">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hideMockProblems}
                        onChange={(e) => setHideMockProblems(e.target.checked)}
                        className="rounded border-slate-300 dark:border-neutral-700 text-indigo-600 dark:text-[var(--dm-accent)] focus:ring-indigo-600 dark:focus:ring-[var(--dm-accent)]"
                      />
                      <span>Hide 13 Mock Exam Problems (Days 14–16)</span>
                    </label>

                    <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-[var(--dm-body)]" data-testid="visible-problem-count">
                      Showing {filteredProblems.length} of 64
                    </span>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-indigo-600 dark:text-[var(--dm-accent)] font-semibold hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Empty Filter State */}
              {filteredProblems.length === 0 ? (
                <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl p-12 text-center space-y-3">
                  <Filter className="w-8 h-8 text-slate-400 dark:text-[var(--dm-muted)] mx-auto" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
                    No problems match your current filters
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[var(--dm-body)] max-w-md mx-auto">
                    Try clearing your search query or switching the status/chapter filter back to "All".
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white dark:text-[var(--dm-heading)] bg-indigo-600 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-neutral-700 cursor-pointer"
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
                        className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden"
                      >
                        {/* Chapter Header */}
                        <div className="p-5 bg-slate-50 dark:bg-[#101010] border-b border-slate-200 dark:border-neutral-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="text-xs font-mono tabular-nums text-indigo-700 dark:text-[var(--dm-accent)] font-semibold">
                                Priority {chapter.priorityRank} of 7 · Corpus Share: {chapter.shareOfCorpus}
                              </div>
                              <h2
                                id={`heading-${chapter.id}`}
                                className="text-lg font-bold text-slate-900 dark:text-[var(--dm-heading)] mt-0.5"
                              >
                                {chapter.title} <span className="text-slate-500 dark:text-[var(--dm-muted)] font-normal">({chapter.problemCount} Problems)</span>
                              </h2>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-mono tabular-nums text-slate-700 dark:text-[var(--dm-body)]">
                                Completed: <strong className="text-slate-900 dark:text-[var(--dm-heading)]">{chProg.completed}/{chProg.total}</strong> ({chProg.completionPercent}%)
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleTheory(chapter.id)}
                                aria-expanded={isTheoryOpen}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[var(--dm-body)] bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer whitespace-nowrap"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-[var(--dm-accent)]" />
                                <span>Theory to Read First</span>
                                {isTheoryOpen ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">
                            <strong className="text-slate-800 dark:text-[var(--dm-heading)]">Why included: </strong>
                            {chapter.whyIncluded}
                          </p>

                          {/* Collapsible Theory Prerequisite Panel */}
                          {isTheoryOpen && (
                            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {chapter.theorySections.map((sec) => (
                                <div
                                  key={sec.sectionCode}
                                  className="p-3 bg-white dark:bg-[#161616] rounded-lg border border-slate-200/80 dark:border-neutral-800 space-y-1"
                                >
                                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                                    <span className="font-bold text-indigo-700 dark:text-[var(--dm-accent)]">
                                      Yellow Book §{sec.sectionCode}: {sec.title}
                                    </span>
                                    <span className="text-slate-500 dark:text-[var(--dm-muted)] shrink-0 ml-2">
                                      {sec.pages}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">
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
      <footer className="border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#141414] py-4 px-6 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-[var(--dm-muted)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-700 dark:text-[var(--dm-body)]">
              PLO Round 1 Senior Division · 64-Problem Study Guide
            </span>
            <span aria-hidden="true">·</span>
            <a
              href="https://dakshwadekar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 dark:text-[var(--dm-accent)] hover:underline"
            >
              dakshwadekar.com
            </a>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-600 dark:text-[var(--dm-muted)]">plo.dakshwadekar.com</span>
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
