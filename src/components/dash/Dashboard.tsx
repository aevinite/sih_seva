"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { T, useLang, useDashNav } from "@/lib/providers";

/* ---------------- Panel routing context ---------------- */
type PanelCtx = { active: string; setActive: (v: string) => void };
const PanelContext = createContext<PanelCtx>({ active: "", setActive: () => {} });

export type NavItem = { view: string; en: string; hi: string; title?: string; icon: React.ReactNode };
export type ActionItem = { en: string; hi: string; icon: React.ReactNode; toast?: string };

export function View({ name, children }: { name: string; children: React.ReactNode }) {
  const { active } = useContext(PanelContext);
  return <section className={"view" + (active === name ? " active" : "")}>{children}</section>;
}

export function DashboardShell({
  who,
  nav,
  extraNav = [],
  sideLabel,
  eyebrow,
  subtitle,
  actions,
  children,
}: {
  who: { initials: string; name: string; role: { en: string; hi: string }; color: string; badge?: React.ReactNode };
  nav: NavItem[];
  extraNav?: ActionItem[];
  sideLabel?: { en: string; hi: string };
  eyebrow?: { en: string; hi: string };
  subtitle?: { en: string; hi: string };
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(nav[0]?.view ?? "");
  const [stack, setStack] = useState<string[]>([]);
  const { lang } = useLang();
  const { setDashNav } = useDashNav();

  // Navigate to a section, remembering where we came from so Back works.
  const go = (view: string) => {
    if (view !== active) setStack([...stack, active]);
    setActive(view);
    if (typeof window !== "undefined") history.replaceState(null, "", "#" + view);
  };
  const goBack = () => {
    if (!stack.length) return;
    const prev = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setActive(prev);
    if (typeof window !== "undefined") history.replaceState(null, "", "#" + prev);
  };

  // when hash present on load, honour it
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h && nav.some((n) => n.view === h)) setActive(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // publish this dashboard's sections to the Navbar's mobile (three-dots) menu,
  // so phones navigate from there instead of a separate horizontal bar
  useEffect(() => {
    setDashNav({ items: nav, active, setActive: go, extra: extraNav, who: { name: who.name, initials: who.initials, role: who.role, color: who.color } });
    return () => setDashNav(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stack, lang]);

  // fix Chart.js sizing when a hidden view becomes visible
  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(id);
  }, [active]);

  const current = nav.find((n) => n.view === active);
  const title = current ? current.title ?? (lang === "hi" ? current.hi : current.en) : "";

  return (
    <PanelContext.Provider value={{ active, setActive }}>
      <div className="dash">
        <aside className="sidebar">
          <div className="who">
            <span className="avatar" style={{ width: 40, height: 40, background: who.color }}>{who.initials}</span>
            <div>
              <b>{who.name}</b>
              <span><T en={who.role.en} hi={who.role.hi} /></span>
            </div>
          </div>
          {who.badge}
          <nav className="side-nav">
            {nav.map((n) => (
              <a
                key={n.view}
                href={"#" + n.view}
                className={active === n.view ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.view);
                }}
              >
                {n.icon}
                <span><T en={n.en} hi={n.hi} /></span>
              </a>
            ))}
            {sideLabel && <span className="side-label"><T en={sideLabel.en} hi={sideLabel.hi} /></span>}
            {extraNav.map((a, i) => (
              <ToastLink key={i} item={a} />
            ))}
          </nav>
        </aside>

        <main className="dash-main">
          {stack.length > 0 && (
            <button type="button" className="btn-back" onClick={goBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              <T en="Back" hi="वापस" />
            </button>
          )}
          <div className="dash-head between">
            <div>
              {eyebrow && <span className="eyebrow"><T en={eyebrow.en} hi={eyebrow.hi} /></span>}
              <h1>{title}</h1>
              {subtitle && <p className="text-muted mt-1"><T en={subtitle.en} hi={subtitle.hi} /></p>}
            </div>
            {actions && <div className="row" style={{ gap: 8 }}>{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </PanelContext.Provider>
  );
}

import { useToast } from "@/lib/providers";
function ToastLink({ item }: { item: ActionItem }) {
  const { show } = useToast();
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); if (item.toast) show(item.toast); }}>
      {item.icon}
      <span><T en={item.en} hi={item.hi} /></span>
    </a>
  );
}

/* ---------------- Interactive primitives ---------------- */
export type PillKind = "success" | "warning" | "danger" | "info" | "primary";

export function StatusPill({ kind, children }: { kind: PillKind; children: React.ReactNode }) {
  return (
    <span className={"pill pill-" + kind}>
      <span className="dot" /> {children}
    </span>
  );
}

/** A button that fires a toast (and optionally a callback). */
export function ActionButton({
  toast,
  onClick,
  className = "btn btn-ghost btn-sm",
  children,
  disabled,
}: {
  toast?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { show } = useToast();
  return (
    <button
      className={className}
      disabled={disabled}
      style={disabled ? { opacity: 0.45, pointerEvents: "none" } : undefined}
      onClick={() => { if (toast) show(toast); onClick?.(); }}
    >
      {children}
    </button>
  );
}

/** Simple text search box bound to a value/onChange. */
export function PanelSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="panel-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4-4" />
      </svg>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
