<script lang="ts">
    import { enhance } from '$app/forms';
    import { LogOut } from 'lucide-svelte';
    

    let { isLoggedIn } = $props()
</script>

{#if isLoggedIn}
    <div class="fixed top-4 right-4 z-50">
        <form action="/api/logout" method="post" use:enhance>
            <button 
                type="submit"
                class="group flex items-center gap-2 px-4 py-2 
                       bg-white/90 hover:bg-white
                       dark:bg-gray-800/90 dark:hover:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       rounded-lg shadow-sm hover:shadow-md
                       text-gray-700 dark:text-gray-300
                       hover:text-[#dd1c1a] dark:hover:text-[#dd1c1a]
                       transition-all duration-200
                       transform hover:scale-105 active:scale-95
                       backdrop-blur-sm"
                title="Sign out"
            >
                <LogOut class="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span class="text-sm font-medium">Sign Out</span>
            </button>
        </form>
    </div>
{/if}