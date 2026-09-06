"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import type { Book } from "@/lib/mock/books";
import {
  clearBookProgress,
  getProgressSnapshot,
  parseProgress,
  subscribeToProgress,
} from "@/lib/reading-progress";

function useBookProgress(bookId: string) {
  const snapshot = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => "");
  return snapshot ? parseProgress(snapshot)[bookId] : undefined;
}

export function ContinueReadingCard({ book }: { book: Book }) {
  const progress = useBookProgress(book.id);

  if (!progress) return null;

  const totalPages = Math.max(1, progress.totalPages);
  const page = Math.min(Math.max(1, progress.page), totalPages);

  return (
    <section className="border-b border-border bg-bg-soft">
      <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-4 py-8 sm:grid-cols-[112px_1fr] sm:px-6 lg:grid-cols-[140px_1fr_auto] lg:items-center">
        <div className="w-28 sm:w-full">
          <BookCover book={book} compact />
        </div>
        <div>
          <p className="text-xs font-semibold text-subtle">Continue reading</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-text">{book.title}</h2>
          <p className="mt-2 text-base text-muted">
            You&apos;re on page {page} of {totalPages}
          </p>
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-surface-inset"
            role="progressbar"
            aria-label={`Reading progress for ${book.title}`}
            aria-valuemin={1}
            aria-valuemax={totalPages}
            aria-valuenow={page}
          >
            <div className="h-full rounded-full bg-brand-fill" style={{ width: `${(page / totalPages) * 100}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:col-start-2 lg:col-auto">
          <Link
            href={`/reader/${book.id}`}
            className="flex h-14 items-center gap-2 whitespace-nowrap rounded-full bg-brand-fill px-7 text-base font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover"
          >
            <BookOpen size={20} aria-hidden="true" />
            Continue reading
          </Link>
          <Link
            href={`/reader/${book.id}`}
            onClick={() => clearBookProgress(book.id)}
            className="flex h-14 items-center gap-2 rounded-full px-3 text-base font-semibold text-brand hover:text-brand-strong hover:underline"
          >
            Start over
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ContinueReadingLink({ book }: { book: Book }) {
  const progress = useBookProgress(book.id);
  if (!progress) return null;

  return (
    <Link
      href={`/reader/${book.id}`}
      className="flex min-h-12 items-center text-base text-muted transition hover:text-brand"
    >
      Continue reading
    </Link>
  );
}
