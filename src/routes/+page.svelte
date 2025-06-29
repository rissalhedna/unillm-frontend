<script lang="ts">
	import { Send } from 'lucide-svelte';
	import ChatMessage from '$lib/components/ChatMessage.svelte';

	import { sendMessage, fetchChats } from '$lib/utils';
	import { chatMessages, activeChat, answer, messageStream } from '$lib/state';
	import ChatHistory from '$lib/components/ChatHistory.svelte';

	let query = '';
	let messagesContainer: HTMLDivElement;
	$: isLoading = $chatMessages.chatState === 'loading';
	let textareaElement: HTMLTextAreaElement;

	const scrollToBottom = () => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	};

	const handleSubmit = async () => {
		if (!query.trim()) return;
		const currentQuery = query;
		query = '';
		answer.set('');

		if (textareaElement) {
			textareaElement.style.height = '1.25rem';
		}

		setTimeout(scrollToBottom, 0);

		if (!$activeChat) {
			console.log('🆕 Creating new chat with first message:', currentQuery);
			try {
				const response = await fetch('/api/chats', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						title: currentQuery,
						messages: [
							{ role: 'user', content: currentQuery }
						]
					})
				});
				const chat = await response.json();
				console.log('✅ New chat created:', {
					chatId: chat.id,
					title: chat.title
				});
				activeChat.set(chat.id);
				await fetchChats(); // Update sidebar immediately
			} catch (error) {
				console.error('❌ Failed to create new chat:', error);
			}
		}

		await sendMessage(currentQuery);
	};

	$: if ($answer) {
		setTimeout(scrollToBottom, 0);
	}

	$: if ($chatMessages.messages.length > 0) {
		setTimeout(scrollToBottom, 0);
	}

	const popularTopics = [
		{
			icon: "🏛️",
			title: "How do I apply for a German student visa?",
			query: "What are the steps to apply for a student visa in Germany?"
		},
		{
			icon: "🏠",
			title: "Finding accommodation in Germany",
			query: "How can I find an apartment in Germany? What is the process?"
		},

	];

	const gettingStarted = [
		{
			icon: "🗣️",
			title: "Learning German language",
			query: "What are the best ways to learn German? Where should I start?"
		},
		{
			icon: "🎓",
			title: "Study in Germany",
			query: "What are the requirements to study at a German university?"
		},

	];

	function handleImageError(event: Event) {
		const target = event.target as HTMLImageElement;
		target.outerHTML = '<span class="text-4xl">🇩🇪</span>';
	}
</script>

