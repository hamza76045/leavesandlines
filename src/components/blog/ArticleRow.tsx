import Link from "next/link";
import {
  formatPublishedDate,
  HARDCODED_AUTHOR,
  type BlogPost,
} from "@/lib/mock/blogs";

export function ArticleRow({ post, index }: { post: BlogPost; index?: number }) {
  return (
    <article className="group border-b border-border py-7 transition hover:border-brand sm:py-9">
      <div className="grid gap-4 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:gap-6">
        <span className="font-serif text-sm italic text-subtle">
          {String(index ?? 1).padStart(2, "0")}
        </span>
        <div className="max-w-3xl">
        <Link href={`/blogs/${post.slug}`}>
          <h3 className="font-serif text-2xl font-semibold leading-[1.15] text-text transition group-hover:text-brand sm:text-3xl">
            {post.title}
          </h3>
        </Link>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">{post.dek}</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle sm:pt-1 sm:text-right">
          {formatPublishedDate(post.publishedAt)}<br className="hidden sm:block" />
          <span className="mt-1 inline-block font-medium normal-case tracking-normal">
            {post.readingTime} min · {HARDCODED_AUTHOR}
          </span>
        </p>
      </div>
    </article>
  );
}
