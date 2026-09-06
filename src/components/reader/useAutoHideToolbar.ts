"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/reader/geometry";

const HIDE_THRESHOLD = 8;

/**
 * Hides the toolbar on downward scroll and reveals it on upward scroll, so the
 * page gets the full screen while the reader is actually reading.
 *
 * Never hides while a descendant holds focus (WCAG 2.2 SC 2.4.11 Focus Not
 * Obscured), while something has asked to keep it up, or during a programmatic
 * scroll.
 *
 * `peeked` is DERIVED rather than synced: `enabled` and `blocked` mask it at
 * read time, so the only writer is the scroll handler. That keeps every
 * setState inside an event handler instead of an effect.
 */
export function useAutoHideToolbar({
  scrollerRef,
  toolbarRef,
  panelRef,
  suppressRef,
  enabled,
  blocked,
  revealAbove,
}: {
  scrollerRef: RefObject<HTMLDivElement | null>;
  toolbarRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  suppressRef: RefObject<boolean>;
  enabled: boolean;
  /** True while something must keep the toolbar on screen (e.g. the View panel). */
  blocked: boolean;
  /** Always show the toolbar while scrolled within this many px of the top. */
  revealAbove: number;
}) {
  const [peeked, setPeeked] = useState(false);

  const blockedRef = useRef(blocked);
  const revealAboveRef = useRef(revealAbove);
  const lastTopRef = useRef(0);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    revealAboveRef.current = revealAbove;
  }, [revealAbove]);

  useEffect(() => {
    blockedRef.current = blocked;
  }, [blocked]);

  const reveal = useCallback(() => setPeeked(false), []);

  useEffect(() => {
    if (!enabled) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    lastTopRef.current = scroller.scrollTop;
    accumulatedRef.current = 0;

    const holdsFocus = () => {
      const active = document.activeElement;
      if (!active) return false;
      return Boolean(
        toolbarRef.current?.contains(active) || panelRef.current?.contains(active),
      );
    };

    const onScroll = () => {
      const top = scroller.scrollTop;
      const delta = top - lastTopRef.current;
      lastTopRef.current = top;

      if (suppressRef.current) return;

      // Anything within the toolbar's own height of the top counts as "at the
      // top" and always shows the bar. A plain `top < 4` is not enough: the
      // resting position on page one is already a few tens of pixels down,
      // because the list is padded to clear the toolbar.
      if (delta < 0 || top <= revealAboveRef.current) {
        accumulatedRef.current = 0;
        setPeeked(false);
        return;
      }

      if (blockedRef.current || holdsFocus()) return;

      accumulatedRef.current += delta;
      if (accumulatedRef.current > HIDE_THRESHOLD) setPeeked(true);
    };

    const onFocusIn = () => setPeeked(false);

    scroller.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [enabled, scrollerRef, toolbarRef, panelRef, suppressRef]);

  return {
    peeked: enabled && !blocked && peeked,
    reveal,
    reduceMotion: prefersReducedMotion(),
  };
}
