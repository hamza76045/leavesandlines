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
  const visibleBooks = initialBooks.filter((book) => !hiddenIds.includes(book.id));

  const featuredBook = visibleBooks[0];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-16 pt-28 sm:px-6">
        <header className="grid gap-6 border-b border-border pb-9 md:grid-cols-[1fr_2fr] md:items-end">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">The library · Vol. 01</p>
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-[1.02] text-text sm:text-6xl">A shelf built slowly.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">One complete work at a time, selected for long, attentive reading.</p>
          </div>
        </header>

        {featuredBook ? (
          <article className="grid gap-10 py-10 md:grid-cols-[300px_1fr] md:items-center lg:gap-20 lg:py-16">
            <Link
              href={`/books/${featuredBook.slug}`}
              className="mx-auto block w-full max-w-[260px] md:max-w-none"
            >
              <BookCover book={featuredBook} eager />
            </Link>
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">On the shelf now</p>
                <p className="font-serif text-sm italic text-subtle">No. 01</p>
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.14em] text-brand">{featuredBook.category}</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-[1.05] text-text sm:text-5xl">
                {featuredBook.title}
              </h2>
              <p className="mt-3 text-lg font-semibold text-muted">
                {featuredBook.author}
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                {featuredBook.description}
              </p>
              <p className="mt-5 text-sm font-semibold text-subtle">
                {featuredBook.language} · {featuredBook.pages} pages · {featuredBook.format}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/reader/${featuredBook.id}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-bold !text-white transition hover:bg-brand-strong"
                >
                  <BookOpen size={18} aria-hidden="true" />
                  Open PDF
                </Link>
                <Link
                  href={`/books/${featuredBook.slug}`}
                  className="flex h-12 items-center justify-center gap-2 px-3 text-sm font-bold text-text transition hover:text-brand"
                >
                  About the book
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <section className="py-20">
            <h2 className="font-display text-2xl font-semibold text-text">
              The shelf is empty
            </h2>
            <p className="mt-2 text-muted">Published books will appear here.</p>
          </section>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
