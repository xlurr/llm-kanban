import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskLog, Subtask, TaskComment, Pipeline, PipelineStage, PipelineStageStatus, Attachment } from '@/lib/types'
import { mockTasks } from '@/lib/mock-data'

interface TasksState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'logs' | 'review' | 'createdBy'> & { createdBy?: string | null }) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  moveTask: (id: string, status: string) => void
  deleteTask: (id: string) => void
  addLog: (id: string, log: Omit<TaskLog, 'timestamp'>) => void
  assignAgent: (taskId: string, agentId: string) => void
  startExecution: (taskId: string) => void
  addSubtask: (taskId: string, title: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  removeSubtask: (taskId: string, subtaskId: string) => void
  addComment: (taskId: string, author: string, text: string) => void
  removeComment: (taskId: string, commentId: string) => void
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id' | 'addedAt'>) => void
  removeAttachment: (taskId: string, attachmentId: string) => void
  triggerPipeline: (taskId: string, branch: string, commit: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          createdBy: taskData.createdBy ?? null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          progress: 0,
          logs: [],
          review: null,
          pipelines: taskData.pipelines ?? [],
          attachments: taskData.attachments ?? [],
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
        }))
      },

      moveTask: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status, updatedAt: Date.now() } : t
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      },

      addLog: (id, log) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, logs: [...t.logs, { ...log, timestamp: Date.now() }], updatedAt: Date.now() }
              : t
          ),
        }))
      },

      assignAgent: (taskId, agentId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, assignedAgent: agentId, updatedAt: Date.now() } : t
          ),
        }))
      },

      startExecution: (taskId) => {
        const { moveTask, addLog, updateTask } = get()
        moveTask(taskId, 'executing')
        addLog(taskId, { message: 'Агент начал выполнение задачи...', type: 'info' })

        const messages = [
          { message: 'Анализ требований...', type: 'info' as const, progress: 15 },
          { message: 'Генерация кода...', type: 'info' as const, progress: 35 },
          { message: 'Компиляция и проверка типов...', type: 'info' as const, progress: 55 },
          { message: 'Запуск тестов...', type: 'warning' as const, progress: 70 },
          { message: 'Все тесты пройдены', type: 'success' as const, progress: 85 },
          { message: 'Форматирование и финализация...', type: 'info' as const, progress: 95 },
          { message: 'Задача выполнена успешно!', type: 'success' as const, progress: 100 },
        ]

        messages.forEach((msg, i) => {
          setTimeout(() => {
            addLog(taskId, { message: msg.message, type: msg.type })
            updateTask(taskId, { progress: msg.progress })
            if (i === messages.length - 1) {
              moveTask(taskId, 'review')
              updateTask(taskId, {
                review: {
                  reviewer: 'Авто-ревью',
                  score: Math.floor(Math.random() * 3) + 7,
                  comment: 'Код соответствует требованиям. Рекомендуется ручная проверка.',
                  timestamp: Date.now(),
                },
              })
            }
          }, (i + 1) * 2000)
        })
      },

      addSubtask: (taskId, title) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: [...t.subtasks, { id: `st-${Date.now()}`, title, done: false }],
                  updatedAt: Date.now(),
                }
              : t
          ),
        }))
      },

      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, done: !s.done } : s
                  ),
                  updatedAt: Date.now(),
                }
              : t
          ),
        }))
      },

      removeSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId), updatedAt: Date.now() }
              : t
          ),
        }))
      },

      addComment: (taskId, author, text) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...t.comments,
                    { id: `c-${Date.now()}`, author, text, timestamp: Date.now() },
                  ],
                  updatedAt: Date.now(),
                }
              : t
          ),
        }))
      },

      removeComment: (taskId, commentId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, comments: t.comments.filter((c) => c.id !== commentId), updatedAt: Date.now() }
              : t
          ),
        }))
      },

      addAttachment: (taskId, data) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  attachments: [...(t.attachments || []), { ...data, id: `att-${Date.now()}`, addedAt: Date.now() }],
                  updatedAt: Date.now(),
                }
              : t
          ),
        }))
      },

      removeAttachment: (taskId, attachmentId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, attachments: (t.attachments || []).filter((a) => a.id !== attachmentId), updatedAt: Date.now() }
              : t
          ),
        }))
      },

      triggerPipeline: (taskId, branch, commit) => {
        const { updateTask } = get()
        const task = get().tasks.find((t) => t.id === taskId)
        if (!task) return

        const stages: PipelineStage[] = [
          { id: 'lint', name: 'Lint', status: 'pending', needs: [], startedAt: null, finishedAt: null, log: '' },
          { id: 'typecheck', name: 'Typecheck', status: 'pending', needs: [], startedAt: null, finishedAt: null, log: '' },
          { id: 'build', name: 'Build', status: 'pending', needs: ['lint', 'typecheck'], startedAt: null, finishedAt: null, log: '' },
          { id: 'unit-test', name: 'Unit Tests', status: 'pending', needs: ['build'], startedAt: null, finishedAt: null, log: '' },
          { id: 'e2e-test', name: 'E2E Tests', status: 'pending', needs: ['build'], startedAt: null, finishedAt: null, log: '' },
          { id: 'security', name: 'Security Scan', status: 'pending', needs: ['build'], startedAt: null, finishedAt: null, log: '' },
          { id: 'deploy-staging', name: 'Deploy Staging', status: 'pending', needs: ['unit-test', 'e2e-test', 'security'], startedAt: null, finishedAt: null, log: '' },
          { id: 'deploy-prod', name: 'Deploy Prod', status: 'pending', needs: ['deploy-staging'], startedAt: null, finishedAt: null, log: '' },
        ]

        const pipeline: Pipeline = {
          id: `pl-${Date.now()}`,
          runNumber: (task.pipelines || []).length + 1,
          branch,
          commit,
          status: 'running',
          stages,
          triggeredAt: Date.now(),
          url: '#',
        }

        const pipelines = [...(task.pipelines || []), pipeline]
        updateTask(taskId, { pipelines })

        // Pre-decide which stage (if any) fails
        const failId = Math.random() < 0.25
          ? stages[Math.floor(Math.random() * stages.length)].id
          : null

        // Topological order with layers for simulation timing
        const resolved = new Set<string>()
        let tick = 0
        const schedule: { idx: number; tick: number }[] = []

        while (resolved.size < stages.length) {
          const layer = stages.filter(
            (s) => !resolved.has(s.id) && (s.needs || []).every((d) => resolved.has(d)),
          )
          if (layer.length === 0) break
          for (const s of layer) {
            schedule.push({ idx: stages.findIndex((x) => x.id === s.id), tick })
            resolved.add(s.id)
          }
          tick++
        }

        schedule.forEach(({ idx, tick: t }) => {
          setTimeout(() => {
            const task2 = get().tasks.find((x) => x.id === taskId)
            if (!task2) return
            const pls = [...(task2.pipelines || [])]
            const pl = { ...pls[pls.length - 1] }
            const stgs = [...pl.stages]

            const stage = stgs[idx]
            const deps = stage.needs || []
            const depFailed = deps.some((d) => stgs.find((s) => s.id === d)?.status === 'failed')
            const depSkipped = deps.some((d) => stgs.find((s) => s.id === d)?.status === 'skipped')

            if (depFailed || depSkipped) {
              stgs[idx] = { ...stage, status: 'skipped' }
            } else {
              const result: PipelineStageStatus = stage.id === failId ? 'failed' : 'success'
              stgs[idx] = {
                ...stage,
                status: result,
                startedAt: Date.now(),
                finishedAt: Date.now(),
                log: result === 'success'
                  ? `${stage.name} passed`
                  : `${stage.name} failed: exit code 1`,
              }
            }

            const allDone = stgs.every((s) => s.status !== 'pending')
            const anyFailed = stgs.some((s) => s.status === 'failed')
            pl.stages = stgs
            pl.status = allDone ? (anyFailed ? 'failed' : 'success') : 'running'
            pls[pls.length - 1] = pl
            updateTask(taskId, { pipelines: pls })
          }, (t + 1) * 1500)
        })
      },
    }),
    { name: 'tasks-storage' }
  )
)
