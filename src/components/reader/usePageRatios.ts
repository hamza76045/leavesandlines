"use client";

import { useEffect, useRef, useState } from "react";
import { FALLBACK_RATIO, type PdfDocumentLike } from "@/lib/reader/geometry";

const UNIFORM_SAMPLES = 8;
/** Ratios within 0.5% of each other count as one shape. */
const UNIFORM_TOLERANCE = 0.005;
const BATCH = 24;

type Pair = [page: number, ratio: number];

/**
 * Measures every page's aspect ratio (h/w) so the shell can reserve scroll
 * space without rendering anything.
 *
 * Ratios are WRITE-ONCE. A slot's height may go estimate -> real exactly once
 * and never real -> different, which is what bounds the number of layout
 * revisions and stops the layout/pin/observer cycle from running forever. If
 * this is ever changed to re-measure (on rotation, say), that guarantee dies.
 */
export function usePageRatios(
  pdf: PdfDocumentLike | null,
  numPages: number | null,
  /** Restore target. Its contiguous prefix is measured first so the restore lands exactly. */
  targetPage: number,
  /** Stable callback reading a ref — a fresh closure here restarts the effect constantly. */
  isMounted: (page: number) => boolean,
) {
  const [ratios, setRatios] = useState<number[]>([]);
  const [docRatio, setDocRatio] = useState(FALLBACK_RATIO);

  const ratiosRef = useRef<number[]>([]);
  const inflightRef = useRef(new Set<number>());

  useEffect(() => {
    ratiosRef.current = ratios;
  }, [ratios]);

  useEffect(() => {
    if (!pdf || !numPages) return;

    let cancelled = false;
    let handle = 0;

    const measure = async (page: number) => {
      const proxy = await pdf.getPage(page);
      const viewport = proxy.getViewport({ scale: 1, rotation: proxy.rotate });
      // Safe at any time: pdf.js bails out of cleanup while a render task is
      // live. Guarded anyway so we never free a proxy the window is drawing,
      // and wrapped because `cleanup` throws once the document is destroyed.
      if (!isMounted(page)) {
        try {
          proxy.cleanup();
        } catch {
          /* document torn down; nothing to free */
        }
      }
      return viewport.height / viewport.width;
    };

    const commit = (pairs: Pair[]) => {
      if (cancelled || !pairs.length) return;
      setRatios((previous) => {
        const next =
          previous.length === numPages
            ? previous.slice()
            : new Array<number>(numPages).fill(0);
        let changed = false;
        for (const [page, ratio] of pairs) {
          if (!next[page - 1]) {
            next[page - 1] = ratio;
            changed = true;
          }
        }
        // Identity-stable when nothing moved, so `layout` does not recompute.
        return changed ? next : previous;
      });
    };

    const run = async () => {
      setRatios(new Array<number>(numPages).fill(0));

      // Phase 1 — uniformity probe. Eight round trips instead of 401.
      const probes = Array.from(
        new Set(
          Array.from({ length: UNIFORM_SAMPLES }, (_, i) =>
            1 + Math.round((i * (numPages - 1)) / Math.max(1, UNIFORM_SAMPLES - 1)),
          ),
        ),
      );

      let sampled: Pair[];
      try {
        sampled = await Promise.all(
          probes.map(async (page): Promise<Pair> => [page, await measure(page)]),
        );
      } catch {
        return;
      }
      if (cancelled) return;

      const values = sampled.map(([, ratio]) => ratio);
      const lowest = Math.min(...values);
      const highest = Math.max(...values);
      setDocRatio(values[0]);

      if (highest - lowest <= highest * UNIFORM_TOLERANCE) {
        // Single-shape document: fill from one value and stop. Restoring to
        // page 380 is then pixel-exact on the very first frame.
        setRatios(new Array<number>(numPages).fill(values[0]));
        return;
      }

      // Phase 2 — mixed shapes. The prefix up to the restore target decides the
      // restore offset, so measure it contiguously and first.
      commit(sampled);

      for (let start = 1; start <= Math.min(targetPage, numPages); start += BATCH) {
        if (cancelled) return;
        const todo: number[] = [];
        for (let page = start; page < start + BATCH && page <= targetPage; page += 1) {
          if (!ratiosRef.current[page - 1]) todo.push(page);
        }
        if (todo.length) {
          commit(
            await Promise.all(
              todo.map(async (page): Promise<Pair> => [page, await measure(page)]),
            ),
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      // Remainder, spiralling out from the target at idle priority.
      const schedule: (fn: () => void) => number =
        typeof window.requestIdleCallback === "function"
          ? (fn) => window.requestIdleCallback(fn as IdleRequestCallback, { timeout: 500 })
          : (fn) => window.setTimeout(fn, 16);

      const pump = async () => {
        if (cancelled) return;
        const known = ratiosRef.current;
        const todo: number[] = [];

        for (let distance = 0; distance < numPages && todo.length < BATCH; distance += 1) {
          const candidates =
            distance === 0 ? [targetPage] : [targetPage + distance, targetPage - distance];
          for (const page of candidates) {
            if (page < 1 || page > numPages) continue;
            if (known[page - 1] || inflightRef.current.has(page)) continue;
            inflightRef.current.add(page);
            todo.push(page);
            if (todo.length >= BATCH) break;
          }
        }

        if (!todo.length) return;
        try {
          commit(
            await Promise.all(
              todo.map(async (page): Promise<Pair> => [page, await measure(page)]),
            ),
          );
        } finally {
          for (const page of todo) inflightRef.current.delete(page);
        }
        handle = schedule(pump);
      };

      handle = schedule(pump);
    };

    void run();

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [pdf, numPages, targetPage, isMounted]);

  return { ratios, docRatio };
}
