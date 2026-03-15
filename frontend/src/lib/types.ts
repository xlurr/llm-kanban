export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type AgentType = 'claude-code' | 'codex' | 'gemini-cli' | 'custom'

export interface Agent {
  id: string
  name: string
  type: AgentType
  avatar: string
  status: 'idle' | 'busy' | 'offline'
  tasksCompleted: number
  successRate: number
}

export interface TaskLog {
  timestamp: number
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export interface TaskReview {
  reviewer: string
  score: number // 1-10
  comment: string
  timestamp: number
}

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface TaskComment {
  id: string
  author: string
  text: string
  timestamp: number
}

export interface Task {
  id: string
  title: string
  description: string
  prompt: string
  status: string // now a free-form column id
  priority: TaskPriority
  assignedAgent: string | null
  epicId: string | null
  createdAt: number
  updatedAt: number
  deadline: number | null
  estimatedTime: number // minutes
  progress: number // 0-100
  logs: TaskLog[]
  review: TaskReview | null
  tags: string[]
  subtasks: Subtask[]
  comments: TaskComment[]
  color: string // hex color for left border accent
}

export type EpicStatus = 'planning' | 'active' | 'completed' | 'archived'

export interface Epic {
  id: string
  name: string
  description: string
  color: string
  status: EpicStatus
  startDate: number | null
  targetDate: number | null
  createdAt: number
  updatedAt: number
}

export interface Column {
  id: string
  title: string
  color: string // hex color for column header accent
  limit?: number // WIP limit
}

// Transition rule: which column can move to which
export interface TransitionRule {
  from: string // column id
  to: string // column id
}

export interface BoardConfig {
  id: string
  name: string
  columns: Column[]
  transitions: TransitionRule[]
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
}

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'backlog', title: 'Бэклог', color: '#64748b' },
  { id: 'in_progress', title: 'В работе', color: '#3b82f6' },
  { id: 'review', title: 'Ревью', color: '#eab308' },
  { id: 'done', title: 'Готово', color: '#22c55e' },
]

export const DEFAULT_TRANSITIONS: TransitionRule[] = [
  { from: 'backlog', to: 'in_progress' },
  { from: 'in_progress', to: 'review' },
  { from: 'review', to: 'done' },
  { from: 'review', to: 'in_progress' },
  { from: 'in_progress', to: 'backlog' },
]
