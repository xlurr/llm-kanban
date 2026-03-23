import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Epic, EpicStatus, Attachment } from '@/lib/types'
import { mockEpics } from '@/lib/mock-data'

interface EpicsState {
  epics: Epic[]
  addEpic: (epic: Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEpic: (id: string, updates: Partial<Epic>) => void
  deleteEpic: (id: string) => void
  getEpic: (id: string) => Epic | undefined
  addAttachment: (epicId: string, attachment: Omit<Attachment, 'id' | 'addedAt'>) => void
  removeAttachment: (epicId: string, attachmentId: string) => void
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
          attachments: data.attachments ?? [],
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

      addAttachment: (epicId, data) => {
        set((state) => ({
          epics: state.epics.map((e) =>
            e.id === epicId
              ? {
                  ...e,
                  attachments: [...(e.attachments || []), { ...data, id: `att-${Date.now()}`, addedAt: Date.now() }],
                  updatedAt: Date.now(),
                }
              : e
          ),
        }))
      },

      removeAttachment: (epicId, attachmentId) => {
        set((state) => ({
          epics: state.epics.map((e) =>
            e.id === epicId
              ? { ...e, attachments: (e.attachments || []).filter((a) => a.id !== attachmentId), updatedAt: Date.now() }
              : e
          ),
        }))
      },
    }),
    { name: 'epics-storage' }
  )
)
