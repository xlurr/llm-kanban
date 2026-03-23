import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasksStore } from '@/stores/tasks-store'
import { useAgentsStore } from '@/stores/agents-store'
import { useBoardStore } from '@/stores/board-store'
import { useEpicsStore } from '@/stores/epics-store'
import { useUsersStore } from '@/stores/users-store'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ListChecks, CheckCircle2, AlertTriangle, Clock, TrendingUp,
  Star, Activity, Flame, CalendarClock, Tag, Bot, Users,
  ArrowUpRight, ArrowDownRight, Minus, Zap, Cpu, Shield, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AreaChart, Area, BarChart as RBarChart, Bar, RadialBarChart, RadialBar,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

// ── Helpers ──

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}м назад`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}ч назад`
  const d = Math.floor(h / 24)
  return `${d}д назад`
}

const priorityDotColors: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

const priorityLabels: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
}

// ── Animated Robot SVG ──

function AnimatedRobot() {
  return (
    <div className="relative w-[280px] h-[280px] select-none">
      {/* Glow backdrop */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-transparent blur-3xl animate-pulse" />

      <svg viewBox="0 0 280 280" className="w-full h-full relative z-10">
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="armGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0008" />
          </filter>
        </defs>

        {/* Shadow on ground */}
        <ellipse cx="140" cy="265" rx="60" ry="8" fill="#0002" />

        {/* Legs */}
        <rect x="108" y="210" width="18" height="40" rx="6" fill="url(#armGrad)" />
        <rect x="154" y="210" width="18" height="40" rx="6" fill="url(#armGrad)" />
        {/* Feet */}
        <rect x="102" y="244" width="30" height="12" rx="6" fill="#5b21b6" />
        <rect x="148" y="244" width="30" height="12" rx="6" fill="#5b21b6" />

        {/* Body */}
        <rect x="90" y="130" width="100" height="90" rx="20" fill="url(#bodyGrad)" filter="url(#softShadow)" />
        {/* Chest screen */}
        <rect x="105" y="145" width="70" height="45" rx="10" fill="url(#screenGrad)" />
        {/* Chest bars animated */}
        <g>
          <rect x="113" y="168" width="8" height="14" rx="2" fill="#22d3ee" opacity="0.9">
            <animate attributeName="height" values="14;8;14" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="y" values="168;174;168" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="125" y="162" width="8" height="20" rx="2" fill="#34d399" opacity="0.9">
            <animate attributeName="height" values="20;10;20" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="y" values="162;172;162" dur="1.8s" repeatCount="indefinite" />
          </rect>
          <rect x="137" y="165" width="8" height="17" rx="2" fill="#a78bfa" opacity="0.9">
            <animate attributeName="height" values="17;6;17" dur="1.3s" repeatCount="indefinite" />
            <animate attributeName="y" values="165;176;165" dur="1.3s" repeatCount="indefinite" />
          </rect>
          <rect x="149" y="160" width="8" height="22" rx="2" fill="#f472b6" opacity="0.9">
            <animate attributeName="height" values="22;12;22" dur="2s" repeatCount="indefinite" />
            <animate attributeName="y" values="160;170;160" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="161" y="166" width="8" height="16" rx="2" fill="#fbbf24" opacity="0.9">
            <animate attributeName="height" values="16;7;16" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="y" values="166;175;166" dur="1.6s" repeatCount="indefinite" />
          </rect>
        </g>
        {/* Chest heart / power indicator */}
        <circle cx="140" cy="152" r="3" fill="#22d3ee" filter="url(#glow)">
          <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Left arm */}
        <g>
          <rect x="62" y="140" width="20" height="55" rx="10" fill="url(#armGrad)">
            <animateTransform attributeName="transform" type="rotate" values="0 72 140;-8 72 140;0 72 140" dur="3s" repeatCount="indefinite" />
          </rect>
          {/* Left hand */}
          <circle cx="72" cy="200" r="10" fill="#7c3aed">
            <animateTransform attributeName="transform" type="rotate" values="0 72 140;-8 72 140;0 72 140" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Right arm */}
        <g>
          <rect x="198" y="140" width="20" height="55" rx="10" fill="url(#armGrad)">
            <animateTransform attributeName="transform" type="rotate" values="0 208 140;8 208 140;0 208 140" dur="3s" repeatCount="indefinite" begin="0.3s" />
          </rect>
          <circle cx="208" cy="200" r="10" fill="#7c3aed">
            <animateTransform attributeName="transform" type="rotate" values="0 208 140;8 208 140;0 208 140" dur="3s" repeatCount="indefinite" begin="0.3s" />
          </circle>
        </g>

        {/* Neck */}
        <rect x="127" y="110" width="26" height="25" rx="8" fill="#6d28d9" />

        {/* Head */}
        <rect x="88" y="35" width="104" height="85" rx="24" fill="url(#headGrad)" filter="url(#softShadow)" />

        {/* Antenna */}
        <line x1="140" y1="35" x2="140" y2="12" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
        <circle cx="140" cy="10" r="6" fill="#22d3ee" filter="url(#glow)">
          <animate attributeName="fill" values="#22d3ee;#f472b6;#fbbf24;#22d3ee" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Eyes */}
        <g>
          {/* Left eye */}
          <ellipse cx="118" cy="70" rx="14" ry="16" fill="#0f172a" />
          <ellipse cx="118" cy="70" rx="10" ry="12" fill="#1e293b" />
          <circle cx="118" cy="68" r="6" fill="#22d3ee" filter="url(#glow)">
            <animate attributeName="cy" values="68;70;68" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="121" cy="65" r="2" fill="#fff" opacity="0.8" />

          {/* Right eye */}
          <ellipse cx="162" cy="70" rx="14" ry="16" fill="#0f172a" />
          <ellipse cx="162" cy="70" rx="10" ry="12" fill="#1e293b" />
          <circle cx="162" cy="68" r="6" fill="#22d3ee" filter="url(#glow)">
            <animate attributeName="cy" values="68;70;68" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="165" cy="65" r="2" fill="#fff" opacity="0.8" />
        </g>

        {/* Mouth — smile */}
        <path d="M122 92 Q140 104 158 92" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

        {/* Ear panels */}
        <rect x="76" y="55" width="12" height="30" rx="6" fill="#6d28d9" />
        <rect x="192" y="55" width="12" height="30" rx="6" fill="#6d28d9" />

        {/* Floating particles */}
        <circle cx="50" cy="50" r="2" fill="#22d3ee" opacity="0.6">
          <animate attributeName="cy" values="50;30;50" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="230" cy="40" r="1.5" fill="#a78bfa" opacity="0.5">
          <animate attributeName="cy" values="40;20;40" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="45" cy="120" r="1.5" fill="#f472b6" opacity="0.4">
          <animate attributeName="cy" values="120;100;120" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="235" cy="130" r="2" fill="#fbbf24" opacity="0.5">
          <animate attributeName="cy" values="130;110;130" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

