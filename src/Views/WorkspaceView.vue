<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import {
  useWorkspaces,
  type Workspace
} from '../composables/useWorkspaces'
import AppTopBar from '../components/AppTopBar.vue'

const emit = defineEmits<{
  (e: 'open-workspace', workspace: Workspace): void
}>()

const { userProfile } = useAuth()

const {
  workspaces,
  loadWorkspaces,
  createWorkspace,
  deleteWorkspace
} = useWorkspaces()

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

async function handleDeleteWorkspace(workspaceId: string) {
  const confirmed = confirm(
    'Are you sure you want to delete this workspace? This may also remove tasks linked to it.'
  )

  if (!confirmed) return

  await deleteWorkspace(workspaceId)
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <AppTopBar
      title="SwiftTask"
      subtitle="My Workspaces"
    />

    <div class="p-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            My Workspaces
          </h1>

          <p class="text-sm text-gray-600 mt-1">
            Select a workspace to open its task board.
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

      <!-- Create Workspace Form -->
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

      <!-- Empty State -->
      <div
        v-if="workspaces.length === 0"
        class="bg-white p-6 rounded-xl shadow-sm max-w-md text-gray-600"
      >
        No workspaces yet. Create one to get started.
      </div>

      <!-- Workspace Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl"
      >
        <div
          v-for="workspace in workspaces"
          :key="workspace.id"
          class="relative h-36 text-left p-4 border-2 rounded-md hover:shadow-md transition cursor-pointer"
          :class="[workspace.borderClass, workspace.bgClass]"
          @click="emit('open-workspace', workspace)"
        >
          <h2 class="font-semibold text-gray-800 pr-8">
            {{ workspace.title }}
          </h2>

          <p class="text-sm text-gray-600 mt-2">
            Project: {{ workspace.projectId }}
          </p>

          <p class="text-xs text-gray-500 mt-1">
            Click to open board
          </p>

          <button
            @click.stop="handleDeleteWorkspace(workspace.id)"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
            title="Delete workspace"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>