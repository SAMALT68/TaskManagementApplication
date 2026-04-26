<script setup lang="ts">
import { useBoard } from '../composables/useBoard'
import ListColumn from '../components/ListColumn.vue'
import { useUser } from '../composables/useUser'
import { onMounted } from 'vue'

const { currentUser} = useUser()
const { lists, addCard, loadTasks } = useBoard()

onMounted(() => {
  loadTasks()
})

function handleAddCard(payload: { listId: string; title: string }) {
  console.log("EVENT RECEIVED:", payload)
  addCard(payload.listId, payload.title)
}
</script>
  
<template>
  <div class="p-4 flex gap-4 items-center bg-gray-200">
  <div>
    <span class="font-semibold">User:</span>
    {{ currentUser.name }}
  </div>

  <div>
    <span class="font-semibold">Role:</span>
    <select
      v-model="currentUser.role"
      class="ml-2 p-1 rounded border"
    >
      <option value="admin">Admin</option>
      <option value="member">Member</option>
      <option value="viewer">Viewer</option>
    </select>
  </div>
</div>
  <div class="h-full w-full overflow-x-auto">
    <div class="flex gap-4 p-4">
      <ListColumn
        v-for="list in lists"
        :key="list.id"
        :list="list"
        @add-card="handleAddCard"
      />
    </div>
  </div>
</template>