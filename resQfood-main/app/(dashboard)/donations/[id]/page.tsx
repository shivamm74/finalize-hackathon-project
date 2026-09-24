"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Countdown } from "@/components/shared/countdown"
import { SimulatedMap } from "@/components/shared/simulated-map"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { activityByDonation, matches } from "@/lib/mock-data"
import { useStore } from "@/lib/store"

export default function DonationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { donations, recipients, volunteers, assign, advance } = useStore()
  const d = donations.find((x) => x.id === id || x.code === id)
  if (!d) {
    return <div className="flex flex-col gap-3"><p>Donation not found.</p><Button variant="outline" render={<Link href="/donations" />}>Back to donations</Button></div>
  }
  const rec = recipients.find((r) => r.id === d.recipientId)
  const vol = volunteers.find((v) => v.id === d.volunteerId)
  const best = matches.find((m) => m.donationId === d.id)
  const freeVol = volunteers.find((v) => v.status === "available")
  const markers = [
    { id: "d", x: d.location.x, y: d.location.y, label: d.donor.name, kind: "donation" as const },
    ...(rec ? [{ id: "r", x: rec.location.x, y: rec.location.y, label: rec.name, kind: "recipient" as const }] : []),
    ...(vol ? [{ id: "v", x: vol.location.x, y: vol.location.y, label: vol.name, kind: "volunteer" as const }] : []),
  ]
  const routes = rec ? [{ from: d.location, to: rec.location }] : []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${d.code} · ${d.foodName}`}
        description={`${d.quantity} ${d.unit} from ${d.donor.name}`}
        actions={<StatusBadge status={d.status} />}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-4"><SimulatedMap markers={markers} routes={routes} className="h-80" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <Countdown safeUntil={d.safeUntil} />
            <p>Recipient: {rec?.name ?? "Not matched"}</p>
            <p>Volunteer: {vol?.name ?? "Not assigned"}</p>
            {!rec && (
              <Button onClick={() => { const r = recipients.find((x) => x.id === best?.recipientId) ?? recipients.find((x) => x.status === "accepting"); if (r) { assign(d.id, r.id); toast.success(`Matched with ${r.name}`) } }}>
                Confirm best match
              </Button>
            )}
            {rec && !vol && d.status !== "delivered" && (
              <Button onClick={() => { if (!freeVol) return toast.error("No volunteer available."); assign(d.id, rec.id, freeVol.id); toast.success(`${freeVol.name} assigned`) }}>
                Assign volunteer
              </Button>
            )}
            {vol && d.status !== "delivered" && (
              <Button onClick={() => { advance(d.id); toast.success("Status updated") }}>Advance status</Button>
            )}
            <Button variant="outline" render={<Link href="/donations" />}>Back</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
        <CardContent><ActivityFeed events={activityByDonation[d.id] ?? []} /></CardContent>
      </Card>
    </div>
  )
}
