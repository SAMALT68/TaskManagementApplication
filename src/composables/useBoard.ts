import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
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

function loadTasks() {
  const { userProfile } = useAuth()
  const tasksRef = collection(db, 'tasks')

  onSnapshot(tasksRef, (snapshot) => {
    lists.value.forEach(list => list.cards = [])

    snapshot.forEach(doc => {
      const data = doc.data()

      if (!userProfile.value) return
      if (data.projectId !== userProfile.value.projectId) return

      const list = lists.value.find(l => l.id === data.listId)
      if (!list) return

      list.cards.push({
        id: doc.id,
        title: data.title
      })
    })
  })
}
async function addCard(listId: string, title: string) {
  console.log("ADD CARD FUNCTION HIT")

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
    console.log("Writing to Firebase...")

    await addDoc(collection(db, 'tasks'), {
      title,
      listId,
      userId: currentUser.value.uid,
      role: userProfile.value.role,
      projectId: userProfile.value.projectId,
      createdAt: new Date()
    })

    console.log("SUCCESS writing to Firebase")

    const list = lists.value.find(l => l.id === listId)
    if (!list) return

    list.cards.push({
      id: Date.now().toString(),
      title
    })

  } catch (error) {
    console.error("Firebase error:", error)
  }
}
export function useBoard() {
  return {
    lists,
    addCard,
    loadTasks
  }
}

