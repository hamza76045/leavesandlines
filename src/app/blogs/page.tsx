import type { Metadata } from "next";
import Link from "next/link";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { formatPublishedDate } from "@/lib/mock/blogs";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Essays on books, attention, and place, published slowly and read without hurry.",
  alternates: { canonical: "/blogs" },
};

export default async function BlogsPage() {
  const publishedPosts = await fetchPublishedPostsFromSupabase();
  const [featuredPost, ...remainingPosts] = publishedPosts;
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main id="main-content" className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-16 pt-36 sm:px-6 sm:pt-28">
        <header className="grid gap-8 border-b-2 border-border-strong pb-10 md:grid-cols-[1fr_1.8fr] md:items-end">
          <p className="text-xs font-semibold text-subtle">The journal · 2026</p>
          <div>
            <h1 className="max-w-[20ch] font-serif text-4xl font-semibold leading-[1.02] text-text sm:text-5xl">
              Essays on books, attention, and place.
            </h1>
            <p className="mt-5 max-w-[60ch] text-base leading-7 text-muted">
              Field notes from a small digital library, published slowly and read without hurry.
            </p>
          </div>
        </header>

        {featuredPost ? (
          <section className="mt-10 rounded-lg border border-border-strong border-t-4 border-t-brand bg-[linear-gradient(115deg,var(--color-surface-raised)_55%,var(--color-brand-soft)_100%)] shadow-sm">
            <Link
              href={`/blogs/${featuredPost.slug}`}
              className="group grid gap-6 px-6 py-8 focus-visible:outline-offset-2 sm:px-8 md:grid-cols-[56px_minmax(0,1fr)_240px] md:py-10"
            >
              <span className="font-serif text-sm italic text-subtle">01</span>
              <div>
                <p className="text-sm font-semibold text-brand">Featured essay</p>
                <h2 className="mt-3 max-w-[20ch] font-serif text-3xl font-semibold leading-[1.08] text-text transition group-hover:text-brand sm:text-4xl">
                  {featuredPost.title}
                </h2>
              </div>
              <div className="md:border-l md:border-border md:pl-6">
                <p className="text-base leading-7 text-muted">
                  {featuredPost.dek}
                </p>
                <p className="mt-5 text-xs font-semibold text-subtle">
                  {formatPublishedDate(featuredPost.publishedAt)} · {featuredPost.readingTime} min read
                </p>
              </div>
            </Link>
          </section>
        ) : null}

        <section className="mt-12">
          <div className="border-b border-border-strong pb-4">
            <h2 className="font-serif text-2xl font-semibold text-text">Latest</h2>
          </div>
          <div>
            {remainingPosts.map((post, index) => (
              <ArticleRow key={post.id} post={post} index={index + 2} />
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
