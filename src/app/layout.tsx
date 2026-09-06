import type { Metadata } from "next";
import Script from "next/script";
import { Literata, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { siteUrl } from "@/lib/site";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-reading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Leaves & Lines",
    template: "%s | Leaves & Lines",
  },
  description: "Essays and books for unhurried reading.",
  icons: { icon: "/logo.svg" },
};

const themeScript = `(function() {
  try {
    var saved = localStorage.getItem('leafs-and-lines-theme');
    var theme = saved === 'dark' ? 'dark' : 'light';
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
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${literata.variable} h-full antialiased`}
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
