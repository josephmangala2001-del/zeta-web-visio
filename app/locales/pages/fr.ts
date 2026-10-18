import type { PagesCopy } from "../types";

const copy: PagesCopy = {
  about: {
    eyebrow: "À propos",
    title: "On prépare mieux un entretien avec ceux qui les font passer",
    lead: "Zeeta met en relation les candidats avec des professionnels de la banque, du conseil et de la tech pour des simulations d'entretien en visio, suivies d'un compte-rendu écrit.",
    missionTitle: "Pourquoi Zeeta",
    mission: [
      "Les entretiens en banque d'affaires, en conseil ou en tech ont leurs codes. Ils s'apprennent rarement dans un manuel : ils se transmettent par ceux qui sont passés de l'autre côté de la table.",
      "Zeeta rend ce savoir accessible. Chaque candidat peut choisir un mentor de sa filière, s'entraîner dans les conditions du vrai entretien et repartir avec un retour précis sur ce qu'il doit travailler.",
    ],
    stats: { mentors: "mentors vérifiés", tracks: "filières", rate: "tarif horaire des mentors" },
    valuesTitle: "Ce qui nous guide",
    values: [
      { title: "Des mentors qui recrutent", desc: "Chaque mentor est vérifié et travaille, ou a travaillé, dans la filière qu'il enseigne." },
      { title: "Un retour concret", desc: "Après chaque séance, un compte-rendu écrit point par point et un plan d'action." },
      { title: "La transparence", desc: "Le parcours et le tarif de chaque mentor sont affichés avant la réservation." },
    ],
    candidates: { title: "Vous préparez un entretien ?", desc: "Trouvez un mentor de votre filière et réservez une séance.", cta: "Trouver un mentor" },
    mentors: { title: "Vous êtes passé par là ?", desc: "Partagez votre expérience et fixez votre propre tarif.", cta: "Devenir mentor" },
  },
  contact: {
    title: "Contactez-nous",
    lead: "Une question sur une séance, votre profil mentor ou un partenariat ? Écrivez-nous, nous vous répondons par e-mail.",
    emailLabel: "Notre adresse",
    topics: [
      { title: "Candidats", desc: "Réservation, séance, compte-rendu, remboursement." },
      { title: "Mentors", desc: "Profil, vérification, agenda, tarif." },
      { title: "Presse et partenariats", desc: "Écoles, associations, entreprises, médias." },
    ],
    formTitle: "Écrire un message",
    name: "Votre nom",
    email: "Votre e-mail",
    topic: "Sujet",
    message: "Votre message",
    send: "Préparer l'e-mail",
    sendNote: "Le bouton ouvre votre messagerie avec le message déjà rédigé.",
    faqPrompt: "Votre question est peut-être déjà dans la",
    faqLink: "FAQ",
  },
  legal: {
    updated: "Dernière mise à jour :",
    toc: "Sommaire",
    frenchOnly: "",
    draftNote: "Les éléments surlignés sont à compléter avant la mise en ligne.",
  },
};

export default copy;
