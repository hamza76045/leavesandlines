"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  buildLayout,
  clamp,
  computeWindow,
  isLowMemoryDevice,
  scrollBehaviorFor,
  windowSizeFor,
  type Layout,
} from "@/lib/reader/geometry";

export type ReaderMode = "continuous" | "single";

/**
 * Windowed continuous scrolling over an arbitrarily long PDF.
 *
 * WHY THERE IS NO INFINITE LOOP — the two directions are wired to different
 * inputs and never meet:
 *
 *   observer  -> anchorRef (a ref: renders nothing) + setView (only on a real
 *                page change)
 *   pin effect-> keyed on `layout` ONLY, reads the anchor from that ref
 *
 * `view` never feeds a scroll; `layout` never feeds the observer. On top of
 * that structural break sit three belts: a suppression guard across programmatic
 * scrolls, a 1px bail, and the write-once `ratios` bound in usePageRatios which
 * caps the number of distinct layouts at `numPages`.
 *
 * Do not add `view.page` to the pin effect's dependencies. That is the edge that
 * would close the cycle.
 */
export function useContinuousPages({
  scrollerRef,
  listRef,
  ratios,
  pageWidth,
  numPages,
  mode,
  initialPage,
  toolbarHeight,
}: {
  scrollerRef: RefObject<HTMLDivElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  ratios: number[];
  pageWidth: number;
  numPages: number | null;
  mode: ReaderMode;
  initialPage: number;
  toolbarHeight: number;
}) {
  const [view, setView] = useState(() => ({ page: initialPage, dir: 1 }));
  const [viewportHeight, setViewportHeight] = useState(800);

  const layout = useMemo<Layout>(() => buildLayout(ratios, pageWidth), [ratios, pageWidth]);

  const mountedPages = useMemo(() => {
    const count = numPages ?? 0;
    if (!count) return new Set<number>();
    if (mode === "single") return new Set([clamp(view.page, 1, count)]);
    return computeWindow(
      view.page,
      view.dir,
      windowSizeFor(viewportHeight, layout, count, isLowMemoryDevice()),
      count,
    );
  }, [mode, numPages, view, layout, viewportHeight]);

  // Mirrors so observer and timer callbacks never read a stale value and never
  // need these as dependencies. Synced in a layout effect declared BEFORE the
  // pin effect below, so it commits first on the same render.
  const layoutRef = useRef(layout);
  const mountedRef = useRef(mountedPages);
  const modeRef = useRef(mode);
  const countRef = useRef(0);
  const toolbarRef = useRef(toolbarHeight);

  useLayoutEffect(() => {
    layoutRef.current = layout;
    mountedRef.current = mountedPages;
    modeRef.current = mode;
    countRef.current = numPages ?? 0;
    toolbarRef.current = toolbarHeight;
  }, [layout, mountedPages, mode, numPages, toolbarHeight]);

  const anchorRef = useRef({ page: initialPage, offsetRatio: 0 });
  const suppressRef = useRef(false);
  const releaseHandleRef = useRef(0);
  const restoredRef = useRef(false);

  /** scrollTop that puts slot `index` flush under the toolbar. */
  const slotTop = useCallback(
    (index: number) => {
      const list = listRef.current;
      const current = layoutRef.current;
      if (!list || !current.offsets.length) return 0;
      return list.offsetTop + current.offsets[index] - toolbarRef.current;
    },
    [listRef],
  );

  /**
   * Lift the observer guard once the programmatic scroll has settled. Always
   * with a timeout fallback: `scrollend` is not universally supported and
   * without the fallback the guard would stick and freeze the page indicator.
   */
  const release = useCallback(() => {
    const scroller = scrollerRef.current;
    window.clearTimeout(releaseHandleRef.current);
    const done = () => {
      window.clearTimeout(releaseHandleRef.current);
      scroller?.removeEventListener("scrollend", done);
      suppressRef.current = false;
    };
    scroller?.addEventListener("scrollend", done, { once: true });
    // Never release synchronously — observer callbacks arrive a frame late even
    // for an instant scroll.
    releaseHandleRef.current = window.setTimeout(done, 250);
  }, [scrollerRef]);

  useEffect(
    () => () => {
      window.clearTimeout(releaseHandleRef.current);
    },
    [],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new ResizeObserver(() => setViewportHeight(scroller.clientHeight || 800));
    observer.observe(scroller);
    setViewportHeight(scroller.clientHeight || 800);
    return () => observer.disconnect();
  }, [scrollerRef]);

  // Answers exactly one question: which page is the reader looking at.
  //
  // This is a scroll listener with a binary search over `layout.offsets`, not an
  // IntersectionObserver. We already own every offset exactly, so the search is
  // deterministic, needs no per-slot observation, survives slots mounting and
  // unmounting, and does not depend on observer delivery. It deliberately does
  // NOT decide what to mount: `mountedPages` derives from `view`, and this
  // writes `view` only when the page number actually changes.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const list = listRef.current;
    if (!scroller || !list || mode !== "continuous" || !numPages) return;

    let frame = 0;

    const read = () => {
      const current = layoutRef.current;
      if (!current.offsets.length) return;

      // Probe the vertical middle of the viewport: whatever sits under that line
      // is the page being read, so the indicator cannot flicker at a boundary.
      const probe =
        scroller.scrollTop - list.offsetTop + toolbarRef.current + scroller.clientHeight / 2;

      let lo = 0;
      let hi = current.offsets.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (current.offsets[mid] <= probe) lo = mid;
        else hi = mid - 1;
      }
      const best = lo + 1;

      anchorRef.current = {
        page: best,
        offsetRatio: clamp(
          (probe - current.offsets[lo] - scroller.clientHeight / 2) /
            (current.heights[lo] || 1),
          0,
          1,
        ),
      };

      if (suppressRef.current) return;
      setView((previous) =>
        previous.page === best ? previous : { page: best, dir: best > previous.page ? 1 : -1 },
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [mode, numPages, scrollerRef, listRef]);

  // The only place that moves the scroller besides an explicit scrollToPage.
  // Runs on every geometry change: zoom, resize, or real ratios replacing
  // estimates. Keyed on `layout` alone — never on the page number.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || mode !== "continuous" || !numPages || !layout.offsets.length) return;

    const { page, offsetRatio } = anchorRef.current;
    const index = clamp(page, 1, numPages) - 1;
    const top = slotTop(index) + offsetRatio * layout.heights[index];
    if (Math.abs(scroller.scrollTop - top) < 1) return;

    suppressRef.current = true;
    scroller.scrollTo({ top, left: scroller.scrollLeft, behavior: "instant" as ScrollBehavior });
    release();
  }, [layout, mode, numPages, slotTop, release, scrollerRef]);

  const scrollToPage = useCallback(
    (target: number, options: { smooth?: boolean } = {}) => {
      const count = countRef.current;
      if (!count || !Number.isFinite(target)) return;

      const page = clamp(Math.round(target), 1, count);
      anchorRef.current = { page, offsetRatio: 0 };
      suppressRef.current = true;
      setView((previous) =>
        previous.page === page ? previous : { page, dir: page > previous.page ? 1 : -1 },
      );

      if (modeRef.current === "single") {
        const scroller = scrollerRef.current;
        scroller?.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        release();
        return;
      }

      const scroller = scrollerRef.current;
      if (!scroller) {
        release();
        return;
      }
      scroller.scrollTo({
        top: slotTop(page - 1),
        left: 0,
        // Never smooth for a jump: restoring to page 380 would animate through
        // 379 pages, dragging the mount window and rendering canvases the whole
        // way. Only Previous/Next may ask for smooth.
        behavior: options.smooth ? scrollBehaviorFor("smooth") : ("instant" as ScrollBehavior),
      });
      release();
    },
    [slotTop, release, scrollerRef],
  );

  // One-shot restore, instant.
  useLayoutEffect(() => {
    if (restoredRef.current || !numPages) return;
    restoredRef.current = true;
    scrollToPage(initialPage);
  }, [numPages, initialPage, scrollToPage]);

  // Keep the reader's place across a mode switch.
  const previousModeRef = useRef(mode);
  useLayoutEffect(() => {
    if (!numPages || previousModeRef.current === mode) return;
    previousModeRef.current = mode;
    scrollToPage(anchorRef.current.page);
  }, [mode, numPages, scrollToPage]);

  return {
    page: clamp(view.page, 1, Math.max(1, numPages ?? 1)),
    layout,
    mountedPages,
    mountedRef,
    scrollToPage,
    anchorRef,
    suppressRef,
  };
}
