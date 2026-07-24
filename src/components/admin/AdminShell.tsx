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
        <aside className="flex flex-col border-b border-border bg-surface lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={36} />
              <div>
                <p className="font-display font-semibold text-text">Leafs & Lines</p>
                <p className="text-xs font-bold uppercase tracking-wider text-brand">
                  Single Admin
                </p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
          <nav className="flex flex-1 gap-1 overflow-x-auto p-3 lg:flex-col lg:justify-between">
            <div className="flex gap-1 lg:flex-col lg:space-y-1">
              {adminNav.map(({ href, label, icon: Icon }, index) => (
                <Link
                  key={`${href}-${label}-${index}`}
                  href={href}
                  className="flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-bold text-muted transition hover:bg-brand-soft hover:text-brand"
                >
                  <Icon aria-hidden="true" size={16} />
                  {label}
                </Link>
              ))}
            </div>
            <div className="pt-4 lg:border-t lg:border-border">
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-full shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-bold text-red-500 transition hover:bg-red-500/10"
              >
                <LogOut aria-hidden="true" size={16} />
                Logout
              </button>
            </div>
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
