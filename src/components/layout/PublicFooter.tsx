import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Shield } from "lucide-react";
import { Logo } from "@/components/common/Logo";

const footerLinks = [
  { href: "/blogs", label: "Blog", icon: FileText },
  { href: "/books", label: "Books", icon: BookOpen },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface text-text">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:py-12">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-start">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40"
              aria-label="Go to Leafs and Lines home"
            >
              <Logo size={42} className="border border-border bg-surface shadow-sm" />
              <span className="font-display text-xl font-semibold text-text">
                Leafs and Lines
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted">
              A calm editorial workspace for long-form articles, curated PDF
              books, and focused reading sessions.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">
              Explore
            </p>
            <div className="grid gap-2">
              {footerLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex h-10 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-muted transition hover:text-brand"
                >
                  <Icon
                    aria-hidden="true"
                    size={16}
                    className="text-subtle transition group-hover:text-brand"
                  />
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="rounded-lg border border-border bg-bg-soft p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
              Library
            </p>
            <p className="mt-2 max-w-56 text-sm leading-6 text-muted">
              Browse the shelf and open a PDF in the focused reader.
            </p>
            <Link
              href="/books"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold !text-white transition hover:bg-brand-strong"
            >
              Start reading
              <ArrowRight aria-hidden="true" size={16} className="!text-white" />
            </Link>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-4 border-t border-border pt-5 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Leafs and Lines. Built for quiet reading.</p>
          <Link
            href="/admin"
            className="inline-flex w-fit items-center gap-2 rounded-lg px-1 font-semibold text-subtle transition hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            <Shield aria-hidden="true" size={15} />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
