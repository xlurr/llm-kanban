import { useState } from 'react'
import { useEpicsStore } from '@/stores/epics-store'
import { useTasksStore } from '@/stores/tasks-store'
import { useBoardStore } from '@/stores/board-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Plus, Pencil, Trash2, Layers, CalendarClock, ListChecks,
  ChevronDown, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import type { Epic, EpicStatus } from '@/lib/types'

const EPIC_COLORS = [
  '#3b82f6', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1', '#a855f7',
]

const statusLabels: Record<EpicStatus, string> = {
  planning: 'Планирование',
  active: 'Активный',
  completed: 'Завершён',
  archived: 'В архиве',
}

const statusBadgeColors: Record<EpicStatus, string> = {
  planning: 'bg-slate-500/15 text-slate-400',
  active: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-green-500/15 text-green-400',
  archived: 'bg-muted text-muted-foreground',
}

interface EpicFormData {
  name: string
  description: string
  color: string
  status: EpicStatus
  startDate: string
  targetDate: string
}

const emptyForm: EpicFormData = {
  name: '',
  description: '',
  color: '#3b82f6',
  status: 'planning',
  startDate: '',
  targetDate: '',
}

export function EpicsPage() {
  const { epics, addEpic, updateEpic, deleteEpic } = useEpicsStore()
  const { tasks, updateTask } = useTasksStore()
  const { columns } = useBoardStore()
  const navigate = useNavigate()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null)
  const [form, setForm] = useState<EpicFormData>(emptyForm)
  const [expandedEpic, setExpandedEpic] = useState<string | null>(null)
  const [linkDialogEpic, setLinkDialogEpic] = useState<string | null>(null)

  const openCreate = () => {
    setEditingEpic(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (epic: Epic) => {
    setEditingEpic(epic)
    setForm({
      name: epic.name,
      description: epic.description,
      color: epic.color,
      status: epic.status,
      startDate: epic.startDate ? new Date(epic.startDate).toISOString().split('T')[0] : '',
      targetDate: epic.targetDate ? new Date(epic.targetDate).toISOString().split('T')[0] : '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: form.name,
      description: form.description,
      color: form.color,
      status: form.status,
      startDate: form.startDate ? new Date(form.startDate).getTime() : null,
      targetDate: form.targetDate ? new Date(form.targetDate).getTime() : null,
    }
    if (editingEpic) {
      updateEpic(editingEpic.id, data)
    } else {
      addEpic(data)
    }
    setDialogOpen(false)
  }

  const getEpicTasks = (epicId: string) => tasks.filter((t) => t.epicId === epicId)
  const unlinkedTasks = tasks.filter((t) => !t.epicId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Эпики</h1>
          <p className="text-muted-foreground mt-1">Группируйте задачи в эпики для стратегического планирования</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Новый эпик
        </Button>
      </div>

      {/* Epic cards */}
      <div className="space-y-4 stagger-children">
        {epics.map((epic) => {
          const epicTasks = getEpicTasks(epic.id)
          const doneTasks = epicTasks.filter((t) => t.status === 'done' || t.progress === 100).length
          const totalTasks = epicTasks.length
          const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
          const isExpanded = expandedEpic === epic.id

          return (
            <Card key={epic.id} className="overflow-hidden transition-all duration-300">
              <div className="h-1" style={{ backgroundColor: epic.color }} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedEpic(isExpanded ? null : epic.id)}
                      className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded
                        ? <ChevronDown className="h-4 w-4" />
                        : <ChevronRight className="h-4 w-4" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Layers className="h-4 w-4 shrink-0" style={{ color: epic.color }} />
                        <CardTitle className="text-lg">{epic.name}</CardTitle>
                        <Badge className={cn('text-[10px] border-0', statusBadgeColors[epic.status])}>
                          {statusLabels[epic.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{epic.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-7 text-xs"
                      onClick={() => setLinkDialogEpic(epic.id)}
                    >
                      <Plus className="h-3 w-3" />
                      Задача
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(epic)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteEpic(epic.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4 space-y-3">
                {/* Progress and meta */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <Progress value={progressPercent} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ListChecks className="h-3 w-3" />
                        {doneTasks} из {totalTasks} задач
                      </div>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>
                  {epic.targetDate && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs shrink-0',
                      epic.targetDate < Date.now() && epic.status !== 'completed'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    )}>
                      <CalendarClock className="h-3 w-3" />
                      {new Date(epic.targetDate).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>

                {/* Status breakdown */}
                {totalTasks > 0 && (
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                    {columns.map((col) => {
                      const count = epicTasks.filter((t) => t.status === col.id).length
                      if (count === 0) return null
                      return (
                        <div
                          key={col.id}
                          className="h-full transition-all duration-500"
                          style={{
                            backgroundColor: col.color,
                            width: `${(count / totalTasks) * 100}%`,
                          }}
                          title={`${col.title}: ${count}`}
                        />
                      )
                    })}
                  </div>
                )}

                {/* Expanded task list */}
                {isExpanded && (
                  <div className="space-y-2 pt-2 border-t animate-fade-in-up">
                    {epicTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Нет привязанных задач
                      </p>
                    )}
                    {epicTasks.map((task) => {
                      const col = columns.find((c) => c.id === task.status)
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: task.color }} />
                          <span className="text-sm flex-1 truncate">{task.title}</span>
                          {task.progress > 0 && task.progress < 100 && (
                            <div className="w-16">
                              <Progress value={task.progress} className="h-1" />
                            </div>
                          )}
                          {col && (
                            <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                              {col.title}
                            </Badge>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              updateTask(task.id, { epicId: null })
                            }}
                            title="Отвязать от эпика"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {epics.length === 0 && (
          <div className="text-center py-16">
            <Layers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Нет эпиков. Создайте первый!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Epic Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>{editingEpic ? 'Редактировать эпик' : 'Новый эпик'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Название</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Название эпика"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Описание эпика"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as EpicStatus })}
                  options={[
                    { value: 'planning', label: 'Планирование' },
                    { value: 'active', label: 'Активный' },
                    { value: 'completed', label: 'Завершён' },
                    { value: 'archived', label: 'В архиве' },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Цвет</label>
                <div className="flex gap-2 flex-wrap pt-1">
                  {EPIC_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: form.color === c ? 'white' : 'transparent',
                        boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата начала</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Целевая дата</label>
                <Input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingEpic ? 'Сохранить' : 'Создать'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Link tasks to epic dialog */}
      <Dialog open={!!linkDialogEpic} onOpenChange={(open) => !open && setLinkDialogEpic(null)}>
        <DialogContent onClose={() => setLinkDialogEpic(null)} className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Привязать задачи к эпику</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {tasks.filter((t) => t.epicId !== linkDialogEpic).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Все задачи уже привязаны</p>
            )}
            {tasks
              .filter((t) => t.epicId !== linkDialogEpic)
              .map((task) => {
                const col = columns.find((c) => c.id === task.status)
                const currentEpic = task.epicId ? epics.find((e) => e.id === task.epicId) : null
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      updateTask(task.id, { epicId: linkDialogEpic })
                    }}
                  >
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: task.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{task.title}</p>
                      {currentEpic && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Layers className="h-2.5 w-2.5" style={{ color: currentEpic.color }} />
                          {currentEpic.name}
                        </p>
                      )}
                    </div>
                    {col && (
                      <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                        {col.title}
                      </Badge>
                    )}
                  </div>
                )
              })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
