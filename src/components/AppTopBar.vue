<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

defineProps<{
  title?: string
  subtitle?: string
}>()

const { currentUser, userProfile, logout } = useAuth()
</script>

<template>
  <div class="flex items-center justify-between px-6 py-4 bg-gray-200 border-b border-gray-300">
    <div>
      <h1 class="text-xl font-bold text-gray-800">
        {{ title || 'SwiftTask' }}
      </h1>

      <p v-if="subtitle" class="text-sm text-gray-600">
        {{ subtitle }}
      </p>

      <p class="text-xs text-gray-500 mt-1">
        Logged in as: {{ currentUser?.email }} |
        Role: {{ userProfile?.role }} |
        Project: {{ userProfile?.projectId }}
      </p>
    </div>

    <button
      @click="logout"
      class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  </div>
</template>