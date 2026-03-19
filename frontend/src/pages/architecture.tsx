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
import {
  Server, Globe, Database, Shield, Cpu, Radio,
  HardDrive, Layers, Container, Network, Eye, EyeOff,
  MonitorSpeaker, Workflow, ArrowRightLeft, ZoomIn,
} from 'lucide-react'

// ── Tech Logos ───────────────────────────────────────

const TECH_LOGO: Record<string, { sym: string; bg: string; fg: string }> = {
  'React 19':       { sym: '⚛',  bg: '#61dafb20', fg: '#61dafb' },
  'TypeScript':     { sym: 'TS', bg: '#3178c620', fg: '#3178c6' },
  'Go 1.22':        { sym: 'Go', bg: '#00add820', fg: '#00add8' },
  'PostgreSQL 16':  { sym: '🐘', bg: '#33679120', fg: '#4169e1' },
  'Redis 7':        { sym: '◆',  bg: '#dc382d20', fg: '#dc382d' },
  'Kafka 3.7':      { sym: 'K',  bg: '#23120920', fg: '#e04e39' },
  'Nginx 1.25':     { sym: 'N',  bg: '#009639',   fg: '#fff' },
  'Elasticsearch 8':{ sym: 'ES', bg: '#fed10a20', fg: '#fed10a' },
  'ClickHouse 24':  { sym: 'CH', bg: '#ffcc0020', fg: '#ffcc00' },
  'Grafana 11':     { sym: 'G',  bg: '#f4611120', fg: '#f46111' },
  'Prometheus':     { sym: 'P',  bg: '#e6522c20', fg: '#e6522c' },
  'Kubernetes':     { sym: '☸',  bg: '#326ce520', fg: '#326ce5' },
  'K8s 1.30':       { sym: '☸',  bg: '#326ce520', fg: '#326ce5' },
  'Helm':           { sym: 'H',  bg: '#0f184820', fg: '#0f1848' },
  'gRPC':           { sym: 'g',  bg: '#24485620', fg: '#244856' },
  'Protobuf':       { sym: 'PB', bg: '#24485620', fg: '#4a9' },
  'Docker':         { sym: '🐳', bg: '#2496ed20', fg: '#2496ed' },
  'Debezium':       { sym: 'Dz', bg: '#e0282820', fg: '#e02828' },
  'Vault':          { sym: 'V',  bg: '#00000020', fg: '#ffec6e' },
  'MinIO':          { sym: 'M',  bg: '#c7254e20', fg: '#c7254e' },
  'Jaeger':         { sym: 'J',  bg: '#60d0e420', fg: '#60d0e4' },
  'JWT':            { sym: 'J',  bg: '#d63aff20', fg: '#d63aff' },
  'Chi':            { sym: 'χ',  bg: '#00add820', fg: '#00add8' },
  'GORM':           { sym: 'ORM',bg: '#00add820', fg: '#00add8' },
  'Tailwind CSS':   { sym: 'TW', bg: '#38bdf820', fg: '#38bdf8' },
  'Zustand':        { sym: 'Z',  bg: '#443d3620', fg: '#f0b54a' },
  'Vite 6':         { sym: '⚡', bg: '#646cff20', fg: '#646cff' },
  '@dnd-kit':       { sym: 'DK', bg: '#7c3aed20', fg: '#7c3aed' },
  'React Flow':     { sym: 'RF', bg: '#ff006620', fg: '#ff0066' },
}

