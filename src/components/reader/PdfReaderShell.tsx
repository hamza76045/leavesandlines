"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minus,
  MoreHorizontal,
  PanelLeft,
  Plus,
} from "lucide-react";
import type { Book } from "@/lib/mock/books";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfReaderShell({ book }: { book: Book }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(0.95);
  const [pageWidth, setPageWidth] = useState(320);
  const [leftRailOpen, setLeftRailOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setPageWidth(Math.min(760, Math.floor(entry.contentRect.width)));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function scrollToPage(targetPage: number) {
    if (!numPages) return;
    const validPage = Math.min(Math.max(1, targetPage), numPages);
    setPageNumber(validPage);
  }

  const showLeftRail = leftRailOpen && !focusMode;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-text">
      <header className="z-30 shrink-0 border-b border-border bg-surface/95 text-text backdrop-blur">
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-brand transition-[width] duration-200"
            style={{ width: numPages ? `${(pageNumber / numPages) * 100}%` : "0%" }}
          />
        </div>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-3 py-2 lg:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-muted transition hover:bg-brand-soft hover:text-brand"
              onClick={() => history.back()}
              aria-label="Back"
              title="Back"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="min-w-0">
              <p className="truncate font-serif text-sm font-semibold text-text sm:text-base">
                {book.title}
              </p>
              <p className="hidden text-xs font-semibold text-subtle sm:block">
                Page {pageNumber}
                {numPages ? ` of ${numPages}` : ""}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-border bg-bg px-1.5 py-1 sm:flex">
            <button
              type="button"
              className={`grid size-10 place-items-center rounded-full transition ${
                leftRailOpen
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:bg-brand-soft hover:text-brand"
              }`}
              onClick={() => setLeftRailOpen((val) => !val)}
              aria-label="Toggle pages sidebar"
              title="Toggle pages sidebar"
            >
              <PanelLeft size={17} />
            </button>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-brand-soft hover:text-brand"
              onClick={() => setZoom((value) => Math.max(0.65, value - 0.1))}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <Minus size={17} />
            </button>
            <span className="hidden min-w-12 text-center text-xs font-bold text-muted sm:inline">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-brand-soft hover:text-brand"
              onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <Plus size={17} />
            </button>
            <ThemeToggle />
            <button
              type="button"
              className={`grid size-10 place-items-center rounded-full transition ${
                focusMode
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:bg-brand-soft hover:text-brand"
              }`}
              onClick={() => setFocusMode((value) => !value)}
              aria-label={focusMode ? "Exit distraction-free mode" : "Enter distraction-free mode"}
              title="Distraction-free mode"
            >
              <Maximize2 size={17} />
            </button>
          </div>

          <details className="relative sm:hidden">
            <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-border bg-bg text-muted [&::-webkit-details-marker]:hidden">
              <MoreHorizontal size={20} aria-hidden="true" />
              <span className="sr-only">Reader controls</span>
            </summary>
            <div className="absolute right-0 top-[3.25rem] z-40 grid w-56 gap-2 rounded-lg border border-border bg-surface p-3 shadow-xl">
              <button
                type="button"
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold text-muted hover:bg-brand-soft hover:text-brand"
                onClick={() => setLeftRailOpen((value) => !value)}
              >
                <PanelLeft size={18} aria-hidden="true" />
                Jump to page
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm font-bold text-muted"
                  onClick={() => setZoom((value) => Math.max(0.65, value - 0.1))}
                >
                  <Minus size={17} aria-hidden="true" /> Zoom
                </button>
                <button
                  type="button"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm font-bold text-muted"
                  onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))}
                >
                  <Plus size={17} aria-hidden="true" /> Zoom
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-bold text-muted">
                Theme
                <ThemeToggle />
              </div>
              <button
                type="button"
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold ${
                  focusMode ? "bg-brand-soft text-brand" : "text-muted hover:bg-brand-soft"
                }`}
                onClick={() => setFocusMode((value) => !value)}
              >
                <Maximize2 size={18} aria-hidden="true" />
                {focusMode ? "Exit focus mode" : "Focus mode"}
              </button>
            </div>
          </details>
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 justify-center">
        {showLeftRail ? (
          <aside className="absolute left-3 right-3 top-3 z-20 rounded-lg border border-border bg-surface p-4 shadow-xl sm:left-4 sm:right-auto sm:top-4 sm:w-64">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text">Go to page</h2>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-lg text-muted hover:bg-brand-soft hover:text-brand"
                onClick={() => setLeftRailOpen(false)}
                aria-label="Close page navigation"
              >
                <PanelLeft size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Enter a page from 1 to {numPages ?? "the end"}.
            </p>
            <input
              type="number"
              ref={pageInputRef}
              min={1}
              max={numPages || 1}
              defaultValue={pageNumber}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  scrollToPage(Number(event.currentTarget.value));
                  setLeftRailOpen(false);
                }
              }}
              className="mt-4 h-12 w-full rounded-lg border border-border bg-surface px-3 font-bold text-text outline-none focus:border-brand"
              aria-label="Page number"
            />
            <button
              type="button"
              className="mt-3 h-11 w-full rounded-lg bg-brand text-sm font-bold text-white hover:bg-brand-strong"
              onClick={() => {
                scrollToPage(Number(pageInputRef.current?.value));
                setLeftRailOpen(false);
              }}
            >
              Go
            </button>
          </aside>
        ) : null}

        <section className="flex min-h-0 w-full min-w-0 flex-col bg-bg-soft px-2 py-3 sm:px-6 sm:py-5">
          <div
            ref={containerRef}
            className="no-scrollbar mx-auto flex min-h-0 w-full max-w-[980px] flex-1 flex-col items-center overflow-y-auto bg-surface-inset p-2 scroll-smooth sm:rounded-lg sm:border sm:border-border sm:p-6"
          >
            <Document
              file={book.pdfUrl}
              className="flex w-full justify-center"
              loading={
                <div className="grid min-h-[520px] w-full place-items-center text-sm font-bold text-muted">
                  Loading PDF...
                </div>
              }
              error={
                <div className="max-w-md rounded-lg border border-border bg-surface p-6 text-center">
                  <h2 className="font-display text-xl font-semibold text-text">
                    PDF could not be opened
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Check the file and try opening it again.
                  </p>
                </div>
              }
              onLoadSuccess={({ numPages: loadedPages }) => {
                setNumPages(loadedPages);
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={zoom}
                width={pageWidth}
                className="overflow-hidden shadow-soft"
              />
            </Document>
          </div>

          <div className="mx-auto mt-3 flex max-w-[760px] shrink-0 items-center justify-center gap-2 sm:mt-4 sm:gap-3">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-strong disabled:opacity-40"
              onClick={() => scrollToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              aria-label="Previous page"
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold text-text">
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(event) => scrollToPage(Number(event.target.value))}
                className="w-10 bg-transparent text-center font-bold text-brand outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Current page"
              />
              <span className="text-subtle font-semibold">of</span>
              <span className="text-muted font-bold">{numPages ? numPages : "--"}</span>
            </div>

            <button
              type="button"
              className="grid size-11 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-strong disabled:opacity-40"
              onClick={() => scrollToPage(pageNumber + 1)}
              disabled={numPages ? pageNumber >= numPages : false}
              aria-label="Next page"
              title="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
