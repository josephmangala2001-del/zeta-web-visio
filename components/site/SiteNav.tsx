"use client";

import Link from "next/link";
import styles from "./siteNav.module.css";
import LangSelect from "./LangSelect";
import { langQuery, type Lang } from "../../app/i18n";
import { translations } from "../../app/translations";

/* Navigation of the inner pages: same pill as the landing page once scrolled. */
export default function SiteNav({
  lang,
  onLangChange,
  active,
  onDownload,
}: {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  active?: "find" | "become";
  onDownload: () => void;
}) {
  const nav = translations[lang].nav;
  const q = langQuery(lang);
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href={`/${q}`} aria-label="Zeeta" className={styles.navBrand}>
          <img src="/zeeta-wordmark-white.png" alt="Zeeta" className={styles.navLogo} />
        </Link>
        <div className={styles.navLinks}>
          <Link href={`/${q}#filieres`} className={active === "find" ? styles.navActive : undefined} aria-current={active === "find" ? "page" : undefined}>
            {nav.findMentor}
          </Link>
          <Link href={`/${q}#comment`}>{nav.howItWorks}</Link>
          <Link href={`/devenir-mentor${q}`} className={active === "become" ? styles.navActive : undefined} aria-current={active === "become" ? "page" : undefined}>
            {nav.becomeMentor}
          </Link>
          <Link href={`/${q}#faq`}>{nav.faq}</Link>
        </div>
        <div className={styles.navActions}>
          <LangSelect lang={lang} onChange={onLangChange} label={nav.language} />
          <button type="button" className={styles.navCta} onClick={onDownload}>
            {nav.download}
          </button>
        </div>
      </nav>
    </header>
  );
}
