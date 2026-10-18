/* Copy of the inner pages, one object per language (see the other files in this folder).
   The landing page copy lives in app/translations.ts. */

/* Mentor list page (/mentors/[filiere]). */
export type MentorsCopy = {
  back: string;
  titlePrefix: string;
  search: string;
  price: { all: string; low: string; mid: string; high: string };
  allCountries: string;
  sortLabel: string;
  sort: { relevance: string; priceAsc: string; priceDesc: string; rating: string };
  tomorrow: string;
  count: (n: number) => string;
  perHour: string;
  session: string;
  reviews: (n: number) => string;
  book: string;
  message: string;
  availability: string;
  next: string;
  pickTime: string;
  favorite: string;
  verified: string;
  empty: string;
  reset: string;
  modalBook: (name: string) => string;
  modalMessage: (name: string) => string;
  modalSub: string;
  close: string;
  download: string;
  downloadSub: string;
};

/* "Become a mentor" page. `min` and `max` are the formatted price range of the mentors. */
export type BecomeCopy = {
  title: string;
  subtitle: string;
  steps: { title: string; desc: string }[];
  cta: string;
  already: string;
  rate: string;
  perHour: string;
  benefits: { title: string; desc: string }[];
  toolsTitle: string;
  toolsSub: string;
  tools: string[];
  screensAlt: [string, string];
  quote: (text: string) => string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  bannerTitle: string;
  bannerSub: string;
  modalTitle: string;
  downloadTitle: string;
  modalSub: string;
  close: string;
};

export type BecomeCopyFn = (range: { min: string; max: string; tracks: string }) => BecomeCopy;

/* About page. Figures (mentor count, tracks, price range) come from the real data. */
export type AboutCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  missionTitle: string;
  mission: string[];
  stats: { mentors: string; tracks: string; rate: string };
  valuesTitle: string;
  values: { title: string; desc: string }[];
  candidates: { title: string; desc: string; cta: string };
  mentors: { title: string; desc: string; cta: string };
};

/* Contact page. The form writes an email in the visitor's own mail app. */
export type ContactCopy = {
  title: string;
  lead: string;
  emailLabel: string;
  topics: { title: string; desc: string }[];
  formTitle: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  send: string;
  sendNote: string;
  faqPrompt: string;
  faqLink: string;
};

/* Frame of the legal pages (their body is in French, see app/legal). */
export type LegalCopy = {
  updated: string;
  toc: string;
  frenchOnly: string;
  draftNote: string;
};

export type PagesCopy = { about: AboutCopy; contact: ContactCopy; legal: LegalCopy };
