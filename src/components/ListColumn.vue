<script setup lang="ts">
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'

type Card = {
  id: string
  title: string
}

type List = {
  id: string
  title: string
  cards: Card[]
}

const props = defineProps<{
  list: {
    id: string
    title: string
    cards: { id: string; title: string }[]
  }
}>()

const emit = defineEmits<{
  (e: 'add-card', payload: { listId: string; title: string }): void
    (e: 'delete-card', cardId: string): void
}>()

const isAdding = ref(false)
const newTitle = ref('')

function submit() {
  console.log("SUBMIT TRIGGERED")
  if (!newTitle.value.trim()) return  

  emit('add-card', {
    listId: props.list.id,
    title: newTitle.value
  })

  newTitle.value = ''
  isAdding.value = false
}

function cancel() {
  newTitle.value = ''
  isAdding.value = false
}
</script>

<template>
  <div class="bg-gray-100 rounded-xl p-3 w-64 shrink-0">
    <!-- Column Title -->
    <h3 class="font-semibold mb-3 text-gray-700">
      {{ list.title }}
    </h3>

    <!-- Cards -->
    <div class="flex flex-col gap-2">
      <TaskCard
        v-for="card in list.cards"
        :key="card.id"
        :card="card"
        @delete-card="emit('delete-card', $event)"
      />
    </div>

    <!-- Add Card Section -->
    <div class="mt-3">
      <div v-if="isAdding">
        <input
          v-model="newTitle"
          @keyup.enter="submit"
          placeholder="Enter task..."
          class="w-full p-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div class="flex gap-2 mt-2">
          <button
            class="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            @click="submit"
          >
            Add
          </button>

          <button
            class="text-gray-500 text-sm"
            @click="cancel"
          >
            Cancel
          </button>
        </div>
      </div>

      <button
        v-else
        class="text-sm text-blue-600 hover:text-blue-800"
        @click="isAdding = true"
      >
        + Add Card
      </button>
    </div>
  </div>
</template>