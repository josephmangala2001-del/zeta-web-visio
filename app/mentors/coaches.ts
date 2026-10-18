/* Coachs de l'app Zeeta — mêmes données que le seed Supabase de l'app mobile
   (zetaaa/supabase/seed/demo_seed.sql). Photos Unsplash, logos via l'API favicon
   de Google comme le composant CompanyLogo de l'app. */

export type FiliereId = "ma" | "trading" | "consulting" | "tech" | "pe" | "audit";

export const filiereOrder: FiliereId[] = ["ma", "trading", "consulting", "tech", "pe", "audit"];

export type Experience = { company: string; domain?: string; role: string; start: string; end: string };

export type Coach = {
  n: number;
  name: string;
  photo: string;
  title: string;
  category: string;
  price: number;
  city: string;
  country: string;
  specialties: string[];
  bio: string;
  rating: number;
  reviews: number;
  experiences: Experience[];
  school: string;
  filieres: FiliereId[];
};

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&crop=faces&q=80`;

const xp = (company: string, domain: string | undefined, role: string, prev: string, prevDomain: string | undefined, prevRole: string): Experience[] => [
  { company, domain, role, start: "Sept 2023", end: "Aujourd'hui" },
  { company: prev, domain: prevDomain, role: prevRole, start: "Sept 2020", end: "Août 2023" },
];

export const coaches: Coach[] = [
  {
    n: 1, name: "Camille Laurent", photo: photo("1627161683077-e34782c24d81"), title: "Associate M&A", category: "Investment Banking",
    price: 70, city: "Paris", country: "France", specialties: ["Simulation d'entretien", "Revue CV", "Technicals M&A"],
    bio: "Associate M&A depuis 4 ans, j'ai fait passer plus de 60 entretiens côté banque. Je t'aide à maîtriser les technicals et à raconter ton parcours avec impact.",
    rating: 4.9, reviews: 47, experiences: xp("Rothschild & Co", "rothschildandco.com", "Associate M&A", "Lazard", "lazard.com", "Analyst M&A"),
    school: "HEC Paris", filieres: ["ma", "pe"],
  },
  {
    n: 2, name: "Thomas Nguyen", photo: photo("1560250097-0b93528c311a"), title: "Quant Researcher", category: "Quant",
    price: 80, city: "Paris", country: "France", specialties: ["Brainteasers", "Stochastic calculus", "Simulation d'entretien"],
    bio: "Docteur en maths appliquées, je prépare aux entretiens quant : probas, brainteasers, C++/Python et pricing.",
    rating: 4.8, reviews: 31, experiences: xp("Société Générale CIB", "societegenerale.com", "Quant Researcher", "Natixis", "cib.natixis.com", "Quant Analyst"),
    school: "École Polytechnique", filieres: ["trading"],
  },
  {
    n: 3, name: "Sofia Martins", photo: photo("1573497019940-1c28c88b4f3e"), title: "Senior Auditor", category: "Big 4",
    price: 40, city: "Lyon", country: "France", specialties: ["Revue CV", "Simulation d'entretien", "Tests en ligne"],
    bio: "Senior en audit financier, j'accompagne les candidats aux stages et CDI en Big 4 : fit, tests et cas pratiques.",
    rating: 4.7, reviews: 58, experiences: xp("Deloitte", "deloitte.com", "Senior Auditor", "KPMG", "kpmg.com", "Junior Auditor"),
    school: "EM Lyon", filieres: ["audit"],
  },
  {
    n: 4, name: "Aïcha Diallo", photo: photo("1573496358961-3c82861ab8f4"), title: "Consultante Senior", category: "MBB",
    price: 90, city: "Paris", country: "France", specialties: ["Case interview", "Fit interview", "Market sizing"],
    bio: "Ex-candidate devenue intervieweuse chez McKinsey. Je fais des cases au format MBB avec un debrief précis après chaque session.",
    rating: 5.0, reviews: 64, experiences: xp("McKinsey & Company", "mckinsey.de", "Consultante Senior", "Roland Berger", "rolandberger.com", "Business Analyst"),
    school: "ESSEC Business School", filieres: ["consulting"],
  },
  {
    n: 5, name: "Léa Moreau", photo: photo("1494790108377-be9c29b29330"), title: "Senior Product Manager", category: "Product Manager",
    price: 50, city: "Paris", country: "France", specialties: ["Product case", "Portfolio", "Simulation d'entretien"],
    bio: "PM depuis 6 ans en scale-up. Je t'entraîne aux product cases, aux questions de priorisation et à la présentation de ton portfolio.",
    rating: 4.8, reviews: 39, experiences: xp("Doctolib", "doctolib.fr", "Senior Product Manager", "BlaBlaCar", "blablacar.fr", "Product Owner"),
    school: "CentraleSupélec", filieres: ["tech"],
  },
  {
    n: 6, name: "Grace Mensah", photo: photo("1573497161161-c3e73707e25c"), title: "Lead Data Scientist", category: "Data Scientist",
    price: 60, city: "Londres", country: "Royaume-Uni", specialties: ["ML interview", "SQL & Python", "Revue CV"],
    bio: "Lead DS, je prépare aux entretiens techniques data : ML, statistiques, SQL et études de cas business.",
    rating: 4.9, reviews: 28, experiences: xp("Criteo", "criteo.com", "Lead Data Scientist", "Deezer", "deezer.com", "Data Scientist"),
    school: "Télécom Paris", filieres: ["tech"],
  },
  {
    n: 7, name: "Moussa Koné", photo: photo("1642257859842-c95f9fa8121d"), title: "Investment Associate", category: "Private Equity",
    price: 75, city: "Paris", country: "France", specialties: ["LBO modeling", "Case study PE", "Simulation d'entretien"],
    bio: "Associate en buyout mid-cap, je t'entraîne aux LBO papier, aux case studies et aux questions deal.",
    rating: 4.9, reviews: 42, experiences: xp("Ardian", "ardian.com", "Investment Associate", "Goldman Sachs", "goldmansachs.com", "Analyst M&A"),
    school: "ESCP Business School", filieres: ["pe", "ma"],
  },
  {
    n: 8, name: "Julien Bernard", photo: photo("1652471943570-f3590a4e52ed"), title: "Equity Trader", category: "Sales & Trading",
    price: 65, city: "Londres", country: "Royaume-Uni", specialties: ["Market views", "Simulation d'entretien", "Calcul mental"],
    bio: "Trader actions à Londres. On travaille ton pitch de marché, le calcul mental et les questions de trading floor.",
    rating: 4.6, reviews: 35, experiences: xp("BNP Paribas", "bnpparibas.com", "Equity Trader", "Société Générale", "societegenerale.com", "Sales Assistant"),
    school: "Université Paris-Dauphine", filieres: ["trading"],
  },
  {
    n: 9, name: "Claire Dubois", photo: photo("1685760259914-ee8d2c92d2e0"), title: "Gérante de portefeuille", category: "Asset Management",
    price: 60, city: "Paris", country: "France", specialties: ["Stock pitch", "Revue CV", "Simulation d'entretien"],
    bio: "Gérante actions européennes. Je t'aide à construire un stock pitch solide et à décrocher ton stage en AM.",
    rating: 4.7, reviews: 26, experiences: xp("Amundi", "amundi.com", "Gérante de portefeuille", "Carmignac", "carmignac.com", "Analyste buy-side"),
    school: "SKEMA Business School", filieres: ["trading"],
  },
  {
    n: 10, name: "Inès Haddad", photo: photo("1701096374092-bb70915fdc5c"), title: "Consultante", category: "Case Interviews",
    price: 85, city: "Genève", country: "Suisse", specialties: ["Case interview", "Fit interview", "Structuration"],
    bio: "Consultante BCG, j'ai coaché plus de 100 candidats. Cases intensifs, feedback actionnable, méthode claire.",
    rating: 4.9, reviews: 71, experiences: xp("Boston Consulting Group", "bcg.com", "Consultante", "Oliver Wyman", "oliverwyman.com", "Stagiaire stratégie"),
    school: "HEC Lausanne", filieres: ["consulting"],
  },
  {
    n: 12, name: "Karim Benali", photo: photo("1600878459138-e1123b37cb30"), title: "Senior Software Engineer", category: "Software Engineer",
    price: 70, city: "Zurich", country: "Suisse", specialties: ["Algorithmes", "System design", "Mock interview"],
    bio: "Ingénieur chez Google Zurich. Mock interviews LeetCode, system design et préparation au process FAANG.",
    rating: 4.8, reviews: 49, experiences: xp("Google", "google.com", "Senior Software Engineer", "Datadog", "datadoghq.com", "Software Engineer"),
    school: "EPITA", filieres: ["tech"],
  },
  {
    n: 13, name: "Fatou Ndiaye", photo: photo("1573497491765-dccce02b29df"), title: "Risk Manager", category: "Risk Management",
    price: 45, city: "Paris", country: "France", specialties: ["Market risk", "Revue CV", "Simulation d'entretien"],
    bio: "Risk manager marché, je prépare aux entretiens risk : VaR, Grecques, réglementation et fit.",
    rating: 4.6, reviews: 22, experiences: xp("Natixis CIB", "cib.natixis.com", "Risk Manager", "Crédit Agricole CIB", "ca-cib.com", "Analyste risques"),
    school: "Université Paris 1 Panthéon-Sorbonne", filieres: ["trading"],
  },
  {
    n: 14, name: "Yasmine El Amrani", photo: photo("1609371497456-3a55a205d5eb"), title: "Investment Associate", category: "Venture Capital",
    price: 60, city: "Paris", country: "France", specialties: ["Investment memo", "Startup case", "Networking VC"],
    bio: "Associate VC early-stage. Je t'aide à écrire un investment memo, analyser une startup et percer dans le VC.",
    rating: 4.8, reviews: 19, experiences: xp("Partech", "partechpartners.com", "Investment Associate", "Bpifrance", "bpifrance.com", "Analyste"),
    school: "ESSEC Business School", filieres: ["pe"],
  },
  {
    n: 15, name: "Antoine Lefèvre", photo: photo("1568316674077-d72ee56de61c"), title: "Manager Transaction Services", category: "Transaction Services",
    price: 55, city: "Luxembourg", country: "Luxembourg", specialties: ["Due diligence", "Cas pratique TS", "Revue CV"],
    bio: "Manager TS, je recrute des stagiaires chaque saison. Je t'entraîne aux cas pratiques Excel et aux questions de due diligence.",
    rating: 4.7, reviews: 33, experiences: xp("EY", "ey.com", "Manager Transaction Services", "PwC", "pwc.com", "Senior Consultant"),
    school: "NEOMA Business School", filieres: ["audit", "ma"],
  },
  {
    n: 16, name: "Samuel Okafor", photo: photo("1580411363668-4b59002b6962"), title: "VP Structuration", category: "Structuration",
    price: 95, city: "Londres", country: "Royaume-Uni", specialties: ["Produits structurés", "Pricing", "Simulation d'entretien"],
    bio: "VP structuration taux & crédit. Je prépare aux entretiens desk : produits dérivés, pricing et questions techniques.",
    rating: 4.9, reviews: 37, experiences: xp("J.P. Morgan", "jpmorgan.com", "VP Structuration", "Barclays", "barclays.com", "Associate Structurer"),
    school: "Imperial College London", filieres: ["trading"],
  },
  {
    n: 17, name: "Hugo Petit", photo: photo("1549473448-b0acc73629dc"), title: "Fondateur & CEO", category: "Levée de Fonds",
    price: 65, city: "Nantes", country: "France", specialties: ["Pitch deck", "Levée de fonds", "Business plan"],
    bio: "J'ai levé 3 M€ en seed. Je relis ton pitch deck, je joue l'investisseur et on prépare ta levée pas à pas.",
    rating: 4.7, reviews: 24, experiences: xp("Fintech Seed (3 M€ levés)", undefined, "Fondateur & CEO", "Qonto", "qonto.com", "Business Developer"),
    school: "Audencia", filieres: ["tech"],
  },
  {
    n: 18, name: "Jean-Marc Ekotto", photo: photo("1580411402629-e0cdf76f3d3b"), title: "Directeur Conseil Opérationnel", category: "Conseil Opérationnel",
    price: 70, city: "Montréal", country: "Canada", specialties: ["Case interview", "Leadership", "Simulation d'entretien"],
    bio: "Directeur chez Accenture Montréal, 12 ans de conseil. Cases opérationnels, fit et préparation aux entretiens partner.",
    rating: 4.8, reviews: 44, experiences: xp("Accenture", "accenture.com", "Directeur Conseil Opérationnel", "Capgemini Invent", "capgemini.com", "Senior Manager"),
    school: "HEC Montréal", filieres: ["consulting"],
  },
  {
    n: 19, name: "Maxime Roux", photo: photo("1559718062-361155fad299"), title: "Equity Research Analyst", category: "Equity Research",
    price: 50, city: "Paris", country: "France", specialties: ["Modélisation financière", "Stock pitch", "Simulation d'entretien"],
    bio: "Analyste sell-side sur le secteur luxe. Modélisation, valorisation et pitch : je t'entraîne comme en vrai.",
    rating: 4.6, reviews: 29, experiences: xp("Exane BNP Paribas", undefined, "Equity Research Analyst", "Oddo BHF", undefined, "Junior Analyst"),
    school: "Grenoble École de Management", filieres: ["trading", "ma"],
  },
];

/* Même règle que le seed de l'app : 14 prochains jours, ~1 jour sur 4 off, 3 à 5 créneaux d'1 h. */
export function coachSlots(n: number, from = new Date()): { date: Date; times: string[] }[] {
  const days: { date: Date; times: string[] }[] = [];
  for (let i = 1; i <= 14; i++) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const key = n + date.getDate();
    if (key % 4 === 0) continue;
    const times =
      key % 3 === 0 ? ["08:00", "09:00", "12:30", "18:00", "19:00"]
      : key % 3 === 1 ? ["10:00", "11:00", "17:00", "20:00"]
      : ["09:30", "14:00", "18:30"];
    days.push({ date, times });
  }
  return days;
}
