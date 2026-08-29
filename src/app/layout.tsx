import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import AuthGate from "@/components/site/AuthGate";
import GoogleTranslate from "@/components/site/GoogleTranslate";

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
        <meta name="theme-color" content="#7c5cff" />
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <AuthGate>{children}</AuthGate>
        </Providers>
        <GoogleTranslate />
      </body>
    </html>
  );
}
