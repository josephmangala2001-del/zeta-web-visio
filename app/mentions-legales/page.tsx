import { isLang } from "../i18n";
import LegalPage from "../legal/LegalPage";
import { mentionsLegales } from "../legal/documents";

export const metadata = {
  title: "Mentions légales — Zeeta",
  description: "Éditeur, hébergeur et propriété intellectuelle du site Zeeta.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <LegalPage doc={mentionsLegales} kind="mentions" initialLang={isLang(lang) ? lang : "fr"} />;
}
