import { ref } from 'vue'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where, 
  deleteDoc, 
  doc
} from 'firebase/firestore'
import { useAuth } from './useAuth'

export type Workspace = {
  id: string
  title: string
  projectId: string
  borderClass: string
  bgClass: string
}

const workspaces = ref<Workspace[]>([])

const colourOptions = [
  {
    borderClass: 'border-blue-400',
    bgClass: 'bg-blue-100'
  },
  {
    borderClass: 'border-red-400',
    bgClass: 'bg-red-100'
  },
  {
    borderClass: 'border-orange-400',
    bgClass: 'bg-orange-100'
  },
  {
    borderClass: 'border-purple-400',
    bgClass: 'bg-purple-100'
  },
  {
    borderClass: 'border-green-400',
    bgClass: 'bg-green-100'
  }
]

function loadWorkspaces() {
  const { userProfile } = useAuth()

  if (!userProfile.value) {
    console.log('No user profile loaded yet')
    return
  }

  const workspacesQuery = query(
    collection(db, 'workspaces'),
    where('projectId', '==', userProfile.value.projectId)
  )

  onSnapshot(
    workspacesQuery,
    (snapshot) => {
      workspaces.value = []

      snapshot.forEach(doc => {
        const data = doc.data()

        workspaces.value.push({
          id: doc.id,
          title: data.title,
          projectId: data.projectId,
          borderClass: data.borderClass,
          bgClass: data.bgClass
        })
      })
    },
    (error) => {
      console.error('FIRESTORE WORKSPACES READ ERROR:', error)
    }
  )
}

async function createWorkspace(title: string) {
  const { currentUser, userProfile } = useAuth()

  if (!currentUser.value || !userProfile.value) {
    alert('You must be logged in to create a workspace')
    return
  }

  if (userProfile.value.role === 'viewer') {
    alert('Viewers cannot create workspaces')
    return
  }

  const colour = colourOptions[workspaces.value.length % colourOptions.length]

  try {
    await addDoc(collection(db, 'workspaces'), {
      title,
      projectId: userProfile.value.projectId,
      createdBy: currentUser.value.uid,
      borderClass: colour.borderClass,
      bgClass: colour.bgClass,
      createdAt: new Date()
    })
  } catch (error) {
    console.error('FIRESTORE WORKSPACE WRITE ERROR:', error)
    alert('Workspace creation failed')
  }
}
async function deleteWorkspace(workspaceId: string) {
  const { userProfile } = useAuth()

  if (!userProfile.value) {
    alert('User profile not loaded')
    return
  }

  if (userProfile.value.role !== 'admin') {
    alert('Only admins can delete workspaces')
    return
  }

  try {
    await deleteDoc(doc(db, 'workspaces', workspaceId))
    console.log('Workspace deleted successfully')
  } catch (error) {
    console.error('FIRESTORE WORKSPACE DELETE ERROR:', error)
    alert('Workspace deletion failed. Check permissions.')
  }
}
export function useWorkspaces() {
  return {
    workspaces,
    loadWorkspaces,
    createWorkspace,
    deleteWorkspace
  }
}