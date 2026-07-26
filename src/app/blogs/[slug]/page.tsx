import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Share2 } from "lucide-react";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { fetchPostBySlugFromSupabase } from "@/lib/supabase/blogs";
import { HARDCODED_AUTHOR, blogPosts } from "@/lib/mock/blogs";
import { books } from "@/lib/mock/books";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlugFromSupabase(slug);
  const relatedBook = books[0];

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <div className="sticky top-24 z-20 mt-24 h-1 bg-slate-100">
        <div className="h-full w-1/3 bg-brand" />
      </div>
      <main className="mx-auto grid w-full max-w-[1180px] flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,740px)_260px] lg:items-start">
        <article className="min-w-0">
          <header>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-text sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 text-xl leading-8 text-muted">{post.dek}</p>
            <p className="mt-6 text-sm font-semibold text-subtle">
              {HARDCODED_AUTHOR} · {post.publishedAt} · {post.readingTime} min read
            </p>
          </header>
          <div className="mt-10">
            <BlogRenderer content={post.contentJson} />
          </div>
        </article>

        <aside className="hidden space-y-4 lg:sticky lg:top-28 lg:block">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm font-bold text-text">Article Tools</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="grid h-10 place-items-center rounded-lg border border-border text-muted transition hover:border-blue-200 hover:text-brand"
                aria-label="Bookmark article"
                title="Bookmark"
              >
                <Bookmark size={16} />
              </button>
              <button
                type="button"
                className="grid h-10 place-items-center rounded-lg border border-border text-muted transition hover:border-blue-200 hover:text-brand"
                aria-label="Share article"
                title="Share"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm font-bold text-text">Related book</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-text">
              {relatedBook.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {relatedBook.description}
            </p>
            <Link
              href={`/reader/${relatedBook.id}`}
              className="mt-4 flex h-10 items-center justify-center rounded-lg bg-brand-soft text-sm font-bold text-brand"
            >
              Open PDF
            </Link>
          </div>
        </aside>
      </main>
      <PublicFooter />
    </div>
  );
}
