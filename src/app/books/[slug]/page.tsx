import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, FileText } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { PublicNav } from "@/components/layout/PublicNav";
import { books, getBookBySlug } from "@/lib/mock/books";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <PublicNav />
      <main className="mx-auto grid w-full max-w-[1040px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr]">
        <div>
          <BookCover book={book} />
        </div>
        <section>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-strong"
          >
            <ArrowLeft size={16} />
            Back to books
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-brand">
            {book.category}
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.04] text-text">
            {book.title}
          </h1>
          <p className="mt-3 text-lg font-semibold text-muted">{book.author}</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            {book.description}
          </p>
          <dl className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                Pages
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold">
                {book.pages}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                Status
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold capitalize">
                {book.status}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/reader/${book.id}`}
              className="flex h-11 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-strong"
            >
              <FileText size={17} />
              Open PDF
            </Link>
            <button
              type="button"
              className="flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-bold text-text transition hover:border-blue-200 hover:text-brand"
            >
              <Bookmark size={17} />
              Save to library
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
