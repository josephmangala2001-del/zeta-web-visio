"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { translations, type TrackId } from "./translations";
import type { FiliereId } from "./mentors/coaches";
import { langQuery } from "./i18n";
import { useSiteLang } from "./useSiteLang";
import LangSelect from "../components/site/LangSelect";
import SiteFooter from "../components/site/SiteFooter";


const trackOrder: TrackId[] = ["ma", "trading", "consulting", "tech"];

/* Firms our mentors come from, in their own colours (scrolling band under the hero). */
const partners = [
  { src: "/logos/goldman.svg", alt: "Goldman Sachs", h: 44 },
  { src: "/jpmorgan.png", alt: "J.P. Morgan", h: 28 },
  { src: "/logos/rothschild.svg", alt: "Rothschild & Co", h: 24 },
  { src: "/logos/bnp-color.svg", alt: "BNP Paribas", h: 36 },
  { src: "/logos/mckinsey.svg", alt: "McKinsey & Company", h: 26 },
  { src: "/logos/google.svg", alt: "Google", h: 32 },
  { src: "/logos/lazard.svg", alt: "Lazard", h: 30 },
  { src: "/logos/citadel.svg", alt: "Citadel", h: 22 },
  { src: "/logos/bain.svg", alt: "Bain & Company", h: 20 },
  { src: "/logos/microsoft.svg", alt: "Microsoft", h: 30 },
  { src: "/logos/kkr.svg", alt: "KKR", h: 30 },
  { src: "/logos/ardian.svg", alt: "Ardian", h: 20 },
  { src: "/logos/deloitte.svg", alt: "Deloitte", h: 28 },
  { src: "/logos/ey.svg", alt: "EY", h: 42 },
];

/* Catalog visuals: Unsplash photo + the firms candidates aim for in each track.
   `white` logos are single-colour marks recoloured for the dark cards. */
const catalogVisuals: Record<FiliereId, { image: string; dark?: boolean; logos: { src: string; alt: string; h: number; white?: boolean }[] }> = {
  ma: {
    image: "/catalog/ma.jpg",
    logos: [
      { src: "/logos/rothschild.svg", alt: "Rothschild & Co", h: 28 },
      { src: "/logos/lazard.svg", alt: "Lazard", h: 34 },
    ],
  },
  trading: {
    image: "/catalog/trading.jpg",
    dark: true,
    logos: [
      { src: "/logos/citadel.svg", alt: "Citadel", h: 28, white: true },
      { src: "/logos/bnp-white.svg", alt: "BNP Paribas", h: 42 },
    ],
  },
  consulting: {
    image: "/catalog/consulting.jpg",
    logos: [
      { src: "/logos/mckinsey.svg", alt: "McKinsey & Company", h: 30 },
      { src: "/logos/bain.svg", alt: "Bain & Company", h: 24 },
    ],
  },
  tech: {
    image: "/catalog/tech.jpg",
    logos: [
      { src: "/logos/google.svg", alt: "Google", h: 52 },
      { src: "/logos/microsoft.svg", alt: "Microsoft", h: 40 },
    ],
  },
  pe: {
    image: "/catalog/pe.jpg",
    dark: true,
    logos: [
      { src: "/logos/kkr.svg", alt: "KKR", h: 42, white: true },
      { src: "/logos/ardian.svg", alt: "Ardian", h: 26, white: true },
    ],
  },
  audit: {
    image: "/catalog/audit.jpg",
    dark: true,
    logos: [
      { src: "/logos/deloitte-white.svg", alt: "Deloitte", h: 40 },
      { src: "/logos/ey-white.svg", alt: "EY", h: 62 },
    ],
  },
};

const testimonialAuthors = [
  { name: "Joshua Abraham", company: "Goldman Sachs", avatar: "/avatars/joshua-abraham.png" },
  { name: "Kathryn Murphy", company: "J.P. Morgan", avatar: "/avatars/kathryn-murphy.png" },
];

/* Real screenshots from the Zeeta mobile app (iPhone, 828×1792). */
const candidateScreens = ["connexion", "recherche-mentors", "profil-mentor", "gerer-seance"];
const mentorScreens = ["mentor-agenda", "mentor-dashboard", "mentor-candidats"];


