import type { LucideIcon } from "lucide-react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  sub,
  trend,
  trendPositive = true,
  icon: Icon,
}: {
  label: string
  value: string
  sub?: string
  trend?: string
  trendPositive?: boolean
  icon?: LucideIcon
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          {Icon && (
            <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="size-4" />
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "mb-1 inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                trendPositive ? "text-brand" : "text-muted-foreground",
              )}
            >
              {trendPositive ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {trend}
            </span>
          )}
        </div>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </CardContent>
    </Card>
  )
}
