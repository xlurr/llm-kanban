import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Mail, Phone, MapPin, Github, ExternalLink, ChevronRight,
  Code2, Database, Container, Globe, Brain,
  Briefcase, GraduationCap, Trophy, Layers, Server,
  ArrowUpRight, Sparkles, Shield, ArrowUp,
} from 'lucide-react'

// ── Hooks ──

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useMouseGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])
  return { ref, onMouseMove }
}

// ── Small components ──

function SectionTitle({ icon: Icon, title }: { icon: typeof Code2; title: string }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className="flex items-center gap-3 mb-10">
      <div className="h-11 w-11 rounded-xl bg-yellow-500/[0.08] border border-yellow-500/[0.15] flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-yellow-500" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="flex-1 h-px overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500/30 via-zinc-700/50 to-transparent transition-all duration-1000 ease-out"
          style={{ transform: inView ? 'translateX(0)' : 'translateX(-100%)' }}
        />
      </div>
    </div>
  )
}

function SkillBar({ level, inView }: { level: number; inView: boolean }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-zinc-800/50 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-yellow-500/70 to-yellow-400/40 transition-all duration-[1.5s] ease-out"
        style={{ width: inView ? `${level}%` : '0%' }}
      />
    </div>
  )
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-yellow-500/20 animate-float"
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 4) * 20}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5 + i * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}

