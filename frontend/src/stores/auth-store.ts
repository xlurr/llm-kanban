import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
}

const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@llmkanban.ru',
    password: 'admin123',
    user: { id: 'user-1', name: 'Администратор', email: 'admin@llmkanban.ru', role: 'admin' },
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const stored = JSON.parse(localStorage.getItem('registered_users') || '[]') as typeof MOCK_USERS
        const allUsers = [...MOCK_USERS, ...stored]
        const found = allUsers.find((u) => u.email === email && u.password === password)
        if (found) {
          set({ user: found.user, isAuthenticated: true })
          return true
        }
        return false
      },

      register: (name: string, email: string, password: string) => {
        const stored = JSON.parse(localStorage.getItem('registered_users') || '[]') as typeof MOCK_USERS
        const allUsers = [...MOCK_USERS, ...stored]
        if (allUsers.some((u) => u.email === email)) return false

        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          role: 'manager',
        }
        stored.push({ email, password, user: newUser })
        localStorage.setItem('registered_users', JSON.stringify(stored))
        set({ user: newUser, isAuthenticated: true })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' }
  )
)
