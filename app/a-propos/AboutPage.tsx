"use client";

import Link from "next/link";
import styles from "./about.module.css";
import SiteShell from "../../components/site/SiteShell";
import { useSiteLang } from "../useSiteLang";
import { pagesCopy } from "../locales";
import { formatPrice, langQuery, type Lang } from "../i18n";
import { coaches, filiereOrder } from "../mentors/coaches";

/* Figures shown on the page, from the real mentor data. */
const mentorCount = coaches.length;
const minPrice = Math.min(...coaches.map((c) => c.price));
const maxPrice = Math.max(...coaches.map((c) => c.price));
const faces = coaches.slice(0, 6);

function ZArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12.5h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12.5 5.5 22 12.5l-9.5 7z" fill="currentColor" />
    </svg>
  );
}

export default function AboutPage({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useSiteLang(initialLang);
  const c = pagesCopy[lang].about;
  const q = langQuery(lang);

  return (
    <SiteShell lang={lang} onLangChange={setLang}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{c.eyebrow}</p>
        <h1 className={styles.h1}>{c.title}</h1>
        <p className={styles.lead}>{c.lead}</p>
        <ul className={styles.faces} aria-hidden="true">
          {faces.map((f) => (
            <li key={f.n}>
              <img src={f.photo} alt="" />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.stats}>
        <div>
          <strong>{mentorCount}</strong>
          <span>{c.stats.mentors}</span>
        </div>
        <div>
          <strong>{filiereOrder.length}</strong>
          <span>{c.stats.tracks}</span>
        </div>
        <div>
          <strong>
            {formatPrice(minPrice, lang)} – {formatPrice(maxPrice, lang)}
          </strong>
          <span>{c.stats.rate}</span>
        </div>
      </section>

      <section className={styles.mission}>
        <h2 className={styles.h2}>{c.missionTitle}</h2>
        <div>
          {c.mission.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className={styles.valuesWrap}>
        <div className={styles.values}>
          <h2 className={styles.h2}>{c.valuesTitle}</h2>
          <ol>
            {c.values.map((v, i) => (
              <li key={v.title}>
                <span className={styles.num}>{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.ctas}>
        <Link href={`/${q}#filieres`} className={styles.ctaCard}>
          <h2>{c.candidates.title}</h2>
          <p>{c.candidates.desc}</p>
          <span>
            {c.candidates.cta}
            <ZArrow className={styles.arrow} />
          </span>
        </Link>
        <Link href={`/devenir-mentor${q}`} className={`${styles.ctaCard} ${styles.ctaDark}`}>
          <h2>{c.mentors.title}</h2>
          <p>{c.mentors.desc}</p>
          <span>
            {c.mentors.cta}
            <ZArrow className={styles.arrow} />
          </span>
        </Link>
      </section>
    </SiteShell>
  );
}
