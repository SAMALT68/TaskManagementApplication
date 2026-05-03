<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  card: {
    id: string
    title: string
  }
}>()

const emit = defineEmits<{
  (e: 'delete-card', cardId: string): void
 (e: 'update-card', payload: { cardId: string; title: string }): void
   (e: 'update-card', payload: { cardId: string; title: string }): void
}>()

const isEditing = ref(false)
const editedTitle = ref(props.card.title)

function startEditing() {
  editedTitle.value = props.card.title
  isEditing.value = true
}

function saveEdit() {
  if (!editedTitle.value.trim()) return

  emit('update-card', {
    cardId: props.card.id,
    title: editedTitle.value
  })

  isEditing.value = false
}

function cancelEdit() {
  editedTitle.value = props.card.title
  isEditing.value = false
}
</script>

<template>
  <div class="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition">
    <div v-if="isEditing">
      <input
        v-model="editedTitle"
        @keydown.enter.prevent="saveEdit"
        @keydown.esc="cancelEdit"
        class="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div class="flex gap-2 mt-2">
        <button
          @click="saveEdit"
          class="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Save
        </button>

        <button
          @click="cancelEdit"
          class="text-gray-500 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>

    <div v-else class="flex items-center justify-between gap-2">
      <p
        class="text-sm text-gray-800 cursor-pointer flex-1"
        @click="startEditing"
      >
        {{ card.title }}
      </p>

      <button
        @click.stop="emit('delete-card', card.id)"
        class="text-red-500 hover:text-red-700 text-sm font-bold"
      >
        ×
      </button>
    </div>
  </div>
</template>