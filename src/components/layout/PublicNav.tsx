"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/common/Logo";

const navItems = [
  { href: "/blogs", label: "Essays" },
  { href: "/books", label: "Library" },
];

export function PublicNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-[1180px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          aria-label="Go to Leafs and Lines home"
        >
          <span className="grid size-9 shrink-0 place-items-center">
            <Logo size={36} className="border-0 shadow-none" />
          </span>
          <span className="truncate font-serif text-lg font-semibold text-text">Leafs &amp; Lines</span>
          <span className="hidden border-l border-border pl-3 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle sm:block">
            A reading journal
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex h-11 items-center border-b px-1 text-xs font-bold uppercase tracking-[0.15em] transition ${pathname?.startsWith(href)
                  ? "border-brand text-brand"
                  : "border-transparent text-muted hover:text-brand"
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-lg border border-border bg-surface text-text transition hover:border-brand hover:text-brand"
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" size={20} />
            ) : (
              <Menu aria-hidden="true" size={20} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="mx-auto w-full border-b border-border bg-surface p-3 shadow-[var(--shadow-soft)] lg:hidden">
          <div className="grid gap-1">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex min-h-11 items-center rounded-lg px-4 py-3 text-sm font-semibold transition ${pathname?.startsWith(href)
                    ? "bg-brand-soft text-brand"
                    : "text-text hover:bg-brand-soft hover:text-brand"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
