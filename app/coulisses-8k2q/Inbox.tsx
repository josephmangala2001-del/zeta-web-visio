"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, formatDate, label } from "./Moderation";
import { supabase } from "./supabase";

// La boîte de Zeeta : aide, support et signalements envoyés depuis l'app
// (table support_requests, alimentée par la fonction send-support-email).

const SOURCE_LABEL: Record<string, string> = {
  balance: "Solde / paiement",
  settings: "Paramètres",
  profile: "Profil",
};

export const CATEGORY_LABEL: Record<string, string> = {
  contact: "Contact",
  bug: "Bug",
  payment: "Paiement",
  missing_payment: "Paiement manquant",
  tutor: "Consultant",
  content: "Contenu",
  other: "Autre",
};

const USER_TYPE_LABEL: Record<string, string> = { coach: "Coach", student: "Élève" };

/** Les nouvelles demandes apparaissent sans recharger la page. */
const REFRESH_MS = 30_000;

type SupportRequest = {
  id: string;
  created_at: string;
  source: string;
  category: string | null;
  subject: string | null;
  message: string;
  status: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_type: string | null;
  locale: string | null;
  platform: string | null;
  app_version: string | null;
  admin_note: string | null;
  resolved_at: string | null;
};

type Filter = "open" | "resolved" | "all";

const FILTERS: [Filter, string][] = [
  ["open", "À traiter"],
  ["resolved", "Traités"],
  ["all", "Tous"],
];

const titleOf = (r: SupportRequest) => r.subject || label(CATEGORY_LABEL, r.category) || "Demande d'aide";

/** Nombre de demandes à traiter, pour l'onglet de la console. */
export function useInboxCount() {
  const [count, setCount] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.rpc("admin_list_support_requests", { p_filter: "open", p_query: null, p_limit: 500 });
    if (!error) setCount((data ?? []).length);
  }, []);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refresh]);

  return { count, refresh };
}

