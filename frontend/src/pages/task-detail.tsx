import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTasksStore } from '@/stores/tasks-store'
import { useAgentsStore } from '@/stores/agents-store'
import { useBoardStore } from '@/stores/board-store'
import { useAuthStore } from '@/stores/auth-store'
import { useEpicsStore } from '@/stores/epics-store'
import { EditTaskDialog } from '@/components/edit-task-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Select } from '@/components/ui/select'
import {
  ArrowLeft,
  Play,
  Clock,
  MessageSquare,
  Terminal,
  Star,
  CalendarClock,
  Pencil,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Send,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const logTypeColors: Record<string, string> = {
  info: 'text-blue-400',
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
}

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    tasks, startExecution, moveTask, assignAgent,
    addSubtask, toggleSubtask, removeSubtask,
    addComment, removeComment,
  } = useTasksStore()
  const { agents } = useAgentsStore()
  const { columns, getAllowedTargets } = useBoardStore()
  const { user } = useAuthStore()
  const { epics } = useEpicsStore()

  const [editOpen, setEditOpen] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')
  const [commentText, setCommentText] = useState('')

  const task = tasks.find((t) => t.id === id)
  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Задача не найдена</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/tasks')}>
          Вернуться к списку
        </Button>
      </div>
    )
  }

  const agent = agents.find((a) => a.id === task.assignedAgent)
  const currentCol = columns.find((c) => c.id === task.status)
  const epic = task.epicId ? epics.find((e) => e.id === task.epicId) : null
  const allowedTargets = getAllowedTargets(task.status)
  const targetColumns = columns.filter((c) => allowedTargets.includes(c.id) && c.id !== task.status)
  const isOverdue = task.deadline && task.deadline < Date.now() && task.progress < 100
  const doneSubtasks = task.subtasks.filter((s) => s.done).length

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    addSubtask(task.id, newSubtask.trim())
    setNewSubtask('')
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return
    addComment(task.id, user?.name || 'Аноним', commentText.trim())
    setCommentText('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Редактировать
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-4 w-1 rounded-full" style={{ backgroundColor: task.color }} />
          <h1 className="text-2xl font-bold">{task.title}</h1>
          {currentCol && (
            <Badge
              variant="outline"
              className="gap-1"
            >
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: currentCol.color }} />
              {currentCol.title}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{task.description}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {epic && (
            <Badge
              variant="outline"
              className="gap-1 cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate('/epics')}
            >
              <Layers className="h-3 w-3" style={{ color: epic.color }} />
              {epic.name}
            </Badge>
          )}
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Время
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{task.estimatedTime} мин</p>
            <p className="text-xs text-muted-foreground">
              Создана {new Date(task.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Прогресс</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <span className="text-lg font-bold">{task.progress}%</span>
            <Progress value={task.progress} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Дедлайн
            </CardTitle>
          </CardHeader>
          <CardContent>
            {task.deadline ? (
              <p className={cn('text-lg font-bold', isOverdue && 'text-destructive')}>
                {new Date(task.deadline).toLocaleDateString('ru-RU')}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Не задан</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Агент</CardTitle>
          </CardHeader>
          <CardContent>
            {agent ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                  {agent.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.successRate}%</p>
                </div>
              </div>
            ) : (
              <Select
                value={task.assignedAgent || ''}
                onChange={(e) => assignAgent(task.id, e.target.value)}
                options={[
                  { value: '', label: 'Выберите' },
                  ...agents.filter((a) => a.status !== 'offline').map((a) => ({ value: a.id, label: a.name })),
                ]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions: move between columns */}
      {targetColumns.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {!task.assignedAgent && columns.some(c => c.id === 'in_progress') && task.status !== 'in_progress' ? null : null}
          {task.assignedAgent && task.status !== 'in_progress' && (
            <Button
              size="sm"
              className="gap-1"
              onClick={() => startExecution(task.id)}
            >
              <Play className="h-3 w-3" />
              Запустить агента
            </Button>
          )}
          {targetColumns.map((col) => (
            <Button
              key={col.id}
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => moveTask(task.id, col.id)}
            >
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
              {col.title}
            </Button>
          ))}
        </div>
      )}

      {/* Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Промпт для агента
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
            {task.prompt}
          </div>
        </CardContent>
      </Card>

      {/* Subtasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Подзадачи
            {task.subtasks.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {doneSubtasks}/{task.subtasks.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {task.subtasks.length > 0 && (
            <Progress
              value={task.subtasks.length > 0 ? (doneSubtasks / task.subtasks.length) * 100 : 0}
              className="h-1.5 mb-3"
            />
          )}
          {task.subtasks.map((st) => (
            <div key={st.id} className="flex items-center gap-2 group/st">
              <button
                onClick={() => toggleSubtask(task.id, st.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                {st.done ? (
                  <CheckSquare className="h-4 w-4 text-primary" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>
              <span className={cn('text-sm flex-1', st.done && 'line-through text-muted-foreground')}>
                {st.title}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover/st:opacity-100"
                onClick={() => removeSubtask(task.id, st.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Добавить подзадачу..."
              className="h-8 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
            />
            <Button size="sm" className="h-8 gap-1" onClick={handleAddSubtask}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Логи выполнения
          </CardTitle>
        </CardHeader>
        <CardContent>
          {task.logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Логи пока отсутствуют</p>
          ) : (
            <div className="space-y-1 font-mono text-sm max-h-[300px] overflow-y-auto">
              {task.logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString('ru-RU')}
                  </span>
                  <span className={cn(logTypeColors[log.type])}>{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review */}
      {task.review && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Ревью
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">
                {task.review.score}<span className="text-lg text-muted-foreground">/10</span>
              </div>
              <div>
                <p className="text-sm font-medium">{task.review.reviewer}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(task.review.timestamp).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{task.review.comment}</p>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Комментарии
            {task.comments.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">{task.comments.length}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {task.comments.map((c) => (
            <div key={c.id} className="flex gap-3 group/comment">
              <div className="h-7 w-7 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {c.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.timestamp).toLocaleString('ru-RU')}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 opacity-0 group-hover/comment:opacity-100"
                    onClick={() => removeComment(task.id, c.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{c.text}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Написать комментарий..."
              className="min-h-[36px] text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleAddComment}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog task={task} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  )
}
