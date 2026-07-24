import Link from "next/link";
import { BookOpen, FileText, LayoutDashboard, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/common/Logo";

const navItems = [
  { href: "/blogs", label: "Blog", icon: FileText },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/92 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={36} />
          <span className="font-display text-lg font-semibold text-text">
            Leafs and Lines
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted transition hover:bg-brand-soft hover:text-brand"
            >
              <Icon aria-hidden="true" size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:border-brand hover:text-brand"
            type="button"
            aria-label="Open search"
            title="Search"
          >
            <Search aria-hidden="true" size={18} />
          </button>
          <Link
            href="/admin/blogs/new"
            className="hidden h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-strong sm:flex"
          >
            Publish
          </Link>
        </div>
      </div>
    </header>
  );
}
