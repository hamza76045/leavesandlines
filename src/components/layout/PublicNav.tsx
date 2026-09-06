"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { href: "/blogs", label: "Essays" },
  { href: "/books", label: "Library" },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-xl">
      <a
        href="#main-content"
        className="absolute left-4 top-2 z-10 -translate-y-20 rounded-full bg-brand-fill px-5 py-3 text-base font-semibold text-on-brand-fill transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-28 w-full max-w-[1180px] flex-col px-4 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="group flex min-h-14 min-w-0 items-center gap-3"
          aria-label="Go to Leaves and Lines home"
        >
          <span className="grid size-9 shrink-0 place-items-center">
            <Logo size={36} className="border-0 shadow-none" />
          </span>
          <span className="truncate font-serif text-lg font-semibold text-text">Leaves &amp; Lines</span>
          <span className="hidden border-l border-border pl-3 text-xs font-semibold text-subtle lg:block">
            A reading journal
          </span>
        </Link>

        <div className="flex min-h-14 items-center justify-between border-t border-border sm:min-h-0 sm:gap-4 sm:border-0">
          <nav className="flex items-center gap-1" aria-label="Primary navigation">
            {navItems.map(({ href, label }) => {
              const active = pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center border-b-2 px-2 text-base font-medium transition ${
                    active
                      ? "border-brand text-brand"
                      : "border-transparent text-muted hover:text-brand"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
