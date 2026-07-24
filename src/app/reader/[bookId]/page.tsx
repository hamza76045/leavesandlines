import { notFound } from "next/navigation";
import { PdfReaderClient } from "@/components/reader/PdfReaderClient";
import { books, getBookById } from "@/lib/mock/books";

export function generateStaticParams() {
  return books.map((book) => ({ bookId: book.id }));
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) {
    notFound();
  }

  return <PdfReaderClient book={book} />;
}
