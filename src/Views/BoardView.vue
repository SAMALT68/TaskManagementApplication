
<script setup lang="ts">
type card = {
  id: number
  title: string
  description: string
}

type list = {
  id: number
  title: string
  cards: card[]
}

const lists: list[] = [
  {
    id: 1,
    title: 'To do',
    cards: [
      { id: 1, title: 'Task 1', description: 'Description for Task 1' },
      { id: 2, title: 'Task 2', description: 'Description for Task 2' },
    ],
  },
  {
    id: 2,
    title: 'This Week',
    cards: [],
  },
  {
    id: 3,
    title: 'Completed',
    cards: [],
  },
]


</script>

<template>
<div class="flex gap-4 overflow-x-auto p-4 h-full"></div>
<ListColumn
  v-for="list in lists"
  :key="list.id"
  :list="list"
/>

  <div class="board">
    <div class="columns">
      <div class="column" v-for="list in lists" :key="list.id">
        <h3>{{ list.title }}</h3>
        <div class="card" v-for="card in list.cards" :key="card.id">
          <h4>{{ card.title }}</h4>
          <p>{{ card.description }}</p>
        </div>
        <button>Add Card</button>
      </div> 

      <div class="column">
        <h3>This Week</h3>
        <button>Add Card</button>
      </div>

      <div class="column">
        <h3>Completed</h3>
        <button>Add Card</button>
      </div>
    </div>
  </div>
</template>

