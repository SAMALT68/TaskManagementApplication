import { ref } from 'vue'

export type Role = 'admin' | 'member' | 'viewer'

export type User = {
  id: string
  name: string
  role: Role
  projectId: string
}

const currentUser = ref<User>({
  id: 'u1',
  name: 'User A',
  role: 'admin',
  projectId: 'p1'
})

function setUser(user: User) {
  currentUser.value = user
}

function setRole(role: Role) {
  currentUser.value.role = role
}

export function useUser() {
  return {
    currentUser,
    setUser,
    setRole
  }
}