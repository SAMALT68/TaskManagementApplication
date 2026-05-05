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
  list: List
  lists: List[]
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
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 w-72 shrink-0 min-h-[360px]">
    <!-- Column Title -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-gray-800">
        {{ list.title }}
      </h3>

      <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
        {{ list.cards.length }}
      </span>
    </div>

    <!-- Cards -->
    <div class="flex flex-col gap-3">
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

        <!-- Move Buttons -->
        <div class="flex justify-between px-1 text-xs min-h-5">
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
    </div>

    <!-- Add Card Section -->
    <div class="mt-4">
      <div v-if="isAdding">
        <input
          v-model="newTitle"
          @keydown.enter.prevent="submit"
          placeholder="Enter task..."
          class="w-full p-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div class="flex gap-2 mt-2">
          <button
            @click="submit"
            class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
          >
            Add
          </button>

          <button
            @click="cancel"
            class="text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>

      <button
        v-else
        @click="isAdding = true"
        class="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg px-2 py-2"
      >
        + Add Card
      </button>
    </div>
  </div>
</template>