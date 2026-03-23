import { cn } from '@/lib/utils'

interface PageHeroProps {
  children: React.ReactNode
  className?: string
  compact?: boolean
}

export function PageHero({ children, className, compact }: PageHeroProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border border-border/50',
      compact ? 'p-5' : 'p-8',
      className,
    )}>
      {/* Light background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/80 via-background to-zinc-50/50 dark:hidden" />
      {/* Dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-background to-zinc-950/30 hidden dark:block" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Light orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-[100px] animate-pulse bg-zinc-200/40 dark:hidden" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] animate-pulse bg-zinc-300/30 dark:hidden" style={{ animationDelay: '1s' }} />
      {/* Dark orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-[100px] animate-pulse hidden dark:block bg-white/[0.03]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] animate-pulse hidden dark:block bg-white/[0.02]" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
