"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./contact.module.css";
import SiteShell from "../../components/site/SiteShell";
import { useSiteLang } from "../useSiteLang";
import { pagesCopy } from "../locales";
import { langQuery, type Lang } from "../i18n";

const EMAIL = "contact@zeeta.app";

const topicIcons = [
  // candidate: graduation cap
  "M3 9l9-4.5L21 9l-9 4.5L3 9zm4 2.2V15c0 1.4 2.2 3 5 3s5-1.6 5-3v-3.8M21 9v5",
  // mentor: briefcase
  "M4 8h16v11H4zM9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 13h16",
  // press: megaphone
  "M4 10v4h3l6 4V6L7 10H4zm13-1a4 4 0 0 1 0 6",
];

export default function ContactPage({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useSiteLang(initialLang);
  const [topic, setTopic] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const c = pagesCopy[lang].contact;

  // No server behind the form: it writes the email in the visitor's own mail app.
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[Zeeta] ${c.topics[topic].title} — ${name}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <SiteShell lang={lang} onLangChange={setLang}>
      <section className={styles.hero}>
        <h1 className={styles.h1}>{c.title}</h1>
        <p className={styles.lead}>{c.lead}</p>
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          <span>{c.emailLabel}</span>
          <strong>{EMAIL}</strong>
        </a>
      </section>

      <section className={styles.body}>
        <div className={styles.topics} role="radiogroup" aria-label={c.topic}>
          {c.topics.map((t, i) => (
            <button
              key={t.title}
              type="button"
              role="radio"
              aria-checked={topic === i}
              className={`${styles.topic} ${topic === i ? styles.topicActive : ""}`}
              onClick={() => setTopic(i)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={topicIcons[i]} />
              </svg>
              <strong>{t.title}</strong>
              <span>{t.desc}</span>
            </button>
          ))}
          <p className={styles.faq}>
            {c.faqPrompt} <Link href={`/${langQuery(lang)}#faq`}>{c.faqLink}</Link>.
          </p>
        </div>

        <form className={styles.form} onSubmit={send}>
          <h2>{c.formTitle}</h2>
          <div className={styles.row}>
            <label>
              <span>{c.name}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>
            <label>
              <span>{c.email}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </label>
          </div>
          <label>
            <span>{c.topic}</span>
            <select value={topic} onChange={(e) => setTopic(Number(e.target.value))}>
              {c.topics.map((t, i) => (
                <option key={t.title} value={i}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{c.message}</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} />
          </label>
          <button type="submit" className={styles.submit}>
            {c.send}
          </button>
          <p className={styles.note}>{c.sendNote}</p>
        </form>
      </section>
    </SiteShell>
  );
}
