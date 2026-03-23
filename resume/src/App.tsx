import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Mail, Phone, MapPin, Github, ExternalLink,
  Code2, Brain, Briefcase, GraduationCap, Trophy, Layers,
  Shield, CheckCircle2, Target, Eye,
  Clock, Users, GitBranch, Terminal, Rocket, ChevronRight, Star,
  Zap, Coffee, Award, Heart, Flame, Database, Globe,
  Server, Container, Bug, TestTube, Blocks,
  GitPullRequest, MessageCircle, Lightbulb, Puzzle
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const PERSONAL = {
  name: 'Никита Мосягин',
  title: 'Full-Stack Developer',
  subtitle: 'Go · React · TypeScript · PostgreSQL',
  tagline: 'Превращаю сложные идеи в элегантный production-ready код',
  status: 'open',
  email: 'aborigen.nm@gmail.com',
  phone: '+7 911 645-98-85',
  github: 'xlurr',
  telegram: '@xlurr_dev',
  location: 'Великий Новгород, Россия',
  relocate: true,
  remote: true,
}

// Впечатляющие метрики
const METRICS = [
  { label: 'Проектов в production', value: '5', icon: Rocket, color: 'from-green-500 to-emerald-500' },
  { label: 'Коммитов за год', value: '1247', icon: GitBranch, color: 'from-blue-500 to-cyan-500' },
  { label: 'Pull Requests', value: '89', icon: GitPullRequest, color: 'from-purple-500 to-pink-500' },
  { label: 'Часов кодинга', value: '2500', icon: Clock, color: 'from-orange-500 to-amber-500' },
]

// Дополнительные метрики
const EXTRA_METRICS = [
  { label: 'Code Reviews', value: '150+', icon: Eye },
  { label: 'Unit Tests', value: '340+', icon: TestTube },
  { label: 'API Endpoints', value: '75+', icon: Server },
  { label: 'Docker Images', value: '12', icon: Container },
]

// Расширенный стек технологий
const STACK = {
  'Languages': {
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    items: ['Go 1.22+', 'TypeScript', 'JavaScript', 'Python', 'C++', 'SQL', 'Bash']
  },
  'Backend': {
    icon: Server,
    color: 'from-green-500 to-emerald-500',
    items: ['chi', 'Fiber', 'Echo', 'gin', 'gRPC', 'GraphQL', 'REST API', 'WebSocket', 'JWT', 'OAuth2']
  },
  'Frontend': {
    icon: Globe,
    color: 'from-purple-500 to-pink-500',
    items: ['React 18/19', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'TanStack Query', 'React Hook Form', 'Zod']
  },
  'Databases': {
    icon: Database,
    color: 'from-orange-500 to-red-500',
    items: ['PostgreSQL 16', 'Redis', 'Firebird', 'SQLite', 'MongoDB', 'Drizzle ORM', 'GORM', 'Migrations']
  },
  'DevOps': {
    icon: Container,
    color: 'from-cyan-500 to-blue-500',
    items: ['Docker', 'Docker Compose', 'Nginx', 'Traefik', 'GitHub Actions', 'GitLab CI', 'Linux', 'systemd']
  },
  'Tools': {
    icon: Blocks,
    color: 'from-yellow-500 to-orange-500',
    items: ['Git', 'VSCode', 'Cursor', 'Neovim', 'Postman', 'pgAdmin', 'DBeaver', 'Figma']
  },
  'Testing': {
    icon: TestTube,
    color: 'from-pink-500 to-rose-500',
    items: ['Go testing', 'testify', 'Vitest', 'Jest', 'React Testing Library', 'MSW', 'Playwright']
  },
  'AI & LLM': {
    icon: Brain,
    color: 'from-violet-500 to-purple-500',
    items: ['Claude', 'GPT-4', 'Cursor', 'Copilot', 'LangChain', 'Prompt Engineering', 'RAG']
  },
}

