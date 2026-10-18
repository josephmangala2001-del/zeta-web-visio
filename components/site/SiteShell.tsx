"use client";

import { useCallback, useState, type ReactNode } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import DownloadModal from "./DownloadModal";
import styles from "./siteShell.module.css";
import type { Lang } from "../../app/i18n";
import { translations } from "../../app/translations";

/* Frame of the secondary pages (about, contact, legal): nav pill, content, footer, app download modal. */
export default function SiteShell({ lang, onLangChange, children }: { lang: Lang; onLangChange: (lang: Lang) => void; children: ReactNode }) {
  const [download, setDownload] = useState(false);
  const close = useCallback(() => setDownload(false), []);
  const t = translations[lang];
  return (
    <div className={styles.page}>
      <SiteNav lang={lang} onLangChange={onLangChange} onDownload={() => setDownload(true)} />
      <main>{children}</main>
      <SiteFooter lang={lang} />
      {download && <DownloadModal title={t.modal.title} subtitle={t.modal.subtitle} closeLabel={t.modal.close} onClose={close} />}
    </div>
  );
}
