import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, BookOpen } from "lucide-react";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { ContinueReadingCard } from "@/components/reader/ContinueReading";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";
import { books } from "@/lib/mock/books";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl.origin}/#website`,
  url: siteUrl.origin,
  name: "Leaves & Lines",
  alternateName: "Leaves and Lines",
};

export default async function Home() {
  const publishedPosts = await fetchPublishedPostsFromSupabase();
  const featuredBook = books[0];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PublicNav />
      <main id="main-content" className="flex-1 pt-36 sm:pt-28">
        <ContinueReadingCard book={featuredBook} />
        <section className="border-b border-border">
          <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:py-24">
            <div className="lg:col-span-8 lg:pr-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <p className="text-xs font-semibold text-subtle">
                  Featured reading
                </p>
                <ArrowDownRight size={20} className="text-brand" aria-hidden="true" />
              </div>
              <h1 className="mt-8 max-w-4xl font-serif text-display font-semibold leading-[0.95] tracking-[-0.035em] text-text">
                {featuredBook.title}
              </h1>
              <div className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-[1fr_1.4fr]">
                <div>
                  <p className="font-serif text-xl italic text-text">{featuredBook.author}</p>
                  <p className="mt-2 text-xs font-semibold text-subtle">
                    {featuredBook.language} · {featuredBook.pages} pages
                  </p>
                </div>
                <div>
                  <p className="max-w-xl text-base leading-8 text-muted">{featuredBook.description}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/reader/${featuredBook.id}`}
                  className="flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-fill px-7 text-base font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover"
                >
                  <BookOpen size={18} aria-hidden="true" />
                  Read this book
                </Link>
                <Link
                  href={`/books/${featuredBook.slug}`}
                  className="flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 text-base font-semibold text-brand transition hover:text-brand-strong hover:underline"
                >
                  About this book
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
              <div className="mt-4 flex justify-between border-t border-border pt-3 text-xs font-semibold text-subtle">
                <span>{featuredBook.category}</span>
                <span>{featuredBook.format}</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold text-subtle">The journal</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-text">Recent essays</h2>
            </div>
            <Link
              href="/blogs"
              className="flex min-h-14 items-center gap-2 text-base font-semibold text-brand hover:text-brand-strong hover:underline"
            >
              All essays
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5">
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
