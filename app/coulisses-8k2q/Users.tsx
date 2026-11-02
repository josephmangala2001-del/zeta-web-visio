"use client";

import { useCallback, useEffect, useState } from "react";
import { CATEGORY_LABEL } from "./Inbox";
import { Badge, formatDate, label, REASON_LABEL } from "./Moderation";
import { formatMoney } from "./Overview";
import { supabase } from "./supabase";

// Utilisateurs : retrouver un compte, puis tout son contexte au même endroit
// (séances, paiements, demandes, messages bloqués, avis). Lecture seule.

const USER_TYPE_LABEL: Record<string, string> = { coach: "Coach", student: "Élève" };

const SESSION_STATUS: Record<string, { text: string; tone: "grey" | "red" | "green" | "amber" }> = {
  pending: { text: "En attente", tone: "amber" },
  confirmed: { text: "Confirmée", tone: "grey" },
  completed: { text: "Terminée", tone: "green" },
  cancelled: { text: "Annulée", tone: "red" },
};

const PAYMENT_STATUS: Record<string, { text: string; tone: "grey" | "red" | "green" | "amber" }> = {
  pending: { text: "En attente", tone: "amber" },
  processing: { text: "En cours", tone: "amber" },
  succeeded: { text: "Payé", tone: "green" },
  refunded: { text: "Remboursé", tone: "grey" },
  failed: { text: "Échoué", tone: "red" },
  cancelled: { text: "Annulé", tone: "grey" },
};

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  user_type: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  is_demo: boolean;
};

type TypeFilter = "all" | "coach" | "student";

const TYPE_FILTERS: [TypeFilter, string][] = [
  ["all", "Tous"],
  ["coach", "Coachs"],
  ["student", "Élèves"],
];

function Avatar({ name, url, size }: { name: string | null; url?: string | null; size: number }) {
  const style = { width: size, height: size };
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" style={style} className="shrink-0 rounded-full object-cover" />;
  }
  return (
    <span style={style} className="flex shrink-0 items-center justify-center rounded-full bg-[#ffdfdf] font-semibold text-[#d41111]">
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}

