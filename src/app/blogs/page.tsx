import Link from "next/link";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const publishedPosts = await fetchPublishedPostsFromSupabase();
  const [featuredPost, ...remainingPosts] = publishedPosts;
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-16 pt-28 sm:px-6">
        <header className="grid gap-8 border-b border-border pb-9 md:grid-cols-[1fr_1.8fr] md:items-end">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">The journal · 2026</p>
          <div>
          <h1 className="font-serif text-4xl font-semibold leading-[1.02] text-text sm:text-6xl">
            Essays on books,<br />attention, and place.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Field notes from a small digital library, published slowly and read without hurry.
          </p>
          </div>
        </header>

        {featuredPost ? (
          <section className="grid gap-6 border-b border-border py-10 md:grid-cols-[72px_1fr_240px] md:py-14">
            <p className="font-serif text-lg italic text-subtle">01</p>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Featured essay</p>
              <Link href={`/blogs/${featuredPost.slug}`}>
                <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-[1.08] text-text transition hover:text-brand sm:text-5xl">
                  {featuredPost.title}
                </h2>
              </Link>
            </div>
            <div className="md:border-l md:border-border md:pl-6">
              <p className="text-[15px] leading-7 text-muted">{featuredPost.dek}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                {featuredPost.readingTime} minute read
              </p>
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-semibold text-text">More from the journal</h2>
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
