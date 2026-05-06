<script setup lang="ts">
defineProps<{
  activePage: 'workspaces' | 'board'
}>()

const emit = defineEmits<{
  (e: 'go-workspaces'): void
  (e: 'show-info', panel: 'how-to-use' | 'security-info'): void
}>()

function openHowToUse() {
  console.log('How to use clicked')
  emit('show-info', 'how-to-use')
}

function openSecurityInfo() {
  console.log('Security info clicked')
  emit('show-info', 'security-info')
}
</script>

<template>
  <aside class="w-56 bg-slate-800 text-white min-h-screen shrink-0">
    <div class="p-5 border-b border-slate-700">
      <div class="text-2xl font-bold">
        SwiftTask
      </div>

      <p class="text-xs text-slate-300 mt-1">
        Secure task manager
      </p>
    </div>

    <nav class="p-3 space-y-2">
      <button
        @click="emit('go-workspaces')"
        class="w-full text-left px-3 py-2 rounded-lg text-sm transition"
        :class="activePage === 'workspaces'
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'"
      >
        My Workspaces
      </button>

      <button
        class="w-full text-left px-3 py-2 rounded-lg text-sm transition"
        :class="activePage === 'board'
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'"
        disabled
      >
        Task Board
      </button>

      <div class="pt-4 mt-4 border-t border-slate-700">
        <p class="text-xs uppercase tracking-wide text-slate-400 px-3 mb-2">
          Support
        </p>

        <button
          type="button"
          @click="openHowToUse"
          class="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
        >
          How to use
        </button>

        <button
          type="button"
          @click="openSecurityInfo"
          class="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
        >
          Security info
        </button>
      </div>
    </nav>
  </aside>
</template>