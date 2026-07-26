import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Search, Sparkles } from "lucide-react";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { BookCard } from "@/components/books/BookCard";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";
import { books } from "@/lib/mock/books";
import { HARDCODED_AUTHOR } from "@/lib/mock/blogs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publishedPosts = await fetchPublishedPostsFromSupabase();
  const featuredBook = books[0];
  const latestPost = publishedPosts[0];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-bg-soft)_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:42px_42px] opacity-45" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg-soft to-transparent" />
          <div className="relative mx-auto grid w-full max-w-[1180px] gap-10 px-4 py-12 sm:px-6 lg:min-h-[620px] lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand shadow-[var(--shadow-soft)] backdrop-blur">
                <Sparkles size={14} />
                Reading room now open
              </div>
              <h1 className="mt-6 max-w-sm font-display text-4xl font-semibold leading-[1.04] text-text sm:max-w-4xl sm:text-6xl lg:text-7xl">
                <span className="block sm:inline">Leaves and</span>{" "}
                <span className="block sm:inline">Lines</span>
              </h1>
              <p className="mt-5 max-w-sm text-lg leading-8 text-muted sm:max-w-2xl sm:text-xl">
                Essays, books, and focused PDF reading gathered into one quiet
                library for slower, better attention.
              </p>
              <div className="mt-8 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
                <Link
                  href={`/reader/${featuredBook.id}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-bold !text-white transition hover:bg-brand-strong sm:justify-start"
                >
                  <BookOpen size={18} className="!text-white" />
                  Start reading
                </Link>
                <Link
                  href="/blogs"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface/90 px-5 text-sm font-bold text-text shadow-sm transition hover:border-brand hover:text-brand sm:justify-start"
                >
                  Browse latest posts
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  ["PDF Library", `${books.length} books`],
                  ["Long-form Writing", `${publishedPosts.length} posts`],
                  ["Focused Reader", "Clean tools"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-surface/75 px-4 py-3 backdrop-blur"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                      {label}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-text">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[520px]">
              <div className="absolute left-4 right-4 top-8 h-[440px] rounded-lg border border-border bg-surface/70 shadow-[var(--shadow-soft)] backdrop-blur sm:left-10 sm:right-0" />
              <div className="absolute left-0 top-0 w-[235px] rotate-[-4deg] sm:w-[260px]">
                <BookCover book={featuredBook} />
              </div>
              <div className="absolute bottom-28 right-0 w-[82%] rounded-lg border border-border bg-surface p-5 shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:w-[315px]">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
                  Featured PDF
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-text">
                  {featuredBook.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {featuredBook.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="font-semibold text-subtle">
                    {featuredBook.pages} pages
                  </span>
                  <Link
                    href={`/reader/${featuredBook.id}`}
                    className="inline-flex items-center gap-1 font-bold text-brand transition hover:text-brand-strong"
                  >
                    Open PDF
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
              {latestPost ? (
                <Link
                  href={`/blogs/${latestPost.slug}`}
                  className="absolute bottom-0 left-4 right-8 rounded-lg border border-border bg-bg p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition hover:border-brand sm:left-20 sm:right-auto sm:w-[310px]"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand">
                    <FileText size={14} />
                    Latest today
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-text">
                    {latestPost.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-subtle">
                    {HARDCODED_AUTHOR} · {latestPost.readingTime} min read
                  </p>
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-brand"></span>
            </span>
            <h2 className="font-display text-2xl font-bold text-text">Today&apos;s Blogs</h2>
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
      <PublicFooter />
    </div>
  );
}
