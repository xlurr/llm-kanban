import { useMemo, useCallback, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { cn } from '@/lib/utils'
import { Users, ZoomIn, Eye, EyeOff } from 'lucide-react'

// ── Data Types ───────────────────────────────────────

type ActorType = 'admin' | 'manager' | 'developer' | 'viewer' | 'agent' | 'system'
type UCGroup = 'task_management' | 'board_config' | 'monitoring' | 'agent_ops' | 'user_mgmt' | 'integration'

interface ActorDef {
  id: string
  name: string
  type: ActorType
  color: string
  description: string
}

interface UseCaseDef {
  id: string
  name: string
  group: UCGroup
  description: string
  actors: string[]
  includes?: string[]
  extends?: string[]
}

interface UCGroupDef {
  id: UCGroup
  name: string
  color: string
  description: string
}

// ── Data ─────────────────────────────────────────────

const ACTORS: ActorDef[] = [
  { id: 'admin', name: 'Администратор', type: 'admin', color: '#ef4444', description: 'Полный доступ, настройка системы, управление пользователями' },
  { id: 'manager', name: 'Менеджер', type: 'manager', color: '#f97316', description: 'Управление задачами, эпиками, назначение агентов' },
  { id: 'developer', name: 'Разработчик', type: 'developer', color: '#3b82f6', description: 'Создание задач, ревью, написание промптов' },
  { id: 'viewer', name: 'Наблюдатель', type: 'viewer', color: '#8b5cf6', description: 'Только чтение: дашборд, статусы задач' },
  { id: 'agent', name: 'LLM-агент', type: 'agent', color: '#22c55e', description: 'Claude Code, Codex CLI, Gemini CLI — выполнение задач' },
  { id: 'system', name: 'Система', type: 'system', color: '#64748b', description: 'Автоматические процессы: cron, triggers, CDC' },
]

const UC_GROUPS: UCGroupDef[] = [
  { id: 'task_management', name: 'Управление задачами', color: '#3b82f6', description: 'Полный цикл задач от создания до завершения' },
  { id: 'board_config', name: 'Конфигурация доски', color: '#8b5cf6', description: 'Настройка колонок, переходов, автоматизации' },
  { id: 'monitoring', name: 'Мониторинг и аналитика', color: '#06b6d4', description: 'Дашборды, отчёты, метрики' },
  { id: 'agent_ops', name: 'Работа с агентами', color: '#22c55e', description: 'Управление и выполнение задач агентами' },
  { id: 'user_mgmt', name: 'Управление пользователями', color: '#f97316', description: 'Роли, команды, профили' },
  { id: 'integration', name: 'Интеграции', color: '#ec4899', description: 'Webhook, уведомления, API' },
]

const USE_CASES: UseCaseDef[] = [
  // Task Management
  { id: 'uc_create_task', name: 'Создать задачу', group: 'task_management', description: 'Создание новой задачи с описанием, приоритетом и тегами', actors: ['manager', 'developer', 'admin'], includes: ['uc_write_prompt'] },
  { id: 'uc_write_prompt', name: 'Написать промпт', group: 'task_management', description: 'Формулировка промпта для LLM-агента', actors: ['developer', 'manager'] },
  { id: 'uc_edit_task', name: 'Редактировать задачу', group: 'task_management', description: 'Изменение полей задачи', actors: ['manager', 'developer', 'admin'] },
  { id: 'uc_move_task', name: 'Переместить задачу', group: 'task_management', description: 'Drag & Drop по канбан-доске с учётом графа переходов', actors: ['manager', 'developer', 'admin'], includes: ['uc_check_transition'] },
  { id: 'uc_check_transition', name: 'Проверить переход', group: 'task_management', description: 'Валидация разрешённости перехода между колонками', actors: ['system'] },
  { id: 'uc_assign_agent', name: 'Назначить агента', group: 'task_management', description: 'Выбор LLM-агента для выполнения задачи', actors: ['manager', 'developer'] },
  { id: 'uc_set_priority', name: 'Установить приоритет', group: 'task_management', description: 'Назначение приоритета: low, medium, high, critical', actors: ['manager', 'developer'] },
  { id: 'uc_add_subtask', name: 'Добавить подзадачу', group: 'task_management', description: 'Декомпозиция задачи на подзадачи', actors: ['developer', 'manager'] },
  { id: 'uc_comment', name: 'Комментировать', group: 'task_management', description: 'Обсуждение задачи в тредах', actors: ['developer', 'manager', 'admin'] },
  { id: 'uc_review', name: 'Провести ревью', group: 'task_management', description: 'Оценка результата агента по шкале 1-10', actors: ['developer', 'manager'], extends: ['uc_auto_review'] },
  { id: 'uc_auto_review', name: 'AI-ревью', group: 'task_management', description: 'Автоматическая оценка качества через LLM', actors: ['system', 'agent'] },
  { id: 'uc_set_deadline', name: 'Установить дедлайн', group: 'task_management', description: 'Назначение крайнего срока', actors: ['manager'] },
  { id: 'uc_attach_file', name: 'Прикрепить файл', group: 'task_management', description: 'Загрузка вложений к задаче', actors: ['developer', 'manager'] },
  { id: 'uc_add_dependency', name: 'Добавить зависимость', group: 'task_management', description: 'Связь задач: blocks, related, duplicates', actors: ['manager', 'developer'] },

  // Board Config
  { id: 'uc_manage_columns', name: 'Управлять колонками', group: 'board_config', description: 'CRUD колонок, WIP-лимиты, порядок', actors: ['admin'] },
  { id: 'uc_setup_transitions', name: 'Настроить переходы', group: 'board_config', description: 'Визуальный граф разрешённых переходов (React Flow)', actors: ['admin'] },
  { id: 'uc_create_automation', name: 'Создать правило автоматизации', group: 'board_config', description: 'Триггер → условие → действие', actors: ['admin'] },
  { id: 'uc_manage_templates', name: 'Управлять шаблонами промптов', group: 'board_config', description: 'Версионирование, категории, переменные', actors: ['admin', 'manager'] },

  // Monitoring
  { id: 'uc_view_dashboard', name: 'Просмотр дашборда', group: 'monitoring', description: 'Виджеты: статистика, графики, распределение', actors: ['admin', 'manager', 'developer', 'viewer'] },
  { id: 'uc_filter_tasks', name: 'Фильтровать задачи', group: 'monitoring', description: 'Поиск, фильтрация по статусу/приоритету/агенту/тегам', actors: ['admin', 'manager', 'developer', 'viewer'] },
  { id: 'uc_view_logs', name: 'Просмотр логов', group: 'monitoring', description: 'Логи выполнения задач агентами', actors: ['developer', 'manager', 'admin'] },
  { id: 'uc_view_analytics', name: 'Просмотр аналитики', group: 'monitoring', description: 'Метрики агентов, cost tracking, lead time', actors: ['admin', 'manager'] },
  { id: 'uc_export_report', name: 'Экспорт отчёта', group: 'monitoring', description: 'Выгрузка данных в CSV/JSON', actors: ['admin', 'manager'] },

  // Agent Ops
  { id: 'uc_register_agent', name: 'Зарегистрировать агента', group: 'agent_ops', description: 'Добавление нового LLM-агента в систему', actors: ['admin'] },
  { id: 'uc_configure_agent', name: 'Настроить агента', group: 'agent_ops', description: 'Model, temperature, maxTokens, capabilities', actors: ['admin'] },
  { id: 'uc_execute_task', name: 'Выполнить задачу', group: 'agent_ops', description: 'Агент получает промпт, выполняет, возвращает результат', actors: ['agent'], includes: ['uc_send_logs'] },
  { id: 'uc_send_logs', name: 'Отправить логи', group: 'agent_ops', description: 'Стриминг логов выполнения в реальном времени', actors: ['agent'] },
  { id: 'uc_return_result', name: 'Вернуть результат', group: 'agent_ops', description: 'Артефакты, token usage, статус выполнения', actors: ['agent'] },
  { id: 'uc_auto_assign', name: 'Авто-назначение', group: 'agent_ops', description: 'Система выбирает оптимального агента по capabilities', actors: ['system'] },
  { id: 'uc_retry_task', name: 'Повторить задачу', group: 'agent_ops', description: 'Перезапуск при ошибке с circuit breaker', actors: ['system', 'manager'] },

  // User Mgmt
  { id: 'uc_manage_users', name: 'Управлять пользователями', group: 'user_mgmt', description: 'CRUD, роли, блокировка', actors: ['admin'] },
  { id: 'uc_manage_teams', name: 'Управлять командами', group: 'user_mgmt', description: 'Создание команд, назначение участников', actors: ['admin', 'manager'] },
  { id: 'uc_edit_profile', name: 'Редактировать профиль', group: 'user_mgmt', description: 'Имя, аватар, bio, должность', actors: ['developer', 'manager', 'admin'] },
  { id: 'uc_auth', name: 'Авторизоваться', group: 'user_mgmt', description: 'JWT-аутентификация, сессии', actors: ['admin', 'manager', 'developer', 'viewer'] },

  // Integration
  { id: 'uc_setup_webhook', name: 'Настроить Webhook', group: 'integration', description: 'URL, events, secret, retry policy', actors: ['admin'] },
  { id: 'uc_manage_api_keys', name: 'Управлять API-ключами', group: 'integration', description: 'Создание, ротация, revoke', actors: ['admin'] },
  { id: 'uc_receive_notification', name: 'Получить уведомление', group: 'integration', description: 'Email, push, in-app', actors: ['developer', 'manager', 'admin'] },
  { id: 'uc_view_audit_log', name: 'Просмотр аудит-лога', group: 'integration', description: 'Кто, что, когда — полный audit trail', actors: ['admin'] },
]

// ── Relation Data ────────────────────────────────────

interface UCRelation {
  from: string
  to: string
  type: 'actor' | 'include' | 'extend'
  label?: string
}

function buildRelations(): UCRelation[] {
  const rels: UCRelation[] = []
  USE_CASES.forEach(uc => {
    uc.actors.forEach(a => {
      rels.push({ from: a, to: uc.id, type: 'actor' })
    })
    uc.includes?.forEach(inc => {
      rels.push({ from: uc.id, to: inc, type: 'include', label: '«include»' })
    })
    uc.extends?.forEach(ext => {
      rels.push({ from: ext, to: uc.id, type: 'extend', label: '«extend»' })
    })
  })
  return rels
}

const ALL_RELATIONS = buildRelations()

// ── Actor Node ───────────────────────────────────────

interface ActorNodeData {
  actor: ActorDef
  highlighted: boolean
  dimmed: boolean
  [key: string]: unknown
}

function StickFigure({ color, size = 40 }: { color: string; size?: number }) {
  const s = size
  return (
    <svg width={s} height={s * 1.4} viewBox="0 0 40 56" fill="none">
      {/* Head */}
      <circle cx="20" cy="10" r="8" stroke={color} strokeWidth="2.5" fill="none" />
      {/* Body */}
      <line x1="20" y1="18" x2="20" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms */}
      <line x1="6" y1="26" x2="34" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="20" y1="36" x2="8" y2="52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="20" y1="36" x2="32" y2="52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function RobotFigure({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none">
      {/* Antenna */}
      <line x1="20" y1="0" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="2" r="2" fill={color} />
      {/* Head */}
      <rect x="8" y="6" width="24" height="18" rx="4" stroke={color} strokeWidth="2" fill="none" />
      {/* Eyes */}
      <circle cx="15" cy="15" r="2.5" fill={color} />
      <circle cx="25" cy="15" r="2.5" fill={color} />
      {/* Body */}
      <rect x="10" y="26" width="20" height="14" rx="3" stroke={color} strokeWidth="2" fill="none" />
      {/* Legs */}
      <line x1="15" y1="40" x2="15" y2="50" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="25" y1="40" x2="25" y2="50" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function GearFigure({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="20" cy="20" r="3" fill={color} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
        const rad = (angle * Math.PI) / 180
        const x1 = 20 + Math.cos(rad) * 11
        const y1 = 20 + Math.sin(rad) * 11
        const x2 = 20 + Math.cos(rad) * 16
        const y2 = 20 + Math.sin(rad) * 16
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />
      })}
    </svg>
  )
}

function ActorNode({ data }: { data: ActorNodeData }) {
  const { actor, highlighted, dimmed } = data
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 bg-card min-w-[120px]',
        highlighted && 'shadow-xl scale-105',
        dimmed && 'opacity-15',
      )}
      style={{ borderColor: highlighted ? actor.color : 'hsl(var(--border))' }}
    >
      <Handle type="source" position={Position.Right} className="!bg-transparent !w-3 !h-full !min-w-0 !border-0 !rounded-none !right-0" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !w-3 !h-full !min-w-0 !border-0 !rounded-none !left-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !bottom-0" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !top-0" />

      {actor.type === 'agent' ? (
        <RobotFigure color={actor.color} size={32} />
      ) : actor.type === 'system' ? (
        <GearFigure color={actor.color} size={32} />
      ) : (
        <StickFigure color={actor.color} size={28} />
      )}
      <div className="font-semibold text-[11px] text-center mt-1">{actor.name}</div>
      {highlighted && (
        <div className="text-[9px] text-muted-foreground text-center max-w-[140px] leading-tight">
          {actor.description}
        </div>
      )}
    </div>
  )
}

