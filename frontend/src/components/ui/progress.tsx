import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value))
    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            clampedValue < 30
              ? "bg-gradient-to-r from-blue-500 to-blue-400"
              : clampedValue < 70
              ? "bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400"
              : clampedValue < 100
              ? "bg-gradient-to-r from-blue-500 via-emerald-400 to-green-400"
              : "bg-gradient-to-r from-emerald-500 to-green-400"
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
