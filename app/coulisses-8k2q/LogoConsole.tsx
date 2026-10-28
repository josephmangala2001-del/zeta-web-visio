"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LOGO_BUCKET, supabase, type LogoRow, type OrgKind, type QueueRow } from "./supabase";
import { BlockedMessagesPanel, ReportsPanel } from "./Moderation";

// ─── Rendu identique à app/components/CompanyLogo.tsx de l'app mobile ───

const MONOGRAM_COLORS = ["#B45309", "#B91C1C", "#7C3AED", "#1D4ED8", "#0F766E", "#4D7C0F", "#A21CAF", "#0E7490"];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return MONOGRAM_COLORS[Math.abs(hash) % MONOGRAM_COLORS.length];
}

function initialsForName(name: string): string {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function Pastille({ name, uri, size }: { name: string; uri: string | null; size: number }) {
  const radius = Math.round(size * 0.28);
  if (!uri) {
    return (
      <div
        className="flex shrink-0 items-center justify-center font-bold text-white"
        style={{ width: size, height: size, borderRadius: radius, background: colorForName(name), fontSize: Math.round(size * 0.4) }}
      >
        {initialsForName(name)}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={uri} alt={name} className="shrink-0 object-contain" style={{ width: size, height: size, borderRadius: radius }} />
  );
}

const faviconUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

const KIND_LABEL: Record<OrgKind, string> = { company: "Entreprise", school: "École", other: "Autre" };

// ─── Traitement de l'image ───

const OUTPUT_SIZE = 512;

/** Carré PNG 512 px, logo centré sans déformation. Les SVG sont rastérisés au passage. */
async function renderLogo(file: Blob, whiteBg: boolean, marginPct: number): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    // Un SVG sans width/height annonce 0 × 0.
    const w = img.naturalWidth || OUTPUT_SIZE;
    const h = img.naturalHeight || OUTPUT_SIZE;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d")!;
    if (whiteBg) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    }
    const inner = OUTPUT_SIZE * (1 - (2 * marginPct) / 100);
    const scale = Math.min(inner / w, inner / h);
    const dw = w * scale;
    const dh = h * scale;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (OUTPUT_SIZE - dw) / 2, (OUTPUT_SIZE - dh) / 2, dw, dh);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Conversion impossible"))), "image/png"),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function slugify(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "logo"
  );
}

// ─── Page ───

export default function LogoConsole() {
  const [session, setSession] = useState<Session | null>(null);
  // Réponse rattachée au compte qui l'a obtenue : un changement de compte
  // repasse naturellement en « vérification en cours ».
  const [adminCheck, setAdminCheck] = useState<{ userId: string; ok: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const isAdmin = session && adminCheck?.userId === session.user.id ? adminCheck.ok : null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const userId = session.user.id;
    supabase.rpc("is_platform_admin").then(({ data, error }) => setAdminCheck({ userId, ok: !error && data === true }));
  }, [session]);

  if (!ready || (session && isAdmin === null)) {
    return <Shell><p className="text-sm text-[#8d8f98]">Chargement…</p></Shell>;
  }
  if (!session || !isAdmin) {
    return <LoginForm notAdmin={!!session && isAdmin === false} />;
  }
  return <Dashboard email={session.user.email ?? ""} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#f1f0f0] px-4">{children}</main>;
}

