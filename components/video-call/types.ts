export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  avatarUrl?: string;
  isLocal?: boolean;
}

export type ChatTab = "chats" | "rate";
