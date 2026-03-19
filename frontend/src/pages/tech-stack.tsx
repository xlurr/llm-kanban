import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Globe, Server, Database, Radio, HardDrive, Container, Shield,
  MonitorSpeaker, Workflow, Layers, Check, X, Minus,
} from 'lucide-react'

// ── Data ─────────────────────────────────────────────

interface TechChoice {
  id: string
  name: string
  version: string
  category: string
  icon: typeof Server
  color: string
  logo: string // short symbol
  role: string
  reason: string
  features: string[]
  alternatives: { name: string; verdict: 'rejected' | 'considered'; reason: string }[]
  metrics?: { label: string; value: string }[]
}

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend', color: '#3b82f6' },
  { id: 'backend', label: 'Backend', color: '#22c55e' },
  { id: 'messaging', label: 'Messaging', color: '#ef4444' },
  { id: 'database', label: 'Databases', color: '#06b6d4' },
  { id: 'cache', label: 'Cache', color: '#eab308' },
  { id: 'infra', label: 'Infrastructure', color: '#64748b' },
  { id: 'monitoring', label: 'Monitoring', color: '#a855f7' },
]

const TECH: TechChoice[] = [
  {
    id: 'react', name: 'React', version: '19', category: 'frontend', icon: Globe, color: '#61dafb', logo: '⚛',
    role: 'UI-библиотека',
    reason: 'Компонентная архитектура, огромная экосистема, Server Components в v19, Concurrent Mode для smooth drag & drop',
    features: ['JSX/TSX', 'Virtual DOM', 'Hooks', 'Concurrent Mode', 'Server Components', 'Suspense'],
    alternatives: [
      { name: 'Vue 3', verdict: 'considered', reason: 'Хороший вариант, но меньше экосистема для complex UI (DnD, Flow)' },
      { name: 'Svelte 5', verdict: 'considered', reason: 'Отличная производительность, но @dnd-kit и React Flow не доступны' },
      { name: 'Angular 18', verdict: 'rejected', reason: 'Избыточен для SPA, тяжёлый бандл, меньше гибкости' },
    ],
    metrics: [{ label: 'Bundle size', value: '~45kb' }, { label: 'npm downloads/week', value: '25M+' }],
  },
  {
    id: 'typescript', name: 'TypeScript', version: '5.5', category: 'frontend', icon: Globe, color: '#3178c6', logo: 'TS',
    role: 'Типизация',
    reason: 'Строгая типизация для сложных store-ов (задачи, агенты, переходы), рефакторинг без страха, IntelliSense',
    features: ['Strict mode', 'Generics', 'Discriminated Unions', 'Template Literals', 'satisfies operator'],
    alternatives: [
      { name: 'JavaScript', verdict: 'rejected', reason: 'Нет типов → runtime ошибки в complex state management' },
      { name: 'Flow', verdict: 'rejected', reason: 'Почти мёртв, слабая поддержка IDE' },
    ],
  },
  {
    id: 'vite', name: 'Vite', version: '6', category: 'frontend', icon: Globe, color: '#646cff', logo: '⚡',
    role: 'Сборщик',
    reason: 'Мгновенный HMR, ESM-native dev server, быстрая сборка через Rollup, zero config для React + TS',
    features: ['ESM dev server', 'Hot Module Replacement', 'Rollup build', 'CSS Modules', 'Asset handling'],
    alternatives: [
      { name: 'Webpack 5', verdict: 'rejected', reason: 'Медленный dev server, сложная конфигурация' },
      { name: 'Turbopack', verdict: 'considered', reason: 'Быстрый, но привязан к Next.js, мы не используем SSR' },
    ],
    metrics: [{ label: 'Dev start', value: '<300ms' }, { label: 'HMR', value: '<50ms' }],
  },
  {
    id: 'tailwind', name: 'Tailwind CSS', version: '3', category: 'frontend', icon: Globe, color: '#38bdf8', logo: 'TW',
    role: 'Стилизация',
    reason: 'Utility-first подход идеален для shadcn/ui компонентов, тёмная/светлая тема через CSS variables, нет CSS-in-JS overhead',
    features: ['Utility classes', 'Dark mode', 'CSS variables', 'JIT compiler', 'Responsive', 'Animation'],
    alternatives: [
      { name: 'CSS Modules', verdict: 'considered', reason: 'Хороший вариант, но больше boilerplate для темизации' },
      { name: 'styled-components', verdict: 'rejected', reason: 'Runtime CSS-in-JS, лишний overhead, сложная темизация' },
      { name: 'Emotion', verdict: 'rejected', reason: 'Те же проблемы что и styled-components' },
    ],
  },
  {
    id: 'zustand', name: 'Zustand', version: '5', category: 'frontend', icon: Globe, color: '#f0b54a', logo: 'Z',
    role: 'State Management',
    reason: 'Минималистичный API, нет boilerplate (vs Redux), persist middleware для localStorage, отлично работает с React 19',
    features: ['Minimal API', 'No providers', 'Persist middleware', 'Immer integration', 'Devtools', 'TypeScript first'],
    alternatives: [
      { name: 'Redux Toolkit', verdict: 'rejected', reason: 'Слишком много boilerplate для нашего масштаба (slices, actions, reducers)' },
      { name: 'Jotai', verdict: 'considered', reason: 'Atomic state хорош, но persist middleware слабее' },
      { name: 'MobX', verdict: 'rejected', reason: 'Мутабельный подход, сложнее дебаг, decorators' },
    ],
    metrics: [{ label: 'Bundle', value: '~2.9kb' }, { label: 'Stores', value: '6' }],
  },
  {
    id: 'dndkit', name: '@dnd-kit', version: 'latest', category: 'frontend', icon: Globe, color: '#7c3aed', logo: 'DK',
    role: 'Drag & Drop',
    reason: 'Лучшая производительность среди React DnD-библиотек, accessible, поддержка touch, sortable из коробки',
    features: ['Keyboard support', 'Touch support', 'Collision detection', 'Sortable', 'Accessibility', 'Sensors API'],
    alternatives: [
      { name: 'react-beautiful-dnd', verdict: 'rejected', reason: 'Deprecated Atlassian, нет поддержки React 18+' },
      { name: 'react-dnd', verdict: 'considered', reason: 'Низкоуровневый, больше кода для канбан-доски' },
    ],
  },
  {
    id: 'reactflow', name: 'React Flow', version: '12', category: 'frontend', icon: Globe, color: '#ff0066', logo: 'RF',
    role: 'Интерактивные графы',
    reason: 'Готовые node-based UI: граф переходов, ER-диаграмма, архитектура. Pan/zoom/drag из коробки',
    features: ['Custom nodes', 'Edge types', 'MiniMap', 'Controls', 'Keyboard shortcuts', 'Sub-flows'],
    alternatives: [
      { name: 'D3.js', verdict: 'considered', reason: 'Мощнее, но слишком низкоуровневый для наших задач, нет React integration' },
      { name: 'vis.js', verdict: 'rejected', reason: 'Плохая React интеграция, устаревший API' },
    ],
  },
  {
    id: 'go', name: 'Go', version: '1.22', category: 'backend', icon: Server, color: '#00add8', logo: 'Go',
    role: 'Язык микросервисов',
    reason: 'Высокая производительность, goroutines для concurrent agent execution, быстрая компиляция, минимальный Docker image',
    features: ['Goroutines', 'Channels', 'Static binary', 'Fast compilation', 'Low memory', 'Strong stdlib'],
    alternatives: [
      { name: 'Node.js', verdict: 'considered', reason: 'Single-threaded, GC pauses под нагрузкой, больше памяти' },
      { name: 'Rust', verdict: 'considered', reason: 'Лучшая производительность, но сложнее для микросервисов, дольше разработка' },
      { name: 'Java/Spring', verdict: 'rejected', reason: 'Тяжёлый JVM, долгий startup, избыточен' },
      { name: 'Python/FastAPI', verdict: 'rejected', reason: 'Медленный для high-throughput, GIL ограничивает concurrency' },
    ],
    metrics: [{ label: 'Docker image', value: '~15MB' }, { label: 'Startup', value: '<100ms' }, { label: 'Goroutines', value: '∞' }],
  },
  {
    id: 'grpc', name: 'gRPC + Protobuf', version: '3', category: 'backend', icon: Server, color: '#244856', logo: 'gRPC',
    role: 'Межсервисное взаимодействие',
    reason: 'Binary protocol → низкая latency, строгие контракты через .proto, code generation, streaming',
    features: ['Binary protocol', 'Code generation', 'Bidirectional streaming', 'Interceptors', 'Load balancing'],
    alternatives: [
      { name: 'REST/JSON', verdict: 'considered', reason: 'Проще, но ~10x больший payload, нет типизированных контрактов' },
      { name: 'GraphQL', verdict: 'considered', reason: 'Flexible queries, но overkill для service-to-service, нет streaming' },
    ],
    metrics: [{ label: 'Payload vs JSON', value: '~70% меньше' }, { label: 'Latency vs REST', value: '~2-5x быстрее' }],
  },
  {
    id: 'kafka', name: 'Apache Kafka', version: '3.7', category: 'messaging', icon: Radio, color: '#e04e39', logo: 'K',
    role: 'Event Streaming',
    reason: 'Durable event log, replay capability, exactly-once semantics, CDC через Debezium, масштабирование consumers',
    features: ['Persistent log', 'Consumer groups', 'Exactly-once', 'KRaft mode', 'Schema Registry', 'Kafka Connect'],
    alternatives: [
      { name: 'RabbitMQ', verdict: 'considered', reason: 'Проще в setup, но нет persistent log и replay, хуже throughput' },
      { name: 'NATS', verdict: 'considered', reason: 'Быстрее, легче, но нет гарантий доставки на уровне Kafka' },
      { name: 'AWS SQS', verdict: 'rejected', reason: 'Vendor lock-in, нет event sourcing pattern' },
    ],
    metrics: [{ label: 'Throughput', value: '1M+ msg/s' }, { label: 'Latency', value: '<10ms' }],
  },
  {
    id: 'postgresql', name: 'PostgreSQL', version: '16', category: 'database', icon: Database, color: '#4169e1', logo: '🐘',
    role: 'Основная OLTP БД',
    reason: 'ACID, JSONB для гибких config-ов, pgvector для embeddings, streaming replication, CDC через logical decoding',
    features: ['ACID', 'JSONB', 'pgvector', 'Partitioning', 'Streaming replication', 'Logical decoding (CDC)', 'Full-text search'],
    alternatives: [
      { name: 'MySQL 8', verdict: 'considered', reason: 'Хорошая производительность, но слабее JSONB, нет pgvector' },
      { name: 'MongoDB', verdict: 'rejected', reason: 'Нет ACID по умолчанию, schema-less → хаос в production' },
      { name: 'CockroachDB', verdict: 'considered', reason: 'Distributed SQL, но overkill для нашего масштаба' },
    ],
    metrics: [{ label: 'Таблиц', value: '28' }, { label: 'Связей', value: '36' }],
  },
  {
    id: 'clickhouse', name: 'ClickHouse', version: '24', category: 'database', icon: Database, color: '#ffcc00', logo: 'CH',
    role: 'OLAP Analytics',
    reason: 'Columnar storage для аналитических запросов (agent metrics, cost ledger), 100x быстрее PG для aggregations',
    features: ['Columnar storage', 'Materialized Views', 'Approximate functions', 'Distributed queries', 'Compression'],
    alternatives: [
      { name: 'TimescaleDB', verdict: 'considered', reason: 'Проще (расширение PG), но медленнее для complex aggregations' },
      { name: 'Apache Druid', verdict: 'rejected', reason: 'Сложнее в операциях, меньше community' },
    ],
  },
  {
    id: 'elasticsearch', name: 'Elasticsearch', version: '8', category: 'database', icon: Database, color: '#fed10a', logo: 'ES',
    role: 'Full-text Search',
    reason: 'Мгновенный полнотекстовый поиск по задачам, логам, комментариям. Fuzzy search, аналитика',
    features: ['Full-text search', 'Fuzzy matching', 'Aggregations', 'ILM', 'Cross-cluster'],
    alternatives: [
      { name: 'pg_trgm (PostgreSQL)', verdict: 'considered', reason: 'Проще, но медленнее для full-text на больших объёмах' },
      { name: 'Meilisearch', verdict: 'considered', reason: 'Проще API, но слабее в aggregations и масштабировании' },
    ],
  },
  {
    id: 'redis', name: 'Redis', version: '7', category: 'cache', icon: HardDrive, color: '#dc382d', logo: '◆',
    role: 'Cache + PubSub + Sessions',
    reason: 'In-memory кэш, PubSub для WebSocket broadcasting, distributed locks для agent orchestration, rate limiting',
    features: ['In-memory', 'PubSub', 'Streams', 'Cluster mode', 'Sentinel HA', 'Lua scripting'],
    alternatives: [
      { name: 'Memcached', verdict: 'rejected', reason: 'Нет PubSub, нет persistence, нет data structures' },
      { name: 'KeyDB', verdict: 'considered', reason: 'Multi-threaded Redis fork, но меньше community support' },
    ],
    metrics: [{ label: 'Latency', value: '<1ms' }, { label: 'Ops/sec', value: '100K+' }],
  },
  {
    id: 'nginx', name: 'Nginx', version: '1.25', category: 'infra', icon: Shield, color: '#009639', logo: 'N',
    role: 'Reverse Proxy + Load Balancer',
    reason: 'Статика SPA, TLS termination, rate limiting, WebSocket upgrade, upstream health checks',
    features: ['Reverse proxy', 'Load balancing', 'SSL/TLS', 'Rate limiting', 'WebSocket', 'gzip/brotli'],
    alternatives: [
      { name: 'Traefik', verdict: 'considered', reason: 'Auto-discovery в K8s, но менее предсказуемый для complex routing' },
      { name: 'HAProxy', verdict: 'considered', reason: 'Лучший L4 LB, но слабее для HTTP-specific routing' },
      { name: 'Envoy', verdict: 'considered', reason: 'Service mesh proxy, overkill без Istio' },
    ],
  },
  {
    id: 'k8s', name: 'Kubernetes', version: '1.30', category: 'infra', icon: Container, color: '#326ce5', logo: '☸',
    role: 'Container Orchestration',
    reason: 'Auto-scaling воркеров при пиках задач, rolling updates, self-healing, secrets management через Vault',
    features: ['HPA', 'Rolling updates', 'Service mesh', 'ConfigMaps', 'PDB', 'CronJobs'],
    alternatives: [
      { name: 'Docker Swarm', verdict: 'rejected', reason: 'Слабее auto-scaling, нет HPA, ограниченная экосистема' },
      { name: 'Nomad', verdict: 'considered', reason: 'Проще, но меньше community и tooling' },
    ],
    metrics: [{ label: 'Deployments', value: '15+' }, { label: 'Pods', value: '50+' }],
  },
  {
    id: 'prometheus', name: 'Prometheus + Grafana', version: '', category: 'monitoring', icon: MonitorSpeaker, color: '#e6522c', logo: 'P',
    role: 'Metrics + Dashboards',
    reason: 'Pull-based метрики, мощный PromQL, Grafana для визуализации, AlertManager для алертов',
    features: ['Pull model', 'PromQL', 'AlertManager', 'Recording rules', 'Service discovery'],
    alternatives: [
      { name: 'Datadog', verdict: 'rejected', reason: 'Дорого, vendor lock-in' },
      { name: 'InfluxDB + Chronograf', verdict: 'considered', reason: 'Push model, но слабее экосистема alerting' },
    ],
  },
  {
    id: 'jaeger', name: 'Jaeger + OpenTelemetry', version: '', category: 'monitoring', icon: Workflow, color: '#60d0e4', logo: 'J',
    role: 'Distributed Tracing',
    reason: 'Трейсы запросов через все микросервисы, bottleneck detection, OTLP стандарт',
    features: ['Distributed tracing', 'Span analysis', 'Service DAG', 'Sampling', 'OTLP'],
    alternatives: [
      { name: 'Zipkin', verdict: 'considered', reason: 'Проще, но менее функционален, нет OTLP native' },
    ],
  },
]

