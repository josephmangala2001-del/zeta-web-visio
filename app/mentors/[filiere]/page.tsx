import { isLang } from "../../i18n";
import { notFound } from "next/navigation";
import { filiereOrder, type FiliereId } from "../coaches";
import MentorsPage from "../MentorsPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ filiere: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { filiere } = await params;
  const { lang } = await searchParams;
  if (!filiereOrder.includes(filiere as FiliereId)) notFound();
  return <MentorsPage filiere={filiere as FiliereId} initialLang={isLang(lang) ? lang : "fr"} />;
}
