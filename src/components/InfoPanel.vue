<script setup lang="ts">
defineProps<{
  panel: 'how-to-use' | 'security-info'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 class="text-xl font-bold text-gray-800">
            {{ panel === 'how-to-use' ? 'How to use SwiftTask' : 'Security information' }}
          </h2>

          <p class="text-sm text-gray-500 mt-1">
            {{ panel === 'how-to-use'
              ? 'Quick guide for using the task board.'
              : 'Overview of the security model used in this project.' }}
          </p>
        </div>

        <button
          type="button"
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <div v-if="panel === 'how-to-use'" class="space-y-3 text-sm text-gray-700">
        <p>
          SwiftTask organises work into workspaces and task boards.
        </p>

        <ul class="list-disc pl-5 space-y-2">
          <li>Create a workspace for a project or category of work.</li>
          <li>Open a workspace to view its task board.</li>
          <li>Add cards to the To do column.</li>
          <li>Move cards between To do, This Week, and Completed.</li>
          <li>Click a task title to edit it if your role allows editing.</li>
        </ul>

        <p class="text-xs text-gray-500">
          Available controls depend on your assigned role.
        </p>
      </div>

      <div v-else class="space-y-3 text-sm text-gray-700">
        <p>
          SwiftTask uses Firebase Authentication and Firestore Security Rules to control access.
        </p>

        <ul class="list-disc pl-5 space-y-2">
          <li>Users are authenticated before accessing workspaces or tasks.</li>
          <li>User profiles store role and project membership.</li>
          <li>Viewers can read data but cannot create, update, move, or delete tasks.</li>
          <li>Members can create, edit, and move tasks, but cannot delete them.</li>
          <li>Admins can create, edit, move, and delete tasks and workspaces.</li>
          <li>Project IDs are used to separate data between users and workspaces.</li>
        </ul>

        <p class="text-xs text-gray-500">
          Frontend controls improve usability, while Firestore Security Rules provide backend enforcement.
        </p>
      </div>
    </div>
  </div>
</template>