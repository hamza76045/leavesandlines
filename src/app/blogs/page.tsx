import { Search, SlidersHorizontal } from "lucide-react";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const publishedPosts = await fetchPublishedPostsFromSupabase();
  const todaysBlogs = publishedPosts.slice(0, 2);
  const earlierPosts = publishedPosts.slice(2);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-10 pt-28 sm:px-6">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
            Blog
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.04] text-text">
            Essays, product notes, and reading workflows.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            A calm editorial workspace with daily reading notes and articles.
          </p>
        </header>

        <section className="mt-8 grid gap-4 border-y border-border py-5 lg:grid-cols-[minmax(0,1fr)_180px]">
          <label className="flex h-12 items-center gap-3 rounded-lg border border-border bg-surface px-3">
            <Search size={18} className="text-subtle" />
            <input
              className="w-full bg-transparent text-sm outline-none text-text placeholder:text-subtle"
              placeholder="Search articles"
            />
          </label>
          <button
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-bold text-text transition hover:border-brand hover:text-brand"
          >
            <SlidersHorizontal size={17} />
            Latest
          </button>
        </section>

        {/* Today's Blogs */}
        <section className="mt-10">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-brand"></span>
            </span>
            <h2 className="font-display text-xl font-bold text-text">Today&apos;s Blogs</h2>
          </div>
          <div>
            {todaysBlogs.map((post) => (
              <ArticleRow key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Earlier Articles */}
        {earlierPosts.length > 0 ? (
          <section className="mt-12">
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-xl font-bold text-text">Earlier Articles</h2>
            </div>
            <div>
              {earlierPosts.map((post) => (
                <ArticleRow key={post.id} post={post} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <PublicFooter />
    </div>
  );
}
