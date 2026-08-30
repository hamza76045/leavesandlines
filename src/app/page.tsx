import Link from "next/link";
import { ArrowDownRight, ArrowRight, BookOpen } from "lucide-react";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";
import { books } from "@/lib/mock/books";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publishedPosts = await fetchPublishedPostsFromSupabase();
  const featuredBook = books[0];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main className="flex-1 pt-18">
        <section className="border-b border-border">
          <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
            <div className="lg:col-span-8 lg:pr-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                  Featured reading · No. 01
                </p>
                <ArrowDownRight size={20} className="text-brand" aria-hidden="true" />
              </div>
              <h1 className="mt-8 max-w-4xl font-serif text-[clamp(3.4rem,8vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-text">
                {featuredBook.title}
              </h1>
              <div className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-[1fr_1.4fr]">
                <div>
                  <p className="font-serif text-xl italic text-text">{featuredBook.author}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                    {featuredBook.language} · {featuredBook.pages} pages
                  </p>
                </div>
                <div>
                  <p className="max-w-xl text-base leading-7 text-muted">{featuredBook.description}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/reader/${featuredBook.id}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-bold !text-white transition hover:bg-brand-strong"
                >
                  <BookOpen size={18} aria-hidden="true" />
                  Begin reading
                </Link>
                <Link
                  href={`/books/${featuredBook.slug}`}
                  className="flex h-12 items-center justify-center gap-2 px-2 text-sm font-bold text-text transition hover:text-brand"
                >
                  About this edition
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/books/${featuredBook.slug}`}
              className="mx-auto block w-full max-w-[280px] lg:col-span-4 lg:max-w-none lg:pl-4"
              aria-label={`View details for ${featuredBook.title}`}
            >
              <BookCover book={featuredBook} eager />
              <div className="mt-4 flex justify-between border-t border-border pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-subtle">
                <span>{featuredBook.category}</span>
                <span>{featuredBook.format}</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">The journal</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-text sm:text-4xl">Recent essays</h2>
            </div>
            <Link
              href="/blogs"
              className="hidden items-center gap-2 text-sm font-bold text-brand hover:text-brand-strong sm:flex"
            >
              All essays
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div>
            {publishedPosts.map((post, index) => (
              <ArticleRow key={post.id} post={post} index={index + 1} />
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
