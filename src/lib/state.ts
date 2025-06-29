import { writable } from "svelte/store";

export interface ChatTranscript {
	messages: ChatCompletionRequestMessage[];
	chatState: 'idle' | 'loading' | 'error' | 'message';
}


export type ChatCompletionRequestMessage = {
	role: string;
	content: string;
}

export const chatMessages = writable<ChatTranscript>({
	messages: [],
	chatState: 'idle'
});

export const messageStream = writable<string>('');
export const chatHistorySubscription = writable();
export const activeChat = writable<string | null>(null);
export const answer = writable<string>('');
export const sources = writable<string[]>([]);