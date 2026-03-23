import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Bot, Zap, BarChart3, GitBranch, ArrowRight, Layers, Shield, Globe, Cpu, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const features = [
  {
    icon: Bot,
    title: 'LLM-агенты',
    desc: 'Распределяйте задачи между Claude Code, Codex и другими AI-агентами',
    color: '#8b5cf6',
  },
  {
    icon: Zap,
    title: 'Real-time мониторинг',
    desc: 'Отслеживайте прогресс выполнения задач в реальном времени с логами',
    color: '#f59e0b',
  },
  {
    icon: BarChart3,
    title: 'Аналитика и ревью',
    desc: 'Автоматическая оценка качества результатов и код-ревью от AI',
    color: '#22c55e',
  },
  {
    icon: GitBranch,
    title: 'Канбан-доска',
    desc: 'Гибкое управление задачами с drag-and-drop и настраиваемыми колонками',
    color: '#3b82f6',
  },
  {
    icon: Layers,
    title: 'Эпики',
    desc: 'Группируйте задачи в эпики для стратегического планирования',
    color: '#ec4899',
  },
  {
    icon: Shield,
    title: 'Микросервисы',
    desc: 'Масштабируемая архитектура: Go, Kafka, PostgreSQL, Redis, Kubernetes',
    color: '#14b8a6',
  },
]

const stats = [
  { label: 'Микросервисов', value: '33' },
  { label: 'Таблиц БД', value: '28' },
  { label: 'Технологий', value: '19' },
  { label: 'Прецедентов', value: '38' },
]

// ── Animated Robot (same as dashboard but bigger) ──

function HeroRobot() {
  return (
    <div className="relative w-[340px] h-[340px] select-none">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-transparent blur-3xl animate-pulse dark:from-violet-500/20 dark:via-cyan-500/10" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-300/10 via-indigo-200/10 to-transparent blur-3xl animate-pulse dark:hidden" />

      <svg viewBox="0 0 280 280" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="lbodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="lheadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="lscreenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="larmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <filter id="lglow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lsoftShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0008" />
          </filter>
        </defs>

        <ellipse cx="140" cy="265" rx="60" ry="8" fill="#0002" />

        {/* Legs */}
        <rect x="108" y="210" width="18" height="40" rx="6" fill="url(#larmGrad)" />
        <rect x="154" y="210" width="18" height="40" rx="6" fill="url(#larmGrad)" />
        <rect x="102" y="244" width="30" height="12" rx="6" fill="#5b21b6" />
        <rect x="148" y="244" width="30" height="12" rx="6" fill="#5b21b6" />

        {/* Body */}
        <rect x="90" y="130" width="100" height="90" rx="20" fill="url(#lbodyGrad)" filter="url(#lsoftShadow)" />
        <rect x="105" y="145" width="70" height="45" rx="10" fill="url(#lscreenGrad)" />

        {/* Chest bars */}
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

        <circle cx="140" cy="152" r="3" fill="#22d3ee" filter="url(#lglow)">
          <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Arms */}
        <g>
          <rect x="62" y="140" width="20" height="55" rx="10" fill="url(#larmGrad)">
            <animateTransform attributeName="transform" type="rotate" values="0 72 140;-8 72 140;0 72 140" dur="3s" repeatCount="indefinite" />
          </rect>
          <circle cx="72" cy="200" r="10" fill="#7c3aed">
            <animateTransform attributeName="transform" type="rotate" values="0 72 140;-8 72 140;0 72 140" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
        <g>
          <rect x="198" y="140" width="20" height="55" rx="10" fill="url(#larmGrad)">
            <animateTransform attributeName="transform" type="rotate" values="0 208 140;8 208 140;0 208 140" dur="3s" repeatCount="indefinite" begin="0.3s" />
          </rect>
          <circle cx="208" cy="200" r="10" fill="#7c3aed">
            <animateTransform attributeName="transform" type="rotate" values="0 208 140;8 208 140;0 208 140" dur="3s" repeatCount="indefinite" begin="0.3s" />
          </circle>
        </g>

        {/* Neck */}
        <rect x="127" y="110" width="26" height="25" rx="8" fill="#6d28d9" />

        {/* Head */}
        <rect x="88" y="35" width="104" height="85" rx="24" fill="url(#lheadGrad)" filter="url(#lsoftShadow)" />

        {/* Antenna */}
        <line x1="140" y1="35" x2="140" y2="12" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
        <circle cx="140" cy="10" r="6" fill="#22d3ee" filter="url(#lglow)">
          <animate attributeName="fill" values="#22d3ee;#f472b6;#fbbf24;#22d3ee" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Eyes */}
        <g>
          <ellipse cx="118" cy="70" rx="14" ry="16" fill="#0f172a" />
          <ellipse cx="118" cy="70" rx="10" ry="12" fill="#1e293b" />
          <circle cx="118" cy="68" r="6" fill="#22d3ee" filter="url(#lglow)">
            <animate attributeName="cy" values="68;70;68" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="121" cy="65" r="2" fill="#fff" opacity="0.8" />

          <ellipse cx="162" cy="70" rx="14" ry="16" fill="#0f172a" />
          <ellipse cx="162" cy="70" rx="10" ry="12" fill="#1e293b" />
          <circle cx="162" cy="68" r="6" fill="#22d3ee" filter="url(#lglow)">
            <animate attributeName="cy" values="68;70;68" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="165" cy="65" r="2" fill="#fff" opacity="0.8" />
        </g>

        {/* Mouth */}
        <path d="M122 92 Q140 104 158 92" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

        {/* Ear panels */}
        <rect x="76" y="55" width="12" height="30" rx="6" fill="#6d28d9" />
        <rect x="192" y="55" width="12" height="30" rx="6" fill="#6d28d9" />

        {/* Particles */}
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
        <circle cx="30" cy="200" r="1.5" fill="#34d399" opacity="0.4">
          <animate attributeName="cy" values="200;180;200" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="210" r="2" fill="#22d3ee" opacity="0.3">
          <animate attributeName="cy" values="210;190;210" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="3.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

