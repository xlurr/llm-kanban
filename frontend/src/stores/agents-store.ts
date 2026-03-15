import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent } from '@/lib/types'
import { mockAgents } from '@/lib/mock-data'

interface AgentsState {
  agents: Agent[]
  getAgent: (id: string) => Agent | undefined
}

export const useAgentsStore = create<AgentsState>()(
  persist(
    (set, get) => ({
      agents: mockAgents,
      getAgent: (id) => get().agents.find((a) => a.id === id),
    }),
    { name: 'agents-storage' }
  )
)
