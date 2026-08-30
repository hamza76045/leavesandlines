"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button
        type="button"
        className={`grid size-11 place-items-center rounded-lg border border-border bg-surface text-muted opacity-50 ${className}`}
        aria-label="Toggle theme"
        disabled
      >
        <Sun size={18} />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`grid size-11 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:border-brand hover:text-brand ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon size={18} className="text-slate-600 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
