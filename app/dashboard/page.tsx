"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobilePromoModal from "@/components/video-call/MobilePromoModal";

// ─── TYPES ───
type Session = {
  id: string;
  title: string;
  coachName: string;
  date: string;
  time: string;
  status: "future" | "past";
  feedback?: string;
  rating?: number;
  domain?: string;
};

// ─── MOCK DATA ───
const MOCK_SESSIONS: Session[] = [
  {
    id: "test-salle",
    title: "Simulation Entretien Technique",
    coachName: "Adam Joseph",
    date: "Aujourd'hui",
    time: "11:00",
    status: "future",
    domain: "Tech / Dev",
  },
  {
    id: "2",
    title: "Préparation Fit M&A",
    coachName: "Laura Dubois",
    date: "22 Mars 2026",
    time: "14:30",
    status: "future",
    domain: "Finance d'entreprise",
  },
  {
    id: "3",
    title: "Simulation Entretien Sales & Trading",
    coachName: "Marc Vasseur",
    date: "14 Mars 2026",
    time: "18:00",
    status: "past",
    rating: 5,
    domain: "Market Finance / Trading",
    feedback: `**Compte-rendu spécifique - Trading & Marchés**\n\n**1. Compréhension Macro & Marchés (Très bien) 📈**\nExcellente vision sur l'impact des décisions de la FED sur la courbe des taux. L'analyse du trade sur l'EUR/USD était pertinente.\n\n**2. Calcul Mental & Brainteasers (À améliorer) 🧮**\nAttention à la vitesse sous pression. Revois les probabilités conditionnelles (le problème des 2 dés a pris trop de temps). Pratique avec des apps de calcul mental tous les jours.\n\n**3. Fit & Motivation (Excellent) 🤝**\nLe 'Pitch me' est fluide et convaincant. La passion pour les marchés se ressent bien.\n\n**Plan d'action :**\n- Pratiquer 30 minutes de calcul mental par jour.\n- Préparer un "trade pitch" solide sur une action tech pour notre prochaine session.`,
  },
  {
    id: "4",
    title: "Étude de Cas Stratégie",
    coachName: "Sophie Martin",
    date: "02 Mars 2026",
    time: "10:00",
    status: "past",
    rating: 4,
    domain: "Conseil en Stratégie",
    feedback: `**Compte-rendu spécifique - Consulting**\n\n**1. Structuration (Bien) 🗺️**\nL'arbre de rentabilité pour le cas 'Market Entry' était MECE (Exhaustif et Mutuellement Exclusif). Bien joué.\n\n**2. Business Sense (Excellent) 💡**\nTrès bonnes intuitions sur le marché du e-commerce en Asie. Les questions posées étaient pertinentes.\n\n**3. Synthèse (À travailler) 📝**\nLa conclusion (elevator pitch) était un peu trop longue. Souviens-toi de la règle : Recommandation claire d'abord -> 3 arguments -> Risques/Next steps.\n\n**Plan d'action :**\n- S'entraîner à faire des synthèses en moins d'une minute chrono.\n- Lire les rapports McKinsey sur la transition énergétique pour la prochaine session.`,
  },
];

