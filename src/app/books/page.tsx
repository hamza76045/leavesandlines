"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { books as initialBooks } from "@/lib/mock/books";

export default function BooksPage() {
  const hiddenBooks = useSyncExternalStore(
    (notify) => {
      window.addEventListener("storage", notify);
      return () => window.removeEventListener("storage", notify);
    },
    () => localStorage.getItem("leafs_hidden_books") ?? "[]",
    () => "[]",
  );
  let hiddenIds: string[] = [];
  try {
    hiddenIds = JSON.parse(hiddenBooks);
  } catch {}
  const visibleBooks = initialBooks.filter(
    (book) => !hiddenIds.includes(book.id),
  );

  const [featuredBook, ...remainingBooks] = visibleBooks;

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-16 pt-36 sm:px-6 sm:pt-28"
      >
        <header className="grid gap-6 border-b border-border pb-9 md:grid-cols-[1fr_2fr] md:items-end">
          <p className="text-xs font-semibold text-subtle">
            The library · Vol. 01
          </p>
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-[1.02] text-text sm:text-5xl">
              A shelf built slowly.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              One complete work at a time, selected for long, attentive reading.
            </p>
          </div>
        </header>

        {featuredBook ? (
          <article className="mt-10 grid grid-cols-[100px_minmax(0,1fr)] items-start gap-4 rounded-lg border border-border-strong border-t-4 border-t-brand bg-[linear-gradient(115deg,var(--color-surface-raised)_55%,var(--color-brand-soft)_100%)] p-4 shadow-sm sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6 sm:p-6 md:grid-cols-[300px_1fr] md:items-center md:gap-10 md:p-8 lg:gap-16 lg:p-12">
            <Link
              href={`/books/${featuredBook.slug}`}
              className="mx-auto block w-full max-w-[260px] md:max-w-none"
            >
              <BookCover book={featuredBook} eager />
            </Link>
            <div>
              <div className="flex items-center justify-between border-b border-border pb-2 md:pb-4">
                <p className="text-xs font-semibold text-brand md:text-sm">
                  Featured selection
                </p>
                <p className="font-serif text-xs italic text-subtle">No. 01</p>
              </div>
              <p className="mt-3 text-xs font-semibold text-subtle md:mt-7">
                {featuredBook.category}
              </p>
              <h2 className="mt-2 max-w-2xl font-serif text-2xl font-semibold leading-[1.08] text-text md:mt-4 md:text-4xl md:leading-[1.05] lg:text-5xl">
                {featuredBook.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-muted md:mt-3 md:text-lg">
                {featuredBook.author}
              </p>
              <p className="mt-4 hidden max-w-2xl text-sm leading-6 text-muted sm:line-clamp-2 md:mt-6 md:line-clamp-none md:text-lg md:leading-8">
                {featuredBook.description}
              </p>
              <p className="mt-3 text-xs font-semibold text-subtle md:mt-5 md:text-sm">
                {featuredBook.language} · {featuredBook.pages} pages ·{" "}
                {featuredBook.format}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 md:mt-8 md:gap-3">
                <Link
                  href={`/reader/${featuredBook.id}`}
                  aria-label={`Read ${featuredBook.title}`}
                  className="flex h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-fill px-3 text-xs font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover md:h-14 md:gap-2 md:rounded-full md:px-7 md:text-base"
                >
                  <BookOpen size={18} aria-hidden="true" />
                  <span className="md:hidden">Read</span>
                  <span className="hidden md:inline">Read this book</span>
                </Link>
                <Link
                  href={`/books/${featuredBook.slug}`}
                  aria-label={`About ${featuredBook.title}`}
                  className="flex h-10 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 text-xs font-semibold text-brand transition hover:text-brand-strong hover:underline md:h-14 md:gap-2 md:rounded-full md:px-3 md:text-base"
                >
                  <span className="md:hidden">Details</span>
                  <span className="hidden md:inline">About this book</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <section className="py-20">
            <h2 className="font-serif text-2xl font-semibold text-text">
              The shelf is empty
            </h2>
            <p className="mt-2 text-muted">Published books will appear here.</p>
          </section>
        )}

        {remainingBooks.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4 border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl font-semibold text-text">
                More from the library
              </h2>
              <p className="shrink-0 text-xs font-semibold text-subtle">
                {remainingBooks.length} more
              </p>
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {remainingBooks.map((book) => (
                <article key={book.id}>
                  <Link
                    href={`/books/${book.slug}`}
                    className="group grid grid-cols-[100px_minmax(0,1fr)] gap-4 border-b border-border pb-6 focus-visible:outline-offset-4 sm:block sm:border-b-0 sm:pb-0"
                  >
                    <div className="w-[100px] sm:w-full sm:max-w-[220px]">
                      <BookCover book={book} compact />
                    </div>
                    <div className="min-w-0 sm:mt-5">
                      <p className="text-xs font-semibold text-subtle">
                        {book.category}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-text transition group-hover:text-brand">
                        {book.title}
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-muted">
                        {book.author}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-subtle">
                        {book.pages} pages · {book.format}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {featuredBook ? (
          <p className="mt-12 border-t border-border py-8 text-base text-subtle">
            That&apos;s everything for now.
          </p>
        ) : null}
      </main>
      <PublicFooter />
    </div>
  );
}
