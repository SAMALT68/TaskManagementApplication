<script setup lang="ts">
import { useAuth } from './composables/useAuth'
import LoginView from './Views/LoginView.vue'
import BoardView from './Views/BoardView.vue'

const { currentUser, authLoaded } = useAuth()
</script>

<template>
  <div v-if="!authLoaded" class="min-h-screen flex items-center justify-center">
    Loading...
  </div>

  <LoginView v-else-if="!currentUser" />

  <BoardView v-else />
</template>