export function UsersPanel({ userId, onSelectUser }: { userId: string | null; onSelectUser: (id: string | null) => void }) {
  const [type, setType] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (t: TypeFilter, q: string) => {
    const { data, error } = await supabase.rpc("admin_search_users", { p_query: q || null, p_type: t, p_limit: 100 });
    if (error) setError(error.message);
    else {
      setError(null);
      setRows((data ?? []) as UserRow[]);
    }
  }, []);

  useEffect(() => {
    if (userId) return;
    const first = setTimeout(() => load(type, query), 250);
    return () => clearTimeout(first);
  }, [type, query, load, userId]);

  if (userId) return <UserSheet key={userId} userId={userId} onBack={() => onSelectUser(null)} onSelectUser={onSelectUser} />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map(([key, text]) => (
          <button
            key={key}
            onClick={() => setType(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${type === key ? "bg-[#ffdfdf] text-[#d41111]" : "bg-white"}`}
          >
            {text}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (nom, e-mail, téléphone)…"
          className="min-w-0 flex-1 basis-full rounded-lg border border-[#eae9e9] bg-white px-3 py-1.5 text-sm outline-none sm:ml-auto sm:max-w-xs sm:basis-auto"
        />
      </div>

      {error && <p className="mb-4 rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]">{error}</p>}

      {rows === null ? (
        !error && <p className="py-10 text-center text-sm text-[#8d8f98]">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl bg-white py-16 text-center text-sm text-[#8d8f98]">Aucun utilisateur trouvé.</p>
      ) : (
        <ul className="overflow-hidden rounded-2xl bg-white">
          {rows.map((r) => (
            <li key={r.id} className="border-b border-[#eae9e9] last:border-b-0">
              <button onClick={() => onSelectUser(r.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f6f6f6]">
                <Avatar name={r.name} url={r.avatar_url} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.name || "Sans nom"}</span>
                  <span className="block truncate text-xs text-[#8d8f98]">{r.email || r.phone || "Pas de contact"}</span>
                </span>
                {r.is_demo && <Badge tone="amber">Démo</Badge>}
                {r.user_type && <Badge>{label(USER_TYPE_LABEL, r.user_type)}</Badge>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Fiche ───

type UserDetails = {
  identity: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    user_type: string | null;
    city: string | null;
    country: string | null;
    signup_source: string | null;
    created_at: string;
    last_sign_in_at: string | null;
    is_demo: boolean;
    connect_payouts_enabled: boolean;
  };
  coach: {
    title: string | null;
    category: string | null;
    hourly_rate: number | null;
    location: string | null;
    avatar_url: string | null;
    rating: number | null;
    reviews: number | null;
    identity_verified: boolean;
    identity_exempt: boolean;
  } | null;
  student: {
    objective: string | null;
    target_role: string | null;
    urgency: string | null;
    location: string | null;
    avatar_url: string | null;
  } | null;
  stats: {
    sessions_total: number;
    sessions_completed: number;
    sessions_cancelled: number;
    paid_total: number;
    blocked_total: number;
  };
  sessions: {
    id: string;
    starts_at: string | null;
    date: string;
    time: string;
    duration_minutes: number;
    price: number | null;
    status: string;
    payment_status: string | null;
    other_id: string;
    other_name: string | null;
  }[];
  payments: {
    id: string;
    created_at: string;
    amount: number;
    currency: string | null;
    status: string;
    refunded_amount: number;
    refund_reason: string | null;
    payment_method: string | null;
    stripe_payment_intent_id: string | null;
    other_id: string;
    other_name: string | null;
  }[];
  requests: { id: string; created_at: string; subject: string | null; category: string | null; message: string; status: string }[];
  blocked: { id: string; created_at: string; reason: string }[];
  reviews: {
    id: string;
    created_at: string;
    rating: number;
    comment: string | null;
    author_role: string;
    other_id: string;
    other_name: string | null;
  }[];
};

type Tab = "sessions" | "payments" | "requests" | "blocked" | "reviews";

const money = (amount: number, currency: string | null) =>
  !currency || currency.toUpperCase() === "EUR"
    ? formatMoney(Number(amount))
    : new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency.toUpperCase() }).format(Number(amount));

function OtherUser({ id, name, onSelectUser }: { id: string; name: string | null; onSelectUser: (id: string) => void }) {
  return (
    <button onClick={() => onSelectUser(id)} className="truncate text-left font-medium text-[#d41111] hover:underline">
      {name || "Utilisateur inconnu"}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-10 text-center text-sm text-[#8d8f98]">{children}</p>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <li className="border-b border-[#eae9e9] px-4 py-3 text-sm last:border-b-0">{children}</li>;
}

function UserSheet({ userId, onBack, onSelectUser }: { userId: string; onBack: () => void; onSelectUser: (id: string) => void }) {
  const [data, setData] = useState<UserDetails | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("sessions");

  useEffect(() => {
    let active = true;
    supabase.rpc("admin_user_details", { p_user_id: userId }).then(({ data, error }) => {
      if (!active) return;
      if (error) setError(error.message);
      else if (!data) setNotFound(true);
      else setData(data as UserDetails);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  const back = (
    <button onClick={onBack} className="mb-4 text-sm text-[#d41111]">
      ← Tous les utilisateurs
    </button>
  );

  if (error) {
    return (
      <div>
        {back}
        <p className="rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]">{error}</p>
      </div>
    );
  }
  if (notFound) {
    return (
      <div>
        {back}
        <p className="rounded-2xl bg-white py-16 text-center text-sm text-[#8d8f98]">Ce compte n&apos;existe plus.</p>
      </div>
    );
  }
  if (!data) return <p className="py-10 text-center text-sm text-[#8d8f98]">Chargement…</p>;

  const { identity, coach, student, stats } = data;
  const avatar = coach?.avatar_url ?? student?.avatar_url;
  const place = coach?.location || student?.location || [identity.city, identity.country].filter(Boolean).join(", ");

  const details: [string, string | null | undefined][] = [
    ["Téléphone", identity.phone],
    ["Ville", place],
    ["Inscription", formatDate(identity.created_at)],
    ["Dernière connexion", identity.last_sign_in_at ? formatDate(identity.last_sign_in_at) : "Jamais"],
    ["Découvert via", identity.signup_source],
    ...(coach
      ? ([
          ["Poste", coach.title],
          ["Catégorie", coach.category],
          ["Tarif", coach.hourly_rate != null ? `${formatMoney(Number(coach.hourly_rate))} / h` : null],
          ["Note", coach.rating != null ? `${coach.rating} / 5 (${coach.reviews ?? 0} avis)` : null],
        ] as [string, string | null][])
      : []),
    ...(student
      ? ([
          ["Objectif", student.objective],
          ["Poste visé", student.target_role],
          ["Urgence", student.urgency],
        ] as [string, string | null][])
      : []),
  ];

  const tabs: [Tab, string, number][] = [
    ["sessions", "Séances", data.sessions.length],
    ["payments", "Paiements", data.payments.length],
    ["requests", "Demandes", data.requests.length],
    ["blocked", "Messages bloqués", data.blocked.length],
    ["reviews", "Avis", data.reviews.length],
  ];

  return (
    <div>
      {back}

      <section className="mb-3 rounded-2xl bg-white p-5">
        <div className="mb-4 flex items-center gap-4">
          <Avatar name={identity.name} url={avatar} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-xl font-bold">{identity.name || "Sans nom"}</h2>
            {identity.email && (
              <a href={`mailto:${identity.email}`} className="block break-all text-sm text-[#8d8f98] hover:underline">
                {identity.email}
              </a>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {identity.user_type && <Badge>{label(USER_TYPE_LABEL, identity.user_type)}</Badge>}
              {identity.is_demo && <Badge tone="amber">Compte de démo</Badge>}
              {coach &&
                (coach.identity_verified ? (
                  <Badge tone="green">Identité vérifiée</Badge>
                ) : coach.identity_exempt ? (
                  <Badge>Vérification dispensée</Badge>
                ) : (
                  <Badge tone="red">Identité non vérifiée</Badge>
                ))}
              {coach && (identity.connect_payouts_enabled ? <Badge tone="green">Virements actifs</Badge> : <Badge tone="amber">Virements inactifs</Badge>)}
            </div>
          </div>
        </div>
        <dl className="grid gap-x-6 gap-y-2 border-t border-[#eae9e9] pt-4 text-sm sm:grid-cols-2">
          {details
            .filter(([, value]) => value)
            .map(([title, value]) => (
              <div key={title} className="flex min-w-0 justify-between gap-3">
                <dt className="shrink-0 text-[#8d8f98]">{title}</dt>
                <dd className="min-w-0 break-words text-right font-medium">{value}</dd>
              </div>
            ))}
        </dl>
      </section>

      <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {(
          [
            ["Séances", String(stats.sessions_total)],
            ["Terminées", String(stats.sessions_completed)],
            ["Annulées", String(stats.sessions_cancelled)],
            [identity.user_type === "coach" ? "Encaissé" : "Payé", formatMoney(Number(stats.paid_total))],
          ] as [string, string][]
        ).map(([title, value]) => (
          <div key={title} className="min-w-0 rounded-2xl bg-white p-4">
            <p className="truncate text-xl font-bold">{value}</p>
            <p className="mt-1 truncate text-sm text-[#8d8f98]">{title}</p>
          </div>
        ))}
      </div>

      <nav className="mb-3 flex gap-1 overflow-x-auto">
        {tabs.map(([key, text, count]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${tab === key ? "bg-[#ffdfdf] text-[#d41111]" : "bg-white"}`}
          >
            {text} ({count})
          </button>
        ))}
      </nav>

      <section className="overflow-hidden rounded-2xl bg-white">
        {tab === "sessions" &&
          (data.sessions.length === 0 ? (
            <Empty>Aucune séance.</Empty>
          ) : (
            <ul>
              {data.sessions.map((s) => {
                const status = SESSION_STATUS[s.status];
                return (
                  <Row key={s.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <OtherUser id={s.other_id} name={s.other_name} onSelectUser={onSelectUser} />
                      <span className="ml-auto">
                        <Badge tone={status?.tone ?? "grey"}>{status?.text ?? s.status}</Badge>
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8d8f98]">
                      {[
                        s.starts_at ? formatDate(s.starts_at) : `${s.date} ${s.time}`,
                        `${s.duration_minutes} min`,
                        s.price != null && formatMoney(Number(s.price)),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </Row>
                );
              })}
            </ul>
          ))}

        {tab === "payments" &&
          (data.payments.length === 0 ? (
            <Empty>Aucun paiement.</Empty>
          ) : (
            <ul>
              {data.payments.map((p) => {
                const status = PAYMENT_STATUS[p.status];
                return (
                  <Row key={p.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{money(p.amount, p.currency)}</span>
                      <OtherUser id={p.other_id} name={p.other_name} onSelectUser={onSelectUser} />
                      <span className="ml-auto">
                        <Badge tone={status?.tone ?? "grey"}>{status?.text ?? p.status}</Badge>
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8d8f98]" title={p.stripe_payment_intent_id ?? undefined}>
                      {[formatDate(p.created_at), p.payment_method].filter(Boolean).join(" · ")}
                    </p>
                    {Number(p.refunded_amount) > 0 && (
                      <p className="mt-1 text-xs">
                        Remboursé : {money(p.refunded_amount, p.currency)}
                        {p.refund_reason && ` (${p.refund_reason})`}
                      </p>
                    )}
                  </Row>
                );
              })}
            </ul>
          ))}

        {tab === "requests" &&
          (data.requests.length === 0 ? (
            <Empty>Aucune demande.</Empty>
          ) : (
            <ul>
              {data.requests.map((r) => (
                <Row key={r.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{r.subject || label(CATEGORY_LABEL, r.category) || "Demande d'aide"}</span>
                    <span className="ml-auto">
                      {r.status === "resolved" ? <Badge tone="green">Traité</Badge> : <Badge tone="amber">À traiter</Badge>}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words">{r.message}</p>
                  <p className="mt-1 text-xs text-[#8d8f98]">{formatDate(r.created_at)}</p>
                </Row>
              ))}
            </ul>
          ))}

        {tab === "blocked" &&
          (data.blocked.length === 0 ? (
            <Empty>Aucun message bloqué.</Empty>
          ) : (
            <ul>
              {data.blocked.map((b) => (
                <Row key={b.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge>{label(REASON_LABEL, b.reason)}</Badge>
                    <span className="text-xs text-[#8d8f98]">{formatDate(b.created_at)}</span>
                  </div>
                </Row>
              ))}
              {stats.blocked_total > data.blocked.length && (
                <li className="px-4 py-3 text-center text-xs text-[#8d8f98]">{stats.blocked_total} au total, les plus récents sont affichés.</li>
              )}
            </ul>
          ))}

        {tab === "reviews" &&
          (data.reviews.length === 0 ? (
            <Empty>Aucun avis.</Empty>
          ) : (
            <ul>
              {data.reviews.map((r) => (
                <Row key={r.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{r.rating} / 5</span>
                    <OtherUser id={r.other_id} name={r.other_name} onSelectUser={onSelectUser} />
                    <span className="ml-auto text-xs text-[#8d8f98]">{formatDate(r.created_at)}</span>
                  </div>
                  {r.comment && <p className="mt-1 whitespace-pre-wrap break-words">{r.comment}</p>}
                </Row>
              ))}
            </ul>
          ))}
      </section>
    </div>
  );
}
