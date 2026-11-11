import React from 'react';
import {
  CORPUS_FLAGS,
  DROPPED_CHAPTERS,
  PATTERN_LANDSCAPE
} from '../data/studyGuideData';

export const CorpusReferenceView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 1. Problem-Type Frequency Table across 209 Senior/All Problems */}
      <section className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <h2 className="text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
            1. Corpus Pattern Landscape (209 Unique Senior / All Problems Analysed)
          </h2>
          <p className="text-xs text-slate-600 dark:text-[var(--dm-body)] mt-0.5">
            Deduplicated across all 11 attached files (Yellow Book, PLO 2013–2024 Past Papers & Compilations, and PLO Camp 2026), excluding 17 pure Junior problems.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-600 dark:text-[var(--dm-body)] bg-slate-50/60 dark:bg-[#101010]">
                <th className="py-3 px-4">Problem Type</th>
                <th className="py-3 px-4 text-right font-mono tabular-nums">Problems</th>
                <th className="py-3 px-4 text-right font-mono tabular-nums">Share of Total</th>
                <th className="py-3 px-4">Typical Difficulty</th>
                <th className="py-3 px-4">Yellow Book Chapter</th>
                <th className="py-3 px-4">Frequency Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-neutral-800 text-sm">
              {PATTERN_LANDSCAPE.map((row) => (
                <tr key={row.rank} className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/50">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-[var(--dm-heading)]">
                    <span className="font-mono text-xs text-slate-400 dark:text-[var(--dm-muted)] mr-1.5">{row.rank}.</span>
                    {row.problemType}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800 dark:text-[var(--dm-body)]">
                    {row.count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-indigo-700 dark:text-[var(--dm-accent)]">
                    {row.share}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-[var(--dm-body)] text-xs">
                    {row.typicalDifficulty}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-[var(--dm-body)] text-xs font-medium">
                    {row.yellowBookChapter}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-[var(--dm-body)]">
                    {row.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Dropped Chapters & Why */}
      <section className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <h2 className="text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
            2. Dropped Yellow Book Chapters & Strategic Rationale
          </h2>
          <p className="text-xs text-slate-600 dark:text-[var(--dm-body)] mt-0.5">
            Why Chapters 1, 3, and 10 were omitted as standalone problem sections to maximize your Round 1 score.
          </p>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-neutral-800">
          {DROPPED_CHAPTERS.map((item) => (
            <div key={item.chapter} className="px-6 py-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[var(--dm-accent)]">{item.chapter}</h3>
              <p className="text-sm text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">{item.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Corpus Flags, Corrupted PDF Pages & Cross-File Aliases */}
      <section className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <h2 className="text-base font-bold text-slate-900 dark:text-[var(--dm-heading)]">
            3. Flags: File Discrepancies, Corrupted PDF Encodings & Cross-File Aliases
          </h2>
          <p className="text-xs text-slate-600 dark:text-[var(--dm-body)] mt-0.5">
            Audit notes from inspecting every page across all 11 attached PDFs.
          </p>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-neutral-800">
          {CORPUS_FLAGS.map((flag) => (
            <div key={flag.title} className="px-6 py-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[var(--dm-accent)]">{flag.title}</h3>
              <p className="text-sm text-slate-600 dark:text-[var(--dm-body)] leading-relaxed">{flag.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
