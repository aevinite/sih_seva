import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "AeviWork — Cooperative Gig Services Platform",
  description:
    "A cooperative-owned digital marketplace connecting verified Labour Cooperative Society workers — electricians, plumbers, carpenters, caregivers & more — with households and institutions.",
};

const noFlash = `try{var t=localStorage.getItem('sk-theme');if(t)document.documentElement.setAttribute('data-theme',t);var l=localStorage.getItem('sk-lang');if(l)document.documentElement.setAttribute('lang',l);}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='20' font-size='20'>🛠️</text></svg>"
        />
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
