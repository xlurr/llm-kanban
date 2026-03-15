import { useState } from 'react'
import { useTasksStore } from '@/stores/tasks-store'
import { useAgentsStore } from '@/stores/agents-store'
import { useBoardStore } from '@/stores/board-store'
import { useEpicsStore } from '@/stores/epics-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import type { TaskPriority } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStatus?: string
}

const TASK_COLORS = [
  '#3b82f6', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#a855f7',
]

export function CreateTaskDialog({ open, onOpenChange, initialStatus }: Props) {
  const { addTask } = useTasksStore()
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
  const [status, setStatus] = useState(initialStatus || columns[0]?.id || 'backlog')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTask({
      title,
      description,
      prompt,
      status,
      priority,
      assignedAgent: agentId || null,
      epicId: epicId || null,
      estimatedTime,
      deadline: deadline ? new Date(deadline).getTime() : null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      subtasks: [],
      comments: [],
      color,
    })
    onOpenChange(false)
    setTitle('')
    setDescription('')
    setPrompt('')
    setPriority('medium')
    setAgentId('')
    setEpicId('')
    setTags('')
    setEstimatedTime(30)
    setDeadline('')
    setColor('#3b82f6')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название задачи" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание задачи" rows={2} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Промпт для агента</label>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Промпт, который получит LLM-агент" rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Столбец</label>
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
              <Input type="number" value={estimatedTime} onChange={(e) => setEstimatedTime(+e.target.value)} min={5} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Теги (через запятую)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="backend, api" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Цвет карточки</label>
            <div className="flex gap-2">
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
          <Button type="submit" className="w-full">
            Создать задачу
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
