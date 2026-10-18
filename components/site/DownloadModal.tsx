"use client";

import { useEffect } from "react";
import styles from "./downloadModal.module.css";

const stores = [
  { badge: "/app-store-badge.svg", alt: "App Store", url: "https://apps.apple.com" },
  { badge: "/google-play-badge.svg", alt: "Google Play", url: "https://play.google.com" },
];

/* QR codes to the app stores. Closes on Escape, on the ✕ and on a click outside. */
export default function DownloadModal({ title, subtitle, closeLabel, onClose }: { title: string; subtitle: string; closeLabel: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="download-modal-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel} autoFocus>
          ✕
        </button>
        <h2 className={styles.title} id="download-modal-title">
          {title}
        </h2>
        <p className={styles.sub}>{subtitle}</p>
        <div className={styles.grid}>
          {stores.map((s) => (
            <div key={s.alt} className={styles.item}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(s.url)}&color=160f0f&bgcolor=ffffff&qzone=1`}
                alt={`QR code ${s.alt}`}
                width={150}
                height={150}
              />
              <img src={s.badge} alt={s.alt} className={styles.badge} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