/* The arrow from the "a" of the Zeeta wordmark: a stem ending in a solid head. */
function ZArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12.5h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12.5 5.5 22 12.5l-9.5 7z" fill="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useSiteLang();
  const [track, setTrack] = useState<TrackId>("ma");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const t = translations[lang];

  useEffect(() => {
    if (!downloadOpen && !authOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDownloadOpen(false);
        setAuthOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [downloadOpen, authOpen]);

  // Once the gradient hero is out of view, the transparent bar gets a dark glass so the white logo stays readable.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    const frame = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const openAuth = () => {
    setMenuOpen(false);
    setAuthOpen(true);
  };

  return (
    <div className={styles.page}>
      {/* ─── NAVBAR ─── */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <nav className={styles.nav} aria-label={t.nav.menu}>
          <a href="#top" className={styles.navBrand} aria-label="Zeeta">
            <img src="/zeeta-wordmark-white.png" alt="Zeeta" className={styles.navLogo} />
          </a>

          <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}>
            <a href="#filieres" onClick={() => setMenuOpen(false)}>{t.nav.findMentor}</a>
            <a href="#comment" onClick={() => setMenuOpen(false)}>{t.nav.howItWorks}</a>
            <Link href={`/devenir-mentor${langQuery(lang)}`} onClick={() => setMenuOpen(false)}>{t.nav.becomeMentor}</Link>
            <a href="#faq" onClick={() => setMenuOpen(false)}>{t.nav.faq}</a>
          </div>

          <div className={styles.navActions}>
            <LangSelect lang={lang} onChange={setLang} label={t.nav.language} />
            <button type="button" className={styles.navCta} onClick={() => setDownloadOpen(true)}>
              {t.nav.download}
            </button>
            <button
              type="button"
              className={styles.menuToggle}
              aria-expanded={menuOpen}
              aria-label={t.nav.menu}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ─── HERO ─── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <h1 className={styles.heroTitle}>
                {t.hero.title.map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </h1>
              <p className={styles.heroSub}>{t.hero.subtitle}</p>

              <div className={styles.finder}>
                <p className={styles.finderLabel} id="track-label">{t.hero.trackPrompt}</p>
                <div className={styles.trackPills} role="radiogroup" aria-labelledby="track-label">
                  {trackOrder.map((id) => (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={track === id}
                      className={`${styles.trackPill} ${track === id ? styles.trackPillActive : ""}`}
                      onClick={() => setTrack(id)}
                    >
                      {t.hero.tracks[id].label}
                    </button>
                  ))}
                </div>
                <button type="button" className={styles.finderCta} onClick={openAuth}>
                  {t.hero.cta}
                  <ZArrow className={styles.arrow} />
                </button>
              </div>
            </div>

            {/* Signature: the real app, shown in two iPhones */}
            <div className={styles.heroPhones}>
              <div className={`${styles.iphone} ${styles.iphoneBack}`}>
                <img src="/screens/connexion.webp" alt={t.hero.phoneAlts[0]} width={828} height={1792} />
              </div>
              <div className={`${styles.iphone} ${styles.iphoneFront}`}>
                <img src="/screens/recherche-mentors.webp" alt={t.hero.phoneAlts[1]} width={828} height={1792} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── PARTNERS ─── */}
        <section className={styles.logos} aria-label={t.logos.label}>
          <p className={styles.logosLabel}>{t.logos.label}</p>
          <div className={styles.marquee}>
            {/* Two copies of the list: the track slides by one copy's width, then loops seamlessly. */}
            <ul className={styles.logosRow}>
              {[...partners, ...partners].map((p, i) => (
                <li key={i} aria-hidden={i >= partners.length || undefined}>
                  <img src={p.src} alt={i < partners.length ? p.alt : ""} style={{ height: p.h }} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── CATALOG ─── */}
        <section className={styles.section} id="filieres">
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>{t.catalog.title}</h2>
            <p className={styles.lead}>{t.catalog.subtitle}</p>
          </div>
          <ul className={styles.catalog}>
            {t.catalog.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/mentors/${item.id}${langQuery(lang)}`}
                  className={`${styles.catalogCard} ${catalogVisuals[item.id].dark ? styles.catalogDark : ""}`}
                >
                  <span className={styles.catalogMedia} aria-hidden="true">
                    <img src={catalogVisuals[item.id].image} alt="" loading="lazy" />
                  </span>
                  <span className={styles.catalogLogos}>
                    {catalogVisuals[item.id].logos.map((l) => (
                      <img key={l.alt} src={l.src} alt={l.alt} style={{ "--h": l.h } as React.CSSProperties} className={l.white ? styles.logoWhite : undefined} />
                    ))}
                  </span>
                  <span className={styles.catalogTitle}>{item.title}</span>
                  <span className={styles.catalogDesc}>{item.desc}</span>
                  <span className={styles.catalogCta}>
                    {t.catalog.cta}
                    <ZArrow className={styles.arrow} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── APP PRESENTATION VIDEO ─── */}
        <section className={`${styles.section} ${styles.videoSection}`} aria-labelledby="video-title">
          <div className={styles.sectionHead}>
            <h2 className={styles.h2} id="video-title">{t.video.title}</h2>
            <p className={styles.lead}>{t.video.subtitle}</p>
          </div>
          <div className={styles.videoFrame}>
            {/* "#t=0.1" makes browsers paint the first frame as the poster once metadata is loaded. */}
            <video
              className={styles.video}
              src="/video/presentation-zeeta.mp4"
              poster="/video/presentation-zeeta-poster.jpg"
              width={1920}
              height={1080}
              controls
              playsInline
              preload="metadata"
              aria-label={t.video.label}
            />
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className={styles.stepsSection} id="comment">
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.h2}>{t.steps.title}</h2>
            </div>
            <ol className={styles.steps}>
              {t.steps.items.map((step, i) => (
                <li key={step.title} className={styles.step}>
                  <div className={styles.stepVisual} aria-hidden="true">
                    {i === 0 && (
                      <img src="/screens/carte-mentor.webp" alt="" className={styles.vCard} width={760} height={678} loading="lazy" />
                    )}
                    {i === 1 && (
                      <img src="/screens/agenda-creneau.webp" alt="" className={styles.vCard} width={828} height={661} loading="lazy" />
                    )}
                    {i === 2 && (
                      <div className={styles.vReport}>
                        <span className={styles.vReportTitle}>{t.steps.reportTitle}</span>
                        {t.steps.report.map((r) => (
                          <div key={r.label} className={styles.vReportRow}>
                            <span>{r.label}</span>
                            <em className={r.good ? styles.vGood : styles.vWork}>{r.verdict}</em>
                          </div>
                        ))}
                        <p>{t.steps.reportAction}</p>
                      </div>
                    )}
                  </div>
                  <span className={styles.stepIndex}>{i + 1}</span>
                  <h3 className={styles.h3}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className={styles.section} aria-labelledby="testimonials-title">
          <div className={styles.sectionHead}>
            <h2 className={styles.h2} id="testimonials-title">{t.testimonials.title}</h2>
          </div>
          <div className={styles.quotes}>
            {testimonialAuthors.map((a, i) => (
              <figure key={a.name} className={styles.quote}>
                <blockquote>{t.testimonials.items[i].text}</blockquote>
                <figcaption>
                  <img src={a.avatar} alt="" />
                  <span>
                    <strong>{a.name}</strong>
                    {t.testimonials.items[i].role} · {a.company}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ─── BECOME A MENTOR ─── */}
        <section className={styles.mentorWrap} id="mentor">
          <div className={styles.mentorBlock}>
            <div className={styles.mentorCopy}>
              <h2 className={styles.mentorTitle}>{t.mentor.title}</h2>
              <p className={styles.mentorSub}>{t.mentor.subtitle}</p>
              <ul className={styles.mentorPoints}>
                {t.mentor.points.map((p) => (
                  <li key={p}>
                    <ZArrow className={styles.arrow} />
                    {p}
                  </li>
                ))}
              </ul>
              <Link href={`/devenir-mentor${langQuery(lang)}`} className={styles.btnInkLarge}>
                {t.mentor.cta}
                <ZArrow className={styles.arrow} />
              </Link>
            </div>
            <ul className={styles.mentorPhones} aria-label={t.mentor.screensLabel}>
              {mentorScreens.map((name, i) => (
                <li key={name} className={styles.phone}>
                  <img src={`/screens/${name}.webp`} alt={t.mentor.screens[i]} width={828} height={1792} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── APP ─── */}
        <section className={styles.appSection} aria-labelledby="app-title">
          <div className={styles.appHead}>
            <div>
              <h2 className={styles.h2} id="app-title">{t.app.title}</h2>
              <p className={styles.lead}>{t.app.subtitle}</p>
            </div>
            <div className={styles.appActions}>
              <img src="/app-store-badge.svg" alt="App Store" className={styles.storeBadge} />
              <img src="/google-play-badge.svg" alt="Google Play" className={styles.storeBadge} />
              <button type="button" className={styles.btnGhost} onClick={() => setDownloadOpen(true)}>
                {t.app.qr}
              </button>
            </div>
          </div>
          <ol className={styles.screens}>
            {candidateScreens.map((name, i) => (
              <li key={name} className={styles.screen}>
                <div className={styles.phone}>
                  <img src={`/screens/${name}.webp`} alt="" width={828} height={1792} loading="lazy" />
                </div>
                <h3 className={styles.screenTitle}>{t.app.screens[i].title}</h3>
                <p className={styles.screenDesc}>{t.app.screens[i].desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ─── FAQ ─── */}
        <section className={`${styles.section} ${styles.faqSection}`} id="faq">
          <h2 className={styles.h2}>{t.faq.title}</h2>
          <div className={styles.faqList}>
            {t.faq.items.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className={styles.faqItem}>
                  <h3>
                    <button
                      type="button"
                      className={styles.faqQ}
                      aria-expanded={open}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
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
      </main>

      <SiteFooter lang={lang} />

      {/* ─── DOWNLOAD MODAL ─── */}
      {downloadOpen && (
        <div className={styles.overlay} onClick={() => setDownloadOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.modalClose} onClick={() => setDownloadOpen(false)} aria-label={t.modal.close} autoFocus>
              ✕
            </button>
            <h2 className={styles.modalTitle} id="download-title">{t.modal.title}</h2>
            <p className={styles.modalSub}>{t.modal.subtitle}</p>
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

      {/* ─── AUTH MODAL ─── */}
      {authOpen && (
        <div className={styles.overlay} onClick={() => setAuthOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.modalClose} onClick={() => setAuthOpen(false)} aria-label={t.modal.close}>
              ✕
            </button>
            <img src="/zeeta-wordmark-dark.png" alt="Zeeta" className={styles.authLogo} />
            <h2 className={styles.modalTitle} id="auth-title">{t.auth.title}</h2>
            <p className={styles.modalSub}>{t.auth.subtitle}</p>

            <div className={styles.socialBtns}>
              <button type="button" className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.54c2.08-1.91 3.25-4.73 3.25-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.75c-.98.66-2.24 1.06-3.74 1.06-2.87 0-5.3-1.94-6.17-4.55H2.18v2.84A11 11 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M5.83 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.65-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.65 2.84C6.7 7.32 9.13 5.38 12 5.38z" />
                </svg>
                {t.auth.googleBtn}
              </button>
              <button type="button" className={`${styles.socialBtn} ${styles.socialApple}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.56-1.33 3.1-2.53 4zm-3.35-17.25c.13 1.95-1.52 3.58-3.37 3.42-.23-1.84 1.55-3.57 3.37-3.42z" />
                </svg>
                {t.auth.appleBtn}
              </button>
            </div>

            <div className={styles.divider} aria-hidden="true">
              <span>{t.auth.orDivider}</span>
            </div>

            <form
              className={styles.authForm}
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/dashboard");
              }}
            >
              <label className={styles.field}>
                <span className={styles.srOnly}>{t.auth.emailPlaceholder}</span>
                <input
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </label>
              <label className={styles.field}>
                <span className={styles.srOnly}>{t.auth.passwordPlaceholder}</span>
                <input
                  type="password"
                  placeholder={t.auth.passwordPlaceholder}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </label>
              <a href="#" className={styles.forgot}>{t.auth.forgotPassword}</a>
              <button type="submit" className={styles.submit}>
                {t.auth.submitBtn}
              </button>
            </form>

            <p className={styles.signup}>
              {t.auth.noAccount} <a href="#">{t.auth.signUpLink}</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
