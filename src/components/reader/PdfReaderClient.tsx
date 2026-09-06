"use client";

import dynamic from "next/dynamic";
import type { Book } from "@/lib/mock/books";

const PdfReaderShell = dynamic(
  () => import("./PdfReaderShell").then((module) => module.PdfReaderShell),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-screen place-items-center bg-bg text-base font-semibold text-muted">
        Loading reader…
      </div>
    ),
  },
);

export function PdfReaderClient({ book }: { book: Book }) {
  return <PdfReaderShell key={book.id} book={book} />;
}
