export interface Message {
  id?: string;
  channel_id: string;
  sender: string;
  content: string;
  sent_at?: Date;
  timestamp?: Date;
  isRead?: boolean;
}

export interface ChatChannel {
  id: string;
  participants: string[];
  created_at: Date;
}

export interface Conversation {
  channel_id: string;
  other_user_id: string;
  created_at: Date;
  last_message?: string;
  last_message_at?: Date;
  last_message_sender?: string;
}

export interface MessagesResponse {
  status: string;
  messages: Message[];
}

export interface ConversationsResponse {
  status: string;
  conversations: Conversation[];
}

export interface WebSocketMessage {
  type: string;
  data: any;
} 