// ── Animated counter ──

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (value === 0) { setDisplay(0); return }
    const start = performance.now()
    const from = 0
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value, duration])
  return <>{display}</>
}

// ── Minimal recharts tooltip ──

function MiniTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      {label && <p className="text-muted-foreground mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-medium" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

// ── Floating status cards for hero ──

function FloatingCard({ icon: Icon, label, value, color, delay, className }: {
  icon: any; label: string; value: string; color: string; delay: string; className?: string
}) {
  return (
    <div
      className={cn(
        'absolute bg-card/80 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 shadow-lg',
        'animate-float',
        className,
      )}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          <p className="text-sm font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ──

export function DashboardPage() {
  const navigate = useNavigate()
  const { tasks } = useTasksStore()
  const { agents } = useAgentsStore()
  const { columns } = useBoardStore()
  const { epics } = useEpicsStore()
  const { users } = useUsersStore()

  // ── Computed data ──
  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const failed = tasks.filter((t) => t.status === 'failed').length
    const active = tasks.filter((t) => t.progress > 0 && t.progress < 100).length
    const overdue = tasks.filter((t) => t.deadline && t.deadline < Date.now() && t.progress < 100).length
    const reviewed = tasks.filter((t) => t.review)
    const avgScore = reviewed.length > 0
      ? reviewed.reduce((s, t) => s + (t.review?.score || 0), 0) / reviewed.length
      : 0
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0
    const totalEstimate = tasks.reduce((s, t) => s + t.estimatedTime, 0)
    const totalComments = tasks.reduce((s, t) => s + t.comments.length, 0)
    const totalLogs = tasks.reduce((s, t) => s + t.logs.length, 0)
    const totalSubtasks = tasks.reduce((s, t) => s + t.subtasks.length, 0)
    const doneSubtasks = tasks.reduce((s, t) => s + t.subtasks.filter((st) => st.done).length, 0)

    return { total, done, failed, active, overdue, avgScore, completionRate, reviewed: reviewed.length, totalEstimate, totalComments, totalLogs, totalSubtasks, doneSubtasks }
  }, [tasks])

  // Column distribution
  const columnData = useMemo(() =>
    columns.map((col) => ({
      label: col.title,
      value: tasks.filter((t) => t.status === col.id).length,
      color: col.color,
      icon: col.icon,
      id: col.id,
    })),
    [columns, tasks]
  )

  // Priority distribution
  const priorityData = useMemo(() => {
    const pris = ['low', 'medium', 'high', 'critical'] as const
    return pris.map((p) => ({
      name: priorityLabels[p],
      value: tasks.filter((t) => t.priority === p).length,
      color: p === 'low' ? '#22c55e' : p === 'medium' ? '#3b82f6' : p === 'high' ? '#f97316' : '#ef4444',
    }))
  }, [tasks])

  // Tags frequency
  const tagData = useMemo(() => {
    const map = new Map<string, number>()
    tasks.forEach((t) => t.tags.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1)))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
  }, [tasks])

  // Most active users
  const activeUsers = useMemo(() => {
    const map = new Map<string, { created: number; comments: number }>()
    tasks.forEach((t) => {
      if (t.createdBy) {
        const e = map.get(t.createdBy) || { created: 0, comments: 0 }
        e.created++
        map.set(t.createdBy, e)
      }
      t.comments.forEach((c) => {
        const user = users.find((u) => u.name === c.author)
        if (user) {
          const e = map.get(user.id) || { created: 0, comments: 0 }
          e.comments++
          map.set(user.id, e)
        }
      })
    })
    return Array.from(map.entries())
      .map(([id, s]) => ({ user: users.find((u) => u.id === id), total: s.created + s.comments, created: s.created, comments: s.comments }))
      .filter((x) => x.user)
      .sort((a, b) => b.total - a.total)
  }, [tasks, users])

  // Agent performance
  const agentPerf = useMemo(() =>
    agents.map((a) => {
      const agTasks = tasks.filter((t) => t.assignedAgent === a.id)
      const done = agTasks.filter((t) => t.status === 'done').length
      const failed = agTasks.filter((t) => t.status === 'failed').length
      const avgScore = agTasks.filter((t) => t.review).reduce((s, t, _, arr) => s + (t.review!.score / arr.length), 0)
      return { agent: a, assigned: agTasks.length, done, failed, avgScore }
    }),
    [agents, tasks]
  )

  // Recent activity
  const recentActivity = useMemo(() => {
    const items: { type: 'log' | 'comment'; message: string; taskTitle: string; taskId: string; timestamp: number; logType?: string; author?: string }[] = []
    tasks.forEach((t) => {
      t.logs.forEach((l) => items.push({ type: 'log', message: l.message, taskTitle: t.title, taskId: t.id, timestamp: l.timestamp, logType: l.type }))
      t.comments.forEach((c) => items.push({ type: 'comment', message: c.text, taskTitle: t.title, taskId: t.id, timestamp: c.timestamp, author: c.author }))
    })
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8)
  }, [tasks])

  // Upcoming deadlines
  const upcomingDeadlines = useMemo(() =>
    tasks
      .filter((t) => t.deadline && t.progress < 100)
      .sort((a, b) => a.deadline! - b.deadline!)
      .slice(0, 6),
    [tasks]
  )

  // Epic progress
  const epicProgress = useMemo(() =>
    epics.filter((e) => e.status !== 'archived').map((e) => {
      const epicTasks = tasks.filter((t) => t.epicId === e.id)
      const done = epicTasks.filter((t) => t.status === 'done' || t.progress === 100).length
      const total = epicTasks.length
      const pct = total > 0 ? Math.round((done / total) * 100) : 0
      return { epic: e, done, total, pct }
    }),
    [epics, tasks]
  )

  // Task creation chart (last 14 days)
  const creationChart = useMemo(() => {
    const DAY = 86400000
    const days = 14
    const data: { day: string; tasks: number; done: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const start = Date.now() - (i + 1) * DAY
      const end = Date.now() - i * DAY
      const date = new Date(end)
      data.push({
        day: `${date.getDate()}.${date.getMonth() + 1}`,
        tasks: tasks.filter((t) => t.createdAt >= start && t.createdAt < end).length,
        done: tasks.filter((t) => t.status === 'done' && t.createdAt >= start && t.createdAt < end).length,
      })
    }
    return data
  }, [tasks])

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const bins = Array.from({ length: 10 }, (_, i) => ({ score: `${i + 1}`, count: 0 }))
    tasks.forEach((t) => {
      if (t.review) {
        const idx = Math.min(t.review.score - 1, 9)
        if (idx >= 0) bins[idx].count++
      }
    })
    return bins
  }, [tasks])

  // Agent radial data
  const agentRadial = useMemo(() =>
    agents.map((a, i) => ({
      name: a.name,
      value: a.successRate,
      fill: ['#8b5cf6', '#22d3ee', '#f472b6', '#fbbf24', '#34d399', '#f97316'][i % 6],
    })),
    [agents]
  )

  // Workload by hour (simulated from task creation timestamps)
  const heatmapData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, value: 0 }))
    tasks.forEach((t) => {
      const h = new Date(t.createdAt).getHours()
      hours[h].value++
    })
    return hours
  }, [tasks])

  return (
    <div className="space-y-6" data-tour="dashboard-page">

      {/* ── Hero Section with Robot ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-background to-indigo-50/30 dark:from-violet-950/50 dark:via-background dark:to-cyan-950/30 border border-border/50 p-8 min-h-[320px]">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-indigo-200/20 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex items-center justify-between gap-8">
          <div className="flex-1 space-y-4 max-w-lg">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500 font-medium tracking-wide uppercase">Система активна</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-violet-400 bg-clip-text text-transparent">
              LLM Kanban
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Оркестрация задач для AI-агентов. Создавайте задачи с промптами,
              назначайте агентов, отслеживайте результаты в реальном времени.
            </p>

            {/* Quick stats row */}
            <div className="flex items-center gap-6 pt-2">
              <div>
                <p className="text-2xl font-bold"><AnimatedNumber value={stats.total} /></p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Задач</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-green-500"><AnimatedNumber value={stats.done} /></p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Готово</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-violet-500"><AnimatedNumber value={agents.filter(a => a.status !== 'offline').length} /></p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Агентов</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-cyan-500">{stats.avgScore.toFixed(1)}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ср. оценка</p>
              </div>
            </div>
          </div>

          {/* Robot */}
          <div className="relative hidden lg:block -ml-8">
            <AnimatedRobot />

            {/* Floating status cards around robot */}
            <FloatingCard
              icon={Zap} label="Скорость" value="1.2x"
              color="#fbbf24" delay="0s"
              className="top-0 -left-24"
            />
            <FloatingCard
              icon={Shield} label="Успешность" value={`${agents[0]?.successRate || 95}%`}
              color="#22c55e" delay="0.5s"
              className="top-16 -right-20"
            />
            <FloatingCard
              icon={Eye} label="Мониторинг" value="24/7"
              color="#8b5cf6" delay="1s"
              className="bottom-12 -left-16"
            />
          </div>
        </div>
      </div>

      {/* ── Row 1: KPI Cards ── */}
      <div data-tour="dashboard-stats" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Всего задач</p>
                <p className="text-3xl font-bold mt-1"><AnimatedNumber value={stats.total} /></p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-foreground/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ListChecks className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-3 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={creationChart}>
                  <Area type="monotone" dataKey="tasks" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.08} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Завершено</p>
                <p className="text-3xl font-bold mt-1"><AnimatedNumber value={stats.done} /><span className="text-sm text-muted-foreground font-normal">/{stats.total}</span></p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={stats.completionRate} size="sm" className="flex-1" />
              <span className="text-xs font-medium">{stats.completionRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Средняя оценка</p>
                <p className="text-3xl font-bold mt-1">{stats.avgScore.toFixed(1)}<span className="text-sm text-muted-foreground font-normal">/10</span></p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">По {stats.reviewed} ревью</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Просрочено</p>
                <p className={cn('text-3xl font-bold mt-1', stats.overdue > 0 && 'text-destructive')}><AnimatedNumber value={stats.overdue} /></p>
              </div>
              <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', stats.overdue > 0 ? 'bg-red-500/10' : 'bg-foreground/5 dark:bg-primary/10')}>
                <AlertTriangle className={cn('h-6 w-6', stats.overdue > 0 ? 'text-red-500' : 'text-muted-foreground')} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{stats.active} в работе, {stats.failed} провалено</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Activity Area Chart + Priority Pie ── */}
      <div data-tour="dashboard-charts" className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" /> Активность за 14 дней
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={creationChart}>
                  <defs>
                    <linearGradient id="gradTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<MiniTooltip />} />
                  <Area type="monotone" dataKey="tasks" name="Создано" stroke="#8b5cf6" fill="url(#gradTasks)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="done" name="Завершено" stroke="#22c55e" fill="url(#gradDone)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Приоритеты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {priorityData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<MiniTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mt-1">
              {priorityData.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-muted-foreground">{p.name}</span>
                  <span className="font-medium ml-auto">{p.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Column distribution bar chart + Score distribution ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Распределение по столбцам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={columnData} layout="vertical" barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<MiniTooltip />} />
                  <Bar dataKey="value" name="Задач" radius={[0, 6, 6, 0]}>
                    {columnData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </RBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4" /> Распределение оценок
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={scoreDistribution} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="score" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip content={<MiniTooltip />} />
                  <Bar dataKey="count" name="Ревью" radius={[4, 4, 0, 0]}>
                    {scoreDistribution.map((entry, i) => (
                      <Cell key={i} fill={i < 3 ? '#ef4444' : i < 6 ? '#fbbf24' : '#22c55e'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </RBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Всего ревью: {stats.reviewed}</span>
              <span className="font-medium text-foreground">Средняя: {stats.avgScore.toFixed(1)}/10</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: Agent radial chart + Workload heatmap ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" /> Успешность агентов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={agentRadial} startAngle={180} endAngle={-180}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={6}
                    background={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Tooltip content={<MiniTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center text-xs mt-1">
              {agentRadial.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: a.fill }} />
                  <span className="text-muted-foreground">{a.name}</span>
                  <span className="font-medium">{a.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4" /> Нагрузка по часам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={heatmapData} barCategoryGap="10%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip content={<MiniTooltip />} />
                  <Bar dataKey="value" name="Задач" radius={[3, 3, 0, 0]}>
                    {heatmapData.map((entry, i) => (
                      <Cell key={i} fill={`hsl(${260 - (entry.value * 20)}, 70%, ${55 + Math.max(0, 30 - entry.value * 5)}%)`} />
                    ))}
                  </Bar>
                </RBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 5: Active tasks + Upcoming deadlines ── */}
      <div data-tour="dashboard-active" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" /> Задачи в работе
              </CardTitle>
              <Badge variant="outline">{stats.active}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.filter((t) => t.progress > 0 && t.progress < 100).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Нет активных задач</p>
            )}
            {tasks.filter((t) => t.progress > 0 && t.progress < 100).map((task) => {
              const agent = agents.find((a) => a.id === task.assignedAgent)
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: task.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {agent && <p className="text-xs text-muted-foreground">{agent.name}</p>}
                  </div>
                  <div className="w-20 shrink-0">
                    <Progress value={task.progress} size="sm" />
                    <p className="text-[10px] text-muted-foreground text-center mt-0.5">{task.progress}%</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarClock className="h-4 w-4" /> Ближайшие дедлайны
              </CardTitle>
              <Badge variant="outline" className={cn(stats.overdue > 0 && 'border-destructive text-destructive')}>
                {stats.overdue > 0 ? `${stats.overdue} просрочено` : 'Все в срок'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Нет дедлайнов</p>
            )}
            {upcomingDeadlines.map((task) => {
              const daysLeft = Math.ceil((task.deadline! - Date.now()) / 86400000)
              const isOverdue = daysLeft < 0
              const isUrgent = daysLeft >= 0 && daysLeft <= 2
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', priorityDotColors[task.priority])} />
                  <p className="text-sm flex-1 truncate">{task.title}</p>
                  <span className={cn(
                    'text-xs shrink-0 font-medium',
                    isOverdue ? 'text-destructive' : isUrgent ? 'text-orange-500' : 'text-muted-foreground'
                  )}>
                    {isOverdue ? `${Math.abs(daysLeft)}д просрочено` : daysLeft === 0 ? 'Сегодня' : `${daysLeft}д`}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 6: Agent performance + Epic progress ── */}
      <div data-tour="dashboard-performance" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" /> Производительность агентов
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentPerf.map(({ agent, assigned, done, failed, avgScore }) => (
              <div
                key={agent.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/agents/${agent.id}`)}
              >
                <div className="h-10 w-10 rounded-xl bg-foreground/5 dark:bg-primary/10 text-foreground/70 text-xs font-bold flex items-center justify-center shrink-0">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <Badge variant="outline" className={cn('text-[10px] border',
                      agent.status === 'idle' ? 'border-green-500/30 text-green-500' :
                      agent.status === 'busy' ? 'border-yellow-500/30 text-yellow-500' :
                      'border-muted text-muted-foreground'
                    )}>
                      {agent.status === 'idle' ? 'Свободен' : agent.status === 'busy' ? 'Занят' : 'Офлайн'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{assigned} задач</span>
                    <span className="text-green-500">{done} готово</span>
                    {failed > 0 && <span className="text-red-500">{failed} провал</span>}
                    <span>{agent.successRate}% успех</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold">{avgScore ? avgScore.toFixed(1) : '—'}</p>
                  <p className="text-[10px] text-muted-foreground">ср. оценка</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4" /> Прогресс эпиков
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {epicProgress.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Нет активных эпиков</p>
            )}
            {epicProgress.map(({ epic, done, total, pct }) => (
              <div
                key={epic.id}
                className="p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/epics/${epic.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DynamicIcon name={epic.icon} className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{epic.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{done}/{total}</span>
                </div>
                <Progress value={pct} size="sm" />
                <div className="flex items-center justify-between mt-1.5">
                  <Badge variant="outline" className="text-[10px]" style={{ borderColor: epic.color + '40', color: epic.color }}>
                    {epic.status === 'planning' ? 'Планирование' : epic.status === 'active' ? 'Активный' : 'Завершён'}
                  </Badge>
                  {epic.targetDate && (
                    <span className={cn('text-[10px]', epic.targetDate < Date.now() && epic.status !== 'completed' ? 'text-destructive' : 'text-muted-foreground')}>
                      {new Date(epic.targetDate).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 7: Users + Tags + Timeline ── */}
      <div data-tour="dashboard-extras" className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Активные пользователи
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeUsers.map(({ user, total, created, comments }, i) => (
              <div
                key={user!.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/users/${user!.id}`)}
              >
                <span className="text-xs text-muted-foreground w-5 text-center font-bold">{i + 1}</span>
                <div className="h-9 w-9 rounded-xl bg-foreground/5 dark:bg-primary/10 text-foreground/70 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {user!.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{user!.name}</p>
                  <p className="text-xs text-muted-foreground">{user!.position}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  <span title="Задач создано">{created} задач</span>
                  <span title="Комментариев">{comments} комм.</span>
                  <span className="font-bold text-foreground">{total}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" /> Популярные теги
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tagData.map(([tag, count]) => {
                const maxCount = tagData[0]?.[1] || 1
                const intensity = 0.3 + (count / maxCount) * 0.7
                return (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="gap-1 transition-opacity cursor-default"
                    style={{ opacity: intensity }}
                  >
                    {tag}
                    <span className="text-[10px] text-muted-foreground">{count}</span>
                  </Badge>
                )
              })}
            </div>

            {/* Mini summary */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-bold">{stats.totalEstimate}м</p>
                <p className="text-[10px] text-muted-foreground">Общая оценка</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-bold">{Math.round(stats.totalEstimate / 60)}ч</p>
                <p className="text-[10px] text-muted-foreground">В часах</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-bold">{stats.totalComments}</p>
                <p className="text-[10px] text-muted-foreground">Комментариев</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-bold">{stats.doneSubtasks}/{stats.totalSubtasks}</p>
                <p className="text-[10px] text-muted-foreground">Подзадач</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Последние события
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-3">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {recentActivity.map((item, i) => {
                const dotColor = item.type === 'comment' ? 'bg-blue-500' :
                  item.logType === 'success' ? 'bg-green-500' :
                  item.logType === 'error' ? 'bg-red-500' :
                  item.logType === 'warning' ? 'bg-yellow-500' : 'bg-muted-foreground'
                return (
                  <div key={i} className="flex gap-3 relative">
                    <div className={cn('h-3.5 w-3.5 rounded-full shrink-0 mt-0.5 ring-2 ring-background', dotColor)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{item.message}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <span
                          className="hover:underline cursor-pointer truncate max-w-[120px]"
                          onClick={() => navigate(`/tasks/${item.taskId}`)}
                        >
                          {item.taskTitle}
                        </span>
                        {item.author && <span>· {item.author}</span>}
                        <span className="shrink-0">{timeAgo(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
