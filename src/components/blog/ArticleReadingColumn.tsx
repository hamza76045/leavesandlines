"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import {
  formatPublishedDate,
  HARDCODED_AUTHOR,
  type BlogPost,
} from "@/lib/mock/blogs";

const TEXT_SIZE_KEY = "ll.text-size.v1";
const TEXT_SIZE_EVENT = "ll-text-size";
const sizes = [
  { value: "1", label: "Normal", sampleClass: "text-sm" },
  { value: "1.15", label: "Large", sampleClass: "text-base" },
  { value: "1.3", label: "Largest", sampleClass: "text-lg" },
] as const;

function getTextSize() {
  if (typeof window === "undefined") return "1";
  const value = localStorage.getItem(TEXT_SIZE_KEY);
  return sizes.some((size) => size.value === value) ? value! : "1";
}

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(TEXT_SIZE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(TEXT_SIZE_EVENT, notify);
  };
}

export function ArticleReadingColumn({ post }: { post: BlogPost }) {
  const scale = useSyncExternalStore(subscribe, getTextSize, () => "1");

  function setScale(value: string) {
    try {
      localStorage.setItem(TEXT_SIZE_KEY, value);
      window.dispatchEvent(new Event(TEXT_SIZE_EVENT));
    } catch {}
  }

  return (
    <>
      <header className="border-b border-border pb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-subtle">The journal · Essay</p>
            <p className="mt-2 font-serif text-sm italic text-subtle">Leaves &amp; Lines</p>
          </div>
          <fieldset className="w-fit shrink-0">
            <legend className="mb-1.5 text-xs font-semibold text-subtle">Text size</legend>
            <div className="grid grid-cols-3 rounded-lg border border-border bg-surface p-0.5">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setScale(size.value)}
                  aria-label={`${size.label} text size`}
                  aria-pressed={scale === size.value}
                  className={`grid size-9 place-items-center rounded-md border transition ${
                    scale === size.value
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-transparent text-muted hover:bg-surface-raised hover:text-text"
                  }`}
                >
                  <span className={`${size.sampleClass} font-serif leading-none`} aria-hidden="true">A</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <h1 className="mt-7 font-serif text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-text sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-[1.375rem] leading-8 text-muted">{post.dek}</p>
        <p className="mt-7 text-sm font-semibold text-subtle">
          {HARDCODED_AUTHOR} · {formatPublishedDate(post.publishedAt)} · {post.readingTime} min read
        </p>
      </header>
      <div
        className="mt-12"
        style={{ "--reading-scale": scale } as CSSProperties}
      >
        <BlogRenderer content={post.contentJson} />
      </div>
    </>
  );
}
