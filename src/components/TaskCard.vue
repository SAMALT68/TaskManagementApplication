<script setup lang="ts">
import { ref } from 'vue'

type Priority = 'low' | 'medium' | 'high'

const props = defineProps<{
  card: {
    id: string
    title: string
    description?: string
    priority?: Priority
    createdAt?: any
    updatedAt?: any
  }
  canWrite: boolean
  canDelete: boolean
}>()

const emit = defineEmits<{
  (e: 'delete-card', cardId: string): void
  (e: 'update-card', payload: {
    cardId: string
    title: string
    description: string
    priority: Priority
  }): void
}>()

const isEditing = ref(false)
const editedTitle = ref(props.card.title)
const editedDescription = ref(props.card.description || '')
const editedPriority = ref<Priority>(props.card.priority || 'medium')

function startEditing() {
  if (!props.canWrite) return

  editedTitle.value = props.card.title
  editedDescription.value = props.card.description || ''
  editedPriority.value = props.card.priority || 'medium'
  isEditing.value = true
}

function saveEdit() {
  if (!editedTitle.value.trim()) return

  emit('update-card', {
    cardId: props.card.id,
    title: editedTitle.value,
    description: editedDescription.value,
    priority: editedPriority.value
  })

  isEditing.value = false
}

function cancelEdit() {
  editedTitle.value = props.card.title
  editedDescription.value = props.card.description || ''
  editedPriority.value = props.card.priority || 'medium'
  isEditing.value = false
}

function formatDate(value: any) {
  if (!value) return ''

  const date = value.toDate ? value.toDate() : new Date(value)

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function priorityClasses(priority?: Priority) {
  if (priority === 'high') {
    return 'bg-red-100 text-red-700 border-red-200'
  }

  if (priority === 'low') {
    return 'bg-green-100 text-green-700 border-green-200'
  }

  return 'bg-yellow-100 text-yellow-700 border-yellow-200'
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
    <!-- Editing Mode -->
    <div v-if="isEditing">
      <label class="block text-xs font-semibold text-gray-600 mb-1">
        Task title
      </label>

      <input
        v-model="editedTitle"
        @keydown.enter.prevent="saveEdit"
        @keydown.esc="cancelEdit"
        class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label class="block text-xs font-semibold text-gray-600 mt-3 mb-1">
        Description
      </label>

      <textarea
        v-model="editedDescription"
        rows="3"
        placeholder="Add task details..."
        class="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label class="block text-xs font-semibold text-gray-600 mt-3 mb-1">
        Priority
      </label>

      <select
        v-model="editedPriority"
        class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

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
    <div v-else>
      <div class="flex items-start justify-between gap-3">
        <div
          class="flex-1 text-left"
          :class="canWrite ? 'cursor-pointer' : 'cursor-default'"
          @click="startEditing"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-[11px] px-2 py-0.5 rounded-full border font-medium capitalize"
              :class="priorityClasses(card.priority)"
            >
              {{ card.priority || 'medium' }}
            </span>
          </div>

          <p
            class="text-sm font-medium text-gray-800 leading-snug"
            :class="canWrite ? 'hover:text-blue-700' : ''"
          >
            {{ card.title }}
          </p>

          <p
            v-if="card.description"
            class="text-xs text-gray-500 mt-2 line-clamp-2"
          >
            {{ card.description }}
          </p>

          <p
            v-else
            class="text-xs text-gray-400 mt-2 italic"
          >
            No description
          </p>

          <p
            v-if="card.updatedAt || card.createdAt"
            class="text-[11px] text-gray-400 mt-2"
          >
            {{ card.updatedAt ? 'Updated' : 'Created' }}:
            {{ formatDate(card.updatedAt || card.createdAt) }}
          </p>
        </div>

        <button
          v-if="canDelete"
          @click.stop="emit('delete-card', card.id)"
          class="text-red-500 hover:text-red-700 text-sm font-bold leading-none"
          title="Delete task"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>