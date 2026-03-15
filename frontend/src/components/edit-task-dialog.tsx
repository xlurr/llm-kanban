import { useState, useEffect } from 'react'
import { useTasksStore } from '@/stores/tasks-store'
import { useAgentsStore } from '@/stores/agents-store'
import { useBoardStore } from '@/stores/board-store'
import { useEpicsStore } from '@/stores/epics-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import type { Task, TaskPriority } from '@/lib/types'

interface Props {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TASK_COLORS = [
  '#3b82f6', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#a855f7',
]

export function EditTaskDialog({ task, open, onOpenChange }: Props) {
  const { updateTask } = useTasksStore()
  const { agents } = useAgentsStore()
  const { columns } = useBoardStore()
  const { epics } = useEpicsStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [agentId, setAgentId] = useState('')
  const [epicId, setEpicId] = useState('')
  const [tags, setTags] = useState('')
  const [estimatedTime, setEstimatedTime] = useState(30)
  const [deadline, setDeadline] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPrompt(task.prompt)
      setPriority(task.priority)
      setAgentId(task.assignedAgent || '')
      setEpicId(task.epicId || '')
      setTags(task.tags.join(', '))
      setEstimatedTime(task.estimatedTime)
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '')
      setColor(task.color || '#3b82f6')
      setStatus(task.status)
    }
  }, [task])

  if (!task) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateTask(task.id, {
      title,
      description,
      prompt,
      priority,
      assignedAgent: agentId || null,
      epicId: epicId || null,
      estimatedTime,
      deadline: deadline ? new Date(deadline).getTime() : null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      color,
      status,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование задачи</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Промпт для агента</label>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Статус</label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={columns.map((c) => ({ value: c.id, label: c.title }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Приоритет</label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                options={[
                  { value: 'low', label: 'Низкий' },
                  { value: 'medium', label: 'Средний' },
                  { value: 'high', label: 'Высокий' },
                  { value: 'critical', label: 'Критический' },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Агент</label>
              <Select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                options={[
                  { value: '', label: 'Не назначен' },
                  ...agents.map((a) => ({ value: a.id, label: a.name })),
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Эпик</label>
              <Select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                options={[
                  { value: '', label: 'Без эпика' },
                  ...epics.filter((e) => e.status !== 'archived').map((e) => ({ value: e.id, label: e.name })),
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Дедлайн</label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Оценка времени (мин)</label>
              <Input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(+e.target.value)}
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Теги (через запятую)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="backend, api" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Цвет карточки</label>
            <div className="flex gap-2 flex-wrap">
              {TASK_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? 'white' : 'transparent',
                    boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Сохранить</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
