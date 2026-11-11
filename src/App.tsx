import React, { useState, useEffect, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  Search,
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
  SCHEDULE_DAYS,
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

const SOURCE_BOOKLETS = [
  {
    label: 'Yellow Book Training Guide',
    sub: 'Theory & Worked Examples',
    url: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf'
  },
  {
    label: 'PLO Easy Problems',
    sub: '2013–2019 Compilation',
    url: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf'
  },
  {
    label: 'PLO Med / Hard / Expert',
    sub: '2013–2019 Compilation',
    url: 'assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf'
  },
  {
    label: 'PLO Camp 2026 Booklet',
    sub: 'IOL / Camp Selection',
    url: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf'
  },
  {
    label: 'PLO 2020 Senior & Junior',
    sub: 'Round 1 Past Paper',
    url: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf'
  },
  {
    label: 'PLO 2021 Senior & Junior',
    sub: 'Round 1 Past Paper',
    url: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf'
  },
  {
    label: 'PLO 2022 Senior & Junior',
    sub: 'Mock Paper 1 (Day 14)',
    url: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf'
  },
  {
    label: 'PLO 2023 Senior',
    sub: 'Mock Paper 2 (Day 15)',
    url: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf'
  },
  {
    label: 'PLO 2024 Senior',
    sub: 'Mock Paper 3 (Day 16)',
    url: 'assets/aistudio/PLO_24__Senior_76504da1.pdf'
  }
];

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
  { id: 'ivory', label: 'Warm Ivory tint', color: '#e5d6bc' },
  { id: 'rose', label: 'Warm Quartz tint', color: '#dfc3ba' },
  { id: 'sage', label: 'Soft Sage tint', color: '#bfd1c3' },
  { id: 'platinum', label: 'Cool Platinum tint', color: '#c8d3e0' }
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

  // Subtle 4-color tint preset ('ivory' default)
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
  const [dayFilter, setDayFilter] = useState<'All' | number>('All');
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
    const y = rect ? rect.top + rect.height / 2 : 28;
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
    setDayFilter('All');
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
    a.download = 'plo-senior-study-log.json';
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

  const filteredProblems = useMemo(() => {
    const base = filterProblems(PROBLEMS, statusMap, {
      searchQuery,
      statusFilter,
      chapterFilter,
      difficultyFilter,
      weakAreaFilter,
      hideMockProblems
    });
    if (dayFilter === 'All') return base;
    if (dayFilter === 13) {
      return base.filter((p) => getProblemStatus(statusMap, p.id) === 'Review Needed');
    }
    return base.filter((p) => p.scheduledDay === dayFilter);
  }, [
    statusMap,
    searchQuery,
    statusFilter,
    chapterFilter,
    difficultyFilter,
    weakAreaFilter,
    dayFilter,
    hideMockProblems
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    chapterFilter !== 'All' ||
    difficultyFilter !== 'All' ||
    weakAreaFilter !== 'All' ||
    dayFilter !== 'All' ||
    hideMockProblems;

  const toggleTheory = (chId: string) => {
    setExpandedTheory((prev) => ({
      ...prev,
      [chId]: !prev[chId]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b0b0b] text-slate-900 dark:text-[var(--dm-heading)] relative overflow-x-clip">
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

      {/* Minimal Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-neutral-800/80">
        {/* Zone 1: Minimal Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('guide');
          }}
          className="text-sm font-bold tracking-tight text-slate-900 dark:text-[var(--dm-heading)] whitespace-nowrap shrink-0 font-display"
        >
          PLO Senior Prep
        </a>

        {/* Zone 2: Minimal Navigation Links */}
        <nav
          aria-label="Primary views"
          className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-500 dark:text-[var(--dm-muted)] overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'guide'
                ? 'border-slate-900 dark:border-[var(--dm-accent)] text-slate-900 dark:text-[var(--dm-heading)] font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
            }`}
          >
            Problems
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'schedule'
                ? 'border-slate-900 dark:border-[var(--dm-accent)] text-slate-900 dark:text-[var(--dm-heading)] font-semibold'
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
                ? 'border-slate-900 dark:border-[var(--dm-accent)] text-slate-900 dark:text-[var(--dm-heading)] font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
            }`}
          >
            Pattern Landscape & Flags
          </button>
        </nav>

        {/* Zone 3: Pure Theme Toggle Switch + Export Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Pure Toggle Switch (No text label) */}
          <button
            ref={toggleBtnRef}
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            onClick={handleToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative inline-flex items-center w-11 h-6 rounded-full p-0.5 bg-slate-200 dark:bg-neutral-800 border border-slate-300/80 dark:border-neutral-700 cursor-pointer shrink-0 transition-colors duration-500"
          >
            <Sun className="w-3 h-3 text-amber-500/70 ml-1 pointer-events-none" />
            <Moon className="w-3 h-3 text-[var(--dm-accent)]/70 ml-auto mr-1 pointer-events-none" />
            <span
              className={`absolute left-0.5 top-0.5 inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-white dark:bg-[#141414] shadow-xs transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
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
          </button>

          <button
            type="button"
            onClick={handleExportProgress}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[var(--dm-body)] bg-slate-100 dark:bg-neutral-800/90 border border-slate-200/80 dark:border-neutral-700/80 rounded-md hover:bg-slate-200/70 dark:hover:bg-neutral-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-[var(--dm-accent)]" />
            <span>Export Study Log</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Minimal Progress Summary Strip */}
        <section
          aria-label="Study guide progress summary"
          className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg px-5 py-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-neutral-800/70">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[var(--dm-heading)] tracking-tight">
                Panini Linguistics Olympiad (Senior Round 1)
              </h1>
              <p className="text-xs text-slate-500 dark:text-[var(--dm-body)] mt-0.5">
                Curated from 209 Senior/All problems across 11 files · Ordered by Yellow Book Chapter yield · Zero pure Junior or previously solved problems
              </p>
            </div>

            {/* Right: Minimal Overall Progress */}
            <div className="w-full lg:w-64 space-y-1.5 shrink-0">
              <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                <span className="text-slate-500 dark:text-[var(--dm-muted)]">
                  Overall Completion
                </span>
                <span className="font-semibold text-slate-900 dark:text-[var(--dm-accent)]" data-testid="overall-completion-label">
                  {overallStats.completed} / {overallStats.total} ({overallStats.completionPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
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
          </div>

          {/* Minimal 4-Column Hairline Status Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-neutral-800/70 pt-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Completed' ? 'All' : 'Completed');
              }}
              className={`text-left px-3 py-1.5 first:pl-0 rounded-xs cursor-pointer ${
                statusFilter === 'Completed'
                  ? 'opacity-100'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)]">Completed</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  className="text-xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums"
                  data-testid="count-completed"
                >
                  {overallStats.completed}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-[var(--dm-muted)]">Filter</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'In Progress' ? 'All' : 'In Progress');
              }}
              className={`text-left px-3 py-1.5 rounded-xs cursor-pointer ${
                statusFilter === 'In Progress'
                  ? 'opacity-100'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)]">In Progress</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  className="text-xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums"
                  data-testid="count-in-progress"
                >
                  {overallStats.inProgress}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-[var(--dm-muted)]">Filter</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Review Needed' ? 'All' : 'Review Needed');
              }}
              className={`text-left px-3 py-1.5 rounded-xs cursor-pointer ${
                statusFilter === 'Review Needed'
                  ? 'opacity-100'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)]">Review Needed</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  className="text-xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums"
                  data-testid="count-review-needed"
                >
                  {overallStats.reviewNeeded}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-[var(--dm-muted)]">Day 13 Redo</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guide');
                setStatusFilter(statusFilter === 'Not Started' ? 'All' : 'Not Started');
              }}
              className={`text-left px-3 py-1.5 rounded-xs cursor-pointer ${
                statusFilter === 'Not Started'
                  ? 'opacity-100'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className="text-xs text-slate-500 dark:text-[var(--dm-muted)]">Remaining (Unstarted)</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  className="text-xl font-bold text-slate-900 dark:text-[var(--dm-heading)] font-mono tabular-nums"
                  data-testid="count-not-started"
                >
                  {overallStats.notStarted}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-[var(--dm-muted)]">of 64</span>
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
          /* Main Study Workspace (Sticky Left Sidebar + Main List) */
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Sticky Left Sidebar: Stays visible while scrolling so left column is never blank */}
            <aside className="w-full lg:w-68 shrink-0 space-y-3.5 lg:sticky lg:top-15 lg:max-h-[calc(100vh-4.5rem)] lg:overflow-y-auto lg:pr-1">
              {/* 1. Chapter Navigation */}
              <div className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
                    Yellow Book Chapters (By Yield)
                  </h2>
                  {chapterFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setChapterFilter('All')}
                      className="text-xs text-slate-600 dark:text-[var(--dm-accent)] hover:underline cursor-pointer"
                    >
                      Show All
                    </button>
                  )}
                </div>

                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setChapterFilter('All')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer ${
                      chapterFilter === 'All'
                        ? 'bg-slate-900 dark:bg-neutral-800 text-white dark:text-[var(--dm-heading)] font-semibold'
                        : 'text-slate-600 dark:text-[var(--dm-body)] hover:bg-slate-100 dark:hover:bg-neutral-800/60'
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
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-neutral-800 text-white dark:text-[var(--dm-heading)] font-semibold'
                            : 'text-slate-600 dark:text-[var(--dm-body)] hover:bg-slate-100 dark:hover:bg-neutral-800/60'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {ch.priorityRank}. {ch.shortTitle}
                        </span>
                        <span
                          className={`font-mono tabular-nums shrink-0 ${
                            isSelected
                              ? 'text-slate-200 dark:text-[var(--dm-accent)]'
                              : prog.completed > 0
                              ? 'text-emerald-600 dark:text-[var(--dm-accent)]'
                              : 'text-slate-400 dark:text-[var(--dm-muted)]'
                          }`}
                        >
                          {prog.completed}/{prog.total}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Target Weak Areas Filter */}
              <div className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
                    Focus on Your Weak Areas
                  </h2>
                  {weakAreaFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setWeakAreaFilter('All')}
                      className="text-xs text-slate-600 dark:text-[var(--dm-accent)] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-0.5">
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
                        className={`w-full flex items-center justify-between px-2.5 py-1 text-xs rounded-md cursor-pointer text-left ${
                          active
                            ? 'bg-slate-900 dark:bg-neutral-800 text-white dark:text-[var(--dm-heading)] font-semibold'
                            : 'text-slate-600 dark:text-[var(--dm-body)] hover:bg-slate-100 dark:hover:bg-neutral-800/60'
                        }`}
                      >
                        <span className="truncate pr-2">{area}</span>
                        <span
                          className={`font-mono tabular-nums shrink-0 ${
                            active
                              ? 'text-slate-200 dark:text-[var(--dm-accent)]'
                              : doneCount > 0
                              ? 'text-emerald-600 dark:text-[var(--dm-accent)]'
                              : 'text-slate-400 dark:text-[var(--dm-muted)]'
                          }`}
                        >
                          {doneCount}/{areaProblems.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. 16-Day Schedule Quick Filter Grid (Fills left column with fast day-by-day filtering) */}
              <div className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
                    Filter by Study Day (Days 1–16)
                  </h2>
                  {dayFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setDayFilter('All')}
                      className="text-xs text-slate-600 dark:text-[var(--dm-accent)] hover:underline cursor-pointer"
                    >
                      All Days
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1">
                  {SCHEDULE_DAYS.map((d) => {
                    const isSelected = dayFilter === d.day;
                    const dayProbs =
                      d.day === 13
                        ? PROBLEMS.filter((p) => getProblemStatus(statusMap, p.id) === 'Review Needed')
                        : PROBLEMS.filter((p) => p.scheduledDay === d.day);
                    const allDone =
                      dayProbs.length > 0 &&
                      dayProbs.every((p) => getProblemStatus(statusMap, p.id) === 'Completed');

                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => setDayFilter(isSelected ? 'All' : d.day)}
                        title={`Day ${d.day} (${d.dateLabel}): ${d.focusTitle}`}
                        className={`px-1.5 py-1 text-[11px] font-mono tabular-nums rounded cursor-pointer border text-center ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-neutral-700 text-white dark:text-[var(--dm-heading)] border-slate-900 dark:border-[var(--dm-accent)] font-semibold'
                            : allDone
                            ? 'bg-emerald-50/60 dark:bg-[#1c1a16] text-emerald-700 dark:text-[var(--dm-accent)] border-emerald-200 dark:border-neutral-800'
                            : 'bg-slate-50/70 dark:bg-[#0f0f0f] text-slate-600 dark:text-[var(--dm-body)] border-slate-200/60 dark:border-neutral-800/80 hover:bg-slate-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        D{d.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Source PDF Booklets Library & Log Controls */}
              <div className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg p-3.5 space-y-2.5">
                <h2 className="text-xs font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
                  Source PDF Booklets
                </h2>
                <div className="space-y-1">
                  {SOURCE_BOOKLETS.map((bk) => (
                    <a
                      key={bk.label}
                      href={bk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-2 py-1 text-xs text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-50 dark:hover:bg-neutral-800/60 rounded-md"
                    >
                      <span className="truncate">{bk.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 dark:text-[var(--dm-accent)] shrink-0" />
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/80 space-y-1.5">
                  <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-[var(--dm-body)] bg-slate-50 dark:bg-neutral-800/70 border border-slate-200/70 dark:border-neutral-700/80 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer">
                    <Upload className="w-3 h-3 text-slate-400 dark:text-[var(--dm-muted)]" />
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
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs text-slate-500 dark:text-[var(--dm-muted)] hover:text-rose-700 dark:hover:text-[var(--dm-heading)] rounded-md cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset All Statuses</span>
                    </button>
                  ) : (
                    <div className="space-y-2 p-2.5 bg-rose-50 dark:bg-neutral-950 rounded-md border border-rose-200 dark:border-neutral-700">
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
            <main className="flex-1 min-w-0 w-full space-y-5">
              {/* Minimal Search & Filter Toolbar */}
              <div className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg p-3.5 space-y-2.5">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[var(--dm-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search problems by name, language, year, or linguistic skill"
                      placeholder="Search problems by language, source, or concept (e.g., 'ergativity', 'overcounting', 'Wiradjuri')..."
                      className="w-full pl-8.5 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50/70 dark:bg-[#0e0e0e] border border-slate-200/80 dark:border-neutral-800 rounded-md text-slate-900 dark:text-[var(--dm-heading)] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-1 focus:outline-slate-400 dark:focus:outline-[var(--dm-accent)]"
                    />
                  </div>

                  {/* Difficulty Select */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor="difficulty-select" className="text-xs text-slate-500 dark:text-[var(--dm-muted)] whitespace-nowrap">
                      Difficulty:
                    </label>
                    <select
                      id="difficulty-select"
                      value={difficultyFilter}
                      onChange={(e) =>
                        setDifficultyFilter(e.target.value as 'All' | DifficultyLevel)
                      }
                      className="px-2.5 py-1.5 text-xs font-medium bg-slate-50/70 dark:bg-[#0e0e0e] border border-slate-200/80 dark:border-neutral-800 rounded-md text-slate-800 dark:text-[var(--dm-body)] focus:outline-1 focus:outline-slate-400 dark:focus:outline-[var(--dm-accent)]"
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
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-neutral-800/70">
                  <div className="flex flex-wrap items-center gap-1">
                    {(['All', 'In Progress', 'Completed', 'Review Needed', 'Not Started'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                            statusFilter === st
                              ? 'bg-slate-900 dark:bg-neutral-800 text-white dark:text-[var(--dm-heading)] font-medium'
                              : 'text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
                          }`}
                        >
                          {st === 'All' ? 'All Statuses' : st}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-[var(--dm-muted)]">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hideMockProblems}
                        onChange={(e) => setHideMockProblems(e.target.checked)}
                        className="rounded border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-[var(--dm-accent)] focus:ring-slate-500 dark:focus:ring-[var(--dm-accent)]"
                      />
                      <span>Hide 13 Mock Exam Problems (Days 14–16)</span>
                    </label>

                    <span className="font-mono tabular-nums font-medium text-slate-700 dark:text-[var(--dm-body)]" data-testid="visible-problem-count">
                      Showing {filteredProblems.length} of 64
                    </span>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-slate-700 dark:text-[var(--dm-accent)] font-medium hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Empty Filter State */}
              {filteredProblems.length === 0 ? (
                <div className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg p-10 text-center space-y-2.5">
                  <Filter className="w-6 h-6 text-slate-400 dark:text-[var(--dm-muted)] mx-auto" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[var(--dm-heading)]">
                    No problems match your current filters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[var(--dm-body)] max-w-md mx-auto">
                    Try clearing your search query or switching the status/chapter/day filter back to "All".
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white dark:text-[var(--dm-heading)] bg-slate-900 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-md hover:bg-slate-800 dark:hover:bg-neutral-700 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                /* Chapter Sections (Priority 1 to Priority 7) */
                <div className="space-y-5">
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
                        className="bg-white dark:bg-[#131313] border border-slate-200/80 dark:border-neutral-800/80 rounded-lg overflow-hidden"
                      >
                        {/* Chapter Header */}
                        <div className="px-5 py-4 bg-slate-50/40 dark:bg-[#101010] border-b border-slate-200/70 dark:border-neutral-800/80 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <h2
                                id={`heading-${chapter.id}`}
                                className="text-base sm:text-lg font-bold text-slate-900 dark:text-[var(--dm-heading)]"
                              >
                                {chapter.title}
                              </h2>
                              <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-[var(--dm-muted)]">
                                {chapter.problemCount} Problems · Priority {chapter.priorityRank}/7 · Share: {chapter.shareOfCorpus}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-[var(--dm-muted)]">
                                Completed: <strong className="text-slate-900 dark:text-[var(--dm-heading)]">{chProg.completed}/{chProg.total}</strong> ({chProg.completionPercent}%)
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleTheory(chapter.id)}
                                aria-expanded={isTheoryOpen}
                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-[var(--dm-accent)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] cursor-pointer whitespace-nowrap"
                              >
                                <span>Theory to Read First</span>
                                {isTheoryOpen ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-[var(--dm-body)] leading-relaxed max-w-5xl">
                            <strong className="font-medium text-slate-700 dark:text-[var(--dm-heading)]">Why included: </strong>
                            {chapter.whyIncluded}
                          </p>

                          {/* Minimal Collapsible Theory Prerequisite List (No heavy nested boxes) */}
                          {isTheoryOpen && (
                            <div className="mt-2 pt-2.5 border-t border-slate-200/60 dark:border-neutral-800/70">
                              <div className="border-l-2 border-slate-300 dark:border-neutral-700 pl-3.5 space-y-1.5">
                                {chapter.theorySections.map((sec) => (
                                  <div
                                    key={sec.sectionCode}
                                    className="text-xs leading-relaxed flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
                                  >
                                    <div className="text-slate-600 dark:text-[var(--dm-body)]">
                                      <span className="font-mono font-semibold text-slate-800 dark:text-[var(--dm-accent)]">
                                        Yellow Book §{sec.sectionCode}: {sec.title}
                                      </span>
                                      <span className="mx-1.5 text-slate-300 dark:text-neutral-600">—</span>
                                      <span>{sec.keyTakeaway}</span>
                                    </div>
                                    <span className="font-mono tabular-nums text-[11px] text-slate-400 dark:text-[var(--dm-muted)] shrink-0">
                                      {sec.pages}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Ordered Problems List (Easier to Harder) */}
                        <div className="divide-y divide-slate-100 dark:divide-neutral-800/80">
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

      {/* Minimal Footer with the 4-Color Tint Switcher at the bottom of the website */}
      <footer className="border-t border-slate-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#111111] py-4 px-6 mt-10">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-[var(--dm-muted)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-600 dark:text-[var(--dm-body)]">
              PLO Round 1 Senior Division
            </span>
            <span aria-hidden="true">·</span>
            <a
              href="https://dakshwadekar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 dark:text-[var(--dm-accent)] hover:underline"
            >
              dakshwadekar.com
            </a>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500 dark:text-[var(--dm-muted)]">plo.dakshwadekar.com</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* 4-Color Subtle Tint Switcher in the bottom footer */}
            <div
              role="group"
              aria-label="Theme color tint"
              className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-full"
            >
              <span className="text-[11px] text-slate-500 dark:text-[var(--dm-muted)] pr-0.5">
                Tint
              </span>
              {TINT_SWATCHES.map((swatch) => {
                const active = darkTint === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setDarkTint(swatch.id)}
                    aria-label={swatch.label}
                    aria-pressed={active}
                    title={swatch.label}
                    style={{ backgroundColor: swatch.color }}
                    className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform duration-200 ${
                      active
                        ? 'scale-115 ring-2 ring-slate-700 dark:ring-neutral-100 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>

            <span className="font-mono tabular-nums">
              Progress auto-saved · 16-Day Schedule (13 Nov – 28 Nov 2026)
            </span>
          </div>
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
