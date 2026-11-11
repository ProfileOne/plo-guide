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
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">
            1. Corpus Pattern Landscape (209 Unique Senior / All Problems Analysed)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Deduplicated across all 11 attached files (Yellow Book, PLO 2013–2024 Past Papers & Compilations, and PLO Camp 2026), excluding 17 pure Junior problems.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50/60">
                <th className="py-3 px-4">Problem Type</th>
                <th className="py-3 px-4 text-right font-mono tabular-nums">Problems</th>
                <th className="py-3 px-4 text-right font-mono tabular-nums">Share of Total</th>
                <th className="py-3 px-4">Typical Difficulty</th>
                <th className="py-3 px-4">Yellow Book Chapter</th>
                <th className="py-3 px-4">Frequency Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-sm">
              {PATTERN_LANDSCAPE.map((row) => (
                <tr key={row.rank} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {row.rank}. {row.problemType}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800">
                    {row.count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-indigo-700">
                    {row.share}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    {row.typicalDifficulty}
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-xs font-medium">
                    {row.yellowBookChapter}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {row.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Dropped Chapters & Why */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">
            2. Dropped Yellow Book Chapters & Strategic Rationale
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Why Chapters 1, 3, and 10 were omitted as standalone problem sections to maximize your Round 1 score.
          </p>
        </div>

        <div className="divide-y divide-slate-200/80">
          {DROPPED_CHAPTERS.map((item) => (
            <div key={item.chapter} className="px-6 py-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{item.chapter}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Corpus Flags, Corrupted PDF Pages & Cross-File Aliases */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">
            3. Flags: File Discrepancies, Corrupted PDF Encodings & Cross-File Aliases
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit notes from inspecting every page across all 11 attached PDFs.
          </p>
        </div>

        <div className="divide-y divide-slate-200/80">
          {CORPUS_FLAGS.map((flag) => (
            <div key={flag.title} className="px-6 py-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{flag.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{flag.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
