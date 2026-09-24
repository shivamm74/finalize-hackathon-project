"use client"

import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { timeUntil } from "@/lib/format"

export function Countdown({
  safeUntil,
  className,
  showIcon = true,
}: {
  safeUntil: string
  className?: string
  showIcon?: boolean
}) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000 * 30)
    return () => clearInterval(id)
  }, [])

  // Render a stable value on the server / first paint to avoid hydration drift.
  const info = timeUntil(safeUntil, now ?? new Date(safeUntil))
  const { text, expired, critical } = info

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium tabular-nums",
        expired
          ? "text-destructive"
          : critical
            ? "text-orange-600"
            : "text-foreground",
        className,
      )}
      suppressHydrationWarning
    >
      {showIcon &&
        (expired || critical ? (
          <AlertTriangle className="size-3.5" />
        ) : (
          <Clock className="size-3.5" />
        ))}
      {now === null ? "—" : expired ? "Expired" : `${text} left`}
    </span>
  )
}
