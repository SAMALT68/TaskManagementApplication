import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { useUser } from './useUser'


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
  const { currentUser } = useUser()
  const tasksRef = collection(db, 'tasks')

  onSnapshot(tasksRef, (snapshot) => {
    lists.value.forEach(list => list.cards = [])

    snapshot.forEach(doc => {
      const data = doc.data()

      // 🚫 Filter by project
      if (data.projectId !== currentUser.value.projectId) return

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

  const { currentUser } = useUser()

  if (currentUser.value.role === 'viewer') {
    alert('You do not have permission')
    return
  }

  try {
    console.log("Writing to Firebase...")

    await addDoc(collection(db, 'tasks'), {
      title,
      listId,
      userId: currentUser.value.id,
      role: currentUser.value.role,
      projectId: currentUser.value.projectId,
      createdAt: new Date()
    })

    console.log("SUCCESS writing to Firebase")

    // ✅ Update UI locally
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

