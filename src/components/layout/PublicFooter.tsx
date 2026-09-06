import Link from "next/link";
import { Shield } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ContinueReadingLink } from "@/components/reader/ContinueReading";
import { books } from "@/lib/mock/books";

const footerLinks = [
  { href: "/blogs", label: "Essays" },
  { href: "/books", label: "Library" },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-soft text-text">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-3 rounded-lg"
              aria-label="Go to Leaves and Lines home"
            >
              <Logo size={38} className="border border-border bg-surface shadow-sm" />
              <span className="font-serif text-lg font-semibold text-text">
                Leaves &amp; Lines
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-base leading-7 text-muted">
              Essays and books for unhurried reading.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-col items-start gap-1">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-12 items-center text-base text-muted transition hover:text-brand"
              >
                {label}
              </Link>
            ))}
            <ContinueReadingLink book={books[0]} />
          </nav>

          <div className="flex flex-col items-start lg:items-end">
            <p className="text-sm text-subtle">© {year} Leaves &amp; Lines.</p>
            <Link
              href="/admin"
              className="mt-3 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-subtle transition hover:text-brand"
            >
              <Shield aria-hidden="true" size={18} />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
