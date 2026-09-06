import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { books, getBookBySlug } from "@/lib/mock/books";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return { title: "Book not found", robots: { index: false } };
  }

  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/books/${book.slug}` },
  };
}

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default async function BookDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNav />
      <main id="main-content" className="mx-auto grid w-full max-w-[1100px] flex-1 gap-10 px-4 pb-16 pt-36 sm:px-6 sm:pt-28 lg:grid-cols-[340px_1fr] lg:gap-20">
        <div className="mx-auto w-full max-w-[300px] lg:sticky lg:top-28 lg:max-w-none lg:self-start">
          <BookCover book={book} eager />
          <p className="mt-4 border-t border-border pt-3 text-center text-xs font-semibold text-subtle">Leaves &amp; Lines library · No. 01</p>
        </div>
        <section>
          <Link
            href="/books"
            className="inline-flex min-h-14 items-center gap-2 text-base font-semibold text-brand hover:text-brand-strong hover:underline"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to the library
          </Link>
          <p className="mt-8 text-xs font-semibold text-subtle">
            {book.category}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-text sm:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 text-lg font-semibold text-muted">{book.author}</p>
          <p className="mt-7 max-w-2xl font-serif text-xl leading-8 text-muted">
            {book.description}
          </p>
          <Link
            href={`/reader/${book.id}`}
            className="mt-8 inline-flex h-14 items-center gap-2 whitespace-nowrap rounded-full bg-brand-fill px-7 text-base font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover"
          >
            <FileText size={20} aria-hidden="true" />
            Read this book
          </Link>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-6 sm:grid-cols-4">
            <div>
              <dt className="text-xs font-semibold text-subtle">
                Pages
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                {book.pages}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-subtle">
                Language
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                {book.language}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-subtle">
                Format
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                {book.format}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-subtle">
                Collection
              </dt>
              <dd className="mt-2 font-serif text-lg font-semibold">
                {book.category}
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
          <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
            <Link
              href={`/reader/${book.id}`}
              className="flex h-14 items-center gap-2 whitespace-nowrap rounded-full bg-brand-fill px-7 text-base font-semibold text-on-brand-fill transition hover:bg-brand-fill-hover"
            >
              <FileText size={20} aria-hidden="true" />
              Read this book
            </Link>
            <Link href="/books" className="flex h-14 items-center rounded-full px-3 text-base font-semibold text-brand hover:text-brand-strong hover:underline">
              Back to the library
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