// Расширенный опыт
const EXPERIENCE = [
  {
    company: 'ISP «Максима»',
    role: 'Full-Stack Developer',
    type: 'Freelance / Production',
    period: 'Февраль 2026 — настоящее время',
    location: 'Великий Новгород',
    description: 'Разработка enterprise биллинговой системы личного кабинета для интернет-провайдера с нуля. Полный цикл разработки: от архитектуры до deployment.',
    achievements: [
      'Спроектировал и реализовал Clean Architecture на Go с DI через интерфейсы',
      'Разработал REST API с JWT авторизацией (access/refresh tokens, HS256)',
      'Написал 45+ API endpoints с валидацией, rate limiting и error handling',
      'Создал миграции для Firebird SQL с поддержкой rollback',
      'Построил React SPA с code splitting и lazy loading (Lighthouse 95+)',
      'Внедрил MSW для mock-first разработки фронтенда',
      'Настроил Docker Compose с healthcheck и зависимостями сервисов',
      'Сконфигурировал Nginx reverse proxy с gzip, кэшированием и SSL',
      'Покрыл критические paths unit-тестами (coverage 80%+)',
      'Написал техническую документацию и API Reference',
    ],
    stack: ['Go 1.26', 'chi v5', 'JWT', 'Firebird SQL', 'React 18', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion', 'Docker', 'Nginx', 'MSW', 'Zap logger'],
    metrics: [
      { label: 'API Endpoints', value: '45+' },
      { label: 'Test Coverage', value: '80%' },
      { label: 'Lighthouse', value: '95+' },
    ],
    highlight: true,
  },
  {
    company: 'Feature Flags Manager',
    role: 'Full-Stack Developer',
    type: 'Pet-проект / Open Source',
    period: 'Октябрь 2025 — настоящее время',
    description: 'Self-hosted аналог LaunchDarkly/Unleash для управления feature flags. Production-ready решение с eval API.',
    achievements: [
      'Реализовал Clean Architecture: domain → ports → adapters',
      'Спроектировал PostgreSQL схему с JSONB для гибких targeting rules',
      'Создал real-time eval endpoint для клиентских SDK',
      'Разработал dashboard с CRUD, фильтрами и audit log',
      'Добавил multi-environment support (dev/staging/prod)',
      'Написал Go SDK для интеграции в микросервисы',
      'Настроил GitHub Actions CI/CD с автоматическим деплоем',
    ],
    stack: ['Go 1.22', 'chi', 'PostgreSQL 16', 'JSONB', 'React', 'TypeScript', 'TanStack Query', 'Drizzle ORM', 'Shadcn/ui', 'Docker', 'GitHub Actions'],
    metrics: [
      { label: 'Environments', value: '3' },
      { label: 'SDK Languages', value: '2' },
    ],
    highlight: false,
  },
  {
    company: 'LLM Kanban System',
    role: 'Full-Stack Developer',
    type: 'Pet-проект',
    period: 'Декабрь 2025 — Январь 2026',
    description: 'Канбан-система для оркестрации задач AI-агентов с визуализацией архитектуры и аналитикой.',
    achievements: [
      'Разработал drag-and-drop доску с @dnd-kit',
      'Создал визуализацию архитектуры через React Flow',
      'Построил dashboard с аналитикой через Recharts',
      'Реализовал real-time обновления через Zustand',
      'Добавил фильтрацию, поиск и кастомизацию колонок',
      'Развернул на Vercel с автоматическим preview для PR',
    ],
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind', 'Zustand', 'React Flow', '@dnd-kit', 'Recharts', 'Vercel'],
    highlight: false,
  },
]

// Проекты с деталями
const PROJECTS = [
  {
    name: 'Billing Service',
    desc: 'Enterprise биллинговая система для ISP. Go backend, React frontend, Docker deployment.',
    stack: ['Go', 'Firebird', 'React', 'Docker', 'Nginx'],
    url: 'https://github.com/stepan41k/billing-service',
    stars: 12,
    gradient: 'from-emerald-500 to-teal-500',
    featured: true,
  },
  {
    name: 'Feature Flags',
    desc: 'Self-hosted LaunchDarkly. Targeting rules, multi-env, audit log, Go SDK.',
    stack: ['Go', 'PostgreSQL', 'React', 'Docker'],
    url: 'https://github.com/xlurr/feature-flags',
    stars: 34,
    gradient: 'from-orange-500 to-red-500',
    featured: true,
  },
  {
    name: 'LLM Kanban',
    desc: 'Канбан для AI-агентов с визуализацией и аналитикой.',
    stack: ['React', 'TypeScript', 'Zustand', 'React Flow'],
    url: 'https://llm-kanban.vercel.app',
    dashboardUrl: 'https://llm-kanban.vercel.app/dashboard',
    gradient: 'from-violet-500 to-purple-500',
    featured: true,
  },
  {
    name: 'Go Microservices Kit',
    desc: 'Стартовый кит для микросервисов на Go с best practices.',
    stack: ['Go', 'Docker', 'gRPC', 'PostgreSQL'],
    url: 'https://github.com/xlurr/go-microservices-kit',
    stars: 8,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Telegram Bots',
    desc: 'Набор Telegram-ботов: уведомления, CRUD, интеграции.',
    stack: ['Go', 'Telegram API', 'Redis'],
    url: 'https://github.com/xlurr/telegram-bots',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    name: 'CLI Tools',
    desc: 'Коллекция CLI утилит для автоматизации.',
    stack: ['Go', 'Cobra', 'Bubble Tea'],
    url: 'https://github.com/xlurr/cli-tools',
    gradient: 'from-pink-500 to-rose-500',
  },
]

// Детальные навыки с уровнями
const SKILLS_DETAILED = [
  { name: 'Go', level: 92, category: 'backend', years: 2 },
  { name: 'REST API Design', level: 90, category: 'backend', years: 2 },
  { name: 'PostgreSQL', level: 88, category: 'backend', years: 2 },
  { name: 'Clean Architecture', level: 85, category: 'backend', years: 1.5 },
  { name: 'Docker', level: 85, category: 'devops', years: 2 },
  { name: 'React', level: 88, category: 'frontend', years: 2 },
  { name: 'TypeScript', level: 87, category: 'frontend', years: 2 },
  { name: 'Tailwind CSS', level: 92, category: 'frontend', years: 1.5 },
  { name: 'Git & GitHub', level: 90, category: 'tools', years: 3 },
  { name: 'Linux/Unix', level: 80, category: 'devops', years: 2 },
]

// Расширенные soft skills
const SOFT_SKILLS = [
  {
    name: 'Самостоятельность',
    icon: Target,
    desc: 'Самостоятельно изучаю новые технологии, читаю RFC и документацию',
    examples: ['Освоил Go за 2 месяца', 'Разобрался в gRPC без менторства']
  },
  {
    name: 'Решение проблем',
    icon: Puzzle,
    desc: 'Декомпозирую задачи, нахожу root cause через дебаг и логи',
    examples: ['Оптимизировал N+1 queries', 'Нашёл race condition в production']
  },
  {
    name: 'Быстрое обучение',
    icon: Zap,
    desc: 'Быстро погружаюсь в новые домены и технологии',
    examples: ['Изучил биллинг за неделю', 'Освоил React Flow за 2 дня']
  },
  {
    name: 'Коммуникация',
    icon: MessageCircle,
    desc: 'Чётко формулирую мысли, пишу документацию, провожу code review',
    examples: ['Веду техническую документацию', '150+ code reviews']
  },
  {
    name: 'Внимание к деталям',
    icon: Eye,
    desc: 'Забочусь о edge cases, безопасности и UX',
    examples: ['Покрытие тестами 80%+', 'Lighthouse 95+']
  },
  {
    name: 'Ответственность',
    icon: Shield,
    desc: 'Довожу задачи до production, беру ownership',
    examples: ['5 проектов в production', 'On-call поддержка']
  },
]

// Достижения и сертификаты
const ACHIEVEMENTS = [
  {
    title: 'НорНикель Digital Hack 2024',
    desc: 'Финалист федерального хакатона',
    icon: Trophy,
    color: 'text-amber-400',
    type: 'hackathon'
  },
  {
    title: 'Coursera: Go Specialization',
    desc: 'University of California, Irvine',
    icon: Award,
    color: 'text-blue-400',
    type: 'certificate'
  },
  {
    title: 'Production с первого дня',
    desc: 'Billing система обслуживает 1000+ клиентов',
    icon: Rocket,
    color: 'text-green-400',
    type: 'achievement'
  },
  {
    title: 'Open Source Contributor',
    desc: 'Контрибуции в chi, drizzle-orm',
    icon: Heart,
    color: 'text-pink-400',
    type: 'opensource'
  },
]

// Образование расширенное
const EDUCATION = {
  university: 'НовГУ им. Ярослава Мудрого',
  degree: 'Информатика и вычислительная техника',
  year: '2027',
  gpa: '4.8/5.0',
  military: true,
  courses: [
    'Дискретная математика',
    'Теория алгоритмов',
    'Структуры данных',
    'C/C++',
    'ООП',
    'Базы данных (PostgreSQL)',
    'Компьютерные сети',
    'Операционные системы',
    'Микросервисная архитектура',
    'Системное программирование',
    'Криптография',
    'Machine Learning (основы)',
  ],
  extra: [
    { name: 'Go Specialization', provider: 'Coursera / UC Irvine', year: '2025' },
    { name: 'System Design', provider: 'Educative.io', year: '2025' },
    { name: 'PostgreSQL для разработчиков', provider: 'Postgres Professional', year: '2024' },
    { name: 'Docker & Kubernetes', provider: 'Слёрм', year: '2024' },
  ]
}

// Интересные факты
const FUN_FACTS = [
  { icon: Coffee, text: '500+ чашек кофе за год кодинга' },
  { icon: Flame, text: '89 дней подряд коммитов (streak)' },
  { icon: Bug, text: '200+ багов пофикшено' },
  { icon: Lightbulb, text: '15+ архитектурных решений задокументировано' },
]

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function GlowCard({ children, className, glow = 'yellow' }: { children: React.ReactNode; className?: string; glow?: string }) {
  const glowColors: Record<string, string> = {
    yellow: 'hover:shadow-yellow-500/20',
    blue: 'hover:shadow-blue-500/20',
    green: 'hover:shadow-green-500/20',
    purple: 'hover:shadow-purple-500/20',
    pink: 'hover:shadow-pink-500/20',
    orange: 'hover:shadow-orange-500/20',
  }
  return (
    <div className={cn(
      'group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm',
      'transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04]',
      `hover:shadow-2xl ${glowColors[glow]}`,
      className
    )}>
      {children}
    </div>
  )
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 2000
          const step = (timestamp: number) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            setCount(Math.floor(progress * value))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{count}{suffix}</span>
}

function SkillBar({ name, level, years }: { name: string; level: number; years?: number }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(level) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [level])

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <div className="flex items-center gap-2">
          {years && <span className="text-xs text-zinc-600">{years}+ лет</span>}
          <span className="text-zinc-500 font-mono">{level}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function TechBadge({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03]',
      'transition-all duration-300 hover:border-yellow-500/30 hover:bg-yellow-500/[0.05]',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      {name}
    </span>
  )
}

