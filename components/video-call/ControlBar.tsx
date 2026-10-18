"use client";

import { useRouter } from "next/navigation";

interface ControlBarProps {
  isMicMuted: boolean;
  isCameraMuted: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isChatOpen: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
}

export default function ControlBar({
  isMicMuted,
  isCameraMuted,
  isScreenSharing,
  isRecording,
  isChatOpen,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecording,
  onToggleChat,
  onEndCall,
}: ControlBarProps) {
  const router = useRouter();

  return (
    <div
      className="h-[72px] flex-shrink-0 flex items-center px-5 relative"
      style={{
        backgroundColor: "#1A1A1F",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 mr-3"
        aria-label="Retour au dashboard"
        title="Retour au dashboard"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Center controls */}
      <div className="flex-1 flex items-center justify-center gap-2">
        {/* Mic */}
        <ControlButton
          onClick={onToggleMic}
          active={!isMicMuted}
          label={isMicMuted ? "Activer le micro" : "Couper le micro"}
          activeColor="#D32F2F"
          inactiveColor="rgba(255,255,255,0.08)"
          activeBg={!isMicMuted}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M12 19v4M8 23h8" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </ControlButton>

        {/* Camera */}
        <ControlButton
          onClick={onToggleCamera}
          active={!isCameraMuted}
          label={isCameraMuted ? "Activer la caméra" : "Couper la caméra"}
          activeColor="#D32F2F"
          inactiveColor="rgba(255,255,255,0.08)"
          activeBg={!isCameraMuted}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
        </ControlButton>

        {/* Screen share */}
        <ControlButton
          onClick={onToggleScreenShare}
          active={isScreenSharing}
          label={isScreenSharing ? "Arrêter le partage" : "Partager l'écran"}
          activeColor="#D32F2F"
          inactiveColor="rgba(255,255,255,0.08)"
          activeBg={isScreenSharing}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </ControlButton>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Record */}
        <ControlButton
          onClick={onToggleRecording}
          active={isRecording}
          label={isRecording ? "Arrêter l'enregistrement" : "Enregistrer"}
          activeColor="#D32F2F"
          inactiveColor="rgba(255,255,255,0.08)"
          activeBg={isRecording}
          size="lg"
        >
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]">
              <circle cx="12" cy="12" r={isRecording ? 5 : 8} />
            </svg>
            {isRecording && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </ControlButton>

        {/* Chat */}
        <ControlButton
          onClick={onToggleChat}
          active={isChatOpen}
          label="Chat"
          activeColor="#D32F2F"
          inactiveColor="rgba(255,255,255,0.08)"
          activeBg={isChatOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </ControlButton>

        {/* More */}
        <ControlButton
          onClick={() => {}}
          active={false}
          label="Plus d'options"
          activeColor="#64748b"
          inactiveColor="rgba(255,255,255,0.08)"
          activeBg={false}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]" opacity="0.6">
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        </ControlButton>
      </div>

      {/* End Call */}
      <button
        onClick={onEndCall}
        className="flex-shrink-0 px-5 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-900/30 flex items-center gap-2"
        style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)" }}
        aria-label="Terminer l'appel"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/>
          <line x1="1" x2="23" y1="1" y2="23"/>
        </svg>
        Terminer
      </button>
    </div>
  );
}

/* ─── Reusable control button ─── */
function ControlButton({
  onClick,
  active,
  label,
  activeColor,
  inactiveColor,
  activeBg,
  size = "md",
  children,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  activeColor: string;
  inactiveColor: string;
  activeBg: boolean;
  size?: "md" | "lg";
  children: React.ReactNode;
}) {
  const dim = size === "lg" ? "w-[48px] h-[48px]" : "w-[42px] h-[42px]";
  return (
    <button
      onClick={onClick}
      className={`${dim} rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95`}
      style={{
        backgroundColor: activeBg ? activeColor : inactiveColor,
        border: `1px solid ${activeBg ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: activeBg ? `0 4px 15px ${activeColor}40` : 'none',
      }}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
