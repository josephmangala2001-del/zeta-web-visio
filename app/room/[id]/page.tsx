"use client";

import { useEffect, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { DailyProvider } from "@daily-co/daily-react";
import { useParams } from "next/navigation";
import VideoCallPage from "@/components/video-call/VideoCallPage";
import WaitingRoom from "@/components/video-call/WaitingRoom";

// Variable globale hors de React — jamais réinitialisée par StrictMode
let globalCallObject: DailyCall | null = null;

export default function VideoRoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const ROOM_URL = `https://zeeta.daily.co/${roomId}`;

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    // Réutiliser l'instance existante si elle existe encore
    if (globalCallObject) {
      setCallObject(globalCallObject);
      return;
    }

    // Sinon en créer une nouvelle
    const co = DailyIframe.createCallObject();
    globalCallObject = co;
    setCallObject(co);

    return () => {
      // Cleanup au démontage réel (navigation hors de la page)
      co.destroy().then(() => {
        globalCallObject = null;
      }).catch(() => {
        globalCallObject = null;
      });
    };
  }, []);

  if (!callObject) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#D32F2F]/30 border-t-[#D32F2F] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-join phase
  if (isWaiting) {
    return (
      <DailyProvider callObject={callObject}>
        <WaitingRoom 
          roomUrl={ROOM_URL}
          onJoin={() => setIsWaiting(false)} 
        />
      </DailyProvider>
    );
  }

  // Joined phase
  return (
    <DailyProvider callObject={callObject}>
      <VideoCallPage
        roomUrl={ROOM_URL}
        sessionTitle={`Séance avec la salle : ${roomId}`}
        sessionDate=""
        userName="Utilisateur"
        userRole="Élève"
      />
    </DailyProvider>
  );
}
