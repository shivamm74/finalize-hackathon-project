"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { TimeSeriesPoint } from "@/types"

const config = {
  meals: { label: "Meals", color: "var(--color-brand)" },
} satisfies ChartConfig

export function MealsChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
        <defs>
          <linearGradient id="fillMeals" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-meals)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-meals)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="meals"
          type="monotone"
          stroke="var(--color-meals)"
          strokeWidth={2}
          fill="url(#fillMeals)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
