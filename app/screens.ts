import type { Lang } from "./i18n";

/* Screenshots of the Zeeta app shown in the phone frames.
   French ones sit in public/screens/<name>.webp; other languages in public/screens/<lang>/<name>.webp,
   same file name. next.config.ts lists which localised files exist at build time. */
const available: Record<string, string[]> = JSON.parse(process.env.NEXT_PUBLIC_SCREENS || "{}");

export function screenSrc(name: string, lang: Lang): string {
  // French is the original set. Any other language falls back to English when its own screenshot
  // is missing (the app has no Hindi or Russian), then to French.
  if (lang !== "fr") {
    for (const l of [lang, "en"]) {
      if (available[l]?.includes(name)) return `/screens/${l}/${name}.webp`;
    }
  }
  return `/screens/${name}.webp`;
}
