import type { Metadata } from "next";
import LogoConsole from "./LogoConsole";

/* Console admin des logos d'écoles et d'entreprises. Aucun lien n'y mène et elle
   n'est pas indexée, mais l'adresse n'est pas la protection : chaque lecture et
   écriture est vérifiée par Supabase (is_platform_admin) côté base. */
export const metadata: Metadata = {
  title: "Console Zeeta",
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <LogoConsole />;
}
