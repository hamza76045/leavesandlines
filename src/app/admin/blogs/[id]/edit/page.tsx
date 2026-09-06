import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { fetchPostByIdFromSupabase } from "@/lib/supabase/blogs";
import { blogPosts } from "@/lib/mock/blogs";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchPostByIdFromSupabase(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-bold text-brand">
          Edit Blog
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">
          {post.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Update metadata, body content, and publish state from one workspace.
        </p>
      </header>
      <div className="mt-6">
        <BlogEditor
          initialId={post.id}
          initialSlug={post.slug}
          initialTitle={post.title}
          initialDek={post.dek}
          initialContent={post.contentJson}
        />
      </div>
    </div>
  );
}
