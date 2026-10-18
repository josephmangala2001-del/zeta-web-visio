import { isLang } from "../i18n";
import LegalPage from "../legal/LegalPage";
import { cgu } from "../legal/documents";

export const metadata = {
  title: "Conditions générales d'utilisation — Zeeta",
  description: "Règles d'utilisation du site et de l'application Zeeta.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <LegalPage doc={cgu} kind="terms" initialLang={isLang(lang) ? lang : "fr"} />;
}
