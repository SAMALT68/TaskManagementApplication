<script setup lang="ts">
import { watch } from 'vue'
import { useBoard } from '../composables/useBoard'
import { useAuth } from '../composables/useAuth'
import ListColumn from '../components/ListColumn.vue'
import AppTopBar from '../components/AppTopBar.vue'

const props = defineProps<{
  workspace: {
    id: string
    title: string
    projectId: string
    borderClass: string
    bgClass: string
  }
}>()

const emit = defineEmits<{
  (e: 'back-to-workspaces'): void
}>()

const {
  lists,
  addCard,
  deleteCard,
  updateCard,
  moveCard,
  loadTasks
} = useBoard()

const { userProfile } = useAuth()

watch(
  userProfile,
  (profile) => {
    if (profile) {
      loadTasks(props.workspace.id)
    }
  },
  { immediate: true }
)

function handleAddCard(payload: { listId: string; title: string }) {
  addCard(payload.listId, payload.title, props.workspace.id)
}

function handleDeleteCard(cardId: string) {
  deleteCard(cardId)
}

function handleUpdateCard(payload: { cardId: string; title: string }) {
  updateCard(payload.cardId, payload.title)
}

function handleMoveCard(payload: { cardId: string; newListId: string }) {
  moveCard(payload.cardId, payload.newListId)
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <AppTopBar
      :title="workspace.title"
      subtitle="Task Board"
    />

    <div class="px-6 py-3 bg-slate-100 border-b border-gray-200">
      <button
        @click="emit('back-to-workspaces')"
        class="text-sm text-blue-600 hover:text-blue-800"
      >
        ← Back to Workspaces
      </button>
    </div>

    <!-- Board -->
    <div class="h-full w-full overflow-x-auto">
      <div class="flex gap-4 p-6">
        <ListColumn
          v-for="(list, index) in lists"
          :key="list.id"
          :list="list"
          :lists="lists"
          :list-index="index"
          @add-card="handleAddCard"
          @delete-card="handleDeleteCard"
          @update-card="handleUpdateCard"
          @move-card="handleMoveCard"
        />
      </div>
    </div>
  </div>
</template>