// ── Use Case Node ────────────────────────────────────

interface UCNodeData {
  uc: UseCaseDef
  groupDef: UCGroupDef
  highlighted: boolean
  dimmed: boolean
  depth: number
  [key: string]: unknown
}

function UseCaseNode({ data }: { data: UCNodeData }) {
  const { uc, groupDef, highlighted, dimmed, depth } = data
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[50%] border-2 transition-all duration-200 bg-card text-center',
        highlighted && 'shadow-xl scale-105',
        dimmed && 'opacity-15',
      )}
      style={{
        borderColor: highlighted ? groupDef.color : 'hsl(var(--border))',
        width: depth >= 3 ? 180 : 150,
        height: depth >= 3 ? 90 : 70,
        padding: '8px 16px',
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !w-3 !h-full !min-w-0 !border-0 !rounded-none !left-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !w-3 !h-full !min-w-0 !border-0 !rounded-none !right-0" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !top-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !bottom-0" />

      <div className="font-semibold text-[10px] leading-tight">{uc.name}</div>
      {depth >= 3 && highlighted && (
        <div className="text-[8px] text-muted-foreground mt-1 leading-tight max-w-[150px]">
          {uc.description}
        </div>
      )}
    </div>
  )
}

// ── Group Node (depth 1) ─────────────────────────────

