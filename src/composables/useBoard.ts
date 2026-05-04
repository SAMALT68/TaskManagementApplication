import { ref } from 'vue'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore'
import { useAuth } from './useAuth'

export type Card = {
  id: string
  title: string
}

export type List = {
  id: string
  title: string
  cards: Card[]
}

const lists = ref<List[]>([
  {
    id: '1',
    title: 'To do',
    cards: []
  },
  {
    id: '2',
    title: 'This Week',
    cards: []
  },
  {
    id: '3',
    title: 'Completed',
    cards: []
  }
])

async function addCard(listId: string, title: string, workspaceId: string) {
  const { currentUser, userProfile } = useAuth()

  if (!currentUser.value || !userProfile.value) {
    alert('You must be logged in to add tasks')
    return
  }

  if (userProfile.value.role === 'viewer') {
    alert('You do not have permission to add tasks')
    return
  }

  try {
    await addDoc(collection(db, 'tasks'), {
      title,
      listId,
      workspaceId,
      userId: currentUser.value.uid,
      role: userProfile.value.role,
      projectId: userProfile.value.projectId,
      createdAt: new Date()
    })
  } catch (error) {
    console.error('FIRESTORE WRITE ERROR:', error)
  }
}

async function deleteCard(cardId: string) {
  const { userProfile } = useAuth()

  if (!userProfile.value) {
    alert('User profile not loaded')
    return
  }

  if (userProfile.value.role !== 'admin') {
    alert('Only admins can delete tasks')
    return
  }

  try {
    await deleteDoc(doc(db, 'tasks', cardId))
    console.log('Task deleted successfully')
  } catch (error) {
    console.error('FIRESTORE DELETE ERROR:', error)
    alert('Delete failed. Check permissions.')
  }
}

async function updateCard(cardId: string, newTitle: string) {
  const { userProfile } = useAuth()

  if (!userProfile.value) {
    alert('User profile not loaded')
    return
  }

  if (userProfile.value.role === 'viewer') {
    alert('Viewers cannot update tasks')
    return
  }

  try {
    await updateDoc(doc(db, 'tasks', cardId), {
      title: newTitle,
      updatedAt: new Date()
    })

    console.log('Task updated successfully')
  } catch (error) {
    console.error('FIRESTORE UPDATE ERROR:', error)
    alert('Update failed. Check permissions.')
  }
}

async function moveCard(cardId: string, newListId: string) {
  const { userProfile } = useAuth()

  if (!userProfile.value) {
    alert('User profile not loaded')
    return
  }

  if (userProfile.value.role === 'viewer') {
    alert('Viewers cannot move tasks')
    return
  }

  try {
    await updateDoc(doc(db, 'tasks', cardId), {
      listId: newListId,
      updatedAt: new Date()
    })

    console.log('Task moved successfully')
  } catch (error) {
    console.error('FIRESTORE MOVE ERROR:', error)
    alert('Move failed. Check permissions.')
  }
}

function loadTasks(workspaceId: string) {
  const { userProfile } = useAuth()

  if (!userProfile.value) {
    console.log('No user profile yet')
    return
  }

  const tasksQuery = query(
    collection(db, 'tasks'),
    where('projectId', '==', userProfile.value.projectId),
    where('workspaceId', '==', workspaceId)
  )

  onSnapshot(
    tasksQuery,
    (snapshot) => {
      lists.value.forEach(list => {
        list.cards = []
      })

      snapshot.forEach(doc => {
        const data = doc.data()

        const list = lists.value.find(l => l.id === data.listId)
        if (!list) return

        list.cards.push({
          id: doc.id,
          title: data.title
        })
      })
    },
    (error) => {
      console.error('FIRESTORE READ ERROR:', error)
    }
  )
}

export function useBoard() {
  return {
    lists,
    addCard,
    deleteCard,
    updateCard,
    moveCard,
    loadTasks
  }
}