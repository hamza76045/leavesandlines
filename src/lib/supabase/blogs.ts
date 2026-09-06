import { createAdminClient, createPublicClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/mock/blogs";

export type SupabaseBlogPostRow = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  reading_time: number;
  published_at: string;
  status: string;
  content_json: BlogPost["contentJson"];
  created_at?: string;
};

function mapRowToBlogPost(row: SupabaseBlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.dek || "",
    readingTime: row.reading_time || 5,
    publishedAt: row.published_at || new Date().toISOString().split("T")[0],
    status: (row.status as BlogPost["status"]) || "published",
    contentJson: row.content_json,
  };
}

function mapBlogPostToRow(post: BlogPost): SupabaseBlogPostRow {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    dek: post.dek,
    reading_time: post.readingTime,
    published_at: post.publishedAt,
    status: post.status,
    content_json: post.contentJson,
  };
}

export async function fetchAllPostsFromSupabase(): Promise<BlogPost[]> {
  const { data, error } = await createAdminClient()
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapRowToBlogPost);
}

export async function fetchPublishedPostsFromSupabase(): Promise<BlogPost[]> {
  const { data, error } = await createPublicClient()
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapRowToBlogPost);
}

export async function fetchPostBySlugFromSupabase(slug: string): Promise<BlogPost | null> {
  const { data, error } = await createPublicClient()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToBlogPost(data) : null;
}

export async function fetchPostByIdFromSupabase(id: string): Promise<BlogPost | null> {
  const { data, error } = await createAdminClient()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToBlogPost(data) : null;
}

export async function upsertPostToSupabase(post: BlogPost): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const row = mapBlogPostToRow(post);
    const { error } = await supabase.from("blog_posts").upsert(row, { onConflict: "id" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to persist to Supabase",
    };
  }
}

export async function deletePostFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete from Supabase",
    };
  }
}
