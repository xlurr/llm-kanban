import { cn } from '@/lib/utils'

// ── Color themes for hero banners ──

export type HeroTheme = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'blue' | 'neutral'

const themes: Record<HeroTheme, {
  dark: { from: string; via: string; orb1: string; orb2: string }
  light: { from: string; via: string; orb1: string; orb2: string }
}> = {
  violet: {
    dark: { from: 'from-violet-950/50', via: 'via-background', orb1: 'bg-violet-500/10', orb2: 'bg-cyan-500/10' },
    light: { from: 'from-violet-50', via: 'via-background', orb1: 'bg-violet-200/40', orb2: 'bg-indigo-200/30' },
  },
  cyan: {
    dark: { from: 'from-cyan-950/50', via: 'via-background', orb1: 'bg-cyan-500/10', orb2: 'bg-blue-500/10' },
    light: { from: 'from-cyan-50', via: 'via-background', orb1: 'bg-cyan-200/40', orb2: 'bg-sky-200/30' },
  },
  emerald: {
    dark: { from: 'from-emerald-950/50', via: 'via-background', orb1: 'bg-emerald-500/10', orb2: 'bg-teal-500/10' },
    light: { from: 'from-emerald-50', via: 'via-background', orb1: 'bg-emerald-200/40', orb2: 'bg-teal-200/30' },
  },
  rose: {
    dark: { from: 'from-rose-950/50', via: 'via-background', orb1: 'bg-rose-500/10', orb2: 'bg-pink-500/10' },
    light: { from: 'from-rose-50', via: 'via-background', orb1: 'bg-rose-200/40', orb2: 'bg-pink-200/30' },
  },
  amber: {
    dark: { from: 'from-amber-950/50', via: 'via-background', orb1: 'bg-amber-500/10', orb2: 'bg-orange-500/10' },
    light: { from: 'from-amber-50', via: 'via-background', orb1: 'bg-amber-200/40', orb2: 'bg-orange-200/30' },
  },
  blue: {
    dark: { from: 'from-blue-950/50', via: 'via-background', orb1: 'bg-blue-500/10', orb2: 'bg-indigo-500/10' },
    light: { from: 'from-blue-50', via: 'via-background', orb1: 'bg-blue-200/40', orb2: 'bg-indigo-200/30' },
  },
  neutral: {
    dark: { from: 'from-zinc-900/50', via: 'via-background', orb1: 'bg-zinc-500/10', orb2: 'bg-slate-500/10' },
    light: { from: 'from-zinc-50', via: 'via-background', orb1: 'bg-zinc-200/40', orb2: 'bg-slate-200/30' },
  },
}

interface PageHeroProps {
  theme?: HeroTheme
  children: React.ReactNode
  className?: string
  compact?: boolean
}

export function PageHero({ theme = 'violet', children, className, compact }: PageHeroProps) {
  const t = themes[theme]
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border border-border/50',
      compact ? 'p-5' : 'p-8',
      className,
    )}>
      {/* Light theme background */}
      <div className={cn('absolute inset-0 bg-gradient-to-br to-transparent dark:hidden', t.light.from, t.light.via)} />
      {/* Dark theme background */}
      <div className={cn('absolute inset-0 bg-gradient-to-br to-transparent hidden dark:block', t.dark.from, t.dark.via)} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Light orbs */}
      <div className={cn('absolute top-0 left-0 w-72 h-72 rounded-full blur-[100px] animate-pulse dark:hidden', t.light.orb1)} />
      <div className={cn('absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] animate-pulse dark:hidden', t.light.orb2)} style={{ animationDelay: '1s' }} />
      {/* Dark orbs */}
      <div className={cn('absolute top-0 left-0 w-72 h-72 rounded-full blur-[100px] animate-pulse hidden dark:block', t.dark.orb1)} />
      <div className={cn('absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] animate-pulse hidden dark:block', t.dark.orb2)} style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
