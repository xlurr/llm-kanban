import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Mail, Phone, MapPin, Github, ExternalLink,
  Code2, Brain, Briefcase, GraduationCap, Trophy, Layers,
  Shield, CheckCircle2, Target, Search, BookOpen, Eye, MessageSquare,
  Clock, Users, GitBranch, Terminal, Rocket, ChevronRight
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const PERSONAL = {
  name: 'Никита Мосягин',
  title: 'Full-Stack Developer',
  subtitle: 'Go · React · TypeScript',
  tagline: 'Превращаю идеи в production-ready код',
  status: 'open',
  yearsExp: 2,
  email: 'aborigen.nm@gmail.com',
  phone: '+7 911 645-98-85',
  github: 'xlurr',
  location: 'Великий Новгород',
}

const METRICS = [
  { label: 'Проектов в production', value: '3+', icon: Rocket, color: 'from-green-500 to-emerald-500' },
  { label: 'Коммитов за год', value: '847', icon: GitBranch, color: 'from-blue-500 to-cyan-500' },
  { label: 'Code reviews', value: '120+', icon: Eye, color: 'from-purple-500 to-pink-500' },
  { label: 'Часов кодинга', value: '2000+', icon: Clock, color: 'from-orange-500 to-amber-500' },
]

const STACK = {
  backend: ['Go', 'chi', 'JWT', 'PostgreSQL', 'Firebird', 'Redis', 'gRPC'],
  frontend: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Zustand', 'TanStack Query'],
  devops: ['Docker', 'Nginx', 'GitHub Actions', 'Linux', 'systemd'],
  tools: ['Git', 'VSCode', 'Cursor', 'Postman', 'pgAdmin'],
}

const EXPERIENCE = [
  {
    company: 'ISP «Максима»',
    role: 'Full-Stack Developer',
    type: 'Freelance',
    period: 'Февраль 2026 — н.в.',
    location: 'Великий Новгород',
    description: 'Разработка биллинговой системы личного кабинета для интернет-провайдера с нуля.',
    achievements: [
      'Спроектировал и реализовал REST API на Go с JWT авторизацией',
      'Построил React SPA с Framer Motion анимациями',
      'Настроил Docker Compose окружение для production',
      'Внедрил MSW для независимой разработки фронтенда',
    ],
    stack: ['Go', 'chi', 'JWT', 'Firebird', 'React', 'TypeScript', 'Docker', 'Nginx'],
    highlight: true,
  },
  {
    company: 'Feature Flags Manager',
    role: 'Full-Stack Developer',
    type: 'Pet-проект',
    period: '2025 — н.в.',
    description: 'Аналог LaunchDarkly для управления feature flags.',
    achievements: [
      'Clean Architecture с DI через интерфейсы',
      'JSONB для гибких targeting rules',
      'Real-time eval endpoint для SDK',
      'Audit log с полной историей изменений',
    ],
    stack: ['Go', 'PostgreSQL', 'React', 'TanStack Query', 'Drizzle', 'Docker'],
    highlight: false,
  },
]

const PROJECTS = [
  {
    name: 'LLM Kanban',
    desc: 'Канбан для AI-агентов с визуализацией архитектуры',
    stack: ['React 19', 'TypeScript', 'Zustand', 'React Flow'],
    url: 'https://llm-kanban.vercel.app',
    dashboardUrl: 'https://llm-kanban.vercel.app/dashboard',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Billing Service',
    desc: 'Production биллинг для ISP с JWT auth',
    stack: ['Go', 'Firebird', 'React', 'Docker'],
    url: 'https://github.com/stepan41k/billing-service',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Feature Flags',
    desc: 'Self-hosted LaunchDarkly альтернатива',
    stack: ['Go', 'PostgreSQL', 'React', 'Drizzle'],
    url: 'https://github.com/xlurr/feature-flags',
    gradient: 'from-orange-500 to-red-500',
  },
]

const SKILLS = [
  { name: 'Go', level: 90, category: 'backend' },
  { name: 'PostgreSQL', level: 85, category: 'backend' },
  { name: 'REST API', level: 90, category: 'backend' },
  { name: 'React', level: 85, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'frontend' },
  { name: 'Tailwind', level: 90, category: 'frontend' },
  { name: 'Docker', level: 80, category: 'devops' },
  { name: 'Git', level: 90, category: 'devops' },
]

const SOFT_SKILLS = [
  { name: 'Самостоятельность', icon: Target, desc: 'Разбираюсь в новых технологиях без подсказок' },
  { name: 'Решение проблем', icon: Search, desc: 'Декомпозиция задач, дебаг, логи' },
  { name: 'Обучаемость', icon: BookOpen, desc: 'Быстро осваиваю новые стеки' },
  { name: 'Коммуникация', icon: MessageSquare, desc: 'Документирую решения, объясняю код' },
]

