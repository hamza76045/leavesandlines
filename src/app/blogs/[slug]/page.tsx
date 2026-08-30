import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { fetchPostBySlugFromSupabase } from "@/lib/supabase/blogs";
import {
  formatPublishedDate,
  HARDCODED_AUTHOR,
  blogPosts,
} from "@/lib/mock/blogs";
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
      <main className="mx-auto grid w-full max-w-[1180px] flex-1 gap-14 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[minmax(0,740px)_270px] lg:items-start">
        <article className="min-w-0">
          <header className="border-b border-border pb-10">
            <div className="flex items-center justify-between gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">The journal · Essay</p>
              <p className="font-serif text-sm italic text-subtle">Leafs &amp; Lines</p>
            </div>
            <h1 className="mt-7 font-serif text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-text sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-xl leading-8 text-muted">{post.dek}</p>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.11em] text-subtle">
              {HARDCODED_AUTHOR} · {formatPublishedDate(post.publishedAt)} · {post.readingTime} min read
            </p>
          </header>
          <div className="mt-12">
            <BlogRenderer content={post.contentJson} />
          </div>
        </article>

        <aside className="border-t border-border pt-8 lg:sticky lg:top-28 lg:border-t lg:pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
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
            <p className="mt-2 text-sm leading-6 text-muted lg:line-clamp-4">
              A literary journey to continue the essay&apos;s exploration of attentive reading.
            </p>
            <span className="mt-3 inline-block text-sm font-bold text-brand">
              Open the companion book →
            </span>
            </div>
          </Link>
        </aside>
      </main>
      <PublicFooter />
    </div>
  );
}
