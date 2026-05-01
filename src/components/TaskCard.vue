<script setup lang="ts">
defineProps<{
  card: {
    id: string
    title: string
  }
}>()

const emit = defineEmits<{
  (e: 'delete-card', cardId: string): void
}>()
</script>

<template>
  <div class="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between">
    <p class="text-sm text-gray-800">
      {{ card.title }}
    </p>

    <button
      @click.stop="emit('delete-card', card.id)"
      class="text-red-500 hover:text-red-700 text-sm font-bold"
    >
      ×
    </button>
  </div>
</template>