export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface ChatCompletionRequestMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export type MessageRole = "user" | "assistant" | "system"; 