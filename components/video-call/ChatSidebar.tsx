"use client";

import { useRef, useEffect, useState, KeyboardEvent } from "react";
import type { ChatMessage, ChatTab } from "./types";

interface ChatSidebarProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export default function ChatSidebar({
  messages,
  onSendMessage,
}: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>("chats");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col flex-shrink-0 h-full overflow-hidden"
      style={{
        width: "clamp(280px, 24vw, 360px)",
        backgroundColor: "#141418",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Tabs */}
      <div className="flex-shrink-0 flex items-center justify-center px-4 py-3 border-b border-white/5">
        <div className="flex items-center rounded-xl p-1 gap-1 bg-white/5" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "chats"}
            onClick={() => setActiveTab("chats")}
            className={`px-5 py-2 rounded-lg text-[12px] font-bold transition-all ${
              activeTab === "chats"
                ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            💬 Chats
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "rate"}
            onClick={() => setActiveTab("rate")}
            className={`px-5 py-2 rounded-lg text-[12px] font-bold transition-all ${
              activeTab === "rate"
                ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            ⭐ Noter
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "chats" ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-3 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <p className="text-white/60 text-xs font-medium text-center">Aucun message pour le moment.<br/>Commencez la conversation !</p>
              </div>
            )}
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-3 py-3 border-t border-white/5">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-white/5 border border-white/8 focus-within:border-[#D32F2F]/40 transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrire un message..."
                className="flex-1 bg-transparent outline-none text-[13px] font-medium text-white placeholder:text-white/25"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="flex-shrink-0 w-[32px] h-[32px] rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-20 bg-[#D32F2F] shadow-sm shadow-red-900/30"
                aria-label="Envoyer"
                title="Envoyer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Rate tab */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#D32F2F]" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-white text-[15px] font-bold">Évaluer la séance</p>
          <p className="text-white/30 text-[13px] font-medium leading-relaxed">
            La notation sera disponible à la fin de la séance.
          </p>
          <div className="flex gap-2 mt-2">
            {[1,2,3,4,5].map(s => (
              <button key={s} className="w-10 h-10 bg-white/5 hover:bg-[#D32F2F]/20 hover:text-[#D32F2F] rounded-xl flex items-center justify-center text-white/20 transition-all border border-white/5 hover:border-[#D32F2F]/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MessageItem({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-3 animate-fadeIn">
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-[34px] h-[34px] rounded-xl overflow-hidden border border-white/10 shadow-sm bg-white/5">
          {message.avatarUrl ? (
            <img src={message.avatarUrl} alt={message.sender} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40 text-[10px] font-bold">
              {message.sender.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold mb-0.5 truncate text-white/30">{message.sender}</p>
            <p className="text-[12px] font-medium leading-snug text-white/80">{message.message}</p>
          </div>
          {message.time && (
            <p className="text-[9px] font-bold flex-shrink-0 mt-3 text-white/20">{message.time}</p>
          )}
        </div>
      </div>
    </div>
  );
}
