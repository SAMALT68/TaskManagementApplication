<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import {
  useWorkspaces,
  type Workspace
} from '../composables/useWorkspaces'

const emit = defineEmits<{
  (e: 'open-workspace', workspace: Workspace): void
}>()

const { userProfile } = useAuth()
const { workspaces, loadWorkspaces, createWorkspace } = useWorkspaces()

const showForm = ref(false)
const newWorkspaceTitle = ref('')

watch(
  userProfile,
  (profile) => {
    if (profile) {
      loadWorkspaces()
    }
  },
  { immediate: true }
)

async function handleCreateWorkspace() {
  if (!newWorkspaceTitle.value.trim()) return

  await createWorkspace(newWorkspaceTitle.value)

  newWorkspaceTitle.value = ''
  showForm.value = false
}

function cancelCreate() {
  newWorkspaceTitle.value = ''
  showForm.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            My Workspaces
          </h1>

          <p class="text-sm text-gray-600 mt-1">
            Project: {{ userProfile?.projectId }}
          </p>
        </div>

        <button
          v-if="!showForm"
          @click="showForm = true"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Workspace
        </button>
      </div>

      <div
        v-if="showForm"
        class="bg-white p-4 rounded-xl shadow-sm mb-6 max-w-md"
      >
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Workspace Name
        </label>

        <input
          v-model="newWorkspaceTitle"
          @keydown.enter.prevent="handleCreateWorkspace"
          placeholder="e.g. Final Year Project"
          class="w-full border rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div class="flex gap-2">
          <button
            @click="handleCreateWorkspace"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>

          <button
            @click="cancelCreate"
            class="text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>

      <div
        v-if="workspaces.length === 0"
        class="bg-white p-6 rounded-xl shadow-sm max-w-md text-gray-600"
      >
        No workspaces yet. Create one to get started.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        <button
          v-for="workspace in workspaces"
          :key="workspace.id"
          @click="emit('open-workspace', workspace)"
          class="h-36 text-left p-4 border-2 rounded-md hover:shadow-md transition"
          :class="[workspace.borderClass, workspace.bgClass]"
        >
          <h2 class="font-semibold text-gray-800">
            {{ workspace.title }}
          </h2>

          <p class="text-sm text-gray-600 mt-2">
            Project: {{ workspace.projectId }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>