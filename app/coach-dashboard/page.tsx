"use client";

import { useState } from "react";
import Link from "next/link";
import MobilePromoModal from "@/components/video-call/MobilePromoModal";

// ─── ICONS ───
const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const StarIconSmall = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#D32F2F" : "none"} stroke="#D32F2F" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Mock students for "pipeline"
const MOCK_STUDENTS = [
  { name: "Hugo Dupont", domain: "Tech / Dev", nextSession: "Aujourd'hui, 11:00", status: "confirmed" as const, avatar: "/avatars/joshua-abraham.png" },
  { name: "Clara Martin", domain: "Finance", nextSession: "Demain, 14:30", status: "pending" as const, avatar: "/avatars/kathryn-murphy.png" },
  { name: "Lucas Bernard", domain: "Consulting", nextSession: "24 Mars, 10:00", status: "confirmed" as const, avatar: "/avatars/joshua-abraham.png" },
];

// Mock reviews
const MOCK_REVIEWS = [
  { name: "Hugo D.", rating: 5, text: "Séance très productive, coach à l'écoute et conseils pertinents.", date: "Il y a 2 jours" },
  { name: "Marie L.", rating: 5, text: "Excellent feedback, j'ai progressé énormément en structuration.", date: "Il y a 5 jours" },
];

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "finances">("finances");
  const [showPromoModal, setShowPromoModal] = useState(false);

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
            <h1 className="text-xl font-bold hidden md:block text-[#D32F2F]">Espace Coach</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Switch to Student Dashboard */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
              title="Basculer vers le Dashboard Élève"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
              <span className="hidden sm:inline">Passer Élève</span>
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
                <p className="text-sm font-semibold">Jean-Pierre Dupont</p>
                <p className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider">Top Coach</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-gray-400">
                <UserIcon />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-[1200px] mx-auto px-6 mt-6">

        {/* ─── WELCOME SECTION ─── */}
        <div className="animate-fadeInUp mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Bonjour Jean-Pierre <span className="inline-block animate-float">👋</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Vendredi 21 Mars 2026 — Vous avez 3 séances cette semaine</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm">
                <div className="w-2 h-2 bg-[#D32F2F] rounded-full"></div>
                <span className="font-bold text-gray-700">8 élèves</span>
                <span className="text-gray-400">actifs</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
                <span className="font-bold text-[#2E7D32]">+12%</span>
                <span className="text-gray-400">ce mois</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SUBSCRIPTION BANNER ─── */}
        <div className="animate-fadeInUp stagger-1 relative w-full rounded-2xl overflow-hidden mb-6 shadow-lg shadow-red-900/10">
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] via-[#B71C1C] to-[#1A1A1A]"
            style={{ backgroundSize: '200% 200%', animation: 'bannerGradient 6s ease infinite' }}
          />
          {/* Sparkles */}
          <div className="absolute top-6 left-[15%] w-1.5 h-1.5 bg-white rounded-full" style={{ animation: 'sparkle 2s ease infinite' }} />
          <div className="absolute top-10 right-[20%] w-1 h-1 bg-white rounded-full" style={{ animation: 'sparkle 2.5s ease infinite 0.5s' }} />
          <div className="absolute bottom-6 left-[35%] w-1 h-1 bg-white/80 rounded-full" style={{ animation: 'sparkle 3s ease infinite 1s' }} />
          <div className="absolute top-8 right-[10%] w-2 h-2 bg-white/50 rounded-full" style={{ animation: 'sparkle 2.2s ease infinite 0.3s' }} />

          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
          <div className="absolute -bottom-20 left-20 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 p-7 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight flex items-center gap-3 flex-wrap">
                Super Mentor
                <span className="text-[10px] bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/20">9,99 € / mois</span>
              </h2>
              <p className="text-white/85 font-medium text-sm sm:text-base leading-relaxed mt-2">
                Boostez vos réservations : bénéficiez d&apos;une <strong>mise en avant prioritaire de votre profil</strong> dans les recherches et obtenez <strong>7 crédits de démarchage téléphonique</strong> par mois pour contacter de nouveaux élèves.
              </p>
            </div>
            <button className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 text-white font-bold text-sm shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/20 hover:border-white/40 transition-all active:scale-[0.97] group shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 group-hover:text-yellow-400 transition-all">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Passer Super Mentor
            </button>
          </div>
        </div>

        {/* ─── KPI CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeInUp stagger-2">
          {/* Revenue */}
          <div className="card-hover bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Revenus du mois</p>
            </div>
            <p className="text-2xl font-black text-gray-900">2,450 €</p>
            <div className="flex items-center gap-1 mt-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
              <span className="text-xs font-bold text-green-600">+12% ce mois-ci</span>
            </div>
            {/* Mini sparkline */}
            <div className="flex items-end gap-1 mt-3 h-6">
              {[40, 55, 35, 65, 50, 75, 60, 85, 70, 90, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-green-100 rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div className="card-hover bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <CalendarIcon />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Séances prévues</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900">8</p>
              <p className="text-sm font-bold text-gray-400">cette semaine</p>
            </div>
            {/* Progress ring */}
            <div className="mt-3 flex items-center gap-3">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#D32F2F" strokeWidth="3" strokeDasharray="88" strokeDashoffset="22" strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-700">75%</span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">6 complétées</span>
            </div>
          </div>

          {/* Rating */}
          <div className="card-hover bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#D32F2F]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Avis moyen</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-black text-gray-900">4.9</p>
              <p className="text-lg font-bold text-gray-300">/5</p>
            </div>
            <div className="flex items-center gap-0.5 mt-2">
              {[1,2,3,4,5].map(s => <StarIconSmall key={s} filled={s <= 5} />)}
              <span className="text-[11px] text-gray-400 font-medium ml-1.5">42 avis</span>
            </div>
          </div>

          {/* Availability CTA */}
          <div className="bg-gradient-to-br from-[#D32F2F] to-[#8B0000] p-5 rounded-2xl shadow-md shadow-red-500/15 text-white flex flex-col justify-between relative overflow-hidden card-hover">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-white/60 uppercase mb-1">Disponibilités</p>
              <p className="text-base font-bold leading-snug">Mettre à jour mon agenda</p>
            </div>
            <button
              onClick={() => setShowPromoModal(true)}
              className="bg-white text-[#D32F2F] w-fit px-4 py-2 rounded-xl text-sm font-bold shadow-sm self-start mt-3 hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <CalendarIcon />
              Gérer l&apos;agenda
            </button>
          </div>
        </div>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ─── LEFT: TABS & CONTENT ─── */}
          <div className="animate-fadeInUp stagger-3">
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 mb-6 w-fit shadow-sm">
              {([
                { key: "upcoming" as const, label: "Mes prochaines séances" },
                { key: "past" as const, label: "Historique" },
                { key: "finances" as const, label: "Finances & Virements" },
              ]).map(tab => (
                <button
                  key={tab.key}
                  className={`py-2 px-5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.key
                      ? "bg-[#D32F2F] text-white shadow-md shadow-red-500/20"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "upcoming" && (
              <div className="animate-fadeIn bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-50 text-[#D32F2F] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune séance prévue</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">Vous n&apos;avez pas de séance programmée avec des élèves pour le moment.</p>
                <button
                  onClick={() => setShowPromoModal(true)}
                  className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-red-500/20 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Gérer mes disponibilités
                </button>
              </div>
            )}

            {activeTab === "past" && (
              <div className="animate-fadeIn bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Historique vide</h3>
                <p className="text-gray-500 text-sm">Les séances passées apparaîtront ici.</p>
              </div>
            )}

            {activeTab === "finances" && (
              <div className="animate-fadeIn flex flex-col gap-6">
                {/* Balance Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-7 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white flex flex-col md:flex-row items-center justify-between gap-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 to-transparent" />
                    <div className="relative z-10">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Solde disponible</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-gray-900 tracking-tight">1,250</span>
                        <span className="text-2xl font-bold text-gray-300">€</span>
                      </div>
                    </div>
                    <button className="relative z-10 w-full md:w-auto bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8B0000] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md shadow-red-500/20 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                      Virement vers compte bancaire
                    </button>
                  </div>

                  <div className="p-7">
                    <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m5 19 5 3 5-3"/></svg>
                      Historique des rentrées d&apos;argent
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 transition-all bg-white hover:bg-green-50/30 group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/></svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Séance stratégique - Jean-Pierre D.</p>
                            <p className="text-xs font-medium text-gray-500">Aujourd&apos;hui, 14:30</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-green-600 text-lg">+ 156 €</p>
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terminé</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 transition-all bg-white hover:bg-green-50/30 group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/></svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Préparation Entretien - Sophie M.</p>
                            <p className="text-xs font-medium text-gray-500">Mercredi, 10:00</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-green-600 text-lg">+ 95 €</p>
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terminé</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3"/><path d="m15 6 6 6-6 6"/></svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Virement bancaire sortant</p>
                            <p className="text-xs font-medium text-gray-500">10 Mars 2026</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-600 text-lg">- 800 €</p>
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Effectué</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next estimated payout */}
                <div className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-green-100/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-green-800/50 uppercase tracking-widest mb-1">Prochain virement estimé</p>
                      <p className="text-2xl font-black text-green-800">~450 €</p>
                      <p className="text-xs text-green-700/70 font-medium mt-1">Prévu le 31 Mars 2026</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="flex flex-col gap-5 animate-slideInRight">
            {/* Student pipeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 text-gray-900 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Mes Élèves Récents
              </h3>
              <div className="space-y-3">
                {MOCK_STUDENTS.map((student, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-gray-900 truncate">{student.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{student.domain} • {student.nextSession}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${student.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-400'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 text-gray-900 mb-3">
                <CalendarIcon /> Mon Calendrier
              </h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white text-center py-2 font-bold text-sm">Mars 2026</div>
                <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400 py-2 border-b border-gray-100">
                  <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                  {[23,24,25,26,27,28].map(d => (
                    <div key={d} className="py-1 text-gray-300 text-xs">{d}</div>
                  ))}
                  <div className="py-1 font-medium text-xs">1</div>
                  {Array.from({length: 31}, (_, i) => i + 2).map((day) => {
                    const isToday = day === 21;
                    const hasSession = day === 22 || day === 24;
                    return (
                      <div key={day} className="py-0.5 flex justify-center">
                        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer
                          ${isToday ? "bg-[#D32F2F] text-white shadow-md shadow-red-500/30 font-bold" : "text-gray-600 hover:bg-red-50 hover:text-[#D32F2F]"}
                          ${hasSession && !isToday ? "border-2 border-[#D32F2F] text-[#D32F2F] font-bold" : ""}
                        `}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 text-gray-900 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Avis Récents
              </h3>
              <div className="space-y-3">
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-bold text-gray-900">{review.name}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= review.rating ? "#D32F2F" : "#e5e7eb"} stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{review.text}</p>
                    <p className="text-[9px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider">{review.date}</p>
                  </div>
                ))}
              </div>
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
