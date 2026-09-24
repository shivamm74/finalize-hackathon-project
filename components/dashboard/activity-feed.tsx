import {
  FilePlus2,
  Sparkles,
  Link2,
  UserCheck,
  Truck,
  PackageCheck,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRelative } from "@/lib/format"
import type { ActivityEvent } from "@/types"

const config: Record<
  ActivityEvent["type"],
  { icon: LucideIcon; className: string }
> = {
  posted: { icon: FilePlus2, className: "bg-muted text-muted-foreground" },
  analyzed: { icon: Sparkles, className: "bg-brand/10 text-brand" },
  matched: { icon: Link2, className: "bg-brand/10 text-brand" },
  assigned: { icon: UserCheck, className: "bg-blue-500/10 text-blue-600" },
  pickup: { icon: Truck, className: "bg-blue-500/10 text-blue-600" },
  delivered: { icon: PackageCheck, className: "bg-muted text-foreground" },
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((e, i) => {
        const { icon: Icon, className } = config[e.type]
        const last = i === events.length - 1
        return (
          <li key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  className,
                )}
              >
                <Icon className="size-4" />
              </span>
              {!last && <span className="w-px flex-1 bg-border" />}
            </div>
            <div className={cn("flex flex-col gap-0.5", last ? "pb-0" : "pb-5")}>
              <span className="text-sm text-pretty">{e.label}</span>
              <span className="text-xs text-muted-foreground">
                {formatRelative(e.time)}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
