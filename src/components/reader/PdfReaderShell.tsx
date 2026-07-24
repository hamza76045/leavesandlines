"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minus,
  PanelLeft,
  PanelRight,
  Plus,
  Search,
  StickyNote,
} from "lucide-react";
import type { Book } from "@/lib/mock/books";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfReaderShell({ book }: { book: Book }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(0.95);
  const [bookmarked, setBookmarked] = useState(false);
  const [leftRailOpen, setLeftRailOpen] = useState(false);
  const [rightRailOpen, setRightRailOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isSelfScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  function scrollToPage(targetPage: number) {
    if (!numPages) return;
    const validPage = Math.min(Math.max(1, targetPage), numPages);
    setPageNumber(validPage);
    isSelfScrolling.current = true;
    const targetEl = document.getElementById(`pdf-page-${validPage}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      isSelfScrolling.current = false;
    }, 600);
  }

  const handleScroll = () => {
    // Auto show sidebar when user scrolls
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1800);

    if (!containerRef.current || isSelfScrolling.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 3;

    const pageElements = containerRef.current.querySelectorAll<HTMLElement>("[data-page]");
    let closestPage = 1;
    let minDistance = Infinity;

    pageElements.forEach((el) => {
      const pageNum = Number(el.getAttribute("data-page"));
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(containerCenter - rect.top);
      if (distance < minDistance) {
        minDistance = distance;
        closestPage = pageNum;
      }
    });

    if (closestPage && closestPage !== pageNumber) {
      setPageNumber(closestPage);
    }
  };

  const showLeftRail = (leftRailOpen || isScrolling) && !focusMode;

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 text-text shadow-sm backdrop-blur">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-3 py-2 lg:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:text-brand"
              onClick={() => history.back()}
              aria-label="Back"
              title="Back"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-text sm:text-base">
                {book.title}
              </p>
              <p className="text-xs font-semibold text-subtle">
                Page {pageNumber}
                {numPages ? ` of ${numPages}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`grid size-10 place-items-center rounded-lg border transition ${
                leftRailOpen
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border bg-surface text-muted hover:text-brand"
              }`}
              onClick={() => setLeftRailOpen((val) => !val)}
              aria-label="Toggle pages sidebar"
              title="Toggle pages sidebar"
            >
              <PanelLeft size={17} />
            </button>
            <div className="hidden h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 md:flex">
              <Search size={16} className="text-subtle" />
              <input
                className="w-44 bg-transparent text-sm outline-none text-text placeholder:text-subtle"
                placeholder="Search PDF"
              />
            </div>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:text-brand"
              onClick={() => setZoom((value) => Math.max(0.65, value - 0.1))}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <Minus size={17} />
            </button>
            <span className="hidden min-w-14 text-center text-sm font-bold text-muted sm:inline">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:text-brand"
              onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <Plus size={17} />
            </button>
            <ThemeToggle />
            <button
              type="button"
              className={`grid size-10 place-items-center rounded-lg border transition ${
                bookmarked
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border bg-surface text-muted hover:text-brand"
              }`}
              onClick={() => setBookmarked((value) => !value)}
              aria-label="Bookmark page"
              title="Bookmark page"
            >
              <Bookmark size={17} />
            </button>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:text-brand"
              onClick={() => setFocusMode((value) => !value)}
              aria-label="Distraction-free mode"
              title="Distraction-free mode"
            >
              <Maximize2 size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex min-h-[calc(100vh-68px)] justify-center">
        {/* Pages sidebar overlay: appears automatically on scroll or when toggled */}
        <aside
          className={`absolute left-4 top-4 z-20 w-52 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar rounded-xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur transition-all duration-300 ${
            showLeftRail
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 -translate-x-4 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Pages</h2>
            <button
              type="button"
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-brand-soft hover:text-brand"
              onClick={() => setLeftRailOpen(false)}
              aria-label="Hide page rail"
              title="Hide page rail"
            >
              <PanelLeft size={16} />
            </button>
          </div>
          <div className="mt-3 grid gap-1.5">
            {Array.from({ length: numPages ?? 1 }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => scrollToPage(page)}
                  className={`h-10 rounded-lg border px-3 text-left text-sm font-bold transition ${
                    pageNumber === page
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border bg-surface-raised text-muted hover:text-brand hover:border-brand/40"
                  }`}
                >
                  Page {page}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex flex-col min-w-0 w-full bg-bg-soft px-3 py-5 sm:px-6">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="mx-auto flex max-h-[calc(100vh-160px)] w-full max-w-[980px] flex-col items-center gap-6 overflow-y-auto no-scrollbar rounded-lg border border-border bg-surface-inset p-3 shadow-inner sm:p-6 scroll-smooth"
          >
            <Document
              file={book.pdfUrl}
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
                    The reader is wired up, but this file may need a `.pdf`
                    extension or a PDF content type when served.
                  </p>
                </div>
              }
              onLoadSuccess={({ numPages: loadedPages }) => {
                setNumPages(loadedPages);
              }}
            >
              {Array.from({ length: numPages ?? 1 }, (_, index) => {
                const page = index + 1;
                return (
                  <div
                    key={page}
                    id={`pdf-page-${page}`}
                    data-page={page}
                    className="flex justify-center w-full"
                  >
                    <Page
                      pageNumber={page}
                      scale={zoom}
                      width={760}
                      className="overflow-hidden rounded-md shadow-soft"
                    />
                  </div>
                );
              })}
            </Document>
          </div>

          <div className="mx-auto mt-4 flex max-w-[760px] items-center justify-center gap-3">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg bg-brand text-white transition hover:bg-brand-strong disabled:opacity-40"
              onClick={() => scrollToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              aria-label="Previous page"
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-bold text-text shadow-sm">
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
              className="grid size-10 place-items-center rounded-lg bg-brand text-white transition hover:bg-brand-strong disabled:opacity-40"
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
