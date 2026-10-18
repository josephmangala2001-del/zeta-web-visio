import { isLang } from "../i18n";
import BecomeMentorPage from "./BecomeMentorPage";

export const metadata = {
  title: "Devenir mentor — Zeeta",
  description: "Faites passer des simulations d'entretien en visio aux candidats qui visent votre poste. Vous fixez votre tarif et vos horaires.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <BecomeMentorPage initialLang={isLang(lang) ? lang : "fr"} />;
}
