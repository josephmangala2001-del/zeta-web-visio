"use client";

import { useState, useEffect, useRef } from "react";
import { useDaily, useDevices, useLocalSessionId, useParticipantProperty, useDailyEvent } from "@daily-co/daily-react";

interface WaitingRoomProps {
  roomUrl: string;
  onJoin: () => void;
}

// Composant pour afficher la vidéo en pré-join
const CameraPreview = () => {
  const localSessionId = useLocalSessionId();
  const videoTrack = useParticipantProperty(localSessionId || "", "tracks.video.persistentTrack");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      videoRef.current.srcObject = new MediaStream([videoTrack]);
    }
  }, [videoTrack]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-2xl shadow-black/20 ring-1 ring-white/10">
      {/* Badge statut */}
      <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-xl text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 tracking-wider uppercase">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Aperçu caméra
      </div>

      {videoTrack ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L22 7v10"/>
              <line x1="1" x2="23" y1="1" y2="23"/>
            </svg>
          </div>
          <p className="text-white/40 text-sm font-medium">Caméra désactivée</p>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default function WaitingRoom({ roomUrl, onJoin }: WaitingRoomProps) {
  const callObject = useDaily();
  const { currentCam, currentMic, currentSpeaker, setCamera, setMicrophone, setSpeaker, cameras, microphones, speakers } = useDevices();
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  const participantCount = 1;

  useEffect(() => {
    if (!callObject || callObject.isDestroyed()) return;
    callObject.startCamera({ url: roomUrl }).catch(console.error);
    return () => {
      if (callObject && !callObject.isDestroyed()) {
        try {
          callObject.setLocalVideo(false);
          callObject.setLocalAudio(false);
        } catch (e) {
          console.error("Erreur lors du nettoyage pré-join", e);
        }
      }
    };
  }, [callObject, roomUrl]);

  const toggleCamera = () => {
    if (!callObject) return;
    const newState = !isCamEnabled;
    callObject.setLocalVideo(newState);
    setIsCamEnabled(newState);
  };

  const toggleMic = () => {
    if (!callObject) return;
    const newState = !isMicEnabled;
    callObject.setLocalAudio(newState);
    setIsMicEnabled(newState);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#D32F2F]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#D32F2F]/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 relative z-10 animate-fadeInUp">

        {/* ─── LEFT: Camera Preview & Controls ─── */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <CameraPreview />

            {/* Controls overlaid on video */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              <button
                onClick={toggleCamera}
                className={`w-12 h-12 rounded-xl backdrop-blur-xl flex items-center justify-center transition-all border ${
                  isCamEnabled
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    : 'bg-red-500/90 border-red-500 text-white hover:bg-red-600'
                } active:scale-95 shadow-lg shadow-black/20`}
              >
                {isCamEnabled ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L22 7v10"/><line x1="1" x2="23" y1="1" y2="23"/></svg>
                )}
              </button>
              <button
                onClick={toggleMic}
                className={`w-12 h-12 rounded-xl backdrop-blur-xl flex items-center justify-center transition-all border ${
                  isMicEnabled
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    : 'bg-red-500/90 border-red-500 text-white hover:bg-red-600'
                } active:scale-95 shadow-lg shadow-black/20`}
              >
                {isMicEnabled ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                )}
              </button>
              <button
                className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg shadow-black/20"
                title="Paramètres de l'appareil"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
            </div>
          </div>

          {/* Mic Level Bar */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D32F2F]/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              </div>
              <span className="text-[10px] font-black text-white/40 tracking-[0.15em] uppercase">Test Micro</span>
              <div className="flex gap-1 ml-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`w-5 h-1.5 rounded-full transition-all ${i < 3 ? 'bg-[#D32F2F]' : 'bg-white/10'}`}></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black text-green-400 tracking-wider uppercase">Actif</span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Meeting Info & Join ─── */}
        <div className="flex flex-col justify-center gap-5">

          {/* Logo + Title */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/zeeta-logo.png" alt="Zeeta" className="h-8 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Salle d&apos;attente</h1>
            <p className="text-white/50 font-medium text-sm">
              Séance de Coaching en visio • <span className="text-[#D32F2F] font-bold">Session ZC-2026</span>
            </p>
          </div>

          {/* Online participants */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-white/40 tracking-[0.15em] uppercase">Déjà en ligne ({participantCount})</span>
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-[10px] font-black px-3 py-1 rounded-lg border border-green-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
                </span>
                LIVE
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img src="/avatars/joshua-abraham.png" alt="Coach" className="w-11 h-11 rounded-full object-cover border-2 border-white/20 shadow-lg" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0F] rounded-full"></div>
              </div>
              <div>
                <p className="text-white text-sm font-bold">Adam Joseph</p>
                <p className="text-white/40 text-xs font-medium">Coach • En attente</p>
              </div>
            </div>

            <p className="text-sm text-white/30 italic font-medium flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              &ldquo;Le coach vous attend.&rdquo;
            </p>
          </div>

          {/* Join Button */}
          <button
            onClick={onJoin}
            className="w-full bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8B0000] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-xl shadow-red-900/30 animate-pulseGlow"
          >
            Rejoindre la réunion
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

          {/* Room Link */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 text-white/40 truncate max-w-[70%]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span className="text-xs font-medium truncate text-white/30">{roomUrl}</span>
            </div>
            <button className="text-xs font-bold text-[#D32F2F] hover:text-red-400 whitespace-nowrap transition-colors">Copier le lien</button>
          </div>

          {/* Device Info */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-white/15 transition-all">
              <p className="text-[9px] font-black text-white/25 uppercase tracking-[0.15em] mb-1">Haut-parleurs</p>
              <p className="text-[11px] font-bold text-white/60 truncate">{currentSpeaker?.device.label || "Par défaut"}</p>
            </div>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-white/15 transition-all">
              <p className="text-[9px] font-black text-white/25 uppercase tracking-[0.15em] mb-1">Caméra</p>
              <p className="text-[11px] font-bold text-white/60 truncate">{currentCam?.device.label || "Par défaut"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
