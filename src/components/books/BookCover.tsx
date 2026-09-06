import Image from "next/image";
import type { Book } from "@/lib/mock/books";

type BookCoverProps = {
  book: Pick<Book, "title" | "coverImage">;
  compact?: boolean;
  eager?: boolean;
};

export function BookCover({ book, compact = false, eager = false }: BookCoverProps) {
  return (
    <div
      className="relative aspect-[405/551] overflow-hidden rounded-md bg-surface shadow-[var(--shadow-soft)] ring-1 ring-border"
    >
      <Image
        src={book.coverImage}
        alt={`${book.title} cover`}
        fill
        sizes={
          compact
            ? "(max-width: 768px) 180px, 180px"
            : "(max-width: 768px) 100vw, 320px"
        }
        className="object-cover"
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
}