// Full-width section wrapper: bg spans 100vw, content is centered
function FullSection({ id, children, className = '', bg = '' }: {
  id: string
  children: React.ReactNode
  className?: string
  bg?: string
}) {
  const { ref, inView } = useInView()
  return (
    <section
      id={id}
      ref={ref}
      className={`w-full ${bg} transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </section>
  )
}

// ── Data ──

const NAV = [
  { id: 'about', label: 'Обо мне' },
  { id: 'experience', label: 'Опыт' },
  { id: 'projects', label: 'Проекты' },
  { id: 'skills', label: 'Навыки' },
  { id: 'education', label: 'Образование' },
  { id: 'contact', label: 'Контакты' },
]

const EXPERIENCE = [
  {
    title: 'Разработчик — Биллинговая система ISP «Максима»',
    period: 'Февраль 2026 — настоящее время',
    type: 'Freelance / Production',
    location: 'Великий Новгород',
    description: 'Разработка биллинговой системы личного кабинета для интернет-провайдера с нуля по техническому заданию.',
    stack: ['Go 1.26', 'chi v5', 'JWT', 'Firebird SQL', 'Docker', 'Nginx', 'React', 'TypeScript', 'Vite', 'Framer Motion', 'MSW'],
    highlights: [
      'Спроектировал слоистую архитектуру: domain → repository → service → handler, каждый слой изолирован через интерфейсы',
      'Реализовал JWT-аутентификацию: access/refresh токены (HS256), middleware, хранение секретов через env',
      'Написал репозиторий для Firebird через database/sql с транзакциями, rollback и пулом соединений',
      'Настроил структурированное логирование через zap с уровнями по окружению (dev/prod)',
      'Docker Compose (backend + frontend + Firebird + migrate), Nginx reverse proxy с gzip',
      'Фронтенд с мок-слоем через MSW — разработка UI без готового бэкенда',
      'Graceful shutdown через os.Signal, конфигурация через cleanenv + YAML + .env',
    ],
  },
  {
    title: 'Разработчик — Feature Flags Manager',
    period: '2025 — настоящее время',
    type: 'Пет-проект / Курсовая',
    location: '',
    description: 'Full-stack сервис управления feature flags — аналог LaunchDarkly/Unleash.',
    stack: ['Go 1.22', 'chi v5', 'PostgreSQL 16', 'React', 'TypeScript', 'TanStack Query', 'Drizzle ORM', 'Shadcn/ui', 'Docker'],
    highlights: [
      'Go backend с чистой архитектурой: domain entities → ports (interfaces) → adapters (http handler)',
      'Схема PostgreSQL 16: UUID primary keys, JSONB targeting_rules, индексы на горячие поля',
      'Eval-endpoint: по client_api_key возвращает карту {flag_key: bool} для клиентских SDK',
      'React SPA: dashboard, управление флагами по окружениям, audit log, полный CRUD через TanStack Query',
      'Multi-stage Dockerfile для Go (CGO_ENABLED=0, alpine)',
    ],
  },
]

const PROJECTS = [
  {
    name: 'Billing Service (ISP «Максима»)',
    description: 'Production биллинговая система для интернет-провайдера. Go-бэкенд, JWT, Firebird DB, React фронтенд.',
    stack: ['Go', 'JWT', 'Firebird', 'Docker', 'Nginx', 'React', 'TypeScript'],
    url: 'https://github.com/stepan41k/billing-service',
    featured: true,
  },
  {
    name: 'Feature Flags Manager',
    description: 'Аналог LaunchDarkly. Управление feature flags с eval API, targeting rules и audit log.',
    stack: ['Go', 'PostgreSQL', 'React', 'TanStack Query', 'Drizzle', 'Docker'],
    url: 'https://github.com/xlurr/feature-flags',
    featured: true,
  },
  {
    name: 'LLM Kanban — Оркестрация AI-агентов',
    description: 'Канбан-система для управления задачами, выполняемыми LLM-агентами. CI/CD визуализация, drag-and-drop доска, аналитика, ревью.',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind', 'Zustand', 'Recharts', 'React Flow', '@dnd-kit'],
    url: 'https://github.com/xlurr',
    featured: true,
  },
  {
    name: 'Telegram-боты',
    description: 'Уведомления, CRUD-операции, интеграции с API. Webhook и polling, управление состояниями.',
    stack: ['Go', 'Telegram Bot API'],
    url: 'https://github.com/xlurr',
    featured: false,
  },
]

const SKILL_GROUPS = [
  {
    title: 'Backend',
    icon: Server,
    skills: [
      { name: 'Go', detail: 'chi, golang-jwt, bcrypt, zap, cleanenv, golang-migrate, database/sql, goroutines, context', level: 90 },
      { name: 'Архитектура', detail: 'Layered architecture, DI через интерфейсы, REST API, graceful shutdown', level: 85 },
      { name: 'C++', detail: 'STL, RAII, шаблоны, работа с памятью — алгоритмы и низкоуровневые концепции', level: 65 },
      { name: 'Python', detail: 'Скрипты, автоматизация, прототипирование', level: 55 },
    ],
  },
  {
    title: 'Frontend',
    icon: Globe,
    skills: [
      { name: 'TypeScript / React', detail: 'Vite, TanStack Query, Framer Motion, Shadcn/ui, Zustand, React Hook Form', level: 80 },
      { name: 'Стилизация', detail: 'Tailwind CSS, CSS Modules, CSS Custom Properties', level: 75 },
      { name: 'Инструменты', detail: 'MSW (мокирование API), Recharts, React Flow, @dnd-kit', level: 70 },
    ],
  },
  {
    title: 'Базы данных',
    icon: Database,
    skills: [
      { name: 'PostgreSQL 16', detail: 'Схемы, индексы, JSONB, транзакции, UUID, миграции', level: 80 },
      { name: 'Firebird SQL', detail: 'database/sql, транзакции, пул соединений', level: 60 },
      { name: 'SQLite', detail: 'Drizzle ORM + better-sqlite3', level: 55 },
    ],
  },
  {
    title: 'DevOps',
    icon: Container,
    skills: [
      { name: 'Docker', detail: 'Docker Compose, multi-stage builds, healthcheck, зависимости', level: 80 },
      { name: 'Nginx', detail: 'Reverse proxy, upstream, gzip, таймауты', level: 65 },
      { name: 'Git', detail: 'GitHub, GitLab, PR, code review, GitLab CI/CD', level: 85 },
      { name: 'Unix', detail: 'macOS/Linux, терминал, shell-скрипты, процессы, env', level: 70 },
    ],
  },
  {
    title: 'AI / LLM',
    icon: Brain,
    skills: [
      { name: 'Claude', detail: 'Архитектурные решения, code review, генерация шаблонного кода', level: 85 },
      { name: 'GitHub Copilot', detail: 'Автодополнение в VSCode', level: 75 },
      { name: 'Cursor', detail: 'AI-assisted редактирование, объяснение незнакомого кода', level: 70 },
      { name: 'Perplexity', detail: 'Быстрый поиск по документации и RFC', level: 65 },
    ],
  },
]

const TECH_MARQUEE = [
  'Go', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Nginx', 'JWT', 'REST API',
  'Tailwind', 'Vite', 'Zustand', 'Git', 'Linux', 'CI/CD', 'Firebird', 'Redis',
]

// ── Main App ──

export function App() {
  const [activeSection, setActiveSection] = useState('about')
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0)
      const sections = NAV.map((n) => document.getElementById(n.id))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i]
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(NAV[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroGlow = useMouseGlow()

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.4)]"
          style={{ width: `${scrollProgress}%`, transition: 'width 100ms linear' }}
        />
      </div>

      {/* ── Header ── */}
      <header className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0b]/85 backdrop-blur-xl border-b border-yellow-500/[0.06]' : ''}`}>
        <div className="w-full flex items-center justify-between px-8 lg:px-16 h-14">
          <a href="#about" className="text-sm font-bold tracking-tight hover:text-yellow-400 transition-colors group">
            nikita<span className="text-yellow-500 group-hover:text-yellow-300 transition-colors">.dev</span>
          </a>
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`relative px-3.5 py-1.5 text-sm rounded-lg transition-all duration-300 ${
                  activeSection === n.id ? 'text-yellow-400 font-medium' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {activeSection === n.id && (
                  <span className="absolute inset-0 rounded-lg bg-yellow-500/[0.08] border border-yellow-500/[0.12]" />
                )}
                <span className="relative">{n.label}</span>
              </a>
            ))}
          </nav>
          <a
            href="https://github.com/xlurr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-yellow-400 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section
        id="about"
        ref={heroGlow.ref}
        onMouseMove={heroGlow.onMouseMove}
        className="relative w-full min-h-screen flex items-center border-b border-zinc-800/40"
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          {/* Radial gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(234,179,8,0.08),transparent)]" />
          {/* Mouse glow */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(234,179,8,0.12) 0%, transparent 70%)',
              left: 'var(--mx, 50%)',
              top: 'var(--my, 50%)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        <Particles />

        <div className="relative w-full px-8 lg:px-16 py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-yellow-500/20 bg-yellow-500/[0.05] px-4 py-1.5 text-sm text-yellow-400/80 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
              </span>
              Открыт к предложениям
            </div>

            <div>
              <p className="text-sm font-mono text-yellow-500/60 mb-3 tracking-wider uppercase">Full-Stack Developer</p>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02]">
                Никита
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent gradient-text-animated bg-[length:200%_auto]">
                  Мосягин
                </span>
              </h1>
            </div>

            <p className="text-lg lg:text-xl text-zinc-400 max-w-xl leading-relaxed">
              Разрабатываю backend на <span className="text-yellow-400 font-medium">Go</span> и full-stack
              веб-приложения. Проектирую REST API, пишу бизнес-логику сервисов,
              строю фронтенд на <span className="text-yellow-400 font-medium">React + TypeScript</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-500 text-black text-sm font-bold rounded-xl hover:bg-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-500/25 active:scale-95">
                Связаться <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#projects" className="inline-flex items-center gap-2 px-7 py-3.5 border border-zinc-700 text-sm font-medium rounded-xl hover:border-yellow-500/30 hover:bg-yellow-500/[0.04] transition-all active:scale-95">
                Проекты <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right — stats grid */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {[
              { value: 'Go', label: 'Основной язык', accent: true },
              { value: '3+', label: 'Проекта в production', accent: false },
              { value: 'B1-B2', label: 'Английский', accent: false },
              { value: '2027', label: 'Выпуск НовГУ', accent: false },
            ].map((s, i) => (
              <div
                key={s.label}
                className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-6 hover:border-yellow-500/[0.15] transition-all duration-500 group"
              >
                {i === 0 && <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />}
                <p className={`text-3xl lg:text-4xl font-bold ${s.accent ? 'font-mono text-yellow-400' : ''}`}>{s.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ TECH MARQUEE ════════════════════════ */}
      <div className="w-full border-b border-zinc-800/40 bg-zinc-900/30 py-4 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        <div className="marquee-track">
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, i) => (
            <span key={i} className="px-8 py-2 text-sm text-zinc-600 font-mono whitespace-nowrap flex items-center gap-4">
              {tech} <span className="text-yellow-500/30">&#x2022;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════ EXPERIENCE ════════════════════════ */}
      <FullSection id="experience" className="py-24 lg:py-32">
        <div className="w-full px-8 lg:px-16 max-w-[1400px] mx-auto">
          <SectionTitle icon={Briefcase} title="Опыт работы" />

          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-yellow-500/30 via-zinc-800 to-transparent hidden md:block" />

            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                className="group relative md:pl-16 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6 lg:p-8 hover:border-yellow-500/[0.15] hover:bg-zinc-900/50 transition-all duration-500 tilt-card"
              >
                {/* Timeline dot */}
                <div className="absolute left-[14px] top-10 h-4 w-4 rounded-full border-2 border-zinc-700 bg-zinc-900 group-hover:border-yellow-500/60 group-hover:bg-yellow-500/10 transition-all hidden md:flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-yellow-500/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-yellow-50 transition-colors">{exp.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{exp.type}{exp.location && ` · ${exp.location}`}</p>
                  </div>
                  <span className="text-sm text-zinc-600 shrink-0 font-mono bg-zinc-800/50 px-3 py-1 rounded-md">{exp.period}</span>
                </div>

                <p className="text-sm text-zinc-400 mb-5">{exp.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {exp.stack.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 text-xs rounded-md bg-yellow-500/[0.04] border border-yellow-500/[0.08] text-zinc-400 hover:text-yellow-400 hover:border-yellow-500/20 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2.5">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="flex gap-3 text-sm text-zinc-400">
                      <ChevronRight className="h-4 w-4 text-yellow-500/40 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Hackathon */}
            <div className="relative md:pl-16 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6 lg:p-8 hover:border-amber-500/[0.15] transition-all duration-500 tilt-card">
              <div className="absolute left-[14px] top-10 h-4 w-4 rounded-full border-2 border-amber-500/30 bg-amber-500/10 hidden md:block" />
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/[0.08] border border-amber-500/[0.12] flex items-center justify-center shrink-0">
                  <Trophy className="h-6 w-6 text-amber-500/70" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">НорНикель Digital Hack 2024</h3>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                    Хакатон — разработка прототипа по кейсу компании в ограниченные сроки.
                    Работа в условиях жёстких временных рамок, быстрая итерация и защита решения перед техническим жюри.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FullSection>

      {/* ════════════════════════ PROJECTS ════════════════════════ */}
      <FullSection id="projects" className="py-24 lg:py-32" bg="bg-zinc-900/20">
        <div className="w-full px-8 lg:px-16 max-w-[1400px] mx-auto">
          <SectionTitle icon={Layers} title="Проекты" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PROJECTS.map((proj, i) => (
              <a
                key={proj.name}
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-2xl border p-6 transition-all duration-500 tilt-card overflow-hidden flex flex-col ${
                  proj.featured
                    ? 'border-zinc-700/50 bg-zinc-900/50'
                    : 'border-zinc-800/50 bg-zinc-900/30'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-yellow-500/[0.04] to-transparent pointer-events-none" />

                {proj.featured && (
                  <div className="absolute top-4 right-4">
                    <Sparkles className="h-4 w-4 text-yellow-500/30 group-hover:text-yellow-400/60 transition-colors" />
                  </div>
                )}

                <div className="relative flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold group-hover:text-yellow-50 transition-colors">{proj.name}</h3>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed flex-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-4 mt-auto">
                    {proj.stack.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[11px] rounded-md bg-yellow-500/[0.04] border border-yellow-500/[0.06] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/0 to-transparent group-hover:via-yellow-500/30 transition-all duration-500" />
              </a>
            ))}
          </div>
        </div>
      </FullSection>

      {/* ════════════════════════ SKILLS ════════════════════════ */}
      <FullSection id="skills" className="py-24 lg:py-32">
        <div className="w-full px-8 lg:px-16 max-w-[1400px] mx-auto">
          <SectionTitle icon={Code2} title="Навыки" />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SKILL_GROUPS.map((group) => {
              const Icon = group.icon
              const { ref, inView } = useInView()
              return (
                <div
                  key={group.title}
                  ref={ref}
                  className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 overflow-hidden hover:border-yellow-500/[0.1] transition-all duration-500 tilt-card"
                >
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800/30">
                    <div className="h-9 w-9 rounded-lg bg-yellow-500/[0.06] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-yellow-500/70" />
                    </div>
                    <h3 className="font-semibold text-sm tracking-wide">{group.title}</h3>
                  </div>
                  <div className="divide-y divide-zinc-800/20 p-3">
                    {group.skills.map((skill) => (
                      <div key={skill.name} className="px-4 py-3 rounded-lg hover:bg-yellow-500/[0.02] transition-colors">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-zinc-600 font-mono">{skill.level}%</span>
                        </div>
                        <SkillBar level={skill.level} inView={inView} />
                        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{skill.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* LLM note */}
          <div className="mt-8 rounded-xl border border-yellow-500/[0.1] bg-yellow-500/[0.02] p-6">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="font-semibold text-yellow-400">Подход к AI-инструментам:</span>{' '}
              использую LLM как часть инженерного процесса, а не как замену мышлению.
              Не делегирую LLM финальные решения по безопасности и архитектуре, всегда верифицирую вывод.
            </p>
          </div>

          {/* General skills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              'Быстрое погружение в незнакомый codebase',
              'Чтение документации и исходного кода',
              'Swagger / OpenAPI',
              'Английский B1-B2',
            ].map((s) => (
              <span key={s} className="px-4 py-2 text-sm rounded-lg border border-zinc-800 text-zinc-400 bg-zinc-900/30 hover:border-yellow-500/20 hover:text-yellow-50 transition-all cursor-default">
                {s}
              </span>
            ))}
          </div>
        </div>
      </FullSection>

      {/* ════════════════════════ EDUCATION ════════════════════════ */}
      <FullSection id="education" className="py-24 lg:py-32" bg="bg-zinc-900/20">
        <div className="w-full px-8 lg:px-16 max-w-[1400px] mx-auto">
          <SectionTitle icon={GraduationCap} title="Образование" />

          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 lg:p-10 space-y-6 hover:border-yellow-500/[0.1] transition-all duration-500">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold">Новгородский государственный университет</h3>
                <p className="text-sm text-zinc-500 mt-1">им. Ярослава Мудрого</p>
              </div>
              <span className="text-sm text-yellow-500/60 font-mono shrink-0 bg-yellow-500/[0.06] px-3 py-1.5 rounded-md border border-yellow-500/[0.1]">
                Выпуск 2027
              </span>
            </div>

            <p className="text-lg font-medium text-zinc-300">Информатика и вычислительная техника</p>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
              Программа от фундамента к прикладному: дискретная математика, теория алгоритмов,
              низкоуровневое программирование (C/C++, архитектура ЭВМ), затем — базы данных (PostgreSQL),
              операционные системы, микросервисная архитектура (курс от инженеров «Индид»), сети, системное программирование.
            </p>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-yellow-500/[0.02] border border-yellow-500/[0.08]">
              <Shield className="h-6 w-6 text-yellow-500/60 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Военная кафедра — пройдена полностью</p>
                <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">
                  Принятие решений в условиях неполной информации, ответственность за команду,
                  следование процедурам под давлением — навыки для работы над критичными системами.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FullSection>

      {/* ════════════════════════ CONTACT ════════════════════════ */}
      <FullSection id="contact" className="py-24 lg:py-32">
        <div className="w-full px-8 lg:px-16 max-w-[1400px] mx-auto">
          <SectionTitle icon={Mail} title="Контакты" />

          <div className="relative rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 via-zinc-900/30 to-zinc-900/50 p-8 lg:p-12 overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }} />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-500/[0.04] to-transparent pointer-events-none" />

            <div className="relative space-y-8">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold">Давайте работать вместе</h3>
                <p className="text-zinc-500 mt-3 text-lg">
                  Backend / Full-Stack Developer (Go) · Удалённая работа
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Phone, label: '+7 911 645-98-85', href: 'tel:+79116459885' },
                  { icon: Mail, label: 'aborigen.nm@gmail.com', href: 'mailto:aborigen.nm@gmail.com' },
                  { icon: Github, label: 'github.com/xlurr', href: 'https://github.com/xlurr' },
                  { icon: MapPin, label: 'Великий Новгород', href: null },
                ].map((c) => {
                  const Icon = c.icon
                  const inner = (
                    <div className="flex items-center gap-4 p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:border-yellow-500/[0.15] hover:bg-zinc-900/50 transition-all duration-300 group/c h-full">
                      <div className="h-11 w-11 rounded-lg bg-yellow-500/[0.06] border border-yellow-500/[0.08] flex items-center justify-center shrink-0 group-hover/c:bg-yellow-500/[0.1] transition-colors">
                        <Icon className="h-5 w-5 text-yellow-500/60 group-hover/c:text-yellow-400 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium block truncate">{c.label}</span>
                      </div>
                    </div>
                  )
                  return c.href ? (
                    <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                  ) : (
                    <div key={c.label}>{inner}</div>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {['Русский — родной', 'Английский — B1-B2 (техн. документация, код)'].map((l) => (
                  <span key={l} className="px-4 py-2 text-sm rounded-lg border border-zinc-800 text-zinc-400 bg-zinc-900/30">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FullSection>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-zinc-800/50 py-8">
        <div className="w-full px-8 lg:px-16 flex items-center justify-between text-sm text-zinc-600">
          <span>2026 · Никита Мосягин</span>
          <div className="flex items-center gap-5">
            <a href="#about" className="hover:text-yellow-500 transition-colors flex items-center gap-1.5">
              <ArrowUp className="h-3.5 w-3.5" /> Наверх
            </a>
            <a
              href="https://github.com/xlurr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors"
            >
              <Github className="h-3.5 w-3.5" /> xlurr
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
