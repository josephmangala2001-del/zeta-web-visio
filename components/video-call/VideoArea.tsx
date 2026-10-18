"use client";

import { useState } from "react";
import { DailyVideo } from "@daily-co/daily-react";

interface VideoAreaProps {
  mainParticipantId: string | null;
  localSessionId: string | null;
  duration: string;
  isRecording: boolean;
  isMicMuted: boolean;
  mainParticipantName?: string;
}

export default function VideoArea({
  mainParticipantId,
  localSessionId,
  duration,
  isRecording,
  isMicMuted,
  mainParticipantName = "Adam Joseph",
}: VideoAreaProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const initials = mainParticipantName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex-1 p-3 lg:p-4 overflow-hidden" style={{ backgroundColor: "#111115" }}>
      {/* Video card */}
      <div className="w-full h-full bg-gray-900 rounded-2xl relative overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/5">
        {/* Main video */}
        {mainParticipantId ? (
          <DailyVideo
            sessionId={mainParticipantId}
            type="video"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            <div className="text-center animate-fadeIn">
              <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl font-black">{initials}</span>
              </div>
              <p className="text-white text-[15px] font-bold">{mainParticipantName}</p>
              <div className="flex items-center gap-2 justify-center mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <p className="text-white/40 text-[13px] font-medium">En attente de connexion…</p>
              </div>
            </div>
          </div>
        )}

        {/* Recording / Duration badge — top left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/10">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isRecording ? "bg-red-500 animate-pulse" : "bg-white/30"}`} />
            <span className="text-white text-[13px] font-bold tabular-nums tracking-wide">{duration}</span>
          </div>
          {isRecording && (
            <div className="flex items-center gap-1.5 bg-red-500/20 backdrop-blur-xl rounded-xl px-3 py-2 border border-red-500/30">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">REC</span>
            </div>
          )}
        </div>

        {/* Fullscreen — top right */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all active:scale-95"
          aria-label="Plein écran"
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
              <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          )}
        </button>

        {/* Participant name — bottom left */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xl rounded-xl px-3 py-1.5 border border-white/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-white text-[13px] font-bold">{mainParticipantName}</span>
        </div>

        {/* PiP tile — bottom right */}
        <div className="absolute bottom-4 right-4 w-[200px] lg:w-[240px] aspect-video rounded-xl overflow-hidden border border-white/15 shadow-2xl shadow-black/50 group">
          {localSessionId ? (
            <DailyVideo
              sessionId={localSessionId}
              type="video"
              automirror
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-white/60 text-[12px] font-bold">Moi</span>
            </div>
          )}

          {/* "Me" label + mic status */}
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-0.5">
            <span className="text-white text-[10px] font-bold">Moi</span>
          </div>
          <div className="absolute bottom-1.5 right-1.5">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isMicMuted ? "bg-red-500" : "bg-[#D32F2F]"}`}>
              {isMicMuted ? (
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M3 3l18 18M9 9v3a3 3 0 004.93 2.29" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
