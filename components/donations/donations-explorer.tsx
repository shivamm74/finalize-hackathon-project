"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { DonationsTable } from "./donations-table"
import { categoryLabels } from "@/lib/format"
import type { Donation, DonationStatus, FoodCategory } from "@/types"

type TabKey = "active" | "needs_match" | "in_transit" | "delivered" | "all"

const tabs: { key: TabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "needs_match", label: "Needs match" },
  { key: "in_transit", label: "In transit" },
  { key: "delivered", label: "Delivered" },
  { key: "all", label: "All" },
]

const inTransit: DonationStatus[] = [
  "matched",
  "driver_assigned",
  "pickup_in_progress",
]

function matchesTab(d: Donation, tab: TabKey) {
  switch (tab) {
    case "active":
      return d.status !== "delivered"
    case "needs_match":
      return d.status === "needs_match" || d.status === "at_risk"
    case "in_transit":
      return inTransit.includes(d.status)
    case "delivered":
      return d.status === "delivered"
    case "all":
      return true
  }
}

export function DonationsExplorer({
  donations,
  initialTab = "active",
}: {
  donations: Donation[]
  initialTab?: TabKey
}) {
  const [tab, setTab] = useState<TabKey>(initialTab)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<FoodCategory | "all">("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return donations.filter((d) => {
      if (!matchesTab(d, tab)) return false
      if (category !== "all" && d.category !== category) return false
      if (
        q &&
        !`${d.foodName} ${d.code} ${d.donor.name}`.toLowerCase().includes(q)
      )
        return false
      return true
    })
  }, [donations, tab, query, category])

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="w-full overflow-x-auto lg:w-auto">
            {tabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            <InputGroup className="w-full sm:w-64">
              <InputGroupInput
                placeholder="Search donations…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <Select
              value={category}
              onValueChange={(v) => setCategory(v as FoodCategory | "all")}
            >
              <SelectTrigger className="h-9 w-40 shrink-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All categories</SelectItem>
                  {(Object.keys(categoryLabels) as FoodCategory[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoryLabels[c]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Tabs>

      <p className="text-sm text-muted-foreground">
        {filtered.length} donation{filtered.length === 1 ? "" : "s"}
      </p>

      <DonationsTable donations={filtered} />
    </div>
  )
}
