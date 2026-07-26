import Image from "next/image";
import type { Book } from "@/lib/mock/books";

const coverStyles: Record<Book["coverTone"], string> = {
  blue: "from-blue-900 via-blue-700 to-blue-500",
  cyan: "from-slate-900 via-cyan-800 to-cyan-500",
  slate: "from-slate-900 via-slate-700 to-blue-700",
};

type BookCoverProps = {
  book: Pick<Book, "title" | "author" | "coverImage" | "coverTone" | "category">;
  compact?: boolean;
};

export function BookCover({ book, compact = false }: BookCoverProps) {
  if (book.coverImage) {
    return (
      <div
        className="relative aspect-[405/551] overflow-hidden rounded-md bg-surface shadow-[0_18px_36px_rgba(15,23,42,0.18)] ring-1 ring-black/10"
        aria-label={`${book.title} cover`}
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
        />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[405/551] overflow-hidden rounded-md bg-gradient-to-br ${coverStyles[book.coverTone]} shadow-[0_18px_36px_rgba(15,23,42,0.18)]`}
      aria-label={`${book.title} cover`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-white/55" />
      <div className="flex h-full flex-col justify-between p-5 text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-100">
            {book.category}
          </p>
          <h3
            className={`mt-4 font-display font-semibold leading-tight ${
              compact ? "text-lg" : "text-2xl"
            }`}
          >
            {book.title}
          </h3>
        </div>
        <div>
          <div className="mb-4 h-px w-12 bg-white/55" />
          <p className="text-sm font-semibold text-blue-50">{book.author}</p>
        </div>
      </div>
    </div>
  );
}
