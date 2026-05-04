<script setup lang="ts">
import { watch } from 'vue'
import { useBoard } from '../composables/useBoard'
import { useAuth } from '../composables/useAuth'
import ListColumn from '../components/ListColumn.vue'

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

const {
  currentUser,
  userProfile,
  logout
} = useAuth()

watch(
  userProfile,
  (profile) => {
    console.log('USER PROFILE WATCH:', profile)

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
  <!-- Top user/auth bar -->
  <div class="flex items-center justify-between p-4 bg-gray-200">
    <div>
      <button
        @click="emit('back-to-workspaces')"
        class="text-sm text-blue-600 hover:text-blue-800 mb-2"
      >
        ← Back to Workspaces
      </button>

      <h1 class="text-xl font-bold text-gray-800">
        {{ workspace.title }}
      </h1>

      <p class="text-sm text-gray-600">
        Logged in as: {{ currentUser?.email }}
      </p>

      <p class="text-sm text-gray-600">
        Role: {{ userProfile?.role }} | Project: {{ userProfile?.projectId }}
      </p>
    </div>

    <button
      @click="logout"
      class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  </div>

  <!-- Board -->
  <div class="h-full w-full overflow-x-auto">
    <div class="flex gap-4 p-4">
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
</template>