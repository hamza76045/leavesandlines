import Link from "next/link";
import { BookOpen, FilePlus2, Newspaper, Upload } from "lucide-react";
import { PublishStatusChip } from "@/components/admin/PublishStatusChip";
import { HARDCODED_AUTHOR, blogPosts } from "@/lib/mock/blogs";
import { books } from "@/lib/mock/books";

export default function AdminDashboardPage() {
  const publishedCount = blogPosts.filter(
    (post) => post.status === "published",
  ).length;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text">
            Publishing workspace
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blogs/new"
            className="flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold !text-white transition hover:bg-brand-strong"
          >
            <FilePlus2 size={16} className="!text-white" />
            New Blog
          </Link>
        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5">
          <Newspaper className="text-brand" size={20} />
          <p className="mt-4 text-sm font-bold text-muted">Published blogs</p>
          <p className="mt-1 font-display text-3xl font-semibold text-text">
            {publishedCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <BookOpen className="text-brand" size={20} />
          <p className="mt-4 text-sm font-bold text-muted">PDF books</p>
          <p className="mt-1 font-display text-3xl font-semibold text-text">
            {books.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <Upload className="text-accent" size={20} />
          <p className="mt-4 text-sm font-bold text-muted">Storage mode</p>
          <p className="mt-1 font-display text-3xl font-semibold text-text">
            Local
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-text">
            Recent posts
          </h2>
          <Link
            href="/admin/blogs"
            className="text-sm font-bold text-brand hover:text-brand-strong"
          >
            Manage blogs
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-bg-soft text-xs uppercase tracking-[0.12em] text-subtle">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 font-bold text-text">{post.title}</td>
                  <td className="px-5 py-4 text-muted">{HARDCODED_AUTHOR}</td>
                  <td className="px-5 py-4">
                    <PublishStatusChip status={post.status} />
                  </td>
                  <td className="px-5 py-4 text-muted">{post.publishedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
