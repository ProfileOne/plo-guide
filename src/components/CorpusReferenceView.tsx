import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  CORPUS_FLAGS,
  DROPPED_CHAPTERS,
  PATTERN_LANDSCAPE
} from '../data/studyGuideData';

export const CorpusReferenceView: React.FC = () => {
  const [expandedDropped, setExpandedDropped] = useState<Record<string, boolean>>({});
  const [expandedFlags, setExpandedFlags] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      {/* 1. Problem-Type Frequency Table across 209 Senior/All Problems */}
      <section className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
            1. Corpus Pattern Landscape (PLO 2013–2026 + Yellow Book + IOL 2003–2026)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-600 dark:text-[var(--dm-body)] bg-slate-50/60 dark:bg-[#101010]">
                <th className="py-2.5 px-4">Problem Type</th>
                <th className="py-2.5 px-4 text-right font-mono tabular-nums">Count</th>
                <th className="py-2.5 px-4 text-right font-mono tabular-nums">Share</th>
                <th className="py-2.5 px-4">Difficulty</th>
                <th className="py-2.5 px-4">Yellow Book Chapter</th>
                <th className="py-2.5 px-4">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-neutral-800 text-xs sm:text-sm">
              {PATTERN_LANDSCAPE.map((row) => (
                <tr key={row.rank} className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/50">
                  <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-[var(--dm-heading)]">
                    <span className="font-mono text-xs text-slate-400 dark:text-[var(--dm-muted)] mr-1.5">{row.rank}.</span>
                    {row.problemType}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-800 dark:text-[var(--dm-body)]">
                    {row.count}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-indigo-700 dark:text-[var(--dm-accent)]">
                    {row.share}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-[var(--dm-body)] text-xs">
                    {row.typicalDifficulty}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 dark:text-[var(--dm-body)] text-xs font-medium">
                    {row.yellowBookChapter}
                  </td>
                  <td className="py-2.5 px-4 text-xs text-slate-600 dark:text-[var(--dm-body)]">
                    {row.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Dropped Chapters & Why (Click to Expand) */}
      <section className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
            2. Folded / Omitted Yellow Book Chapters
          </h2>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-neutral-800">
          {DROPPED_CHAPTERS.map((item) => {
            const isOpen = Boolean(expandedDropped[item.chapter]);
            return (
              <div key={item.chapter} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
                    {item.chapter}
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedDropped((prev) => ({
                        ...prev,
                        [item.chapter]: !prev[item.chapter]
                      }))
                    }
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] bg-slate-100 dark:bg-neutral-800 rounded cursor-pointer shrink-0"
                  >
                    <span>{isOpen ? 'Less' : 'More'}</span>
                    {isOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">
                    {item.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Corpus Flags & Cross-File Aliases (Click to Expand) */}
      <section className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
            3. Corpus Notes &amp; Cross-File Aliases
          </h2>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-neutral-800">
          {CORPUS_FLAGS.map((flag) => {
            const isOpen = Boolean(expandedFlags[flag.title]);
            return (
              <div key={flag.title} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[var(--dm-heading)]">
                    {flag.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedFlags((prev) => ({
                        ...prev,
                        [flag.title]: !prev[flag.title]
                      }))
                    }
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] bg-slate-100 dark:bg-neutral-800 rounded cursor-pointer shrink-0"
                  >
                    <span>{isOpen ? 'Less' : 'More'}</span>
                    {isOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">
                    {flag.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
