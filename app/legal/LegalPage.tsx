"use client";

import { Fragment } from "react";
import styles from "./legal.module.css";
import SiteShell from "../../components/site/SiteShell";
import { useSiteLang } from "../useSiteLang";
import { translations } from "../translations";
import { pagesCopy } from "../locales";
import { localeOf, type Lang } from "../i18n";
import type { LegalBlock, LegalDoc } from "./documents";

/* Highlights the [placeholders] still to fill in. */
function Text({ value }: { value: string }) {
  const parts = value.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") ? (
          <mark key={i} className={styles.todo}>
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p>
        <Text value={block} />
      </p>
    );
  }
  return (
    <ul>
      {block.list.map((item) => (
        <li key={item}>
          <Text value={item} />
        </li>
      ))}
    </ul>
  );
}

export default function LegalPage({ doc, kind, initialLang }: { doc: LegalDoc; kind: "privacy" | "terms" | "mentions"; initialLang: Lang }) {
  const [lang, setLang] = useSiteLang(initialLang);
  const title = translations[lang].footer[kind];
  const c = pagesCopy[lang].legal;
  const hasTodo = JSON.stringify(doc).includes("[");

  return (
    <SiteShell lang={lang} onLangChange={setLang}>
      <header className={styles.hero}>
        <h1 className={styles.h1}>{title}</h1>
        <p className={styles.updated}>
          {c.updated} {new Date(`${doc.updated}T12:00:00`).toLocaleDateString(localeOf(lang), { day: "numeric", month: "long", year: "numeric" })}
        </p>
        {c.frenchOnly && <p className={styles.notice}>{c.frenchOnly}</p>}
        {hasTodo && <p className={styles.draft}>{c.draftNote}</p>}
      </header>

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label={c.toc}>
          <p>{c.toc}</p>
          <ol>
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} lang="fr">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* The legal text itself is in French, left to right, whatever the interface language. */}
        <article className={styles.doc} lang="fr" dir="ltr">
          <p className={styles.intro}>
            <Text value={doc.intro} />
          </p>
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className={styles.section}>
              <h2>{s.title}</h2>
              {s.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </section>
          ))}
        </article>
      </div>
    </SiteShell>
  );
}
