import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArticleReadingColumn } from "@/components/blog/ArticleReadingColumn";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import {
  fetchPostBySlugFromSupabase,
  fetchPublishedPostsFromSupabase,
} from "@/lib/supabase/blogs";
import { blogPosts } from "@/lib/mock/blogs";
import { books } from "@/lib/mock/books";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const getPost = cache(fetchPostBySlugFromSupabase);

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Essay not found", robots: { index: false } };
  }

  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: `/blogs/${post.slug}` },
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const [post, publishedPosts] = await Promise.all([
    getPost(slug),
    fetchPublishedPostsFromSupabase(),
  ]);
  const relatedBook = books[0];

  if (!post) {
    notFound();
  }

  const postIndex = publishedPosts.findIndex((item) => item.slug === post.slug);
  const previousPost = postIndex > 0 ? publishedPosts[postIndex - 1] : null;
  const nextPost = postIndex >= 0 ? publishedPosts[postIndex + 1] ?? null : null;

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main id="main-content" className="mx-auto grid w-full max-w-[1180px] flex-1 gap-14 px-4 pb-16 pt-36 sm:px-6 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <article className="min-w-0">
          <ArticleReadingColumn post={post} />

          <nav aria-label="More essays" className="mt-16 border-t border-border pt-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {previousPost ? (
                <Link href={`/blogs/${previousPost.slug}`} className="rounded-lg border border-border-strong bg-surface p-5 transition hover:bg-brand-soft">
                  <span className="text-xs font-semibold text-subtle">Previous essay</span>
                  <span className="mt-2 block font-serif text-xl font-semibold text-text">{previousPost.title}</span>
                </Link>
              ) : null}
              {nextPost ? (
                <Link href={`/blogs/${nextPost.slug}`} className="rounded-lg border border-border-strong bg-surface p-5 transition hover:bg-brand-soft sm:text-right">
                  <span className="text-xs font-semibold text-subtle">Next essay</span>
                  <span className="mt-2 block font-serif text-xl font-semibold text-text">{nextPost.title}</span>
                </Link>
              ) : null}
            </div>
            <Link href="/blogs" className="mt-5 inline-flex min-h-14 items-center text-base font-semibold text-brand hover:text-brand-strong hover:underline">
              All essays
            </Link>
          </nav>
        </article>

        <aside className="border-t border-border pt-8 lg:sticky lg:top-28 lg:border-t lg:pt-5">
          <p className="text-xs font-semibold text-subtle">
            Read alongside
          </p>
          <Link
            href={`/books/${relatedBook.slug}`}
            className="group mt-5 grid max-w-sm grid-cols-[100px_1fr] gap-4 lg:block"
          >
            <div className="w-[100px] lg:w-full">
              <BookCover book={relatedBook} compact />
            </div>
            <div>
            <h2 className="mt-3 font-serif text-xl font-semibold text-text group-hover:text-brand">
              {relatedBook.title}
            </h2>
            <p className="mt-2 text-base leading-7 text-muted lg:line-clamp-4">
              A literary journey to continue the essay&apos;s exploration of attentive reading.
            </p>
            <span className="mt-3 inline-flex min-h-12 items-center text-base font-semibold text-brand">
              About this book →
            </span>
            </div>
          </Link>
        </aside>
      </main>
      <PublicFooter />
    </div>
  );
}
