import { useState, useMemo } from 'react'
import type { Pipeline, PipelineStage, PipelineStageStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  GitBranch, GitCommitHorizontal, Play, CheckCircle2,
  XCircle, Clock, SkipForward, Loader2, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Status config ──

const statusConfig: Record<PipelineStageStatus, {
  icon: typeof CheckCircle2
  color: string
  bg: string
  stroke: string
  fill: string
  label: string
}> = {
  pending:  { icon: Clock,        color: 'text-muted-foreground',     bg: 'bg-muted',         stroke: 'hsl(var(--muted-foreground))',  fill: 'hsl(var(--muted) / 0.5)',           label: 'Ожидание' },
  running:  { icon: Loader2,      color: 'text-blue-500',            bg: 'bg-blue-500/10',   stroke: '#3b82f6',                       fill: 'rgba(59,130,246,0.08)',             label: 'Выполняется' },
  success:  { icon: CheckCircle2, color: 'text-green-500',           bg: 'bg-green-500/10',  stroke: '#22c55e',                       fill: 'rgba(34,197,94,0.08)',              label: 'Успешно' },
  failed:   { icon: XCircle,      color: 'text-red-500',             bg: 'bg-red-500/10',    stroke: '#ef4444',                       fill: 'rgba(239,68,68,0.08)',              label: 'Ошибка' },
  skipped:  { icon: SkipForward,  color: 'text-muted-foreground/50', bg: 'bg-muted/50',      stroke: 'hsl(var(--muted-foreground)/0.3)', fill: 'hsl(var(--muted) / 0.2)',       label: 'Пропущена' },
}

const overallBadge: Record<PipelineStageStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  running: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  skipped: 'bg-muted text-muted-foreground',
}

// ── DAG layout computation ──

interface NodeLayout {
  stage: PipelineStage
  col: number   // layer (x)
  row: number   // position within layer (y)
  x: number     // px
  y: number     // px
}

function computeDAGLayout(stages: PipelineStage[]): {
  nodes: NodeLayout[]
  edges: { from: NodeLayout; to: NodeLayout }[]
  width: number
  height: number
} {
  const stageMap = new Map(stages.map((s) => [s.id, s]))

  // Assign layers via topological sort
  const layers: string[][] = []
  const assigned = new Set<string>()

  while (assigned.size < stages.length) {
    const layer = stages.filter(
      (s) => !assigned.has(s.id) && (s.needs || []).every((d) => assigned.has(d)),
    )
    if (layer.length === 0) break
    layers.push(layer.map((s) => s.id))
    layer.forEach((s) => assigned.add(s.id))
  }

  const NODE_W = 148
  const NODE_H = 56
  const GAP_X = 60
  const GAP_Y = 24

  const nodeMap = new Map<string, NodeLayout>()
  const nodes: NodeLayout[] = []

  layers.forEach((layer, col) => {
    layer.forEach((id, row) => {
      const stage = stageMap.get(id)!
      const x = col * (NODE_W + GAP_X)
      const totalLayerHeight = layer.length * NODE_H + (layer.length - 1) * GAP_Y
      const startY = -totalLayerHeight / 2
      const y = startY + row * (NODE_H + GAP_Y)

      const node: NodeLayout = { stage, col, row, x, y }
      nodes.push(node)
      nodeMap.set(id, node)
    })
  })

  // Normalize y so minimum is 0
  const minY = Math.min(...nodes.map((n) => n.y))
  nodes.forEach((n) => (n.y -= minY))

  const edges: { from: NodeLayout; to: NodeLayout }[] = []
  for (const node of nodes) {
    for (const depId of node.stage.needs || []) {
      const from = nodeMap.get(depId)
      if (from) edges.push({ from, to: node })
    }
  }

  const width = layers.length * (NODE_W + GAP_X) - GAP_X
  const height = Math.max(...nodes.map((n) => n.y)) + NODE_H

  return { nodes, edges, width, height }
}

// ── SVG Pipeline Graph ──

