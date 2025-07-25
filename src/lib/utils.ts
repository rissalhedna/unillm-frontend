import { get } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { 
	chatMessages,
	chatHistorySubscription, 
	activeChat,
	type ChatTranscript,
    messageStream
} from '$lib/state';
import { SOURCE_DELIMITER } from './constants';

export const sendMessage = async (query: string) => {
	console.log('📝 Processing new message:', query);
	
	chatMessages.update((messages: ChatTranscript) => ({
		messages: [...messages.messages, { role: 'user', content: query }],
		chatState: 'loading'
	}));
	
	const currentActiveChat = get(activeChat);
	
	if (currentActiveChat) {
		const currentMessages = get(chatMessages).messages;
		console.log('💾 Saving user message to existing chat:', currentActiveChat);
		try {
			await fetch(`/api/chats/${currentActiveChat}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: currentMessages })
			});
			console.log('✅ User message saved successfully');
		} catch (error) {
			console.error('❌ Failed to save user message:', error);
		}
	}

	console.log('🔄 Fetching response from API...');
	console.log(PUBLIC_BACKEND_URL);
    console.log(get(chatMessages).messages);
	
	try {
		const response = await fetch(`${PUBLIC_BACKEND_URL}/query`, {
			method: "POST",
			body: JSON.stringify({
				messages: get(chatMessages).messages,
			}),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		});

		if (!response.body) {
			throw new Error('No response body received');
		}
        const sourceURLs: string[] = [];
		const reader = response.body.getReader();
		async function processStream() {
			reader.read().then(async ({ done, value }) => {
				if (done) {
					console.log("Stream completed");
                    for(const sourceURL of sourceURLs){
						console.log("Source: ", sourceURL)
                        messageStream.set(get(messageStream) + SOURCE_DELIMITER + sourceURL + SOURCE_DELIMITER)
                    }
					chatMessages.update((messages: ChatTranscript) => ({
						messages: [...messages.messages, { role: 'assistant', content: get(messageStream) }],
						chatState: 'idle' as const
					}));
                    messageStream.set('')
                    await fetch(`/api/chats/${currentActiveChat}/messages`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: get(chatMessages).messages })
                    });

					return;
				}
                const textChunk = new TextDecoder().decode(value)
                if(!textChunk.includes('source')){
                    chatMessages.set({
                        messages: get(chatMessages).messages, 
                        chatState: 'idle'
                    })
                    messageStream.set(get(messageStream) + textChunk)
                }else{
					const sourceString = textChunk.split('source:')[1]
					if(sourceString && sourceString.trim() !== ''){
						console.log("Source URL: ",sourceString)
						try {
							// Convert Python dict format to JSON by replacing single quotes with double quotes
							const jsonString = sourceString
								.replace(/'/g, '"')  // Replace single quotes with double quotes
								.trim();
							
							const parsedSource = JSON.parse(jsonString);
							console.log('✅ Parsed source:', parsedSource);
							sourceURLs.push(parsedSource.url);
						} catch (parseError) {
							console.error('❌ JSON parse error:', parseError);
							console.error('❌ Raw source string:', sourceString);
							
							// Fallback: try to extract URL with regex if JSON parsing fails
							const urlMatch = sourceString.match(/'url':\s*'([^']+)'/);
							if (urlMatch && urlMatch[1]) {
								console.log('🔧 Using regex extracted URL:', urlMatch[1]);
								sourceURLs.push(urlMatch[1]);
							}
						}
					}
                }
				await processStream();
			});
		}
		await processStream();
        // messageStream.set('')
		
	} catch (error) {
		console.error('❌ Error in chat message processing:', error);
		
		// Add error message to store
		chatMessages.update((messages: ChatTranscript) => ({
			messages: [...messages.messages, { role: 'assistant', content: 'Sorry, there was an error processing your message.' }],
			chatState: 'error' as const
		}));
		
		// Update database with error message if we have an active chat
		if (currentActiveChat) {
			try {
				const currentMessages = get(chatMessages).messages;
				await fetch(`/api/chats/${currentActiveChat}/messages`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: currentMessages })
				});
			} catch (dbError) {
				console.error('❌ Failed to save error message to database:', dbError);
			}
		}
	}
};

export const replaceMessages = (messages: ChatTranscript) => {
	chatMessages.set(messages);
};

export const resetMessages = () => {
	chatMessages.set({
		messages: [],
		chatState: 'idle'
	});
};

// Chat History Functions
export const fetchChats = async () => {
	const response = await fetch('/api/chats');
	const chats = await response.json();
	chatHistorySubscription.set(chats);
};

export const deleteChat = async (id: string) => {
	await fetch(`/api/chats/${id}`, { method: 'DELETE' });
	await fetchChats();
};

export const updateChatTitle = async (id: string, title: string) => {
	await fetch(`/api/chats/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title })
	});
	await fetchChats();
};

export const loadMessages = async (chatId: string) => {
	if (get(chatMessages).chatState !== 'idle') return;

	const response = await fetch(`/api/chats/${chatId}`);
	const chat = await response.json();

	replaceMessages({
		messages: chat.messages.map(({ role, content }: { role: string, content: string }) => ({ role, content })),
		chatState: 'idle'
	});
	activeChat.set(chatId);
}; 