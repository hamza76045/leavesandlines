import type { MetadataRoute } from "next";
import { books } from "@/lib/mock/books";
import { siteUrl } from "@/lib/site";
import { fetchPublishedPostsFromSupabase } from "@/lib/supabase/blogs";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPublishedPostsFromSupabase();
  const url = (path: string) => new URL(path, siteUrl).href;

  return [
    { url: url("/") },
    { url: url("/blogs") },
    { url: url("/books") },
    ...posts.map((post) => ({
      url: url(`/blogs/${post.slug}`),
      lastModified: post.publishedAt,
    })),
    ...books.map((book) => ({ url: url(`/books/${book.slug}`) })),
  ];
}
