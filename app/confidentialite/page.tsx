import { isLang } from "../i18n";
import LegalPage from "../legal/LegalPage";
import { confidentialite } from "../legal/documents";

export const metadata = {
  title: "Politique de confidentialité — Zeeta",
  description: "Données personnelles collectées par Zeeta, finalités, durées de conservation et droits.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <LegalPage doc={confidentialite} kind="privacy" initialLang={isLang(lang) ? lang : "fr"} />;
}
