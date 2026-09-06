"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/common/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-bg text-text lg:grid-cols-[minmax(320px,0.8fr)_1.2fr]">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <aside className="relative hidden overflow-hidden border-r border-border bg-brand-fill p-12 text-on-brand-fill lg:block">
        <Image
          src="/login.webp"
          alt=""
          fill
          sizes="40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-fill/45" />
        <div className="relative flex h-full flex-col justify-between">
          <Logo size={52} />
          <blockquote className="max-w-md font-serif text-4xl leading-tight">
            “A good reading room begins with careful editing.”
          </blockquote>
          <p className="text-xs font-bold text-on-brand-fill opacity-70">Leaves &amp; Lines · Publishing desk</p>
        </div>
      </aside>

      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-5 py-20 sm:px-8">
        <div>
          <Logo size={48} className="lg:hidden" />
          <p className="mt-8 text-xs font-bold text-brand lg:mt-0">Publishing desk</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-text">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage Leaves and Lines articles and books.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 border-y border-border py-7"
        >
          {error ? (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm font-semibold text-red-500">
              <ShieldAlert size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-muted"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text outline-none transition focus:border-brand"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-muted"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text outline-none transition focus:border-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-fill font-bold text-on-brand-fill transition hover:bg-brand-fill-hover disabled:opacity-50"
          >
            <LogIn size={18} className="text-white" />
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
