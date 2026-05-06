<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBoard } from '../composables/useBoard'
import { useAuth } from '../composables/useAuth'
import ListColumn from '../components/ListColumn.vue'
import AppTopBar from '../components/AppTopBar.vue'
import AppSidebar from '../components/AppSideBar.vue'
import InfoPanel from '../components/InfoPanel.vue'

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

const activeInfoPanel = ref<'how-to-use' | 'security-info' | null>(null)

const {
  lists,
  addCard,
  deleteCard,
  updateCard,
  moveCard,
  loadTasks
} = useBoard()

const { userProfile } = useAuth()

const canWrite = () =>
  userProfile.value?.role === 'admin' || userProfile.value?.role === 'member'

const canDelete = () =>
  userProfile.value?.role === 'admin'

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

function handleUpdateCard(payload: {
  cardId: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}) {
  updateCard(
    payload.cardId,
    payload.title,
    payload.description,
    payload.priority
  )
}

function handleMoveCard(payload: { cardId: string; newListId: string }) {
  moveCard(payload.cardId, payload.newListId)
}

function goWorkspaces() {
  emit('back-to-workspaces')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex">
    <AppSidebar
      active-page="board"
      @go-workspaces="goWorkspaces"
      @show-info="activeInfoPanel = $event"
    />

    <main class="flex-1 min-w-0">
      <AppTopBar
        :title="workspace.title"
        subtitle="Task Board"
      />

      <div class="px-6 py-3 bg-white border-b border-gray-200">
        <button
          @click="emit('back-to-workspaces')"
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to Workspaces
        </button>
      </div>

      <div class="w-full overflow-x-auto">
        <div class="flex gap-4 p-6">
          <ListColumn
            v-for="(list, index) in lists"
            :key="list.id"
            :list="list"
            :lists="lists"
            :list-index="index"
            :can-write="canWrite()"
            :can-delete="canDelete()"
            @add-card="handleAddCard"
            @delete-card="handleDeleteCard"
            @update-card="handleUpdateCard"
            @move-card="handleMoveCard"
          />
        </div>
      </div>
    </main>

    <InfoPanel
      v-if="activeInfoPanel"
      :panel="activeInfoPanel"
      @close="activeInfoPanel = null"
    />
  </div>
</template>