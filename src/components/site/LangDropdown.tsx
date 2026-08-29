"use client";
import { useEffect, useRef, useState } from "react";

// Major Indian languages (+ English). Codes match Google Translate.
const LANGS: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "as", label: "অসমীয়া" },
  { code: "ur", label: "اردو" },
  { code: "ne", label: "नेपाली" },
  { code: "sa", label: "संस्कृतम्" },
  { code: "kok", label: "कोंकणी" },
  { code: "sd", label: "سنڌي" },
];

function currentLang() {
  if (typeof document === "undefined") return "en";
  try { const ls = localStorage.getItem("aw-lang"); if (ls) return ls; } catch {}
  const m = document.cookie.match(/googtrans=\/[^/]+\/([\w-]+)/);
  return m ? m[1] : "en";
}

/** Custom, theme-matched language dropdown that drives the site-wide Google Translate element. */
export default function LangDropdown({ light = false }: { light?: boolean }) {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLang(currentLang());
    const sync = () => setLang(currentLang());
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("storage", sync); window.removeEventListener("focus", sync);
      document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey);
    };
  }, []);

  const change = (code: string) => {
    setOpen(false);
    setLang(code);
    try { localStorage.setItem("aw-lang", code); } catch {}
    if (code === "en") {
      const host = location.hostname;
      document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${host}`;
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${host}`;
      location.reload();
      return;
    }
    const trySet = (n = 0) => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (combo) { combo.value = code; combo.dispatchEvent(new Event("change")); }
      else if (n < 25) setTimeout(() => trySet(n + 1), 150);
      else { document.cookie = `googtrans=/en/${code};path=/`; location.reload(); }
    };
    trySet();
  };

  const currentLabel = LANGS.find((l) => l.code === lang)?.label ?? "English";

  return (
    <div className="lang-dd notranslate" translate="no" ref={ref}>
      <button
        type="button"
        className={"lang-select" + (light ? " light" : "")}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        title="Language"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
        <span className="lang-current">{currentLabel}</span>
        <svg className={"lang-caret" + (open ? " up" : "")} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="lang-menu" role="listbox">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === lang}
              className={"lang-item" + (l.code === lang ? " active" : "")}
              onClick={() => change(l.code)}
            >
              <span>{l.label}</span>
              {l.code === lang && (
                <svg className="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
