"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (opts: object, el: string) => void } };
  }
}

// Indian languages offered site-wide (page base language is English)
export const INCLUDED_LANGS = "en,hi,bn,te,mr,ta,gu,kn,ml,pa,or,as,ur,sd,ne,sa,kok";

/** Loads the Google Translate element once so language selection works on every page. */
export default function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: INCLUDED_LANGS, autoDisplay: false },
          "google_translate_element"
        );
      }
    };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, []);

  return <div id="google_translate_element" aria-hidden />;
}
