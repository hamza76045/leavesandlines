"use client";

import type { RefObject } from "react";
import { useEffect } from "react";
import { ChevronDown, Ellipsis, Minimize2, Minus, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MAX_ZOOM, MIN_ZOOM } from "@/lib/reader/geometry";
import type { ReaderMode } from "./useContinuousPages";

const ITEM =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition";

const CHOICE =
  "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-border " +
  "bg-surface px-2 text-xs font-semibold text-text transition hover:bg-brand-soft hover:text-brand " +
  "has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand " +
  "[&:has(:focus-visible)]:outline-[3px] [&:has(:focus-visible)]:outline-offset-[3px] " +
  "[&:has(:focus-visible)]:outline-brand";

/**
 * The low-frequency reader settings, behind one disclosure so they cost 40px of
 * toolbar instead of five separate buttons.
 *
 * The panel is always mounted and toggled with `hidden`, so `aria-controls`
 * always resolves and the tab order needs no `inert` bookkeeping. DOM order is
 * trigger then panel, so Tab flows naturally and no focus trap is required.
 */
export function ViewMenu({
  open,
  onOpenChange,
  triggerRef,
  panelRef,
  zoom,
  onZoom,
  onResetZoom,
  fit,
  onFit,
  mode,
  onMode,
  numPages,
  page,
  pageInputRef,
  onGo,
  onHideToolbar,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  zoom: number;
  onZoom: (delta: number) => void;
  onResetZoom: () => void;
  fit: "width" | "page";
  onFit: (fit: "width" | "page") => void;
  mode: ReaderMode;
  onMode: (mode: ReaderMode) => void;
  numPages: number | null;
  page: number;
  pageInputRef: RefObject<HTMLInputElement | null>;
  onGo: (page: number) => void;
  onHideToolbar: () => void;
}) {
  // Escape on the capture phase so it lands before the window-level pager.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      event.preventDefault();
      onOpenChange(false);
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      const hadFocus = panelRef.current?.contains(document.activeElement);
      onOpenChange(false);
      if (hadFocus) triggerRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onOpenChange, triggerRef, panelRef]);

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        id="reader-view-trigger"
        aria-expanded={open}
        aria-controls="reader-view-panel"
        aria-label="Reader options"
        onClick={() => onOpenChange(!open)}
        className={`grid size-10 place-items-center rounded-lg border border-border bg-surface transition lg:flex lg:w-auto lg:gap-2 lg:px-3 ${
          open ? "border-brand bg-brand-soft text-brand" : "text-text hover:bg-brand-soft hover:text-brand"
        }`}
      >
        <Ellipsis size={18} aria-hidden="true" className="lg:hidden" />
        <span className="hidden lg:inline">View</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`hidden transition-transform lg:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id="reader-view-panel"
        ref={panelRef}
        hidden={!open}
        aria-labelledby="reader-view-trigger"
        className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-80 max-w-[calc(100vw-1rem)] rounded-lg border border-border bg-surface-raised p-2 text-left shadow-[var(--shadow-soft)]"
      >
        <fieldset className="p-1 lg:hidden">
          <legend className="px-1 pb-1 text-xs font-semibold text-subtle">Zoom</legend>
          <div className="flex h-10 overflow-hidden rounded-lg border border-border bg-surface">
            <button
              type="button"
              aria-label="Smaller"
              onClick={() => onZoom(-1)}
              disabled={zoom <= MIN_ZOOM}
              className="grid flex-1 place-items-center text-muted transition hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onResetZoom}
              className="min-w-16 border-x border-border px-2 text-xs font-semibold tabular-nums text-text transition hover:bg-brand-soft hover:text-brand"
            >
              {Math.round(zoom * 100)}%
              <span className="sr-only"> zoom. Reset to 100 percent.</span>
            </button>
            <button
              type="button"
              aria-label="Larger"
              onClick={() => onZoom(1)}
              disabled={zoom >= MAX_ZOOM}
              className="grid flex-1 place-items-center text-muted transition hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
        </fieldset>

        <hr className="my-1 border-border lg:hidden" />

        {/* Native radios: free arrow-key roving and free grouping. The global
            key handler bails on form fields, so arrows here never page. */}
        <fieldset className="p-1">
          <legend className="px-1 pb-1 text-xs font-semibold text-subtle">Page size</legend>
          <div className="flex gap-1">
            {([["width", "Fit width"], ["page", "Fit page"]] as const).map(([value, label]) => (
              <label key={value} className={CHOICE}>
                <input
                  type="radio"
                  name="reader-fit"
                  value={value}
                  checked={fit === value}
                  onChange={() => onFit(value)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="p-1">
          <legend className="px-1 pb-1 text-xs font-semibold text-subtle">Page flow</legend>
          <div className="flex gap-1">
            {([["continuous", "Continuous"], ["single", "Single page"]] as const).map(
              ([value, label]) => (
                <label key={value} className={CHOICE}>
                  <input
                    type="radio"
                    name="reader-flow"
                    value={value}
                    checked={mode === value}
                    onChange={() => onMode(value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ),
            )}
          </div>
        </fieldset>

        <hr className="my-1 border-border" />

        <form
          className="flex items-end gap-1 p-1"
          onSubmit={(event) => {
            event.preventDefault();
            onGo(Number(pageInputRef.current?.value));
            onOpenChange(false);
            triggerRef.current?.focus();
          }}
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="reader-page-jump"
              className="block px-1 pb-1 text-xs font-semibold text-subtle"
            >
              Go to page
            </label>
            <input
              id="reader-page-jump"
              ref={pageInputRef}
              type="number"
              min={1}
              max={numPages || 1}
              defaultValue={page}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs font-semibold tabular-nums text-text"
            />
          </div>
          <button
            type="submit"
            className="h-10 shrink-0 rounded-lg bg-brand-fill px-4 text-xs font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover"
          >
            Go
          </button>
        </form>

        <hr className="my-1 border-border" />

        <div className="flex justify-end p-1">
          <ThemeToggle />
        </div>
        <div className="p-1 lg:hidden">
          <button
            type="button"
            onClick={onHideToolbar}
            className={`${ITEM} w-full border border-border bg-surface text-text hover:bg-brand-soft hover:text-brand`}
          >
            <Minimize2 size={16} aria-hidden="true" />
            Hide toolbar
          </button>
        </div>
      </div>
    </div>
  );
}
