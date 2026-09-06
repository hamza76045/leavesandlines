import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidAdminToken } from "@/lib/auth/admin";
import {
  deletePostFromSupabase,
  fetchAllPostsFromSupabase,
  fetchPublishedPostsFromSupabase,
  upsertPostToSupabase,
} from "@/lib/supabase/blogs";
import type { BlogPost } from "@/lib/mock/blogs";

async function isAdmin() {
  const token = (await cookies()).get("admin_session")?.value;
  return token ? isValidAdminToken(token) : false;
}

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  if (all) {
    if (!(await isAdmin())) return unauthorized();
    const posts = await fetchAllPostsFromSupabase();
    return NextResponse.json({ posts });
  }

  const posts = await fetchPublishedPostsFromSupabase();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) return unauthorized();
    const body = await request.json();
    
    // Generate clean base slug from title or fallback
    const rawTitle = body.title?.trim() || "Untitled Article";
    const baseSlug = body.slug?.trim() || rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `post-${Date.now()}`;
    const postId = body.id?.trim() || `b-${Date.now()}`;

    const post: BlogPost = {
      id: postId,
      slug: baseSlug,
      title: rawTitle,
      dek: body.dek || "",
      readingTime: Number(body.readingTime) || Math.max(1, Math.ceil((JSON.stringify(body.contentJson || "").length) / 500)),
      publishedAt: body.publishedAt || new Date().toISOString().split("T")[0],
      status: body.status || "published",
      contentJson: body.contentJson || { type: "doc", content: [] },
    };

    const res = await upsertPostToSupabase(post);

    if (!res.success) {
      // If slug conflict, append timestamp suffix and retry once
      if (res.error?.includes("unique constraint") || res.error?.includes("slug")) {
        post.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        const retryRes = await upsertPostToSupabase(post);
        if (!retryRes.success) {
          return NextResponse.json({ error: retryRes.error }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) return unauthorized();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const res = await deletePostFromSupabase(id);

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete post" },
      { status: 500 }
    );
  }
}
