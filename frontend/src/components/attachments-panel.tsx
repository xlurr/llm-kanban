import { useState, useRef } from 'react'
import type { Attachment, AttachmentType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Paperclip, Link2, Image, FileText, Plus, Trash2, ExternalLink,
  Upload, ImagePlus, Link as LinkIcon, File, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const typeConfig: Record<AttachmentType, { icon: typeof Link2; label: string; color: string }> = {
  link: { icon: Link2, label: 'Ссылка', color: 'text-blue-500' },
  image: { icon: Image, label: 'Изображение', color: 'text-green-500' },
  file: { icon: FileText, label: 'Файл', color: 'text-orange-500' },
}

// ── Inline add attachment form ──

function AddAttachmentInline({ onAdd, onCancel }: {
  onAdd: (data: { type: AttachmentType; name: string; url: string; addedBy: string }) => void
  onCancel: () => void
}) {
  const [type, setType] = useState<AttachmentType>('link')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setType('link')
    setName('')
    setUrl('')
    setPreview(null)
    setDragOver(false)
  }

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) return
    onAdd({ type, name: name.trim(), url: url.trim(), addedBy: 'Текущий пользователь' })
    reset()
  }

  const handleFileSelect = (file: File) => {
    const isImage = file.type.startsWith('image/')
    setType(isImage ? 'image' : 'file')
    setName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setUrl(dataUrl)
      if (isImage) setPreview(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const tabs: { key: AttachmentType; icon: typeof Link2; label: string }[] = [
    { key: 'link', icon: LinkIcon, label: 'Ссылка' },
    { key: 'image', icon: ImagePlus, label: 'Изображение' },
    { key: 'file', icon: File, label: 'Файл' },
  ]

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold flex items-center gap-2">
          <Paperclip className="h-4 w-4" /> Добавить вложение
        </span>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Type tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => { setType(tab.key); setPreview(null); setUrl(''); setName('') }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-all',
                type === tab.key
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Link form */}
      {type === 'link' && (
        <div className="space-y-3 animate-fade-in">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Название</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Документация API"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      {/* Image form */}
      {type === 'image' && (
        <div className="space-y-3 animate-fade-in">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all',
              dragOver
                ? 'border-foreground/30 bg-foreground/5 scale-[1.01]'
                : 'border-border hover:border-foreground/20 hover:bg-muted/50',
              preview && 'p-2',
            )}
          >
            {preview ? (
              <div className="w-full rounded-lg overflow-hidden">
                <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-lg" />
              </div>
            ) : (
              <>
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Перетащите изображение сюда</p>
                  <p className="text-xs text-muted-foreground mt-1">или нажмите для выбора файла</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />
          </div>

          {/* Or paste URL */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">или вставьте URL</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Название</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Скриншот интерфейса"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">URL изображения</label>
            <Input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setPreview(e.target.value) }}
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>
      )}

      {/* File form */}
      {type === 'file' && (
        <div className="space-y-3 animate-fade-in">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all',
              dragOver
                ? 'border-foreground/30 bg-foreground/5 scale-[1.01]'
                : 'border-border hover:border-foreground/20 hover:bg-muted/50',
              name && 'border-foreground/20 bg-muted/30',
            )}
          >
            {name ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">Файл выбран</p>
                </div>
              </div>
            ) : (
              <>
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Перетащите файл сюда</p>
                  <p className="text-xs text-muted-foreground mt-1">или нажмите для выбора</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />
          </div>

          {!url && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">или вставьте URL</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Документ.pdf"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">URL файла</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/file.pdf"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="outline" size="sm" onClick={() => { reset(); onCancel() }}>
          Отмена
        </Button>
        <Button size="sm" className="gap-1.5" onClick={handleSubmit} disabled={!name.trim() || !url.trim()}>
          <Plus className="h-4 w-4" /> Добавить
        </Button>
      </div>
    </div>
  )
}

// ── Image lightbox ──

function ImageLightbox({ src, alt, open, onClose }: {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose} className="max-w-2xl p-2">
        <img src={src} alt={alt} className="w-full rounded-lg" />
        <p className="text-sm text-center text-muted-foreground mt-2">{alt}</p>
      </DialogContent>
    </Dialog>
  )
}

// ── Attachment row ──

function AttachmentRow({ attachment, onRemove }: {
  attachment: Attachment
  onRemove: () => void
}) {
  const cfg = typeConfig[attachment.type]
  const Icon = cfg.icon
  const [imgError, setImgError] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  return (
    <>
      <div className="group flex items-center gap-3 p-2.5 rounded-lg border hover:bg-muted/50 transition-colors">
        {/* Preview / Icon */}
        {attachment.type === 'image' && !imgError ? (
          <div
            className="h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer hover:ring-2 ring-foreground/20 transition-all"
            onClick={() => setLightbox(true)}
          >
            <img
              src={attachment.url}
              alt={attachment.name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-muted')}>
            <Icon className={cn('h-5 w-5', cfg.color)} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
              <Icon className="h-2.5 w-2.5" /> {cfg.label}
            </Badge>
            <span>{attachment.addedBy}</span>
            <span>·</span>
            <span>{new Date(attachment.addedAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {attachment.type !== 'file' || !attachment.url.startsWith('data:') ? (
            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          ) : null}
          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Image lightbox */}
      {attachment.type === 'image' && (
        <ImageLightbox
          src={attachment.url}
          alt={attachment.name}
          open={lightbox}
          onClose={() => setLightbox(false)}
        />
      )}
    </>
  )
}

// ── Main attachments panel ──

export function AttachmentsPanel({ attachments, onAdd, onRemove }: {
  attachments: Attachment[]
  onAdd: (data: { type: AttachmentType; name: string; url: string; addedBy: string }) => void
  onRemove: (id: string) => void
}) {
  const [showForm, setShowForm] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Paperclip className="h-5 w-5" /> Вложения
            {attachments.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">{attachments.length}</span>
            )}
          </CardTitle>
          {!showForm && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowForm(true)}>
              <Plus className="h-3 w-3" /> Добавить
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {showForm && (
          <AddAttachmentInline
            onAdd={(data) => { onAdd(data); setShowForm(false) }}
            onCancel={() => setShowForm(false)}
          />
        )}
        {attachments.length === 0 && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-border hover:border-foreground/20 hover:bg-muted/30 cursor-pointer transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Нажмите чтобы добавить</p>
              <p className="text-xs text-muted-foreground/60">Ссылки, изображения, файлы</p>
            </div>
          </button>
        )}
        {attachments.map((att) => (
          <AttachmentRow key={att.id} attachment={att} onRemove={() => onRemove(att.id)} />
        ))}
      </CardContent>
    </Card>
  )
}
