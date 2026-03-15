import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Epic, EpicStatus } from '@/lib/types'
import { mockEpics } from '@/lib/mock-data'

interface EpicsState {
  epics: Epic[]
  addEpic: (epic: Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEpic: (id: string, updates: Partial<Epic>) => void
  deleteEpic: (id: string) => void
  getEpic: (id: string) => Epic | undefined
}

export const useEpicsStore = create<EpicsState>()(
  persist(
    (set, get) => ({
      epics: mockEpics,

      addEpic: (data) => {
        const epic: Epic = {
          ...data,
          id: `epic-${Date.now()}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({ epics: [...state.epics, epic] }))
      },

      updateEpic: (id, updates) => {
        set((state) => ({
          epics: state.epics.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
          ),
        }))
      },

      deleteEpic: (id) => {
        set((state) => ({ epics: state.epics.filter((e) => e.id !== id) }))
      },

      getEpic: (id) => get().epics.find((e) => e.id === id),
    }),
    { name: 'epics-storage' }
  )
)
