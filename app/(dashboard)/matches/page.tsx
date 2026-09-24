"use client"

import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { matches } from "@/lib/mock-data"
import { useStore } from "@/lib/store"

export default function MatchesPage() {
  const { donations, recipients, volunteers, assign } = useStore()
  const open = matches.filter((m) => {
    const d = donations.find((x) => x.id === m.donationId)
    return d && !d.recipientId
  })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Matching center" description="Recommended recipient for each open donation." />
      {open.length === 0 && <p className="text-sm text-muted-foreground">All donations are matched. 🎉</p>}
      {open.map((m) => {
        const d = donations.find((x) => x.id === m.donationId)!
        const r = recipients.find((x) => x.id === m.recipientId)
        const v = volunteers.find((x) => x.id === m.suggestedVolunteerId)
        return (
          <Card key={m.id}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <Link href={`/donations/${d.id}`} className="font-medium hover:underline">{d.code} · {d.foodName}</Link>
                <span className="text-sm text-muted-foreground">→ {r?.name} · {m.distanceKm} km · score {m.score}</span>
                <div className="flex flex-wrap gap-1">{m.reasons.map((x) => <Badge key={x.label} variant={x.satisfied ? "secondary" : "outline"}>{x.label}</Badge>)}</div>
              </div>
              <Button onClick={() => { assign(d.id, m.recipientId, v?.id); toast.success(`${d.code} matched with ${r?.name}`) }}>Approve match</Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
