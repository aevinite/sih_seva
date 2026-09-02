"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme, useAuth, useDashNav, useToast, T } from "@/lib/providers";
import LangDropdown from "./LangDropdown";

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

// Phone bottom tab bar — short labels + icons so all top-level sections fit.
const BOTTOM = [
  { href: "/", en: "Home", hi: "होम", icon: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /> },
  { href: "/services", en: "Services", hi: "सेवाएँ", icon: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /> },
  { href: "/booking", en: "Book", hi: "बुक", icon: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4M12 13v4M10 15h4" /></> },
  { href: "/register", en: "Join", hi: "जुड़ें", icon: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20v-1a4 4 0 0 1 4-4h5M18 8v6M21 11h-6" /></> },
  { href: "/dashboard-customer", en: "Customer", hi: "ग्राहक", icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></> },
  { href: "/dashboard-worker", en: "Worker", hi: "वर्कर", icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></> },
  { href: "/dashboard-admin", en: "Federation", hi: "फेडरेशन", icon: <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" /> },
];

export function BrandMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path strokeWidth="2" d="M12 4.3 5.2 7.3v5.1c0 4.4 3 7.2 6.8 8.8 3.8-1.6 6.8-4.4 6.8-8.8V7.3z" />
        <path strokeWidth="2.4" d="M8.8 12.7l2.4 2.4 4.2-4.7" />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { toggle: toggleTheme, theme } = useTheme();
  const { session, logout } = useAuth();
  const { dashNav } = useDashNav();
  const { show } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const signOut = async () => { await logout(); router.push("/login"); };

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
            <LangDropdown />
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
            {session ? (
              <button className="btn btn-ink btn-sm hide-mobile" onClick={signOut}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                <T en="Sign out" hi="साइन आउट" />
              </button>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm hide-mobile">
                <T en="Sign In" hi="साइन इन" />
              </Link>
            )}
            <button className="icon-btn menu-btn hide-desktop" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <div className={"mobile-menu" + (open ? " open" : "")} onClick={() => setOpen(false)}>
        {dashNav && dashNav.items.length > 0 && (
          <div className="mm-dash">
            <span className="mm-label">{dashNav.who?.name || "Dashboard"}</span>
            {dashNav.items.map((n) => (
              <a
                key={n.view}
                href={"#" + n.view}
                className={"mm-item" + (dashNav.active === n.view ? " active" : "")}
                onClick={(e) => { e.preventDefault(); dashNav.setActive(n.view); history.replaceState(null, "", "#" + n.view); setOpen(false); }}
              >
                {n.icon}
                <span><T en={n.en} hi={n.hi} /></span>
              </a>
            ))}
            {dashNav.extra.filter((a) => a.en.toLowerCase() !== "logout").map((a, i) => (
              <a
                key={"x" + i}
                href="#"
                className="mm-item"
                onClick={(e) => { e.preventDefault(); if (a.toast) show(a.toast); setOpen(false); }}
              >
                {a.icon}
                <span><T en={a.en} hi={a.hi} /></span>
              </a>
            ))}
            <span className="mm-divider" />
          </div>
        )}
        {session ? (
          <button className="btn btn-primary btn-block mt-2" onClick={signOut}>
            <T en="Sign out" hi="साइन आउट" />
          </button>
        ) : (
          <Link href="/login" className="btn btn-primary btn-block mt-2">
            <T en="Sign In" hi="साइन इन" />
          </Link>
        )}
      </div>

      {/* Phone bottom tab bar — all top-level sections, scrolls if they overflow */}
      <nav className="bottom-nav" aria-label="Sections">
        {BOTTOM.map((l) => (
          <Link key={l.href} href={l.href} className={isActive(l.href) ? "active" : ""}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {l.icon}
            </svg>
            <span><T en={l.en} hi={l.hi} /></span>
          </Link>
        ))}
      </nav>
    </>
  );
}
