"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

// Tableau de bord : l'activité réelle de Zeeta sur une période, comparée à la
// période précédente. Les comptes de démo sont exclus par défaut (RPC
// admin_dashboard).

type Metrics = {
  new_students: number;
  new_coaches: number;
  sessions_booked: number;
  sessions_completed: number;
  sessions_cancelled: number;
  revenue: number;
  refunds: number;
  payments_failed: number;
  messages_blocked: number;
};

type DashboardData = {
  days: number;
  periods: { current: Metrics; previous: Metrics };
  totals: {
    coaches: number;
    coaches_unverified: number;
    students: number;
    sessions_upcoming: number;
    requests_open: number;
  };
};

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

const PERIODS: [number, string][] = [
  [7, "7 jours"],
  [30, "30 jours"],
  [90, "90 jours"],
];

/** Une hausse est-elle une bonne nouvelle ? Sert à colorer l'écart. */
const TILES: { key: keyof Metrics; title: string; money?: boolean; upIsGood: boolean }[] = [
  { key: "revenue", title: "Encaissé", money: true, upIsGood: true },
  { key: "sessions_booked", title: "Séances réservées", upIsGood: true },
  { key: "sessions_completed", title: "Séances terminées", upIsGood: true },
  { key: "new_students", title: "Nouveaux élèves", upIsGood: true },
  { key: "new_coaches", title: "Nouveaux coachs", upIsGood: true },
  { key: "sessions_cancelled", title: "Séances annulées", upIsGood: false },
  { key: "refunds", title: "Remboursé", money: true, upIsGood: false },
  { key: "payments_failed", title: "Paiements échoués", upIsGood: false },
  { key: "messages_blocked", title: "Messages bloqués", upIsGood: false },
];

function Delta({ current, previous, money, upIsGood }: { current: number; previous: number; money?: boolean; upIsGood: boolean }) {
  const diff = Math.round((current - previous) * 100) / 100;
  if (diff === 0) return <p className="mt-1 text-xs text-[#8d8f98]">Stable</p>;
  const good = diff > 0 === upIsGood;
  const amount = money ? formatMoney(Math.abs(diff)) : Math.abs(diff);
  return (
    <p className={`mt-1 text-xs font-medium ${good ? "text-[#1e6b34]" : "text-[#d41111]"}`}>
      {diff > 0 ? "+" : "−"}
      {amount} <span className="font-normal text-[#8d8f98]">vs période précédente</span>
    </p>
  );
}

function ActionTile({ value, title, hint, onClick }: { value: number; title: string; hint: string; onClick?: () => void }) {
  const pending = value > 0;
  const className = `rounded-2xl p-4 text-left ${pending ? "bg-[#ffdfdf]" : "bg-white"}`;
  const content = (
    <>
      <p className={`text-2xl font-bold ${pending ? "text-[#d41111]" : ""}`}>{value}</p>
      <p className="mt-1 text-sm font-medium">{title}</p>
      <p className="text-xs text-[#8d8f98]">{hint}</p>
    </>
  );
  return onClick ? (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}

export function OverviewPanel({ onOpenInbox }: { onOpenInbox: () => void }) {
  const [days, setDays] = useState(30);
  const [includeDemo, setIncludeDemo] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (d: number, demo: boolean) => {
    const { data, error } = await supabase.rpc("admin_dashboard", { p_days: d, p_include_demo: demo });
    if (error) setError(error.message);
    else {
      setError(null);
      setData(data as DashboardData);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => load(days, includeDemo), 0);
    return () => clearTimeout(first);
  }, [days, includeDemo, load]);

  const current = data?.periods?.current;
  const previous = data?.periods?.previous;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {PERIODS.map(([value, text]) => (
          <button
            key={value}
            onClick={() => setDays(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${days === value ? "bg-[#ffdfdf] text-[#d41111]" : "bg-white"}`}
          >
            {text}
          </button>
        ))}
        <label className="flex items-center gap-2 text-sm text-[#8d8f98] sm:ml-auto">
          <input type="checkbox" checked={includeDemo} onChange={(e) => setIncludeDemo(e.target.checked)} className="accent-[#d41111]" />
          Inclure les comptes de démo
        </label>
      </div>

      {error && <p className="mb-4 rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]">{error}</p>}

      {!data || !current || !previous ? (
        !error && <p className="py-10 text-center text-sm text-[#8d8f98]">Chargement…</p>
      ) : (
        <>
          <h2 className="mb-2 text-sm font-semibold">À regarder</h2>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <ActionTile value={data.totals.requests_open} title="Messages à traiter" hint="Boîte Zeeta" onClick={onOpenInbox} />
            <ActionTile value={current.payments_failed} title="Paiements échoués" hint={`Sur ${data.days} jours`} />
            <ActionTile value={data.totals.coaches_unverified} title="Coachs non vérifiés" hint="Identité à confirmer" />
          </div>

          <h2 className="mb-2 text-sm font-semibold">Activité sur {data.days} jours</h2>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {TILES.map((tile) => (
              <div key={tile.key} className="min-w-0 rounded-2xl bg-white p-4">
                <p className="truncate text-sm text-[#8d8f98]">{tile.title}</p>
                <p className="mt-1 text-2xl font-bold">{tile.money ? formatMoney(Number(current[tile.key])) : current[tile.key]}</p>
                <Delta current={Number(current[tile.key])} previous={Number(previous[tile.key])} money={tile.money} upIsGood={tile.upIsGood} />
              </div>
            ))}
          </div>

          <h2 className="mb-2 text-sm font-semibold">Aujourd&apos;hui sur Zeeta</h2>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ["Coachs", data.totals.coaches],
                ["Élèves", data.totals.students],
                ["Séances à venir", data.totals.sessions_upcoming],
              ] as [string, number][]
            ).map(([title, value]) => (
              <div key={title} className="min-w-0 rounded-2xl bg-white p-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 truncate text-sm text-[#8d8f98]">{title}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