const EDUCATION = {
  university: 'НовГУ им. Ярослава Мудрого',
  degree: 'Информатика и вычислительная техника',
  year: '2027',
  military: true,
  courses: ['Дискретная математика', 'Теория алгоритмов', 'C/C++', 'PostgreSQL', 'Микросервисы', 'Сети'],
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function GlowCard({ children, className, glow = 'yellow' }: { children: React.ReactNode; className?: string; glow?: string }) {
  const glowColors: Record<string, string> = {
    yellow: 'hover:shadow-yellow-500/20',
    blue: 'hover:shadow-blue-500/20',
    green: 'hover:shadow-green-500/20',
    purple: 'hover:shadow-purple-500/20',
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

function SkillBar({ name, level }: { name: string; level: number }) {
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
        <span className="text-zinc-500">{level}%</span>
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Main info */}
              <div className="space-y-8">
                {/* Status badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/[0.08]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-sm text-green-400">Открыт к предложениям</span>
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
                  {['Backend Developer', 'Go Enthusiast', 'React Developer'].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium"
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
                </div>
              </div>

              {/* Right side - Stats cards */}
              <div className="grid grid-cols-2 gap-4">
                {METRICS.map((metric, i) => {
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
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TECH STACK */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <Terminal className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Tech Stack</h2>
                <p className="text-zinc-500">Технологии, с которыми работаю каждый день</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(STACK).map(([category, techs]) => (
                <GlowCard key={category} className="p-6">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <TechBadge key={tech} name={tech} />
                    ))}
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EXPERIENCE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Опыт работы</h2>
                <p className="text-zinc-500">Production проекты и коммерческая разработка</p>
              </div>
            </div>

            <div className="space-y-6">
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
                      <p className="text-lg text-zinc-400">{exp.company}</p>
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
                    <span className="text-sm text-zinc-500 font-mono bg-white/[0.03] px-4 py-2 rounded-lg">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-zinc-400 mb-6">{exp.description}</p>

                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {exp.achievements.map((achievement, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
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
              <GlowCard className="p-8 border-amber-500/20" glow="yellow">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">НорНикель Digital Hack 2024</h3>
                    <p className="text-amber-400 text-sm font-medium mb-3">Финалист хакатона</p>
                    <p className="text-zinc-400">
                      Разработка прототипа по кейсу компании за 48 часов. Работа под давлением,
                      быстрая итерация, защита решения перед техническим жюри.
                    </p>
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
            <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Проекты</h2>
                <p className="text-zinc-500">Open source и pet-проекты</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PROJECTS.map((proj) => (
                <GlowCard key={proj.name} className="p-6 flex flex-col" glow="purple">
                  <div className={cn(
                    'h-2 rounded-full bg-gradient-to-r mb-6',
                    proj.gradient
                  )} />

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
                          Сайт <ExternalLink className="h-3 w-3" />
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
                        Открыть <ExternalLink className="h-3 w-3" />
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
        <section className="px-6 lg:px-16 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Навыки</h2>
                <p className="text-zinc-500">Технические и софт скиллы</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Technical skills */}
              <GlowCard className="p-8" glow="green">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-yellow-500" />
                  Hard Skills
                </h3>
                <div className="space-y-5">
                  {SKILLS.map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </GlowCard>

              {/* Soft skills */}
              <GlowCard className="p-8" glow="blue">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Soft Skills
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {SOFT_SKILLS.map((skill) => {
                    const Icon = skill.icon
                    return (
                      <div
                        key={skill.name}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                      >
                        <Icon className="h-5 w-5 text-yellow-500 mb-2" />
                        <h4 className="font-medium text-sm mb-1">{skill.name}</h4>
                        <p className="text-xs text-zinc-500">{skill.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </GlowCard>
            </div>

            {/* AI tools note */}
            <GlowCard className="mt-8 p-6 border-yellow-500/20" glow="yellow">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shrink-0">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">AI-инструменты как мультипликатор продуктивности</h4>
                  <p className="text-sm text-zinc-400">
                    Использую Claude, Cursor и Copilot для ускорения разработки. LLM — это инструмент,
                    а не замена инженерного мышления. Всегда верифицирую генерируемый код.
                  </p>
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
            <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Образование</h2>
                <p className="text-zinc-500">Академическая база и дополнительное обучение</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GlowCard className="p-8" glow="purple">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{EDUCATION.university}</h3>
                    <p className="text-zinc-400">{EDUCATION.degree}</p>
                    <p className="text-sm text-yellow-500 font-medium mt-1">Выпуск {EDUCATION.year}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EDUCATION.courses.map((course) => (
                    <TechBadge key={course} name={course} size="sm" />
                  ))}
                </div>
              </GlowCard>

              <GlowCard className="p-8 border-green-500/20" glow="green">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Военная кафедра</h3>
                    <p className="text-green-400 text-sm font-medium mb-3">Пройдена полностью</p>
                    <p className="text-sm text-zinc-400">
                      Работа в условиях давления, принятие решений при неполной информации,
                      ответственность за результат команды.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CONTACT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-16 py-20">
          <div className="w-full max-w-7xl mx-auto">
            <GlowCard className="p-12 text-center" glow="yellow">
              <h2 className="text-4xl font-bold mb-4">Давайте работать вместе</h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                Ищу позицию Backend / Full-Stack Developer с фокусом на Go.
                Готов к удалённой работе и релокации.
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
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <Mail className="h-5 w-5 text-blue-500" />
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
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-white/[0.1] bg-white/[0.02]">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span>{PERSONAL.location}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <span className="px-4 py-2 rounded-lg bg-white/[0.03] text-sm text-zinc-400">
                  Русский — родной
                </span>
                <span className="px-4 py-2 rounded-lg bg-white/[0.03] text-sm text-zinc-400">
                  English — B1-B2
                </span>
              </div>
            </GlowCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-16 py-8 border-t border-white/[0.05]">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-sm text-zinc-500">
            <span>© 2026 Никита Мосягин</span>
            <a
              href={`https://github.com/${PERSONAL.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-yellow-500 transition-colors"
            >
              <Github className="h-4 w-4" />
              {PERSONAL.github}
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
