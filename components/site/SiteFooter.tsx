import Link from "next/link";
import styles from "./siteFooter.module.css";
import { langQuery, type Lang } from "../../app/i18n";
import { translations } from "../../app/translations";

/* Footer shared by every page of the site. */
export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const q = langQuery(lang);
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/zeeta-wordmark-white.png" alt="Zeeta" />
          <p>{t.footer.tagline}</p>
        </div>
        <nav className={styles.cols} aria-label="Footer">
          <div>
            <p>{t.footer.tracks}</p>
            {t.catalog.items.map((item) => (
              <Link key={item.id} href={`/mentors/${item.id}${q}`}>
                {item.title}
              </Link>
            ))}
          </div>
          <div>
            <p>{t.footer.product}</p>
            <Link href={`/${q}#comment`}>{t.nav.howItWorks}</Link>
            <Link href={`/devenir-mentor${q}`}>{t.nav.becomeMentor}</Link>
            <Link href={`/${q}#faq`}>{t.nav.faq}</Link>
          </div>
          <div>
            <p>{t.footer.company}</p>
            <Link href={`/a-propos${q}`}>{t.footer.about}</Link>
            <Link href={`/contact${q}`}>{t.footer.contact}</Link>
          </div>
          <div>
            <p>{t.footer.legal}</p>
            <Link href={`/confidentialite${q}`}>{t.footer.privacy}</Link>
            <Link href={`/cgu${q}`}>{t.footer.terms}</Link>
            <Link href={`/mentions-legales${q}`}>{t.footer.mentions}</Link>
          </div>
        </nav>
      </div>
      <p className={styles.copy}>{t.footer.copyright}</p>
    </footer>
  );
}
