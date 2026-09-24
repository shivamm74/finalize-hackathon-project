import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { dietaryLabels, urgencyLabels } from "@/lib/format"
import type { DietaryType, Urgency } from "@/types"

export function DietaryBadges({
  dietary,
  className,
}: {
  dietary: DietaryType[]
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {dietary.map((d) => (
        <Badge key={d} variant="secondary" className="font-normal">
          {dietaryLabels[d]}
        </Badge>
      ))}
    </div>
  )
}

const urgencyDot: Record<Urgency, string> = {
  low: "bg-muted-foreground",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-destructive",
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <Badge
      variant={urgency === "critical" ? "destructive" : "outline"}
      className="gap-1.5 font-medium"
    >
      <span className={cn("size-1.5 rounded-full", urgencyDot[urgency])} />
      {urgencyLabels[urgency]}
    </Badge>
  )
}
