import { createClient } from "@/lib/supabase/client";
import { blogPosts as mockBlogPosts, type BlogPost } from "@/lib/mock/blogs";

export type SupabaseBlogPostRow = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  reading_time: number;
  published_at: string;
  status: string;
  content_json: any;
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
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return mockBlogPosts;
    }

    return data.map(mapRowToBlogPost);
  } catch {
    return mockBlogPosts;
  }
}

export async function fetchPublishedPostsFromSupabase(): Promise<BlogPost[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return mockBlogPosts.filter((p) => p.status === "published");
    }

    return data.map(mapRowToBlogPost);
  } catch {
    return mockBlogPosts.filter((p) => p.status === "published");
  }
}

export async function fetchPostBySlugFromSupabase(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return mockBlogPosts.find((p) => p.slug === slug) || null;
    }

    return mapRowToBlogPost(data);
  } catch {
    return mockBlogPosts.find((p) => p.slug === slug) || null;
  }
}

export async function fetchPostByIdFromSupabase(id: string): Promise<BlogPost | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return mockBlogPosts.find((p) => p.id === id) || null;
    }

    return mapRowToBlogPost(data);
  } catch {
    return mockBlogPosts.find((p) => p.id === id) || null;
  }
}

export async function upsertPostToSupabase(post: BlogPost): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const row = mapBlogPostToRow(post);
    const { error } = await supabase.from("blog_posts").upsert(row, { onConflict: "id" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to persist to Supabase" };
  }
}

export async function deletePostFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete from Supabase" };
  }
}
