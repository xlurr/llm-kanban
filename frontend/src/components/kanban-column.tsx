import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, Column } from '@/lib/types'
import { TaskCard } from './task-card'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  epicMap?: Map<string, { name: string; color: string }>
}

export function KanbanColumn({ column, tasks, epicMap }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const isOverLimit = column.limit !== undefined && column.limit > 0 && tasks.length > column.limit

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-xl min-h-[500px] transition-all duration-300',
        'bg-muted/30 border border-transparent',
        isOver && 'bg-primary/[0.04] border-primary/20 shadow-lg shadow-primary/5 scale-[1.01]'
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 ring-offset-background"
            style={{ backgroundColor: column.color, boxShadow: `0 0 8px ${column.color}40` }}
          />
          <h3 className="font-semibold text-sm tracking-tight">{column.title}</h3>
        </div>
        <span
          className={cn(
            'text-xs rounded-md px-2 py-0.5 font-medium tabular-nums',
            isOverLimit
              ? 'bg-destructive/15 text-destructive'
              : 'text-muted-foreground bg-muted/80'
          )}
        >
          {tasks.length}
          {column.limit ? ` / ${column.limit}` : ''}
        </span>
      </div>

      {/* Tasks list */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1 p-2 pt-0">
          {tasks.map((task) => {
            const epic = epicMap?.get(task.id)
            return (
              <TaskCard
                key={task.id}
                task={task}
                epicName={epic?.name}
                epicColor={epic?.color}
              />
            )
          })}
          {tasks.length === 0 && (
            <div className={cn(
              'flex-1 flex items-center justify-center min-h-[80px] rounded-lg border border-dashed border-border/50 transition-colors',
              isOver && 'border-primary/30 bg-primary/[0.02]'
            )}>
              <p className="text-xs text-muted-foreground/60">Перетащите сюда</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
