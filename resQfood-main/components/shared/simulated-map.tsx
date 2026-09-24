"use client"

import { cn } from "@/lib/utils"
import { Utensils, Home, Bike } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type MapMarkerKind = "donation" | "recipient" | "volunteer"

export interface MapMarker {
  id: string
  x: number
  y: number
  label: string
  kind: MapMarkerKind
  atRisk?: boolean
  active?: boolean
}

export interface MapRoute {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

const kindStyles: Record<MapMarkerKind, string> = {
  donation: "bg-brand text-brand-foreground",
  recipient: "bg-foreground text-background",
  volunteer: "bg-blue-500 text-white",
}

const kindIcon = {
  donation: Utensils,
  recipient: Home,
  volunteer: Bike,
}

export function SimulatedMap({
  markers,
  routes = [],
  className,
  onSelect,
  activeId,
}: {
  markers: MapMarker[]
  routes?: MapRoute[]
  className?: string
  onSelect?: (id: string) => void
  activeId?: string
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted/30",
        className,
      )}
    >
      {/* Grid + water + roads */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 62.5"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M8 0H0V8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.15"
              className="text-border"
            />
          </pattern>
        </defs>
        <rect width="100" height="62.5" fill="url(#grid)" />
        {/* stylized river */}
        <path
          d="M0 44 C 20 40, 30 54, 50 50 S 82 40, 100 46"
          fill="none"
          className="text-sky-200/70"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* main roads */}
        <path
          d="M14 0 V62.5 M58 0 V62.5 M0 18 H100 M0 40 H100"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
          fill="none"
        />
        {/* routes */}
        {routes.map((r, i) => (
          <line
            key={i}
            x1={r.from.x}
            y1={r.from.y * 0.625}
            x2={r.to.x}
            y2={r.to.y * 0.625}
            className="text-brand"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1.5 1.5"
          />
        ))}
      </svg>

      {/* Markers */}
      {markers.map((m) => {
        const Icon = kindIcon[m.kind]
        const isActive = m.active || activeId === m.id
        return (
          <Tooltip key={m.id}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => onSelect?.(m.id)}
                  className={cn(
                    "absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background shadow-sm transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    m.atRisk ? "bg-destructive text-white" : kindStyles[m.kind],
                    isActive && "z-10 scale-125 ring-3 ring-ring/40",
                    onSelect && "cursor-pointer hover:scale-110",
                  )}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  <Icon className="size-3.5" />
                  <span className="sr-only">{m.label}</span>
                </button>
              }
            />
            <TooltipContent>{m.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

export function MapLegend() {
  const items: { kind: MapMarkerKind; label: string }[] = [
    { kind: "donation", label: "Donations" },
    { kind: "recipient", label: "Recipients" },
    { kind: "volunteer", label: "Volunteers" },
  ]
  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map((it) => {
        const Icon = kindIcon[it.kind]
        return (
          <span
            key={it.kind}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full",
                kindStyles[it.kind],
              )}
            >
              <Icon className="size-2.5" />
            </span>
            {it.label}
          </span>
        )
      })}
    </div>
  )
}
