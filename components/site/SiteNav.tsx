"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./siteNav.module.css";
import LangSelect from "./LangSelect";
import { langQuery, type Lang } from "../../app/i18n";
import { translations } from "../../app/translations";

/* Navigation of the inner pages: same pill as the landing page once scrolled.
   Below 1140px the links fold into a menu opened from the toggle. */
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
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = translations[lang].nav;
  const q = langQuery(lang);
  const close = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${menuOpen ? styles.headerMenuOpen : ""}`}>
      <nav className={styles.nav} aria-label={nav.menu}>
        <Link href={`/${q}`} aria-label="Zeeta" className={styles.navBrand}>
          <img src="/zeeta-wordmark-white.png" alt="Zeeta" className={styles.navLogo} />
        </Link>
        <div id="site-menu" className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}>
          <Link href={`/${q}#filieres`} onClick={close} className={active === "find" ? styles.navActive : undefined} aria-current={active === "find" ? "page" : undefined}>
            {nav.findMentor}
          </Link>
          <Link href={`/${q}#comment`} onClick={close}>{nav.howItWorks}</Link>
          <Link href={`/devenir-mentor${q}`} onClick={close} className={active === "become" ? styles.navActive : undefined} aria-current={active === "become" ? "page" : undefined}>
            {nav.becomeMentor}
          </Link>
          <Link href={`/${q}#faq`} onClick={close}>{nav.faq}</Link>
          <button
            type="button"
            className={styles.menuCta}
            onClick={() => {
              close();
              onDownload();
            }}
          >
            {nav.download}
          </button>
        </div>
        <div className={styles.navActions}>
          <LangSelect lang={lang} onChange={onLangChange} label={nav.language} />
          <button type="button" className={styles.navCta} onClick={onDownload}>
            {nav.download}
          </button>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={nav.menu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
