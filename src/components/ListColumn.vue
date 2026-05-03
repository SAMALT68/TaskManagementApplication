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
  lists: {
    id: string
    title: string
    cards: { id: string; title: string }[]
  }[]
  listIndex: number
}>()

const emit = defineEmits<{
  (e: 'add-card', payload: { listId: string; title: string }): void
    (e: 'delete-card', cardId: string): void
  (e: 'update-card', payload: { cardId: string; title: string }): void
  (e: 'move-card', payload: { cardId: string; newListId: string }): void
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

function moveLeft(cardId: string) {
  const previousList = props.lists[props.listIndex - 1]
  if (!previousList) return

  emit('move-card', {
    cardId,
    newListId: previousList.id
  })
}

function moveRight(cardId: string) {
  const nextList = props.lists[props.listIndex + 1]
  if (!nextList) return

  emit('move-card', {
    cardId,
    newListId: nextList.id
  })
}
</script>

<template>
  <div class="bg-gray-100 rounded-xl p-3 w-64 shrink-0">
    <!-- Column Title -->
    <h3 class="font-semibold mb-3 text-gray-700">
      {{ list.title }}
    </h3>

    <!-- Cards -->
   <div
  v-for="card in list.cards"
  :key="card.id"
  class="space-y-1"
>
  <TaskCard
    :card="card"
    @delete-card="emit('delete-card', $event)"
    @update-card="emit('update-card', $event)"
  />

  <div class="flex justify-between text-xs">
    <button
      v-if="listIndex > 0"
      @click="moveLeft(card.id)"
      class="text-gray-500 hover:text-blue-600"
    >
      ← Move
    </button>

    <span v-else></span>

    <button
      v-if="listIndex < lists.length - 1"
      @click="moveRight(card.id)"
      class="text-gray-500 hover:text-blue-600"
    >
      Move →
    </button>
  </div>
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