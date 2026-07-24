import Link from "next/link";
import { HARDCODED_AUTHOR, type BlogPost } from "@/lib/mock/blogs";
import { ArticleMark } from "./ArticleMark";

export function ArticleRow({ post }: { post: BlogPost }) {
  return (
    <article className="grid gap-5 border-b border-border py-6 transition hover:border-brand md:grid-cols-[1fr_180px] md:items-center">
      <div>
        <Link href={`/blogs/${post.slug}`}>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-text transition hover:text-brand">
            {post.title}
          </h3>
        </Link>
        <p className="mt-3 max-w-2xl leading-7 text-muted">{post.dek}</p>
        <p className="mt-4 text-sm font-semibold text-subtle">
          {HARDCODED_AUTHOR} · {post.publishedAt} · {post.readingTime} min read
        </p>
      </div>
      <div className="hidden md:block">
        <ArticleMark post={post} />
      </div>
    </article>
  );
}