// ── Orbit rings decoration ──

function OrbitRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-10">
      <div className="absolute w-[500px] h-[500px] border border-violet-300 dark:border-violet-500/20 rounded-full animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-[400px] h-[400px] border border-indigo-200 dark:border-cyan-500/15 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
      <div className="absolute w-[300px] h-[300px] border border-violet-200 dark:border-violet-500/10 rounded-full animate-[spin_30s_linear_infinite]" />
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b glass sticky top-0 z-40">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <Bot className="h-6 w-6 text-foreground" />
            <span className="tracking-tight">LLM Kanban</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/auth">
              <Button size="sm">Войти</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/30 dark:via-background dark:to-background" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="absolute top-20 left-20 w-96 h-96 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[300px] bg-indigo-100/20 dark:bg-indigo-500/5 rounded-full blur-[100px]" />

        <div className="container relative mx-auto px-4 py-20 sm:py-28">
          <div className="flex items-center gap-12 lg:gap-16">
            {/* Text */}
            <div className="flex-1 space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card/50 dark:bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-glow" />
                Система оркестрации задач для AI-агентов
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl leading-[1.1]">
                Оркестрация
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  LLM-агентов
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Канбан-система для управления задачами, выполняемыми AI-агентами.
                Формируйте промпты, распределяйте между агентами, отслеживайте прогресс
                и оценивайте качество результатов.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link to="/auth">
                  <Button size="lg" className="gap-2 shadow-lg shadow-violet-500/10 dark:shadow-violet-500/25 hover:shadow-violet-500/20 dark:hover:shadow-violet-500/40 transition-shadow">
                    Начать работу <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="gap-2">
                    Демо-аккаунт
                  </Button>
                </Link>
              </div>
            </div>

            {/* Robot with orbits */}
            <div className="relative hidden lg:flex items-center justify-center shrink-0" style={{ width: 400, height: 400 }}>
              <OrbitRings />
              <HeroRobot />
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y bg-card/50 dark:bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Возможности платформы</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Полный набор инструментов для управления AI-агентами и анализа результатов</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border p-6 space-y-3 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 bg-card"
            >
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: f.color + '15' }}
              >
                <f.icon className="h-5 w-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack preview */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-20">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-50 via-background to-indigo-50/50 dark:from-violet-950/30 dark:via-background dark:to-cyan-950/20 p-8 sm:p-12">
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span>Технологический стек</span>
                </div>
                <h2 className="text-3xl font-bold">Современная архитектура</h2>
                <p className="text-muted-foreground leading-relaxed max-w-lg">
                  33 микросервиса на Go, React 19 фронтенд, Kafka для async-коммуникации,
                  PostgreSQL + ClickHouse для данных, Redis кэш, Kubernetes оркестрация.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React 19', 'Go', 'Kafka', 'PostgreSQL', 'Redis', 'Kubernetes', 'gRPC', 'Nginx', 'Prometheus'].map((t) => (
                    <span key={t} className="px-3 py-1 text-xs rounded-full border bg-background/80 dark:bg-card/80 text-muted-foreground backdrop-blur-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 shrink-0">
                {[
                  { icon: Globe, label: 'API Gateway', color: '#3b82f6' },
                  { icon: Cpu, label: 'Go Services', color: '#22c55e' },
                  { icon: Zap, label: 'Kafka', color: '#f59e0b' },
                  { icon: BarChart3, label: 'ClickHouse', color: '#ef4444' },
                  { icon: Shield, label: 'K8s', color: '#8b5cf6' },
                  { icon: Bot, label: 'LLM Agents', color: '#ec4899' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-background/60 dark:bg-card/60 backdrop-blur-sm hover:scale-105 transition-transform">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          LLM Kanban — Курсовой проект
        </div>
      </footer>
    </div>
  )
}
