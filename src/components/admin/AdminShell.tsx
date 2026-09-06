"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Home,
  LogOut,
  Newspaper,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/common/Logo";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/books", label: "Books", icon: BookOpen },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg-soft text-text">
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        <aside className="flex min-w-0 flex-col border-b border-border bg-surface lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:flex-col lg:items-stretch lg:p-5">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Logo size={36} />
              <div className="min-w-0">
                <p className="whitespace-nowrap font-serif font-semibold text-text">Leaves &amp; Lines</p>
                <p className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-brand">
                  Single Admin
                </p>
              </div>
            </Link>
            <ThemeToggle className="self-end sm:self-auto lg:self-start" />
          </div>
          <nav className="grid grid-cols-4 gap-1 p-2 lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:p-3">
            <div className="contents lg:flex lg:flex-col lg:gap-1">
              {adminNav.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/admin"
                    ? pathname === href
                    : pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-xs font-bold transition lg:h-10 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm ${
                      active
                        ? "bg-brand-soft text-brand"
                        : "text-muted hover:bg-brand-soft hover:text-brand"
                    }`}
                  >
                    <Icon aria-hidden="true" size={18} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="contents lg:block lg:border-t lg:border-border lg:pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-xs font-bold text-red-500 transition hover:bg-red-500/10 lg:h-10 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm"
              >
                <LogOut aria-hidden="true" size={18} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
