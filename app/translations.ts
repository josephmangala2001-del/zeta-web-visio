import type { FiliereId } from "./mentors/coaches";
import type { Lang } from "./i18n";
import { site as zh } from "./locales/zh";
import { site as hi } from "./locales/hi";
import { site as es } from "./locales/es";
import { site as ar } from "./locales/ar";
import { site as pt } from "./locales/pt";
import { site as ru } from "./locales/ru";

export type TrackId = "ma" | "trading" | "consulting" | "tech";

export type Translation = {
  langLabel: string;
  nav: {
    findMentor: string;
    howItWorks: string;
    becomeMentor: string;
    faq: string;
    download: string;
    menu: string;
    language: string;
  };
  hero: {
    title: string[];
    subtitle: string;
    trackPrompt: string;
    tracks: Record<TrackId, { label: string; role: string; question: string }>;
    cta: string;
    live: string;
    you: string;
    questionLabel: string;
    note: string;
    phoneAlts: string[];
  };
  logos: { label: string };
  catalog: {
    title: string;
    subtitle: string;
    items: { id: FiliereId; title: string; desc: string }[];
    cta: string;
  };
  video: { title: string; subtitle: string; label: string };
  steps: {
    title: string;
    items: { title: string; desc: string }[];
    mentorTags: string[];
    booking: { dateTitle: string; slotTitle: string; periods: [string, string, string, string] };
    reportTitle: string;
    report: { label: string; verdict: string; good: boolean }[];
    reportAction: string;
  };
  testimonials: {
    title: string;
    items: { text: string; role: string }[];
  };
  mentor: {
    title: string;
    subtitle: string;
    points: string[];
    cta: string;
    screensLabel: string;
    screens: string[];
  };
  app: {
    title: string;
    subtitle: string;
    qr: string;
    screens: { title: string; desc: string }[];
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  modal: { title: string; subtitle: string; close: string };
  auth: {
    title: string;
    subtitle: string;
    googleBtn: string;
    appleBtn: string;
    orDivider: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    submitBtn: string;
    forgotPassword: string;
    noAccount: string;
    signUpLink: string;
  };
  footer: {
    tagline: string;
    tracks: string;
    product: string;
    company: string;
    legal: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    mentions: string;
    copyright: string;
  };
};

export const translations: Record<Lang, Translation> = {
  fr: {
    langLabel: "Français",
    nav: {
      findMentor: "Trouver un mentor",
      howItWorks: "Comment ça marche",
      becomeMentor: "Devenir mentor",
      faq: "FAQ",
      download: "Télécharger l'app",
      menu: "Menu",
      language: "Langue",
    },
    hero: {
      title: ["Entraînez-vous", "avec ceux qui", "recrutent."],
      subtitle:
        "Simulations d'entretien en visio avec des professionnels de la banque, du conseil et de la tech. Un compte-rendu écrit après chaque séance.",
      trackPrompt: "Je prépare un entretien en",
      tracks: {
        ma: {
          label: "M&A",
          role: "Associate M&A · banque d'affaires",
          question: "Présentez-moi un DCF, étape par étape.",
        },
        trading: {
          label: "Sales & Trading",
          role: "Trader taux · banque de marché",
          question: "Deux dés : quelle probabilité d'obtenir au moins un 6 ?",
        },
        consulting: {
          label: "Conseil",
          role: "Manager · conseil en stratégie",
          question: "Estimez le nombre de trottinettes en libre-service à Paris.",
        },
        tech: {
          label: "Tech",
          role: "Senior engineer · big tech",
          question: "Inversez une liste chaînée. Quelle complexité ?",
        },
      },
      cta: "Trouver mon mentor",
      live: "En direct",
      you: "Vous",
      questionLabel: "Question du mentor",
      note: "Séances de 45 min · compte-rendu sous 24 h",
      phoneAlts: ["Écran de connexion de l'app Zeeta", "Recherche de mentors dans l'app Zeeta"],
    },
    logos: { label: "Des mentors passés par" },
    catalog: {
      title: "Choisissez votre filière",
      subtitle: "Chaque filière a ses codes. Nos mentors les connaissent parce qu'ils sont passés de l'autre côté de la table.",
      items: [
        { id: "ma", title: "Fusions & acquisitions", desc: "Technique, valorisation, fit. Le format des banques d'affaires." },
        { id: "trading", title: "Sales & Trading", desc: "Marchés, brainteasers et calcul mental sous pression." },
        { id: "consulting", title: "Conseil en stratégie", desc: "Études de cas, structuration MECE, synthèse en une minute." },
        { id: "tech", title: "Tech & développement", desc: "Algorithmes, system design et entretien comportemental." },
        { id: "pe", title: "Private equity", desc: "Cas LBO, modélisation et discussion de deal." },
        { id: "audit", title: "Audit & Transaction Services", desc: "Due diligence, analyse financière, mises en situation." },
      ],
      cta: "Voir les mentors",
    },
    video: {
      title: "Zeeta en 30 secondes",
      subtitle: "Trouvez votre mentor, réservez une séance et recevez votre compte-rendu, le tout depuis l'app.",
      label: "Vidéo de présentation de l'app Zeeta",
    },
    steps: {
      title: "De la réservation au compte-rendu",
      items: [
        { title: "Choisissez votre mentor", desc: "Filtrez par filière et par entreprise. Chaque profil indique le parcours et le tarif horaire." },
        { title: "Réservez un créneau", desc: "Les disponibilités sont à jour. Le lien de la salle visio arrive par e-mail." },
        { title: "Passez l'entretien, lisez le retour", desc: "Après la séance, votre mentor rédige un retour point par point et un plan d'action." },
      ],
      mentorTags: ["Valorisation", "LBO", "Fit"],
      booking: {
        dateTitle: "Choisir une date",
        slotTitle: "Choisir un créneau",
        periods: ["Matin", "Après-midi", "Soirée", "Nuit"],
      },
      reportTitle: "Compte-rendu · Étude de cas",
      report: [
        { label: "Structuration", verdict: "Bien", good: true },
        { label: "Business sense", verdict: "Excellent", good: true },
        { label: "Synthèse", verdict: "À travailler", good: false },
      ],
      reportAction: "Plan d'action : synthèse en moins d'une minute, chrono en main.",
    },
    testimonials: {
      title: "Ce qu'en disent les candidats",
      items: [
        { text: "J'ai trouvé un mentor en quelques minutes. Trois séances plus tard, mes réponses techniques tenaient enfin la route.", role: "Senior Developer" },
        { text: "Le compte-rendu après chaque séance m'a servi de fiche de révision. Je savais exactement quoi travailler avant le vrai entretien.", role: "Financial Analyst" },
      ],
    },
    mentor: {
      title: "Vous êtes passé par là ? Devenez mentor.",
      subtitle: "Partagez ce que vous auriez aimé savoir avant vos entretiens.",
      points: ["Vous fixez votre tarif", "Vous choisissez vos horaires", "Les séances se passent dans la salle visio Zeeta"],
      cta: "Devenir mentor",
      screensLabel: "Captures de l'espace mentor de l'app Zeeta",
      screens: ["Agenda des séances du mentor", "Tableau de bord mentor : revenus de la semaine", "Candidats qui cherchent un mentor"],
    },
    app: {
      title: "Vos séances aussi sur mobile",
      subtitle: "Rejoignez la salle depuis votre téléphone et recevez un rappel avant chaque entretien.",
      qr: "Afficher le QR code",
      screens: [
        { title: "Connexion", desc: "Numéro, Google, Apple ou e-mail." },
        { title: "Recherche", desc: "Filtrez par catégorie, prix, pays ou disponibilité." },
        { title: "Profil du mentor", desc: "Parcours, avis, tarif et agenda pour réserver." },
        { title: "Votre séance", desc: "Détails, message au mentor, annulation." },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Qu'est-ce que Zeeta ?", a: "Zeeta met en relation des candidats et des professionnels de la finance, du conseil et de la tech pour des simulations d'entretien en visio, suivies d'un compte-rendu écrit." },
        { q: "Comment choisir un mentor ?", a: "Après inscription, filtrez les mentors par filière, entreprise ou disponibilité, consultez leur profil puis réservez un créneau." },
        { q: "Les séances sont-elles enregistrées ?", a: "Uniquement si le mentor et vous l'acceptez. L'enregistrement reste alors disponible dans votre espace." },
        { q: "Combien coûte une séance ?", a: "Chaque mentor fixe son tarif horaire, affiché sur son profil avant la réservation. Vous payez uniquement la durée réservée." },
        { q: "Que se passe-t-il si la séance est annulée ?", a: "Si le mentor annule ou en cas de problème technique, vous êtes remboursé intégralement sous 48 h." },
      ],
    },
    modal: {
      title: "Télécharger l'app",
      subtitle: "Scannez le QR code avec votre téléphone.",
      close: "Fermer",
    },
    auth: {
      title: "Se connecter",
      subtitle: "Retrouvez vos séances et vos comptes-rendus.",
      googleBtn: "Continuer avec Google",
      appleBtn: "Continuer avec Apple",
      orDivider: "ou",
      emailPlaceholder: "Adresse e-mail",
      passwordPlaceholder: "Mot de passe",
      submitBtn: "Se connecter",
      forgotPassword: "Mot de passe oublié ?",
      noAccount: "Pas encore de compte ?",
      signUpLink: "Créer un compte",
    },
    footer: {
      tagline: "Simulations d'entretien en visio avec ceux qui recrutent.",
      tracks: "Filières",
      product: "Produit",
      company: "Entreprise",
      legal: "Légal",
      about: "À propos",
      contact: "Contact",
      privacy: "Confidentialité",
      terms: "CGU",
      mentions: "Mentions légales",
      copyright: "© 2026 Zeeta. Tous droits réservés.",
    },
  },

  en: {
    langLabel: "English",
    nav: {
      findMentor: "Find a mentor",
      howItWorks: "How it works",
      becomeMentor: "Become a mentor",
      faq: "FAQ",
      download: "Get the app",
      menu: "Menu",
      language: "Language",
    },
    hero: {
      title: ["Practice with", "the people", "who hire."],
      subtitle:
        "Video mock interviews with professionals from banking, consulting and tech. A written report after every session.",
      trackPrompt: "I'm preparing an interview in",
      tracks: {
        ma: {
          label: "M&A",
          role: "M&A Associate · investment bank",
          question: "Walk me through a DCF, step by step.",
        },
        trading: {
          label: "Sales & Trading",
          role: "Rates trader · markets desk",
          question: "Two dice: what's the probability of at least one 6?",
        },
        consulting: {
          label: "Consulting",
          role: "Manager · strategy consulting",
          question: "Estimate the number of shared e-scooters in Paris.",
        },
        tech: {
          label: "Tech",
          role: "Senior engineer · big tech",
          question: "Reverse a linked list. What's the complexity?",
        },
      },
      cta: "Find my mentor",
      live: "Live",
      you: "You",
      questionLabel: "Mentor's question",
      note: "45-min sessions · report within 24 h",
      phoneAlts: ["Zeeta app sign-in screen", "Mentor search in the Zeeta app"],
    },
    logos: { label: "Mentors who've worked at" },
    catalog: {
      title: "Pick your track",
      subtitle: "Every track has its own codes. Our mentors know them because they've sat on the other side of the table.",
      items: [
        { id: "ma", title: "Mergers & acquisitions", desc: "Technicals, valuation, fit. The investment banking format." },
        { id: "trading", title: "Sales & Trading", desc: "Markets, brainteasers and mental math under pressure." },
        { id: "consulting", title: "Strategy consulting", desc: "Case studies, MECE structuring, one-minute synthesis." },
        { id: "tech", title: "Tech & engineering", desc: "Algorithms, system design and behavioral interviews." },
        { id: "pe", title: "Private equity", desc: "LBO cases, modeling and deal discussion." },
        { id: "audit", title: "Audit & Transaction Services", desc: "Due diligence, financial analysis, role plays." },
      ],
      cta: "See mentors",
    },
    video: {
      title: "Zeeta in 30 seconds",
      subtitle: "Find your mentor, book a session and get your written report, all from the app.",
      label: "Zeeta app presentation video",
    },
    steps: {
      title: "From booking to written report",
      items: [
        { title: "Choose your mentor", desc: "Filter by track and company. Every profile shows background and hourly rate." },
        { title: "Book a slot", desc: "Availability is always up to date. The video room link arrives by email." },
        { title: "Do the interview, read the report", desc: "After the session, your mentor writes point-by-point feedback and an action plan." },
      ],
      mentorTags: ["Valuation", "LBO", "Fit"],
      booking: {
        dateTitle: "Choose a date",
        slotTitle: "Choose a slot",
        periods: ["Morning", "Afternoon", "Evening", "Night"],
      },
      reportTitle: "Report · Case study",
      report: [
        { label: "Structuring", verdict: "Good", good: true },
        { label: "Business sense", verdict: "Excellent", good: true },
        { label: "Synthesis", verdict: "Needs work", good: false },
      ],
      reportAction: "Action plan: synthesis in under a minute, timed.",
    },
    testimonials: {
      title: "What candidates say",
      items: [
        { text: "I found a mentor in minutes. Three sessions later, my technical answers finally held up.", role: "Senior Developer" },
        { text: "The report after each session became my revision sheet. I knew exactly what to work on before the real interview.", role: "Financial Analyst" },
      ],
    },
    mentor: {
      title: "Been there? Become a mentor.",
      subtitle: "Share what you wish you'd known before your own interviews.",
      points: ["You set your rate", "You choose your hours", "Sessions run in the Zeeta video room"],
      cta: "Become a mentor",
      screensLabel: "Screenshots of the mentor area in the Zeeta app",
      screens: ["Mentor session calendar", "Mentor dashboard: this week's earnings", "Candidates looking for a mentor"],
    },
    app: {
      title: "Your sessions on mobile too",
      subtitle: "Join the room from your phone and get a reminder before every interview.",
      qr: "Show QR code",
      screens: [
        { title: "Sign in", desc: "Phone number, Google, Apple or email." },
        { title: "Search", desc: "Filter by category, price, country or availability." },
        { title: "Mentor profile", desc: "Background, reviews, rate and calendar to book." },
        { title: "Your session", desc: "Details, message your mentor, cancel." },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What is Zeeta?", a: "Zeeta connects candidates with finance, consulting and tech professionals for video mock interviews, followed by a written report." },
        { q: "How do I choose a mentor?", a: "After signing up, filter mentors by track, company or availability, check their profile and book a slot." },
        { q: "Are sessions recorded?", a: "Only if both you and the mentor agree. The recording then stays available in your space." },
        { q: "How much does a session cost?", a: "Each mentor sets their hourly rate, shown on their profile before booking. You only pay for the time you book." },
        { q: "What if a session is cancelled?", a: "If the mentor cancels or there's a technical issue, you get a full refund within 48 h." },
      ],
    },
    modal: {
      title: "Get the app",
      subtitle: "Scan the QR code with your phone.",
      close: "Close",
    },
    auth: {
      title: "Log in",
      subtitle: "Get back to your sessions and reports.",
      googleBtn: "Continue with Google",
      appleBtn: "Continue with Apple",
      orDivider: "or",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Password",
      submitBtn: "Log in",
      forgotPassword: "Forgot password?",
      noAccount: "No account yet?",
      signUpLink: "Create an account",
    },
    footer: {
      tagline: "Video mock interviews with the people who hire.",
      tracks: "Tracks",
      product: "Product",
      company: "Company",
      legal: "Legal",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      mentions: "Legal notice",
      copyright: "© 2026 Zeeta. All rights reserved.",
    },
  },
  zh,
  hi,
  es,
  ar,
  pt,
  ru,
};
