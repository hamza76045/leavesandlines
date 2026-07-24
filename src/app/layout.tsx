import type { Metadata } from "next";
import Script from "next/script";
import { Literata, Manrope, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-ui",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-reading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leafs and Lines",
  description: "A calm editorial workspace for PDF books and Tiptap articles.",
};

const themeScript = `(function() {
  try {
    var theme = localStorage.getItem('leafs-and-lines-theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${sora.variable} ${literata.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

