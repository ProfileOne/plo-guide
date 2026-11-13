import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Loader2,
  BookOpen,
  FileText,
  Maximize2
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfPageCanvasProps {
  doc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  totalPages: number;
  zoomPercent: number;
  containerWidth: number;
  isFirstCanvas?: boolean;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  doc,
  pageNumber,
  totalPages,
  zoomPercent,
  containerWidth,
  isFirstCanvas = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderSinglePage() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore
          }
        }

        const page = await doc.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const safeWidth = Math.max(320, containerWidth - 32);
        const fitScale = safeWidth / baseViewport.width;
        const userScale = fitScale * (zoomPercent / 100);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const cssViewport = page.getViewport({ scale: userScale });
        const hiresViewport = page.getViewport({ scale: userScale * dpr });

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = Math.floor(hiresViewport.width);
        canvas.height = Math.floor(hiresViewport.height);
        canvas.style.width = `${Math.floor(cssViewport.width)}px`;
        canvas.style.height = `${Math.floor(cssViewport.height)}px`;

        const task = page.render({
          canvasContext: context,
          viewport: hiresViewport,
          canvas
        });
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: unknown) {
        const name = (err as { name?: string })?.name;
        if (name !== 'RenderingCancelledException' && !cancelled) {
          // Ignore transient cancel errors
        }
      }
    }

    renderSinglePage();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [doc, pageNumber, zoomPercent, containerWidth]);

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      {totalPages > 1 && (
        <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-[var(--dm-muted)] self-start pl-1">
          Page {pageNumber} of {totalPages}
        </div>
      )}
      <div className="bg-white shadow-md rounded-sm overflow-hidden border border-slate-300 dark:border-neutral-800 mx-auto">
        <canvas
          ref={canvasRef}
          data-testid={isFirstCanvas ? 'interactive-pdf-canvas' : `interactive-pdf-canvas-${pageNumber}`}
          className="block"
        />
      </div>
    </div>
  );
};

interface InteractivePdfViewerProps {
  /** Standalone single-problem PDF URL (or booklet URL if viewing a booklet) */
  pdfUrl: string;
  /** Optional full source booklet URL (without #page=) for fallback slicing or switching to Full Booklet mode */
  fullBookletUrl?: string;
  /** 1-indexed start page in the full booklet */
  startPage?: number;
  /** 1-indexed end page in the full booklet */
  endPage?: number;
  /** Initial page to display when loading a full booklet (1-indexed) */
  initialPage?: number;
  /** Human-readable title for download filename and accessibility */
  title: string;
  /** Optional fixed height class; when omitted, expands to show all pages in a natural vertical scroll */
  heightClass?: string;
}

