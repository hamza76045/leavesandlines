"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { books as initialBooks } from "@/lib/mock/books";

export default function AdminBooksPage() {
  const hiddenBooks = useSyncExternalStore(
    (notify) => {
      window.addEventListener("storage", notify);
      return () => window.removeEventListener("storage", notify);
    },
    () => localStorage.getItem("leafs_hidden_books") ?? "[]",
    () => "[]",
  );
  let hiddenBookIds: string[] = [];
  try {
    hiddenBookIds = JSON.parse(hiddenBooks);
  } catch {}

  function toggleHide(id: string) {
    const updated = hiddenBookIds.includes(id)
      ? hiddenBookIds.filter((item) => item !== id)
      : [...hiddenBookIds, id];
    try {
      localStorage.setItem("leafs_hidden_books", JSON.stringify(updated));
      window.dispatchEvent(new StorageEvent("storage", { key: "leafs_hidden_books" }));
    } catch {}
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold text-brand">
            Books Library
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-text">
            Manage PDF Library & Visibility
          </h1>
          <p className="mt-1 text-sm text-muted">
            Hide or unhide PDF books from the public site with one click.
          </p>
        </div>
      </header>

      <section className="mt-6 rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm sm:min-w-[820px]">
            <thead className="border-b border-border bg-bg-soft text-xs text-subtle">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Pages</th>
                <th className="px-5 py-3">Visibility</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialBooks.map((book) => {
                const isHidden = hiddenBookIds.includes(book.id);

                return (
                  <tr
                    key={book.id}
                    className={`border-b border-border last:border-0 transition ${
                      isHidden ? "opacity-60 bg-bg-soft/40" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-bold text-text">{book.title}</td>
                    <td className="px-5 py-4 text-muted">{book.author}</td>
                    <td className="px-5 py-4 text-muted">{book.category}</td>
                    <td className="px-5 py-4 text-muted">{book.pages}</td>
                    <td className="px-5 py-4">
                      {isHidden ? (
                        <span className="whitespace-nowrap text-xs font-bold text-amber-500">
                          Not visible
                        </span>
                      ) : (
                        <span className="whitespace-nowrap text-xs font-bold text-emerald-500">
                          Visible
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => toggleHide(book.id)}
                          aria-label={isHidden ? `Show ${book.title}` : `Hide ${book.title}`}
                          title={isHidden ? "Show book" : "Hide book"}
                          className={`grid size-9 shrink-0 place-items-center rounded-lg shadow-sm transition ${
                            isHidden
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "border border-border bg-surface text-muted hover:border-amber-500 hover:text-amber-500"
                          }`}
                        >
                          {isHidden ? (
                            <Eye size={15} aria-hidden="true" />
                          ) : (
                            <EyeOff size={15} aria-hidden="true" />
                          )}
                        </button>
                        <Link
                          href={`/reader/${book.id}`}
                          className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-lg border border-border bg-surface px-3 text-xs font-bold text-brand transition hover:border-brand hover:bg-brand-soft hover:text-brand-strong"
                        >
                          Open reader
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
