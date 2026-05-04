<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from './composables/useAuth'
import LoginView from './Views/LoginView.vue'
import BoardView from './Views/BoardView.vue'
import WorkspaceView from './Views/WorkspaceView.vue'

type Workspace = {
  id: string
  title: string
  projectId: string
  borderClass: string
  bgClass: string
}

const { currentUser, authLoaded } = useAuth()

const selectedWorkspace = ref<Workspace | null>(null)

function openWorkspace(workspace: Workspace) {
  selectedWorkspace.value = workspace
}

function goBackToWorkspaces() {
  selectedWorkspace.value = null
}
</script>

<template>
  <div v-if="!authLoaded" class="min-h-screen flex items-center justify-center">
    Loading...
  </div>

  <LoginView v-else-if="!currentUser" />

  <WorkspaceView
    v-else-if="!selectedWorkspace"
    @open-workspace="openWorkspace"
  />

  <BoardView
    v-else
    :workspace="selectedWorkspace"
    @back-to-workspaces="goBackToWorkspaces"
  />
</template>