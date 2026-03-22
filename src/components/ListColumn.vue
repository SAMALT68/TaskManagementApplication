<script setup lang="ts">
defineProps<{
  id: string
  title: string
  cards: {
    id: number
    title: string
    description: string
  }[]
}>()

</script>

<template>
    <div class = "bg-gray-100 rounded-lg p-4 w-64 shrink-0">
        <h3 class = "text-lg font-semibold mb-4">{{ title }}</h3
  <div class="column">
    <h3>{{ title }}</h3>
    <div class="card" v-for="card in cards" :key="card.id">
      <h4>{{ card.title }}</h4>
      <p>{{ card.description }}</p>
    </div>
    <button>Add Card</button>
  </div>
  
</template>