"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { books as initialBooks } from "@/lib/mock/books";

const filters = ["All", "Agriculture", "Programming", "Travelogue", "Literature"];

export default function BooksPage() {
  const [visibleBooks, setVisibleBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("leafs_hidden_books");
      if (stored) {
        const hiddenIds: string[] = JSON.parse(stored);
        setVisibleBooks(initialBooks.filter((b) => !hiddenIds.includes(b.id)));
      } else {
        setVisibleBooks(initialBooks);
      }
    } catch {
      setVisibleBooks(initialBooks);
    }
  }, []);

  const filteredBooks = visibleBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      book.category.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const featuredBook = filteredBooks[0] || visibleBooks[0] || initialBooks[0];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-10 pt-28 sm:px-6">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
              Books
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.04] text-text">
              A curated shelf for PDF reading.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Stable covers, clear metadata, and a focused reader for every PDF.
            </p>
          </div>
          <div className="flex h-12 items-center gap-3 rounded-lg border border-border bg-surface px-3">
            <Search size={18} className="text-subtle" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-subtle"
              placeholder="Search books"
            />
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-y border-border py-5">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`h-10 rounded-full px-4 text-sm font-bold transition ${
                activeFilter === filter
                  ? "bg-brand text-white"
                  : "border border-border bg-surface text-muted hover:border-blue-200 hover:text-brand"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {featuredBook ? (
          <section className="mt-8 grid gap-7 rounded-lg border border-border bg-surface p-5 md:grid-cols-[180px_1fr] md:items-center">
            <BookCover book={featuredBook} compact />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
                Featured book
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-text">
                {featuredBook.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-muted">
                {featuredBook.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-subtle">
                {featuredBook.author} · {featuredBook.pages} pages ·{" "}
                {featuredBook.category}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/reader/${featuredBook.id}`}
                  className="flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-bold !text-white transition hover:bg-brand-strong"
                >
                  Open PDF
                </Link>
                <Link
                  href={`/books/${featuredBook.slug}`}
                  className="flex h-11 items-center rounded-lg border border-border px-5 text-sm font-bold text-text transition hover:border-blue-200 hover:text-brand"
                >
                  Book details
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