function PipelineGraph({ stages, selectedId, onSelect }: {
  stages: PipelineStage[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { nodes, edges, width, height } = useMemo(() => computeDAGLayout(stages), [stages])

  const NODE_W = 148
  const NODE_H = 56
  const PAD = 20
  const svgW = width + PAD * 2
  const svgH = height + PAD * 2

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="select-none"
      >
        <defs>
          {/* Animated dash for running edges */}
          <style>{`
            @keyframes dash-flow {
              to { stroke-dashoffset: -16; }
            }
            .edge-running {
              animation: dash-flow 0.8s linear infinite;
            }
            @keyframes node-glow {
              0%, 100% { filter: drop-shadow(0 0 4px rgba(59,130,246,0.3)); }
              50% { filter: drop-shadow(0 0 10px rgba(59,130,246,0.6)); }
            }
            .node-running {
              animation: node-glow 1.5s ease-in-out infinite;
            }
          `}</style>

          {/* Arrow marker per status */}
          {Object.entries(statusConfig).map(([status, cfg]) => (
            <marker
              key={status}
              id={`arrow-${status}`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill={cfg.stroke} opacity={status === 'skipped' ? 0.3 : 0.6} />
            </marker>
          ))}
        </defs>

        <g transform={`translate(${PAD}, ${PAD})`}>
          {/* Edges */}
          {edges.map(({ from, to }, i) => {
            const x1 = from.x + NODE_W
            const y1 = from.y + NODE_H / 2
            const x2 = to.x
            const y2 = to.y + NODE_H / 2

            // Bezier curve
            const dx = (x2 - x1) * 0.5
            const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`

            const edgeStatus = to.stage.status
            const cfg = statusConfig[edgeStatus]
            const isRunning = edgeStatus === 'running'
            const isSkipped = edgeStatus === 'skipped' || edgeStatus === 'pending'

            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke={cfg.stroke}
                strokeWidth={isSkipped ? 1 : 1.5}
                strokeDasharray={isRunning ? '6 4' : isSkipped ? '3 3' : 'none'}
                opacity={isSkipped ? 0.3 : 0.5}
                markerEnd={`url(#arrow-${edgeStatus})`}
                className={isRunning ? 'edge-running' : ''}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const s = node.stage
            const cfg = statusConfig[s.status]
            const isSelected = selectedId === s.id
            const isRunning = s.status === 'running'
            const isSkipped = s.status === 'skipped' || s.status === 'pending'

            return (
              <g
                key={s.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelect(s.id)}
                className={cn('cursor-pointer', isRunning && 'node-running')}
              >
                {/* Selection ring */}
                {isSelected && (
                  <rect
                    x={-3}
                    y={-3}
                    width={NODE_W + 6}
                    height={NODE_H + 6}
                    rx={15}
                    fill="none"
                    stroke={cfg.stroke}
                    strokeWidth={2}
                    opacity={0.4}
                  />
                )}

                {/* Background */}
                <rect
                  x={0}
                  y={0}
                  width={NODE_W}
                  height={NODE_H}
                  rx={12}
                  fill={cfg.fill}
                  stroke={cfg.stroke}
                  strokeWidth={isSelected ? 1.5 : 1}
                  opacity={isSkipped ? 0.5 : 1}
                  className="transition-all duration-300"
                />

                {/* Status icon circle */}
                <circle
                  cx={22}
                  cy={NODE_H / 2}
                  r={11}
                  fill={cfg.fill}
                  stroke={cfg.stroke}
                  strokeWidth={1}
                  opacity={isSkipped ? 0.5 : 1}
                />

                {/* Icon — rendered as unicode since we can't use React components in SVG easily */}
                <text
                  x={22}
                  y={NODE_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fill={cfg.stroke}
                  opacity={isSkipped ? 0.5 : 1}
                >
                  {s.status === 'success' ? '✓' : s.status === 'failed' ? '✗' : s.status === 'running' ? '↻' : s.status === 'skipped' ? '⏭' : '○'}
                </text>

                {/* Name */}
                <text
                  x={40}
                  y={NODE_H / 2 - 6}
                  fontSize={11}
                  fontWeight={600}
                  fill="currentColor"
                  className={isSkipped ? 'opacity-40' : 'opacity-80'}
                >
                  {s.name.length > 13 ? s.name.slice(0, 12) + '…' : s.name}
                </text>

                {/* Status label */}
                <text
                  x={40}
                  y={NODE_H / 2 + 10}
                  fontSize={9}
                  fill={cfg.stroke}
                  opacity={isSkipped ? 0.4 : 0.7}
                >
                  {cfg.label}
                  {s.startedAt && s.finishedAt ? ` · ${formatDuration(s.startedAt, s.finishedAt)}` : ''}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

// ── Compact pipeline bar (for task cards) ──

export function PipelineMini({ pipeline }: { pipeline: Pipeline }) {
  return (
    <div className="flex items-center gap-1">
      {pipeline.stages.map((stage, i) => {
        const cfg = statusConfig[stage.status]
        return (
          <div key={stage.id} className="flex items-center gap-0.5">
            <div
              className={cn(
                'h-1.5 rounded-full transition-all',
                stage.status === 'success' && 'bg-green-500',
                stage.status === 'failed' && 'bg-red-500',
                stage.status === 'running' && 'bg-blue-500 animate-pulse',
                stage.status === 'pending' && 'bg-muted-foreground/20',
                stage.status === 'skipped' && 'bg-muted-foreground/10',
              )}
              style={{ width: `${Math.max(8, 40 / pipeline.stages.length)}px` }}
              title={`${stage.name}: ${cfg.label}`}
            />
            {i < pipeline.stages.length - 1 && (
              <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Helpers ──

function formatDuration(start: number | null, end: number | null): string | null {
  if (!start || !end) return null
  const ms = end - start
  if (ms < 60000) return `${Math.round(ms / 1000)}с`
  return `${Math.floor(ms / 60000)}м ${Math.round((ms % 60000) / 1000)}с`
}

// ── Selected stage detail panel ──

function StageDetail({ stage }: { stage: PipelineStage }) {
  const cfg = statusConfig[stage.status]
  const Icon = cfg.icon

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card animate-fade-in">
      <div className={cn(
        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
        cfg.bg,
        stage.status === 'running' && 'animate-pulse',
      )}>
        <Icon className={cn('h-4.5 w-4.5', cfg.color, stage.status === 'running' && 'animate-spin')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{stage.name}</span>
          <Badge variant="outline" className={cn('text-[10px] border', overallBadge[stage.status])}>
            {cfg.label}
          </Badge>
          {stage.startedAt && stage.finishedAt && (
            <span className="text-[10px] text-muted-foreground ml-auto">
              {formatDuration(stage.startedAt, stage.finishedAt)}
            </span>
          )}
        </div>
        {stage.log && (
          <p className={cn(
            'text-xs mt-1 font-mono rounded px-2 py-1',
            stage.status === 'failed'
              ? 'text-red-400 bg-red-500/5'
              : 'text-muted-foreground bg-muted/50',
          )}>
            {stage.log}
          </p>
        )}
        {(stage.needs || []).length > 0 && (
          <p className="text-[10px] text-muted-foreground mt-1">
            Зависит от: {(stage.needs || []).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Full pipeline card ──

export function PipelineCard({ pipeline }: {
  pipeline: Pipeline
}) {
  const [expanded, setExpanded] = useState(true)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const cfg = statusConfig[pipeline.status]
  const OverallIcon = cfg.icon

  const selected = selectedStage ? pipeline.stages.find((s) => s.id === selectedStage) : null

  return (
    <div className="rounded-xl border overflow-hidden">
      {/* Header */}
      <button
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', cfg.bg)}>
          <OverallIcon className={cn('h-4 w-4', cfg.color, pipeline.status === 'running' && 'animate-spin')} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Run #{pipeline.runNumber}</span>
            <Badge variant="outline" className={cn('text-[10px] border', overallBadge[pipeline.status])}>
              {cfg.label}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" /> {pipeline.branch}
            </span>
            <span className="flex items-center gap-1">
              <GitCommitHorizontal className="h-3 w-3" /> {pipeline.commit}
            </span>
            <span>{new Date(pipeline.triggeredAt).toLocaleString('ru-RU')}</span>
          </div>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
      </button>

      {/* Graph + detail */}
      {expanded && (
        <div className="border-t animate-fade-in">
          {/* Progress bar */}
          <div className="flex gap-0.5 px-4 pt-3">
            {pipeline.stages.map((stage) => (
              <div
                key={stage.id}
                className={cn(
                  'h-1 flex-1 rounded-full transition-all duration-500',
                  stage.status === 'success' && 'bg-green-500',
                  stage.status === 'failed' && 'bg-red-500',
                  stage.status === 'running' && 'bg-blue-500 animate-pulse',
                  stage.status === 'pending' && 'bg-muted',
                  stage.status === 'skipped' && 'bg-muted/50',
                )}
              />
            ))}
          </div>

          {/* DAG Graph */}
          <div className="px-4 py-3">
            <PipelineGraph
              stages={pipeline.stages}
              selectedId={selectedStage}
              onSelect={setSelectedStage}
            />
          </div>

          {/* Selected stage detail */}
          {selected && (
            <div className="px-4 pb-4">
              <StageDetail stage={selected} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Pipelines section for task detail ──

export function PipelinesSection({ pipelines, onTrigger }: {
  pipelines: Pipeline[]
  onTrigger: () => void
}) {
  const sorted = [...pipelines].sort((a, b) => b.triggeredAt - a.triggeredAt)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5" /> CI/CD Пайплайн
            {pipelines.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">{pipelines.length}</span>
            )}
          </CardTitle>
          <Button size="sm" className="gap-1.5" onClick={onTrigger}>
            <Play className="h-3 w-3" /> Запустить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Пайплайны не запускались
          </p>
        ) : (
          sorted.map((pl) => <PipelineCard key={pl.id} pipeline={pl} />)
        )}
      </CardContent>
    </Card>
  )
}