export const InteractivePdfViewer: React.FC<InteractivePdfViewerProps> = ({
  pdfUrl,
  fullBookletUrl,
  startPage = 1,
  endPage = 1,
  initialPage = 1,
  title,
  heightClass
}) => {
  const cleanFullUrl = fullBookletUrl ? fullBookletUrl.split('#')[0] : undefined;
  const hasSeparateBooklet = Boolean(cleanFullUrl && cleanFullUrl !== pdfUrl.split('#')[0]);

  const [sourceScope, setSourceScope] = useState<'single' | 'booklet'>('single');
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeBlobUrl, setActiveBlobUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(780);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Measure container width so PDF pages fit cleanly without clipping
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateWidth = () => {
      if (el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }
    };
    updateWidth();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidth) : null;
    if (ro) ro.observe(el);
    window.addEventListener('resize', updateWidth);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Reset scope when pdfUrl changes
  useEffect(() => {
    setSourceScope('single');
  }, [pdfUrl]);

  // Load PDF document via PDF.js (with automatic pdf-lib slicing fallback if singlePdfUrl returns HTML)
  useEffect(() => {
    let cancelled = false;
    let createdBlobUrl: string | null = null;

    async function loadPdf() {
      setLoading(true);
      setErrorMsg(null);
      setPdfDoc(null);

      try {
        const targetUrl =
          sourceScope === 'booklet' && cleanFullUrl
            ? cleanFullUrl
            : pdfUrl.split('#')[0];

        const normalizedUrl = targetUrl.startsWith('/') || targetUrl.startsWith('http')
          ? targetUrl
          : `/${targetUrl}`;

        let pdfBytes: Uint8Array | null = null;

        const resp = await fetch(normalizedUrl);
        const contentType = resp.headers.get('content-type') || '';

        if (resp.ok && contentType.includes('pdf')) {
          const buf = await resp.arrayBuffer();
          pdfBytes = new Uint8Array(buf);
        } else if (sourceScope === 'single' && cleanFullUrl) {
          // Fallback: slice the exact pages client-side from the full booklet PDF using pdf-lib
          const fullNorm = cleanFullUrl.startsWith('/') ? cleanFullUrl : `/${cleanFullUrl}`;
          const fullResp = await fetch(fullNorm);
          if (!fullResp.ok) {
            throw new Error(`Could not fetch source PDF (${fullResp.status})`);
          }
          const fullBuf = await fullResp.arrayBuffer();
          const srcDoc = await PDFDocument.load(fullBuf);
          const outDoc = await PDFDocument.create();
          const total = srcDoc.getPageCount();
          const indices: number[] = [];
          for (let p = startPage; p <= endPage; p++) {
            indices.push(Math.max(0, Math.min(total - 1, p - 1)));
          }
          const copied = await outDoc.copyPages(srcDoc, indices);
          for (const page of copied) {
            outDoc.addPage(page);
          }
          pdfBytes = await outDoc.save();
        } else {
          throw new Error('PDF file could not be loaded.');
        }

        if (cancelled || !pdfBytes) return;

        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
        createdBlobUrl = URL.createObjectURL(blob);
        setActiveBlobUrl(createdBlobUrl);

        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const doc = await loadingTask.promise;
        if (cancelled) {
          return;
        }

        setPdfDoc(doc);
        setNumPages(doc.numPages);

        const startAt =
          sourceScope === 'booklet'
            ? Math.max(1, Math.min(doc.numPages, startPage || initialPage || 1))
            : Math.max(1, Math.min(doc.numPages, initialPage || 1));

        setCurrentPage(startAt);
        setPageInput(String(startAt));
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to load PDF');
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [pdfUrl, cleanFullUrl, sourceScope, startPage, endPage, initialPage]);

  const goToPage = (pageNumber: number) => {
    if (numPages === 0) return;
    const clamped = Math.max(1, Math.min(numPages, pageNumber));
    setCurrentPage(clamped);
    setPageInput(String(clamped));
    if (numPages <= 6 && containerRef.current) {
      const targetSelector =
        clamped === 1
          ? '[data-testid="interactive-pdf-canvas"]'
          : `[data-testid="interactive-pdf-canvas-${clamped}"]`;
      const targetEl = containerRef.current.querySelector(targetSelector);
      if (targetEl && typeof targetEl.scrollIntoView === 'function') {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!Number.isNaN(parsed)) {
      goToPage(parsed);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const handleDownloadPdf = () => {
    const href = activeBlobUrl || (pdfUrl.startsWith('/') ? pdfUrl : `/${pdfUrl}`);
    const safeFilename =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'problem';
    const a = document.createElement('a');
    a.href = href;
    a.download = `${safeFilename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const directTabUrl =
    sourceScope === 'booklet' && cleanFullUrl
      ? `${cleanFullUrl.startsWith('/') ? cleanFullUrl : `/${cleanFullUrl}`}#page=${currentPage}`
      : activeBlobUrl || (pdfUrl.startsWith('/') ? pdfUrl : `/${pdfUrl}`);

  // For short documents (like 1–6 page problems), render ALL pages stacked vertically so the user can scroll the entire problem naturally!
  // For full booklets (many pages), render a 4-page continuous vertical window starting at currentPage so scrolling works across consecutive pages.
  const pagesToRender: number[] = [];
  if (pdfDoc && numPages > 0) {
    if (numPages <= 6) {
      for (let p = 1; p <= numPages; p++) {
        pagesToRender.push(p);
      }
    } else {
      const endWindow = Math.min(numPages, currentPage + 3);
      for (let p = currentPage; p <= endWindow; p++) {
        pagesToRender.push(p);
      }
    }
  }

  return (
    <div
      data-testid="interactive-pdf-viewer"
      className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-[#0c0c0c] flex flex-col"
    >
      {/* Sticky Interactive PDF Control Bar */}
      <div className="sticky top-0 z-10 rounded-t-xl flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-xs border-b border-slate-200 dark:border-neutral-800 text-xs">
        {/* Left: Scope Switcher (Problem Only vs Full Booklet) + Page Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {hasSeparateBooklet && (
            <div
              role="group"
              aria-label="PDF document scope"
              className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-neutral-800 rounded-md border border-slate-200 dark:border-neutral-700"
            >
              <button
                type="button"
                onClick={() => setSourceScope('single')}
                aria-pressed={sourceScope === 'single'}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded cursor-pointer ${
                  sourceScope === 'single'
                    ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-[var(--dm-heading)] shadow-2xs'
                    : 'text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Problem Only ({endPage - startPage + 1}p)</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceScope('booklet')}
                aria-pressed={sourceScope === 'booklet'}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded cursor-pointer ${
                  sourceScope === 'booklet'
                    ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-[var(--dm-heading)] shadow-2xs'
                    : 'text-slate-500 dark:text-[var(--dm-muted)] hover:text-slate-900 dark:hover:text-[var(--dm-body)]'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Full Booklet (p. {startPage})</span>
              </button>
            </div>
          )}

          {/* Page Navigation Controls */}
          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={loading || currentPage <= 1}
              aria-label="Previous PDF page"
              className="p-0.5 text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] disabled:opacity-35 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <form onSubmit={handlePageInputSubmit} className="inline-flex items-center gap-1 font-mono text-[11px]">
              <span className="text-slate-400 dark:text-[var(--dm-muted)]">
                {numPages <= 6 ? 'All Pages' : 'Page'}
              </span>
              <input
                type="text"
                inputMode="numeric"
                aria-label="PDF page number"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageInputSubmit}
                className="w-10 px-1 py-0.5 text-center bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded text-slate-900 dark:text-[var(--dm-heading)]"
              />
              <span className="text-slate-500 dark:text-[var(--dm-muted)]">
                / {numPages || '…'}
              </span>
            </form>

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={loading || currentPage >= numPages}
              aria-label="Next PDF page"
              className="p-0.5 text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] disabled:opacity-35 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Fit / Zoom Controls + Download + New Tab */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="inline-flex items-center gap-0.5 bg-slate-100 dark:bg-neutral-800 p-0.5 rounded-md border border-slate-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setZoomPercent((z) => Math.max(70, z - 15))}
              disabled={zoomPercent <= 70}
              aria-label="Zoom out PDF"
              className="p-1 text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] disabled:opacity-35 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomPercent((z) => (z === 100 ? 80 : 100))}
              title="Toggle Fit Width (100%) / Fit Whole Page (80%)"
              className="px-1.5 py-0.5 text-[11px] font-mono tabular-nums text-slate-700 dark:text-[var(--dm-heading)] hover:bg-white dark:hover:bg-neutral-700 rounded cursor-pointer inline-flex items-center gap-1"
            >
              <Maximize2 className="w-2.5 h-2.5 text-slate-400" />
              <span>{zoomPercent}%</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomPercent((z) => Math.min(205, z + 15))}
              disabled={zoomPercent >= 205}
              aria-label="Zoom in PDF"
              className="p-1 text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] disabled:opacity-35 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            data-testid="download-pdf-btn"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:text-[var(--dm-heading)] bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200/80 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700 rounded-md cursor-pointer"
          >
            <Download className="w-3 h-3 text-slate-600 dark:text-[var(--dm-accent)]" />
            <span>Download PDF</span>
          </button>

          <a
            href={directTabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-[var(--dm-body)] hover:text-slate-900 dark:hover:text-[var(--dm-heading)] bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-md"
          >
            <span>New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Continuous Multi-Page Scroll Viewport */}
      <div
        ref={containerRef}
        className={`w-full ${heightClass ? `${heightClass} overflow-y-auto` : ''} overflow-x-auto p-3 sm:p-4 flex flex-col items-center gap-5 bg-slate-200/70 dark:bg-[#090909]`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-xs text-slate-500 dark:text-[var(--dm-muted)]">
            <Loader2 className="w-5 h-5 animate-spin text-slate-600 dark:text-[var(--dm-accent)]" />
            <span>Rendering interactive PDF pages…</span>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-xs text-rose-600 dark:text-rose-400 p-6 text-center">
            <p className="font-semibold">{errorMsg}</p>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium cursor-pointer"
            >
              Download PDF File
            </button>
          </div>
        ) : (
          pdfDoc &&
          pagesToRender.map((pageNum, idx) => (
            <PdfPageCanvas
              key={`${sourceScope}-${pageNum}`}
              doc={pdfDoc}
              pageNumber={pageNum}
              totalPages={numPages}
              zoomPercent={zoomPercent}
              containerWidth={containerWidth}
              isFirstCanvas={idx === 0}
            />
          ))
        )}

        {/* Bottom Page Navigation Bar for multi-page booklets */}
        {!loading && !errorMsg && numPages > 6 && (
          <div className="flex items-center justify-center gap-3 pt-2 pb-4">
            <button
              type="button"
              onClick={() => goToPage(Math.max(1, currentPage - 3))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-md text-slate-800 dark:text-[var(--dm-heading)] disabled:opacity-40 cursor-pointer"
            >
              ← Previous Pages
            </button>
            <span className="text-xs font-mono text-slate-600 dark:text-[var(--dm-muted)]">
              Showing pp. {pagesToRender[0]}–{pagesToRender[pagesToRender.length - 1]} of {numPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(Math.min(numPages, currentPage + 3))}
              disabled={currentPage + 2 >= numPages}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-md text-slate-800 dark:text-[var(--dm-heading)] disabled:opacity-40 cursor-pointer"
            >
              Next Pages →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
