"use client";

import { useEffect, useRef } from "react";
import { Page } from "react-pdf";
import type { PdfPageLike } from "@/lib/reader/geometry";

/**
 * One page's reserved space in the scroll column.
 *
 * The slot is always in the DOM at an explicit height the shell computed; the
 * `<Page>` inside it is absolutely positioned. react-pdf's own wrapper is
 * `min-height: min-content` and sizes its canvas in a post-mount effect, so it
 * is zero-height for at least one frame — taking it out of flow makes
 * mount/unmount a zero-layout-impact operation, which is the mechanical reason
 * the scrollbar cannot jump.
 */
export function PageSlot({
  pageNumber,
  width,
  height,
  live,
  isCurrent,
  pixelRatio,
}: {
  pageNumber: number;
  width: number;
  height: number;
  live: boolean;
  isCurrent: boolean;
  pixelRatio: number;
}) {
  const proxyRef = useRef<PdfPageLike | null>(null);

  useEffect(() => {
    if (!live) return;
    return () => {
      const proxy = proxyRef.current;
      proxyRef.current = null;
      if (!proxy) return;

      // react-pdf zeroes the canvas backing store on unmount but never calls
      // page.cleanup(), and pdf.js caches every PDFPageProxy for the life of the
      // document. Without this, the decoded images and fonts of every page ever
      // scrolled past stay resident — over 401 pages, an unbounded leak.
      //
      // cleanup() returns false while a render task is still live, and whether
      // React runs react-pdf's cleanup (which cancels that task) before ours is
      // not guaranteed, so defer and retry rather than assuming an order.
      let attempts = 0;
      const attempt = () => {
        try {
          if (!proxy.cleanup() && attempts < 3) {
            attempts += 1;
            window.setTimeout(attempt, 50);
          }
        } catch {
          /* proxy went away with the document; nothing to free */
        }
      };
      window.setTimeout(attempt, 0);
    };
  }, [live]);

  return (
    <div
      // data-page, never id: globals.css gives [id] a 7rem scroll-margin-top.
      data-page={pageNumber}
      style={{ position: "relative", width, height }}
      className="mx-auto"
    >
      {live ? (
        <Page
          pageNumber={pageNumber}
          width={width}
          devicePixelRatio={pixelRatio}
          className="absolute inset-0 shadow-[var(--shadow-soft)]"
          loading={null}
          // Both default to true in react-pdf 10.4.1. The text layer builds one
          // absolutely positioned span per text run, so it is worth having only
          // on the page actually being read. This book has no link annotations.
          renderTextLayer={isCurrent}
          renderAnnotationLayer={false}
          onLoadSuccess={(page) => {
            proxyRef.current = page as unknown as PdfPageLike;
          }}
        />
      ) : (
        <div className="grid h-full place-items-center rounded-lg bg-surface text-xs font-semibold text-subtle">
          {pageNumber}
        </div>
      )}
    </div>
  );
}
