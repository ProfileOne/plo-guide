import React from 'react';
import { X, FileText } from 'lucide-react';
import { InteractivePdfViewer } from './InteractivePdfViewer';

export interface BookletModalState {
  title: string;
  subtitle?: string;
  pdfUrl: string;
  initialPage?: number;
}

interface BookletPdfModalProps {
  booklet: BookletModalState | null;
  onClose: () => void;
}

export const BookletPdfModal: React.FC<BookletPdfModalProps> = ({ booklet, onClose }) => {
  if (!booklet) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 dark:bg-black/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booklet-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#141414] rounded-xl shadow-2xl border border-slate-200 dark:border-neutral-800 flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#101010]">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-4 h-4 text-slate-600 dark:text-[var(--dm-accent)] shrink-0" />
            <div className="min-w-0">
              <h2
                id="booklet-modal-title"
                className="text-sm sm:text-base font-bold text-slate-900 dark:text-[var(--dm-heading)] truncate"
              >
                {booklet.title}
              </h2>
              {booklet.subtitle && (
                <p className="text-xs text-slate-500 dark:text-[var(--dm-muted)] truncate">
                  {booklet.subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close PDF reader"
            className="p-1.5 text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] hover:bg-slate-200/60 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive PDF Body */}
        <div className="p-4 overflow-y-auto flex-1">
          <InteractivePdfViewer
            pdfUrl={booklet.pdfUrl}
            initialPage={booklet.initialPage ?? 1}
            title={booklet.title}
          />
        </div>
      </div>
    </div>
  );
};
