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
          <table className="w-full min-w-[820px] text-left text-sm">
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
                    <td className="px-5 py-4 font-bold text-text">
                      {book.title}
                      {isHidden ? (
                        <span className="ml-2 inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500">
                          Hidden
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-muted">{book.author}</td>
                    <td className="px-5 py-4 text-muted">{book.category}</td>
                    <td className="px-5 py-4 text-muted">{book.pages}</td>
                    <td className="px-5 py-4">
                      {isHidden ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
                          <EyeOff size={13} />
                          Hidden from public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
                          <Eye size={13} />
                          Visible on public site
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => toggleHide(book.id)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                            isHidden
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "border border-border bg-surface text-muted hover:border-amber-500 hover:text-amber-500"
                          }`}
                        >
                          {isHidden ? (
                            <>
                              <Eye size={14} className="text-white" />
                              Unhide Book
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} />
                              Hide Book
                            </>
                          )}
                        </button>
                        <Link
                          href={`/reader/${book.id}`}
                          className="font-bold text-brand hover:text-brand-strong"
                        >
                          Open Reader
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
