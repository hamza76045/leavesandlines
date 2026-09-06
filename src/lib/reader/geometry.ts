/**
 * Pure layout arithmetic for the continuous-scroll reader. No React, no DOM.
 *
 * The invariant this file exists to protect: the shell owns every pixel of
 * vertical geometry, `<Page>` never does. `buildLayout` produces the exact
 * numbers that go into `style.height`, so `offsets` can never drift from the
 * rendered DOM.
 */

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.25;

export const PAGE_GAP = 16;
export const MIN_PAGE_W = 160;
export const MIN_SLOT_H = 48;

/** h/w of A4. Used only for slots whose real ratio has not landed yet. */
export const FALLBACK_RATIO = 1.4142;

export const clamp = (value: number, lo: number, hi: number) =>
  Math.min(Math.max(value, lo), hi);

export type Layout = {
  /** Rendered height of each slot, in order. */
  heights: number[];
  /** Distance from the top of the list to the top of each slot. */
  offsets: number[];
  /** Total height of the list, gaps included but no trailing gap. */
  total: number;
};

export const EMPTY_LAYOUT: Layout = { heights: [], offsets: [], total: 0 };

/**
 * Turn zoom-invariant page ratios into concrete slot geometry.
 *
 * `ratios` are h/w. A zero entry means "not measured yet" and falls back to A4,
 * which is why ratios must be WRITE-ONCE: a slot's height may go
 * estimate -> real exactly once, never real -> different. That bound is what
 * makes the layout/pin/observer cycle provably terminate.
 */
export function buildLayout(
  ratios: number[],
  pageWidth: number,
  gap = PAGE_GAP,
): Layout {
  const count = ratios.length;
  if (!count) return EMPTY_LAYOUT;

  const heights = new Array<number>(count);
  const offsets = new Array<number>(count);
  let y = 0;

  for (let i = 0; i < count; i += 1) {
    const height = Math.max(
      MIN_SLOT_H,
      Math.round(pageWidth * (ratios[i] || FALLBACK_RATIO)),
    );
    heights[i] = height;
    offsets[i] = y;
    y += height + gap;
  }

  return { heights, offsets, total: y - gap };
}

/**
 * How many pages to keep mounted.
 *
 * Sized by COVERAGE rather than a constant: a fixed window of 5 leaves visible
 * holes at 50% zoom on a tall display, while an unbounded overscan mounts ten
 * canvases there. Coverage lands on ~5 at every realistic zoom and never leaves
 * a gap the reader can see.
 */
export function windowSizeFor(
  viewportHeight: number,
  layout: Layout,
  count: number,
  lowMemory = false,
) {
  if (!count) return 0;
  const average = layout.total > 0 ? layout.total / count : viewportHeight;
  const visible = Math.ceil(viewportHeight / Math.max(1, average + PAGE_GAP));
  return clamp(visible + 3, 5, lowMemory ? 5 : 8);
}

/** True when the device has told us it is memory-constrained. */
export function isLowMemoryDevice() {
  if (typeof navigator === "undefined") return false;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof memory === "number" && memory <= 4;
}

/**
 * The set of page numbers to mount, biased by reading direction so there is
 * more runway ahead of the reader than behind.
 */
export function computeWindow(
  page: number,
  direction: number,
  size: number,
  count: number,
): Set<number> {
  const pages = new Set<number>();
  if (!count || !size) return pages;

  const behind = direction >= 0 ? 1 : size - 2;
  const start = clamp(page - behind, 1, Math.max(1, count - size + 1));
  const end = Math.min(count, start + size - 1);

  for (let p = start; p <= end; p += 1) pages.add(p);
  return pages;
}

/**
 * Cap the canvas backing-store multiplier.
 *
 * react-pdf renders the backing store at `scale * devicePixelRatio` but sets the
 * CSS size at `scale` alone, so memory grows with dpr squared. At 900px wide,
 * dpr 3, ratio 1.4 that is ~41MB for a single page.
 */
export function canvasPixelRatio(mountedCount: number) {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, mountedCount > 5 ? 1.5 : 2);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * CSS `scroll-behavior` cannot override a JS `behavior: "smooth"` option, so
 * reduced-motion has to be honoured here, at every call site.
 */
export function scrollBehaviorFor(preferred: "smooth" | "instant"): ScrollBehavior {
  return preferred === "smooth" && !prefersReducedMotion()
    ? "smooth"
    : ("instant" as ScrollBehavior);
}

/**
 * Structural stand-ins for the pdf.js proxies.
 *
 * react-pdf resolves its own nested pdfjs-dist, which is a different version
 * from the hoisted one. Importing `PDFDocumentProxy` from "pdfjs-dist" gives the
 * hoisted type and will not match what react-pdf's `onLoadSuccess` hands back,
 * so describe only what we actually use.
 */
export type PdfPageLike = {
  rotate: number;
  getViewport(params: { scale: number; rotation?: number }): {
    width: number;
    height: number;
  };
  cleanup(): boolean;
};

export type PdfDocumentLike = {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfPageLike>;
};
