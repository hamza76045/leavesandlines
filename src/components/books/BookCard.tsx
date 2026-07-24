import Link from "next/link";
import type { Book } from "@/lib/mock/books";
import { BookCover } from "./BookCover";

const statusLabels: Record<Book["status"], string> = {
  available: "Available",
  completed: "Completed",
  saved: "Saved",
};

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="group">
      <Link href={`/books/${book.slug}`} className="block">
        <BookCover book={book} />
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-snug text-text transition group-hover:text-brand">
              {book.title}
            </h3>
            <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand">
              {statusLabels[book.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">{book.author}</p>
          <p className="mt-2 text-sm text-subtle">
            {book.category} · {book.pages} pages
          </p>
        </div>
      </Link>
    </article>
  );
}