function SectionHeader({ icon: Icon, title, subtitle, gradient }: {
  icon: typeof Code2;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <div className={cn('h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center', gradient)}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-zinc-500">{subtitle}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[150px] transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(234,179,8,0.15) 0%, transparent 70%)',
            left: mousePos.x - 400,
            top: mousePos.y - 400,
          }}
        />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <div className="relative">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HERO SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen flex items-center px-6 lg:px-16">
          <div className="w-full max-w-7xl mx-auto py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left side */}
              <div className="space-y-8">
                {/* Status badges */}
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/[0.08]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-sm text-green-400">Ищу стажировку / Junior позицию</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-blue-500/30 bg-blue-500/[0.08]">
                    <Globe className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-sm text-blue-400">Remote / Relocate</span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-4">
                    {PERSONAL.name.split(' ')[0]}
                    <br />
                    <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                      {PERSONAL.name.split(' ')[1]}
                    </span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-zinc-400 font-light">
                    {PERSONAL.tagline}
                  </p>
                </div>

                {/* Role tags */}
                <div className="flex flex-wrap gap-2">
                  {['Go Developer', 'React Specialist', 'Clean Architecture', 'Docker Enthusiast', 'API Designer'].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium hover:border-yellow-500/30 hover:bg-yellow-500/[0.05] transition-all cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${PERSONAL.email}`}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold transition-all hover:shadow-lg hover:shadow-yellow-500/25 hover:scale-105"
                  >
                    <Mail className="h-5 w-5" />
                    Написать мне
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href={`https://github.com/${PERSONAL.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] bg-white/[0.02] font-medium transition-all hover:bg-white/[0.05] hover:border-white/[0.2]"
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </a>
                  <a
                    href={`https://t.me/${PERSONAL.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] bg-white/[0.02] font-medium transition-all hover:bg-white/[0.05] hover:border-white/[0.2]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Telegram
                  </a>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="space-y-6">
                {/* Main metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {METRICS.map((metric) => {
                    const Icon = metric.icon
                    return (
                      <GlowCard key={metric.label} className="p-6">
                        <div className={cn(
                          'h-12 w-12 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center',
                          metric.color
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold mb-1">
                          {metric.value.includes('+') ? (
                            <><AnimatedCounter value={parseInt(metric.value)} />+</>
                          ) : (
                            <AnimatedCounter value={parseInt(metric.value)} />
                          )}
                        </p>
                        <p className="text-sm text-zinc-500">{metric.label}</p>
                      </GlowCard>
                    )
                  })}
                </div>

                {/* Extra metrics */}
                <div className="grid grid-cols-4 gap-3">
                  {EXTRA_METRICS.map((metric) => {
                    const Icon = metric.icon
                    return (
                      <div key={metric.label} className="text-center p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                        <Icon className="h-4 w-4 mx-auto mb-2 text-zinc-500" />
                        <p className="text-lg font-bold">{metric.value}</p>
                        <p className="text-[10px] text-zinc-600">{metric.label}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Fun facts */}
                <div className="flex flex-wrap gap-2">
                  {FUN_FACTS.map((fact, i) => {
                    const Icon = fact.icon
                    return (
                      <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs text-zinc-400">
                        <Icon className="h-3 w-3" />
                        {fact.text}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ACHIEVEMENTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20 border-t border-white/[0.05]">
          <div className="w-full max-w-7xl mx-auto">
            <SectionHeader
              icon={Trophy}
              title="Достижения"
              subtitle="Хакатоны, сертификаты и значимые результаты"
              gradient="from-amber-500 to-orange-500"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <GlowCard key={achievement.title} className="p-6" glow="orange">
                    <Icon className={cn('h-8 w-8 mb-4', achievement.color)} />
                    <h3 className="font-bold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-zinc-500">{achievement.desc}</p>
                    <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-white/[0.05] text-zinc-500">
                      {achievement.type}
                    </span>
                  </GlowCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TECH STACK */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <SectionHeader
              icon={Terminal}
              title="Tech Stack"
              subtitle="Технологии, с которыми работаю каждый день"
              gradient="from-yellow-500 to-amber-500"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(STACK).map(([category, data]) => {
                const Icon = data.icon
                return (
                  <GlowCard key={category} className="p-6">
                    <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center', data.color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {data.items.map((tech) => (
                        <TechBadge key={tech} name={tech} size="sm" />
                      ))}
                    </div>
                  </GlowCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EXPERIENCE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20 border-t border-white/[0.05]">
          <div className="w-full max-w-7xl mx-auto">
            <SectionHeader
              icon={Briefcase}
              title="Опыт работы"
              subtitle="Production проекты и коммерческая разработка"
              gradient="from-blue-500 to-cyan-500"
            />

            <div className="space-y-8">
              {EXPERIENCE.map((exp, i) => (
                <GlowCard
                  key={i}
                  className={cn('p-8', exp.highlight && 'border-yellow-500/20 bg-yellow-500/[0.02]')}
                  glow={exp.highlight ? 'yellow' : 'blue'}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        {exp.highlight && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                            Production
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-yellow-500 font-medium">{exp.company}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                        <span>{exp.type}</span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-zinc-400 font-mono bg-white/[0.03] px-4 py-2 rounded-lg">
                        {exp.period}
                      </span>
                      {exp.metrics && (
                        <div className="flex gap-2">
                          {exp.metrics.map((m) => (
                            <span key={m.label} className="text-xs bg-white/[0.05] px-2 py-1 rounded">
                              {m.label}: <span className="text-yellow-400 font-bold">{m.value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-zinc-400 mb-6">{exp.description}</p>

                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {exp.achievements.map((achievement, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">{achievement}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map((tech) => (
                      <TechBadge key={tech} name={tech} size="sm" />
                    ))}
                  </div>
                </GlowCard>
              ))}

              {/* Hackathon */}
              <GlowCard className="p-8 border-amber-500/20" glow="orange">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">НорНикель Digital Hack 2024</h3>
                    <p className="text-amber-400 text-sm font-medium mb-3">Финалист федерального хакатона</p>
                    <p className="text-zinc-400 mb-4">
                      Разработка прототипа по кейсу компании за 48 часов. Работа под давлением,
                      быстрая итерация, защита решения перед техническим жюри из Норникеля.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Командная работа', 'Time pressure', 'Презентация', 'Прототипирование'].map((skill) => (
                        <TechBadge key={skill} name={skill} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PROJECTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <SectionHeader
              icon={Layers}
              title="Проекты"
              subtitle="Open source, pet-проекты и эксперименты"
              gradient="from-purple-500 to-pink-500"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.map((proj) => (
                <GlowCard key={proj.name} className="p-6 flex flex-col" glow="purple">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('h-2 w-16 rounded-full bg-gradient-to-r', proj.gradient)} />
                    {proj.stars && (
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Star className="h-3 w-3" />
                        {proj.stars}
                      </div>
                    )}
                    {proj.featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2">{proj.name}</h3>
                  <p className="text-sm text-zinc-400 mb-4 flex-1">{proj.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.stack.map((tech) => (
                      <TechBadge key={tech} name={tech} size="sm" />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {proj.dashboardUrl ? (
                      <>
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-white/[0.1] hover:bg-white/[0.05] transition-all"
                        >
                          Demo <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href={proj.dashboardUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-white/[0.1] hover:bg-white/[0.05] transition-all"
                        >
                          Dashboard <ExternalLink className="h-3 w-3" />
                        </a>
                      </>
                    ) : (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-white/[0.1] hover:bg-white/[0.05] transition-all"
                      >
                        <Github className="h-4 w-4" />
                        View Code
                      </a>
                    )}
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SKILLS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20 border-t border-white/[0.05]">
          <div className="w-full max-w-7xl mx-auto">
            <SectionHeader
              icon={Code2}
              title="Навыки"
              subtitle="Технические и профессиональные компетенции"
              gradient="from-green-500 to-emerald-500"
            />

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Technical skills */}
              <GlowCard className="p-8" glow="green">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-yellow-500" />
                  Hard Skills
                  <span className="text-xs text-zinc-500 ml-auto">Самооценка</span>
                </h3>
                <div className="space-y-5">
                  {SKILLS_DETAILED.map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} years={skill.years} />
                  ))}
                </div>
              </GlowCard>

              {/* Soft skills */}
              <GlowCard className="p-8" glow="blue">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Soft Skills
                </h3>
                <div className="space-y-4">
                  {SOFT_SKILLS.map((skill) => {
                    const Icon = skill.icon
                    return (
                      <div
                        key={skill.name}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-yellow-500" />
                          <h4 className="font-medium">{skill.name}</h4>
                        </div>
                        <p className="text-sm text-zinc-500 mb-2">{skill.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.examples.map((ex) => (
                            <span key={ex} className="text-xs px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </GlowCard>
            </div>

            {/* AI tools */}
            <GlowCard className="mt-8 p-6 border-yellow-500/20" glow="yellow">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shrink-0">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">AI как мультипликатор продуктивности</h4>
                  <p className="text-sm text-zinc-400 mb-3">
                    Использую Claude, Cursor и Copilot для ускорения разработки. LLM — инструмент,
                    не замена инженерному мышлению. Всегда верифицирую код, понимаю каждую строку.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Claude Code', 'Cursor', 'GitHub Copilot', 'Perplexity', 'ChatGPT', 'Prompt Engineering'].map((tool) => (
                      <TechBadge key={tool} name={tool} size="sm" />
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EDUCATION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <SectionHeader
              icon={GraduationCap}
              title="Образование"
              subtitle="Академическая база и дополнительное обучение"
              gradient="from-indigo-500 to-violet-500"
            />

            <div className="grid lg:grid-cols-2 gap-6">
              {/* University */}
              <GlowCard className="p-8" glow="purple">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{EDUCATION.university}</h3>
                    <p className="text-zinc-400">{EDUCATION.degree}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-yellow-500 font-medium">Выпуск {EDUCATION.year}</span>
                      <span className="text-sm text-zinc-500">GPA: {EDUCATION.gpa}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 mb-3">Ключевые курсы:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {EDUCATION.courses.map((course) => (
                      <TechBadge key={course} name={course} size="sm" />
                    ))}
                  </div>
                </div>
              </GlowCard>

              {/* Military */}
              <GlowCard className="p-8 border-green-500/20" glow="green">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Военная кафедра</h3>
                    <p className="text-green-400 text-sm font-medium">Пройдена полностью ✓</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  Развитые навыки работы в условиях давления, принятия решений при неполной информации,
                  ответственности за результат команды. Полезно для работы в критичных системах.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Стрессоустойчивость', 'Лидерство', 'Дисциплина', 'Командная работа'].map((skill) => (
                    <TechBadge key={skill} name={skill} size="sm" />
                  ))}
                </div>
              </GlowCard>

              {/* Additional education */}
              <GlowCard className="lg:col-span-2 p-8" glow="blue">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  Дополнительное образование и сертификаты
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {EDUCATION.extra.map((course) => (
                    <div key={course.name} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div>
                        <h4 className="font-medium">{course.name}</h4>
                        <p className="text-sm text-zinc-500">{course.provider}</p>
                      </div>
                      <span className="text-sm text-zinc-500">{course.year}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CONTACT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20 border-t border-white/[0.05]">
          <div className="w-full max-w-7xl mx-auto">
            <GlowCard className="p-12 text-center" glow="yellow">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/[0.08] mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-sm text-green-400">Активно ищу возможности</span>
              </div>

              <h2 className="text-4xl font-bold mb-4">Давайте работать вместе!</h2>
              <p className="text-xl text-zinc-400 mb-2 max-w-2xl mx-auto">
                Ищу позицию <span className="text-yellow-400 font-semibold">Стажёр / Junior Go Developer</span>
              </p>
              <p className="text-zinc-500 mb-8 max-w-2xl mx-auto">
                Готов к удалённой работе, офису в Великом Новгороде или релокации.
                Быстро учусь, самостоятельно решаю задачи, пишу чистый код.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href={`tel:${PERSONAL.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <Phone className="h-5 w-5 text-green-500" />
                  <span>{PERSONAL.phone}</span>
                </a>
                <a
                  href={`mailto:${PERSONAL.email}`}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
                >
                  <Mail className="h-5 w-5" />
                  <span>{PERSONAL.email}</span>
                </a>
                <a
                  href={`https://github.com/${PERSONAL.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <Github className="h-5 w-5 text-purple-500" />
                  <span>github.com/{PERSONAL.github}</span>
                </a>
                <a
                  href={`https://t.me/${PERSONAL.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span>{PERSONAL.telegram}</span>
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 rounded-lg bg-white/[0.03] text-sm text-zinc-400">
                  🇷🇺 Русский — родной
                </span>
                <span className="px-4 py-2 rounded-lg bg-white/[0.03] text-sm text-zinc-400">
                  🇬🇧 English — B1-B2 (техническая документация)
                </span>
                <span className="px-4 py-2 rounded-lg bg-white/[0.03] text-sm text-zinc-400">
                  📍 {PERSONAL.location}
                </span>
                <span className="px-4 py-2 rounded-lg bg-white/[0.03] text-sm text-zinc-400">
                  🌍 Готов к релокации
                </span>
              </div>
            </GlowCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-16 py-8 border-t border-white/[0.05]">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <span>© 2026 Никита Мосягин • Сделано с ❤️ и много ☕</span>
            <div className="flex items-center gap-4">
              <a
                href={`https://github.com/${PERSONAL.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-yellow-500 transition-colors"
              >
                <Github className="h-4 w-4" />
                {PERSONAL.github}
              </a>
              <span className="text-zinc-700">•</span>
              <span>1247 commits this year</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
