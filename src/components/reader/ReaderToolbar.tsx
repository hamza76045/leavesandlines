"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { ChevronLeft, Minimize2 } from "lucide-react";
import { MAX_ZOOM, MIN_ZOOM } from "@/lib/reader/geometry";
import { ViewMenu } from "./ViewMenu";
import type { ReaderMode } from "./useContinuousPages";

const TOOL_BUTTON =
  "inline-flex h-10 items-center justify-center rounded-lg text-xs font-semibold transition";

/**
 * One compact 48px row. Below `lg`, secondary controls live in View so the
 * title always owns the flexible space.
 *
 * The header is absolutely positioned rather than a flex sibling: as a flex
 * child, auto-hiding it on every scroll-direction flip would change the
 * scroller's height, fire the ResizeObserver, change the page width and re-key
 * every live canvas. Absolute plus a transform costs zero layout.
 */
export function ReaderToolbar({
  bookTitle,
  bookSlug,
  page,
  numPages,
  zoom,
  onZoom,
  onResetZoom,
  fit,
  onFit,
  mode,
  onMode,
  viewOpen,
  onViewOpenChange,
  onGo,
  onHide,
  hidden,
  reduceMotion,
  toolbarRef,
  panelRef,
  triggerRef,
  pageInputRef,
}: {
  bookTitle: string;
  bookSlug: string;
  page: number;
  numPages: number | null;
  zoom: number;
  onZoom: (delta: number) => void;
  onResetZoom: () => void;
  fit: "width" | "page";
  onFit: (fit: "width" | "page") => void;
  mode: ReaderMode;
  onMode: (mode: ReaderMode) => void;
  viewOpen: boolean;
  onViewOpenChange: (open: boolean) => void;
  onGo: (page: number) => void;
  onHide: () => void;
  hidden: boolean;
  reduceMotion: boolean;
  toolbarRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  pageInputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <header
      ref={toolbarRef}
      // No overflow-hidden: the global focus ring is a 3px outline at 3px offset
      // and must be allowed to paint outside a 44px control in a 48px bar.
      className={`absolute inset-x-0 top-0 z-30 flex h-12 items-center gap-1 border-b border-border bg-surface/95 px-1 backdrop-blur lg:gap-2 lg:px-3 ${
        reduceMotion ? "" : "transition-transform duration-200"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* Absolute, so the progress bar costs nothing from the height budget.
          aria-hidden because the live region below is the announcement channel
          and this cannot satisfy valuemin <= valuenow <= valuemax before load. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-border"
      >
        <div
          className="h-full bg-brand-fill transition-[width] duration-200"
          style={{ width: numPages ? `${(page / numPages) * 100}%` : "0%" }}
        />
      </div>

      <Link
        href={`/books/${bookSlug}`}
        aria-label={`Back to ${bookTitle}`}
        className={`${TOOL_BUTTON} w-10 shrink-0 text-brand hover:bg-brand-soft hover:text-brand-strong lg:w-auto lg:gap-1 lg:px-2`}
      >
        <ChevronLeft size={18} aria-hidden="true" />
        <span className="hidden lg:inline">Back</span>
      </Link>

      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <h1 className="min-w-0 flex-1">
          <span className="block truncate font-serif text-xs font-semibold text-text">
            {bookTitle}
          </span>
        </h1>
        <p aria-hidden="true" className="shrink-0 text-xs font-semibold tabular-nums text-subtle">
          <span className="hidden lg:inline">Page </span>
          {page}
          <span className="hidden min-[400px]:inline"> of </span>
          <span className="min-[400px]:hidden">/</span>
          {numPages ?? "—"}
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Page {page} of {numPages ?? "unknown"}
        </p>
      </div>

      <div
        role="group"
        aria-label="Zoom"
        className="hidden h-10 shrink-0 items-stretch overflow-hidden rounded-lg border border-border bg-surface lg:flex"
      >
        <button
          type="button"
          aria-label="Smaller"
          onClick={() => onZoom(-1)}
          disabled={zoom <= MIN_ZOOM}
          className="flex w-10 items-center justify-center text-lg leading-none text-muted transition hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden="true">&minus;</span>
        </button>
        <button
          type="button"
          onClick={onResetZoom}
          className="flex min-w-12 items-center justify-center border-x border-border px-1 text-xs font-semibold tabular-nums text-text transition hover:bg-brand-soft hover:text-brand"
        >
          {Math.round(zoom * 100)}%<span className="sr-only"> zoom. Reset to 100 percent.</span>
        </button>
        <button
          type="button"
          aria-label="Larger"
          onClick={() => onZoom(1)}
          disabled={zoom >= MAX_ZOOM}
          className="flex w-10 items-center justify-center text-lg leading-none text-muted transition hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <ViewMenu
        open={viewOpen}
        onOpenChange={onViewOpenChange}
        triggerRef={triggerRef}
        panelRef={panelRef}
        zoom={zoom}
        onZoom={onZoom}
        onResetZoom={onResetZoom}
        fit={fit}
        onFit={onFit}
        mode={mode}
        onMode={onMode}
        numPages={numPages}
        page={page}
        pageInputRef={pageInputRef}
        onGo={onGo}
        onHideToolbar={onHide}
      />

      {/* Same action as the one inside the panel, mutually exclusive via
          display:none — exactly one is ever in the accessibility tree. */}
      <button
        type="button"
        onClick={onHide}
        aria-label="Hide toolbar"
        title="Hide toolbar"
        className={`${TOOL_BUTTON} hidden size-10 shrink-0 border border-border bg-surface text-muted hover:bg-brand-soft hover:text-brand lg:inline-flex`}
      >
        <Minimize2 size={16} aria-hidden="true" />
      </button>
    </header>
  );
}
