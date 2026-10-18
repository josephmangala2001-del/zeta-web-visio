"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./mentors.module.css";
import SiteNav from "../../components/site/SiteNav";
import SiteFooter from "../../components/site/SiteFooter";
import { translations } from "../translations";
import { formatPrice, langQuery as toLangQuery, localeOf, type Lang } from "../i18n";
import { mentorsCopy } from "../locales";
import { useSiteLang } from "../useSiteLang";
import { coaches, coachSlots, filiereOrder, type Coach, type Experience, type FiliereId } from "./coaches";

type Sort = "relevance" | "priceAsc" | "priceDesc" | "rating";
type PriceRange = "all" | "low" | "mid" | "high";

/* The arrow from the "a" of the Zeeta wordmark, same as the landing page. */
function ZArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12.5h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12.5 5.5 22 12.5l-9.5 7z" fill="currentColor" />
    </svg>
  );
}

function VerifiedBadge({ label }: { label: string }) {
  return (
    <svg className={styles.verified} viewBox="0 0 24 24" role="img" aria-label={label}>
      <path
        fill="currentColor"
        d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"
      />
    </svg>
  );
}

/* Same muted palette and monogram rule as the app's CompanyLogo. */
const MONOGRAM_COLORS = ["#B45309", "#B91C1C", "#7C3AED", "#1D4ED8", "#0F766E", "#4D7C0F", "#A21CAF", "#0E7490"];

function CompanyLogo({ xp }: { xp: Experience }) {
  if (xp.domain) {
    return (
      <span className={styles.logo}>
        <img src={`https://www.google.com/s2/favicons?domain=${xp.domain}&sz=128`} alt="" loading="lazy" />
      </span>
    );
  }
  let hash = 0;
  for (let i = 0; i < xp.company.length; i++) hash = (hash * 31 + xp.company.charCodeAt(i)) | 0;
  const words = xp.company.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  const initials = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "?").slice(0, 2);
  return (
    <span className={styles.logo} style={{ background: MONOGRAM_COLORS[Math.abs(hash) % MONOGRAM_COLORS.length] }}>
      <span className={styles.monogram}>{initials.toUpperCase()}</span>
    </span>
  );
}

type Pending = { coach: Coach; kind: "book" | "message"; slot?: string } | { coach?: undefined; kind: "download"; slot?: undefined } | null;

