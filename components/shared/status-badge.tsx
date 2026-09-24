import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { statusLabels } from "@/lib/format"
import type { DonationStatus } from "@/types"

const dotClass: Record<DonationStatus, string> = {
  needs_match: "bg-amber-500",
  matched: "bg-brand",
  driver_assigned: "bg-blue-500",
  pickup_in_progress: "bg-blue-500 animate-pulse",
  delivered: "bg-muted-foreground",
  at_risk: "bg-destructive",
}

export function StatusBadge({ status }: { status: DonationStatus }) {
  return (
    <Badge
      variant={status === "at_risk" ? "destructive" : "outline"}
      className="gap-1.5 font-medium"
    >
      <span className={cn("size-1.5 rounded-full", dotClass[status])} />
      {statusLabels[status]}
    </Badge>
  )
}
