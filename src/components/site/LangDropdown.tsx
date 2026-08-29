"use client";
import { useEffect, useState } from "react";

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
  const m = typeof document !== "undefined" && document.cookie.match(/googtrans=\/[^/]+\/([\w-]+)/);
  return m ? m[1] : "en";
}

/** Header language selector — drives the Google Translate element so the whole site translates. */
export default function LangDropdown({ light = false }: { light?: boolean }) {
  const [lang, setLang] = useState("en");
  useEffect(() => { setLang(currentLang()); }, []);

  const change = (code: string) => {
    setLang(code);
    if (code === "en") {
      // clear translation → back to original English
      const host = location.hostname;
      document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${host}`;
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${host}`;
      location.reload();
      return;
    }
    const trySet = (n = 0) => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (combo) {
        combo.value = code;
        combo.dispatchEvent(new Event("change"));
      } else if (n < 25) {
        setTimeout(() => trySet(n + 1), 150);
      } else {
        document.cookie = `googtrans=/en/${code};path=/`;
        location.reload();
      }
    };
    trySet();
  };

  return (
    <select
      className={"lang-select" + (light ? " light" : "")}
      value={lang}
      onChange={(e) => change(e.target.value)}
      aria-label="Choose language"
      title="Language"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
