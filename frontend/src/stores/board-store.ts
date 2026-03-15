import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Column, TransitionRule } from '@/lib/types'
import { DEFAULT_COLUMNS, DEFAULT_TRANSITIONS } from '@/lib/types'

interface BoardState {
  columns: Column[]
  transitions: TransitionRule[]
  addColumn: (column: Column) => void
  updateColumn: (id: string, updates: Partial<Column>) => void
  removeColumn: (id: string) => void
  reorderColumns: (columns: Column[]) => void
  addTransition: (rule: TransitionRule) => void
  removeTransition: (from: string, to: string) => void
  setTransitions: (transitions: TransitionRule[]) => void
  canTransition: (from: string, to: string) => boolean
  getAllowedTargets: (from: string) => string[]
  resetToDefaults: () => void
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      columns: DEFAULT_COLUMNS,
      transitions: DEFAULT_TRANSITIONS,

      addColumn: (column) => {
        set((state) => ({ columns: [...state.columns, column] }))
      },

      updateColumn: (id, updates) => {
        set((state) => ({
          columns: state.columns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }))
      },

      removeColumn: (id) => {
        set((state) => ({
          columns: state.columns.filter((c) => c.id !== id),
          transitions: state.transitions.filter((t) => t.from !== id && t.to !== id),
        }))
      },

      reorderColumns: (columns) => {
        set({ columns })
      },

      addTransition: (rule) => {
        set((state) => {
          const exists = state.transitions.some((t) => t.from === rule.from && t.to === rule.to)
          if (exists) return state
          return { transitions: [...state.transitions, rule] }
        })
      },

      removeTransition: (from, to) => {
        set((state) => ({
          transitions: state.transitions.filter((t) => !(t.from === from && t.to === to)),
        }))
      },

      setTransitions: (transitions) => {
        set({ transitions })
      },

      canTransition: (from, to) => {
        const { transitions } = get()
        // If no transitions defined, allow all
        if (transitions.length === 0) return true
        return transitions.some((t) => t.from === from && t.to === to)
      },

      getAllowedTargets: (from) => {
        const { transitions } = get()
        if (transitions.length === 0) return get().columns.map((c) => c.id)
        return transitions.filter((t) => t.from === from).map((t) => t.to)
      },

      resetToDefaults: () => {
        set({ columns: DEFAULT_COLUMNS, transitions: DEFAULT_TRANSITIONS })
      },
    }),
    { name: 'board-storage' }
  )
)
