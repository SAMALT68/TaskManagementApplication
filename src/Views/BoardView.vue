<script setup lang="ts">
import { watch } from 'vue'
import { useBoard } from '../composables/useBoard'
import { useAuth } from '../composables/useAuth'
import ListColumn from '../components/ListColumn.vue'

const { lists, addCard, deleteCard, loadTasks } = useBoard()
const { currentUser, userProfile, logout } = useAuth()

watch(
  userProfile,
  (profile) => {
    console.log('USER PROFILE WATCH:', profile)

    if (profile) {
      loadTasks()
    }
  },
  { immediate: true }
)

function handleDeleteCard(cardId: string) {
  deleteCard(cardId)
}
function handleAddCard(payload: { listId: string; title: string }) {
  console.log("EVENT RECEIVED:", payload)
  addCard(payload.listId, payload.title)
}
</script>

<template>
  <!-- Top user/auth bar -->
  <div class="flex items-center justify-between p-4 bg-gray-200">
    <div>
      <p class="font-semibold">
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
        v-for="list in lists"
        :key="list.id"
        :list="list"
        @add-card="handleAddCard"
          @delete-card="handleDeleteCard"
      />
    </div>
  </div>
</template>