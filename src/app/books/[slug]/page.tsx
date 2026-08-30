import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
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
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main className="mx-auto grid w-full max-w-[1100px] flex-1 gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[340px_1fr] lg:gap-20">
        <div className="mx-auto w-full max-w-[300px] lg:sticky lg:top-28 lg:max-w-none lg:self-start">
          <BookCover book={book} eager />
          <p className="mt-4 border-t border-border pt-3 text-center text-[10px] font-bold uppercase tracking-[0.17em] text-subtle">Leafs &amp; Lines library · No. 01</p>
        </div>
        <section>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-strong"
          >
            <ArrowLeft size={16} />
            Back to books
          </Link>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
            {book.category}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-text sm:text-6xl">
            {book.title}
          </h1>
          <p className="mt-3 text-lg font-semibold text-muted">{book.author}</p>
          <p className="mt-7 max-w-2xl font-serif text-xl leading-8 text-muted">
            {book.description}
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-6 sm:grid-cols-4">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                Pages
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                {book.pages}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                Language
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                {book.language}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                Format
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                {book.format}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
                Collection
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                Travel writing
              </dd>
            </div>
          </dl>
          <div className="mt-10 max-w-2xl border-l border-brand pl-6">
            <h2 className="font-serif text-2xl font-semibold text-text">
              About this work
            </h2>
            <p className="mt-3 leading-7 text-muted">
              A travelogue that follows a journey from the Taj Mahal toward Zero
              Point, combining observation, history, and literary reflection.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/reader/${book.id}`}
              className="flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white transition hover:bg-brand-strong"
            >
              <FileText size={17} />
              Open PDF
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
