<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')

const { login, register } = useAuth()

async function handleLogin() {
  try {
    await login(email.value, password.value)
    alert('Logged in!')
  } catch (error) {
    console.error(error)
    alert('Login failed')
  }
}

async function handleRegister() {
  try {
    await register(email.value, password.value)
    alert('Account created!')
  } catch (error) {
    console.error(error)
    alert('Registration failed')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-md w-80">
      <h1 class="text-2xl font-bold mb-4">
        SwiftTask Login
      </h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border p-2 rounded mb-3"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border p-2 rounded mb-4"
      />

      <div class="flex gap-2">
        <button
          @click="handleLogin"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>

        <button
          @click="handleRegister"
          class="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>