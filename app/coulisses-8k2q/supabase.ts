import { createClient } from "@supabase/supabase-js";

// Même projet Supabase que l'app mobile. Clé anon publique par nature : les
// droits admin sont portés par les policies, pas par la clé.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { storageKey: "zeeta-console-auth" } },
);

export const LOGO_BUCKET = "org-logos";

export type OrgKind = "company" | "school" | "other";

export type LogoRow = {
  name_norm: string;
  name: string;
  kind: OrgKind;
  logo_url: string;
  storage_path: string;
  aliases: string[];
  updated_at: string;
};

export type QueueRow = {
  id: number;
  name: string;
  domain: string | null;
  kind: OrgKind;
  usage_count: number;
};
