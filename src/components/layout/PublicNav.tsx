"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, FileText, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/common/Logo";

const navItems = [
  { href: "/blogs", label: "Blog", icon: FileText },
  { href: "/books", label: "Books", icon: BookOpen },
];

export function PublicNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto flex w-full max-w-[1180px] items-center justify-between rounded-full border px-3 py-3 transition-all duration-300 ${isScrolled || mobileMenuOpen
            ? "border-border bg-surface/88 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            : "border-blue-200/50 bg-surface/72 shadow-sm backdrop-blur-md dark:border-blue-400/15 dark:bg-surface/54"
          }`}
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-full"
          aria-label="Go to Leafs and Lines home"
        >
          <span className="grid size-10 shrink-0 place-items-center">
            <Logo size={40} className="border-0 shadow-none" />
          </span>
          <span className="truncate font-display text-lg font-semibold text-text">
            Leafs and Lines
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-border bg-surface/72 p-1 backdrop-blur lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${pathname?.startsWith(href)
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:bg-brand-soft hover:text-brand"
                }`}
            >
              <Icon aria-hidden="true" size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle className="rounded-full bg-surface/72" />
          <Link
            href="/books"
            className="flex h-10 items-center rounded-full bg-brand px-5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)] transition hover:bg-brand-strong"
          >
            Start reading
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="rounded-full bg-surface/72" />
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full border border-border bg-surface/72 text-text transition hover:border-brand hover:text-brand"
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
        <div className="mx-auto mt-3 w-full max-w-[1180px] rounded-3xl border border-border bg-surface p-3 shadow-[var(--shadow-soft)] lg:hidden">
          <div className="grid gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${pathname?.startsWith(href)
                    ? "bg-brand-soft text-brand"
                    : "text-text hover:bg-brand-soft hover:text-brand"
                  }`}
              >
                <Icon aria-hidden="true" size={17} />
                {label}
              </Link>
            ))}
            <Link
              href="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-strong"
            >
              Start reading
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
