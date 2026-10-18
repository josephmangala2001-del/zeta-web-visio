"use client";

import { useEffect, useRef, useState } from "react";
import { languages, type Lang } from "../../app/i18n";
import styles from "./langSelect.module.css";

/* Language picker for the dark nav pills: current code in an outlined pill, native names in a menu. */
export default function LangSelect({ lang, onChange, label }: { lang: Lang; onChange: (lang: Lang) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={root}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className={styles.globe} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        {lang.toUpperCase()}
        <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className={styles.menu} role="listbox" aria-label={label}>
          {languages.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                lang={l.code}
                className={l.code === lang ? styles.active : undefined}
                onClick={() => {
                  onChange(l.code);
                  setOpen(false);
                }}
              >
                <span>{l.label}</span>
                <span className={styles.code}>{l.code.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
