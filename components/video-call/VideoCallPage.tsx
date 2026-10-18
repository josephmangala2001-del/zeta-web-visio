"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useDaily,
  useDailyEvent,
  useLocalSessionId,
  useParticipantIds,
} from "@daily-co/daily-react";
import Header from "./Header";
import VideoArea from "./VideoArea";
import ChatSidebar from "./ChatSidebar";
import ControlBar from "./ControlBar";
import type { ChatMessage } from "./types";

interface VideoCallPageProps {
  roomUrl: string;
  sessionTitle?: string;
  sessionDate?: string;
  userName?: string;
  userRole?: string;
  userAvatarUrl?: string;
}

export default function VideoCallPage({
  roomUrl,
  sessionTitle = "Séance Joseph & Hugo - Simulation entretien technique",
  sessionDate = "June 12th, 2022 | 11:00 AM",
  userName = "Adam Joseph",
  userRole = "Coach",
  userAvatarUrl,
}: VideoCallPageProps) {
  const callObject = useDaily();
  const localSessionId = useLocalSessionId();
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });

  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [callDuration, setCallDuration] = useState(0);

  // Join room on mount
  useEffect(() => {
    if (callObject && !joined && !joinError) {
      callObject
        .join({ url: roomUrl })
        .catch((err: Error) => {
          console.error("Failed to join room:", err);
          setJoinError(
            err.message?.includes("not found")
              ? "Cette salle de visio n'existe pas encore. Veuillez créer la salle sur Daily.co."
              : `Erreur de connexion: ${err.message}`
          );
        });
    }
  }, [callObject, roomUrl, joined, joinError]);

  // Mark as joined
  useDailyEvent(
    "joined-meeting",
    useCallback(() => {
      setJoined(true);
      setJoinError(null);
    }, [])
  );

  // Handle errors
  useDailyEvent(
    "error",
    useCallback((event: { error?: { type?: string; msg?: string } }) => {
      console.error("Daily error:", event);
      if (event?.error?.type === "not-found") {
        setJoinError("Salle non trouvée. Vérifiez le lien de la visio.");
      }
    }, [])
  );

  // Call duration timer — only runs when joined
  useEffect(() => {
    if (!joined) return;
    const interval = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [joined]);

  // Receive chat messages from remote participants
  useDailyEvent(
    "app-message",
    useCallback((event: { data?: { type?: string; sender?: string; message?: string } }) => {
      if (event?.data?.type === "chat" && event.data.sender && event.data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: event.data!.sender!,
            message: event.data!.message!,
            time: new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    }, [])
  );

  // ─── Control handlers ───

  const toggleMic = useCallback(() => {
    if (!callObject) return;
    const newState = !isMicMuted;
    callObject.setLocalAudio(!newState);
    setIsMicMuted(newState);
  }, [callObject, isMicMuted]);

  const toggleCamera = useCallback(() => {
    if (!callObject) return;
    const newState = !isCameraMuted;
    callObject.setLocalVideo(!newState);
    setIsCameraMuted(newState);
  }, [callObject, isCameraMuted]);

  const toggleScreenShare = useCallback(() => {
    if (!callObject) return;
    if (isScreenSharing) {
      callObject.stopScreenShare();
    } else {
      callObject.startScreenShare();
    }
    setIsScreenSharing((prev) => !prev);
  }, [callObject, isScreenSharing]);

  const toggleRecording = useCallback(() => {
    if (!callObject) return;
    if (isRecording) {
      callObject.stopRecording();
    } else {
      callObject.startRecording();
    }
    setIsRecording((prev) => !prev);
  }, [callObject, isRecording]);

  const endCall = useCallback(() => {
    if (callObject) {
      callObject.leave();
    }
    window.location.href = "/dashboard";
  }, [callObject]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const msg: ChatMessage = {
        id: Date.now().toString(),
        sender: userName,
        message: text,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isLocal: true,
      };
      setMessages((prev) => [...prev, msg]);
      callObject?.sendAppMessage(
        { type: "chat", sender: userName, message: text },
        "*"
      );
    },
    [callObject, userName]
  );

  // Format call duration
  const hours = Math.floor(callDuration / 3600);
  const minutes = Math.floor((callDuration % 3600) / 60);
  const seconds = callDuration % 60;
  const formattedDuration = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const mainParticipantId = remoteParticipantIds[0] ?? null;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "#111115",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <Header
        title={sessionTitle}
        date={sessionDate}
        userName={userName}
        userRole={userRole}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Join error banner */}
      {joinError && (
        <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-amber-800 text-[13px] font-[500]">{joinError}</p>
        </div>
      )}

      {/* Main content row */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column: video + control bar */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <VideoArea
            mainParticipantId={mainParticipantId}
            localSessionId={localSessionId}
            duration={formattedDuration}
            isRecording={isRecording}
            isMicMuted={isMicMuted}
          />
          <ControlBar
            isMicMuted={isMicMuted}
            isCameraMuted={isCameraMuted}
            isScreenSharing={isScreenSharing}
            isRecording={isRecording}
            isChatOpen={isChatOpen}
            onToggleMic={toggleMic}
            onToggleCamera={toggleCamera}
            onToggleScreenShare={toggleScreenShare}
            onToggleRecording={toggleRecording}
            onToggleChat={() => setIsChatOpen((prev) => !prev)}
            onEndCall={endCall}
          />
        </div>

        {/* Right sidebar — togglable */}
        {isChatOpen && (
          <ChatSidebar messages={messages} onSendMessage={sendMessage} />
        )}
      </div>
    </div>
  );
}
