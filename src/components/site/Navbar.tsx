"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang, useTheme, T } from "@/lib/providers";

const LINKS = [
  { href: "/", en: "Home", hi: "होम" },
  { href: "/services", en: "Services", hi: "सेवाएँ" },
  { href: "/booking", en: "Book Now", hi: "बुक करें" },
  { href: "/register", en: "Join as Worker", hi: "कार्यकर्ता बनें" },
  { href: "/dashboard-admin", en: "Federation", hi: "फेडरेशन" },
];
const DASH = [
  { href: "/dashboard-customer", en: "Customer Dashboard", hi: "ग्राहक डैशबोर्ड" },
  { href: "/dashboard-worker", en: "Worker Dashboard", hi: "कार्यकर्ता डैशबोर्ड" },
  { href: "/dashboard-admin", en: "Federation Admin", hi: "फेडरेशन एडमिन" },
];

export function BrandMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { toggle: toggleLang, lang } = useLang();
  const { toggle: toggleTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <nav className="nav">
        <div className="wrap">
          <Link href="/" className="brand">
            <BrandMark />
            <span>
              AeviWork<small>Sahkar se Samriddhi</small>
            </span>
          </Link>
          <div className="nav-links">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? "active" : ""}>
                <T en={l.en} hi={l.hi} />
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
              </svg>
              <span>{lang === "en" ? "हिं" : "EN"}</span>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <Link href="/login" className="btn btn-primary btn-sm hide-mobile">
              <T en="Sign In" hi="साइन इन" />
            </Link>
            <button className="icon-btn menu-btn hide-desktop" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <div className={"mobile-menu" + (open ? " open" : "")} onClick={() => setOpen(false)}>
        {LINKS.concat(DASH).map((l) => (
          <Link key={l.href + l.en} href={l.href}>
            <T en={l.en} hi={l.hi} />
          </Link>
        ))}
        <Link href="/login" className="btn btn-primary btn-block mt-2">
          <T en="Sign In" hi="साइन इन" />
        </Link>
      </div>
    </>
  );
}