export function InboxPanel({ onChanged, onOpenUser }: { onChanged: () => void; onOpenUser: (id: string) => void }) {
  const [filter, setFilter] = useState<Filter>("open");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<SupportRequest[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (f: Filter, q: string) => {
    const { data, error } = await supabase.rpc("admin_list_support_requests", { p_filter: f, p_query: q || null, p_limit: 300 });
    if (error) setError(error.message);
    else {
      setError(null);
      setRows((data ?? []) as SupportRequest[]);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => load(filter, query), 250);
    const timer = setInterval(() => load(filter, query), REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [filter, query, load]);

  const selected = rows?.find((r) => r.id === selectedId) ?? null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map(([key, text]) => (
          <button
            key={key}
            onClick={() => {
              setFilter(key);
              setSelectedId(null);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === key ? "bg-[#ffdfdf] text-[#d41111]" : "bg-white"}`}
          >
            {text}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (texte, nom, e-mail)…"
          className="min-w-0 flex-1 basis-full rounded-lg border border-[#eae9e9] bg-white px-3 py-1.5 text-sm outline-none sm:ml-auto sm:max-w-xs sm:basis-auto"
        />
      </div>

      {error && <p className="mb-4 rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]">{error}</p>}

      {rows === null ? (
        !error && <p className="py-10 text-center text-sm text-[#8d8f98]">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl bg-white py-16 text-center text-sm text-[#8d8f98]">
          {filter === "open" ? "Aucun message à traiter." : "Aucun message."}
        </p>
      ) : (
        <div className="grid overflow-hidden rounded-2xl bg-white md:grid-cols-[320px_1fr]">
          {/* Sur téléphone, la liste et le message s'affichent l'un après l'autre. */}
          <ul className={`min-w-0 md:max-h-[70vh] md:overflow-y-auto md:border-r md:border-[#eae9e9] ${selected ? "hidden md:block" : ""}`}>
            {rows.map((r) => (
              <li key={r.id} className="border-b border-[#eae9e9] last:border-b-0">
                <MessageRow row={r} active={r.id === selectedId} onSelect={() => setSelectedId(r.id)} />
              </li>
            ))}
          </ul>
          <div className={`min-w-0 ${selected ? "" : "hidden md:block"}`}>
            {selected ? (
              <MessageDetail
                key={selected.id}
                row={selected}
                onBack={() => setSelectedId(null)}
                onOpenUser={onOpenUser}
                onChanged={() => {
                  load(filter, query);
                  onChanged();
                }}
              />
            ) : (
              <p className="py-24 text-center text-sm text-[#8d8f98]">Sélectionnez un message.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MessageRow({ row, active, onSelect }: { row: SupportRequest; active: boolean; onSelect: () => void }) {
  const open = row.status !== "resolved";
  return (
    <button onClick={onSelect} className={`block w-full px-4 py-3 text-left ${active ? "bg-[#fff1f1]" : "hover:bg-[#f6f6f6]"}`}>
      <span className="mb-0.5 flex items-center gap-2">
        {open && <span aria-label="À traiter" className="h-2 w-2 shrink-0 rounded-full bg-[#d41111]" />}
        <span className={`min-w-0 flex-1 truncate text-sm ${open ? "font-semibold" : ""}`}>{row.user_name || row.user_email || "Utilisateur inconnu"}</span>
        <span className="shrink-0 text-xs text-[#8d8f98]">{formatDate(row.created_at)}</span>
      </span>
      <span className={`block truncate text-sm ${open ? "font-medium" : ""}`}>{titleOf(row)}</span>
      <span className="block truncate text-xs text-[#8d8f98]">{row.message}</span>
    </button>
  );
}

function MessageDetail({
  row,
  onBack,
  onChanged,
  onOpenUser,
}: {
  row: SupportRequest;
  onBack: () => void;
  onChanged: () => void;
  onOpenUser: (id: string) => void;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolved = row.status === "resolved";

  async function update(nextResolved: boolean) {
    setBusy(true);
    setError(null);
    const { error } = await supabase.rpc("admin_update_support_request", {
      p_id: row.id,
      p_resolved: nextResolved,
      p_note: note || null,
    });
    setBusy(false);
    if (error) return setError(error.message);
    setNote("");
    onChanged();
  }

  const replySubject = `Re: ${titleOf(row)} — Zeeta`;

  return (
    <article className="p-5">
      <button onClick={onBack} className="mb-3 text-sm text-[#d41111] md:hidden">
        ← Tous les messages
      </button>

      <h2 className="mb-2 break-words text-lg font-bold">{titleOf(row)}</h2>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {resolved ? <Badge tone="green">Traité</Badge> : <Badge tone="amber">À traiter</Badge>}
        {row.category && <Badge>{label(CATEGORY_LABEL, row.category)}</Badge>}
        <Badge>{label(SOURCE_LABEL, row.source)}</Badge>
      </div>

      <div className="mb-4 border-y border-[#eae9e9] py-3 text-sm">
        <p className="font-medium">
          {row.user_name || "Utilisateur supprimé ou inconnu"}
          {row.user_type && <span className="font-normal text-[#8d8f98]"> · {label(USER_TYPE_LABEL, row.user_type)}</span>}
        </p>
        {row.user_email && <p className="break-all text-[#8d8f98]">{row.user_email}</p>}
        <p className="mt-1 text-xs text-[#8d8f98]">
          {[
            formatDate(row.created_at),
            row.platform && row.app_version ? `${row.platform} v${row.app_version}` : row.platform,
            row.locale && `Langue : ${row.locale}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <p className="mb-5 whitespace-pre-wrap break-words text-sm leading-6">{row.message}</p>

      {row.admin_note && (
        <p className="mb-4 rounded-lg bg-[#f6f6f6] px-3 py-2 text-sm">
          <span className="font-medium">Note interne : </span>
          {row.admin_note}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={row.admin_note ? "Remplacer la note interne…" : "Note interne (facultatif)…"}
          className="min-w-0 flex-1 basis-full rounded-lg border border-[#eae9e9] px-3 py-2 text-sm outline-none focus:border-[#d41111]"
        />
        {row.user_id && (
          <button onClick={() => onOpenUser(row.user_id as string)} className="rounded-lg border border-[#eae9e9] px-3 py-1.5 text-sm">
            Voir la fiche
          </button>
        )}
        {row.user_email && (
          <a
            href={`mailto:${row.user_email}?subject=${encodeURIComponent(replySubject)}`}
            className="rounded-lg border border-[#eae9e9] px-3 py-1.5 text-sm"
          >
            Répondre par e-mail
          </a>
        )}
        <button
          disabled={busy}
          onClick={() => update(!resolved)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-60 ${
            resolved ? "border border-[#eae9e9]" : "bg-[#d41111] text-white"
          }`}
        >
          {resolved ? "Remettre à traiter" : "Marquer comme traité"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-[#d41111]">{error}</p>}
    </article>
  );
}