function TechBadge({ name }: { name: string }) {
  const logo = TECH_LOGO[name]
  if (!logo) {
    return (
      <span className="text-[8px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
        {name}
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded font-bold"
      style={{ background: logo.bg, color: logo.fg }}
    >
      <span className="text-[9px]">{logo.sym}</span>
      <span className="text-[7px] opacity-80">{name.replace(/\s*\d+(\.\d+)?$/, '')}</span>
    </span>
  )
}

// ── Data Types ───────────────────────────────────────

type ServiceGroup = 'client' | 'gateway' | 'service' | 'worker' | 'messaging' | 'database' | 'cache' | 'monitoring' | 'infrastructure'

interface ServiceDef {
  id: string
  name: string
  subtitle: string
  group: ServiceGroup
  color: string
  icon: string
  tech: string[]
  ports?: string[]
  replicas?: number
  description?: string
}

interface ConnectionDef {
  from: string
  to: string
  label?: string
  type: 'sync' | 'async' | 'data' | 'monitor'
}

// ── Service Data ─────────────────────────────────────

const SERVICES: ServiceDef[] = [
  { id: 'spa', name: 'SPA Frontend', subtitle: 'React 19 + Vite 6', group: 'client', color: '#3b82f6', icon: 'globe', tech: ['React 19', 'TypeScript', 'Vite 6', 'Tailwind CSS', 'Zustand', '@dnd-kit', 'React Flow'], description: 'SPA — канбан-доска, дашборд, аналитика' },
  { id: 'mobile', name: 'Mobile PWA', subtitle: 'Progressive Web App', group: 'client', color: '#3b82f6', icon: 'monitor', tech: ['React 19', 'TypeScript'], description: 'Мобильный клиент через PWA' },

  { id: 'nginx', name: 'Nginx', subtitle: 'Reverse Proxy + LB', group: 'gateway', color: '#22c55e', icon: 'shield', tech: ['Nginx 1.25'], ports: ['80', '443'], replicas: 2, description: 'Load balancer, TLS, статика, rate limiting' },
  { id: 'api_gateway', name: 'API Gateway', subtitle: 'Go + Chi Router', group: 'gateway', color: '#22c55e', icon: 'server', tech: ['Go 1.22', 'Chi', 'JWT', 'gRPC'], ports: ['8080'], replicas: 3, description: 'Auth, routing, rate limiting, tracing' },
  { id: 'ws_gateway', name: 'WebSocket Gateway', subtitle: 'Go + Gorilla WS', group: 'gateway', color: '#22c55e', icon: 'radio', tech: ['Go 1.22', 'Redis 7'], ports: ['8081'], replicas: 2, description: 'Real-time обновления доски' },

  { id: 'task_svc', name: 'Task Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'server', tech: ['Go 1.22', 'GORM', 'gRPC', 'Protobuf'], ports: ['9001'], replicas: 3, description: 'CRUD задач, lifecycle, DAG зависимостей' },
  { id: 'board_svc', name: 'Board Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'server', tech: ['Go 1.22', 'GORM', 'gRPC'], ports: ['9002'], replicas: 2, description: 'Колонки, переходы, WIP-лимиты' },
  { id: 'agent_svc', name: 'Agent Orchestrator', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'cpu', tech: ['Go 1.22', 'gRPC'], ports: ['9003'], replicas: 3, description: 'Оркестрация LLM-агентов, retry, circuit breaker' },
  { id: 'user_svc', name: 'User Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'server', tech: ['Go 1.22', 'GORM', 'JWT'], ports: ['9004'], replicas: 2, description: 'Auth, профили, команды, роли' },
  { id: 'epic_svc', name: 'Epic Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'layers', tech: ['Go 1.22', 'GORM', 'gRPC'], ports: ['9005'], replicas: 2, description: 'Эпики, бюджеты, прогресс' },
  { id: 'review_svc', name: 'Review Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'server', tech: ['Go 1.22', 'gRPC'], ports: ['9006'], replicas: 2, description: 'Code review, scoring, AI-assisted анализ' },
  { id: 'notification_svc', name: 'Notification Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'server', tech: ['Go 1.22'], ports: ['9007'], replicas: 2, description: 'Email, push, in-app уведомления' },
  { id: 'analytics_svc', name: 'Analytics Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'server', tech: ['Go 1.22', 'ClickHouse 24', 'gRPC'], ports: ['9008'], replicas: 2, description: 'Метрики, cost tracking, отчёты' },
  { id: 'search_svc', name: 'Search Service', subtitle: 'Go Microservice', group: 'service', color: '#8b5cf6', icon: 'server', tech: ['Go 1.22', 'Elasticsearch 8', 'gRPC'], ports: ['9009'], description: 'Полнотекстовый поиск' },

  { id: 'agent_worker', name: 'Agent Worker', subtitle: 'Go Worker Pool', group: 'worker', color: '#f97316', icon: 'cpu', tech: ['Go 1.22', 'Kafka 3.7'], replicas: 5, description: 'Выполнение LLM-задач, streaming, token counting' },
  { id: 'webhook_worker', name: 'Webhook Worker', subtitle: 'Go Worker', group: 'worker', color: '#f97316', icon: 'workflow', tech: ['Go 1.22', 'Kafka 3.7'], replicas: 2, description: 'Доставка вебхуков с ретраями' },
  { id: 'scheduler', name: 'Scheduler', subtitle: 'Go Cron', group: 'worker', color: '#f97316', icon: 'workflow', tech: ['Go 1.22'], replicas: 1, description: 'Deadline checker, cleanup, SLA alerts' },
  { id: 'indexer', name: 'Search Indexer', subtitle: 'Go Worker', group: 'worker', color: '#f97316', icon: 'workflow', tech: ['Go 1.22', 'Elasticsearch 8'], replicas: 2, description: 'CDC → Elasticsearch индексация' },

  { id: 'kafka', name: 'Apache Kafka', subtitle: 'Event Streaming', group: 'messaging', color: '#ef4444', icon: 'radio', tech: ['Kafka 3.7', 'Protobuf'], replicas: 3, description: 'Event bus: task.events, agent.commands, cdc' },
  { id: 'kafka_connect', name: 'Kafka Connect', subtitle: 'CDC Pipeline', group: 'messaging', color: '#ef4444', icon: 'workflow', tech: ['Debezium', 'PostgreSQL 16'], replicas: 2, description: 'Change Data Capture из PostgreSQL' },

  { id: 'pg_primary', name: 'PostgreSQL Primary', subtitle: 'Primary (Write)', group: 'database', color: '#06b6d4', icon: 'database', tech: ['PostgreSQL 16'], ports: ['5432'], description: 'Основная БД + vector embeddings' },
  { id: 'pg_replica', name: 'PostgreSQL Replica', subtitle: 'Read Replicas', group: 'database', color: '#06b6d4', icon: 'database', tech: ['PostgreSQL 16'], replicas: 2, description: 'Реплики для чтения' },
  { id: 'clickhouse', name: 'ClickHouse', subtitle: 'Analytics OLAP', group: 'database', color: '#06b6d4', icon: 'database', tech: ['ClickHouse 24'], ports: ['8123'], description: 'OLAP для метрик и event store' },
  { id: 'elasticsearch', name: 'Elasticsearch', subtitle: 'Full-text Search', group: 'database', color: '#06b6d4', icon: 'database', tech: ['Elasticsearch 8'], ports: ['9200'], replicas: 3, description: 'Полнотекстовый поиск' },

  { id: 'redis_primary', name: 'Redis', subtitle: 'Cache + PubSub', group: 'cache', color: '#eab308', icon: 'harddrive', tech: ['Redis 7'], ports: ['6379'], description: 'Кэш, сессии, rate limiter, PubSub' },
  { id: 'redis_sentinel', name: 'Redis Sentinel', subtitle: 'HA Failover', group: 'cache', color: '#eab308', icon: 'harddrive', tech: ['Redis 7'], replicas: 3, description: 'Auto-failover' },

  { id: 'prometheus', name: 'Prometheus', subtitle: 'Metrics', group: 'monitoring', color: '#a855f7', icon: 'monitor', tech: ['Prometheus'], ports: ['9090'], description: 'Сбор метрик, алерты' },
  { id: 'grafana', name: 'Grafana', subtitle: 'Dashboards', group: 'monitoring', color: '#a855f7', icon: 'monitor', tech: ['Grafana 11'], ports: ['3000'], description: 'Визуализация' },
  { id: 'jaeger', name: 'Jaeger', subtitle: 'Distributed Tracing', group: 'monitoring', color: '#a855f7', icon: 'network', tech: ['Jaeger'], description: 'Распределённый трейсинг' },
  { id: 'loki', name: 'Loki', subtitle: 'Log Aggregation', group: 'monitoring', color: '#a855f7', icon: 'monitor', tech: ['Grafana 11'], description: 'Агрегация логов' },

  { id: 'k8s', name: 'Kubernetes', subtitle: 'Orchestration', group: 'infrastructure', color: '#64748b', icon: 'container', tech: ['K8s 1.30', 'Helm'], description: 'Оркестрация контейнеров, HPA' },
  { id: 'vault', name: 'HashiCorp Vault', subtitle: 'Secrets', group: 'infrastructure', color: '#64748b', icon: 'shield', tech: ['Vault'], description: 'Управление секретами' },
  { id: 'minio', name: 'MinIO', subtitle: 'Object Storage', group: 'infrastructure', color: '#64748b', icon: 'harddrive', tech: ['MinIO'], description: 'S3-совместимое хранилище' },
]

const CONNECTIONS: ConnectionDef[] = [
  { from: 'spa', to: 'nginx', label: 'HTTPS', type: 'sync' },
  { from: 'mobile', to: 'nginx', label: 'HTTPS', type: 'sync' },
  { from: 'nginx', to: 'api_gateway', label: 'HTTP', type: 'sync' },
  { from: 'nginx', to: 'ws_gateway', label: 'WS', type: 'sync' },
  { from: 'nginx', to: 'grafana', label: '/grafana', type: 'sync' },
  { from: 'api_gateway', to: 'task_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'board_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'agent_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'user_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'epic_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'review_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'analytics_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'search_svc', label: 'gRPC', type: 'sync' },
  { from: 'api_gateway', to: 'redis_primary', label: 'rate limit', type: 'data' },
  { from: 'ws_gateway', to: 'redis_primary', label: 'PubSub', type: 'async' },
  { from: 'ws_gateway', to: 'user_svc', label: 'auth', type: 'sync' },
  { from: 'task_svc', to: 'pg_primary', label: 'write', type: 'data' },
  { from: 'task_svc', to: 'pg_replica', label: 'read', type: 'data' },
  { from: 'task_svc', to: 'redis_primary', label: 'cache', type: 'data' },
  { from: 'task_svc', to: 'kafka', label: 'task.events', type: 'async' },
  { from: 'task_svc', to: 'minio', label: 'attach', type: 'data' },
  { from: 'board_svc', to: 'pg_primary', label: 'write', type: 'data' },
  { from: 'board_svc', to: 'redis_primary', label: 'cache', type: 'data' },
  { from: 'board_svc', to: 'kafka', label: 'board.events', type: 'async' },
  { from: 'agent_svc', to: 'pg_primary', label: 'write', type: 'data' },
  { from: 'agent_svc', to: 'redis_primary', label: 'locks', type: 'data' },
  { from: 'agent_svc', to: 'kafka', label: 'agent.cmd', type: 'async' },
  { from: 'user_svc', to: 'pg_primary', label: 'write', type: 'data' },
  { from: 'user_svc', to: 'redis_primary', label: 'sessions', type: 'data' },
  { from: 'epic_svc', to: 'pg_primary', label: 'write', type: 'data' },
  { from: 'review_svc', to: 'pg_primary', label: 'write', type: 'data' },
  { from: 'review_svc', to: 'kafka', label: 'review.events', type: 'async' },
  { from: 'analytics_svc', to: 'clickhouse', label: 'OLAP', type: 'data' },
  { from: 'analytics_svc', to: 'pg_replica', label: 'read', type: 'data' },
  { from: 'search_svc', to: 'elasticsearch', label: 'search', type: 'data' },
  { from: 'notification_svc', to: 'pg_primary', label: 'write', type: 'data' },
  { from: 'notification_svc', to: 'kafka', label: 'notify', type: 'async' },
  { from: 'kafka', to: 'agent_worker', label: 'agent.cmd', type: 'async' },
  { from: 'kafka', to: 'webhook_worker', label: 'webhooks', type: 'async' },
  { from: 'kafka', to: 'notification_svc', label: 'notify', type: 'async' },
  { from: 'kafka', to: 'indexer', label: 'cdc', type: 'async' },
  { from: 'pg_primary', to: 'kafka_connect', label: 'WAL', type: 'async' },
  { from: 'kafka_connect', to: 'kafka', label: 'cdc.topics', type: 'async' },
  { from: 'pg_primary', to: 'pg_replica', label: 'replication', type: 'data' },
  { from: 'agent_worker', to: 'kafka', label: 'results', type: 'async' },
  { from: 'agent_worker', to: 'redis_primary', label: 'progress', type: 'data' },
  { from: 'agent_worker', to: 'vault', label: 'API keys', type: 'data' },
  { from: 'indexer', to: 'elasticsearch', label: 'bulk', type: 'data' },
  { from: 'scheduler', to: 'pg_primary', label: 'cron', type: 'data' },
  { from: 'scheduler', to: 'redis_primary', label: 'lock', type: 'data' },
  { from: 'scheduler', to: 'kafka', label: 'scheduled', type: 'async' },
  { from: 'redis_sentinel', to: 'redis_primary', label: 'monitor', type: 'monitor' },
  { from: 'prometheus', to: 'api_gateway', label: '/metrics', type: 'monitor' },
  { from: 'prometheus', to: 'task_svc', label: '/metrics', type: 'monitor' },
  { from: 'prometheus', to: 'agent_svc', label: '/metrics', type: 'monitor' },
  { from: 'prometheus', to: 'kafka', label: 'JMX', type: 'monitor' },
  { from: 'prometheus', to: 'pg_primary', label: 'exporter', type: 'monitor' },
  { from: 'prometheus', to: 'redis_primary', label: 'exporter', type: 'monitor' },
  { from: 'grafana', to: 'prometheus', label: 'query', type: 'monitor' },
  { from: 'grafana', to: 'loki', label: 'logs', type: 'monitor' },
  { from: 'grafana', to: 'jaeger', label: 'traces', type: 'monitor' },
  { from: 'k8s', to: 'vault', label: 'secrets', type: 'data' },
  { from: 'api_gateway', to: 'vault', label: 'secrets', type: 'data' },
]

// Group-level connections for depth 1
const GROUP_CONNECTIONS: ConnectionDef[] = [
  { from: 'g-client', to: 'g-gateway', label: 'HTTPS / WS', type: 'sync' },
  { from: 'g-gateway', to: 'g-service', label: 'gRPC', type: 'sync' },
  { from: 'g-gateway', to: 'g-cache', label: 'Redis', type: 'data' },
  { from: 'g-gateway', to: 'g-monitoring', label: '/grafana', type: 'sync' },
  { from: 'g-service', to: 'g-database', label: 'SQL / Query', type: 'data' },
  { from: 'g-service', to: 'g-messaging', label: 'Events', type: 'async' },
  { from: 'g-service', to: 'g-cache', label: 'Cache / PubSub', type: 'data' },
  { from: 'g-messaging', to: 'g-worker', label: 'Consume', type: 'async' },
  { from: 'g-worker', to: 'g-database', label: 'Write', type: 'data' },
  { from: 'g-worker', to: 'g-messaging', label: 'Produce', type: 'async' },
  { from: 'g-worker', to: 'g-infrastructure', label: 'Secrets', type: 'data' },
  { from: 'g-database', to: 'g-messaging', label: 'CDC / WAL', type: 'async' },
  { from: 'g-monitoring', to: 'g-service', label: 'Scrape', type: 'monitor' },
  { from: 'g-monitoring', to: 'g-database', label: 'Exporter', type: 'monitor' },
  { from: 'g-infrastructure', to: 'g-gateway', label: 'Secrets', type: 'data' },
  { from: 'g-cache', to: 'g-monitoring', label: 'Exporter', type: 'monitor' },
]

// ── Icon Map ─────────────────────────────────────────

const ICON_MAP: Record<string, typeof Server> = {
  server: Server, globe: Globe, database: Database, shield: Shield,
  cpu: Cpu, radio: Radio, harddrive: HardDrive, layers: Layers,
  container: Container, network: Network, monitor: MonitorSpeaker,
  workflow: Workflow,
}

// ── Group Meta ───────────────────────────────────────

const GROUP_META: Record<ServiceGroup, { bg: string; label: string; icon: string; description: string }> = {
  client:         { bg: '#3b82f6', label: 'Clients', icon: 'globe', description: 'React SPA + PWA' },
  gateway:        { bg: '#22c55e', label: 'API Gateway Layer', icon: 'shield', description: 'Nginx + Go Gateway + WebSocket' },
  service:        { bg: '#8b5cf6', label: 'Go Microservices', icon: 'server', description: '9 сервисов на Go + gRPC' },
  worker:         { bg: '#f97316', label: 'Background Workers', icon: 'cpu', description: 'Agent Workers + Scheduler' },
  messaging:      { bg: '#ef4444', label: 'Event Bus', icon: 'radio', description: 'Apache Kafka + CDC' },
  database:       { bg: '#06b6d4', label: 'Data Layer', icon: 'database', description: 'PostgreSQL + ClickHouse + ES' },
  cache:          { bg: '#eab308', label: 'Cache Layer', icon: 'harddrive', description: 'Redis Cluster + Sentinel' },
  monitoring:     { bg: '#a855f7', label: 'Observability', icon: 'monitor', description: 'Prometheus + Grafana + Jaeger' },
  infrastructure: { bg: '#64748b', label: 'Infrastructure', icon: 'container', description: 'K8s + Vault + MinIO' },
}

// ── Group Node ───────────────────────────────────────

interface GroupNodeData {
  group: ServiceGroup
  meta: typeof GROUP_META[ServiceGroup]
  count: number
  totalReplicas: number
  techs: string[]
  [key: string]: unknown
}

function GroupNode({ data }: { data: GroupNodeData }) {
  const { meta, count, totalReplicas, techs } = data
  const Icon = ICON_MAP[meta.icon] || Server
  return (
    <div
      className="rounded-2xl border-2 overflow-hidden shadow-xl min-w-[280px] cursor-grab active:cursor-grabbing"
      style={{ borderColor: meta.bg }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !top-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !w-full !h-3 !min-h-0 !border-0 !rounded-none !bottom-0" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !h-full !w-3 !min-w-0 !border-0 !rounded-none !left-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !h-full !w-3 !min-w-0 !border-0 !rounded-none !right-0" />

      <div className="px-5 py-4" style={{ background: `${meta.bg}15` }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${meta.bg}25` }}>
            <Icon className="h-5 w-5" style={{ color: meta.bg }} />
          </div>
          <div>
            <div className="font-bold text-sm">{meta.label}</div>
            <div className="text-[10px] text-muted-foreground">{meta.description}</div>
          </div>
        </div>
      </div>
      <div className="bg-card px-5 py-3 space-y-2">
        <div className="flex gap-3 text-xs">
          <span><span className="font-bold" style={{ color: meta.bg }}>{count}</span> <span className="text-muted-foreground">сервисов</span></span>
          <span><span className="font-bold" style={{ color: meta.bg }}>{totalReplicas}</span> <span className="text-muted-foreground">реплик</span></span>
        </div>
        <div className="flex flex-wrap gap-1">
          {techs.slice(0, 6).map(t => <TechBadge key={t} name={t} />)}
          {techs.length > 6 && <span className="text-[8px] text-muted-foreground self-center">+{techs.length - 6}</span>}
        </div>
      </div>
    </div>
  )
}

// ── Service Node (depth 2 & 3) ───────────────────────

interface ServiceNodeData {
  service: ServiceDef
  highlighted: boolean
  dimmed: boolean
  depth: number
  [key: string]: unknown
}

function ServiceNode({ data }: { data: ServiceNodeData }) {
  const { service: svc, highlighted, dimmed, depth } = data
  const Icon = ICON_MAP[svc.icon] || Server

  return (
    <div
      className={cn(
        'rounded-xl border-2 overflow-hidden transition-all duration-200',
        highlighted ? 'shadow-2xl scale-[1.03]' : 'shadow-md',
        dimmed && 'opacity-15',
      )}
      style={{
        borderColor: highlighted ? svc.color : 'hsl(var(--border))',
        width: depth >= 3 ? 260 : 220,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !w-full !h-2 !min-h-0 !border-0 !rounded-none !top-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !w-full !h-2 !min-h-0 !border-0 !rounded-none !bottom-0" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !h-full !w-2 !min-w-0 !border-0 !rounded-none !left-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !h-full !w-2 !min-w-0 !border-0 !rounded-none !right-0" />

      <div className="flex items-center gap-2 px-3 py-2 cursor-grab active:cursor-grabbing" style={{ background: `${svc.color}15` }}>
        <div className="h-6 w-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${svc.color}25` }}>
          <Icon className="h-3 w-3" style={{ color: svc.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[11px] truncate">{svc.name}</div>
          {depth >= 3 && <div className="text-[9px] text-muted-foreground truncate">{svc.subtitle}</div>}
        </div>
        {svc.replicas && svc.replicas > 1 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${svc.color}20`, color: svc.color }}>
            ×{svc.replicas}
          </span>
        )}
      </div>

      {depth >= 3 && (
        <div className="bg-card px-3 py-2 space-y-1.5">
          {svc.ports && (
            <div className="flex gap-1">
              {svc.ports.map(p => (
                <span key={p} className="text-[8px] px-1.5 py-0.5 rounded bg-muted font-mono">:{p}</span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {svc.tech.map(t => <TechBadge key={t} name={t} />)}
          </div>
          {svc.description && highlighted && (
            <p className="text-[9px] text-muted-foreground leading-tight border-t border-border/50 pt-1.5">{svc.description}</p>
          )}
        </div>
      )}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  service: ServiceNode as any,
  group: GroupNode as any,
}

// ── Positions ────────────────────────────────────────

const SERVICE_POS: Record<string, { x: number; y: number }> = {
  spa: { x: 300, y: 0 }, mobile: { x: 600, y: 0 },
  nginx: { x: 450, y: 200 }, api_gateway: { x: 250, y: 420 }, ws_gateway: { x: 700, y: 420 },
  task_svc: { x: -100, y: 680 }, board_svc: { x: 200, y: 680 }, agent_svc: { x: 500, y: 680 }, user_svc: { x: 800, y: 680 }, epic_svc: { x: 1100, y: 680 },
  review_svc: { x: -100, y: 920 }, notification_svc: { x: 200, y: 920 }, analytics_svc: { x: 500, y: 920 }, search_svc: { x: 800, y: 920 },
  kafka: { x: 400, y: 1180 }, kafka_connect: { x: 750, y: 1180 },
  agent_worker: { x: -100, y: 1180 }, webhook_worker: { x: 100, y: 1380 }, scheduler: { x: -100, y: 1380 }, indexer: { x: 750, y: 1380 },
  pg_primary: { x: 200, y: 1600 }, pg_replica: { x: 500, y: 1600 }, clickhouse: { x: 800, y: 1600 }, elasticsearch: { x: 1100, y: 1600 },
  redis_primary: { x: 1200, y: 420 }, redis_sentinel: { x: 1200, y: 200 },
  prometheus: { x: 1500, y: 680 }, grafana: { x: 1500, y: 200 }, jaeger: { x: 1500, y: 920 }, loki: { x: 1750, y: 680 },
  k8s: { x: -450, y: 200 }, vault: { x: -450, y: 420 }, minio: { x: -450, y: 680 },
}

const GROUP_POS: Record<string, { x: number; y: number }> = {
  'g-client': { x: 350, y: 0 },
  'g-gateway': { x: 350, y: 250 },
  'g-service': { x: 350, y: 520 },
  'g-worker': { x: 0, y: 800 },
  'g-messaging': { x: 350, y: 800 },
  'g-database': { x: 350, y: 1080 },
  'g-cache': { x: 700, y: 250 },
  'g-monitoring': { x: 700, y: 520 },
  'g-infrastructure': { x: 0, y: 250 },
}

// ── Connection Styles ────────────────────────────────

const CONN_STYLES: Record<ConnectionDef['type'], { color: string; dash?: string; width: number }> = {
  sync:    { color: '#3b82f6', width: 2 },
  async:   { color: '#ef4444', dash: '8 4', width: 2 },
  data:    { color: '#06b6d4', dash: '4 3', width: 1.5 },
  monitor: { color: '#a855f7', dash: '3 6', width: 1 },
}

// ── Main Component ───────────────────────────────────

function ArchitectureInner() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [depth, setDepth] = useState<1 | 2 | 3>(2)
  const [showLabels, setShowLabels] = useState(true)
  const [connType, setConnType] = useState<ConnectionDef['type'] | 'all'>('all')

  const connected = useMemo(() => {
    if (!hovered) return new Set<string>()
    const set = new Set<string>([hovered])
    const conns = depth === 1 ? GROUP_CONNECTIONS : CONNECTIONS
    conns.forEach(c => {
      if (c.from === hovered) set.add(c.to)
      if (c.to === hovered) set.add(c.from)
    })
    return set
  }, [hovered, depth])

  const computedNodes: Node[] = useMemo(() => {
    if (depth === 1) {
      return (Object.entries(GROUP_META) as [ServiceGroup, typeof GROUP_META[ServiceGroup]][]).map(([key, meta]) => {
        const groupServices = SERVICES.filter(s => s.group === key)
        const techs = [...new Set(groupServices.flatMap(s => s.tech))]
        return {
          id: `g-${key}`,
          type: 'group',
          position: GROUP_POS[`g-${key}`] || { x: 0, y: 0 },
          data: {
            group: key,
            meta,
            count: groupServices.length,
            totalReplicas: groupServices.reduce((s, sv) => s + (sv.replicas || 1), 0),
            techs,
          } satisfies GroupNodeData,
        }
      })
    }

    return SERVICES.map(svc => ({
      id: svc.id,
      type: 'service',
      position: SERVICE_POS[svc.id] || { x: 0, y: 0 },
      data: {
        service: svc,
        highlighted: hovered === svc.id,
        dimmed: hovered !== null && !connected.has(svc.id),
        depth,
      } satisfies ServiceNodeData,
    }))
  }, [hovered, connected, depth])

  const computedEdges: Edge[] = useMemo(() => {
    const conns = depth === 1 ? GROUP_CONNECTIONS : CONNECTIONS
    return conns
      .filter(c => connType === 'all' || c.type === connType)
      .map((c, i) => {
        const isHl = hovered && (c.from === hovered || c.to === hovered)
        const isDim = hovered && !isHl
        const style = CONN_STYLES[c.type]
        return {
          id: `c-${i}`,
          source: c.from,
          target: c.to,
          type: 'smoothstep',
          animated: !!isHl,
          label: showLabels ? c.label : undefined,
          labelStyle: { fontSize: 8, fontFamily: 'ui-monospace, monospace', fill: isHl ? '#fafafa' : '#52525b', fontWeight: isHl ? 600 : 400 },
          labelBgStyle: { fill: isHl ? style.color : 'hsl(var(--background))', fillOpacity: isHl ? 0.9 : 0.7, rx: 3, ry: 3 },
          labelBgPadding: [2, 4] as [number, number],
          style: { stroke: isHl ? style.color : isDim ? '#1a1a1e' : `${style.color}50`, strokeWidth: isHl ? style.width + 1 : isDim ? 0.5 : style.width, strokeDasharray: style.dash, opacity: isDim ? 0.08 : 1 },
          markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: isHl ? style.color : isDim ? '#1a1a1e' : `${style.color}80` },
        }
      })
  }, [hovered, depth, connType, showLabels])

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

  const totalReplicas = SERVICES.reduce((s, svc) => s + (svc.replicas || 1), 0)

  return (
    <div className="h-[calc(100vh-7.5rem)]" data-tour="architecture-page">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Network className="h-6 w-6 text-muted-foreground" />
            Архитектура системы
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Микросервисная архитектура · Go + Kafka + Redis + PostgreSQL + Nginx
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-card border">
            <Server className="h-3 w-3 text-muted-foreground" />
            <span className="font-bold">{SERVICES.length}</span>
            <span className="text-muted-foreground">сервисов</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-card border">
            <Container className="h-3 w-3 text-muted-foreground" />
            <span className="font-bold">{totalReplicas}</span>
            <span className="text-muted-foreground">реплик</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-card border">
            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
            <span className="font-bold">{CONNECTIONS.length}</span>
            <span className="text-muted-foreground">связей</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Depth */}
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
              {d === 1 ? 'Обзор' : d === 2 ? 'Компоненты' : 'Детали'}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Connection type */}
        {(['all', 'sync', 'async', 'data', 'monitor'] as const).map(t => (
          <button
            key={t}
            onClick={() => setConnType(t)}
            className={cn(
              'px-2 py-1 rounded-md text-[11px] font-medium border transition-all',
              connType === t ? 'bg-card border-border' : 'border-transparent opacity-50 hover:opacity-75',
            )}
          >
            {t === 'all' ? 'Все' : t === 'sync' ? 'Sync' : t === 'async' ? 'Async' : t === 'data' ? 'Data' : 'Monitor'}
          </button>
        ))}

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
      </div>

      <div className="rounded-xl border bg-card overflow-hidden h-[calc(100%-6.5rem)] relative">
        <ReactFlow
          nodes={ns} edges={es} nodeTypes={nodeTypes}
          onNodesChange={onNC} onEdgesChange={onEC}
          onNodeMouseEnter={onEnter} onNodeMouseLeave={onLeave}
          fitView fitViewOptions={{ padding: 0.1 }}
          nodesDraggable panOnDrag zoomOnScroll
          minZoom={0.1} maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background gap={30} size={1} className="!bg-background" />
          <Controls showInteractive={false} className="!bg-card !border-border !shadow-sm [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted" />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'group') {
                const d = node.data as GroupNodeData
                return GROUP_META[d.group]?.bg || '#3f3f46'
              }
              const svc = SERVICES.find(s => s.id === node.id)
              return svc?.color || '#3f3f46'
            }}
            maskColor="hsl(var(--background) / 0.85)" className="!bg-card !border-border" pannable zoomable
          />
        </ReactFlow>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 text-[10px] space-y-1.5 z-10">
          <div className="font-semibold text-xs mb-2">Типы связей</div>
          <div className="flex items-center gap-2"><div className="w-6 h-0 border-t-2" style={{ borderColor: '#3b82f6' }} /><span className="text-muted-foreground">Sync (gRPC / HTTP)</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-0 border-t-2 border-dashed" style={{ borderColor: '#ef4444' }} /><span className="text-muted-foreground">Async (Kafka)</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-0 border-t-[1.5px] border-dashed" style={{ borderColor: '#06b6d4' }} /><span className="text-muted-foreground">Data (DB / Cache)</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-0 border-t border-dotted" style={{ borderColor: '#a855f7' }} /><span className="text-muted-foreground">Monitor (Metrics)</span></div>
        </div>
      </div>
    </div>
  )
}

export function ArchitecturePage() {
  return (
    <ReactFlowProvider>
      <ArchitectureInner />
    </ReactFlowProvider>
  )
}
