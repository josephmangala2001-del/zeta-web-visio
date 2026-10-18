"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./becomeMentor.module.css";
import SiteNav from "../../components/site/SiteNav";
import SiteFooter from "../../components/site/SiteFooter";
import { formatPrice, type Lang } from "../i18n";
import { becomeCopy } from "../locales";
import { useSiteLang } from "../useSiteLang";
import { coaches } from "../mentors/coaches";
import { translations } from "../translations";

/* Real price range of the mentors on Zeeta, shown as a benchmark. */
const minPrice = Math.min(...coaches.map((c) => c.price));
const maxPrice = Math.max(...coaches.map((c) => c.price));

const heroCoach = coaches.find((c) => c.name === "Jean-Marc Ekotto")!;
const quoteCoach = coaches.find((c) => c.name === "Inès Haddad")!;

function ZArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12.5h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12.5 5.5 22 12.5l-9.5 7z" fill="currentColor" />
    </svg>
  );
}

/* A photo shown as three offset frames, like a stack of video tiles. */
function PhotoStack({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`${styles.stack} ${className ?? ""}`}>
      <img src={src} alt="" aria-hidden="true" className={styles.stackBack2} />
      <img src={src} alt="" aria-hidden="true" className={styles.stackBack1} />
      <img src={src} alt={alt} className={styles.stackFront} />
    </div>
  );
}

export default function BecomeMentorPage({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useSiteLang(initialLang);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [modal, setModal] = useState<"profile" | "download" | null>(null);

  const c = becomeCopy[lang]({
    min: formatPrice(minPrice, lang),
    max: formatPrice(maxPrice, lang),
    tracks: translations[lang].catalog.items.map((i) => i.title).join(", "),
  });

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  const ctaButton = (light?: boolean) => (
    <button type="button" className={light ? styles.ctaLight : styles.cta} onClick={() => setModal("profile")}>
      {c.cta}
      <ZArrow className={styles.arrow} />
    </button>
  );

  return (
    <div className={styles.page}>
      <SiteNav lang={lang} onLangChange={setLang} active="become" onDownload={() => setModal("download")} />

      <main>
        {/* ─── HERO ─── */}
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1 className={styles.h1}>{c.title}</h1>
            <p className={styles.lead}>{c.subtitle}</p>
            <ol className={styles.steps}>
              {c.steps.map((s, i) => (
                <li key={s.title} className={styles.step}>
                  <span className={`${styles.stepNum} ${i === 0 ? styles.stepNumActive : ""}`}>{i + 1}</span>
                  <strong>{s.title}</strong>
                  <span>{s.desc}</span>
                </li>
              ))}
            </ol>
            <div className={styles.ctaRow}>
              {ctaButton()}
              <Link href="/coach-dashboard" className={styles.textLink}>
                {c.already}
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <PhotoStack src={heroCoach.photo.replace("w=600&h=600", "w=900&h=1000")} alt={heroCoach.name} />
            <div className={styles.heroBadge}>
              <img src={heroCoach.photo} alt="" />
              <span>
                <strong>
                  {heroCoach.name}
                  <svg className={styles.verified} viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"
                    />
                  </svg>
                </strong>
                {heroCoach.title} · {heroCoach.experiences[0].company}
              </span>
            </div>
            <div className={styles.heroPrice}>
              <span>{c.rate}</span>
              <strong>{formatPrice(heroCoach.price, lang)}</strong>
              <span>{c.perHour}</span>
            </div>
          </div>
        </section>

        {/* ─── BENEFITS ─── */}
        <section className={styles.benefits}>
          {c.benefits.map((b) => (
            <div key={b.title}>
              <h2 className={styles.h3}>{b.title}</h2>
              <p>{b.desc}</p>
            </div>
          ))}
        </section>

        {/* ─── TOOLS ─── */}
        <section className={styles.toolsWrap}>
          <div className={styles.tools}>
            <div className={styles.toolsCopy}>
              <h2 className={styles.h2}>{c.toolsTitle}</h2>
              <p className={styles.lead}>{c.toolsSub}</p>
              <ul className={styles.checklist}>
                {c.tools.map((t) => (
                  <li key={t}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
              {ctaButton()}
            </div>
            <div className={styles.phones}>
              <div className={styles.phone}>
                <img src="/screens/mentor-dashboard.webp" alt={c.screensAlt[0]} width={828} height={1792} loading="lazy" />
              </div>
              <div className={`${styles.phone} ${styles.phoneOffset}`}>
                <img src="/screens/mentor-candidats.webp" alt={c.screensAlt[1]} width={828} height={1792} loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── QUOTE (from the mentor's own profile) ─── */}
        <section className={styles.quote}>
          <PhotoStack src={quoteCoach.photo.replace("w=600&h=600", "w=900&h=1000")} alt={quoteCoach.name} className={styles.quoteStack} />
          <figure>
            <blockquote>{c.quote(quoteCoach.bio)}</blockquote>
            <figcaption>
              <strong>{quoteCoach.name}</strong> · {quoteCoach.title} · {quoteCoach.experiences[0].company}
            </figcaption>
            {ctaButton()}
          </figure>
        </section>

        {/* ─── FAQ ─── */}
        <section className={styles.faq}>
          <h2 className={styles.h2}>{c.faqTitle}</h2>
          <div className={styles.faqList}>
            {c.faq.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className={styles.faqItem}>
                  <h3>
                    <button type="button" aria-expanded={open} aria-controls={`faq-${i}`} onClick={() => setOpenFaq(open ? null : i)}>
                      {item.q}
                      <span className={`${styles.faqIcon} ${open ? styles.faqIconOpen : ""}`} aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`faq-${i}`} className={`${styles.faqA} ${open ? styles.faqAOpen : ""}`}>
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── BANNER ─── */}
        <section className={styles.bannerWrap}>
          <div className={styles.banner}>
            <div>
              <h2 className={styles.bannerTitle}>{c.bannerTitle}</h2>
              <p>{c.bannerSub}</p>
            </div>
            {ctaButton(true)}
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />

      {modal && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="mentor-modal-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.modalClose} onClick={() => setModal(null)} aria-label={c.close} autoFocus>
              ✕
            </button>
            <h2 className={styles.modalTitle} id="mentor-modal-title">
              {modal === "profile" ? c.modalTitle : c.downloadTitle}
            </h2>
            <p className={styles.modalSub}>{c.modalSub}</p>
            <div className={styles.qrGrid}>
              {[
                { badge: "/app-store-badge.svg", alt: "App Store", url: "https://apps.apple.com" },
                { badge: "/google-play-badge.svg", alt: "Google Play", url: "https://play.google.com" },
              ].map((s) => (
                <div key={s.alt} className={styles.qrItem}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(s.url)}&color=160f0f&bgcolor=ffffff&qzone=1`}
                    alt={`QR code ${s.alt}`}
                    width={150}
                    height={150}
                  />
                  <img src={s.badge} alt={s.alt} className={styles.qrBadge} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
