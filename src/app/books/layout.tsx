import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Library",
    template: "%s | Leaves & Lines",
  },
  description:
    "A growing library of complete works selected for long, attentive reading.",
  alternates: { canonical: "/books" },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
