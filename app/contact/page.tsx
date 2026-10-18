import { isLang } from "../i18n";
import ContactPage from "./ContactPage";

export const metadata = {
  title: "Contact — Zeeta",
  description: "Une question sur une séance, votre profil mentor ou un partenariat ? Écrivez à l'équipe Zeeta.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <ContactPage initialLang={isLang(lang) ? lang : "fr"} />;
}
