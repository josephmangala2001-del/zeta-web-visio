import { useEffect, useState } from "react";
import { applyLang, isLang, readStoredLang, rememberLang, type Lang } from "./i18n";

/* Current site language. Server-rendered pages pass the ?lang= value they received;
   after mount the URL wins, then the language the visitor picked earlier. */
export function useSiteLang(initial: Lang = "fr") {
  const [lang, setLangState] = useState<Lang>(initial);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      const next = isLang(fromUrl) ? fromUrl : readStoredLang();
      if (next) setLangState(next);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    applyLang(lang);
  }, [lang]);

  const setLang = (next: Lang) => {
    rememberLang(next);
    setLangState(next);
    // Keep ?lang= in the address so a reload or a shared link opens in the same language.
    const url = new URL(window.location.href);
    if (next === "fr") url.searchParams.delete("lang");
    else url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  };

  return [lang, setLang] as const;
}
