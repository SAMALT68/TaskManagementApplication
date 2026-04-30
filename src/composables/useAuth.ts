import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'

import { auth,db } from '../firebase'
import {
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore'



const currentUser = ref<User | null>(null)
const userProfile = ref<any>(null)
const authLoaded = ref(false)

onAuthStateChanged(auth, async (user) => {
  currentUser.value = user

  if (user) {
    const docRef = doc(db, 'users', user.uid)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      userProfile.value = snapshot.data()
    }
  } else {
    userProfile.value = null
  }

  authLoaded.value = true
})

async function register(email: string, password: string) {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  await setDoc(doc(db, 'users', credentials.user.uid), {
    email,
    role: 'member',
    projectId: 'p1',
    createdAt: new Date()
  })
}

async function login(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

async function logout() {
  await signOut(auth)
}

export function useAuth() {
  return {
    currentUser,
    userProfile,
    authLoaded,
    register,
    login,
    logout
  }
}