function LoginForm({ notAdmin }: { notAdmin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectedNonAdmin, setRejectedNonAdmin] = useState(false);

  useEffect(() => {
    if (!notAdmin) return;
    supabase.auth.signOut().then(() => setRejectedNonAdmin(true));
  }, [notAdmin]);

  const shownError = error ?? (notAdmin || rejectedNonAdmin ? "Ce compte n'a pas les droits administrateur." : null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setRejectedNonAdmin(false);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    // Message unique : ne pas dire lequel des deux champs est faux.
    if (error) setError("Identifiant ou mot de passe incorrect.");
    setBusy(false);
  }

  return (
    <Shell>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-[#25293b]">Console Zeeta</h1>
        <p className="mb-6 text-sm text-[#8d8f98]">Accès réservé.</p>
        <label className="mb-1 block text-sm font-medium">Identifiant</label>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-[#eae9e9] px-3 py-2 outline-none focus:border-[#d41111]"
        />
        <label className="mb-1 block text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-[#eae9e9] px-3 py-2 outline-none focus:border-[#d41111]"
        />
        {shownError && <p className="mb-4 text-sm text-[#d41111]">{shownError}</p>}
        <button
          disabled={busy}
          className="w-full rounded-lg bg-[#d41111] py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </Shell>
  );
}

type Draft = {
  /** name_norm de la ligne éditée ; null pour un nouveau logo. */
  existing: LogoRow | null;
  name: string;
  kind: OrgKind;
  aliases: string;
};

type Section = "logos" | "reports" | "blocked";

const SECTIONS: [Section, string][] = [
  ["reports", "Signalements"],
  ["blocked", "Messages bloqués"],
  ["logos", "Écoles et entreprises"],
];

function Dashboard({ email }: { email: string }) {
  const [section, setSection] = useState<Section>("reports");

  return (
    <main className="min-h-screen bg-[#f1f0f0] px-4 py-6 md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Console Zeeta</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#8d8f98]">{email}</span>
            <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-[#eae9e9] bg-white px-3 py-1.5">
              Déconnexion
            </button>
          </div>
        </header>

        <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-[#eae9e9]">
          {SECTIONS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`-mb-px shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${
                section === key ? "border-[#d41111] text-[#d41111]" : "border-transparent text-[#8d8f98]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {section === "reports" && <ReportsPanel />}
        {section === "blocked" && <BlockedMessagesPanel />}
        {section === "logos" && <LogosPanel />}
      </div>
    </main>
  );
}

function LogosPanel() {
  const [tab, setTab] = useState<"queue" | "logos">("queue");
  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [logos, setLogos] = useState<LogoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadQueue = useCallback(async (q: string) => {
    const { data, error } = await supabase.rpc("admin_logo_queue", { p_query: q || null, p_limit: 200 });
    if (error) setError(error.message);
    else setQueue((data ?? []) as QueueRow[]);
  }, []);

  const loadLogos = useCallback(async () => {
    const { data, error } = await supabase.from("organization_logos").select("*").order("updated_at", { ascending: false });
    if (error) setError(error.message);
    else setLogos((data ?? []) as LogoRow[]);
  }, []);

  // Recherche temporisée : une requête par pause de frappe, pas par touche.
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      loadQueue(query).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query, loadQueue]);

  useEffect(() => {
    const t = setTimeout(loadLogos, 0);
    return () => clearTimeout(t);
  }, [loadLogos]);

  const filteredLogos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logos;
    return logos.filter((l) => l.name.toLowerCase().includes(q) || l.aliases.some((a) => a.toLowerCase().includes(q)));
  }, [logos, query]);

  async function removeLogo(row: LogoRow) {
    if (!confirm(`Supprimer le logo de « ${row.name} » ? L'app reviendra au logo automatique ou aux initiales.`)) return;
    const { error } = await supabase.from("organization_logos").delete().eq("name_norm", row.name_norm);
    if (error) return setError(error.message);
    await supabase.storage.from(LOGO_BUCKET).remove([row.storage_path]);
    loadLogos();
    loadQueue(query);
  }

  return (
    <>
      <div>
        <p className="mb-4 text-sm text-[#8d8f98]">
          Écoles et entreprises proposées à la saisie, et leurs logos. Chaque enregistrement apparaît dans l&apos;app en
          quelques secondes.
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {(
            [
              ["queue", `À traiter (${queue.length}${queue.length === 200 ? "+" : ""})`],
              ["logos", `Mes logos (${logos.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === key ? "bg-[#ffdfdf] text-[#d41111]" : "bg-white"}`}
            >
              {label}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="ml-auto min-w-0 flex-1 rounded-lg border border-[#eae9e9] bg-white px-3 py-1.5 text-sm outline-none sm:max-w-xs"
          />
          <button
            onClick={() => setDraft({ existing: null, name: query.trim(), kind: "company", aliases: "" })}
            className="rounded-lg bg-[#d41111] px-4 py-1.5 text-sm font-semibold text-white"
          >
            + Ajouter
          </button>
        </div>

        {notice && (
          <p className="mb-4 rounded-lg bg-[#e6f4ea] px-3 py-2 text-sm text-[#1e6b34]" onClick={() => setNotice(null)}>
            {notice}
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-lg bg-[#ffdfdf] px-3 py-2 text-sm text-[#d41111]" onClick={() => setError(null)}>
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-2xl bg-white">
          {tab === "queue" &&
            (queue.length === 0 ? (
              <Empty text={loading ? "Chargement…" : "Rien à traiter. Toutes les organisations saisies ont un logo."} />
            ) : (
              queue.map((row) => (
                <Row
                  key={row.id}
                  logo={<Pastille name={row.name} uri={row.domain ? faviconUrl(row.domain) : null} size={40} />}
                  title={row.name}
                  subtitle={`${KIND_LABEL[row.kind]} · ${row.usage_count} saisie${row.usage_count > 1 ? "s" : ""}${row.domain ? ` · ${row.domain}` : ""}`}
                  actions={
                    <button
                      onClick={() => setDraft({ existing: null, name: row.name, kind: row.kind, aliases: "" })}
                      className="rounded-lg bg-[#d41111] px-3 py-1.5 text-sm font-semibold text-white"
                    >
                      Ajouter un logo
                    </button>
                  }
                />
              ))
            ))}

          {tab === "logos" &&
            (filteredLogos.length === 0 ? (
              <Empty text="Aucun logo envoyé pour l'instant." />
            ) : (
              filteredLogos.map((row) => (
                <Row
                  key={row.name_norm}
                  logo={<Pastille name={row.name} uri={row.logo_url} size={40} />}
                  title={row.name}
                  subtitle={`${KIND_LABEL[row.kind]}${row.aliases.length ? ` · aussi : ${row.aliases.join(", ")}` : ""}`}
                  actions={
                    <>
                      <button
                        onClick={() => setDraft({ existing: row, name: row.name, kind: row.kind, aliases: row.aliases.join(", ") })}
                        className="rounded-lg border border-[#eae9e9] px-3 py-1.5 text-sm"
                      >
                        Modifier
                      </button>
                      <button onClick={() => removeLogo(row)} className="rounded-lg px-3 py-1.5 text-sm text-[#d41111]">
                        Supprimer
                      </button>
                    </>
                  }
                />
              ))
            ))}
        </div>
      </div>

      {draft && (
        <Editor
          draft={draft}
          onClose={() => setDraft(null)}
          onSaved={(message) => {
            setNotice(message);
            setDraft(null);
            loadLogos();
            loadQueue(query);
          }}
        />
      )}
    </>
  );
}

function Row({ logo, title, subtitle, actions }: { logo: React.ReactNode; title: string; subtitle: string; actions: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#eae9e9] px-4 py-3 last:border-b-0">
      {logo}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-xs text-[#8d8f98]">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="px-4 py-10 text-center text-sm text-[#8d8f98]">{text}</p>;
}

function Editor({ draft, onClose, onSaved }: { draft: Draft; onClose: () => void; onSaved: (notice: string) => void }) {
  const [name, setName] = useState(draft.name);
  const [kind, setKind] = useState<OrgKind>(draft.kind);
  const [aliases, setAliases] = useState(draft.aliases);
  const [file, setFile] = useState<File | null>(null);
  const [whiteBg, setWhiteBg] = useState(true);
  const [margin, setMargin] = useState(8);
  const [rendered, setRendered] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(draft.existing?.logo_url ?? null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = useCallback((f: File | undefined | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("Ce fichier n'est pas une image.");
    setError(null);
    setFile(f);
  }, []);

  // Coller une image copiée (Ctrl+V) fonctionne partout dans la fenêtre.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => acceptFile(e.clipboardData?.files?.[0]);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("paste", onPaste);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("keydown", onKey);
    };
  }, [acceptFile, onClose]);

  useEffect(() => {
    if (!file) return;
    let url: string | null = null;
    let cancelled = false;
    renderLogo(file, whiteBg, margin)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setRendered(blob);
        setPreviewUrl(url);
      })
      .catch(() => !cancelled && setError("Impossible de lire cette image."));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, whiteBg, margin]);

  async function save() {
    const cleanName = name.trim();
    if (cleanName.length < 2) return setError("Le nom est obligatoire.");
    setBusy(true);
    setError(null);
    try {
      let logo_url: string | null = null;
      let storage_path: string | null = null;
      if (rendered) {
        // Nom de fichier unique à chaque envoi : l'URL change, donc aucun cache
        // (téléphone ou CDN) ne peut resservir l'ancienne image.
        storage_path = `${slugify(cleanName)}/${Date.now()}.png`;
        const up = await supabase.storage
          .from(LOGO_BUCKET)
          .upload(storage_path, rendered, { contentType: "image/png", cacheControl: "31536000", upsert: false });
        if (up.error) throw up.error;
        logo_url = supabase.storage.from(LOGO_BUCKET).getPublicUrl(storage_path).data.publicUrl;
      }
      // Un seul appel, une seule transaction : catalogue + logo éventuel.
      const res = await supabase.rpc("admin_save_organization", {
        p_name: cleanName,
        p_kind: kind,
        p_aliases: aliases.split(",").map((a) => a.trim()).filter(Boolean),
        p_logo_url: logo_url,
        p_storage_path: storage_path,
        p_previous_name_norm: draft.existing?.name_norm ?? null,
      });
      if (res.error) {
        // Le fichier envoyé n'est rattaché à rien : on ne le laisse pas traîner.
        if (storage_path) await supabase.storage.from(LOGO_BUCKET).remove([storage_path]);
        throw res.error;
      }
      if (rendered && draft.existing?.storage_path) {
        await supabase.storage.from(LOGO_BUCKET).remove([draft.existing.storage_path]);
      }
      const created = (res.data as { created?: boolean } | null)?.created;
      onSaved(
        rendered
          ? `« ${cleanName} » : logo enregistré${created ? ", et ajouté au catalogue" : ""}.`
          : `« ${cleanName} » ${created ? "ajouté au catalogue" : "mis à jour dans le catalogue"}.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enregistrement impossible.");
      setBusy(false);
    }
  }

  const displayName = name.trim() || "Nom";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onMouseDown={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">{draft.existing ? "Modifier" : "Ajouter une école ou une entreprise"}</h2>
        <p className="mb-4 text-sm text-[#8d8f98]">
          Le nom est proposé à la saisie dans l&apos;app. L&apos;image est facultative : sans elle, l&apos;app affiche les initiales.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                acceptFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-center text-sm ${
                dragOver ? "border-[#d41111] bg-[#ffdfdf]" : "border-[#eae9e9]"
              }`}
            >
              <p className="font-medium">Glisse l&apos;image ici</p>
              <p className="text-[#8d8f98]">ou clique, ou colle-la (Ctrl+V)</p>
              <p className="mt-1 text-xs text-[#8d8f98]">PNG, JPG, SVG, WebP</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />
            </div>

            {file && (
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={whiteBg} onChange={(e) => setWhiteBg(e.target.checked)} />
                  Fond blanc (recommandé : lisible en mode sombre)
                </label>
                <label className="flex items-center gap-2">
                  Marge
                  <input type="range" min={0} max={20} value={margin} onChange={(e) => setMargin(Number(e.target.value))} />
                  {margin} %
                </label>
              </div>
            )}

            <label className="mt-4 mb-1 block text-sm font-medium">Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#eae9e9] px-3 py-2 outline-none focus:border-[#d41111]"
            />
            <label className="mt-3 mb-1 block text-sm font-medium">Type</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as OrgKind)}
              className="w-full rounded-lg border border-[#eae9e9] bg-white px-3 py-2"
            >
              {(Object.keys(KIND_LABEL) as OrgKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
            <label className="mt-3 mb-1 block text-sm font-medium">Autres noms (séparés par des virgules)</label>
            <input
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              placeholder="Sciences Po, IEP Paris"
              className="w-full rounded-lg border border-[#eae9e9] px-3 py-2 outline-none focus:border-[#d41111]"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Aperçu dans l&apos;app</p>
            {(["#FFFFFF", "#121212"] as const).map((bg) => (
              <div
                key={bg}
                className="mb-3 flex items-center gap-4 rounded-xl border border-[#eae9e9] p-4"
                style={{ background: bg, color: bg === "#FFFFFF" ? "#25293b" : "#F5F5F5" }}
              >
                <Pastille name={displayName} uri={previewUrl} size={72} />
                <Pastille name={displayName} uri={previewUrl} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{displayName}</p>
                  <p className="text-xs opacity-60">{bg === "#FFFFFF" ? "Mode clair" : "Mode sombre"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-[#d41111]">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-[#eae9e9] px-4 py-2 text-sm">
            Annuler
          </button>
          <button
            onClick={save}
            disabled={busy}
            className="rounded-lg bg-[#d41111] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
