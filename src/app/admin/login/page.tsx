"use client";

import { useState } from "react";
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
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 text-text">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex justify-center">
            <Logo size={64} className="shadow-md" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-text">
            Admin Workspace
          </h1>
          <p className="mt-2 text-sm text-muted">
            Restricted portal. Only authorized single-admin access allowed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-8 shadow-soft"
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
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@leafsandlines.com"
                className="mt-2 h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-medium text-text outline-none transition focus:border-brand"
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
                className="mt-2 h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-medium text-text outline-none transition focus:border-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand font-bold !text-white transition hover:bg-brand-strong disabled:opacity-50"
          >
            <LogIn size={18} className="!text-white" />
            <span>{loading ? "Signing in..." : "Sign In to Portal"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
