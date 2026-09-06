import { BlogEditor } from "@/components/blog/BlogEditor";
import { emptyTiptapDocument } from "@/lib/mock/blogs";

export default function NewBlogPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-bold text-brand">
          New Blog
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-text">
          Publish article
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Draft the article body with the same rich text system readers will
          see on the public page.
        </p>
      </header>
      <div className="mt-6">
        <BlogEditor initialContent={emptyTiptapDocument} />
      </div>
    </div>
  );
}