// ── Component ────────────────────────────────────────

export function TechStackPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedTech, setExpandedTech] = useState<string | null>(null)

  const filtered = activeCategory ? TECH.filter(t => t.category === activeCategory) : TECH

  return (
    <div className="max-w-7xl mx-auto" data-tour="tech-stack-page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="h-6 w-6 text-muted-foreground" />
          Выбор технологий
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {TECH.length} технологий · обоснование выбора · сравнение с альтернативами
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
            !activeCategory ? 'bg-foreground text-background border-foreground' : 'border-border hover:bg-muted',
          )}
        >
          Все ({TECH.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = TECH.filter(t => t.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                activeCategory === cat.id ? 'border-transparent' : 'border-border hover:bg-muted',
              )}
              style={activeCategory === cat.id ? { background: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}40` } : {}}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
              {cat.label}
              <span className="opacity-50">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Tech cards */}
      <div className="grid gap-3">
        {filtered.map(tech => {
          const isExpanded = expandedTech === tech.id
          const cat = CATEGORIES.find(c => c.id === tech.category)
          const Icon = tech.icon

          return (
            <div
              key={tech.id}
              className={cn(
                'border rounded-xl overflow-hidden transition-all',
                isExpanded && 'ring-1',
              )}
              style={isExpanded ? { '--tw-ring-color': tech.color } as React.CSSProperties : {}}
            >
              {/* Header row */}
              <button
                onClick={() => setExpandedTech(isExpanded ? null : tech.id)}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
              >
                {/* Logo */}
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
                  style={{ background: `${tech.color}15`, color: tech.color }}
                >
                  {tech.logo}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{tech.name}</span>
                    {tech.version && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">v{tech.version}</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${cat?.color}15`, color: cat?.color }}>{cat?.label}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{tech.role} — {tech.reason.slice(0, 80)}...</div>
                </div>

                {/* Alternatives count */}
                <div className="flex items-center gap-2 flex-shrink-0 text-xs text-muted-foreground">
                  <span>{tech.alternatives.length} альтернатив</span>
                  <span className={cn('transition-transform', isExpanded && 'rotate-180')}>▼</span>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t px-5 py-4 space-y-4 bg-muted/10">
                  {/* Reason */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Обоснование</div>
                    <p className="text-sm">{tech.reason}</p>
                  </div>

                  {/* Features + Metrics */}
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Ключевые возможности</div>
                      <div className="flex flex-wrap gap-1.5">
                        {tech.features.map(f => (
                          <span key={f} className="text-[11px] px-2 py-0.5 rounded-md border bg-card">{f}</span>
                        ))}
                      </div>
                    </div>
                    {tech.metrics && (
                      <div className="flex-shrink-0">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Метрики</div>
                        <div className="space-y-1">
                          {tech.metrics.map(m => (
                            <div key={m.label} className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">{m.label}:</span>
                              <span className="font-bold font-mono" style={{ color: tech.color }}>{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alternatives */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Сравнение с альтернативами</div>
                    <div className="space-y-1.5">
                      {tech.alternatives.map(alt => (
                        <div key={alt.name} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-card border">
                          <span className={cn(
                            'flex-shrink-0 mt-0.5 h-4 w-4 rounded-full flex items-center justify-center',
                            alt.verdict === 'rejected' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400',
                          )}>
                            {alt.verdict === 'rejected' ? <X className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                          </span>
                          <div>
                            <span className="font-semibold">{alt.name}</span>
                            <span className="text-muted-foreground"> — {alt.reason}</span>
                          </div>
                        </div>
                      ))}
                      {/* Selected */}
                      <div className="flex items-start gap-2 text-xs p-2 rounded-lg border" style={{ background: `${tech.color}08`, borderColor: `${tech.color}30` }}>
                        <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full flex items-center justify-center bg-green-500/15 text-green-400">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <div>
                          <span className="font-semibold" style={{ color: tech.color }}>{tech.name} {tech.version}</span>
                          <span className="text-muted-foreground"> — выбранное решение</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
