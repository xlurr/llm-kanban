import { useState } from 'react'
import { useBoardStore } from '@/stores/board-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, ArrowRight, RotateCcw, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COLUMN_COLORS = [
  '#64748b', '#3b82f6', '#eab308', '#22c55e', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#a855f7',
]

export function BoardSettingsDialog({ open, onOpenChange }: Props) {
  const {
    columns,
    transitions,
    addColumn,
    updateColumn,
    removeColumn,
    addTransition,
    removeTransition,
    resetToDefaults,
  } = useBoardStore()

  const [newColTitle, setNewColTitle] = useState('')
  const [newColColor, setNewColColor] = useState('#3b82f6')
  const [newColLimit, setNewColLimit] = useState('')
  const [transFrom, setTransFrom] = useState('')
  const [transTo, setTransTo] = useState('')
  const [tab, setTab] = useState<'columns' | 'transitions'>('columns')

  const handleAddColumn = () => {
    if (!newColTitle.trim()) return
    const id = newColTitle.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-zа-яё0-9_]/gi, '')
    if (columns.some((c) => c.id === id)) return
    addColumn({
      id: id || `col-${Date.now()}`,
      title: newColTitle.trim(),
      color: newColColor,
      limit: newColLimit ? parseInt(newColLimit) : undefined,
    })
    setNewColTitle('')
    setNewColLimit('')
  }

  const handleAddTransition = () => {
    if (!transFrom || !transTo || transFrom === transTo) return
    addTransition({ from: transFrom, to: transTo })
    setTransFrom('')
    setTransTo('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-h-[85vh] overflow-y-auto max-w-xl">
        <DialogHeader>
          <DialogTitle>Настройки доски</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 mb-4">
          <Button
            size="sm"
            variant={tab === 'columns' ? 'default' : 'outline'}
            onClick={() => setTab('columns')}
          >
            Столбцы
          </Button>
          <Button
            size="sm"
            variant={tab === 'transitions' ? 'default' : 'outline'}
            onClick={() => setTab('transitions')}
          >
            Правила переходов
          </Button>
        </div>

        {tab === 'columns' && (
          <div className="space-y-4">
            <div className="space-y-2">
              {columns.map((col) => (
                <div key={col.id} className="flex items-center gap-2 p-2 rounded-md border">
                  <div
                    className="h-4 w-4 rounded-full shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  <Input
                    value={col.title}
                    onChange={(e) => updateColumn(col.id, { title: e.target.value })}
                    className="h-8 text-sm"
                  />
                  <Input
                    type="number"
                    value={col.limit || ''}
                    onChange={(e) =>
                      updateColumn(col.id, {
                        limit: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="WIP"
                    className="h-8 text-sm w-16"
                    min={0}
                  />
                  <div className="flex gap-0.5">
                    {COLUMN_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateColumn(col.id, { color: c })}
                        className="h-4 w-4 rounded-full border transition-transform hover:scale-125"
                        style={{
                          backgroundColor: c,
                          borderColor: col.color === c ? 'white' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeColumn(col.id)}
                    disabled={columns.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium">Добавить столбец</p>
              <div className="flex gap-2">
                <Input
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  placeholder="Название"
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColumn())}
                />
                <Input
                  type="number"
                  value={newColLimit}
                  onChange={(e) => setNewColLimit(e.target.value)}
                  placeholder="WIP"
                  className="h-8 text-sm w-16"
                  min={0}
                />
                <div className="flex gap-0.5 items-center">
                  {COLUMN_COLORS.slice(0, 5).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColColor(c)}
                      className="h-4 w-4 rounded-full border transition-transform hover:scale-125"
                      style={{
                        backgroundColor: c,
                        borderColor: newColColor === c ? 'white' : 'transparent',
                      }}
                    />
                  ))}
                </div>
                <Button size="sm" className="h-8 gap-1" onClick={handleAddColumn}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === 'transitions' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Правила определяют, между какими столбцами можно перемещать задачи.
              Если правил нет — перемещение свободное.
            </p>

            <div className="space-y-2">
              {transitions.map((t, i) => {
                const fromCol = columns.find((c) => c.id === t.from)
                const toCol = columns.find((c) => c.id === t.to)
                return (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md border text-sm">
                    <div className="flex items-center gap-1.5 flex-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: fromCol?.color }}
                      />
                      <span>{fromCol?.title || t.from}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex items-center gap-1.5 flex-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: toCol?.color }}
                      />
                      <span>{toCol?.title || t.to}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeTransition(t.from, t.to)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              })}
              {transitions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет правил — перемещение свободное
                </p>
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium">Добавить правило</p>
              <div className="flex items-center gap-2">
                <select
                  value={transFrom}
                  onChange={(e) => setTransFrom(e.target.value)}
                  className="flex h-8 flex-1 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  <option value="">Из...</option>
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  value={transTo}
                  onChange={(e) => setTransTo(e.target.value)}
                  className="flex h-8 flex-1 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  <option value="">В...</option>
                  {columns.filter((c) => c.id !== transFrom).map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <Button size="sm" className="h-8 gap-1" onClick={handleAddTransition}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4 flex justify-between">
          <Button variant="outline" size="sm" className="gap-1" onClick={resetToDefaults}>
            <RotateCcw className="h-3.5 w-3.5" />
            Сбросить
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Готово
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
