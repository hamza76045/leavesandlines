import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PdfReaderClient } from "@/components/reader/PdfReaderClient";
import { books, getBookById } from "@/lib/mock/books";

type PageProps = {
  params: Promise<{ bookId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) {
    return { title: "Reader not found", robots: { index: false } };
  }

  return {
    title: `Read ${book.title}`,
    description: book.description,
    alternates: { canonical: `/books/${book.slug}` },
    robots: { index: false, follow: true },
  };
}

export function generateStaticParams() {
  return books.map((book) => ({ bookId: book.id }));
}

export default async function ReaderPage({
  params,
}: PageProps) {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) {
    notFound();
  }

  return <PdfReaderClient book={book} />;
}
