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
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
    <!-- Editing Mode -->
    <div v-if="isEditing">
      <input
        v-model="editedTitle"
        @keydown.enter.prevent="saveEdit"
        @keydown.esc="cancelEdit"
        class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div class="flex gap-2 mt-3">
        <button
          @click="saveEdit"
          class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
        >
          Save
        </button>

        <button
          @click="cancelEdit"
          class="text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Display Mode -->
    <div v-else class="flex items-start justify-between gap-3">
      <p
        class="text-sm font-medium text-gray-800 cursor-pointer flex-1 text-left leading-snug"
        @click="startEditing"
      >
        {{ card.title }}
      </p>

      <button
        @click.stop="emit('delete-card', card.id)"
        class="text-red-500 hover:text-red-700 text-sm font-bold leading-none"
        title="Delete task"
      >
        ×
      </button>
    </div>
  </div>
</template>