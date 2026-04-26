<script setup lang="ts">
defineProps<{
  card: {
    id: string
    title: string
  }
}>()
</script>

<template>
  <div class="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer">
    <p class="text-sm text-gray-800">
      {{ card.title }}
    </p>
  </div>
</template>