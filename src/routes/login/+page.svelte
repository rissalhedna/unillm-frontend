<script lang="ts">
	function handleImageError(event: Event) {
		const target = event.target as HTMLImageElement;
		target.outerHTML = '<span class="text-6xl">🇩🇪</span>';
	}
</script>

<svelte:head>
	<title>Sign In - UniLLM</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
			
			<div class="text-center mb-8">
				<div class="flex justify-center mb-6">
					<div class="w-20 h-20 rounded-full shadow-lg bg-gray-50 dark:bg-gray-800
								flex items-center justify-center
								border-2 border-[#dd1c1a]/20">
						{#if !import.meta.env.PROD}
							<span class="text-6xl">🇩🇪</span>
						{:else}
							<img
								src="/german-flag-icon.svg"
								alt="UniLLM"
								class="w-full h-full object-cover rounded-full"
								on:error={handleImageError}
							/>
						{/if}
					</div>
				</div>
				
				<h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
					Welcome to UniLLM
				</h1>
				<p class="text-gray-600 dark:text-gray-400 text-lg">
					Your AI assistant for everything Germany
				</p>
			</div>

			<div class="space-y-6">
				<div class="text-center">
					<h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
						Sign in to continue
					</h2>
				</div>

				<a 
					href="/login/google"
					class="group w-full flex items-center justify-center gap-3 px-6 py-3
						   bg-white hover:bg-gray-50 
						   dark:bg-gray-700 dark:hover:bg-gray-600
						   border-2 border-gray-300 dark:border-gray-600
						   hover:border-[#dd1c1a]/30 dark:hover:border-[#dd1c1a]/30
						   rounded-lg transition-all duration-200
						   transform hover:scale-105 active:scale-95
						   shadow-sm hover:shadow-md
						   text-gray-700 dark:text-gray-300 
						   hover:text-gray-900 dark:hover:text-white
						   font-medium text-lg"
				>
					<svg class="w-6 h-6" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					<span>Continue with Google</span>
				</a>

				<div class="relative my-6">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
							Secure authentication
						</span>
					</div>
				</div>

				<div class="text-center space-y-3">
					<div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
						<span>AI-powered German assistance</span>
					</div>
					<div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
						<span>Personalized chat history</span>
					</div>
					<div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
						<span>Secure & private</span>
					</div>
				</div>

				<!-- Footer -->
				<div class="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
					<p class="text-xs text-gray-500 dark:text-gray-400">
						By signing in, you agree to our terms and privacy policy
					</p>
				</div>
			</div>
		</div>

		<div class="text-center mt-6">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Get instant answers about studying, living, and working in Germany
			</p>
		</div>
	</div>
</div>