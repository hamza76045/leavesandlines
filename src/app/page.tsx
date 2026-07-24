import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { BookCard } from "@/components/books/BookCard";
import { BookCover } from "@/components/books/BookCover";
import { PublicNav } from "@/components/layout/PublicNav";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";
import { books } from "@/lib/mock/books";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publishedPosts = await fetchPublishedPostsFromSupabase();
  const featuredBook = books[0];

  return (
    <div className="min-h-screen bg-bg text-text">
      <PublicNav />
      <main>
        <section className="mx-auto grid w-full max-w-[1180px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
              Current collection
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-text sm:text-6xl">
              Read articles and PDF books in one calm workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              A calm editorial workspace for long-form posts, curated books, and a
              focused PDF reader.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/books"
                className="flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-bold !text-white transition hover:bg-brand-strong"
              >
                <BookOpen size={17} className="!text-white" />
                Open library
              </Link>
              <Link
                href="/blogs"
                className="flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-bold text-text transition hover:border-brand hover:text-brand"
              >
                Latest writing
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <BookCover book={featuredBook} />
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
                Featured book
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-text">
                {featuredBook.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {featuredBook.description}
              </p>
              <Link
                href={`/reader/${featuredBook.id}`}
                className="mt-4 flex h-10 items-center justify-center rounded-lg bg-brand-soft text-sm font-bold text-brand transition hover:bg-blue-100 dark:hover:bg-brand/20"
              >
                Open PDF
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-brand"></span>
            </span>
            <h2 className="font-display text-2xl font-bold text-text">Today's Blogs</h2>
          </div>
          <div className="divide-y divide-border">
            {publishedPosts.map((post) => (
              <ArticleRow key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-bg-soft">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
                  Featured books
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-text">
                  A curated PDF shelf
                </h2>
              </div>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3">
                <Search size={16} className="text-subtle" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-subtle md:w-64"
                  placeholder="Search books"
                />
              </div>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
