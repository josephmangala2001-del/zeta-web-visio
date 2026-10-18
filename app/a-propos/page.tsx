import { isLang } from "../i18n";
import AboutPage from "./AboutPage";

export const metadata = {
  title: "À propos — Zeeta",
  description: "Zeeta met en relation les candidats avec des professionnels de la banque, du conseil et de la tech pour des simulations d'entretien en visio.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <AboutPage initialLang={isLang(lang) ? lang : "fr"} />;
}
