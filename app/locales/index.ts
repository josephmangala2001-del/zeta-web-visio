import type { Lang } from "../i18n";
import type { BecomeCopyFn, MentorsCopy } from "./types";
import * as fr from "./fr";
import * as en from "./en";
import * as zh from "./zh";
import * as hi from "./hi";
import * as es from "./es";
import * as ar from "./ar";
import * as pt from "./pt";
import * as ru from "./ru";

const all = { fr, en, zh, hi, es, ar, pt, ru };

export const mentorsCopy = Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v.mentors])) as Record<Lang, MentorsCopy>;
export const becomeCopy = Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v.become])) as Record<Lang, BecomeCopyFn>;

import type { PagesCopy } from "./types";
import pagesFr from "./pages/fr";
import pagesEn from "./pages/en";
import pagesZh from "./pages/zh";
import pagesHi from "./pages/hi";
import pagesEs from "./pages/es";
import pagesAr from "./pages/ar";
import pagesPt from "./pages/pt";
import pagesRu from "./pages/ru";

/* About, contact and legal-page frame. */
export const pagesCopy: Record<Lang, PagesCopy> = {
  fr: pagesFr,
  en: pagesEn,
  zh: pagesZh,
  hi: pagesHi,
  es: pagesEs,
  ar: pagesAr,
  pt: pagesPt,
  ru: pagesRu,
};