// ─── ICONS (Inline SVG) ───
const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"future" | "past" | "summary">("summary");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const futureSessions = MOCK_SESSIONS.filter((s) => s.status === "future");
  const pastSessions = MOCK_SESSIONS.filter((s) => s.status === "past");

  const toggleReport = (id: string) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans cursor-default pb-10">
      {/* ─── HEADER ROW ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-[80px] flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/">
                <img src="/zeeta-logo.png" alt="Zeeta" className="h-[36px] object-contain cursor-pointer logo-red" />
            </Link>
            <div className="h-6 w-px bg-gray-200 hidden md:block" />
            <h1 className="text-xl font-bold hidden md:block">Espace Étudiant</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Switch to Coach Dashboard */}
            <Link 
              href="/coach-dashboard" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 hover:text-[#D32F2F] hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              title="Basculer vers le Dashboard Coach"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
              <span className="hidden sm:inline">Passer Coach</span>
            </Link>

            {/* Actions: Settings & Notifications */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowPromoModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900" 
                title="Paramètres"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900" title="Notifications">
                <BellIcon />
                <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-[#D32F2F] rounded-full border-2 border-white"></span>
              </button>
            </div>

            {/* Profile Dropdown Simulation */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Hugo Dupont</p>
                <div className="flex items-center gap-1 text-xs text-[#D32F2F] font-bold">
                  <span>Notation: 4.8/5</span>
                  <StarIcon filled={true} />
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="/avatars/joshua-abraham.png" alt="Profil" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 mt-6">

        {/* ─── WELCOME SECTION ─── */}
        <div className="animate-fadeInUp mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Bonjour Hugo <span className="inline-block animate-float">👋</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Vendredi 21 Mars 2026 — Bonne continuation dans ta préparation !</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-bold text-gray-700">6 séances</span>
                <span className="text-gray-400">faites</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span className="font-bold text-gray-700">4h 12min</span>
                <span className="text-gray-400">au total</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SUBSCRIPTION BANNER ─── */}
        <div className="animate-fadeInUp stagger-1 relative w-full rounded-2xl overflow-hidden mb-6 shadow-lg shadow-red-900/10 group">
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] via-[#B71C1C] to-[#1A1A1A]"
            style={{ backgroundSize: '200% 200%', animation: 'bannerGradient 6s ease infinite' }}
          />
          {/* Sparkle particles */}
          <div className="absolute top-6 left-[15%] w-1.5 h-1.5 bg-white rounded-full" style={{ animation: 'sparkle 2s ease infinite' }} />
          <div className="absolute top-12 right-[25%] w-1 h-1 bg-white rounded-full" style={{ animation: 'sparkle 2.5s ease infinite 0.5s' }} />
          <div className="absolute bottom-8 left-[40%] w-1 h-1 bg-white/80 rounded-full" style={{ animation: 'sparkle 3s ease infinite 1s' }} />
          <div className="absolute top-8 right-[10%] w-2 h-2 bg-white/50 rounded-full" style={{ animation: 'sparkle 2.2s ease infinite 0.3s' }} />
          <div className="absolute bottom-4 right-[35%] w-1.5 h-1.5 bg-white/60 rounded-full" style={{ animation: 'sparkle 2.8s ease infinite 0.8s' }} />

          {/* Blur orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 p-7 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight flex items-center gap-3 flex-wrap">
                Recrutement Boost
                <span className="text-[10px] bg-white text-[#D32F2F] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">9,99 € / mois</span>
              </h2>
              <p className="text-white/85 font-medium text-sm sm:text-base leading-relaxed mt-2">
                Gagnez du temps et multipliez vos chances : <strong>envoi automatique de candidatures par IA</strong> sur toutes les offres de votre domaine, et <strong>mise en avant dans le vivier de talents</strong> proposé directement à nos cabinets RH partenaires.
              </p>
            </div>
            <button className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 text-white font-bold text-sm shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/20 hover:border-white/40 hover:shadow-[0_8px_40px_rgba(255,255,255,0.1)] transition-all active:scale-[0.97] group/btn shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:rotate-12 transition-transform">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Passer en Premium
            </button>
          </div>
        </div>

        {/* ─── KPI STAT CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fadeInUp stagger-2">
          {/* Next session */}
          <div className="card-hover bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#D32F2F]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Prochaine séance</p>
            </div>
            <p className="text-xl font-black text-gray-900 mb-1">Aujourd&apos;hui 11:00</p>
            <p className="text-xs font-medium text-gray-500">Simulation Entretien Technique</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-[11px] font-bold text-green-600">Bientôt en live</span>
            </div>
          </div>

          {/* Sessions this month */}
          <div className="card-hover bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <CalendarIcon />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Ce mois-ci</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900">4</p>
              <p className="text-sm font-bold text-gray-400">séances</p>
            </div>
            <div className="mt-3 flex gap-1.5">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 2 ? 'bg-[#D32F2F]' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-[11px] font-medium text-gray-400 mt-1.5">2 complétées • 2 à venir</p>
          </div>

          {/* Progression */}
          <div className="card-hover bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Progression</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900">45%</p>
              <div className="flex items-center gap-1 text-emerald-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
                <span className="text-xs font-bold">+12%</span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#D32F2F] to-[#ef5350] rounded-full" style={{ width: '45%', animation: 'progressFill 1s ease-out' }} />
            </div>
            <p className="text-[11px] font-medium text-gray-400 mt-1.5">Objectif certificat</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* ─── LEFT COLUMN: SESSIONS ─── */}
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Mes Programmes 
              <span className="text-sm bg-gray-100 text-gray-500 py-1 px-3 rounded-full font-medium">1 en cours</span>
            </h2>

            {/* TABS */}
            <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 mb-6 w-fit">
              <button
                className={`py-2 px-6 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "future"
                    ? "bg-white text-[#D32F2F] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("future")}
              >
                Séances à venir
              </button>
              <button
                className={`py-2 px-6 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "past"
                    ? "bg-white text-[#D32F2F] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("past")}
              >
                Historique & Comptes rendus
              </button>
              <button
                className={`py-2 px-6 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "summary"
                    ? "bg-white text-[#D32F2F] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("summary")}
              >
                Résumé de Session
              </button>
            </div>

            {/* SESSIONS LIST */}
            <div className="flex flex-col gap-4">
              {activeTab === "future" && (
                <>
                  {futureSessions.map((session) => (
                    <div key={session.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all hover:shadow-[0_4px_20px_rgba(211,47,47,0.05)] border-l-4 border-l-[#D32F2F]">
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-xl bg-red-50 flex flex-col items-center justify-center text-[#D32F2F] flex-shrink-0">
                          <span className="text-xs font-bold uppercase">{session.date.substring(0, 3)}</span>
                          <span className="text-lg font-black leading-none">{session.time.split(":")[0]}</span>
                        </div>
                        <div>
                          <p className="text-xs text-[#D32F2F] font-bold tracking-wide uppercase mb-1">
                            {session.date} • {session.time} 
                            {session.domain && <span className="ml-2 px-2 py-0.5 bg-red-50 text-[#D32F2F] rounded-md border border-red-100">{session.domain}</span>}
                          </p>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{session.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full overflow-hidden inline-block align-middle">
                                <img src="/avatars/kathryn-murphy.png" alt="Coach" className="object-cover w-full h-full" />
                            </span>
                            Coach: {session.coachName}
                          </p>
                        </div>
                      </div>
                      
                      <Link href={`/room/${session.id}`} className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                          <VideoIcon /> Rejoindre la visio
                        </button>
                      </Link>
                    </div>
                  ))}
                  {futureSessions.length === 0 && <p className="text-gray-500 italic">Aucune séance à venir programmée.</p>}
                </>
              )}

              {activeTab === "past" && (
                <>
                  {pastSessions.map((session) => (
                    <div key={session.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-md">
                      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex gap-4 items-center opacity-80">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                             <CalendarIcon />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold mb-1">
                              {session.date} • {session.time}
                              {session.domain && <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md border border-gray-200">{session.domain}</span>}
                            </p>
                            <h3 className="text-base font-bold text-gray-800">{session.title}</h3>
                            <p className="text-sm text-gray-500">Coach: {session.coachName}</p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => toggleReport(session.id)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          Compte Rendu
                          <ChevronDownIcon className={`transition-transform duration-300 ${expandedReportId === session.id ? "rotate-180" : ""}`} />
                        </button>
                      </div>

                      {/* Expandable Report Content */}
                      {expandedReportId === session.id && (
                        <div className="bg-gray-50 p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                           <div className="flex md:items-center justify-between mb-4 flex-col md:flex-row gap-2">
                             <h4 className="font-bold text-[#D32F2F] text-sm uppercase tracking-wider flex items-center gap-2">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                               Analyse {session.domain ? `- Expertise ${session.domain}` : ''}
                             </h4>
                             {session.rating && (
                               <div className="flex items-center gap-1 text-[#D32F2F]">
                                 <span className="text-sm font-bold mr-1">Note de la séance:</span>
                                 {[1,2,3,4,5].map(star => (
                                    <StarIcon key={star} filled={star <= session.rating!} />
                                 ))}
                               </div>
                             )}
                           </div>
                           
                           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                             {session.feedback ? (
                               <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                                 {session.feedback.split('\n\n').map((paragraph, idx) => {
                                   if (paragraph.startsWith('**')) {
                                     const parts = paragraph.split('**');
                                     const titleInfo = parts[1] || ''; // '1. Compréhension Macro & Marchés (Très bien) 📈'
                                     const content = parts.slice(2).join('').trim();
                                     
                                     // Check if it's the Plan d'action
                                     if (titleInfo.includes("Plan d'action")) {
                                       return (
                                         <div key={idx} className="bg-red-50 p-4 rounded-lg border border-red-100 mt-6">
                                            <h5 className="font-bold text-[#D32F2F] mb-2">{titleInfo}</h5>
                                            <div className="space-y-1">
                                              {content.split('- ').filter(Boolean).map((item, i) => (
                                                <div key={i} className="flex gap-2">
                                                  <span className="text-[#D32F2F] mt-0.5">•</span>
                                                  <p className="text-gray-800">{item.trim()}</p>
                                                </div>
                                              ))}
                                            </div>
                                         </div>
                                       );
                                     }

                                     return (
                                       <div key={idx} className="mb-4">
                                          <h5 className="font-bold text-gray-900 mb-1">{titleInfo}</h5>
                                          <p className="text-gray-600">{content}</p>
                                       </div>
                                     );
                                   }
                                   return <p key={idx}>{paragraph}</p>;
                                 })}
                               </div>
                             ) : (
                               <p className="text-gray-500 italic text-center py-4">Aucun compte rendu disponible pour cette séance.</p>
                             )}
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {pastSessions.length === 0 && <p className="text-gray-500 italic">Aucune séance passée.</p>}
                </>
              )}

              {/* RÉSUMÉ DE SESSION UI (REFERENCE IMAGE) */}
              {activeTab === "summary" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  {/* Header */}
                  <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                    <div>
                      <h2 className="text-[26px] font-black text-gray-900 mb-1 leading-tight">ZEETA - Résumé de Session</h2>
                      <p className="text-[13px] text-gray-500 max-w-2xl leading-relaxed">
                        Consultation stratégique avec M. Dupont terminée. Retrouvez ici tous les détails de votre échange, les documents partagés et les prochaines étapes.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-blue-200 text-[#0F3596] hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download Invoice
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0F3596] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/20">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        Schedule Next Call
                      </button>
                    </div>
                  </div>

                  {/* Top Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr] gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Temps passé</p>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-4xl font-black text-gray-900 tracking-tight">42</span>
                        <span className="text-sm font-bold text-gray-500">min</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0F3596] w-[70%]"></div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Coût total</p>
                      <div className="flex items-baseline gap-1.5 mb-1.5">
                        <span className="text-4xl font-black text-[#2E7D32] tracking-tight">156</span>
                        <span className="text-lg font-bold text-[#2E7D32]">€</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold tracking-wide">TVA incluse (20%)</p>
                    </div>
                    
                    <div className="bg-[#E8EAF6] rounded-2xl p-6 border border-indigo-50 relative overflow-hidden flex flex-col justify-center shadow-inner">
                      <div className="absolute -bottom-6 -right-6 text-[#C5CAE9] opacity-40">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <p className="text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest mb-4 relative z-10">Participant principal</p>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/60 shadow-md flex-shrink-0">
                           <img src="/avatars/joshua-abraham.png" className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-indigo-950 mb-0.5">Jean-Pierre Dupont</p>
                          <p className="text-[11px] text-indigo-700 font-bold">Expert en stratégie digitale</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Transcript Row */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 sm:p-9 relative">
                     <div className="flex flex-wrap items-center justify-between mb-8 pb-5 border-b border-gray-100 gap-4">
                        <h3 className="text-[17px] font-black flex items-center gap-2.5 text-gray-900">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F3596" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8l-6-6z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/></svg>
                          Résumé de la Transcription
                        </h3>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-1.5 rounded-md">Généré par IA</span>
                     </div>
                     <p className="text-[13px] text-gray-700 font-bold mb-6">Les points clés abordés lors de la session :</p>
                     
                     <div className="space-y-5 mb-8 pl-1">
                       <div className="flex gap-4 items-start">
                         <span className="text-[15px] font-black text-[#0F3596] shrink-0 mt-0.5">01.</span>
                         <p className="text-[13px] text-gray-600 font-medium leading-[1.6]">Analyse de l'écosystème actuel et identification des goulots d'étranglement opérationnels dans le tunnel de conversion.</p>
                       </div>
                       <div className="flex gap-4 items-start">
                         <span className="text-[15px] font-black text-[#0F3596] shrink-0 mt-0.5">02.</span>
                         <p className="text-[13px] text-gray-600 font-medium leading-[1.6]">Recommandation sur l'adoption de nouveaux outils d'automatisation pour réduire le temps de traitement manuel de 30%.</p>
                       </div>
                       <div className="flex gap-4 items-start">
                         <span className="text-[15px] font-black text-[#0F3596] shrink-0 mt-0.5">03.</span>
                         <p className="text-[13px] text-gray-600 font-medium leading-[1.6]">Définition des indicateurs de performance (KPI) pour le prochain trimestre, avec un focus sur la rétention client.</p>
                       </div>
                     </div>
                     
                     <div className="bg-gray-50 border-l-[3px] border-[#0F3596] p-5 sm:p-6 rounded-r-2xl">
                       <p className="text-[13px] text-gray-700 italic font-semibold leading-relaxed">
                         "La priorité absolue pour les deux prochaines semaines est la migration des données CRM vers la nouvelle instance sécurisée."
                       </p>
                     </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Documents Partagés */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 sm:p-8">
                      <h3 className="text-[17px] font-black flex items-center gap-2.5 text-gray-900 mb-7">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F3596" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        Documents Partagés
                      </h3>
                      <div className="space-y-2">
                        {/* Doc 1 */}
                        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-red-50 text-red-500 rounded-xl flex items-center justify-center font-black text-[10px] tracking-wide border border-red-100/50">PDF</div>
                            <div>
                              <p className="text-[13px] font-black text-gray-900 mb-1">Curriculum_Vitae_Expert.pdf</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">2.4 MB • Modifié Hier</p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-[#0F3596] p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </button>
                        </div>
                        {/* Doc 2 */}
                        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-black text-[10px] tracking-wide border border-blue-100/50">DOCX</div>
                            <div>
                              <p className="text-[13px] font-black text-gray-900 mb-1">Plan_Action_Strategique.docx</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">1.1 MB • Modifié Aujourd'hui</p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-[#0F3596] p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </button>
                        </div>
                        {/* Doc 3 */}
                        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-[10px] tracking-wide border border-emerald-100/50">XLSX</div>
                            <div>
                              <p className="text-[13px] font-black text-gray-900 mb-1">Previsions_Financieres_Q3.xlsx</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">4.8 MB • Modifié Aujourd'hui</p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-[#0F3596] p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Votre avis compte */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 sm:p-9 flex flex-col h-full">
                      <h3 className="text-[17px] font-black text-gray-900 mb-2">Votre avis compte</h3>
                      <p className="text-[13px] text-gray-500 font-medium mb-7">Évaluez la qualité de cet échange pour nous aider à améliorer nos services.</p>
                      
                      <div className="flex gap-2.5 mb-7">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-500 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          </button>
                        ))}
                      </div>

                      <textarea 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-[13px] font-medium resize-none flex-grow min-h-[100px] outline-none focus:ring-2 focus:ring-[#0F3596]/20 transition-all text-gray-700 placeholder:text-gray-400 mb-5"
                        placeholder="Un commentaire additionnel ?"
                      ></textarea>

                      <button className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 rounded-xl font-bold text-[13px] transition-all shadow-md mt-auto">
                        Envoyer l'évaluation
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </section>
        </div>

        {/* ─── RIGHT COLUMN: CALENDAR & WIDGETS ─── */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CalendarIcon />
                  Mon Calendrier
                </h3>
             </div>
             
             {/* Mini Calendar UI Mockup */}
             <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-[#D32F2F] text-white text-center py-2 font-bold text-sm">Mars 2026</div>
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 py-3 border-b border-gray-100">
                  <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                  {/* Empty slots for spacing */}
                  <div className="py-2 text-gray-300">23</div>
                  <div className="py-2 text-gray-300">24</div>
                  <div className="py-2 text-gray-300">25</div>
                  <div className="py-2 text-gray-300">26</div>
                  <div className="py-2 text-gray-300">27</div>
                  <div className="py-2 text-gray-300">28</div>
                  <div className="py-2 font-medium">1</div>
                  
                  {/* Actual dates */}
                  {Array.from({length: 31}, (_, i) => i + 2).map((day) => {
                     // Check if day is "Aujourd'hui" (assume it's the 14th)
                     const isToday = day === 14;
                     const hasSession = day === 22 || day === 10;
                     
                     return (
                      <div key={day} className="py-2 flex justify-center">
                         <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                           ${isToday ? "bg-[#D32F2F] text-white shadow-md" : "text-gray-700 hover:bg-red-50"}
                           ${hasSession && !isToday ? "border border-[#D32F2F] text-[#D32F2F]" : ""}
                         `}>
                           {day}
                         </span>
                      </div>
                     )
                  })}
                </div>
             </div>
             <p className="text-xs text-gray-400 mt-4 text-center">Les dates entourées indiquent une séance prévue.</p>
          </div>

          <div className="bg-gradient-to-br from-[#D32F2F] to-[#8B0000] rounded-2xl p-5 text-white shadow-lg shadow-red-900/15 relative overflow-hidden">
             <div className="absolute -right-4 -top-8 opacity-10">
                <TargetIcon />
             </div>
             <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">🎯 Objectif Zeeta</h3>
             <p className="text-xs text-red-100 mb-4 opacity-90 leading-relaxed">Continuez vos séances pour débloquer votre certificat de complétion.</p>
             <div className="w-full bg-black/20 rounded-full h-2 mb-1.5 overflow-hidden">
                 <div className="bg-white h-2 rounded-full" style={{ width: '45%', animation: 'progressFill 1.5s ease-out' }}></div>
             </div>
             <p className="text-[11px] font-bold text-right text-red-100">45% complété</p>
          </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 text-gray-900 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                Badges & Récompenses
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { emoji: "🚀", label: "Première séance", unlocked: true },
                  { emoji: "🔥", label: "3 séances", unlocked: true },
                  { emoji: "💎", label: "10 séances", unlocked: false },
                ].map((badge, i) => (
                  <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    badge.unlocked
                      ? 'bg-red-50/50 border-red-100 hover:shadow-sm'
                      : 'bg-gray-50 border-gray-100 opacity-40 grayscale'
                  }`}>
                    <span className="text-2xl">{badge.emoji}</span>
                    <span className="text-[9px] font-bold text-gray-600 text-center leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip of the day */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100/50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <h3 className="font-bold text-sm text-amber-900">Astuce du jour</h3>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Préparez toujours 2-3 questions pertinentes à poser à la fin de votre simulation d&apos;entretien. Cela montre votre curiosité et votre engagement.
              </p>
            </div>
        </div>

        </div>
      </main>
      
      {/* Modals */}
      <MobilePromoModal 
        isOpen={showPromoModal} 
        onClose={() => setShowPromoModal(false)} 
        title="Connectez vous sur Zeeta pour plus d'infos"
      />
    </div>
  );
}

// ─── EXTRA SVG ───
const TargetIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);
