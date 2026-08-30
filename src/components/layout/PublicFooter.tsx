import Link from "next/link";
import { Shield } from "lucide-react";
import { Logo } from "@/components/common/Logo";

const footerLinks = [
  { href: "/blogs", label: "Essays" },
  { href: "/books", label: "Library" },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg text-text">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-lg"
              aria-label="Go to Leafs and Lines home"
            >
              <Logo size={38} className="border border-border bg-surface shadow-sm" />
              <span className="font-serif text-lg font-semibold text-text">
                Leafs &amp; Lines
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted">
              Essays and books for unhurried reading.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="group flex h-11 items-center text-xs font-bold uppercase tracking-[0.15em] text-muted transition hover:text-brand"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-border pt-5 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Leafs and Lines.</p>
          <Link
            href="/admin"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-lg font-semibold transition hover:text-brand"
          >
            <Shield aria-hidden="true" size={15} />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