interface UCGroupNodeData {
  groupDef: UCGroupDef
  count: number
  actorNames: string[]
  [key: string]: unknown
}

function UCGroupNode({ data }: { data: UCGroupNodeData }) {
  const { groupDef, count, actorNames } = data
  return (
    <div
      className="rounded-2xl border-2 overflow-hidden shadow-xl min-w-[260px] cursor-grab active:cursor-grabbing bg-card"
      style={{ borderColor: groupDef.color }}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !w-3 !h-full !min-w-0 !border-0 !rounded-none !left-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !w-3 !h-full !min-w-0 !border-0 !rounded-none !right-0" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !top-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !bottom-0" />

      <div className="px-5 py-4" style={{ background: `${groupDef.color}15` }}>
        <div className="font-bold text-sm">{groupDef.name}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{groupDef.description}</div>
      </div>
      <div className="px-5 py-3 space-y-1.5">
        <div className="text-xs">
          <span className="font-bold" style={{ color: groupDef.color }}>{count}</span>
          <span className="text-muted-foreground"> прецедентов</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {actorNames.map(a => (
            <span key={a} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  actor: ActorNode as any,
  usecase: UseCaseNode as any,
  ucgroup: UCGroupNode as any,
}

// ── Positions ────────────────────────────────────────

function getActorPositions(): Record<string, { x: number; y: number }> {
  return {
    admin:     { x: -300, y: 0 },
    manager:   { x: -300, y: 250 },
    developer: { x: -300, y: 500 },
    viewer:    { x: -300, y: 750 },
    agent:     { x: 1400, y: 150 },
    system:    { x: 1400, y: 500 },
  }
}

function getUCPositions(): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {}
  let groupY = 0
  UC_GROUPS.forEach(grp => {
    const ucs = USE_CASES.filter(u => u.group === grp.id)
    ucs.forEach((uc, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      pos[uc.id] = { x: 200 + col * 220, y: groupY + row * 110 }
    })
    groupY += Math.ceil(ucs.length / 3) * 110 + 80
  })
  return pos
}

function getGroupPositions(): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {}
  UC_GROUPS.forEach((grp, i) => {
    pos[`grp-${grp.id}`] = { x: 300, y: i * 200 }
  })
  return pos
}

// ── Main Component ───────────────────────────────────

function UseCasesInner() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [depth, setDepth] = useState<1 | 2 | 3>(2)
  const [showLabels, setShowLabels] = useState(true)

  const connected = useMemo(() => {
    if (!hovered) return new Set<string>()
    const set = new Set<string>([hovered])
    if (depth === 1) {
      // Group level connections
      const groupActorMap: Record<string, Set<string>> = {}
      USE_CASES.forEach(uc => {
        uc.actors.forEach(a => {
          const key = `grp-${uc.group}`
          if (!groupActorMap[key]) groupActorMap[key] = new Set()
          groupActorMap[key].add(a)
        })
      })
      if (hovered.startsWith('grp-')) {
        groupActorMap[hovered]?.forEach(a => set.add(a))
      } else {
        Object.entries(groupActorMap).forEach(([grp, actors]) => {
          if (actors.has(hovered)) set.add(grp)
        })
      }
    } else {
      ALL_RELATIONS.forEach(r => {
        if (r.from === hovered) set.add(r.to)
        if (r.to === hovered) set.add(r.from)
      })
    }
    return set
  }, [hovered, depth])

  const computedNodes: Node[] = useMemo(() => {
    const nodes: Node[] = []
    const actorPos = getActorPositions()

    // Always show actors
    ACTORS.forEach(actor => {
      nodes.push({
        id: actor.id,
        type: 'actor',
        position: actorPos[actor.id] || { x: 0, y: 0 },
        data: {
          actor,
          highlighted: hovered === actor.id,
          dimmed: hovered !== null && !connected.has(actor.id),
        } satisfies ActorNodeData,
      })
    })

    if (depth === 1) {
      // Group nodes
      const grpPos = getGroupPositions()
      UC_GROUPS.forEach(grp => {
        const ucs = USE_CASES.filter(u => u.group === grp.id)
        const actorIds = [...new Set(ucs.flatMap(u => u.actors))]
        const actorNames = actorIds.map(id => ACTORS.find(a => a.id === id)?.name || id)
        nodes.push({
          id: `grp-${grp.id}`,
          type: 'ucgroup',
          position: grpPos[`grp-${grp.id}`] || { x: 0, y: 0 },
          data: {
            groupDef: grp,
            count: ucs.length,
            actorNames,
          } satisfies UCGroupNodeData,
        })
      })
    } else {
      // Individual use case nodes
      const ucPos = getUCPositions()
      USE_CASES.forEach(uc => {
        const grpDef = UC_GROUPS.find(g => g.id === uc.group)!
        nodes.push({
          id: uc.id,
          type: 'usecase',
          position: ucPos[uc.id] || { x: 0, y: 0 },
          data: {
            uc,
            groupDef: grpDef,
            highlighted: hovered === uc.id,
            dimmed: hovered !== null && !connected.has(uc.id),
            depth,
          } satisfies UCNodeData,
        })
      })
    }

    return nodes
  }, [hovered, connected, depth])

  const computedEdges: Edge[] = useMemo(() => {
    if (depth === 1) {
      // Actor → Group edges
      const edges: Edge[] = []
      const seen = new Set<string>()
      USE_CASES.forEach(uc => {
        uc.actors.forEach(a => {
          const key = `${a}->grp-${uc.group}`
          if (seen.has(key)) return
          seen.add(key)
          const isHl = hovered && (hovered === a || hovered === `grp-${uc.group}`)
          const isDim = hovered && !isHl
          const actor = ACTORS.find(ac => ac.id === a)
          edges.push({
            id: key,
            source: a,
            target: `grp-${uc.group}`,
            type: 'smoothstep',
            animated: !!isHl,
            style: {
              stroke: isHl ? (actor?.color || '#64748b') : isDim ? '#1a1a1e' : '#3f3f4660',
              strokeWidth: isHl ? 2.5 : 1,
              opacity: isDim ? 0.08 : 1,
            },
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: isHl ? (actor?.color || '#64748b') : isDim ? '#1a1a1e' : '#3f3f4660' },
          })
        })
      })
      return edges
    }

    // Depth 2 & 3 — individual relations
    return ALL_RELATIONS.map((rel, i) => {
      const isHl = hovered && (rel.from === hovered || rel.to === hovered)
      const isDim = hovered && !isHl
      const actor = ACTORS.find(a => a.id === rel.from)
      const color = actor?.color || '#64748b'

      return {
        id: `r-${i}`,
        source: rel.from,
        target: rel.to,
        type: 'smoothstep',
        animated: !!isHl,
        label: showLabels && rel.label ? rel.label : undefined,
        labelStyle: { fontSize: 9, fontFamily: 'ui-monospace', fill: isHl ? '#fafafa' : '#52525b', fontStyle: 'italic' },
        labelBgStyle: { fill: 'hsl(var(--background))', fillOpacity: 0.8, rx: 3, ry: 3 },
        labelBgPadding: [2, 4] as [number, number],
        style: {
          stroke: isHl ? color : isDim ? '#1a1a1e' : rel.type === 'actor' ? '#3f3f4660' : rel.type === 'include' ? '#3b82f640' : '#8b5cf640',
          strokeWidth: isHl ? 2.5 : rel.type === 'actor' ? 1 : 1.5,
          strokeDasharray: rel.type === 'include' ? '6 3' : rel.type === 'extend' ? '3 3' : undefined,
          opacity: isDim ? 0.08 : 1,
        },
        markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: isHl ? color : isDim ? '#1a1a1e' : '#3f3f4660' },
      }
    })
  }, [hovered, depth, showLabels])

  const [ns, setNs, onNC] = useNodesState(computedNodes)
  const [es, setEs, onEC] = useEdgesState(computedEdges)

  useMemo(() => {
    setNs(prev => {
      const pm = new Map(prev.map(n => [n.id, n.position]))
      return computedNodes.map(n => ({ ...n, position: pm.get(n.id) || n.position }))
    })
  }, [computedNodes])
  useMemo(() => { setEs(computedEdges) }, [computedEdges])

  const onEnter = useCallback((_: React.MouseEvent, node: Node) => setHovered(node.id), [])
  const onLeave = useCallback(() => setHovered(null), [])

  return (
    <div className="h-[calc(100vh-7.5rem)]" data-tour="use-cases-page">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-muted-foreground" />
            Диаграмма прецедентов
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {ACTORS.length} акторов · {USE_CASES.length} прецедентов · {UC_GROUPS.length} групп
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-1 bg-card border rounded-lg p-0.5">
          <ZoomIn className="h-3.5 w-3.5 text-muted-foreground ml-2 mr-1" />
          {([1, 2, 3] as const).map(d => (
            <button
              key={d}
              onClick={() => setDepth(d)}
              className={cn(
                'px-3 py-1 rounded-md text-[11px] font-medium transition-all',
                depth === d ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {d === 1 ? 'Обзор' : d === 2 ? 'Прецеденты' : 'Детали'}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        <button
          onClick={() => setShowLabels(!showLabels)}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border transition-all',
            showLabels ? 'border-border bg-card' : 'border-transparent opacity-50',
          )}
        >
          {showLabels ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          Подписи
        </button>

        <div className="w-px h-6 bg-border" />

        <div className="flex gap-2 text-[10px]">
          {ACTORS.map(a => (
            <div key={a.id} className="flex items-center gap-1 text-muted-foreground">
              <div className="h-2 w-2 rounded-full" style={{ background: a.color }} />
              {a.name}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden h-[calc(100%-6.5rem)] relative">
        <ReactFlow
          nodes={ns} edges={es} nodeTypes={nodeTypes}
          onNodesChange={onNC} onEdgesChange={onEC}
          onNodeMouseEnter={onEnter} onNodeMouseLeave={onLeave}
          fitView fitViewOptions={{ padding: 0.12 }}
          nodesDraggable panOnDrag zoomOnScroll
          minZoom={0.1} maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background gap={24} size={1} className="!bg-background" />
          <Controls showInteractive={false} className="!bg-card !border-border !shadow-sm [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted" />
          <MiniMap
            nodeColor={(node) => {
              const actor = ACTORS.find(a => a.id === node.id)
              if (actor) return actor.color
              const uc = USE_CASES.find(u => u.id === node.id)
              if (uc) return UC_GROUPS.find(g => g.id === uc.group)?.color || '#3f3f46'
              return '#3f3f46'
            }}
            maskColor="hsl(var(--background) / 0.85)" className="!bg-card !border-border" pannable zoomable
          />
        </ReactFlow>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 text-[10px] space-y-1.5 z-10">
          <div className="font-semibold text-xs mb-2">Связи</div>
          <div className="flex items-center gap-2"><div className="w-6 h-0 border-t-2" style={{ borderColor: '#64748b' }} /><span className="text-muted-foreground">Актор → Прецедент</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-0 border-t-2 border-dashed" style={{ borderColor: '#3b82f6' }} /><span className="text-muted-foreground">«include»</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-0 border-t border-dotted" style={{ borderColor: '#8b5cf6' }} /><span className="text-muted-foreground">«extend»</span></div>
        </div>
      </div>
    </div>
  )
}

export function UseCasesPage() {
  return (
    <ReactFlowProvider>
      <UseCasesInner />
    </ReactFlowProvider>
  )
}