<div class="grid h-screen w-full bg-white md:grid-cols-[280px_1fr] relative overflow-hidden">
	<div class="hidden bg-gray-50 md:block h-screen overflow-hidden border-r border-gray-200">
		<div class="flex h-full flex-col">
			<div class="flex h-16 items-center px-4 border-b border-gray-200">
				<a href="/" class="flex items-center gap-2 font-semibold text-gray-900">
					<span class="text-xl">UniLLM</span>
				</a>
			</div>
			<div class="flex-1 overflow-y-auto">
				<ChatHistory />
			</div>
		</div>
	</div>

	<div class="flex h-screen flex-col bg-white">
		<header class="flex h-16 items-center gap-4 px-4 border-b border-gray-200">
			<h1 class="text-lg font-medium text-gray-900">Chat with UniLLM</h1>
		</header>

		<!-- Main Chat Area -->
		<main class="flex h-[calc(100vh-64px)] flex-1 flex-col relative">

			<!-- Scrollable Messages Container -->
			<div
				class="flex-1 overflow-y-auto"
				bind:this={messagesContainer}
			>
				<div class="max-w-4xl mx-auto px-4 py-6">
					<div class="flex flex-col gap-6">
						{#each $chatMessages.messages as message}
							<ChatMessage
								type={message.role}
								message={message.content}
								class="{message.role === 'user' ?
								   'px-4 py-3 rounded-2xl bg-blue-600 text-white ml-auto max-w-[80%] shadow-sm' :
								   'mr-auto max-w-[80%] text-gray-900'}"
							/>
						{/each}
						{#if $messageStream}
							<ChatMessage
								type="assistant"
								message={$messageStream}
								class="mr-auto max-w-[80%] text-gray-900"
							/>
						{/if}

						{#if $answer}
							<ChatMessage
								type="assistant"
								message={$answer}
								class="mr-auto max-w-[80%] text-gray-900"
							/>
						{/if}

						{#if isLoading}
							<div class="mr-auto max-w-[80%]">
								<div class="flex gap-1">
									<span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></span>
									<span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></span>
									<span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{#if $chatMessages.messages.length === 0}
			<div class="flex-1 justify-center items-center px-4 pt-12">
				<div class="text-center">
					<div class="flex justify-center mb-6">
						<div class="w-16 h-16 rounded-full shadow-lg bg-blue-100
									flex items-center justify-center
									border border-blue-200">
							{#if !import.meta.env.PROD}
								<span class="text-4xl">🇩🇪</span>
							{:else}
								<img
									src="/german-flag-icon.svg"
									alt="German Assistant"
									class="w-full h-full object-cover rounded-full"
									on:error={handleImageError}
								/>
							{/if}
						</div>
					</div>
					<h1 class="text-3xl font-bold mb-16 text-gray-900">
						Ask me anything about Germany!
					</h1>
				</div>

				<!-- Example Questions Grid -->
				<div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
					<div class="space-y-4">
						<h2 class="text-sm font-semibold text-gray-700 mb-3">
							Popular Topics
						</h2>
						<div class="flex flex-col gap-3">
							{#each popularTopics as {icon, title, query: topicQuery}}
								<button
									class="w-full text-left p-4 rounded-xl bg-white hover:bg-gray-50
										   border border-gray-200 hover:border-gray-300 transition-all
										   flex items-center gap-3 group shadow-sm hover:shadow-md"
									on:click={() => {
										query = topicQuery;
										handleSubmit();
									}}
								>
									<span class="text-2xl">{icon}</span>
									<span class="text-sm text-gray-800 group-hover:text-gray-900 transition-colors font-medium">
										{title}
									</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Getting Started Column -->
					<div class="space-y-4">
						<h2 class="text-sm font-semibold text-gray-700 mb-3">
							Getting Started
						</h2>
						<div class="flex flex-col gap-3">
							{#each gettingStarted as {icon, title, query: topicQuery}}
								<button
									class="w-full text-left p-4 rounded-xl bg-white hover:bg-gray-50
										   border border-gray-200 hover:border-gray-300 transition-all
										   flex items-center gap-3 group shadow-sm hover:shadow-md"
									on:click={() => {
										query = topicQuery;
										handleSubmit();
									}}
								>
									<span class="text-2xl">{icon}</span>
									<span class="text-sm text-gray-800 group-hover:text-gray-900 transition-colors font-medium">
										{title}
									</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
			</div>

			<div>
				<div class="max-w-4xl mx-auto px-4 pb-6">
					<form
						class="flex justify-center items-end gap-4 relative"
						on:submit|preventDefault={handleSubmit}
					>
						<div class="relative w-full max-w-4xl">
							<div class="flex items-center bg-gray-100 rounded-3xl border border-gray-200 shadow-sm">
								<div class="relative group">
									<button
										type="button"
										class="flex items-center gap-1.5 pl-4 pr-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200/60 rounded-l-3xl transition-all duration-200"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
										<span class="text-sm font-medium select-none">Tools</span>
									</button>
									
									<!-- Tooltip -->
									<div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
										Coming soon
										<div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
									</div>
								</div>
								
								<!-- Divider line -->
								<div class="w-px h-6 bg-gray-300 mx-1"></div>
								
								<textarea
									bind:this={textareaElement}
									bind:value={query}
									class="flex-1 min-h-[48px] max-h-[200px] py-3 px-3
										   bg-transparent text-gray-900
										   placeholder:text-gray-500
										   text-base leading-6
										   resize-none overflow-y-auto
										   border-none outline-none focus:outline-none"
									placeholder="Ask anything"
									disabled={isLoading}
									rows="1"
									on:keydown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSubmit();
										}
									}}
									on:input={(e) => {
										if(e && e.target && e.target instanceof HTMLTextAreaElement){
											e.target.style.height = 'auto';
											e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
										}
									}}
								/>

								<div class="flex items-center pr-2">
									<button
										type="submit"
										class="p-2 rounded-full
											   bg-gray-800 hover:bg-gray-900
											   text-white disabled:bg-gray-300
											   transition-colors duration-200
											   disabled:cursor-not-allowed
											   flex items-center justify-center
											   w-8 h-8"
										disabled={isLoading || !query.trim()}
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"></path>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</form>

					<div class="flex items-center justify-center gap-1 mt-3 max-w-4xl mx-auto">
						<p class="text-xs text-gray-500 text-center">
							UniLLM can make mistakes. Consider checking important information.
						</p>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
