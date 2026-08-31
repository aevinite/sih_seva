"use client";
/* ============================================================
   AeviWork — client providers (theme, language, toast)
   Replaces the old main.js theme/lang/toast logic with React.
   ============================================================ */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

/* ---------------- Language ---------------- */
type Lang = "en" | "hi";
type LangCtx = { lang: Lang; toggle: () => void; setLang: (l: Lang) => void };
const LanguageContext = createContext<LangCtx>({ lang: "en", toggle: () => {}, setLang: () => {} });

export function useLang() {
  return useContext(LanguageContext);
}

/** Inline bilingual text: <T en="Home" hi="होम" /> */
export function T({ en, hi }: { en: string; hi: string }) {
  const { lang } = useLang();
  return <>{lang === "hi" ? hi : en}</>;
}

/** Hook returning a picker: const t = useT(); t("Home","होम") */
export function useT() {
  const { lang } = useLang();
  return useCallback((en: string, hi: string) => (lang === "hi" ? hi : en), [lang]);
}

/* ---------------- Theme ---------------- */
type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggle: () => {} });
export function useTheme() {
  return useContext(ThemeContext);
}

/* ---------------- Toast ---------------- */
type ToastCtx = { show: (msg: string) => void };
const ToastContext = createContext<ToastCtx>({ show: () => {} });
export function useToast() {
  return useContext(ToastContext);
}

/* ---------------- Auth (real server session) ---------------- */
export type Session = { userId: string; email: string; role: string; name?: string } | null;
type AuthResult = { ok: boolean; error?: string; user?: NonNullable<Session> };
type AuthCtx = {
  session: Session;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (payload: Record<string, unknown>) => Promise<AuthResult>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthCtx>({
  session: null, ready: false,
  login: async () => ({ ok: false }), register: async () => ({ ok: false }), logout: async () => {},
});
export function useAuth() {
  return useContext(AuthContext);
}

/* ---------------- Dashboard mobile nav bridge ----------------
   Lets DashboardShell publish its section nav so the site Navbar's
   top-right menu (three-dots) can present it on phones, instead of a
   separate always-visible horizontal bar. */
export type DashNavData = {
  items: { view: string; en: string; hi: string; icon: React.ReactNode }[];
  active: string;
  setActive: (v: string) => void;
  extra: { en: string; hi: string; icon: React.ReactNode; toast?: string }[];
  who?: { name: string; initials: string; role: { en: string; hi: string }; color: string };
} | null;
type DashNavCtx = { dashNav: DashNavData; setDashNav: (n: DashNavData) => void };
const DashNavContext = createContext<DashNavCtx>({ dashNav: null, setDashNav: () => {} });
export function useDashNav() {
  return useContext(DashNavContext);
}

/* ---------------- Provider root ---------------- */
export function Providers({ children }: { children: React.ReactNode }) {
  const [dashNav, setDashNav] = useState<DashNavData>(null);
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [session, setSession] = useState<Session>(null);
  const [ready, setReady] = useState(false);

  // hydrate from what the no-flash script already applied / localStorage
  useEffect(() => {
    const t = (localStorage.getItem("sk-theme") as Theme) || "light";
    const l = (localStorage.getItem("sk-lang") as Lang) || "en";
    setTheme(t);
    setLangState(l);
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("lang", l);
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const j = await res.json();
        setSession(j.user || null);
      } catch { setSession(null); }
      setReady(true);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }),
    });
    const j = await res.json();
    if (res.ok && j.user) { setSession(j.user); return { ok: true, user: j.user }; }
    return { ok: false, error: j.error || "Login failed" };
  }, []);
  const register = useCallback(async (payload: Record<string, unknown>): Promise<AuthResult> => {
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (res.ok && j.user) { setSession(j.user); return { ok: true, user: j.user }; }
    return { ok: false, error: j.error || "Registration failed" };
  }, []);
  const logout = useCallback(async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    setSession(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("sk-theme", next);
      return next;
    });
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.setAttribute("lang", l);
    localStorage.setItem("sk-lang", l);
  }, []);
  const toggleLang = useCallback(() => setLang(lang === "en" ? "hi" : "en"), [lang, setLang]);

  const show = useCallback((msg: string) => {
    setToast(msg);
    setToastVisible(true);
    window.clearTimeout((show as unknown as { _t?: number })._t);
    (show as unknown as { _t?: number })._t = window.setTimeout(() => setToastVisible(false), 3200);
  }, []);

  return (
    <AuthContext.Provider value={{ session, ready, login, register, logout }}>
    <LanguageContext.Provider value={{ lang, toggle: toggleLang, setLang }}>
      <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
        <ToastContext.Provider value={{ show }}>
         <DashNavContext.Provider value={{ dashNav, setDashNav }}>
          {children}
          <div className={"toast" + (toastVisible ? " show" : "")} role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>{toast}</span>
          </div>
         </DashNavContext.Provider>
        </ToastContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
    </AuthContext.Provider>
  );
}
