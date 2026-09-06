import Link from "next/link";
import { formatPublishedDate, type BlogPost } from "@/lib/mock/blogs";

export function ArticleRow({ post, index }: { post: BlogPost; index: number }) {
  return (
    <article className="border-b border-border">
      <Link
        href={`/blogs/${post.slug}`}
        className="group grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-3 py-6 focus-visible:outline-offset-2 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-8"
      >
        <span className="font-serif text-sm italic text-subtle transition group-hover:text-brand">
          {String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0 max-w-3xl">
          <h3 className="font-serif text-2xl font-semibold leading-[1.15] text-text transition group-hover:text-brand">
            {post.title}
          </h3>
          <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted">
            {post.dek}
          </p>
        </div>
        <p className="col-start-2 text-xs font-semibold text-subtle sm:col-start-3 sm:row-start-1 sm:pt-1 sm:text-right">
          {formatPublishedDate(post.publishedAt)} · {post.readingTime} min read
        </p>
      </Link>
    </article>
  );
}
