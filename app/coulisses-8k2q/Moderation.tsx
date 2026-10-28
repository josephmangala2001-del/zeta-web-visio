"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

// ─── Libellés ───

const SOURCE_LABEL: Record<string, string> = {
  balance: "Solde / paiement",
  settings: "Paramètres",
  profile: "Profil",
};

const CATEGORY_LABEL: Record<string, string> = {
  contact: "Contact",
  bug: "Bug",
  payment: "Paiement",
  missing_payment: "Paiement manquant",
};

const REASON_LABEL: Record<string, string> = {
  email: "Adresse e-mail",
  phone: "Numéro de téléphone",
  external_link: "Lien externe",
  social_handle: "Pseudo de réseau social",
  social_platform: "Réseau social cité",
  off_platform_intent: "Proposition de continuer hors de Zeeta",
  off_platform_payment: "Paiement hors de Zeeta",
};

const USER_TYPE_LABEL: Record<string, string> = { coach: "Coach", student: "Élève" };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const label = (map: Record<string, string>, key: string | null) => (key ? (map[key] ?? key) : null);

function Badge({ children, tone = "grey" }: { children: React.ReactNode; tone?: "grey" | "red" | "green" | "amber" }) {
  const tones = {
    grey: "bg-[#f1f0f0] text-[#25293b]",
    red: "bg-[#ffdfdf] text-[#d41111]",
    green: "bg-[#e6f4ea] text-[#1e6b34]",
    amber: "bg-[#fdf1d8] text-[#8a5a00]",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function Pills<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <>
      {options.map(([key, text]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${value === key ? "bg-[#ffdfdf] text-[#d41111]" : "bg-white"}`}
        >
          {text}
        </button>
      ))}
    </>
  );
}

// ─── Signalements ───

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
  email_error: string | null;
  admin_note: string | null;
  resolved_at: string | null;
};

type Filter = "open" | "resolved" | "all";

export function ReportsPanel() {
  const [filter, setFilter] = useState<Filter>("open");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<SupportRequest[] | null>(null);
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
    const t = setTimeout(() => load(filter, query), 250);
    return () => clearTimeout(t);
  }, [filter, query, load]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Pills
          value={filter}
          onChange={setFilter}
          options={[
            ["open", "À traiter"],
            ["resolved", "Résolus"],
            ["all", "Tous"],
          ]}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (texte, nom, e-mail)…"
          className="ml-auto min-w-0 flex-1 rounded-lg border border-[#eae9e9] bg-white px-3 py-1.5 text-sm outline-none sm:max-w-xs"
        />
      </div>

      {error && <p className="mb-4 rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]">{error}</p>}

      {rows === null ? (
        <p className="py-10 text-center text-sm text-[#8d8f98]">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl bg-white py-10 text-center text-sm text-[#8d8f98]">
          {filter === "open" ? "Aucun signalement en attente." : "Aucun signalement."}
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <ReportCard key={r.id} row={r} onChanged={() => load(filter, query)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportCard({ row, onChanged }: { row: SupportRequest; onChanged: () => void }) {
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

  const replySubject = `Re: ${row.subject || label(CATEGORY_LABEL, row.category) || "votre demande"} — Zeeta`;

  return (
    <article className={`rounded-2xl bg-white p-4 ${resolved ? "opacity-70" : ""}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {resolved ? <Badge tone="green">Résolu</Badge> : <Badge tone="amber">À traiter</Badge>}
        {row.category && <Badge>{label(CATEGORY_LABEL, row.category)}</Badge>}
        <Badge>{label(SOURCE_LABEL, row.source)}</Badge>
        {row.email_error && <Badge tone="red">E-mail au support non parti</Badge>}
        <span className="ml-auto text-xs text-[#8d8f98]">{formatDate(row.created_at)}</span>
      </div>

      {row.subject && <h3 className="mb-1 font-semibold">{row.subject}</h3>}
      <p className="mb-3 whitespace-pre-wrap break-words text-sm">{row.message}</p>

      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8d8f98]">
        <span className="font-medium text-[#25293b]">{row.user_name || "Utilisateur supprimé ou inconnu"}</span>
        {row.user_type && <span>{label(USER_TYPE_LABEL, row.user_type)}</span>}
        {row.user_email && <span>{row.user_email}</span>}
        {(row.platform || row.app_version) && <span>{[row.platform, row.app_version && `v${row.app_version}`].filter(Boolean).join(" ")}</span>}
        {row.locale && <span>Langue : {row.locale}</span>}
      </div>

      {row.admin_note && (
        <p className="mb-3 rounded-lg bg-[#f6f6f6] px-3 py-2 text-sm">
          <span className="font-medium">Note interne : </span>
          {row.admin_note}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={row.admin_note ? "Remplacer la note interne…" : "Note interne (facultatif)…"}
          className="min-w-0 flex-1 rounded-lg border border-[#eae9e9] px-3 py-1.5 text-sm outline-none focus:border-[#d41111]"
        />
        {row.user_email && (
          <a
            href={`mailto:${row.user_email}?subject=${encodeURIComponent(replySubject)}`}
            className="rounded-lg border border-[#eae9e9] px-3 py-1.5 text-sm"
          >
            Répondre
          </a>
        )}
        <button
          disabled={busy}
          onClick={() => update(!resolved)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-60 ${
            resolved ? "border border-[#eae9e9]" : "bg-[#d41111] text-white"
          }`}
        >
          {resolved ? "Rouvrir" : "Marquer résolu"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-[#d41111]">{error}</p>}
    </article>
  );
}

// ─── Mots interdits ───

type BlockedTerm = { id: number; term: string; term_norm: string; reason: string; created_at: string };

export function BlockedTermsPanel() {
  const [rows, setRows] = useState<BlockedTerm[] | null>(null);
  const [term, setTerm] = useState("");
  const [reason, setReason] = useState("off_platform_intent");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("moderation_blocked_terms")
      .select("id, term, term_norm, reason, created_at")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows((data ?? []) as BlockedTerm[]);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim()) return;
    setBusy(true);
    setError(null);
    // term_norm est calculé par la base.
    const { error } = await supabase.from("moderation_blocked_terms").insert({ term: term.trim(), reason });
    setBusy(false);
    if (error) {
      setError(error.code === "23505" ? `« ${term.trim()} » est déjà dans la liste.` : error.message);
      return;
    }
    setTerm("");
    load();
  }

  async function remove(row: BlockedTerm) {
    if (!confirm(`Ne plus bloquer « ${row.term} » ?`)) return;
    const { error } = await supabase.from("moderation_blocked_terms").delete().eq("id", row.id);
    if (error) return setError(error.message);
    load();
  }

  return (
    <div>
      <p className="mb-4 text-sm text-[#8d8f98]">
        Ces mots et expressions s&apos;ajoutent aux règles automatiques. Ils sont bloqués en quelques secondes, dans
        l&apos;app comme sur le serveur. Seuls les mots entiers comptent : « cash » bloque « paie en cash » mais pas
        « cashmere ». Majuscules, accents et chiffres déguisés (« c4sh ») sont pris en compte.
      </p>

      <form onSubmit={add} className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Mot ou expression, ex. « mon 06 »"
          maxLength={80}
          className="min-w-0 flex-1 rounded-lg border border-[#eae9e9] px-3 py-2 text-sm outline-none focus:border-[#d41111]"
        />
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border border-[#eae9e9] bg-white px-3 py-2 text-sm"
        >
          {Object.entries(REASON_LABEL).map(([key, text]) => (
            <option key={key} value={key}>
              {text}
            </option>
          ))}
        </select>
        <button disabled={busy || !term.trim()} className="rounded-lg bg-[#d41111] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          Bloquer
        </button>
      </form>
      <p className="-mt-2 mb-4 text-xs text-[#8d8f98]">
        Le motif choisi est celui que l&apos;auteur du message verra, traduit dans sa langue.
      </p>

      {error && <p className="mb-4 rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]">{error}</p>}

      <MessageTester />

      {rows === null ? (
        !error && <p className="py-10 text-center text-sm text-[#8d8f98]">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl bg-white py-10 text-center text-sm text-[#8d8f98]">Aucun mot ajouté pour l&apos;instant.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#eae9e9] px-4 py-3 last:border-b-0">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{r.term}</p>
                <p className="truncate text-xs text-[#8d8f98]">Ajouté le {formatDate(r.created_at)}</p>
              </div>
              <Badge>{label(REASON_LABEL, r.reason)}</Badge>
              <button onClick={() => remove(r)} className="rounded-lg px-3 py-1.5 text-sm text-[#d41111]">
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Passe un message d'essai dans le vrai modérateur du serveur, sans rien envoyer. */
function MessageTester() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ reason: string | null } | null>(null);
  const [busy, setBusy] = useState(false);

  async function test(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    const [rules, custom] = await Promise.all([
      supabase.rpc("message_exit_attempt", { p_text: text }),
      supabase.rpc("message_custom_term_hit", { p_text: text }),
    ]);
    setBusy(false);
    setResult({ reason: (rules.data as string | null) ?? (custom.data as string | null) ?? null });
  }

  return (
    <form onSubmit={test} className="mb-4 rounded-2xl bg-white p-4">
      <p className="mb-2 text-sm font-medium">Tester un message</p>
      <div className="flex flex-wrap gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          placeholder="Ex. : on se capte sur whatsapp ?"
          className="min-w-0 flex-1 rounded-lg border border-[#eae9e9] px-3 py-2 text-sm outline-none focus:border-[#d41111]"
        />
        <button disabled={busy || !text.trim()} className="rounded-lg border border-[#eae9e9] px-4 py-2 text-sm disabled:opacity-60">
          Tester
        </button>
      </div>
      {result &&
        (result.reason ? (
          <p className="mt-2 text-sm text-[#d41111]">Bloqué — motif : {label(REASON_LABEL, result.reason)}</p>
        ) : (
          <p className="mt-2 text-sm text-[#1e6b34]">Accepté : ce message passerait.</p>
        ))}
    </form>
  );
}

// ─── Messages bloqués ───

type BlockedMessage = {
  id: string;
  created_at: string;
  reason: string;
  text_length: number;
  conversation_id: string | null;
  sender_id: string;
  sender_name: string | null;
  sender_email: string | null;
  sender_total: number;
};

/** À partir de combien de blocages un expéditeur est signalé comme récidiviste. */
const REPEAT_THRESHOLD = 3;

export function BlockedMessagesPanel() {
  const [rows, setRows] = useState<BlockedMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.rpc("admin_list_blocked_messages", { p_limit: 300 }).then(({ data, error }) => {
      if (error) setError(error.message);
      else setRows((data ?? []) as BlockedMessage[]);
    });
  }, []);

  return (
    <div>
      <p className="mb-4 text-sm text-[#8d8f98]">
        Messages refusés par le modérateur de la messagerie : coordonnées, liens ou proposition de continuer hors de Zeeta.
        Le texte n&apos;est jamais conservé, seulement le motif.
      </p>
      {error && <p className="mb-4 rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]">{error}</p>}
      {rows === null ? (
        !error && <p className="py-10 text-center text-sm text-[#8d8f98]">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl bg-white py-10 text-center text-sm text-[#8d8f98]">Aucun message bloqué.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#eae9e9] px-4 py-3 last:border-b-0">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{r.sender_name || r.sender_email || "Utilisateur inconnu"}</p>
                <p className="truncate text-xs text-[#8d8f98]">
                  {r.sender_name && r.sender_email ? `${r.sender_email} · ` : ""}
                  {formatDate(r.created_at)} · {r.text_length} caractères
                </p>
              </div>
              <Badge>{label(REASON_LABEL, r.reason)}</Badge>
              <Badge tone={r.sender_total >= REPEAT_THRESHOLD ? "red" : "grey"}>
                {r.sender_total} blocage{r.sender_total > 1 ? "s" : ""} au total
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
