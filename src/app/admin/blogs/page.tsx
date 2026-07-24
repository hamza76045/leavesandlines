"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FilePlus2, RefreshCw, Search, Trash2 } from "lucide-react";
import { PublishStatusChip } from "@/components/admin/PublishStatusChip";
import { HARDCODED_AUTHOR, type BlogPost } from "@/lib/mock/blogs";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs?all=true");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handlePublish(post: BlogPost) {
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, status: "published" }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: "published" } : p))
        );
      }
    } catch {
      alert("Failed to publish post.");
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("Failed to delete post.");
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.dek.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const draftsCount = posts.filter((p) => p.status === "draft").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
            Blogs
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text">
            Manage Articles & Drafts
          </h1>
          <p className="mt-1 text-sm text-muted">
            All drafts and published posts persisted in Supabase.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadPosts}
            title="Refresh list"
            className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:border-brand hover:text-brand"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/admin/blogs/new"
            className="flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold !text-white transition hover:bg-brand-strong"
          >
            <FilePlus2 size={16} className="!text-white" />
            New Blog
          </Link>
        </div>
      </header>

      <section className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="flex h-11 max-w-md flex-1 items-center gap-3 rounded-lg border border-border bg-surface px-3">
          <Search size={17} className="text-subtle" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-subtle"
            placeholder="Search articles & drafts..."
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`h-10 rounded-lg px-4 text-sm font-bold transition ${
              statusFilter === "all"
                ? "bg-brand text-white"
                : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            All ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`h-10 rounded-lg px-4 text-sm font-bold transition ${
              statusFilter === "published"
                ? "bg-brand text-white"
                : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`h-10 rounded-lg px-4 text-sm font-bold transition ${
              statusFilter === "draft"
                ? "bg-amber-500 text-white"
                : "border border-border bg-surface text-amber-500 hover:border-amber-500"
            }`}
          >
            Drafts ({draftsCount})
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-border bg-bg-soft text-xs uppercase tracking-[0.12em] text-subtle">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Reading</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">
                    {loading ? "Loading blog posts..." : "No matching blog posts found."}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0">
                    <td className="max-w-sm px-5 py-4">
                      <p className="font-bold text-text">{post.title}</p>
                      <p className="mt-1 line-clamp-1 text-muted">{post.dek}</p>
                    </td>
                    <td className="px-5 py-4 text-muted">{HARDCODED_AUTHOR}</td>
                    <td className="px-5 py-4">
                      <PublishStatusChip status={post.status} />
                    </td>
                    <td className="px-5 py-4 text-muted">{post.readingTime} min</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {post.status === "draft" ? (
                          <button
                            type="button"
                            onClick={() => handlePublish(post)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold !text-white transition hover:bg-emerald-700 shadow-sm"
                            title="Publish article now"
                          >
                            Publish
                          </button>
                        ) : null}
                        <Link
                          href={`/admin/blogs/${post.id}/edit`}
                          className="font-bold text-brand hover:text-brand-strong"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-subtle transition hover:text-red-500"
                          title="Delete article"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