function CoachCard({
  coach,
  lang,
  now,
  favorite,
  onFavorite,
  onAction,
}: {
  coach: Coach;
  lang: Lang;
  now: Date | null;
  favorite: boolean;
  onFavorite: () => void;
  onAction: (kind: "book" | "message", slot?: string) => void;
}) {
  const u = mentorsCopy[lang];
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(0);
  const slots = useMemo(() => (now ? coachSlots(coach.n, now) : []), [coach.n, now]);
  const locale = localeOf(lang);
  const dayLabel = (d: Date) => d.toLocaleDateString(locale, { weekday: "short" }).replace(".", "");
  const longDay = (d: Date) => d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" });
  const nextSlot = slots[0] ? `${longDay(slots[0].date)} · ${slots[0].times[0]}` : null;

  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        <img src={coach.photo} alt={coach.name} loading="lazy" />
      </div>

      <div className={styles.main}>
        <h2 className={styles.name}>
          {coach.name}
          <VerifiedBadge label={u.verified} />
        </h2>
        <p className={styles.role}>{coach.title}</p>
        <ul className={styles.tags}>
          {coach.specialties.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className={styles.bio}>{coach.bio}</p>
        <ul className={styles.xp}>
          {coach.experiences.map((x) => (
            <li key={x.company}>
              <CompanyLogo xp={x} />
              <span className={styles.xpCompany}>{x.company}</span>
              <span className={styles.xpDate}>
                {x.start} – {x.end}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <aside className={styles.side}>
        <button
          type="button"
          className={`${styles.heart} ${favorite ? styles.heartOn : ""}`}
          aria-pressed={favorite}
          aria-label={u.favorite}
          onClick={onFavorite}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
          </svg>
        </button>
        <p className={styles.price}>
          {formatPrice(coach.price, lang)}
          <span>{u.perHour}</span>
        </p>
        <p className={styles.session}>{u.session}</p>
        <dl className={styles.stats}>
          <div>
            <dt>
              {coach.rating.toFixed(1)}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
              </svg>
            </dt>
            <dd>{u.reviews(coach.reviews)}</dd>
          </div>
          <div>
            <dt>
              <svg className={styles.pin} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              {coach.city}
            </dt>
            <dd>{coach.country}</dd>
          </div>
        </dl>
        <button type="button" className={styles.btnPrimary} onClick={() => onAction("book")}>
          {u.book}
        </button>
        <button type="button" className={styles.btnGhost} onClick={() => onAction("message")}>
          {u.message}
        </button>
      </aside>

      <div className={styles.dispo}>
        <button
          type="button"
          className={styles.dispoToggle}
          aria-expanded={open}
          aria-controls={`dispo-${coach.n}`}
          onClick={() => setOpen((o) => !o)}
        >
          <svg className={styles.calendar} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
          </svg>
          <span className={styles.dispoLabel}>{u.availability}</span>
          {nextSlot && (
            <span className={styles.dispoNext}>
              {u.next} : {nextSlot}
            </span>
          )}
          <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && slots.length > 0 && (
          <div id={`dispo-${coach.n}`} className={styles.dispoBody}>
            <ul className={styles.days}>
              {slots.slice(0, 7).map((s, i) => (
                <li key={s.date.toISOString()}>
                  <button
                    type="button"
                    className={`${styles.day} ${day === i ? styles.dayActive : ""}`}
                    aria-pressed={day === i}
                    onClick={() => setDay(i)}
                  >
                    <span>{dayLabel(s.date)}</span>
                    <strong>{s.date.getDate()}</strong>
                  </button>
                </li>
              ))}
            </ul>
            <p className={styles.pickTime}>{u.pickTime}</p>
            <ul className={styles.times}>
              {slots[day]?.times.map((time) => (
                <li key={time}>
                  <button
                    type="button"
                    className={styles.time}
                    onClick={() => onAction("book", `${longDay(slots[day].date)} · ${time}`)}
                  >
                    {time}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

export default function MentorsPage({ filiere, initialLang }: { filiere: FiliereId; initialLang: Lang }) {
  const [lang, setLang] = useSiteLang(initialLang);
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState<PriceRange>("all");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<Sort>("relevance");
  const [tomorrowOnly, setTomorrowOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [pending, setPending] = useState<Pending>(null);
  // Slots depend on today's date: computed on the client only, so server and client markup match.
  const [now, setNow] = useState<Date | null>(null);

  const u = mentorsCopy[lang];
  const t = translations[lang];
  const item = t.catalog.items.find((i) => i.id === filiere)!;
  const langQuery = toLangQuery(lang);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setNow(new Date()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPending(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pending]);

  const inFiliere = useMemo(() => coaches.filter((c) => c.filieres.includes(filiere)), [filiere]);
  const countries = useMemo(() => [...new Set(inFiliere.map((c) => c.country))].sort(), [inFiliere]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tomorrow = now ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getDate() : null;
    const filtered = inFiliere.filter((c) => {
      if (q) {
        const haystack = [c.name, c.title, c.city, ...c.specialties, ...c.experiences.map((x) => x.company)].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (price === "low" && c.price >= 60) return false;
      if (price === "mid" && (c.price < 60 || c.price > 80)) return false;
      if (price === "high" && c.price <= 80) return false;
      if (country !== "all" && c.country !== country) return false;
      if (tomorrowOnly && tomorrow !== null && (c.n + tomorrow) % 4 === 0) return false;
      return true;
    });
    const sorters: Record<Sort, (a: Coach, b: Coach) => number> = {
      relevance: (a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1),
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    };
    return [...filtered].sort(sorters[sort]);
  }, [inFiliere, query, price, country, tomorrowOnly, sort, now]);

  const resetFilters = () => {
    setQuery("");
    setPrice("all");
    setCountry("all");
    setTomorrowOnly(false);
  };

  const toggleFavorite = (n: number) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const firstName = pending?.coach?.name.split(" ")[0] ?? "";

  return (
    <div className={styles.page}>
      {/* ─── NAVBAR ─── */}
      <SiteNav lang={lang} onLangChange={setLang} active="find" onDownload={() => setPending({ kind: "download" })} />

      <main className={styles.content}>
        {/* ─── TITLE ─── */}
        <section className={styles.hero}>
          <Link href={`/${langQuery}#filieres`} className={styles.back}>
            <ZArrow className={styles.backArrow} />
            {u.back}
          </Link>
          <h1 className={styles.h1}>
            {u.titlePrefix} <span>{item.title}</span>
          </h1>
          <p className={styles.lead}>{item.desc}</p>
          <ul className={styles.filieres} aria-label={t.footer.tracks}>
            {filiereOrder.map((id) => {
              const f = t.catalog.items.find((i) => i.id === id)!;
              return (
                <li key={id}>
                  <Link
                    href={`/mentors/${id}${langQuery}`}
                    className={`${styles.filierePill} ${id === filiere ? styles.filierePillActive : ""}`}
                    aria-current={id === filiere ? "page" : undefined}
                  >
                    {f.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ─── FILTERS ─── */}
        <div className={styles.filters}>
          <label className={styles.searchField}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
            <span className={styles.srOnly}>{u.search}</span>
            <input type="search" placeholder={u.search} value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <select className={styles.select} value={price} onChange={(e) => setPrice(e.target.value as PriceRange)} aria-label={u.price.all}>
            {(Object.keys(u.price) as PriceRange[]).map((k) => (
              <option key={k} value={k}>{u.price[k]}</option>
            ))}
          </select>
          <select className={styles.select} value={country} onChange={(e) => setCountry(e.target.value)} aria-label={u.allCountries}>
            <option value="all">{u.allCountries}</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            className={`${styles.chip} ${tomorrowOnly ? styles.chipActive : ""}`}
            aria-pressed={tomorrowOnly}
            onClick={() => setTomorrowOnly((v) => !v)}
          >
            {u.tomorrow}
          </button>
        </div>

        <div className={styles.listHead}>
          <p className={styles.count}>{u.count(list.length)}</p>
          <select className={styles.sort} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={u.sortLabel}>
            {(Object.keys(u.sort) as Sort[]).map((k) => (
              <option key={k} value={k}>{u.sort[k]}</option>
            ))}
          </select>
        </div>

        {/* ─── LIST ─── */}
        {list.length > 0 ? (
          <ul className={styles.list}>
            {list.map((c) => (
              <li key={c.n}>
                <CoachCard
                  coach={c}
                  lang={lang}
                  now={now}
                  favorite={favorites.has(c.n)}
                  onFavorite={() => toggleFavorite(c.n)}
                  onAction={(kind, slot) => setPending({ coach: c, kind, slot })}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p>{u.empty}</p>
            <button type="button" className={styles.btnGhost} onClick={resetFilters}>
              {u.reset}
            </button>
          </div>
        )}
      </main>

      <SiteFooter lang={lang} />

      {/* ─── CONTINUE IN THE APP ─── */}
      {pending && (
        <div className={styles.overlay} onClick={() => setPending(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="continue-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.modalClose} onClick={() => setPending(null)} aria-label={u.close} autoFocus>
              ✕
            </button>
            {pending.coach && <img src={pending.coach.photo} alt="" className={styles.modalAvatar} />}
            <h2 className={styles.modalTitle} id="continue-title">
              {pending.kind === "download" ? u.download : pending.kind === "book" ? u.modalBook(firstName) : u.modalMessage(firstName)}
            </h2>
            {pending.slot && <p className={styles.modalSlot}>{pending.slot}</p>}
            <p className={styles.modalSub}>{pending.kind === "download" ? u.downloadSub : u.modalSub}</p>
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
