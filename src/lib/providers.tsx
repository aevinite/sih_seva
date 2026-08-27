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

/* ---------------- Auth (client-side demo session) ---------------- */
export type Session = { email: string; role: string; name?: string } | null;
type AuthCtx = { session: Session; ready: boolean; login: (s: NonNullable<Session>) => void; logout: () => void };
const AuthContext = createContext<AuthCtx>({ session: null, ready: false, login: () => {}, logout: () => {} });
export function useAuth() {
  return useContext(AuthContext);
}

/* ---------------- Provider root ---------------- */
export function Providers({ children }: { children: React.ReactNode }) {
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
    try {
      const s = localStorage.getItem("aw-session");
      if (s) setSession(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  const login = useCallback((s: NonNullable<Session>) => {
    setSession(s);
    try { localStorage.setItem("aw-session", JSON.stringify(s)); } catch {}
  }, []);
  const logout = useCallback(() => {
    setSession(null);
    try { localStorage.removeItem("aw-session"); } catch {}
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
    <AuthContext.Provider value={{ session, ready, login, logout }}>
    <LanguageContext.Provider value={{ lang, toggle: toggleLang, setLang }}>
      <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
        <ToastContext.Provider value={{ show }}>
          {children}
          <div className={"toast" + (toastVisible ? " show" : "")} role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>{toast}</span>
          </div>
        </ToastContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
    </AuthContext.Provider>
  );
}
