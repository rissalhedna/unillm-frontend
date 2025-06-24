<script lang="ts">
  import { onMount } from "svelte";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { chatMessages } from "$lib/stores/chat-messages";
  import {
    chatHistorySubscription,
    loadMessages,
    deleteChat,
    updateChatTitle,
    fetchChats,
    activeChat
  } from "$lib/stores/chat-history";
  import { MessageSquare, Pencil, Plus, Trash2, Share } from "lucide-svelte";

  interface Chat {
    id: string;
    title: string;
    messages: Array<{
      role: string;
      content: string;
    }>;
  }

  let chats: Chat[] = [];
  let editingChatId: string | null = null;
  let newTitle = "";
  let isLoading = false;
  let openDropdownId: string | null = null;

  onMount(async () => {
    await fetchChats();
    chatHistorySubscription.subscribe((value) => {
      if (value) {
        chats = value as Chat[];
      }
    });
  });

  async function handleChatSelect(chatId: string) {
    isLoading = true;
    await loadMessages(chatId);
    isLoading = false;
  }

  async function handleDelete(chatId: string, event: Event) {
    event.stopPropagation();
    await deleteChat(chatId);
    if ($activeChat === chatId) {
      chatMessages.reset();
      activeChat.set(null);
    }
    openDropdownId = null;
  }

  function startEditing(chat: Chat, event: Event) {
    event.stopPropagation();
    editingChatId = chat.id;
    newTitle = chat.title;
    openDropdownId = null;
  }

  async function handleRename(chatId: string) {
    if (newTitle.trim()) {
      await updateChatTitle(chatId, newTitle.trim());
      editingChatId = null;
    }
  }

  function handleNewChat() {
    chatMessages.reset();
    activeChat.set(null);
  }

  function toggleDropdown(chatId: string, event: Event) {
    event.stopPropagation();
    openDropdownId = openDropdownId === chatId ? null : chatId;
  }

  function closeDropdown() {
    openDropdownId = null;
  }
</script>

<svelte:window on:click={closeDropdown} />

<div class="flex flex-col h-full overflow-y-scroll">
  <div class="flex-none p-2">
    <button
      on:click={handleNewChat}
      class="w-full flex items-center gap-2 rounded-lg
             border border-[#dd1c1a]/20 px-2 py-2 text-sm
             transition-colors duration-200
             hover:bg-[#dd1c1a]/5 dark:hover:bg-[#dd1c1a]/10"
    >
      <Plus class="h-4 w-4" /> New chat
    </button>
  </div>

  <div class="flex-1 overflow-y-auto px-3">
    <div class="flex flex-col gap-1">
      {#each chats as chat (chat.id)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          on:click={() => handleChatSelect(chat.id)}
          class="group relative flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer
                {$activeChat === chat.id
            ? 'bg-[#dd1c1a]/10 dark:bg-[#dd1c1a]/20'
            : 'hover:bg-[#dd1c1a]/5 dark:hover:bg-[#dd1c1a]/10'}"
        >
          <MessageSquare class="h-4 w-4 flex-none" />

          {#if editingChatId === chat.id}
            <!-- svelte-ignore a11y-autofocus -->
            <input
              type="text"
              bind:value={newTitle}
              class="flex-1 bg-transparent border-b
                     border-[#dd1c1a]/30
                     focus:outline-none focus:border-[#dd1c1a]"
              on:blur={() => handleRename(chat.id)}
              on:keydown={(e) => e.key === 'Enter' && handleRename(chat.id)}
              autofocus
            />
          {:else}
            <div class="flex-1 text-left text-sm truncate">
              {chat.title}
            </div>
          {/if}

          <div class="relative">
            <button
              class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100
                     transition-opacity hover:bg-[#dd1c1a]/5
                     dark:hover:bg-[#dd1c1a]/10 rounded-md
                     flex items-center justify-center"
              on:click={(e) => toggleDropdown(chat.id, e)}
            >
              <span class="sr-only">Open menu</span>
              <Ellipsis class="h-4 w-4" />
            </button>
            
            {#if openDropdownId === chat.id}
              <div class="absolute right-0 top-8 z-10 w-48 rounded-md bg-white dark:bg-gray-800 
                         border border-gray-200 dark:border-gray-700 shadow-lg py-1">
                <button
                  on:click={(e) => startEditing(chat, e)}
                  class="w-full px-3 py-2 text-sm text-left flex items-center gap-2
                         hover:bg-[#dd1c1a]/5 dark:hover:bg-[#dd1c1a]/10
                         text-gray-700 dark:text-gray-300"
                >
                  <Pencil class="h-4 w-4" />
                  Rename
                </button>
                <button
                  class="w-full px-3 py-2 text-sm text-left flex items-center gap-2
                         hover:bg-[#dd1c1a]/5 dark:hover:bg-[#dd1c1a]/10
                         text-gray-700 dark:text-gray-300"
                >
                  <Share class="h-4 w-4" />
                  Share
                </button>
                <hr class="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  class="w-full px-3 py-2 text-sm text-left flex items-center gap-2
                         text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  on:click={(e) => handleDelete(chat.id, e)}
                >
                  <Trash2 class="h-4 w-4" />
                  Delete
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
