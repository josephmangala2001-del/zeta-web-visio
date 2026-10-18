/* Site languages: French (default), then the most spoken languages in the world. */
export const languages = [
  { code: "fr", label: "Français", locale: "fr-FR" },
  { code: "en", label: "English", locale: "en-GB" },
  { code: "zh", label: "中文", locale: "zh-CN" },
  { code: "hi", label: "हिन्दी", locale: "hi-IN" },
  { code: "es", label: "Español", locale: "es-ES" },
  { code: "ar", label: "العربية", locale: "ar", rtl: true },
  { code: "pt", label: "Português", locale: "pt-PT" },
  { code: "ru", label: "Русский", locale: "ru-RU" },
] as const;

export type Lang = (typeof languages)[number]["code"];

export function isLang(value: unknown): value is Lang {
  return languages.some((l) => l.code === value);
}

export function localeOf(lang: Lang): string {
  return languages.find((l) => l.code === lang)!.locale;
}

/* Query string that carries the language to another page (French needs none). */
export function langQuery(lang: Lang): string {
  return lang === "fr" ? "" : `?lang=${lang}`;
}

export function formatPrice(amount: number, lang: Lang): string {
  return new Intl.NumberFormat(localeOf(lang), { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

const STORAGE_KEY = "zeeta-lang";

export function readStoredLang(): Lang | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

/* Applies the language to <html>: lang attribute and text direction. */
export function applyLang(lang: Lang) {
  const meta = languages.find((l) => l.code === lang)!;
  document.documentElement.lang = lang;
  document.documentElement.dir = "rtl" in meta && meta.rtl ? "rtl" : "ltr";
}

/* Remembers the visitor's explicit choice for the next pages. */
export function rememberLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable: the choice still applies to this page */
  }
}
