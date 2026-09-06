"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { Book } from "@/lib/mock/books";
import { parseProgress, saveBookProgress } from "@/lib/reading-progress";
import {
  canvasPixelRatio,
  clamp,
  MAX_ZOOM,
  MIN_PAGE_W,
  MIN_ZOOM,
  PAGE_GAP,
  type PdfDocumentLike,
  ZOOM_STEP,
} from "@/lib/reader/geometry";
import { PageSlot } from "./PageSlot";
import { ReaderToolbar } from "./ReaderToolbar";
import { useAutoHideToolbar } from "./useAutoHideToolbar";
import { useContinuousPages, type ReaderMode } from "./useContinuousPages";
import { usePageRatios } from "./usePageRatios";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ITEM =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-3 text-xs font-semibold transition";

export function PdfReaderShell({ book }: { book: Book }) {
  // Read once, synchronously. `ssr: false` on this component makes that safe,
  // and it means the restored page is correct on the very first paint.
  const initial = useMemo(() => parseProgress()[book.id], [book.id]);
  const initialPage = Math.max(1, initial?.page ?? 1);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdf, setPdf] = useState<PdfDocumentLike | null>(null);

  const [zoom, setZoom] = useState(() =>
    clamp(initial?.zoom ?? 1, MIN_ZOOM, MAX_ZOOM),
  );
  const [fit, setFit] = useState<"width" | "page">(() => initial?.fit ?? "width");
  const [mode, setMode] = useState<ReaderMode>(() => initial?.mode ?? "continuous");

  const [toolbarHidden, setToolbarHidden] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [resumePage, setResumePage] = useState<number | null>(() =>
    initial && initial.page > 1 ? initial.page : null,
  );
  const [availableSize, setAvailableSize] = useState({ width: 320, height: 520 });
  const [toolbarHeight, setToolbarHeight] = useState(56);
  const [pendingPage, setPendingPage] = useState<number | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const showPillRef = useRef<HTMLButtonElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);
  const pagerInputRef = useRef<HTMLInputElement>(null);
  const touchRef = useRef<{ x: number; y: number; t: number; multi: boolean } | null>(null);
  const interactedRef = useRef(false);
  const mountedSetRef = useRef<Set<number>>(new Set());

  const markInteracted = useCallback(() => {
    interactedRef.current = true;
  }, []);

  // Stable identity: a fresh closure here would restart the ratio effect on
  // every render.
  const isMounted = useCallback((page: number) => mountedSetRef.current.has(page), []);

  const { ratios, docRatio } = usePageRatios(pdf, numPages, initialPage, isMounted);

  // docRatio is frozen by the uniformity probe rather than reseeded by whichever
  // page rendered last, so fit-page cannot thrash the layout.
  const pageWidth = useMemo(() => {
    const base =
      fit === "page"
        ? Math.min(availableSize.width, availableSize.height / docRatio)
        : availableSize.width;
    return Math.max(MIN_PAGE_W, Math.round(base * zoom));
  }, [availableSize, docRatio, fit, zoom]);

  const { page, layout, mountedPages, scrollToPage, suppressRef } = useContinuousPages({
    scrollerRef,
    listRef,
    ratios,
    pageWidth,
    numPages,
    mode,
    initialPage,
    toolbarHeight,
  });

  useEffect(() => {
    mountedSetRef.current = mountedPages;
  }, [mountedPages]);

  const { peeked, reveal, reduceMotion } = useAutoHideToolbar({
    scrollerRef,
    toolbarRef,
    panelRef,
    suppressRef,
    enabled: mode === "continuous" && !toolbarHidden,
    blocked: viewOpen || resumePage !== null,
    revealAbove: toolbarHeight + 24,
  });

  const chromeHidden = toolbarHidden || peeked;
  const pixelRatio = canvasPixelRatio(mountedPages.size);

  const go = useCallback(
    (target: number, options?: { smooth?: boolean }) => {
      markInteracted();
      if (!numPages) {
        // goToPage used to be inert until the document loaded. Remember the
        // request instead of dropping it silently.
        setPendingPage(target);
        return;
      }
      scrollToPage(target, options);
    },
    [markInteracted, numPages, scrollToPage],
  );

  const changeZoom = useCallback(
    (direction: number) => {
      markInteracted();
      setZoom((value) => clamp(value + direction * ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
    },
    [markInteracted],
  );

  const hideToolbar = useCallback(() => {
    setViewOpen(false);
    setToolbarHidden(true);
    // Hiding used to unmount the focused button and drop focus to <body>.
    requestAnimationFrame(() => showPillRef.current?.focus());
  }, []);

  // ---- measurement -----------------------------------------------------
  useEffect(() => {
    const element = toolbarRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const height = element.getBoundingClientRect().height;
      if (height > 0) setToolbarHeight(height);
    });
    observer.observe(element);
    setToolbarHeight(element.getBoundingClientRect().height || 56);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const read = () => {
      const styles = getComputedStyle(scroller);
      const horizontal =
        parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const vertical = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      setAvailableSize((previous) => {
        const width = Math.max(240, Math.floor(scroller.clientWidth - horizontal));
        const height = Math.max(300, Math.floor(scroller.clientHeight - vertical));
        // Ignore sub-pixel churn so a scrollbar appearing cannot feed back.
        if (Math.abs(previous.width - width) < 2 && Math.abs(previous.height - height) < 2) {
          return previous;
        }
        return { width, height };
      });
    };

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    });
    observer.observe(scroller);
    read();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // ---- persistence -----------------------------------------------------
  useEffect(() => {
    if (!numPages || !interactedRef.current) return;
    const timer = window.setTimeout(() => {
      saveBookProgress(book.id, {
        page,
        totalPages: numPages,
        zoom,
        fit,
        mode,
        updatedAt: new Date().toISOString(),
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [book.id, fit, mode, numPages, page, zoom]);

  // ---- keyboard --------------------------------------------------------
  // Registered once with a stable handler reading a ref. The previous version
  // had no dependency array and re-registered a window listener every render;
  // simply adding `[]` would have frozen it on page 1 instead.
  const keyStateRef = useRef({ page, numPages, mode });
  useEffect(() => {
    keyStateRef.current = { page, numPages, mode };
  }, [page, numPages, mode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // Form fields swallow everything, so arrows still move the caret.
      if (target?.closest("input, textarea, select") || target?.isContentEditable) return;
      // Activatable elements swallow Space only — buttons activate on keyup
      // after a keydown that must not be prevented.
      if (
        event.key === " " &&
        target?.closest('button, summary, a[href], [role="button"]')
      ) {
        return;
      }

      const state = keyStateRef.current;
      const smooth = state.mode === "single" ? false : true;

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(state.page - 1, { smooth });
      } else if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        go(state.page + 1, { smooth });
      } else if (event.key === "Home") {
        event.preventDefault();
        go(1);
      } else if (event.key === "End" && state.numPages) {
        event.preventDefault();
        go(state.numPages);
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeZoom(1);
      } else if (event.key === "-") {
        event.preventDefault();
        changeZoom(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, changeZoom]);

  const slots = useMemo(() => {
    if (!numPages) return [];
    if (mode === "single") return [clamp(page, 1, numPages)];
    return Array.from({ length: numPages }, (_, index) => index + 1);
  }, [mode, numPages, page]);

  const fitPageFrame = fit === "page" && mode === "single";

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-text">
      <a
        href="#main-content"
        className="absolute left-4 top-2 z-50 -translate-y-20 rounded-full bg-brand-fill px-5 py-3 text-base font-semibold text-on-brand-fill transition focus:translate-y-0"
      >
        Skip to reader
      </a>

      <ReaderToolbar
        bookTitle={book.title}
        bookSlug={book.slug}
        page={page}
        numPages={numPages}
        zoom={zoom}
        onZoom={changeZoom}
        onResetZoom={() => {
          markInteracted();
          setZoom(1);
        }}
        fit={fit}
        onFit={(next) => {
          markInteracted();
          setFit(next);
        }}
        mode={mode}
        onMode={(next) => {
          markInteracted();
          reveal();
          setMode(next);
        }}
        viewOpen={viewOpen}
        onViewOpenChange={setViewOpen}
        onGo={(target) => go(target)}
        onHide={hideToolbar}
        hidden={chromeHidden}
        reduceMotion={reduceMotion}
        toolbarRef={toolbarRef}
        panelRef={panelRef}
        triggerRef={triggerRef}
        pageInputRef={pageInputRef}
      />

      {toolbarHidden ? (
        <button
          ref={showPillRef}
          type="button"
          onClick={() => {
            setToolbarHidden(false);
            reveal();
          }}
          className={`${ITEM} fixed right-3 top-3 z-40 border border-border-strong bg-surface text-text shadow-[var(--shadow-soft)] hover:bg-brand-soft hover:text-brand`}
        >
          <Maximize2 size={16} aria-hidden="true" />
          Show toolbar
        </button>
      ) : null}

      <main
        id="main-content"
        className="relative flex min-h-0 flex-1 flex-col"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchRef.current = {
            x: touch.clientX,
            y: touch.clientY,
            t: event.timeStamp,
            multi: event.touches.length > 1,
          };
        }}
        onTouchEnd={(event) => {
          const start = touchRef.current;
          touchRef.current = null;
          if (!start || start.multi || event.changedTouches.length !== 1) return;

          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - start.x;
          const deltaY = touch.clientY - start.y;
          const scroller = scrollerRef.current;

          // Tap the middle of the page to toggle the toolbar — the standard
          // reader gesture. Guarded so it never competes with a scroll, a swipe,
          // or a tap on something interactive.
          const target = event.target as HTMLElement | null;
          const isTap =
            Math.abs(deltaX) < 10 &&
            Math.abs(deltaY) < 10 &&
            event.timeStamp - start.t < 400;
          if (isTap) {
            if (target?.closest('a, button, input, [role="button"], .textLayer')) return;
            if (!scroller) return;
            const box = scroller.getBoundingClientRect();
            const withinX =
              touch.clientX > box.left + box.width * 0.25 &&
              touch.clientX < box.right - box.width * 0.25;
            const withinY =
              touch.clientY > box.top + box.height * 0.2 &&
              touch.clientY < box.bottom - box.height * 0.2;
            if (withinX && withinY) setToolbarHidden((value) => !value);
            return;
          }

          // Swipe paging is single-page only: in continuous mode it fights
          // vertical scroll and means nothing.
          if (mode !== "single") return;
          if (scroller && scroller.scrollWidth > scroller.clientWidth) return;
          if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
          go(page + (deltaX < 0 ? 1 : -1));
        }}
      >
        <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-bg-soft px-2 py-2 sm:px-4">
          {resumePage ? (
            <div
              style={{ marginTop: toolbarHeight + 8 }}
              className="mx-auto mb-2 flex w-full max-w-[980px] flex-wrap items-center justify-between gap-3 rounded-lg border border-brand bg-brand-soft px-4 py-3 text-xs font-semibold text-text"
            >
              <p>Resuming at page {resumePage}. Start from the beginning?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="min-h-11 rounded-full px-3 text-brand transition hover:text-brand-strong hover:underline"
                  onClick={() => {
                    go(1);
                    setResumePage(null);
                  }}
                >
                  Start from the beginning
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-full px-3 text-muted transition hover:text-text"
                  onClick={() => setResumePage(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : null}

          <div
            ref={scrollerRef}
            role="region"
            tabIndex={0}
            aria-label="Book pages"
            style={{
              paddingTop: resumePage ? 12 : toolbarHeight + 12,
              scrollbarGutter: "stable",
              overflowAnchor: "none",
            }}
            className={`mx-auto min-h-0 w-full flex-1 overflow-auto rounded-lg border border-border bg-surface-inset px-2 pb-3 sm:px-3 ${
              fitPageFrame ? "w-fit max-w-full" : "max-w-[980px]"
            }`}
          >
            <Document
              file={book.pdfUrl}
              className="w-max min-w-full"
              loading={
                <div className="grid min-h-[520px] w-full place-items-center text-base font-semibold text-muted">
                  Loading PDF…
                </div>
              }
              error={
                <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-6 text-center">
                  <h2 className="font-serif text-xl font-semibold text-text">
                    PDF could not be opened
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted">
                    Download the file directly or return to the book page.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <a
                      href={book.pdfUrl}
                      download
                      className="flex h-14 items-center justify-center rounded-full bg-brand-fill px-7 text-base font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover"
                    >
                      Download the PDF
                    </a>
                    <Link
                      href={`/books/${book.slug}`}
                      className="flex h-14 items-center justify-center rounded-full text-base font-semibold text-brand transition hover:text-brand-strong hover:underline"
                    >
                      Back to book
                    </Link>
                  </div>
                </div>
              }
              onLoadSuccess={(loaded) => {
                setPdf(loaded);
                setNumPages(loaded.numPages);
                setResumePage((value) =>
                  value === null ? null : clamp(value, 1, loaded.numPages),
                );
                if (pendingPage !== null) {
                  const queued = pendingPage;
                  setPendingPage(null);
                  requestAnimationFrame(() => scrollToPage(queued));
                }
              }}
            >
              <div
                ref={listRef}
                className="mx-auto flex flex-col items-center"
                style={{ gap: PAGE_GAP }}
              >
                {slots.map((slotPage) => (
                  <PageSlot
                    key={slotPage}
                    pageNumber={slotPage}
                    width={pageWidth}
                    height={layout.heights[slotPage - 1] ?? Math.round(pageWidth * docRatio)}
                    live={mountedPages.has(slotPage)}
                    isCurrent={slotPage === page}
                    pixelRatio={pixelRatio}
                  />
                ))}
              </div>
            </Document>
          </div>

          {mode === "continuous" ? (
            numPages ? (
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center transition-opacity duration-300 ${
                  chromeHidden ? "opacity-0" : "opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setToolbarHidden(false);
                    setViewOpen(true);
                    requestAnimationFrame(() => triggerRef.current?.focus());
                  }}
                  className="pointer-events-auto inline-flex h-11 items-center rounded-full border border-border-strong bg-surface/95 px-4 text-xs font-semibold tabular-nums text-text shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-brand-soft hover:text-brand"
                >
                  Page {page} of {numPages}
                </button>
              </div>
            ) : null
          ) : (
            <div className="mx-auto mt-2 flex w-full max-w-[760px] shrink-0 items-center justify-center gap-2">
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand-fill px-4 text-xs font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover disabled:opacity-50"
                onClick={() => go(page - 1, { smooth: true })}
                disabled={!numPages || page <= 1}
              >
                <ChevronLeft size={20} aria-hidden="true" />
                Previous
              </button>

              <label
                htmlFor="reader-current-page"
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-xs font-semibold text-text"
              >
                Page
                <input
                  id="reader-current-page"
                  type="number"
                  min={1}
                  max={numPages || 1}
                  ref={pagerInputRef}
                  // Uncontrolled and committed on blur/Enter: the old controlled
                  // field could not be cleared to retype, because "" became 0.
                  defaultValue={page}
                  key={page}
                  onBlur={(event) => go(Number(event.currentTarget.value))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      go(Number(event.currentTarget.value));
                    }
                  }}
                  className="w-14 bg-transparent text-center font-semibold tabular-nums text-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-subtle">of</span>
                <span className="text-muted">{numPages ?? "—"}</span>
              </label>

              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand-fill px-4 text-xs font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover disabled:opacity-50"
                onClick={() => go(page + 1, { smooth: true })}
                disabled={!numPages || page >= numPages}
              >
                Next
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
